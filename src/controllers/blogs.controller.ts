import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { ApiResponse } from '../types';
import { getJsonCache, setJsonCache, invalidateBlogCache } from '../config/redis';

const ALLOWED_BLOG_COLUMNS = ['title', 'slug', 'content', 'excerpt', 'image_url', 'category', 'tags'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const getBlogs = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const cacheKey = 'cache:blogs:all';
    const cached = await getJsonCache<any[]>(cacheKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.status(200).json({ success: true, data: cached });
      return;
    }

    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    setJsonCache(cacheKey, result.rows, 3600).catch(() => {});

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Internal Error (getBlogs):', err);
    next(err);
  }
};

export const getBlogById = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);

    if (!result.rows[0]) {
      res.status(404).json({ success: false, error: 'Blog post not found' });
      return;
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const createBlog = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const blogData = req.body;
    const { title, content, excerpt, image_url, category, tags } = blogData;

    if (!title) {
      res.status(400).json({ success: false, error: 'Title is required' });
      return;
    }

    const slug = blogData.slug ? slugify(blogData.slug) : slugify(title);

    const result = await pool.query(
      `INSERT INTO blogs (title, slug, content, excerpt, image_url, category, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, slug, content ?? null, excerpt ?? null, image_url ?? null, category ?? null, tags ? JSON.stringify(tags) : null]
    );

    await invalidateBlogCache();
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateBlog = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const keys = Object.keys(updates).filter(k => ALLOWED_BLOG_COLUMNS.includes(k));
    if (keys.length === 0) {
      res.status(400).json({ success: false, error: 'No valid update fields provided' });
      return;
    }

    const values = keys.map(k => {
      if (k === 'tags' && Array.isArray(updates[k])) {
        return JSON.stringify(updates[k]);
      }
      if (k === 'slug' && updates[k]) {
        return slugify(updates[k]);
      }
      return updates[k];
    });

    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE blogs SET ${setClauses}, updated_at = now() WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (!result.rows[0]) {
      res.status(404).json({ success: false, error: 'Blog post not found' });
      return;
    }

    await invalidateBlogCache();
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const deleteBlog = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
    await invalidateBlogCache();
    res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (err) {
    next(err);
  }
};
