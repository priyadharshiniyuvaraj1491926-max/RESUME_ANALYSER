import crypto from 'crypto';
import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import env from '../config/env.js';

export async function register(req, res, next) {
  try {
    const { fullName, email, password, confirmPassword, acceptedTerms } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    if (!acceptedTerms) {
      return res.status(400).json({ message: 'You must accept the terms and privacy policy.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      acceptedTerms: Boolean(acceptedTerms),
      role: 'user',
      status: 'active',
    });

    const token = signToken(user);
    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'This account is suspended. Contact an administrator.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    return res.json({
      message: 'Signed in successfully.',
      token,
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
    return res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res) {
  return res.json({ user: req.user.toSafeJSON() });
}

export async function forgotPassword(req, res, next) {
  try {
    const normalizedEmail = (req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      user.resetPasswordTokenHash = tokenHash;
      user.resetPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      await user.save();

      if (env.nodeEnv === 'development') {
        console.info(`[ResumeIQ Dev] Password reset token generated for ${user.email}: ${rawToken}`);
      }
    }

    // Safe response: never reveal whether the email exists, and never claim email delivery when SMTP is unconfigured.
    return res.json({
      message:
        'If an account exists for this email, a reset token has been generated (expires in 30 minutes). Email delivery is not configured in this environment.',
      emailDeliveryConfigured: false,
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Reset token is invalid or has expired.' });
    }

    user.password = password;
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    return res.json({ message: 'Password updated successfully. Please sign in.' });
  } catch (err) {
    next(err);
  }
}
