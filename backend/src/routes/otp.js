import 'dotenv/config';
import express from 'express';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  validateSendOTP,
  validateVerifyOTP,
  handleValidation,
} from '../middleware/validation.js';

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Temporary OTP store (use Redis in production)
const otpStore = new Map();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ======================
// Send OTP
// ======================
router.post('/send-otp', validateSendOTP, handleValidation, async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const hashedOTP = await bcrypt.hash(otp, 10);
    otpStore.set(email.toLowerCase(), { hashedOTP, expiresAt });

    await resend.emails.send({
      from: 'VR Lawyer <otp@yourdomain.com>', // ← Change this
      to: email,
      subject: `Your VR Lawyer Verification Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2>VR Lawyer</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 8px; font-size: 32px; color: #1a73e8;">${otp}</h1>
          <p>This code is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// ======================
// Verify OTP
// ======================
router.post('/verify-otp', validateVerifyOTP, handleValidation, async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore.get(email.toLowerCase());
    if (!record) {
      return res.status(400).json({ error: 'OTP expired or not found' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ error: 'OTP expired' });
    }

    const isValid = await bcrypt.compare(otp, record.hashedOTP);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP is valid → delete it
    otpStore.delete(email.toLowerCase());

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;