import { validationResult } from 'express-validator';

export function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      message: result.array()[0].msg,
      errors: result.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}
