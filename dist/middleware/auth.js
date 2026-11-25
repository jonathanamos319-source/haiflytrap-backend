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
        // Strict Role Context: prioritize explicit query param, then client header hint
        const requestedRole = req.query.role?.toLowerCase() ||
            req.headers['x-auth-role']?.toLowerCase();
        let cookieToken;
        if (requestedRole === 'admin') {
            cookieToken = cookies[jwt_1.COOKIE_NAMES.admin];
        }
        else if (requestedRole === 'handler') {
            cookieToken = cookies[jwt_1.COOKIE_NAMES.handler];
        }
        else if (requestedRole === 'customer') {
            cookieToken = cookies[jwt_1.COOKIE_NAMES.customer];
        }
        else {
            // Path-based strict matching (NO cross-role fallback leakage)
            const path = req.originalUrl || req.path;
            if (path.includes('/admin')) {
                cookieToken = cookies[jwt_1.COOKIE_NAMES.admin];
            }
            else if (path.includes('/handler')) {
                cookieToken = cookies[jwt_1.COOKIE_NAMES.handler];
            }
            else {
                cookieToken = cookies[jwt_1.COOKIE_NAMES.customer];
            }
        }
        const bearerToken = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : undefined;
        if (!cookieToken && !bearerToken) {
            res.status(401).json({
                success: false,
                error: 'Authentication required. Please log in.',
            });
            return;
        }
        let payload;
        let lastError;
        // Verify role cookie first; if missing or stale/expired, fall back to Authorization Bearer header
        for (const candidate of [cookieToken, bearerToken]) {
            if (!candidate)
                continue;
            try {
                payload = (0, jwt_1.verifyToken)(candidate);
                break;
            }
            catch (err) {
                lastError = err;
            }
        }
        if (!payload) {
            res.status(401).json({
                success: false,
                error: `Invalid or expired session: ${lastError?.message || 'Token verification failed'}`,
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