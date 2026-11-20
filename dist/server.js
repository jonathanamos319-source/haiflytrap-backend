"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
require("./config/redis"); // Initialize Redis connection asynchronously
const cors_2 = require("./config/cors");
const errorHandler_1 = require("./middleware/errorHandler");
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const marketers_routes_1 = __importDefault(require("./routes/marketers.routes"));
const handlers_routes_1 = __importDefault(require("./routes/handlers.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const blogs_routes_1 = __importDefault(require("./routes/blogs.routes"));
const seo_routes_1 = __importDefault(require("./routes/seo.routes"));
const notifications_routes_1 = __importDefault(require("./routes/notifications.routes"));
const app = (0, express_1.default)();
exports.app = app;
// Security Middleware
app.use((0, helmet_1.default)());
app.use(helmet_1.default.hsts({ maxAge: 31536000, includeSubDomains: true }));
// Parsing & Cookie Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(cors_2.corsOptions));
app.options('*', (0, cors_1.default)(cors_2.corsOptions));
// API Prefix
const API_PREFIX = '/api/v1';
// Register Routes
app.use(`${API_PREFIX}/auth`, auth_routes_1.default);
app.use(`${API_PREFIX}/products`, products_routes_1.default);
app.use(`${API_PREFIX}/orders`, orders_routes_1.default);
app.use(`${API_PREFIX}/marketers`, marketers_routes_1.default);
app.use(`${API_PREFIX}/handlers`, handlers_routes_1.default);
app.use(`${API_PREFIX}/admin`, admin_routes_1.default);
app.use(`${API_PREFIX}/health`, health_routes_1.default);
app.use(`${API_PREFIX}/blogs`, blogs_routes_1.default);
app.use(`${API_PREFIX}/notifications`, notifications_routes_1.default);
// Root probe handler for cPanel Passenger and uptime probes
app.get('/', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'Haifly Trap API is active' });
});
// SEO Routes (Sitemap at root)
app.use('/', seo_routes_1.default);
// Global Error Handler
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`🚀 Haifly Trap API running on port ${PORT}`);
});
exports.server = server;
exports.default = app;
//# sourceMappingURL=server.js.map