import { LEAD_STATUSES, LEAD_SOURCES, USER_ROLES } from '../constants';

// ─── Enums ────────────────────────────────────────────────────────────────────
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];
export type UserRole = (typeof USER_ROLES)[number];

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: Record<string, string>[];
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ─── Lead Query ───────────────────────────────────────────────────────────────
export interface LeadQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  sort?: 'latest' | 'oldest';
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ─── Lead Input ───────────────────────────────────────────────────────────────
export interface CreateLeadInput {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {}
