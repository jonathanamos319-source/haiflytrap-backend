import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db';
import { ApiResponse } from '../types';

const ALLOWED_HANDLER_COLUMNS = ['name', 'phone', 'zone', 'status'];

export const getHandlers = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT * FROM handlers ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

export const createHandler = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const handlerData = req.body;
    const { name, phone, zone, status } = handlerData;

    if (!name || !phone) {
      res.status(400).json({ success: false, error: 'name and phone are required' });
      return;
    }

    const dummyEmail = `${phone}@handler.haifly.com`;
    const passwordHash = await bcrypt.hash(phone, 10);

    // 1. Create user in users table
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, 'handler') RETURNING id`,
      [dummyEmail, passwordHash, name]
    );
    const userId = userResult.rows[0].id;

    // 2. Insert into handlers table
    const handlerResult = await pool.query(
      `INSERT INTO handlers (user_id, name, phone, zone, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, name, phone, zone ?? null, status ?? 'active']
    );

    res.status(201).json({ success: true, data: handlerResult.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateHandler = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const keys = Object.keys(updates).filter(k => ALLOWED_HANDLER_COLUMNS.includes(k));
    if (keys.length === 0) {
      res.status(400).json({ success: false, error: 'No valid update fields provided' });
      return;
    }

    const values = keys.map(k => updates[k]);
    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE handlers SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (!result.rows[0]) {
      res.status(404).json({ success: false, error: 'Handler not found' });
      return;
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const deleteHandler = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;

    // 1. Get handler's user_id
    const fetchResult = await pool.query('SELECT user_id FROM handlers WHERE id = $1', [id]);
    const handler = fetchResult.rows[0];

    if (!handler) {
      res.status(404).json({ success: false, error: 'Handler not found' });
      return;
    }

    const userId = handler.user_id;

    // 2. Delete handler
    await pool.query('DELETE FROM handlers WHERE id = $1', [id]);

    // 3. Delete associated user (best effort)
    if (userId) {
      try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
      } catch (userErr) {
        console.error('Failed to delete user for handler:', userErr);
      }
    }

    res.status(200).json({ success: true, message: 'Handler and associated account deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getHandlerOrders = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM orders WHERE assigned_handler_id = $1 ORDER BY created_at DESC',
      [id]
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};
