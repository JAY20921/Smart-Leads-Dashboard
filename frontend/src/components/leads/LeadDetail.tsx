import React from 'react';
import type { Lead } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDateTime } from '../../utils/format';
import { Mail, Phone, Building2, Calendar, Tag, Activity } from 'lucide-react';

interface LeadDetailProps {
  lead: Lead;
}

const Row: React.FC<{ icon: React.ReactNode; label: string; value?: string; children?: React.ReactNode }> = ({
  icon, label, value, children,
}) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 text-gray-400 flex-shrink-0">{icon}</span>
    <div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      {children ?? (
        <p className="text-sm text-gray-900 dark:text-gray-100">{value ?? '—'}</p>
      )}
    </div>
  </div>
);

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead }) => (
  <div className="space-y-4">
    <div className="pb-4 border-b border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge label={lead.status} type="status" />
        <Badge label={lead.source} type="source" />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Row icon={<Mail size={16} />} label="Email" value={lead.email} />
      <Row icon={<Phone size={16} />} label="Phone" value={lead.phone} />
      <Row icon={<Building2 size={16} />} label="Company" value={lead.company} />
      <Row icon={<Calendar size={16} />} label="Created" value={formatDateTime(lead.createdAt)} />
      <Row icon={<Activity size={16} />} label="Last Updated" value={formatDateTime(lead.updatedAt)} />
    </div>

    {lead.notes && (
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Tag size={14} className="text-gray-400" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Notes</p>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 leading-relaxed">
          {lead.notes}
        </p>
      </div>
    )}
  </div>
);
