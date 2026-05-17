import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import { HTTP_STATUS } from '../constants';

// Centralized success response helper
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: number = HTTP_STATUS.OK,
  meta?: ApiResponse<T>['meta']
): Response => {
  const response: ApiResponse<T> = { success: true, message, data };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

// Centralized error response helper
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors?: Record<string, string>[]
): Response => {
  const response: ApiResponse = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

// AppError for operational errors with known status codes
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
export const globalErrorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException).name === 'MongoServerError') {
    const mongoErr = err as Error & { code?: number; keyValue?: Record<string, unknown> };
    if (mongoErr.code === 11000) {
      const field = Object.keys(mongoErr.keyValue ?? {})[0] ?? 'field';
      return sendError(res, `${field} already exists`, HTTP_STATUS.CONFLICT);
    }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const validationErr = err as Error & { errors?: Record<string, { message: string }> };
    const errors = Object.values(validationErr.errors ?? {}).map((e) => ({
      message: e.message,
    }));
    return sendError(res, 'Validation failed', HTTP_STATUS.BAD_REQUEST, errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', HTTP_STATUS.UNAUTHORIZED);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired, please log in again', HTTP_STATUS.UNAUTHORIZED);
  }

  // Operational (known) errors
  if ((err as AppError).isOperational) {
    return sendError(res, err.message, (err as AppError).statusCode);
  }

  // Unexpected errors — log and return generic message
  console.error('UNEXPECTED ERROR:', err);
  return sendError(res, 'Something went wrong', HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

// Async wrapper to avoid try/catch in every controller
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
