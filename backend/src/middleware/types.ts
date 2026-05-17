import { Request } from 'express';
import { JwtPayload } from '../types';

// Extends Express Request to carry authenticated user info
export interface AuthRequest extends Request {
  user?: JwtPayload;
}
