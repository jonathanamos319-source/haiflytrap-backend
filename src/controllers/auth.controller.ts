import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { pool } from '../config/db';
import { signToken, setAuthCookie, clearAuthCookie, COOKIE_NAMES } from '../config/jwt';
import { sendMail } from '../config/email';
import { sendWelcomeEmailToUser } from '../scripts/sendWelcomeEmails';
import { ApiResponse } from '../types';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── In-Memory OTP Store & Rate Limiting ───────────────────────────────────────
interface OtpRecord {
  hashedCode: string;
  name?: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

const otpMap = new Map<string, OtpRecord>(); // email -> record
const emailRateLimit = new Map<string, number>(); // email -> timestamp of last request
const ipRateLimit = new Map<string, number[]>(); // ip -> timestamps of requests

const MAX_ATTEMPTS = 5;
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MIN_REQUEST_INTERVAL_MS = 60 * 1000; // 1 minute cooldown per email
const MAX_REQUESTS_PER_IP_WINDOW = 10;
const IP_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function hashOtp(code: string): string {
  return crypto.createHash('sha256').update(code.trim()).digest('hex');
}

function generate6DigitCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipRateLimit.get(ip) || []).filter(t => now - t < IP_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_IP_WINDOW) {
    return false;
  }
  timestamps.push(now);
  ipRateLimit.set(ip, timestamps);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /register
// ─────────────────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { email, password, full_name, name } = req.body;
    const displayName = full_name || name || null;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      res.status(400).json({ success: false, error: 'User with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, 'customer')
       RETURNING id, email, name, role, created_at`,
      [normalizedEmail, passwordHash, displayName]
    );

    const user = result.rows[0];

    // Fire welcome email asynchronously
    sendWelcomeEmailToUser(user).catch(err =>
      console.error('[Auth] Failed to trigger immediate welcome email:', err)
    );

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: 'customer',
      name: user.name,
    });

    setAuthCookie(res, 'customer', token);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /login
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    const user = result.rows[0];

    if (!user || !user.password_hash) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    setAuthCookie(res, user.role, token);
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /admin-login
// ─────────────────────────────────────────────────────────────────────────────
export const adminLogin = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    const user = result.rows[0];

    if (!user || !user.password_hash) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    if (user.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Access denied. Admin privileges required.' });
      return;
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: 'admin',
      name: user.name,
    });

    setAuthCookie(res, 'admin', token);
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /handler-login
// ─────────────────────────────────────────────────────────────────────────────
export const handlerLogin = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({ success: false, error: 'Phone number is required' });
      return;
    }

    const dummyEmail = `${phone.trim()}@handler.haifly.com`;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [dummyEmail]);
    const user = result.rows[0];

    if (!user || !user.password_hash) {
      res.status(401).json({ success: false, error: 'Invalid phone number or not registered as handler' });
      return;
    }

    // Handlers default password is their phone number
    const valid = await bcrypt.compare(phone.trim(), user.password_hash);
    if (!valid) {
      res.status(401).json({ success: false, error: 'Invalid phone number or credentials' });
      return;
    }

    if (user.role !== 'handler') {
      res.status(403).json({ success: false, error: 'Access denied. Handler privileges required.' });
      return;
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: 'handler',
      name: user.name,
    });

    setAuthCookie(res, 'handler', token);
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /google
// ─────────────────────────────────────────────────────────────────────────────
export const googleAuth = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      res.status(400).json({ success: false, error: 'Google credential token is required' });
      return;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).json({ success: false, error: 'Invalid Google token' });
      return;
    }

    if (!payload.email_verified) {
      res.status(400).json({ success: false, error: 'Google email is not verified' });
      return;
    }

    const email = payload.email?.toLowerCase().trim();
    if (!email) {
      res.status(400).json({ success: false, error: 'No email found in Google profile' });
      return;
    }

    const googleId = payload.sub;
    const name = payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim() || null;
    const avatarUrl = payload.picture || null;

    // Check existing user by email or google_id
    const existing = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR google_id = $2',
      [email, googleId]
    );

    let user = existing.rows[0];

    if (!user) {
      // Create new customer user
      const insertResult = await pool.query(
        `INSERT INTO users (email, name, avatar_url, google_id, role)
         VALUES ($1, $2, $3, $4, 'customer')
         RETURNING *`,
        [email, name, avatarUrl, googleId]
      );
      user = insertResult.rows[0];

      // Send welcome email to new Google customer
      sendWelcomeEmailToUser(user).catch(err =>
        console.error('[Google Auth] Failed to trigger welcome email:', err)
      );
    } else {
      // Link google_id and update avatar/name if missing
      const updateResult = await pool.query(
        `UPDATE users
         SET google_id = COALESCE(google_id, $1),
             avatar_url = COALESCE(avatar_url, $2),
             name = COALESCE(name, $3)
         WHERE id = $4
         RETURNING *`,
        [googleId, avatarUrl, name, user.id]
      );
      user = updateResult.rows[0];
    }

    // Prevent admin or handler from logging into customer portal with Google
    if (user.role === 'admin' || user.role === 'handler') {
      res.status(403).json({
        success: false,
        error: `This email is assigned to a ${user.role} account. Please log in via the authorized staff portal.`,
      });
      return;
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    setAuthCookie(res, user.role, token);
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(400).json({
      success: false,
      error: `Google sign-in failed: ${(err as Error).message}`,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /otp/request (Customer Email OTP Request)
// ─────────────────────────────────────────────────────────────────────────────
export const requestOtp = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { email, name } = req.body;
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    if (!email) {
      res.status(400).json({ success: false, error: 'Email address is required' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Prevent requesting customer OTP for admin/handler staff accounts
    const existingStaff = await pool.query('SELECT role FROM users WHERE email = $1', [normalizedEmail]);
    if (existingStaff.rows[0]?.role === 'admin' || existingStaff.rows[0]?.role === 'handler') {
      res.status(403).json({
        success: false,
        error: `This email belongs to an administrative account. Please log in via the authorized staff portal.`,
      });
      return;
    }

    // Check IP rate limit
    if (!checkIpRateLimit(clientIp)) {
      res.status(429).json({ success: false, error: 'Too many requests from your IP. Please try again later.' });
      return;
    }

    // Check email rate limit (minimum 60s cooldown)
    const now = Date.now();
    const lastRequest = emailRateLimit.get(normalizedEmail);
    if (lastRequest && now - lastRequest < MIN_REQUEST_INTERVAL_MS) {
      const waitSeconds = Math.ceil((MIN_REQUEST_INTERVAL_MS - (now - lastRequest)) / 1000);
      res.status(429).json({
        success: false,
        error: `Please wait ${waitSeconds} seconds before requesting a new code.`,
      });
      return;
    }

    const code = generate6DigitCode();
    const hashedCode = hashOtp(code);

    otpMap.set(normalizedEmail, {
      hashedCode,
      name: name?.trim() || undefined,
      expiresAt: now + OTP_EXPIRY_MS,
      attempts: 0,
      createdAt: now,
    });

    emailRateLimit.set(normalizedEmail, now);

    // Send email via nodemailer SMTP
    await sendMail({
      to: normalizedEmail,
      subject: `Your Verification Code: ${code} - Haifly Trap`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; padding: 32px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0f5238; font-size: 24px; margin: 0;">Haifly Trap</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Single-use Verification Code</p>
          </div>

          <p style="font-size: 15px; color: #1e293b; line-height: 1.5;">Hello${name ? ` ${name}` : ''},</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.5;">Enter the following 6-digit code to sign in to your Haifly Trap account:</p>

          <div style="background: #f0fdf4; border: 2px dashed #0f5238; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #0f5238; font-family: monospace;">${code}</span>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
            ⏰ This code will expire in <strong>10 minutes</strong>. Never share this code with anyone.
          </p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; pt: 16px;">
            If you did not request this code, you can safely ignore this email. Check your spam folder if you did not see this promptly.
          </p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email. Please check your inbox and spam folder.',
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /otp/verify (Customer Email OTP Verify)
// ─────────────────────────────────────────────────────────────────────────────
export const verifyOtp = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { email, otp, name } = req.body;

    if (!email || !otp) {
      res.status(400).json({ success: false, error: 'Email and OTP code are required' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = otpMap.get(normalizedEmail);

    if (!record) {
      res.status(400).json({ success: false, error: 'No active verification code found. Please request a new one.' });
      return;
    }

    if (Date.now() > record.expiresAt) {
      otpMap.delete(normalizedEmail);
      res.status(400).json({ success: false, error: 'Verification code has expired. Please request a new one.' });
      return;
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      otpMap.delete(normalizedEmail);
      res.status(429).json({ success: false, error: 'Too many incorrect attempts. Please request a new code.' });
      return;
    }

    const providedHash = hashOtp(otp);
    if (providedHash !== record.hashedCode) {
      record.attempts += 1;
      const remaining = MAX_ATTEMPTS - record.attempts;
      res.status(400).json({
        success: false,
        error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      });
      return;
    }

    // Code is valid! Delete record immediately (single-use)
    otpMap.delete(normalizedEmail);

    // Upsert customer user
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    let user = existing.rows[0];
    const displayName = name?.trim() || record.name || null;

    if (!user) {
      const insertResult = await pool.query(
        `INSERT INTO users (email, name, role)
         VALUES ($1, $2, 'customer')
         RETURNING *`,
        [normalizedEmail, displayName]
      );
      user = insertResult.rows[0];

      // Send welcome email to new OTP customer
      sendWelcomeEmailToUser(user).catch(err =>
        console.error('[OTP Verify] Failed to trigger welcome email:', err)
      );
    } else if (displayName && !user.name) {
      const updateResult = await pool.query(
        `UPDATE users SET name = $1 WHERE id = $2 RETURNING *`,
        [displayName, user.id]
      );
      user = updateResult.rows[0];
    }

    // Role check: if existing user is admin, forbid using customer OTP portal
    if (user.role === 'admin') {
      res.status(403).json({ success: false, error: 'Admin users must use the secure admin portal.' });
      return;
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    setAuthCookie(res, user.role, token);
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /logout
// ─────────────────────────────────────────────────────────────────────────────
export const logout = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const role = (req.query.role as string) || (req.headers['x-auth-role'] as string);
    clearAuthCookie(res, role);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /me
// ─────────────────────────────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const authUser = req.user;
    if (!authUser?.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const result = await pool.query(
      'SELECT id, email, name, avatar_url, role, google_id, created_at FROM users WHERE id = $1',
      [authUser.id]
    );

    const user = result.rows[0];
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /me
// ─────────────────────────────────────────────────────────────────────────────
export const deleteAccount = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const authUser = req.user;
    if (!authUser?.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    // Security check: Only customer accounts can be deleted from the storefront
    if (authUser.role !== 'customer') {
      res.status(403).json({
        success: false,
        error: 'Administrator and handler accounts cannot be deleted from the storefront.',
      });
      return;
    }

    await pool.query('DELETE FROM users WHERE id = $1', [authUser.id]);
    clearAuthCookie(res, 'customer');

    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /sync (Kept for frontend backward compatibility)
// ─────────────────────────────────────────────────────────────────────────────
export const syncUser = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const authUser = req.user;
    if (!authUser?.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const result = await pool.query(
      'SELECT id, email, name, avatar_url, role, created_at FROM users WHERE id = $1',
      [authUser.id]
    );

    const user = result.rows[0];
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /admin-register
// ─────────────────────────────────────────────────────────────────────────────
export const adminRegister = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { email, password, adminSecret, full_name, name } = req.body;
    const displayName = full_name || name || null;

    if (!email || !password || !adminSecret) {
      res.status(400).json({ success: false, error: 'Email, password, and adminSecret are required' });
      return;
    }

    const serverAdminSecret = process.env.ADMIN_CREATION_SECRET;
    if (!serverAdminSecret || adminSecret !== serverAdminSecret) {
      res.status(403).json({ success: false, error: 'Invalid admin secret' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      res.status(400).json({ success: false, error: 'User with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING id, email, name, role, created_at`,
      [normalizedEmail, passwordHash, displayName]
    );

    const user = result.rows[0];
    const token = signToken({
      sub: user.id,
      email: user.email,
      role: 'admin',
      name: user.name,
    });

    setAuthCookie(res, 'admin', token);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
