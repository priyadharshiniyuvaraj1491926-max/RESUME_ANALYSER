import multer from 'multer';

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File exceeds the 5 MB upload size limit.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }

  if (err?.message?.includes('Invalid file format') || err?.message?.includes('Invalid MIME type')) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.statusCode || 500;
  const message =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message || 'Something went wrong.';

  res.status(status).json({ message });
}
