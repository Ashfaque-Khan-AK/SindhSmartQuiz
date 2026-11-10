import {
  Atom,
  Award,
  BookOpen,
  Brain,
  Calculator,
  CalendarCheck,
  Crown,
  FlaskConical,
  Footprints,
  Globe2,
  Landmark,
  Languages,
  Leaf,
  Medal,
  Music,
  Palette,
  Rocket,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';

export const ICON_MAP = {
  Footprints,
  Zap,
  Crown,
  Star,
  CalendarCheck,
  Trophy,
  Award,
  Calculator,
  FlaskConical,
  Languages,
  Globe2,
  BookOpen,
  Atom,
  Palette,
  Music,
  Landmark,
  Leaf,
  Medal,
  Target,
  Rocket,
  Brain,
};

export const SUBJECT_ICON_OPTIONS = [
  'Calculator',
  'FlaskConical',
  'Languages',
  'Globe2',
  'BookOpen',
  'Atom',
  'Palette',
  'Music',
  'Landmark',
  'Leaf',
];

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function pickLang(value, language = 'en') {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.en || value.ur || value.sd || '';
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDuration(seconds) {
  const total = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  if (minutes === 0) return `${remainder}s`;
  return `${minutes}m ${String(remainder).padStart(2, '0')}s`;
}

export function formatClock(seconds) {
  const total = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function scoreTone(percentage) {
  if (percentage >= 80) return 'success';
  if (percentage >= 50) return 'warning';
  return 'error';
}

export function gradeLabel(grade) {
  return grade ? `Grade ${grade}` : '—';
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
