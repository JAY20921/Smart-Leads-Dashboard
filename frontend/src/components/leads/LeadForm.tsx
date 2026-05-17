import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../constants';
import type { Lead, LeadFormData } from '../../types';
import { Input, Select, Textarea } from '../ui/FormFields';
import { Button } from '../ui/Button';

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters').max(120),
  email:   z.string().email('Invalid email address'),
  status:  z.enum(LEAD_STATUSES, { message: 'Select a status' }),
  source:  z.enum(LEAD_SOURCES,  { message: 'Select a source' }),
  phone:   z.string().max(20).optional(),
  company: z.string().max(120).optional(),
  notes:   z.string().max(1000).optional(),
});

type FormSchema = z.infer<typeof schema>;

interface LeadFormProps {
  defaultValues?: Partial<Lead>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const statusOptions = LEAD_STATUSES.map((s) => ({ value: s, label: s }));
const sourceOptions = LEAD_SOURCES.map((s)  => ({ value: s, label: s }));

export const LeadForm: React.FC<LeadFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = 'Save Lead',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:    defaultValues?.name    ?? '',
      email:   defaultValues?.email   ?? '',
      status:  defaultValues?.status  ?? 'New',
      source:  defaultValues?.source  ?? 'Website',
      phone:   defaultValues?.phone   ?? '',
      company: defaultValues?.company ?? '',
      notes:   defaultValues?.notes   ?? '',
    },
  });

  const onValid = async (data: FormSchema) => {
    const cleaned: LeadFormData = {
      name:    data.name,
      email:   data.email,
      status:  data.status,
      source:  data.source,
      phone:   data.phone   || undefined,
      company: data.company || undefined,
      notes:   data.notes   || undefined,
    };
    await onSubmit(cleaned);
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="e.g. Alice Johnson"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email *"
          type="email"
          placeholder="alice@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Status *"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />
        <Select
          label="Source *"
          options={sourceOptions}
          error={errors.source?.message}
          {...register('source')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          placeholder="+1-555-0100"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Company"
          placeholder="ACME Corp"
          error={errors.company?.message}
          {...register('company')}
        />
      </div>

      <Textarea
        label="Notes"
        placeholder="Add any additional information..."
        error={errors.notes?.message}
        {...register('notes')}
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
