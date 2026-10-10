import { Router } from 'express';
import { authMiddleware, requireRoles } from '../../../middleware/authMiddleware.js';
import { summary } from '../../../controllers/statisticsController.js';
const router = Router();
router.get('/summary', authMiddleware, requireRoles('ADMIN', 'STAFF'), summary);
export default router;
