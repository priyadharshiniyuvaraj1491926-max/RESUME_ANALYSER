import { Router } from 'express';
import {
  decideImprovement,
  deleteAnalysis,
  generateImprovementsForAnalysis,
  getAnalysisById,
  listAnalyses,
  runAnalysis,
} from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.post('/run/:resumeId', runAnalysis);
router.get('/', listAnalyses);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);
router.post('/improver/generate/:analysisId', generateImprovementsForAnalysis);
router.patch('/improver/:analysisId/decision', decideImprovement);

export default router;
