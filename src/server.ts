import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import './config/redis'; // Initialize Redis connection asynchronously
import { corsOptions } from './config/cors';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import ordersRoutes from './routes/orders.routes';
import marketersRoutes from './routes/marketers.routes';
import handlersRoutes from './routes/handlers.routes';
import adminRoutes from './routes/admin.routes';
import healthRoutes from './routes/health.routes';
import blogsRoutes from './routes/blogs.routes';
import seoRoutes from './routes/seo.routes';
import notificationsRoutes from './routes/notifications.routes';

const app = express();

// Security Middleware
app.use(helmet());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));

// Parsing & Cookie Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// API Prefix
const API_PREFIX = '/api/v1';

// Register Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/products`, productsRoutes);
app.use(`${API_PREFIX}/orders`, ordersRoutes);
app.use(`${API_PREFIX}/marketers`, marketersRoutes);
app.use(`${API_PREFIX}/handlers`, handlersRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/blogs`, blogsRoutes);
app.use(`${API_PREFIX}/notifications`, notificationsRoutes);
// Root probe handler for cPanel Passenger and uptime probes
app.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Haifly Trap API is active' });
});

// SEO Routes (Sitemap at root)
app.use('/', seoRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Haifly Trap API running on port ${PORT}`);
});

export default app;
export { app, server };

