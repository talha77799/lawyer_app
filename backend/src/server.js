import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import lawyerRoutes from './routes/lawyerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();

// CORS: only allow the frontend origin(s) listed in CORS_ORIGIN (comma-separated).
// Falls back to allowing all origins only if CORS_ORIGIN is not set, so local/dev
// setups that forget to configure it don't silently break — but production should
// always set CORS_ORIGIN explicitly.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : true;
app.use(cors({ origin: allowedOrigins }));

// crossOriginResourcePolicy is relaxed because avatars/qualification docs under
// /uploads are fetched from a different origin (the web/app frontend) than the API.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads')));

// Rate limit auth + OTP endpoints specifically — these are the brute-force/spam targets.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/auth', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'WakeelHub Backend is running' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;


connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} on all interfaces`);
  });
});