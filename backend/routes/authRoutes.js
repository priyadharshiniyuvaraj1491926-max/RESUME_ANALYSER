import { Router } from 'express';
import { body } from 'express-validator';
import {
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.post(
  '/register',
  authLimiter,
  [
    body('fullName').trim().isLength({ min: 2, max: 80 }).withMessage('Full name must be 2–80 characters.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters.')
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must include uppercase, lowercase, and a number.'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required.'),
  ],
  handleValidation,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  handleValidation,
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').isEmail().withMessage('Valid email is required.')],
  handleValidation,
  forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  [
    body('token').trim().notEmpty().withMessage('Reset token is required.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters.')
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must include uppercase, lowercase, and a number.'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required.'),
  ],
  handleValidation,
  resetPassword
);

export default router;
