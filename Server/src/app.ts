import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// ESM polyfill for __filename and __dirname:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (dev/test only; restrict/remove in production)
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.use('/api', routes);

app.use(errorHandler);

export default app;
