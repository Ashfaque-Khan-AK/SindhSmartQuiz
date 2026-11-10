const PK_OFFSET_MS = 5 * 60 * 60 * 1000; // Asia/Karachi (UTC+5), the primary audience timezone.

export function dayKey(date) {
  const shifted = new Date(new Date(date).getTime() + PK_OFFSET_MS);
  return Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate());
}

const DAY = 24 * 60 * 60 * 1000;

export function longestDayStreak(dates = []) {
  const keys = [...new Set(dates.filter(Boolean).map(dayKey))].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let previous = null;

  for (const key of keys) {
    run = previous !== null && key - previous === DAY ? run + 1 : 1;
    best = Math.max(best, run);
    previous = key;
  }

  return best;
}

export function currentDayStreak(dates = []) {
  const keys = new Set(dates.filter(Boolean).map(dayKey));
  if (!keys.size) return 0;

  const today = dayKey(new Date());
  let cursor = keys.has(today) ? today : keys.has(today - DAY) ? today - DAY : null;
  if (cursor === null) return 0;

  let streak = 0;
  while (keys.has(cursor)) {
    streak += 1;
    cursor -= DAY;
  }

  return streak;
}

export function startOfDay(date = new Date()) {
  const key = dayKey(date);
  return new Date(key - PK_OFFSET_MS);
}

export function daysAgo(count) {
  return new Date(startOfDay().getTime() - count * DAY);
}
