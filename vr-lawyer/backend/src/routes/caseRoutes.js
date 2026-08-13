import { Router } from 'express';
import {
  getMyCases,
  getCaseById,
  createCase,
  updateCase,
} from '../controllers/caseController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', getMyCases);
router.get('/:id', getCaseById);
router.post('/', createCase);
router.patch('/:id', updateCase);

export default router;
