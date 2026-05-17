import React from 'react';
import { AlertCircle, SearchX, Inbox } from 'lucide-react';
import { Button } from './Button';

// ─── Error State ─────────────────────────────────────────────────────────
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-in">
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
      <AlertCircle className="h-8 w-8 text-red-500" />
    </div>
    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
      Something went wrong
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-5">{message}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────
interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  isFiltered?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  action,
  isFiltered = false,
}) => {
  const Icon = isFiltered ? SearchX : Inbox;
  const defaultTitle   = isFiltered ? 'No results found' : 'No leads yet';
  const defaultMessage = isFiltered
    ? 'Try adjusting your search or filters.'
    : 'Create your first lead to get started.';

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
        {icon ?? <Icon className="h-8 w-8 text-gray-400" />}
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
        {title ?? defaultTitle}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-5">
        {message ?? defaultMessage}
      </p>
      {action}
    </div>
  );
};
