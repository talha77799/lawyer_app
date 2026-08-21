import { Router } from 'express';
import {
  getLawyers,
  getLawyerById,
  registerAsLawyer,
  getCities,
  getPracticeAreas,
} from '../controllers/lawyerController.js';
import { qualificationUpload } from '../middleware/qualificationUpload.js';

const router = Router();

router.get('/', getLawyers);
router.get('/cities', getCities);
router.get('/practice-areas', getPracticeAreas);
router.get('/:id', getLawyerById);
router.post('/register', qualificationUpload.single('qualificationDocument'), registerAsLawyer);

export default router;
