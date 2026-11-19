import { Request, Response } from 'express';
import { pool } from '../config/db';
import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:support@haiflytrapng.com',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export const subscribeToNotifications = async (req: Request, res: Response) => {
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

    const result = await pool.query(
      `INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_type, user_id, user_email, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, now())
       ON CONFLICT (endpoint) DO UPDATE SET
         p256dh = EXCLUDED.p256dh,
         auth = EXCLUDED.auth,
         user_type = EXCLUDED.user_type,
         user_id = EXCLUDED.user_id,
         user_email = EXCLUDED.user_email
       RETURNING *`,
      [endpoint, p256dh, auth, user_type || 'customer', user_id || null, user_email || null]
    );

    res.status(201).json({ message: 'Subscription saved successfully', data: result.rows });
  } catch (error: any) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription', details: error.message });
  }
};

export const broadcastNotification = async (req: Request, res: Response) => {
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
    const params: any[] = [];
    if (user_type) {
      sql += ' WHERE user_type = $1';
      params.push(user_type);
    }

    const result = await pool.query(sql, params);
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
        await webpush.sendNotification(pushSubscription, payload);
      } catch (err: any) {
        console.error('Error sending push notification to endpoint:', sub.endpoint, err);
        if (err.statusCode === 410 || err.statusCode === 404) {
          await pool.query('DELETE FROM push_subscriptions WHERE id = $1', [sub.id]).catch(() => {});
        }
      }
    });

    await Promise.allSettled(sendPromises);

    res.status(200).json({ message: `Broadcasted to ${subscriptions.length} endpoints.` });
  } catch (error: any) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({ error: 'Failed to broadcast notification', details: error.message });
  }
};

export const sendPushNotification = async (
  payloadData: { title: string; body: string; icon?: string; url?: string },
  targetUserType?: string,
  targetEmail?: string
) => {
  try {
    const payload = JSON.stringify({
      title: payloadData.title,
      body: payloadData.body,
      icon: payloadData.icon || '/favicon.ico',
      url: payloadData.url || '/'
    });

    let sql = 'SELECT * FROM push_subscriptions WHERE 1=1';
    const params: any[] = [];

    if (targetUserType) {
      params.push(targetUserType);
      sql += ` AND user_type = $${params.length}`;
    }
    if (targetEmail) {
      params.push(targetEmail);
      sql += ` AND user_email = $${params.length}`;
    }

    const result = await pool.query(sql, params);
    const subscriptions = result.rows;
    if (!subscriptions || subscriptions.length === 0) return;

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };
      try {
        await webpush.sendNotification(pushSubscription, payload);
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await pool.query('DELETE FROM push_subscriptions WHERE id = $1', [sub.id]).catch(() => {});
        }
      }
    });

    await Promise.allSettled(sendPromises);
  } catch (error) {
    console.error('Error in sendPushNotification utility:', error);
  }
};
