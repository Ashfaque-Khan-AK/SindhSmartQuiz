/**
 * Seed helpers: every question keeps English, Urdu and Sindhi text.
 * Options can be plain strings (same in all languages) or [en, ur, sd] tuples.
 */
export function q(en, ur, sd, options, correct, explanation, difficulty = null) {
  return {
    en,
    ur,
    sd,
    options: options.map((option) => {
      if (Array.isArray(option)) {
        return { en: option[0], ur: option[1] || option[0], sd: option[2] || option[0] };
      }
      return { en: option, ur: option, sd: option };
    }),
    correct,
    explanation:
      typeof explanation === 'string'
        ? { en: explanation, ur: explanation, sd: explanation }
        : {
            en: explanation[0] || '',
            ur: explanation[1] || explanation[0] || '',
            sd: explanation[2] || explanation[0] || '',
          },
    difficulty,
  };
}

export const DIFFICULTY_ROTATION = ['easy', 'easy', 'medium', 'medium', 'hard'];

/**
 * Attaches grade/subject/topic to a block of five questions and spreads
 * difficulties so every topic supports easy, medium and hard filters.
 */
export function meta(grade, subject, topic, rows) {
  return rows.map((row, index) => ({
    grade,
    subject,
    topic,
    ...row,
    difficulty: row.difficulty || DIFFICULTY_ROTATION[index % DIFFICULTY_ROTATION.length],
  }));
}
