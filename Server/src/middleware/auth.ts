import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../config/jwt.js';

export interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyJwt(token);

  if ('error' in payload) {
    // Token invalid or expired, payload.message is user-friendly
    return res.status(401).json({ error: payload.message });
  }

  req.user = payload;
  return next();
};
