import 'dotenv/config';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY?.trim().replace(/^<|>$/g, '');
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const createTransporter = () => {
  // Gmail example – set SMTP_* in .env
  // For production use SendGrid, Mailgun, AWS SES, etc.
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendOtpEmail = async (to, code, purpose = 'verify') => {
  const purposeText = {
    login: 'login',
    register: 'registration',
    reset: 'password reset',
    verify: 'email verification',
  }[purpose] || 'verification';

  const subject = `Your VR-Digital OTP: ${code}`;
  const text = `Your one-time password for ${purposeText} is: ${code}\n\nThis code expires in 10 minutes.\nIf you did not request this, ignore this email.`;
  const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #f59e0b; margin-bottom: 8px;">VR-Digital</h2>
        <p style="color: #334155;">Your one-time password for <strong>${purposeText}</strong> is:</p>
        <div style="background: #fffbeb; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0f172a;">${code}</span>
        </div>
        <p style="color: #64748b; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #94a3b8; font-size: 12px;">If you did not request this, you can safely ignore this email.</p>
      </div>
    `;

  if (resend) {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'VR-Digital <onboarding@resend.dev>',
      to,
      subject,
      text,
      html,
    });

    if (error) {
      const errorText = error.message || String(error);
      const message = errorText.toLowerCase().includes('api key') || errorText.toLowerCase().includes('unauthorized')
        ? 'Resend API key is invalid. Replace RESEND_API_KEY with a valid key from resend.com and restart the backend.'
        : `Email delivery failed: ${errorText}`;
      throw new Error(message);
    }
    return { success: true, messageId: data?.id };
  }

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const info = await createTransporter().sendMail({
      from: process.env.SMTP_FROM || `"VR-Digital" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return { success: true, messageId: info.messageId };
  }

  throw new Error('Email delivery is not configured. Set RESEND_API_KEY and RESEND_FROM, or SMTP_USER and SMTP_PASS.');
};

export default sendOtpEmail;
