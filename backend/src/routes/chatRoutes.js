import { Router } from 'express';
import { chat } from '../controllers/chatController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect, authorize('client', 'lawyer'));
router.post('/', chat);
export default router;
