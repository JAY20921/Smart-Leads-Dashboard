import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { LeadFilters, LeadFormData } from '../types';
import { leadsApi } from '../services/leadsService';
import { DEFAULT_LIMIT } from '../constants';
import toast from 'react-hot-toast';
import axios from 'axios';

const LEADS_KEY = 'leads';

// ─── Main hook: fetch paginated + filtered leads ───────────────────────────
export const useLeads = (filters: LeadFilters) => {
  return useQuery({
    queryKey: [LEADS_KEY, filters],
    queryFn: async () => {
      const res = await leadsApi.getAll(filters);
      return res.data;
    },
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
};

// ─── Single lead ────────────────────────────────────────────────────────────
export const useLead = (id: string | null) => {
  return useQuery({
    queryKey: [LEADS_KEY, id],
    queryFn: async () => {
      const res = await leadsApi.getById(id!);
      return res.data.data!;
    },
    enabled: !!id,
  });
};

// ─── Create lead ────────────────────────────────────────────────────────────
export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LeadFormData) => leadsApi.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      toast.success('Lead created successfully!');
    },
    onError: (err: unknown) => {
      toast.error(extractApiError(err));
    },
  });
};

// ─── Update lead ────────────────────────────────────────────────────────────
export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormData> }) =>
      leadsApi.update(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      toast.success('Lead updated successfully!');
    },
    onError: (err: unknown) => {
      toast.error(extractApiError(err));
    },
  });
};

// ─── Delete lead ────────────────────────────────────────────────────────────
export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      toast.success('Lead deleted.');
    },
    onError: (err: unknown) => {
      toast.error(extractApiError(err));
    },
  });
};

// ─── CSV export ─────────────────────────────────────────────────────────────
export const useExportCsv = () => {
  return useMutation({
    mutationFn: async (filters: Omit<LeadFilters, 'page' | 'limit'>) => {
      const res = await leadsApi.exportCsv(filters);
      const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-leads-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => toast.success('CSV exported!'),
    onError: () => toast.error('Export failed. Try again.'),
  });
};

// ─── Debounced search ───────────────────────────────────────────────────────
export const useDebounce = <T,>(value: T, delay = 400): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

// ─── Lead filters state ─────────────────────────────────────────────────────
const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  limit: DEFAULT_LIMIT,
  search: '',
  status: '',
  source: '',
  sort: 'latest',
};

export const useLeadFilters = () => {
  const [rawSearch, setRawSearch] = useState('');
  const [filters, setFilters]     = useState<LeadFilters>(DEFAULT_FILTERS);
  const debouncedSearch           = useDebounce(rawSearch, 400);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const setFilter = useCallback(<K extends keyof LeadFilters>(key: K, val: LeadFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: val, page: key !== 'page' ? 1 : (val as number) }));
  }, []);

  const resetFilters = useCallback(() => {
    setRawSearch('');
    setFilters(DEFAULT_FILTERS);
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return { filters, rawSearch, setRawSearch, setFilter, resetFilters, setPage };
};

// ─── Error extractor ────────────────────────────────────────────────────────
const extractApiError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
};
