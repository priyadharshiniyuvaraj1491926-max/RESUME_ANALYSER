import crypto from 'crypto';

/**
 * Request ID correlation middleware.
 * Assigns or forwards X-Request-Id to trace requests across logs and responses.
 */
export function requestId(req, res, next) {
  const existingId = req.headers['x-request-id'];
  const id = (typeof existingId === 'string' && existingId.trim()) ? existingId.trim() : crypto.randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
}

export default requestId;
