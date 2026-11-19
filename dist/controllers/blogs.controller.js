"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogById = exports.getBlogs = void 0;
const db_1 = require("../config/db");
const ALLOWED_BLOG_COLUMNS = ['title', 'slug', 'content', 'excerpt', 'image_url', 'category', 'tags'];
function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
const getBlogs = async (req, res, next) => {
    try {
        const result = await db_1.pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
        res.status(200).json({ success: true, data: result.rows });
    }
    catch (err) {
        console.error('Internal Error (getBlogs):', err);
        next(err);
    }
};
exports.getBlogs = getBlogs;
const getBlogById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db_1.pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
        if (!result.rows[0]) {
            res.status(404).json({ success: false, error: 'Blog post not found' });
            return;
        }
        res.status(200).json({ success: true, data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.getBlogById = getBlogById;
const createBlog = async (req, res, next) => {
    try {
        const blogData = req.body;
        const { title, content, excerpt, image_url, category, tags } = blogData;
        if (!title) {
            res.status(400).json({ success: false, error: 'Title is required' });
            return;
        }
        const slug = blogData.slug ? slugify(blogData.slug) : slugify(title);
        const result = await db_1.pool.query(`INSERT INTO blogs (title, slug, content, excerpt, image_url, category, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`, [title, slug, content ?? null, excerpt ?? null, image_url ?? null, category ?? null, tags ? JSON.stringify(tags) : null]);
        res.status(201).json({ success: true, data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.createBlog = createBlog;
const updateBlog = async (req, res, next) => {
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
        const result = await db_1.pool.query(`UPDATE blogs SET ${setClauses}, updated_at = now() WHERE id = $${keys.length + 1} RETURNING *`, [...values, id]);
        if (!result.rows[0]) {
            res.status(404).json({ success: false, error: 'Blog post not found' });
            return;
        }
        res.status(200).json({ success: true, data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db_1.pool.query('DELETE FROM blogs WHERE id = $1', [id]);
        res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteBlog = deleteBlog;
//# sourceMappingURL=blogs.controller.js.map