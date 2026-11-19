import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { ApiResponse } from '../types';

const ALLOWED_MARKETER_COLUMNS = ['name', 'phone', 'code', 'commission', 'status'];

export const getMarketers = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT * FROM marketers ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

export const createMarketer = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { name, phone, code, commission, status } = req.body;

    if (!name || !code) {
      res.status(400).json({ success: false, error: 'name and code are required' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO marketers (name, phone, code, commission, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, phone ?? null, code, commission ?? 0, status ?? 'active']
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateMarketer = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const keys = Object.keys(updates).filter(k => ALLOWED_MARKETER_COLUMNS.includes(k));
    if (keys.length === 0) {
      res.status(400).json({ success: false, error: 'No valid update fields provided' });
      return;
    }

    const values = keys.map(k => updates[k]);
    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE marketers SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (!result.rows[0]) {
      res.status(404).json({ success: false, error: 'Marketer not found' });
      return;
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const deleteMarketer = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM marketers WHERE id = $1', [id]);
    res.status(200).json({ success: true, message: 'Marketer deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const validateCoupon = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { code } = req.params;

    if (!code) {
      res.status(400).json({ success: false, error: 'Coupon code is required' });
      return;
    }

    const result = await pool.query(
      `SELECT name, commission, status FROM marketers WHERE LOWER(code) = LOWER($1) LIMIT 1`,
      [code]
    );

    const data = result.rows[0];

    if (!data || data.status !== 'active') {
      res.status(404).json({ success: false, error: 'Invalid or inactive coupon code' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        valid: true,
        code: code.toUpperCase(),
        marketerName: data.name,
        discountPercent: data.commission,
      },
    });
  } catch (err) {
    next(err);
  }
};
