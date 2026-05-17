import React from 'react';
import { Search, X } from 'lucide-react';
import type { LeadFilters, LeadStatus, LeadSource } from '../../types';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../constants';
import { Input, Select } from '../ui/FormFields';
import { Button } from '../ui/Button';

interface LeadFiltersBarProps {
  rawSearch: string;
  filters: LeadFilters;
  onSearchChange: (value: string) => void;
  onFilterChange: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...LEAD_STATUSES.map((s) => ({ value: s, label: s })),
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  ...LEAD_SOURCES.map((s) => ({ value: s, label: s })),
];

const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export const LeadFiltersBar: React.FC<LeadFiltersBarProps> = ({
  rawSearch,
  filters,
  onSearchChange,
  onFilterChange,
  onReset,
}) => {
  const hasActiveFilters =
    !!rawSearch || !!filters.status || !!filters.source || filters.sort !== 'latest';

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email…"
            value={rawSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search size={16} />}
            aria-label="Search leads"
            id="lead-search"
          />
        </div>

        <div className="w-full sm:w-40">
          <Select
            options={statusOptions}
            value={filters.status ?? ''}
            onChange={(e) => onFilterChange('status', e.target.value as LeadStatus | '')}
            aria-label="Filter by status"
            id="filter-status"
          />
        </div>

        <div className="w-full sm:w-40">
          <Select
            options={sourceOptions}
            value={filters.source ?? ''}
            onChange={(e) => onFilterChange('source', e.target.value as LeadSource | '')}
            aria-label="Filter by source"
            id="filter-source"
          />
        </div>

        <div className="w-full sm:w-40">
          <Select
            options={sortOptions}
            value={filters.sort ?? 'latest'}
            onChange={(e) => onFilterChange('sort', e.target.value as 'latest' | 'oldest')}
            aria-label="Sort leads"
            id="filter-sort"
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="md"
            onClick={onReset}
            leftIcon={<X size={14} />}
            aria-label="Reset filters"
            title="Reset all filters"
            className="flex-shrink-0"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
