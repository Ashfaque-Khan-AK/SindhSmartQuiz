import { ApiError } from '../utils/apiError.js';
import { DIFFICULTIES, LANGUAGES, isObjectId } from '../utils/validation.js';

export const validators = {
  objectId(value, field = 'id') {
    if (!isObjectId(value)) throw ApiError.badRequest(`Invalid ${field}`);
    return value;
  },

  requiredString(value, field, { min = 1, max = 500 } = {}) {
    const text = typeof value === 'string' ? value.trim() : '';
    if (text.length < min) throw ApiError.badRequest(`${field} is required`);
    if (text.length > max) throw ApiError.badRequest(`${field} must be at most ${max} characters`);
    return text;
  },

  optionalString(value, field, { max = 500 } = {}) {
    if (value === undefined || value === null || value === '') return '';
    return this.requiredString(value, field, { min: 0, max });
  },

  email(value) {
    const text = this.requiredString(value, 'Email', { max: 160 }).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text)) {
      throw ApiError.badRequest('Please enter a valid email address');
    }
    return text;
  },

  password(value) {
    if (typeof value !== 'string' || value.length < 6) {
      throw ApiError.badRequest('Password must be at least 6 characters');
    }
    if (value.length > 72) throw ApiError.badRequest('Password is too long');
    return value;
  },

  gradeNumber(value) {
    const num = Number(value);
    if (!Number.isInteger(num) || num < 1 || num > 12) {
      throw ApiError.badRequest('Please choose a valid grade');
    }
    return num;
  },

  language(value, fallback = 'en') {
    if (value === undefined || value === null || value === '') return fallback;
    if (!LANGUAGES.includes(value)) throw ApiError.badRequest('Unsupported language');
    return value;
  },

  difficulty(value, { allowMixed = false, fallback = null } = {}) {
    if (value === undefined || value === null || value === '') {
      if (fallback) return fallback;
      throw ApiError.badRequest('Difficulty is required');
    }
    const allowed = allowMixed ? [...DIFFICULTIES, 'mixed'] : DIFFICULTIES;
    if (!allowed.includes(value)) throw ApiError.badRequest('Invalid difficulty');
    return value;
  },

  questionCount(value) {
    const num = Number(value);
    if (![5, 10, 15].includes(num)) {
      throw ApiError.badRequest('Question count must be 5, 10 or 15');
    }
    return num;
  },

  timeLimit(value) {
    const num = Number(value);
    if (![5, 10, 15].includes(num)) {
      throw ApiError.badRequest('Time limit must be 5, 10 or 15 minutes');
    }
    return num;
  },

  translation(value, field = 'text', { requireEnglish = true } = {}) {
    const source = typeof value === 'object' && value !== null ? value : { en: value };
    const result = {
      en: typeof source.en === 'string' ? source.en.trim() : '',
      ur: typeof source.ur === 'string' ? source.ur.trim() : '',
      sd: typeof source.sd === 'string' ? source.sd.trim() : '',
    };
    if (requireEnglish && !result.en) {
      throw ApiError.badRequest(`${field} is required in English`);
    }
    return result;
  },
};
