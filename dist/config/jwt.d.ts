import { CookieOptions, Response } from 'express';
export interface JwtPayload {
    sub: string;
    email: string;
    role: 'customer' | 'admin' | 'handler';
    name?: string | null;
}
export declare function signToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;
export declare const COOKIE_NAMES: {
    readonly admin: "admin_token";
    readonly handler: "handler_token";
    readonly customer: "user_token";
};
export type UserRole = keyof typeof COOKIE_NAMES;
export declare function getCookieNameForRole(role: string): string;
export declare function getCookieOptions(): CookieOptions;
export declare function setAuthCookie(res: Response, role: string, token: string): void;
export declare function clearAuthCookie(res: Response, role?: string): void;
//# sourceMappingURL=jwt.d.ts.map