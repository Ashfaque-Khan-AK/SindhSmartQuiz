import mongoose from 'mongoose';

export const LANGUAGES = ['en', 'ur', 'sd'];
export const DIFFICULTIES = ['easy', 'medium', 'hard'];
export const ROLES = ['student', 'admin'];

export function isObjectId(value) {
  return Boolean(value) && mongoose.isValidObjectId(value);
}

export function requireObjectId(value, field = 'id') {
  if (!isObjectId(value)) {
    const error = new Error(`Invalid ${field}`);
    error.statusCode = 400;
    error.isOperational = true;
    throw error;
  }
  return value;
}

export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function toBoolean(value) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

export function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function pickTranslation(value, language = 'en') {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.en || value.ur || value.sd || '';
}
