// Centralized application constants
export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export const LEAD_SOURCES = ['Website', 'Instagram', 'Referral'] as const;
export const USER_ROLES = ['Admin', 'SalesUser'] as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const SORT_OPTIONS = {
  LATEST: 'latest',
  OLDEST: 'oldest',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const JWT_COOKIE_NAME = 'access_token';
