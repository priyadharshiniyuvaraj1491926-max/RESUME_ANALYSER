import { Router } from 'express';
import mongoose from 'mongoose';
import { isLlmConfigured } from '../services/llmProviderService.js';
import env from '../config/env.js';

const router = Router();

router.get('/', (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: 'ok',
    service: 'ResumeIQ AI Backend',
    databaseConnected: mongoose.connection.readyState === 1,
    llmConfigured: isLlmConfigured(),
    environment: env.nodeEnv,
    telemetry: {
      uptimeSeconds: Math.round(process.uptime()),
      memoryMb: {
        rss: Math.round(mem.rss / 1024 / 1024),
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
      },
      nodeVersion: process.version,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
