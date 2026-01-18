import dotenv from 'dotenv';

dotenv.config();

function getEnvVar(key: string, required = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
}

export const config = {
  env: getEnvVar('NODE_ENV', false) || 'development',
  port: parseInt(getEnvVar('PORT', false) || '3000', 10),
  mongodbUri: getEnvVar('MONGODB_URI'),
  payloadSecret: getEnvVar('PAYLOAD_SECRET'),
  systemApiKey: getEnvVar('SYSTEM_API_KEY'),
  serverUrl: getEnvVar('SERVER_URL', false) || 'http://localhost:3000',
} as const;
