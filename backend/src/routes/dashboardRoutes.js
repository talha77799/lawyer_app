import { Router } from 'express';
import { getClientDashboard, getLawyerDashboard } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/client', protect, authorize('client', 'admin'), getClientDashboard);
router.get('/lawyer', protect, authorize('lawyer', 'admin'), getLawyerDashboard);

export default router;
