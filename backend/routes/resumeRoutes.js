import { Router } from 'express';
import {
  deleteResume,
  getResumeById,
  listResumes,
  uploadResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { resumeUpload } from '../middleware/upload.js';

const router = Router();
router.use(protect);

router.post('/upload', resumeUpload.single('resume'), uploadResume);
router.get('/', listResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

export default router;
