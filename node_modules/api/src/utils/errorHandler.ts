import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error(err);
  if (err?.status && err?.error) {
    return res.status(err.status).json(err);
  }
  return res.status(500).json({ error: { message: 'Internal server error' } });
}

