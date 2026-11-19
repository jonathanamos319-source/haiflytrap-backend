"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_1 = require("../config/jwt");
/**
 * Middleware: Verify JWT from httpOnly cookie (or Bearer Authorization header).
 * Attaches `req.user` with id, email, and role.
 */
async function authMiddleware(req, res, next) {
    try {
        const cookies = req.cookies || {};
        let token;
        // Strict Role Context: check if client explicitly requested a role context
        const requestedRole = req.headers['x-auth-role']?.toLowerCase() ||
            req.query.role?.toLowerCase();
        if (requestedRole === 'admin') {
            token = cookies[jwt_1.COOKIE_NAMES.admin];
        }
        else if (requestedRole === 'handler') {
            token = cookies[jwt_1.COOKIE_NAMES.handler];
        }
        else if (requestedRole === 'customer') {
            token = cookies[jwt_1.COOKIE_NAMES.customer];
        }
        else {
            // Path-based strict matching (NO cross-role fallback leakage)
            const path = req.originalUrl || req.path;
            if (path.includes('/admin')) {
                token = cookies[jwt_1.COOKIE_NAMES.admin];
            }
            else if (path.includes('/handler')) {
                token = cookies[jwt_1.COOKIE_NAMES.handler];
            }
            else {
                token = cookies[jwt_1.COOKIE_NAMES.customer];
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
        let payload;
        try {
            payload = (0, jwt_1.verifyToken)(token);
        }
        catch (err) {
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
    }
    catch (err) {
        console.error('authMiddleware error:', err);
        res.status(500).json({
            success: false,
            error: `Authentication service error: ${err.message}`,
        });
    }
}
//# sourceMappingURL=auth.js.map