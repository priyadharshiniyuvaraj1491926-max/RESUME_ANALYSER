import { Router } from 'express';
import { body } from 'express-validator';
import { listJobMatches, runJobMatch } from '../controllers/careerToolsController.js';
import { protect } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();
router.use(protect);

router.post(
  '/match',
  [
    body('resumeId').notEmpty().withMessage('Resume selection is required.'),
    body('jobDescription').trim().isLength({ min: 30 }).withMessage('Job description must be at least 30 characters.'),
  ],
  handleValidation,
  runJobMatch
);
router.get('/matches', listJobMatches);

export default router;
