import Otp from '../models/Otp.js';
import User from '../models/User.js';
import { sendOtpEmail } from '../utils/sendEmail.js';
import { generateToken } from '../utils/generateToken.js';

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

export const sendOtp = async (req, res) => {
  try {
    const { email, purpose = 'verify' } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const validPurposes = ['login', 'register', 'reset', 'verify'];
    const otpPurpose = validPurposes.includes(purpose) ? purpose : 'verify';

    if (otpPurpose === 'login' || otpPurpose === 'reset') {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email' });
      }
    }
    if (otpPurpose === 'register') {
      const exists = await User.findOne({ email: normalizedEmail });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
    }

    await Otp.deleteMany({ email: normalizedEmail, purpose: otpPurpose });

    const code = generateCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.create({ email: normalizedEmail, code, purpose: otpPurpose, expiresAt });
    await sendOtpEmail(normalizedEmail, code, otpPurpose);

    res.json({
      success: true,
      message: `OTP sent to ${normalizedEmail}`,
      expiresIn: OTP_EXPIRY_MINUTES * 60,
    });
  } catch (err) {
    console.error('sendOtp error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, code, purpose = 'verify' } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpPurpose = purpose || 'verify';

    const otpDoc = await Otp.findOne({
      email: normalizedEmail,
      purpose: otpPurpose,
      verified: false,
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ success: false, message: 'OTP not found or already used. Request a new one.' });
    }
    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ success: false, message: 'OTP has expired. Request a new one.' });
    }
    if (otpDoc.attempts >= MAX_ATTEMPTS) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(429).json({ success: false, message: 'Too many attempts. Request a new OTP.' });
    }
    if (otpDoc.code !== String(code).trim()) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${MAX_ATTEMPTS - otpDoc.attempts} attempt(s) remaining.`,
      });
    }

    otpDoc.verified = true;
    await otpDoc.save();

    if (otpPurpose === 'login') {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const token = generateToken(user._id);
      return res.json({
        success: true,
        message: 'OTP verified. Logged in.',
        token,
        user: user.toPublicJSON ? user.toPublicJSON() : user,
      });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully',
      verified: true,
      email: normalizedEmail,
      purpose: otpPurpose,
    });
  } catch (err) {
    console.error('verifyOtp error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to verify OTP' });
  }
};