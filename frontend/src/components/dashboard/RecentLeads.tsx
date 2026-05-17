import React from 'react';
import type { Lead } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../utils/format';
import { Clock } from 'lucide-react';

interface RecentLeadsProps {
  leads: Lead[];
}

export const RecentLeads: React.FC<RecentLeadsProps> = ({ leads }) => {
  if (!leads.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Clock className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No recent leads</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {leads.map((lead) => (
        <div key={lead._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{lead.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{lead.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Badge label={lead.status} type="status" />
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
              {formatDate(lead.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
