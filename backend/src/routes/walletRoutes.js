import { Router } from 'express';
import { getWallet, requestPayout } from '../controllers/walletController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', getWallet);
router.post('/payout', authorize('lawyer', 'admin'), requestPayout);
export default router;
