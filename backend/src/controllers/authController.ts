import { Response } from 'express';
import { AuthRequest } from '../middleware/types';
import { authService } from '../services/authService';
import { asyncHandler, sendSuccess } from '../utils/errorHandler';
import { HTTP_STATUS } from '../constants';
import { RegisterInput, LoginInput } from '../types';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const input: RegisterInput = {
    name: req.body.name as string,
    email: req.body.email as string,
    password: req.body.password as string,
    role: req.body.role,
  };
  const { user, token } = await authService.register(input);
  return sendSuccess(res, { user, token }, 'Registration successful', HTTP_STATUS.CREATED);
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const input: LoginInput = {
    email: req.body.email as string,
    password: req.body.password as string,
  };
  const { user, token } = await authService.login(input);
  return sendSuccess(res, { user, token }, 'Login successful');
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  // req.user is already verified by authenticate middleware
  return sendSuccess(res, req.user, 'Authenticated user');
});
