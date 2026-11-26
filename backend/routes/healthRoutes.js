import { Router } from 'express';
import mongoose from 'mongoose';
import { isLlmConfigured } from '../services/llmProviderService.js';

const router = Router();

const DB_STATE_LABELS = ['disconnected', 'connected', 'connecting', 'disconnecting'];

router.get('/', (_req, res) => {
  const dbReadyState = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    service: 'ResumeIQ AI Backend',
    uptime: Math.floor(process.uptime()),
    database: {
      connected: dbReadyState === 1,
      state: DB_STATE_LABELS[dbReadyState] ?? 'unknown',
    },
    llmConfigured: isLlmConfigured(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
