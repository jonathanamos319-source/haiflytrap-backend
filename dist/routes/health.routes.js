"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redis_1 = require("../config/redis");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const activeVisitors = await (0, redis_1.getActiveVisitorsCount)();
    res.status(200).json({
        success: true,
        data: {
            status: 'ok',
            redis: (0, redis_1.isRedisAvailable)() ? 'connected' : 'fallback-db',
            activeVisitors,
            timestamp: new Date().toISOString(),
            version: '1.0.0',
        },
    });
});
// Lightweight public heartbeat endpoint
router.post('/heartbeat', async (req, res) => {
    const visitorId = req.body?.visitorId || req.ip || 'anon';
    await (0, redis_1.recordVisitorPing)(String(visitorId));
    res.status(200).json({ success: true });
});
// Live active visitor count endpoint
router.get('/active-visitors', async (_req, res) => {
    const count = await (0, redis_1.getActiveVisitorsCount)();
    res.status(200).json({ success: true, count });
});
exports.default = router;
//# sourceMappingURL=health.routes.js.map