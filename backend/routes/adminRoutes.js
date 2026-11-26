import { Router } from 'express';
import { body } from 'express-validator';
import {
  bootstrapAdmin,
  getAdminOverview,
  getPlatformAnalytics,
  getPlatformUsage,
  listMonitoringAnalyses,
  listUsers,
  updateUserByAdmin,
} from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.post(
  '/bootstrap',
  [
    body('fullName').trim().isLength({ min: 2 }).withMessage('Full name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  ],
  handleValidation,
  bootstrapAdmin
);

router.use(protect, authorize('admin'));

router.get('/overview', getAdminOverview);
router.get('/users', listUsers);
router.patch('/users/:id', updateUserByAdmin);
router.get('/usage', getPlatformUsage);
router.get('/analyses', listMonitoringAnalyses);
router.get('/analytics', getPlatformAnalytics);

export default router;
