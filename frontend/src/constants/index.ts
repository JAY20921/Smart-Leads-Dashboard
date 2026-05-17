// ─── Lead ──────────────────────────────────────────────────────────────────
export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export const LEAD_SOURCES = ['Website', 'Instagram', 'Referral'] as const;
export const SORT_OPTIONS = ['latest', 'oldest'] as const;
export const DEFAULT_LIMIT = 10;

// ─── Roles ─────────────────────────────────────────────────────────────────
export const USER_ROLES = ['Admin', 'SalesUser'] as const;

// ─── API ───────────────────────────────────────────────────────────────────
export const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ─── Status badge colours ─────────────────────────────────────────────────
export const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-100  text-blue-700  dark:bg-blue-900/40  dark:text-blue-300',
  Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  Qualified: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Lost: 'bg-red-100   text-red-700   dark:bg-red-900/40   dark:text-red-300',
};

export const SOURCE_COLORS: Record<string, string> = {
  Website: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Instagram: 'bg-pink-100   text-pink-700   dark:bg-pink-900/40   dark:text-pink-300',
  Referral: 'bg-teal-100   text-teal-700   dark:bg-teal-900/40   dark:text-teal-300',
};
