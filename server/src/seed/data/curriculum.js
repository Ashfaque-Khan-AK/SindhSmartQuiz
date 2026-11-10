export const SUBJECTS = [
  {
    key: 'mathematics',
    name: 'Mathematics',
    description: 'Numbers, algebra, geometry and problem solving for your grade.',
    icon: 'Calculator',
    color: 'primary',
  },
  {
    key: 'science',
    name: 'General Science',
    description: 'Explore living things, matter, energy and the world around you.',
    icon: 'FlaskConical',
    color: 'secondary',
  },
  {
    key: 'english',
    name: 'English',
    description: 'Build grammar, vocabulary and confident communication skills.',
    icon: 'Languages',
    color: 'accent',
  },
  {
    key: 'generalKnowledge',
    name: 'General Knowledge',
    description: 'Discover Pakistan, Sindh and the wider world we live in.',
    icon: 'Globe2',
    color: 'info',
  },
];

export const CURRICULUM = {
  6: {
    mathematics: ['Numbers & Operations', 'Algebra & Patterns'],
    science: ['Living Things', 'Matter & Energy'],
    english: ['Grammar Basics', 'Vocabulary Builders'],
    generalKnowledge: ['Pakistan & Sindh', 'World Around Us'],
  },
  7: {
    mathematics: ['Numbers & Operations', 'Algebra & Patterns'],
    science: ['Human Body', 'Force & Motion'],
    english: ['Grammar Basics', 'Vocabulary Builders'],
    generalKnowledge: ['Pakistan & Sindh', 'World Around Us'],
  },
  8: {
    mathematics: ['Numbers & Operations', 'Algebra & Patterns'],
    science: ['Cells & Reproduction', 'Chemical Reactions'],
    english: ['Grammar Basics', 'Vocabulary Builders'],
    generalKnowledge: ['Pakistan & Sindh', 'World Around Us'],
  },
  9: {
    mathematics: ['Numbers & Operations', 'Algebra & Patterns'],
    science: ['Ecosystems', 'Light & Sound'],
    english: ['Grammar Basics', 'Vocabulary Builders'],
    generalKnowledge: ['Pakistan & Sindh', 'World Around Us'],
  },
  10: {
    mathematics: ['Numbers & Operations', 'Algebra & Patterns'],
    science: ['Genetics & Health', 'Electricity & Magnetism'],
    english: ['Grammar Basics', 'Vocabulary Builders'],
    generalKnowledge: ['Pakistan & Sindh', 'World Around Us'],
  },
};

export const ACHIEVEMENTS = [
  {
    name: 'First Step',
    description: 'Complete your very first quiz.',
    icon: 'Footprints',
    criteria: 'first_quiz',
    xpReward: 0,
  },
  {
    name: 'Quick Learner',
    description: 'Score 80% or more in a single quiz.',
    icon: 'Zap',
    criteria: 'score_80',
    xpReward: 25,
  },
  {
    name: 'Quiz Master',
    description: 'Complete 10 quizzes.',
    icon: 'Crown',
    criteria: 'ten_quizzes',
    xpReward: 50,
  },
  {
    name: 'Perfect Score',
    description: 'Answer every question correctly in a quiz.',
    icon: 'Star',
    criteria: 'perfect_score',
    xpReward: 50,
  },
  {
    name: 'Consistent Learner',
    description: 'Complete quizzes on 3 consecutive days.',
    icon: 'CalendarCheck',
    criteria: 'three_day_streak',
    xpReward: 40,
  },
  {
    name: 'Knowledge Champion',
    description: 'Earn 1,000 XP in total.',
    icon: 'Trophy',
    criteria: 'xp_1000',
    xpReward: 100,
  },
];
