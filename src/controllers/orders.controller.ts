import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { ApiResponse, Order } from '../types';
import { sendMail } from '../config/email';
import { sendPushNotification } from './notifications.controller';

export const createOrder = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const orderData: Partial<Order> = req.body;

    // ── Server-side validation: block incomplete/premature orders ──────────────
    const requiredFields: Array<[keyof typeof orderData, string]> = [
      ['items',         'Order must contain at least one item'],
      ['customerName',  'Customer name is required'],
      ['customerPhone', 'Phone number is required'],
      ['customerEmail', 'Email address is required'],
      ['address',       'Delivery address is required'],
      ['city',          'City is required'],
      ['state',         'State is required'],
      ['paymentMethod', 'Payment method is required'],
    ];

    for (const [field, message] of requiredFields) {
      const value = orderData[field];
      if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && !value.trim())) {
        res.status(400).json({ success: false, error: message });
        return;
      }
    }

    // Validate totals are positive numbers
    if (typeof orderData.total !== 'number' || orderData.total <= 0) {
      res.status(400).json({ success: false, error: 'Order total must be a positive number' });
      return;
    }

    if (orderData.couponCode) {
      const marketerRes = await pool.query(
        'SELECT commission, status FROM marketers WHERE LOWER(code) = LOWER($1) LIMIT 1',
        [orderData.couponCode]
      );
      const marketer = marketerRes.rows[0];
      if (marketer && marketer.status === 'active') {
        // Valid marketer coupon
      }
    }

    // Assign tracking number
    const trackingNumber = `HT-${new Date().getFullYear()}${String(Math.random()).slice(2, 6)}-${String(Math.random()).slice(2, 6)}`;
    const status = orderData.paymentMethod?.toLowerCase().includes('bank') ? 'pending-payment' : 'pending';

    const insertResult = await pool.query(
      `INSERT INTO orders (
        customer_name, customer_phone, alt_phone, whatsapp, customer_email,
        address, city, state, landmark, notes, items,
        subtotal, tax, shipping, discount, total,
        payment_method, coupon_code, tracking_number, status
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16,
        $17, $18, $19, $20
      ) RETURNING *`,
      [
        orderData.customerName,
        orderData.customerPhone,
        orderData.altPhone ?? null,
        orderData.whatsapp ?? null,
        orderData.customerEmail,
        orderData.address,
        orderData.city,
        orderData.state,
        orderData.landmark ?? null,
        orderData.notes ?? null,
        JSON.stringify(orderData.items),
        orderData.subtotal,
        orderData.tax ?? 0,
        orderData.shipping ?? 0,
        orderData.discount ?? 0,
        orderData.total,
        orderData.paymentMethod,
        orderData.couponCode ?? null,
        trackingNumber,
        status,
      ]
    );

    const data = insertResult.rows[0];

    // Send Confirmation Email
    sendMail({
      to: data.customer_email,
      subject: `Order Confirmed - ${data.tracking_number}`,
      html: `
        <div style="font-family: sans-serif; color: #1a2f23; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden;">
          <div style="background: #1a2f23; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Confirmed!</h1>
          </div>
          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; line-height: 1.5;">Hi ${data.customer_name},</p>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for your order. We're currently processing it and will let you know once it's on its way.</p>
            
            <div style="background: #f8f9fa; padding: 24px; border-radius: 16px; margin: 32px 0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Tracking Number</p>
              <p style="margin: 0 0 16px 0; font-family: monospace; font-size: 18px; font-bold; color: #1a2f23;">${data.tracking_number}</p>
              
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Total Amount</p>
              <p style="margin: 0; font-size: 18px; font-bold; color: #1a2f23;">₦${Number(data.total).toLocaleString()}</p>
            </div>

            <p style="font-size: 14px; color: #64748b;">You can track your order status anytime on our website using your tracking number.</p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            
            <p style="font-size: 14px; line-height: 1.5; color: #1a2f23;">
              Stay safe,<br />
              <strong>The Haifly Trap Team</strong>
            </p>
          </div>
        </div>
      `
    }).catch(console.error);

    // Send Admin Alert Email
    const adminEmail = 'amosjonathan310@gmail.com';
    sendMail({
      to: adminEmail,
      subject: `🚨 New Order Alert - ${data.tracking_number}`,
      html: `
        <div style="font-family: sans-serif; color: #1a2f23; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden;">
          <div style="background: #d4a017; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Order Received!</h1>
          </div>
          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; line-height: 1.5;"><strong>Customer:</strong> ${data.customer_name}</p>
            <p style="font-size: 16px; line-height: 1.5;"><strong>Phone:</strong> ${data.customer_phone}</p>
            <p style="font-size: 16px; line-height: 1.5;"><strong>Location:</strong> ${data.address}, ${data.city}, ${data.state}</p>
            <p style="font-size: 16px; line-height: 1.5;"><strong>Payment Method:</strong> ${data.payment_method}</p>
            
            <div style="background: #f8f9fa; padding: 24px; border-radius: 16px; margin: 32px 0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Total Amount</p>
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1a2f23;">₦${Number(data.total).toLocaleString()}</p>
            </div>

            <p style="font-size: 14px; color: #64748b;">Please check the Admin Dashboard for full details and to process this order.</p>
          </div>
        </div>
      `
    }).catch(console.error);

    res.status(201).json({ success: true, data });

    // Send Push Notification to admin
    sendPushNotification(
      {
        title: 'New Order Received! 🚨',
        body: `Order ${data.tracking_number} for ₦${Number(data.total).toLocaleString()} from ${data.customer_name}`,
        url: '/admin'
      },
      'admin'
    ).catch(console.error);

  } catch (err) {
    next(err);
  }
};

export const trackOrder = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { trackingNumber } = req.params;

    const result = await pool.query('SELECT * FROM orders WHERE tracking_number = $1', [trackingNumber]);
    const data = result.rows[0];

    if (!data) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    const data = result.rows[0];

    if (!data) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ success: false, error: 'Status is required' });
      return;
    }

    // Role check: Admin or Handler
    const role = req.user?.role;
    if (role !== 'admin' && role !== 'handler') {
      res.status(403).json({ success: false, error: 'Unauthorized to update order status' });
      return;
    }

    const result = await pool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    const data = result.rows[0];

    if (!data) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    // Send Dispatch Notification Email if status is in-transit
    if (status === 'in-transit' || status === 'in_transit') {
      const trackingUrl = `https://www.haiflytrap.com/track-order?id=${encodeURIComponent(data.tracking_number)}`;
      sendMail({
        to: data.customer_email,
        subject: `Your Haifly Trap Order has been Dispatched! 🚚 (${data.tracking_number})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a2f23; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; background: #ffffff;">
            <div style="background: #0f5238; padding: 40px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Your Order is On Its Way! 🚚</h1>
              <p style="color: #9fe0be; margin: 8px 0 0 0; font-size: 14px;">Tracking #: <strong>${data.tracking_number}</strong></p>
            </div>
            <div style="padding: 32px 24px;">
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Hi <strong>${data.customer_name}</strong>,</p>
              <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">Great news! Your package has been handed over to our dispatch team and is heading towards your delivery address.</p>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Delivery Details</p>
                <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Destination:</strong> ${data.shipping_address || 'Provided delivery address'}</p>
                <p style="margin: 0; font-size: 14px; color: #1e293b;"><strong>Contact Phone:</strong> ${data.customer_phone}</p>
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${trackingUrl}" style="background: #0f5238; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(15, 82, 56, 0.25);">
                  Track Delivery Live
                </a>
              </div>

              <p style="font-size: 13px; color: #64748b; text-align: center; margin: 24px 0 0 0;">
                Please ensure someone is available at the delivery location or reachable via your contact phone.
              </p>
              
              <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
              
              <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin: 0;">
                Warm regards,<br />
                <strong>The Haifly Trap Logistics Team</strong><br />
                <a href="https://www.haiflytrap.com" style="color: #0f5238; text-decoration: none;">haiflytrap.com</a>
              </p>
            </div>
          </div>
        `
      }).catch(console.error);
    }

    // Send Delivery Email if status is delivered
    if (status === 'delivered') {
      sendMail({
        to: data.customer_email,
        subject: `Your Order has been Delivered! 🎉 - ${data.tracking_number}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a2f23; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; background: #ffffff;">
            <div style="background: #0f5238; padding: 40px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">Order Delivered Successfully! 🎉</h1>
              <p style="color: #9fe0be; margin: 8px 0 0 0; font-size: 14px;">Tracking #: <strong>${data.tracking_number}</strong></p>
            </div>
            <div style="padding: 32px 24px;">
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Hi <strong>${data.customer_name}</strong>,</p>
              <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">Your package <strong>${data.tracking_number}</strong> has been marked as delivered.</p>
              
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 16px; margin: 24px 0; text-align: center;">
                <p style="margin: 0; color: #166534; font-size: 15px; font-weight: bold;">We hope you enjoy your pest-free environment!</p>
              </div>

              <div style="text-align: center; margin: 28px 0;">
                <a href="https://www.haiflytrap.com/reviews" style="background: #0f5238; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: bold; font-size: 14px; display: inline-block;">
                  Share Your Experience / Review
                </a>
              </div>

              <p style="font-size: 13px; color: #64748b; line-height: 1.5;">If you have any questions or need usage tips, our customer care team is always here for you.</p>
              
              <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
              
              <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin: 0;">
                Thank you for choosing Haifly Trap,<br />
                <strong>The Haifly Trap Team</strong><br />
                <a href="https://www.haiflytrap.com" style="color: #0f5238; text-decoration: none;">haiflytrap.com</a>
              </p>
            </div>
          </div>
        `
      }).catch(console.error);
    }

    res.status(200).json({ success: true, data });

    // Notify admins that order was updated
    sendPushNotification(
      {
        title: 'Order Status Updated',
        body: `Order ${data.tracking_number} is now ${status}`,
        url: '/admin'
      },
      'admin'
    ).catch(console.error);

  } catch (err) {
    next(err);
  }
};

export const updateOrderLogistics = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { riderName, riderPhone } = req.body;

    // Role check: Admin or Handler
    const role = req.user?.role;
    if (role !== 'admin' && role !== 'handler') {
      res.status(403).json({ success: false, error: 'Unauthorized to update order logistics' });
      return;
    }

    const result = await pool.query(
      `UPDATE orders SET rider_name = $1, rider_phone = $2 WHERE id = $3 RETURNING *`,
      [riderName, riderPhone, id]
    );
    const data = result.rows[0];

    if (!data) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const userEmail = req.user?.email;

    if (!userEmail) {
      res.status(401).json({ success: false, error: 'Authentication required: User email not found in session.' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM orders WHERE LOWER(customer_email) = LOWER($1) ORDER BY created_at DESC',
      [userEmail.trim()]
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Unexpected error in getMyOrders:', err);
    res.status(500).json({ success: false, error: 'An unexpected server error occurred.' });
  }
};

export const cleanupStaleOrders = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    // Delete orders older than 30 minutes that are still pending with no customer details
    const cutoffTime = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const result = await pool.query(
      `DELETE FROM orders
       WHERE status IN ('pending', 'pending-payment')
         AND created_at < $1
         AND (customer_name IS NULL OR customer_phone IS NULL OR address IS NULL OR customer_phone = '')
       RETURNING *`,
      [cutoffTime]
    );

    res.status(200).json({
      success: true,
      data: { deletedCount: result.rows.length, message: `Cleaned up ${result.rows.length} stale orders` }
    });
  } catch (err) {
    next(err);
  }
};
