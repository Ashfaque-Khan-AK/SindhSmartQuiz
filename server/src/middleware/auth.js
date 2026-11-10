import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

/**
 * Verifies the Bearer token, loads the user and blocks inactive accounts.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

  if (!token) {
    throw ApiError.unauthorized('Please log in to continue');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Your session has expired. Please log in again.'
        : 'Invalid session. Please log in again.';
    throw ApiError.unauthorized(message);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw ApiError.unauthorized('This account no longer exists');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact your school administrator.');
  }

  req.user = user;
  next();
});

export const studentOnly = (req, _res, next) => {
  if (req.user?.role !== 'student') {
    return next(ApiError.forbidden('Student access required'));
  }
  return next();
};

export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    return next(ApiError.forbidden('Administrator access required'));
  }
  return next();
};
