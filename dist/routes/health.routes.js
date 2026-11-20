"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redis_1 = require("../config/redis");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: 'ok',
            redis: (0, redis_1.isRedisAvailable)() ? 'connected' : 'fallback-db',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
        },
    });
});
exports.default = router;
//# sourceMappingURL=health.routes.js.map