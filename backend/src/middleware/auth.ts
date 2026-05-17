import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from './types';
import { JwtPayload, UserRole } from '../types';
import { AppError } from '../utils/errorHandler';
import { HTTP_STATUS } from '../constants';

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Authentication token required', HTTP_STATUS.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('Authentication token required', HTTP_STATUS.UNAUTHORIZED));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');

    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    next(err); // Handled by globalErrorHandler (JsonWebTokenError, TokenExpiredError)
  }
};

// Role-based access control factory
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action',
          HTTP_STATUS.FORBIDDEN
        )
      );
    }
    next();
  };
};
