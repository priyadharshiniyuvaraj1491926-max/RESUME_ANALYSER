import { Router } from 'express';
import { body } from 'express-validator';
import {
  changePassword,
  deleteAccount,
  getDashboardOverview,
  getNotifications,
  updatePreferences,
  updateProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();
router.use(protect);

router.get('/dashboard-overview', getDashboardOverview);
router.get('/notifications', getNotifications);

router.put(
  '/profile',
  [body('fullName').optional().trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.')],
  handleValidation,
  updateProfile
);

router.put('/preferences', updatePreferences);

router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters.')
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must include uppercase, lowercase, and a number.'),
    body('confirmNewPassword').notEmpty().withMessage('Confirm password is required.'),
  ],
  handleValidation,
  changePassword
);

router.delete('/account', deleteAccount);

export default router;
