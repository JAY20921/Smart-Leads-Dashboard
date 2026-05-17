import React from 'react';
import { cn } from '../../utils/cn';

// ─── Table Skeleton ──────────────────────────────────────────────────────
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 6,
}) => (
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i} className="th">
              <div className="skeleton h-3 w-20 rounded" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r} className="bg-white dark:bg-gray-900">
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c} className="td">
                <div className={cn('skeleton h-4 rounded', c === 0 ? 'w-28' : 'w-20')} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Card Skeleton ────────────────────────────────────────────────────────
export const CardSkeleton: React.FC = () => (
  <div className="card p-5 space-y-3">
    <div className="skeleton h-4 w-24 rounded" />
    <div className="skeleton h-8 w-16 rounded" />
    <div className="skeleton h-3 w-32 rounded" />
  </div>
);

// ─── Stats Row Skeleton ───────────────────────────────────────────────────
export const StatsRowSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// ─── Generic Skeleton block ───────────────────────────────────────────────
export const SkeletonBlock: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('skeleton rounded', className)} />
);
