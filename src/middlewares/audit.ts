import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

export interface AuditedRequest extends AuthenticatedRequest {
  auditUserId?: string;
}

export const auditMiddleware = (req: AuditedRequest, res: Response, next: NextFunction): void => {
  // Get user ID from authenticated session
  const userId = req.user?.id;

  if (userId) {
    // Store the user ID for audit purposes
    req.auditUserId = userId;

    // For POST requests (create), add created_by
    if (req.method === 'POST' && req.body) {
      req.body.created_by = userId;
    }

    // For PUT/PATCH requests (update), add updated_by
    if ((req.method === 'PUT' || req.method === 'PATCH') && req.body) {
      req.body.updated_by = userId;
    }
  }

  next();
};

export const setAuditFields = (data: any, userId?: string, isUpdate = false) => {
  if (!userId) return data;

  if (isUpdate) {
    return {
      ...data,
      updated_by: userId,
    };
  } else {
    return {
      ...data,
      created_by: userId,
    };
  }
};