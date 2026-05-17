import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Download } from 'lucide-react';
import {
  useLeads,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useExportCsv,
  useLeadFilters,
} from '../../hooks/useLeads';
import { Topbar } from '../../components/layout/Topbar';
import { LeadTable } from '../../components/leads/LeadTable';
import { LeadFiltersBar } from '../../components/leads/LeadFiltersBar';
import { LeadForm } from '../../components/leads/LeadForm';
import { LeadDetail } from '../../components/leads/LeadDetail';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../../components/ui/States';
import type { Lead, LeadFormData } from '../../types';

type ModalMode = 'create' | 'edit' | 'view' | null;

export const LeadsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalMode,     setModalMode]   = useState<ModalMode>(null);
  const [selectedLead,  setSelectedLead] = useState<Lead | null>(null);
  const [deleteTarget,  setDeleteTarget] = useState<Lead | null>(null);

  const { filters, rawSearch, setRawSearch, setFilter, resetFilters, setPage } = useLeadFilters();

  // Auto-open create modal if ?create=1 in URL
  useEffect(() => {
    if (searchParams.get('create') === '1') {
      setModalMode('create');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data, isLoading, isError, refetch } = useLeads(filters);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();
  const exportMutation = useExportCsv();

  const leads    = data?.data ?? [];
  const meta     = data?.meta;
  const hasFilters = !!rawSearch || !!filters.status || !!filters.source;

  const closeModal = () => { setModalMode(null); setSelectedLead(null); };

  const handleCreate = async (formData: LeadFormData) => {
    await createMutation.mutateAsync(formData);
    closeModal();
  };

  const handleUpdate = async (formData: LeadFormData) => {
    if (!selectedLead) return;
    await updateMutation.mutateAsync({ id: selectedLead._id, data: formData });
    closeModal();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget._id);
    setDeleteTarget(null);
  };

  const handleExport = () => {
    exportMutation.mutate({
      search: filters.search,
      status: filters.status,
      source: filters.source,
      sort:   filters.sort,
    });
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Topbar
        title="Leads"
        subtitle={meta ? `${meta.total} total leads` : undefined}
      />

      <div className="px-6 py-6 lg:px-8 space-y-4">
        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">All Leads</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleExport}
              isLoading={exportMutation.isPending}
              leftIcon={<Download size={15} />}
              id="export-csv-btn"
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setModalMode('create')}
              leftIcon={<Plus size={15} />}
              id="create-lead-btn"
            >
              New Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <LeadFiltersBar
          rawSearch={rawSearch}
          filters={filters}
          onSearchChange={setRawSearch}
          onFilterChange={setFilter}
          onReset={resetFilters}
        />

        {/* Content */}
        {isLoading ? (
          <TableSkeleton rows={10} cols={7} />
        ) : isError ? (
          <div className="card p-8">
            <ErrorState message="Failed to load leads." onRetry={() => void refetch()} />
          </div>
        ) : leads.length === 0 ? (
          <div className="card p-8">
            <EmptyState
              isFiltered={hasFilters}
              action={
                !hasFilters ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setModalMode('create')}
                    leftIcon={<Plus size={14} />}
                  >
                    Create First Lead
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <LeadTable
              leads={leads}
              onView={(l) => { setSelectedLead(l); setModalMode('view'); }}
              onEdit={(l) => { setSelectedLead(l); setModalMode('edit'); }}
              onDelete={(l) => setDeleteTarget(l)}
            />
            {meta && meta.totalPages > 1 && (
              <div className="px-4 border-t border-gray-100 dark:border-gray-800">
                <Pagination meta={meta} onPageChange={setPage} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}

      {/* Create */}
      <Modal isOpen={modalMode === 'create'} onClose={closeModal} title="Add New Lead" size="lg">
        <LeadForm
          onSubmit={handleCreate}
          onCancel={closeModal}
          isLoading={createMutation.isPending}
          submitLabel="Create Lead"
        />
      </Modal>

      {/* Edit */}
      <Modal isOpen={modalMode === 'edit'} onClose={closeModal} title="Edit Lead" size="lg">
        <LeadForm
          defaultValues={selectedLead ?? undefined}
          onSubmit={handleUpdate}
          onCancel={closeModal}
          isLoading={updateMutation.isPending}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* View detail */}
      <Modal
        isOpen={modalMode === 'view'}
        onClose={closeModal}
        title="Lead Details"
        size="md"
        footer={
          <Button variant="secondary" size="sm" onClick={closeModal}>Close</Button>
        }
      >
        {selectedLead && <LeadDetail lead={selectedLead} />}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
