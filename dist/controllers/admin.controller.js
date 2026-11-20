"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.deleteImage = exports.uploadImage = void 0;
const db_1 = require("../config/db");
const uploadImage_1 = require("../middleware/uploadImage");
const redis_1 = require("../config/redis");
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, error: 'No image file provided' });
            return;
        }
        // Upload buffer directly to Cloudinary
        const result = await (0, uploadImage_1.uploadToCloudinary)(req.file.buffer, 'haifly-trap-products');
        res.status(200).json({
            success: true,
            data: {
                url: result.url,
                publicId: result.publicId,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.uploadImage = uploadImage;
const deleteImage = async (req, res, next) => {
    try {
        const { publicId } = req.body;
        if (!publicId) {
            res.status(400).json({ success: false, error: 'publicId is required' });
            return;
        }
        await (0, uploadImage_1.deleteFromCloudinary)(publicId);
        res.status(200).json({ success: true, message: 'Image deleted from Cloudinary' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteImage = deleteImage;
const getDashboardStats = async (req, res, next) => {
    try {
        const [ordersRes, productsRes, marketersRes, activeVisitors] = await Promise.all([
            db_1.pool.query('SELECT COUNT(*) AS count FROM orders'),
            db_1.pool.query('SELECT COUNT(*) AS count FROM products'),
            db_1.pool.query('SELECT COUNT(*) AS count FROM marketers'),
            (0, redis_1.getActiveVisitorsCount)(),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalOrders: parseInt(ordersRes.rows[0]?.count || '0', 10),
                totalProducts: parseInt(productsRes.rows[0]?.count || '0', 10),
                totalMarketers: parseInt(marketersRes.rows[0]?.count || '0', 10),
                activeVisitors,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=admin.controller.js.map