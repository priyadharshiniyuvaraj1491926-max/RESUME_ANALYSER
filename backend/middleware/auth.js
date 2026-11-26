import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';

export function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      tv: user.tokenVersion || 0,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    const token = authHeader.slice(7).trim();
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing.' });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: 'User account no longer exists.' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Your account has been suspended.' });
    }
    if ((user.tokenVersion || 0) !== (decoded.tv || 0)) {
      return res.status(401).json({ message: 'Session expired. Please sign in again.' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions.' });
    }
    next();
  };
}
