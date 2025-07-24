import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { logger } from '../config/logger.js';
import { ValidationError } from 'sequelize';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ error: 'File must be under 10MB.' });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof Error && err.message.includes('Only PDF files are allowed')) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({ error: 'Database validation error', details: err.errors });
    return;
  }

  if (err?.error && typeof err.error === 'string') {
    res.status(502).json({ error: err.error, details: err.details ?? null });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
};
