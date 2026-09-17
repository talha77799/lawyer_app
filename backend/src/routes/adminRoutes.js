import { Router } from 'express';
import { getOverview, listResource, updateResource, deleteResource } from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = Router();
router.use(protect, authorize('admin'));
router.get('/overview', getOverview);
router.get('/:resource', listResource);
router.patch('/:resource/:id', updateResource);
router.delete('/:resource/:id', deleteResource);

export default router;