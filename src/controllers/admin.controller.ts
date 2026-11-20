import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/uploadImage';
import { getActiveVisitorsCount } from '../config/redis';
import { ApiResponse } from '../types';

export const uploadImage = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No image file provided' });
      return;
    }

    // Upload buffer directly to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'haifly-trap-products');

    res.status(200).json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteImage = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      res.status(400).json({ success: false, error: 'publicId is required' });
      return;
    }

    await deleteFromCloudinary(publicId);

    res.status(200).json({ success: true, message: 'Image deleted from Cloudinary' });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const [ordersRes, productsRes, marketersRes, activeVisitors] = await Promise.all([
      pool.query('SELECT COUNT(*) AS count FROM orders'),
      pool.query('SELECT COUNT(*) AS count FROM products'),
      pool.query('SELECT COUNT(*) AS count FROM marketers'),
      getActiveVisitorsCount(),
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
  } catch (err) {
    next(err);
  }
};
