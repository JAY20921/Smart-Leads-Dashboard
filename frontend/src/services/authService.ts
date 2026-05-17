import type { ApiResponse, User, LoginFormData, RegisterFormData } from '../types';
import api from '../lib/axios';

interface AuthPayload {
  user: User;
  token: string;
}

export const authApi = {
  login: (data: LoginFormData) =>
    api.post<ApiResponse<AuthPayload>>('/auth/login', data),

  register: (data: RegisterFormData) =>
    api.post<ApiResponse<AuthPayload>>('/auth/register', data),

  me: () =>
    api.get<ApiResponse<User>>('/auth/me'),
};
