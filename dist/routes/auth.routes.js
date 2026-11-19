"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Current authenticated user session
router.get('/me', auth_1.authMiddleware, auth_controller_1.getMe);
router.delete('/me', auth_1.authMiddleware, auth_controller_1.deleteAccount);
router.post('/sync', auth_1.authMiddleware, auth_controller_1.syncUser);
// General auth
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
// Google OAuth (POST { credential })
router.post('/google', auth_controller_1.googleAuth);
// Customer Email OTP Login
router.post('/otp/request', auth_controller_1.requestOtp);
router.post('/otp/verify', auth_controller_1.verifyOtp);
// Role-specific portals
router.post('/admin-login', auth_controller_1.adminLogin);
router.post('/admin-register', auth_controller_1.adminRegister);
router.post('/handler-login', auth_controller_1.handlerLogin);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map