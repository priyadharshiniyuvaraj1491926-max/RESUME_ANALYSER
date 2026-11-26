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

  app.listen(env.port, () => {
    console.log(`ResumeIQ AI backend running at http://localhost:${env.port}`);
  });
}

startServer();
