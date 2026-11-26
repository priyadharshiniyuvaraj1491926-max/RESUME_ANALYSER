import { Router } from 'express';
import mongoose from 'mongoose';
import { isLlmConfigured } from '../services/llmProviderService.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ResumeIQ AI Backend',
    databaseConnected: mongoose.connection.readyState === 1,
    llmConfigured: isLlmConfigured(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
