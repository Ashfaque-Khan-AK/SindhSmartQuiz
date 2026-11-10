import { ApiError } from '../utils/apiError.js';
import { config } from '../config/env.js';

// eslint-disable-next-line no-unused-vars
export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Something went wrong';
  let errors = error.errors;

  if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${error.path}`;
  }

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Please check the submitted data';
    errors = Object.values(error.errors).map((item) => item.message);
  }

  if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    message = `That ${field} is already in use`;
  }

  if (error.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON payload';
  }

  if (statusCode >= 500) {
    console.error('[error]', error);
  }

  if (config.isProduction && statusCode >= 500) {
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(config.isProduction ? {} : { stack: error.stack }),
  });
}
