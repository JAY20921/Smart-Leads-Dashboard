import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendError } from '../utils/errorHandler';
import { HTTP_STATUS } from '../constants';

// Runs after express-validator chains; short-circuits if there are errors
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted: Record<string, string>[] = errors.array().map((e) => ({
      field: e.type === 'field' ? (e as { path: string }).path : 'unknown',
      message: e.msg as string,
    }));
    sendError(res, 'Validation failed', HTTP_STATUS.BAD_REQUEST, formatted);
    return;
  }
  next();
};
