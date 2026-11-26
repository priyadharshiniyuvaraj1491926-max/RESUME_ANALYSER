import { Router } from 'express';
import { body } from 'express-validator';
import {
  analyzeSkillGap,
  exportBuilderPdf,
  generateInterview,
  getBuilderDraft,
  getCareerRecommendations,
  listInterviewSessions,
  saveBuilderDraft,
  submitContactMessage,
  submitInterviewAnswer,
} from '../controllers/careerToolsController.js';
import { protect } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.post(
  '/contact',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('subject').trim().isLength({ min: 3 }).withMessage('Subject is required.'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters.'),
  ],
  handleValidation,
  submitContactMessage
);

router.post('/skills/analyze-gap', protect, analyzeSkillGap);
router.get('/careers/recommendations', protect, getCareerRecommendations);
router.post('/interview/generate', protect, generateInterview);
router.get('/interview/sessions', protect, listInterviewSessions);
router.post(
  '/interview/sessions/:sessionId/answer',
  protect,
  [
    body('questionId').notEmpty().withMessage('Question ID is required.'),
    body('userAnswer').trim().isLength({ min: 10 }).withMessage('Answer must be at least 10 characters.'),
  ],
  handleValidation,
  submitInterviewAnswer
);
router.get('/builder/draft', protect, getBuilderDraft);
router.put('/builder/draft', protect, saveBuilderDraft);
router.post('/builder/export-pdf', protect, exportBuilderPdf);

export default router;
