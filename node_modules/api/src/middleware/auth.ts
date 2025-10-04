import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
import { Roles, UserRole } from '../types/roles';

export interface AuthPayload {
  id: number;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return res.status(401).json({ error: { message: 'Unauthorized' } });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: { message: 'Invalid token' } });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: { message: 'Unauthorized' } });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: { message: 'Forbidden' } });
    return next();
  };
}

export const AdminOnly = requireRole(Roles.ADMIN);
export const OwnerOnly = requireRole(Roles.OWNER);

