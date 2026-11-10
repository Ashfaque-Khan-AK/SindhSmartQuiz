import { mathQuestions } from './mathQuestions.js';
import { englishQuestions } from './englishQuestions.js';
import { scienceQuestions } from './scienceQuestions.js';
import { gkQuestions } from './gkQuestions.js';

export { SUBJECTS, CURRICULUM, ACHIEVEMENTS } from './curriculum.js';

export const QUESTION_BANK = [
  ...mathQuestions,
  ...englishQuestions,
  ...scienceQuestions,
  ...gkQuestions,
];
