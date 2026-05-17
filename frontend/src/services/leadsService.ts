import type { ApiResponse, Lead, LeadFormData, LeadFilters } from '../types';
import api from '../lib/axios';

export const leadsApi = {
  getAll: (filters: LeadFilters) =>
    api.get<ApiResponse<Lead[]>>('/leads', { params: filters }),

  getById: (id: string) =>
    api.get<ApiResponse<Lead>>(`/leads/${id}`),

  create: (data: LeadFormData) =>
    api.post<ApiResponse<Lead>>('/leads', data),

  update: (id: string, data: Partial<LeadFormData>) =>
    api.put<ApiResponse<Lead>>(`/leads/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/leads/${id}`),

  exportCsv: (filters: Omit<LeadFilters, 'page' | 'limit'>) =>
    api.get('/leads/export/csv', {
      params: filters,
      responseType: 'blob',
    }),
};
