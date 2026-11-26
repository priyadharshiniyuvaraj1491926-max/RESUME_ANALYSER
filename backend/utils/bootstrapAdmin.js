import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';

/**
 * Secure Admin Bootstrap CLI.
 * Usage:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=StrongPassword123! ADMIN_NAME="Admin User" node utils/bootstrapAdmin.js
 */
async function run() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const fullName = (process.env.ADMIN_NAME || 'System Administrator').trim();

  if (!email || !password || password.length < 8) {
    console.error('Error: Provide ADMIN_EMAIL and ADMIN_PASSWORD (min 8 chars) via environment variables.');
    process.exit(1);
  }

  await connectDB();
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    existing.status = 'active';
    await existing.save();
    console.log(`Promoted existing user ${email} to admin.`);
  } else {
    await User.create({
      fullName,
      email,
      password,
      role: 'admin',
      status: 'active',
      acceptedTerms: true,
    });
    console.log(`Created admin account for ${email}.`);
  }
  await disconnectDB();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
