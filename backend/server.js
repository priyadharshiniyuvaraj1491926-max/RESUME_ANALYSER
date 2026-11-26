import mongoose from 'mongoose';
import app from './app.js';
import env from './config/env.js';
import { connectDB } from './config/db.js';

async function startServer() {
  try {
    await connectDB();
    console.log('Connected to MongoDB.');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    console.log(`ResumeIQ AI backend running at http://localhost:${env.port}`);
  });

  /**
   * Graceful shutdown handler.
   * Closes the HTTP server so no new connections are accepted,
   * then cleanly disconnects from MongoDB before exiting.
   */
  function gracefulShutdown(signal) {
    console.log(`[Shutdown] ${signal} received. Closing HTTP server...`);
    server.close(async () => {
      console.log('[Shutdown] HTTP server closed. Disconnecting MongoDB...');
      try {
        await mongoose.disconnect();
        console.log('[Shutdown] MongoDB disconnected. Exiting cleanly.');
      } catch (_) {
        console.error('[Shutdown] Error during MongoDB disconnect:', _?.message);
      }
      process.exit(0);
    });
    // Force-exit after 10 s if shutdown stalls
    setTimeout(() => {
      console.error('[Shutdown] Forced exit after 10 s timeout.');
      process.exit(1);
    }, 10_000).unref();
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer();
