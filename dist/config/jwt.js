"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_NAMES = void 0;
exports.signToken = signToken;
exports.verifyToken = verifyToken;
exports.getCookieNameForRole = getCookieNameForRole;
exports.getCookieOptions = getCookieOptions;
exports.setAuthCookie = setAuthCookie;
exports.clearAuthCookie = clearAuthCookie;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_jwt_auth_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
// ── Cookie Names ─────────────────────────────────────────────────────────────
// Distinct names allow an admin, handler, and customer session to coexist simultaneously
exports.COOKIE_NAMES = {
    admin: 'admin_token',
    handler: 'handler_token',
    customer: 'user_token',
};
function getCookieNameForRole(role) {
    if (role === 'admin')
        return exports.COOKIE_NAMES.admin;
    if (role === 'handler')
        return exports.COOKIE_NAMES.handler;
    return exports.COOKIE_NAMES.customer;
}
function getCookieOptions() {
    return {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
    };
}
function setAuthCookie(res, role, token) {
    const cookieName = getCookieNameForRole(role);
    res.cookie(cookieName, token, getCookieOptions());
}
function clearAuthCookie(res, role) {
    const options = { ...getCookieOptions(), maxAge: 0 };
    if (role) {
        res.clearCookie(getCookieNameForRole(role), options);
    }
    else {
        // Clear all auth cookies
        res.clearCookie(exports.COOKIE_NAMES.admin, options);
        res.clearCookie(exports.COOKIE_NAMES.handler, options);
        res.clearCookie(exports.COOKIE_NAMES.customer, options);
    }
}
//# sourceMappingURL=jwt.js.map