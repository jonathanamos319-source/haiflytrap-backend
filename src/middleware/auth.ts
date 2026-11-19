import { Request, Response, NextFunction } from 'express';
import { verifyToken, COOKIE_NAMES, JwtPayload } from '../config/jwt';
import { ApiResponse } from '../types';

/**
 * Middleware: Verify JWT from httpOnly cookie (or Bearer Authorization header).
 * Attaches `req.user` with id, email, and role.
 */
export async function authMiddleware(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const cookies = req.cookies || {};
    let token: string | undefined;

    // Strict Role Context: check if client explicitly requested a role context
    const requestedRole = (req.headers['x-auth-role'] as string)?.toLowerCase() ||
                          (req.query.role as string)?.toLowerCase();

    if (requestedRole === 'admin') {
      token = cookies[COOKIE_NAMES.admin];
    } else if (requestedRole === 'handler') {
      token = cookies[COOKIE_NAMES.handler];
    } else if (requestedRole === 'customer') {
      token = cookies[COOKIE_NAMES.customer];
    } else {
      // Path-based strict matching (NO cross-role fallback leakage)
      const path = req.originalUrl || req.path;
      if (path.includes('/admin')) {
        token = cookies[COOKIE_NAMES.admin];
      } else if (path.includes('/handler')) {
        token = cookies[COOKIE_NAMES.handler];
      } else {
        token = cookies[COOKIE_NAMES.customer];
      }
    }

    // Fallback: check Authorization Bearer header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.',
      });
      return;
    }

    let payload: JwtPayload;
    try {
      payload = verifyToken(token);
    } catch (err: any) {
      res.status(401).json({
        success: false,
        error: `Invalid or expired session: ${err?.message || 'Token verification failed'}`,
      });
      return;
    }

    // Strict Role Validation: payload role must match requested role
    if (requestedRole && requestedRole !== payload.role) {
      res.status(403).json({
        success: false,
        error: `Access denied. Expected ${requestedRole} session but found ${payload.role}.`,
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      userMetadata: { name: payload.name },
    };

    next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    res.status(500).json({
      success: false,
      error: `Authentication service error: ${(err as Error).message}`,
    });
  }
}
