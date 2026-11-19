import jwt from 'jsonwebtoken';
import { CookieOptions, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_jwt_auth_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  sub: string;    // user id (UUID)
  email: string;
  role: 'customer' | 'admin' | 'handler';
  name?: string | null;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

// ── Cookie Names ─────────────────────────────────────────────────────────────
// Distinct names allow an admin, handler, and customer session to coexist simultaneously
export const COOKIE_NAMES = {
  admin: 'admin_token',
  handler: 'handler_token',
  customer: 'user_token',
} as const;

export type UserRole = keyof typeof COOKIE_NAMES;

export function getCookieNameForRole(role: string): string {
  if (role === 'admin') return COOKIE_NAMES.admin;
  if (role === 'handler') return COOKIE_NAMES.handler;
  return COOKIE_NAMES.customer;
}

export function getCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
}

export function setAuthCookie(res: Response, role: string, token: string) {
  const cookieName = getCookieNameForRole(role);
  res.cookie(cookieName, token, getCookieOptions());
}

export function clearAuthCookie(res: Response, role?: string) {
  const options = { ...getCookieOptions(), maxAge: 0 };
  if (role) {
    res.clearCookie(getCookieNameForRole(role), options);
  } else {
    // Clear all auth cookies
    res.clearCookie(COOKIE_NAMES.admin, options);
    res.clearCookie(COOKIE_NAMES.handler, options);
    res.clearCookie(COOKIE_NAMES.customer, options);
  }
}

