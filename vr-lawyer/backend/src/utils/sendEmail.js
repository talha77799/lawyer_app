import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
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

  // Dev mode: print OTP in terminal if SMTP not set
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('\n========================================');
    console.log(`OTP for ${to}`);
    console.log(`Code: ${code}`);
    console.log(`Purpose: ${purposeText}`);
    console.log('========================================\n');
    return { success: true, devMode: true };
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"VR-Digital" <${process.env.SMTP_USER}>`,
    to,
    subject: `Your VR-Digital OTP: ${code}`,
    text: `Your OTP for ${purposeText} is: ${code}\nExpires in 10 minutes.`,
    html: `<h2>VR-Digital</h2><p>Your OTP for <b>${purposeText}</b>:</p><h1 style="letter-spacing:8px">${code}</h1><p>Expires in 10 minutes.</p>`,
  });

  return { success: true };
};

export default sendOtpEmail;