import { Router } from 'express';
import {
  register,
  login,
  logout,
  adminLogin,
  adminRegister,
  handlerLogin,
  googleAuth,
  requestOtp,
  verifyOtp,
  deleteAccount,
  getMe,
  syncUser,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Current authenticated user session
router.get('/me', authMiddleware, getMe);
router.delete('/me', authMiddleware, deleteAccount);
router.post('/sync', authMiddleware, syncUser);

// General auth
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Google OAuth (POST { credential })
router.post('/google', googleAuth);

// Customer Email OTP Login
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);

// Role-specific portals
router.post('/admin-login', adminLogin);
router.post('/admin-register', adminRegister);
router.post('/handler-login', handlerLogin);

export default router;
