import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { sendOtp, verifyOtp } from '../controllers/otpController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Email OTP
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtp);

export default router;