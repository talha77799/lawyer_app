import { Router } from 'express';
import { createReview, getLawyerReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/lawyer/:id', getLawyerReviews);
router.post('/', protect, createReview);
export default router;
