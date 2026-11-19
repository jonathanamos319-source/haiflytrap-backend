"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandlerOrders = exports.deleteHandler = exports.updateHandler = exports.createHandler = exports.getHandlers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const ALLOWED_HANDLER_COLUMNS = ['name', 'phone', 'zone', 'status'];
const getHandlers = async (req, res, next) => {
    try {
        const result = await db_1.pool.query('SELECT * FROM handlers ORDER BY created_at DESC');
        res.status(200).json({ success: true, data: result.rows });
    }
    catch (err) {
        next(err);
    }
};
exports.getHandlers = getHandlers;
const createHandler = async (req, res, next) => {
    try {
        const handlerData = req.body;
        const { name, phone, zone, status } = handlerData;
        if (!name || !phone) {
            res.status(400).json({ success: false, error: 'name and phone are required' });
            return;
        }
        const dummyEmail = `${phone}@handler.haifly.com`;
        const passwordHash = await bcryptjs_1.default.hash(phone, 10);
        // 1. Create user in users table
        const userResult = await db_1.pool.query(`INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, 'handler') RETURNING id`, [dummyEmail, passwordHash, name]);
        const userId = userResult.rows[0].id;
        // 2. Insert into handlers table
        const handlerResult = await db_1.pool.query(`INSERT INTO handlers (user_id, name, phone, zone, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`, [userId, name, phone, zone ?? null, status ?? 'active']);
        res.status(201).json({ success: true, data: handlerResult.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.createHandler = createHandler;
const updateHandler = async (req, res, next) => {
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
        const result = await db_1.pool.query(`UPDATE handlers SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`, [...values, id]);
        if (!result.rows[0]) {
            res.status(404).json({ success: false, error: 'Handler not found' });
            return;
        }
        res.status(200).json({ success: true, data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.updateHandler = updateHandler;
const deleteHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        // 1. Get handler's user_id
        const fetchResult = await db_1.pool.query('SELECT user_id FROM handlers WHERE id = $1', [id]);
        const handler = fetchResult.rows[0];
        if (!handler) {
            res.status(404).json({ success: false, error: 'Handler not found' });
            return;
        }
        const userId = handler.user_id;
        // 2. Delete handler
        await db_1.pool.query('DELETE FROM handlers WHERE id = $1', [id]);
        // 3. Delete associated user (best effort)
        if (userId) {
            try {
                await db_1.pool.query('DELETE FROM users WHERE id = $1', [userId]);
            }
            catch (userErr) {
                console.error('Failed to delete user for handler:', userErr);
            }
        }
        res.status(200).json({ success: true, message: 'Handler and associated account deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteHandler = deleteHandler;
const getHandlerOrders = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db_1.pool.query('SELECT * FROM orders WHERE assigned_handler_id = $1 ORDER BY created_at DESC', [id]);
        res.status(200).json({ success: true, data: result.rows });
    }
    catch (err) {
        next(err);
    }
};
exports.getHandlerOrders = getHandlerOrders;
//# sourceMappingURL=handlers.controller.js.map