import { Router } from 'express';
import { authMiddleware, requireRoles } from '../../../middleware/authMiddleware.js';
import { createForm, listForms } from '../../../controllers/formController.js';
import { uploadMiddleware } from '../../../middleware/uploadMiddleware.js';
const router = Router();
router.get('/', listForms);
router.post('/', authMiddleware, requireRoles('ADMIN', 'STAFF'), uploadMiddleware.single('file'), createForm);
export default router;
