import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import type { Lead } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  onView:   (lead: Lead) => void;
  onEdit:   (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onView, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isAdmin  = user?.role === 'Admin';

  return (
    <div className="table-wrapper">
      <table className="table" aria-label="Leads table">
        <thead>
          <tr>
            <th className="th">Name</th>
            <th className="th">Email</th>
            <th className="th hidden sm:table-cell">Company</th>
            <th className="th">Status</th>
            <th className="th hidden md:table-cell">Source</th>
            <th className="th hidden lg:table-cell">Created</th>
            <th className="th text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {leads.map((lead) => (
            <tr key={lead._id} className="tr animate-in">
              <td className="td font-medium text-gray-900 dark:text-white max-w-[140px] truncate">
                {lead.name}
              </td>
              <td className="td text-gray-500 dark:text-gray-400 max-w-[160px] truncate">
                {lead.email}
              </td>
              <td className="td hidden sm:table-cell text-gray-500 dark:text-gray-400">
                {lead.company ?? '—'}
              </td>
              <td className="td">
                <Badge label={lead.status} type="status" />
              </td>
              <td className="td hidden md:table-cell">
                <Badge label={lead.source} type="source" />
              </td>
              <td className="td hidden lg:table-cell text-gray-500 dark:text-gray-400 text-xs">
                {formatDate(lead.createdAt)}
              </td>
              <td className="td">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(lead)}
                    aria-label={`View ${lead.name}`}
                    title="View"
                  >
                    <Eye size={15} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(lead)}
                    aria-label={`Edit ${lead.name}`}
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(lead)}
                      aria-label={`Delete ${lead.name}`}
                      title="Delete"
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={15} />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
