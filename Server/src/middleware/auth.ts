import { NextFunction, Request, Response } from 'express';
import {JwtVerifyResult, verifyJwt} from '../config/jwt.js';

export interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void | Response => {
  const authHeader: string | undefined = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token: string = authHeader.split(' ')[1];
  const payload: JwtVerifyResult = verifyJwt(token);

  if ('error' in payload) {
    return res.status(401).json({ error: payload.message });
  }

  req.user = payload;
  return next();
};
