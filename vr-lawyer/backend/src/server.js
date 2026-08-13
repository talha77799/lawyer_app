import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/db.js';
import { swaggerSpec } from './config/swagger.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import lawyerRoutes from './routes/lawyerRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root – stops the 404 on http://localhost:5001/
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to VR-Digital API',
    version: '1.0.0',
    docs: {
      swagger: `http://localhost:${PORT}/api/docs`,
      swaggerV1: `http://localhost:${PORT}/api/v1/docs`,
    },
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      lawyers: '/api/lawyers',
      appointments: '/api/appointments',
      cases: '/api/cases',
      dashboard: '/api/dashboard',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'VR-Digital API is running',
    version: '1.0.0',
    node: process.version,
    timestamp: new Date().toISOString(),
  });
});

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'VR-Digital API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
}));
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'VR-Digital API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
}));
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/lawyers', lawyerRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/cases', caseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`VR-Digital API running on http://localhost:${PORT}`);
    console.log(`Swagger docs:     http://localhost:${PORT}/api/docs`);
    console.log(`Also available:   http://localhost:${PORT}/api/v1/docs`);
    console.log(`Node ${process.version} | Env: ${process.env.NODE_ENV || 'development'}`);
  });
});