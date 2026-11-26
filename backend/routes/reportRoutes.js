import { Router } from 'express';
import { downloadAnalysisReportPdf, listReports } from '../controllers/careerToolsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', listReports);
router.get('/analysis/:analysisId/pdf', downloadAnalysisReportPdf);

export default router;
