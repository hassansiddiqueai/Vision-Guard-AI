const { ZodError } = require('zod');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err);

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const issues = err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
    return res.status(400).json({
      error: `Validation Error: ${issues}`,
      details: err.issues,
    });
  }

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds maximum limit of 15MB.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
