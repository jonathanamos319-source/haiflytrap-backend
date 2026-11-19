"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://haiflytrapng.com',
    'https://www.haiflytrapng.com',
    'https://haiflytrap-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
].filter(Boolean);
exports.corsOptions = {
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.some((allowed) => origin.startsWith(allowed)) ||
            origin.endsWith('.vercel.app')) {
            callback(null, true);
        }
        else {
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
//# sourceMappingURL=cors.js.map