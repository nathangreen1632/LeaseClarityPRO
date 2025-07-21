import multer, {Multer, StorageEngine} from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const storage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb): void => {
    cb(null, path.resolve(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb): void => {
    const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

export const upload: Multer = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb): void => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});
