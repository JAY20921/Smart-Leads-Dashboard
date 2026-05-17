import { LEAD_STATUSES, LEAD_SOURCES, USER_ROLES } from '../constants';

// ─── Enums ─────────────────────────────────────────────────────────────────
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];
export type UserRole   = (typeof USER_ROLES)[number];

// ─── Models ────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  phone?: string;
  company?: string;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Pagination ────────────────────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── API Response ──────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: { field: string; message: string }[];
}

// ─── Lead Query Params ─────────────────────────────────────────────────────
export interface LeadFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  sort?: 'latest' | 'oldest';
}

// ─── Form Inputs ───────────────────────────────────────────────────────────
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  phone?: string;
  company?: string;
  notes?: string;
}

// ─── Auth Context ──────────────────────────────────────────────────────────
export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}
