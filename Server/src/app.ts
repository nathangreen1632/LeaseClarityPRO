import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use('/api', routes);

const clientBuildPath = path.resolve(__dirname, '../../Client/dist');
const indexHtmlPath = path.join(clientBuildPath, 'index.html');

app.use(express.static(clientBuildPath));

app.use((req, res, next) => {
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/uploads') ||
    req.path === '/favicon.ico'
  ) {
    return next();
  }
  if (fs.existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else {
    res.status(404).send('Not found');
  }
});

app.use(errorHandler);

export default app;
