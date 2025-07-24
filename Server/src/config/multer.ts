import multer, { Multer, StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import type { Request } from 'express';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const isProduction: boolean = process.env.NODE_ENV === 'production';
const uploadPath: string = isProduction
  ? '/app/uploads'
  : path.resolve(__dirname, '../../uploads');

const storage: StorageEngine = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ): void => {
    cb(null, uploadPath);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ): void => {
    const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

export const upload: Multer = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});
