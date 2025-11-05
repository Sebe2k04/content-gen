import 'dotenv/config';

interface EnvVars {
  // Server
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  LOG_LEVEL?: string;
  
  // Database
  DATABASE_URL: string;
  
  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

const requiredEnvVars = [
  'NODE_ENV',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'PORT'
];

const missingVars = requiredEnvVars.filter(name => !process.env[name]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
    'Please check your .env file and ensure all required variables are set.'
  );
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

export const env: EnvVars = {
  // Server
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  PORT: Number(process.env.PORT) || 4000,
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
};

// Log environment for debugging
if (env.NODE_ENV === 'development') {
  console.log('Environment variables loaded:', {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    DATABASE_URL: env.DATABASE_URL ? '***' : 'Not set',
    JWT_SECRET: env.JWT_SECRET ? '***' : 'Not set',
    JWT_EXPIRES_IN: env.JWT_EXPIRES_IN
  });
}
