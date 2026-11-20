import { Router, Request, Response } from 'express';
import { isRedisAvailable, recordVisitorPing, getActiveVisitorsCount } from '../config/redis';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const activeVisitors = await getActiveVisitorsCount();
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      redis: isRedisAvailable() ? 'connected' : 'fallback-db',
      activeVisitors,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

// Lightweight public heartbeat endpoint
router.post('/heartbeat', async (req: Request, res: Response) => {
  const visitorId = req.body?.visitorId || req.ip || 'anon';
  await recordVisitorPing(String(visitorId));
  res.status(200).json({ success: true });
});

// Live active visitor count endpoint
router.get('/active-visitors', async (_req: Request, res: Response) => {
  const count = await getActiveVisitorsCount();
  res.status(200).json({ success: true, count });
});

export default router;
