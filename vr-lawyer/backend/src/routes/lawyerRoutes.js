import { Router } from 'express';
import {
  getLawyers,
  getLawyerById,
  registerAsLawyer,
  getCities,
  getPracticeAreas,
} from '../controllers/lawyerController.js';

const router = Router();

router.get('/', getLawyers);
router.get('/cities', getCities);
router.get('/practice-areas', getPracticeAreas);
router.get('/:id', getLawyerById);
router.post('/register', registerAsLawyer);

export default router;
