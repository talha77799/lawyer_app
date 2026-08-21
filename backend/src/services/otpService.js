import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const resend = new Resend(process.env.RESEND_API_KEY);

// Temporary OTP store (use Redis in production)
const otpStore = new Map();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP to email
 */
export async function sendOTP(email) {
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

  return true;
}

/**
 * Verify OTP
 */
export async function verifyOTP(email, otp) {
  const record = otpStore.get(email.toLowerCase());

  if (!record) {
    throw new Error('OTP expired or not found');
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    throw new Error('OTP expired');
  }

  const isValid = await bcrypt.compare(otp, record.hashedOTP);
  if (!isValid) {
    throw new Error('Invalid OTP');
  }

  // OTP is valid → delete it
  otpStore.delete(email.toLowerCase());

  // Create JWT token
  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return token;
}