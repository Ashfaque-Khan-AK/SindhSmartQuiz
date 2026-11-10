import Grade from '../models/Grade.js';
import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { created, ok } from '../utils/response.js';
import { validators } from '../utils/validators.js';

export const register = asyncHandler(async (req, res) => {
  const name = validators.requiredString(req.body.name, 'Full name', { min: 2, max: 80 });
  const email = validators.email(req.body.email);
  const password = validators.password(req.body.password);
  const gradeNumber = validators.gradeNumber(req.body.grade);
  const language = validators.language(req.body.language, 'en');

  const grade = await Grade.findOne({ number: gradeNumber, isActive: true });
  if (!grade) {
    throw ApiError.badRequest(`Grade ${gradeNumber} is not available right now`);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    grade: gradeNumber,
    language,
    role: 'student',
  });

  return created(
    res,
    { user },
    'Account created successfully. Please log in to start playing.'
  );
});

export const login = asyncHandler(async (req, res) => {
  const email = validators.email(req.body.email);
  const password = String(req.body.password || '');
  if (!password) throw ApiError.badRequest('Password is required');

  const user = await User.findByCredentials(email);

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact your administrator.');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user);

  return ok(res, { token, user }, 'Logged in successfully');
});

export const me = asyncHandler(async (req, res) => {
  return ok(res, { user: req.user }, 'Current user');
});
