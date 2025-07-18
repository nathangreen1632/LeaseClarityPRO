import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_ENV: string[] = [
  'DATABASE_URL',
  'JWT_SECRET',
  'OPENAI_API_KEY',
];

const missingVars: string[] = REQUIRED_ENV.filter((v): boolean => !process.env[v]);
if (missingVars.length) {
  if (process.env.RENDER === undefined) {
    // eslint-disable-next-line no-console
    console.error(
      `FATAL: Missing required environment variables: ${missingVars.join(', ')}`
    );
    process.exit(1);
  } else {
    console.warn(
      `WARNING: Missing environment variables (should be set in Render dashboard): ${missingVars.join(', ')}`
    );
  }
}
