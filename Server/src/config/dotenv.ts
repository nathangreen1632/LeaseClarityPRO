import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.RENDER === undefined) {
  const result = dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
  });

  if (result.error) {
    // eslint-disable-next-line no-console
    console.error('FATAL: Failed to load .env file:', result.error);
    process.exit(1);
  }
}

const REQUIRED_ENV = [
  'DATABASE_URL',
  'JWT_SECRET',
  'OPENAI_API_KEY',
];

const missingVars = REQUIRED_ENV.filter((v) => !process.env[v]);
if (missingVars.length) {
  // eslint-disable-next-line no-console
  console.error(
    `FATAL: Missing required environment variables: ${missingVars.join(', ')}`
  );
  process.exit(1);
}
