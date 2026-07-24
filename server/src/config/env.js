import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS) || 8000
};
