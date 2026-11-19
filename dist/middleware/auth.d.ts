import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
/**
 * Middleware: Verify JWT from httpOnly cookie (or Bearer Authorization header).
 * Attaches `req.user` with id, email, and role.
 */
export declare function authMiddleware(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map