import React from 'react';
import { STATUS_COLORS, SOURCE_COLORS } from '../../constants';
import { cn } from '../../utils/cn';

interface BadgeProps {
  label: string;
  type?: 'status' | 'source' | 'role' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, type = 'default', className }) => {
  let colorClass = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

  if (type === 'status') {
    colorClass = STATUS_COLORS[label] ?? colorClass;
  } else if (type === 'source') {
    colorClass = SOURCE_COLORS[label] ?? colorClass;
  } else if (type === 'role') {
    colorClass =
      label === 'Admin'
        ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }

  return (
    <span className={cn('badge', colorClass, className)}>
      {label}
    </span>
  );
};
