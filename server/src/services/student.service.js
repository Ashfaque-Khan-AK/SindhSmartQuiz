import mongoose from 'mongoose';
import Achievement from '../models/Achievement.js';
import Grade from '../models/Grade.js';
import Question from '../models/Question.js';
import QuizAttempt from '../models/QuizAttempt.js';
import StudentAchievement from '../models/StudentAchievement.js';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { currentDayStreak, longestDayStreak } from '../utils/dates.js';
import { validators } from '../utils/validators.js';
import { ACHIEVEMENT_TARGETS, buildAchievementSnapshot } from './achievement.service.js';

function idOf(value) {
  return String(value?._id || value);
}

function serializeSubject(subject) {
  return {
    id: idOf(subject),
    name: subject.name,
    icon: subject.icon,
    color: subject.color,
  };
}

function serializeAttempt(attempt) {
  return {
    id: idOf(attempt),
    subject: attempt.subjectId?.name
      ? serializeSubject(attempt.subjectId)
      : null,
    topic: attempt.topicId?.name ? { id: idOf(attempt.topicId), name: attempt.topicId.name } : null,
    totalQuestions: attempt.totalQuestions,
    correctAnswers: attempt.correctAnswers,
    incorrectAnswers: attempt.incorrectAnswers,
    unanswered: attempt.unanswered,
    score: attempt.score,
    percentage: attempt.percentage,
    xpEarned: attempt.xpEarned,
    timeTaken: attempt.timeTaken,
    submittedAt: attempt.submittedAt,
    status: attempt.status,
  };
}

async function resolveGrade(student, gradeId) {
  let grade = null;
  if (gradeId) {
    validators.objectId(gradeId, 'grade');
    grade = await Grade.findOne({ _id: gradeId, isActive: true });
  } else if (student.grade) {
    grade = await Grade.findOne({ number: student.grade, isActive: true });
  }
  if (!grade) throw ApiError.badRequest('Please choose your grade first');
  return grade;
}

export async function getSubjectsForGrade(gradeObjectId, studentId) {
  const subjects = await Subject.find({ grades: gradeObjectId, isActive: true })
    .sort({ name: 1 })
    .lean();

  if (!subjects.length) return [];

  const subjectIds = subjects.map((subject) => subject._id);
  const statsStudentId = new mongoose.Types.ObjectId(studentId);

  const [topicCounts, questionCounts, attemptStats] = await Promise.all([
    Topic.aggregate([
      { $match: { gradeId: gradeObjectId, subjectId: { $in: subjectIds }, isActive: true } },
      { $group: { _id: '$subjectId', topics: { $sum: 1 } } },
    ]),
    Question.aggregate([
      { $match: { gradeId: gradeObjectId, subjectId: { $in: subjectIds }, isActive: true } },
      { $group: { _id: '$subjectId', questions: { $sum: 1 } } },
    ]),
    QuizAttempt.aggregate([
      { $match: { studentId: statsStudentId, gradeId: gradeObjectId, status: 'submitted' } },
      {
        $group: {
          _id: '$subjectId',
          attempts: { $sum: 1 },
          average: { $avg: '$percentage' },
          best: { $max: '$percentage' },
        },
      },
    ]),
  ]);

  const topicMap = new Map(topicCounts.map((row) => [String(row._id), row.topics]));
  const questionMap = new Map(questionCounts.map((row) => [String(row._id), row.questions]));
  const attemptMap = new Map(attemptStats.map((row) => [String(row._id), row]));

  return subjects.map((subject) => {
    const key = String(subject._id);
    const stats = attemptMap.get(key);
    return {
      ...serializeSubject(subject),
      description: subject.description,
      topicsCount: topicMap.get(key) || 0,
      questionsCount: questionMap.get(key) || 0,
      attempts: stats?.attempts || 0,
      progress: stats ? Math.round(stats.average) : 0,
      bestScore: stats ? Math.round(stats.best) : 0,
    };
  });
}

export async function getDashboard(student) {
  const [grade, attempts] = await Promise.all([
    student.grade ? Grade.findOne({ number: student.grade }).lean() : Promise.resolve(null),
    QuizAttempt.find({ studentId: student._id, status: 'submitted' })
      .select('percentage submittedAt')
      .sort({ submittedAt: -1 })
      .lean(),
  ]);

  const quizzesAttempted = attempts.length;
  const averageScore = quizzesAttempted
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / quizzesAttempted)
    : 0;

  const [subjects, recentAttempts, recentAchievements, totalAchievements, earnedCount] =
    await Promise.all([
      grade ? getSubjectsForGrade(grade._id, student._id) : [],
      QuizAttempt.aggregate([
        { $match: { studentId: student._id, status: 'submitted' } },
        { $sort: { submittedAt: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'subjects',
            localField: 'subjectId',
            foreignField: '_id',
            as: 'subject',
          },
        },
        { $unwind: { path: '$subject', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'topics',
            localField: 'topicId',
            foreignField: '_id',
            as: 'topic',
          },
        },
        { $unwind: { path: '$topic', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            subjectId: '$subject',
            topicId: '$topic',
            totalQuestions: 1,
            correctAnswers: 1,
            incorrectAnswers: 1,
            unanswered: 1,
            score: 1,
            percentage: 1,
            xpEarned: 1,
            timeTaken: 1,
            submittedAt: 1,
            status: 1,
          },
        },
      ]),
      StudentAchievement.aggregate([
        { $match: { studentId: student._id } },
        { $sort: { earnedAt: -1 } },
        { $limit: 4 },
        {
          $lookup: {
            from: 'achievements',
            localField: 'achievementId',
            foreignField: '_id',
            as: 'achievement',
          },
        },
        { $unwind: { path: '$achievement', preserveNullAndEmptyArrays: true } },
        { $project: { achievementId: '$achievement', earnedAt: 1 } },
      ]),
      Achievement.countDocuments({ isActive: true }),
      StudentAchievement.countDocuments({ studentId: student._id }),
    ]);

  return {
    student: {
      id: student._id,
      name: student.name,
      email: student.email,
      grade: student.grade,
      language: student.language,
      totalXP: student.totalXP,
      avatar: student.avatar,
    },
    grade: grade ? { id: grade._id, name: grade.name, number: grade.number } : null,
    stats: {
      totalXP: student.totalXP,
      quizzesAttempted,
      averageScore,
      currentStreak: currentDayStreak(attempts.map((attempt) => attempt.submittedAt)),
      bestStreak: longestDayStreak(attempts.map((attempt) => attempt.submittedAt)),
      achievementsEarned: earnedCount,
      totalAchievements,
    },
    subjects,
    recentAttempts: recentAttempts.map(serializeAttempt),
    recentAchievements: recentAchievements
      .filter((row) => row.achievementId)
      .map((row) => ({
        id: row.achievementId._id,
        name: row.achievementId.name,
        description: row.achievementId.description,
        icon: row.achievementId.icon,
        earnedAt: row.earnedAt,
      })),
  };
}

export async function getSubjects(student, gradeId) {
  const grade = await resolveGrade(student, gradeId);
  const subjects = await getSubjectsForGrade(grade._id, student._id);

  return {
    grade: { id: grade._id, name: grade.name, number: grade.number },
    subjects,
  };
}

export async function getTopics(student, subjectId, gradeId) {
  validators.objectId(subjectId, 'subject');
  const grade = await resolveGrade(student, gradeId);

  const [subject, topics] = await Promise.all([
    Subject.findOne({ _id: subjectId, isActive: true, grades: grade._id }).lean(),
    Topic.find({
      subjectId,
      gradeId: grade._id,
      isActive: true,
    })
      .sort({ name: 1 })
      .lean(),
  ]);

  if (!subject) throw ApiError.notFound('Subject not found for this grade');

  if (!topics.length) {
    return {
      grade: { id: grade._id, name: grade.name, number: grade.number },
      subject: serializeSubject(subject),
      topics: [],
    };
  }

  const topicIds = topics.map((topic) => topic._id);
  const studentId = new mongoose.Types.ObjectId(student._id);

  const [questionCounts, attemptStats] = await Promise.all([
    Question.aggregate([
      { $match: { topicId: { $in: topicIds }, isActive: true } },
      { $group: { _id: '$topicId', questions: { $sum: 1 } } },
    ]),
    QuizAttempt.aggregate([
      { $match: { studentId, topicId: { $in: topicIds }, status: 'submitted' } },
      { $sort: { submittedAt: -1 } },
      {
        $group: {
          _id: '$topicId',
          attempts: { $sum: 1 },
          best: { $max: '$percentage' },
          average: { $avg: '$percentage' },
          lastPercentage: { $first: '$percentage' },
          lastSubmittedAt: { $first: '$submittedAt' },
        },
      },
    ]),
  ]);

  const questionMap = new Map(questionCounts.map((row) => [String(row._id), row.questions]));
  const attemptMap = new Map(attemptStats.map((row) => [String(row._id), row]));

  const serializedTopics = topics.map((topic) => {
    const key = String(topic._id);
    const stats = attemptMap.get(key);
    return {
      id: topic._id,
      name: topic.name,
      difficulty: topic.difficulty,
      questionsCount: questionMap.get(key) || 0,
      attempts: stats?.attempts || 0,
      bestScore: stats ? Math.round(stats.best) : 0,
      averageScore: stats ? Math.round(stats.average) : 0,
      lastPercentage: stats?.lastPercentage ?? null,
      lastAttemptedAt: stats?.lastSubmittedAt || null,
    };
  });

  return {
    grade: { id: grade._id, name: grade.name, number: grade.number },
    subject: { ...serializeSubject(subject), description: subject.description },
    topics: serializedTopics,
    totalQuestions: serializedTopics.reduce((sum, topic) => sum + topic.questionsCount, 0),
  };
}

export async function getHistory(student, query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const filter = { studentId: student._id, status: 'submitted' };

  if (query.subjectId && mongoose.isValidObjectId(query.subjectId)) {
    filter.subjectId = query.subjectId;
  }

  const [items, total] = await Promise.all([
    QuizAttempt.find(filter)
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('subjectId', 'name icon color')
      .populate('topicId', 'name')
      .lean(),
    QuizAttempt.countDocuments(filter),
  ]);

  return {
    items: items.map(serializeAttempt),
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getLeaderboard(student, query = {}) {
  const gradeNumber = query.grade ? validators.gradeNumber(query.grade) : null;

  const match = { role: 'student', isActive: true };
  if (gradeNumber) match.grade = gradeNumber;

  const rows = await User.aggregate([
    { $match: match },
    {
      $lookup: {
        from: 'quizattempts',
        let: { studentId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$studentId', '$$studentId'] }, { $eq: ['$status', 'submitted'] }],
              },
            },
          },
          { $group: { _id: null, quizzes: { $sum: 1 }, average: { $avg: '$percentage' } } },
        ],
        as: 'attemptStats',
      },
    },
    {
      $addFields: {
        quizzes: { $ifNull: [{ $first: '$attemptStats.quizzes' }, 0] },
        averageScore: { $round: [{ $ifNull: [{ $first: '$attemptStats.average' }, 0] }, 0] },
      },
    },
    { $project: { name: 1, grade: 1, totalXP: 1, avatar: 1, quizzes: 1, averageScore: 1 } },
    { $sort: { totalXP: -1, averageScore: -1, name: 1 } },
    { $limit: 200 },
  ]);

  const items = rows.map((row, index) => ({
    rank: index + 1,
    studentId: row._id,
    name: row.name,
    grade: row.grade,
    avatar: row.avatar,
    totalXP: row.totalXP,
    quizzes: row.quizzes,
    averageScore: row.averageScore,
    isMe: String(row._id) === String(student._id),
  }));

  let me = items.find((item) => item.isMe) || null;

  if (!me) {
    const ownAttempts = await QuizAttempt.aggregate([
      { $match: { studentId: new mongoose.Types.ObjectId(student._id), status: 'submitted' } },
      { $group: { _id: null, quizzes: { $sum: 1 }, average: { $avg: '$percentage' } } },
    ]);
    const own = ownAttempts[0];
    me = {
      rank: null,
      studentId: student._id,
      name: student.name,
      grade: student.grade,
      avatar: student.avatar,
      totalXP: student.totalXP,
      quizzes: own?.quizzes || 0,
      averageScore: Math.round(own?.average || 0),
      isMe: true,
    };
  }

  return {
    grade: gradeNumber,
    items,
    me,
    totalStudents: items.length,
  };
}

export async function getAchievements(student) {
  const [achievements, earnedDocs, snapshot] = await Promise.all([
    Achievement.find({ isActive: true }).sort({ createdAt: 1 }).lean(),
    StudentAchievement.find({ studentId: student._id }).lean(),
    buildAchievementSnapshot(student),
  ]);

  const earnedMap = new Map(earnedDocs.map((row) => [String(row.achievementId), row.earnedAt]));

  const items = achievements.map((achievement) => {
    const rule = ACHIEVEMENT_TARGETS[achievement.criteria] || {
      target: 1,
      metric: 'quizzes',
      label: '',
    };
    const current = snapshot[rule.metric] || 0;
    const earnedAt = earnedMap.get(String(achievement._id)) || null;

    return {
      id: achievement._id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      criteria: achievement.criteria,
      xpReward: achievement.xpReward,
      earned: Boolean(earnedAt),
      earnedAt,
      progress: {
        current: Math.min(current, rule.target),
        raw: current,
        target: rule.target,
        percent: Math.min(100, Math.round((current / rule.target) * 100)),
        label: rule.label,
      },
    };
  });

  return {
    items,
    earnedCount: items.filter((item) => item.earned).length,
    total: items.length,
    snapshot,
  };
}

export async function updateProfile(student, payload = {}) {
  if (payload.name !== undefined) {
    student.name = validators.requiredString(payload.name, 'Full name', { min: 2, max: 80 });
  }

  if (payload.language !== undefined) {
    student.language = validators.language(payload.language, student.language);
  }

  if (payload.avatar !== undefined) {
    student.avatar = validators.optionalString(payload.avatar, 'Avatar', { max: 500 });
  }

  if (payload.grade !== undefined) {
    const number = validators.gradeNumber(payload.grade);
    const grade = await Grade.findOne({ number, isActive: true });
    if (!grade) throw ApiError.badRequest('That grade is not available');
    student.grade = number;
  }

  await student.save();
  return student;
}

export async function changePassword(student, payload = {}) {
  const currentPassword = payload.currentPassword;
  const newPassword = validators.password(payload.newPassword);

  const user = await User.findById(student._id).select('+password');
  if (!user) throw ApiError.notFound('Account not found');

  const matches = await user.comparePassword(String(currentPassword || ''));
  if (!matches) throw ApiError.badRequest('Your current password is incorrect');

  if (await user.comparePassword(newPassword)) {
    throw ApiError.badRequest('The new password must be different from the current password');
  }

  user.password = newPassword;
  await user.save();
  return true;
}
