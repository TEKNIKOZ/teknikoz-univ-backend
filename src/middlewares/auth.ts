import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: any;
  session?: any;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    throw createError('Authentication not implemented', 401);
  } catch (error) {
    next(createError('Authentication required', 401));
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next();
};

export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }

    if (req.user.role !== role) {
      throw createError('Insufficient permissions', 403);
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');