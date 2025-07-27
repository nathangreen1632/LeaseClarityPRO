import express, { Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import helmet from 'helmet';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const app: Express = express();

app.disable('x-powered-by');

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://www.google.com', 'https://www.gstatic.com'],
      objectSrc: ["'none'"],
      frameSrc: ['https://www.google.com', 'https://www.gstatic.com'],
      connectSrc: ["'self'", 'https://www.google.com'],
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use('/api', routes);

const clientBuildPath: string = path.resolve(__dirname, '../../Client/dist');
const indexHtmlPath: string = path.join(clientBuildPath, 'index.html');

app.use(express.static(clientBuildPath));

app.use((req, res, next): void => {
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
