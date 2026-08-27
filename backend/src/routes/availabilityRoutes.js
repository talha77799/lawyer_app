import { Router } from 'express';
import {
  getMyAvailability,
  updateAvailability,
  getLawyerAvailability,
} from '../controllers/availabilityController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.get('/lawyer/:id', getLawyerAvailability);
router.get('/me', protect, authorize('lawyer', 'admin'), getMyAvailability);
router.put('/me', protect, authorize('lawyer', 'admin'), updateAvailability);
export default router;
