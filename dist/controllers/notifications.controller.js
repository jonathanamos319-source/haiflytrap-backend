"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = exports.broadcastNotification = exports.subscribeToNotifications = void 0;
const db_1 = require("../config/db");
const web_push_1 = __importDefault(require("web-push"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure web-push with VAPID keys
web_push_1.default.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:support@haiflytrapng.com', process.env.VAPID_PUBLIC_KEY || '', process.env.VAPID_PRIVATE_KEY || '');
const subscribeToNotifications = async (req, res) => {
    try {
        const { subscription, user_type, user_id, user_email } = req.body;
        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ error: 'Invalid subscription object' });
        }
        const { endpoint, keys } = subscription;
        const p256dh = keys?.p256dh;
        const auth = keys?.auth;
        if (!p256dh || !auth) {
            return res.status(400).json({ error: 'Subscription missing keys' });
        }
        const result = await db_1.pool.query(`INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_type, user_id, user_email, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, now())
       ON CONFLICT (endpoint) DO UPDATE SET
         p256dh = EXCLUDED.p256dh,
         auth = EXCLUDED.auth,
         user_type = EXCLUDED.user_type,
         user_id = EXCLUDED.user_id,
         user_email = EXCLUDED.user_email
       RETURNING *`, [endpoint, p256dh, auth, user_type || 'customer', user_id || null, user_email || null]);
        res.status(201).json({ message: 'Subscription saved successfully', data: result.rows });
    }
    catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ error: 'Failed to save subscription', details: error.message });
    }
};
exports.subscribeToNotifications = subscribeToNotifications;
const broadcastNotification = async (req, res) => {
    try {
        const { title, body, icon, url, user_type } = req.body;
        if (!title || !body) {
            return res.status(400).json({ error: 'Title and body are required' });
        }
        const payload = JSON.stringify({
            title,
            body,
            icon: icon || '/favicon.ico',
            url: url || '/'
        });
        let sql = 'SELECT * FROM push_subscriptions';
        const params = [];
        if (user_type) {
            sql += ' WHERE user_type = $1';
            params.push(user_type);
        }
        const result = await db_1.pool.query(sql, params);
        const subscriptions = result.rows;
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(200).json({ message: 'No subscriptions found to broadcast to.' });
        }
        const sendPromises = subscriptions.map(async (sub) => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };
            try {
                await web_push_1.default.sendNotification(pushSubscription, payload);
            }
            catch (err) {
                console.error('Error sending push notification to endpoint:', sub.endpoint, err);
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await db_1.pool.query('DELETE FROM push_subscriptions WHERE id = $1', [sub.id]).catch(() => { });
                }
            }
        });
        await Promise.allSettled(sendPromises);
        res.status(200).json({ message: `Broadcasted to ${subscriptions.length} endpoints.` });
    }
    catch (error) {
        console.error('Error broadcasting notification:', error);
        res.status(500).json({ error: 'Failed to broadcast notification', details: error.message });
    }
};
exports.broadcastNotification = broadcastNotification;
const sendPushNotification = async (payloadData, targetUserType, targetEmail) => {
    try {
        const payload = JSON.stringify({
            title: payloadData.title,
            body: payloadData.body,
            icon: payloadData.icon || '/favicon.ico',
            url: payloadData.url || '/'
        });
        let sql = 'SELECT * FROM push_subscriptions WHERE 1=1';
        const params = [];
        if (targetUserType) {
            params.push(targetUserType);
            sql += ` AND user_type = $${params.length}`;
        }
        if (targetEmail) {
            params.push(targetEmail);
            sql += ` AND user_email = $${params.length}`;
        }
        const result = await db_1.pool.query(sql, params);
        const subscriptions = result.rows;
        if (!subscriptions || subscriptions.length === 0)
            return;
        const sendPromises = subscriptions.map(async (sub) => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };
            try {
                await web_push_1.default.sendNotification(pushSubscription, payload);
            }
            catch (err) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await db_1.pool.query('DELETE FROM push_subscriptions WHERE id = $1', [sub.id]).catch(() => { });
                }
            }
        });
        await Promise.allSettled(sendPromises);
    }
    catch (error) {
        console.error('Error in sendPushNotification utility:', error);
    }
};
exports.sendPushNotification = sendPushNotification;
//# sourceMappingURL=notifications.controller.js.map