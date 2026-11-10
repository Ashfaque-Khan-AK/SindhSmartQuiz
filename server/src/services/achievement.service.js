import Achievement from '../models/Achievement.js';
import QuizAttempt from '../models/QuizAttempt.js';
import StudentAchievement from '../models/StudentAchievement.js';
import User from '../models/User.js';
import { longestDayStreak } from '../utils/dates.js';

export const ACHIEVEMENT_TARGETS = {
  first_quiz: { target: 1, metric: 'quizzes', label: 'Complete 1 quiz' },
  score_80: { target: 80, metric: 'bestScore', label: 'Score 80% or more' },
  ten_quizzes: { target: 10, metric: 'quizzes', label: 'Complete 10 quizzes' },
  perfect_score: { target: 100, metric: 'bestScore', label: 'Score 100% in a quiz' },
  three_day_streak: { target: 3, metric: 'streak', label: 'Quiz on 3 consecutive days' },
  xp_1000: { target: 1000, metric: 'totalXP', label: 'Earn 1,000 XP' },
};

/**
 * Computes the metric snapshot used for both award decisions and progress bars.
 */
export async function buildAchievementSnapshot(student) {
  const attempts = await QuizAttempt.find({ studentId: student._id, status: 'submitted' })
    .select('percentage submittedAt')
    .lean();

  const quizzes = attempts.length;
  const bestScore = attempts.reduce((max, attempt) => Math.max(max, attempt.percentage || 0), 0);

  return {
    quizzes,
    bestScore,
    streak: longestDayStreak(attempts.map((attempt) => attempt.submittedAt)),
    totalXP: student.totalXP || 0,
  };
}

function meetsCriteria(criteria, snapshot) {
  const rule = ACHIEVEMENT_TARGETS[criteria];
  if (!rule) return false;
  return (snapshot[rule.metric] || 0) >= rule.target;
}

/**
 * Awards any newly satisfied achievements. Must run after the attempt is saved
 * and after quiz XP has been added to the student so XP achievements are accurate.
 */
export async function evaluateAchievements(student, attempt) {
  const snapshot = await buildAchievementSnapshot(student);
  const achievements = await Achievement.find({ isActive: true }).lean();
  const alreadyEarned = await StudentAchievement.find({ studentId: student._id })
    .select('achievementId')
    .lean();
  const earnedIds = new Set(alreadyEarned.map((row) => String(row.achievementId)));

  const newlyEarned = [];

  for (const achievement of achievements) {
    if (earnedIds.has(String(achievement._id))) continue;

    if (meetsCriteria(achievement.criteria, snapshot)) {
      const result = await StudentAchievement.updateOne(
        { studentId: student._id, achievementId: achievement._id },
        { $setOnInsert: { earnedAt: new Date() } },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        newlyEarned.push(achievement);
      }
    }
  }

  const achievementXP = newlyEarned.reduce((sum, item) => sum + (item.xpReward || 0), 0);

  if (newlyEarned.length) {
    await QuizAttempt.updateOne(
      { _id: attempt._id },
      {
        $set: {
          earnedAchievementIds: newlyEarned.map((item) => item._id),
          achievementXP,
        },
      }
    );

    if (achievementXP > 0) {
      await User.updateOne({ _id: student._id }, { $inc: { totalXP: achievementXP } });
    }
  }

  return { newlyEarned, achievementXP, snapshot };
}
