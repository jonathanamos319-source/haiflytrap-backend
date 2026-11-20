import { Router, Request, Response } from 'express';
import { isRedisAvailable } from '../config/redis';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      redis: isRedisAvailable() ? 'connected' : 'fallback-db',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

export default router;
