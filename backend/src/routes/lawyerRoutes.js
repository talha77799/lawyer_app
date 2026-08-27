import { Router } from 'express';
import {
  getLawyers,
  getLawyerById,
  registerAsLawyer,
  getCities,
  getPracticeAreas,
} from '../controllers/lawyerController.js';
import { lawyerRegistrationUpload } from '../middleware/qualificationUpload.js';

const router = Router();

router.get('/', getLawyers);
router.get('/cities', getCities);
router.get('/practice-areas', getPracticeAreas);
router.get('/:id', getLawyerById);
router.post('/register', lawyerRegistrationUpload, registerAsLawyer);

export default router;
