import { Router } from 'express';
import {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  getCalendar,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.post('/', createAppointment);
router.get('/', getMyAppointments);
router.get('/calendar', getCalendar);
router.patch('/:id/status', updateAppointmentStatus);

export default router;
