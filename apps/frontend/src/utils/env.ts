// Environment configuration from next.config.ts
const envConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001',
  env: process.env.NODE_ENV || 'development'
};

export const getApiUrl = (): string => {
  return envConfig.apiUrl;
};

export const getEnv = (): string => {
  return envConfig.env;
};

export const getFrontendUrl = (): string => {
  return envConfig.frontendUrl;
};
