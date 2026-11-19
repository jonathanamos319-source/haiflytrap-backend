import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://haiflytrapng.com',
  'https://www.haiflytrapng.com',
  'https://haiflytrap-frontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
].filter(Boolean) as string[];

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.some((allowed) => origin.startsWith(allowed)) ||
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Auth-Role',
    'x-auth-role',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-CSRF-Token',
  ],
  exposedHeaders: ['Set-Cookie', 'X-Auth-Role'],
  maxAge: 86400,
};