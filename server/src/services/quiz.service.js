import mongoose from 'mongoose';
import Grade from '../models/Grade.js';
import Question from '../models/Question.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import { ApiError } from '../utils/apiError.js';
import { validators } from '../utils/validators.js';
import { evaluateAchievements } from './achievement.service.js';

const LANGUAGE_FIELDS = ['en', 'ur', 'sd'];

function sanitizeQuestion(question) {
  const text = {};
  const options = [];

  for (const lang of LANGUAGE_FIELDS) {
    text[lang] = question.question?.[lang] || question.question?.en || '';
  }

  for (const option of question.options || []) {
    options.push({
      en: option.en || '',
      ur: option.ur || option.en || '',
      sd: option.sd || option.en || '',
    });
  }

  return {
    id: question._id,
    text,
    options,
    difficulty: question.difficulty,
  };
}

function refId(value) {
  if (!value) return null;
  return value._id || value;
}

function serializeSubject(subject) {
  if (!subject) return null;
  return { id: refId(subject), name: subject.name, icon: subject.icon, color: subject.color };
}

function serializeTopic(topic) {
  if (!topic) return null;
  return { id: refId(topic), name: topic.name };
}

function serializeGrade(grade) {
  if (!grade) return null;
  return { id: refId(grade), name: grade.name, number: grade.number };
}

function performanceMessage(percentage) {
  if (percentage === 100) return 'Perfect score! You are a quiz champion.';
  if (percentage >= 80) return 'Excellent work! You have mastered this topic.';
  if (percentage >= 60) return 'Good effort! Keep practising to reach the top.';
  if (percentage >= 40) return 'Nice try! Review the answers and try again.';
  return 'Every attempt is a step forward. Review and retry!';
}

async function resolveGrade(student, gradeId) {
  let grade = null;

  if (gradeId) {
    validators.objectId(gradeId, 'grade');
    grade = await Grade.findOne({ _id: gradeId, isActive: true });
  } else if (student.grade) {
    grade = await Grade.findOne({ number: student.grade, isActive: true });
  }

  if (!grade) {
    throw ApiError.badRequest('Please choose your grade before starting a quiz');
  }

  return grade;
}

async function sampleQuestions({ gradeId, subjectId, topicId, difficulty, count }) {
  const baseMatch = {
    gradeId: new mongoose.Types.ObjectId(gradeId),
    subjectId: new mongoose.Types.ObjectId(subjectId),
    isActive: true,
  };

  if (difficulty !== 'mixed') baseMatch.difficulty = difficulty;

  let questions = [];

  if (topicId) {
    questions = await Question.aggregate([
      { $match: { ...baseMatch, topicId: new mongoose.Types.ObjectId(topicId) } },
      { $sample: { size: count } },
    ]);
  }

  if (questions.length < count) {
    const exclude = questions.map((item) => item._id);
    const extra = await Question.aggregate([
      {
        $match: {
          ...baseMatch,
          ...(exclude.length ? { _id: { $nin: exclude } } : {}),
        },
      },
      { $sample: { size: count - questions.length } },
    ]);
    questions = questions.concat(extra);
  }

  return questions;
}

export async function startQuiz(student, payload = {}) {
  const language = validators.language(payload.language, student.language || 'en');
  const difficulty =
    payload.difficulty === 'mixed'
      ? 'mixed'
      : validators.difficulty(payload.difficulty, { allowMixed: true, fallback: 'mixed' });
  const questionCount = validators.questionCount(payload.questionCount);
  const timeLimitMinutes = validators.timeLimit(payload.timeLimit);
  const grade = await resolveGrade(student, payload.gradeId);

  validators.objectId(payload.subjectId, 'subject');
  const subject = await Subject.findOne({
    _id: payload.subjectId,
    isActive: true,
    grades: grade._id,
  });

  if (!subject) {
    throw ApiError.notFound('This subject is not available for the selected grade');
  }

  let topic = null;
  if (payload.topicId) {
    validators.objectId(payload.topicId, 'topic');
    topic = await Topic.findOne({
      _id: payload.topicId,
      subjectId: subject._id,
      gradeId: grade._id,
      isActive: true,
    });
    if (!topic) throw ApiError.notFound('This topic is not available');
  }

  const questions = await sampleQuestions({
    gradeId: grade._id,
    subjectId: subject._id,
    topicId: topic?._id,
    difficulty,
    count: questionCount,
  });

  if (!questions.length) {
    const suffix = difficulty === 'mixed' ? '' : ` at ${difficulty} difficulty`;
    throw ApiError.badRequest(`No published questions are available${suffix} for this selection yet.`);
  }

  const partial = questions.length < questionCount;
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + timeLimitMinutes * 60 * 1000);

  const attempt = await QuizAttempt.create({
    studentId: student._id,
    gradeId: grade._id,
    subjectId: subject._id,
    topicId: topic?._id || null,
    questions: questions.map((question) => ({ questionId: question._id })),
    totalQuestions: questions.length,
    difficulty,
    language,
    timeLimitMinutes,
    startedAt,
    expiresAt,
    status: 'in-progress',
  });

  return {
    attemptId: attempt._id,
    status: attempt.status,
    grade: serializeGrade(grade),
    subject: serializeSubject(subject),
    topic: serializeTopic(topic),
    questions: questions.map(sanitizeQuestion),
    totalQuestions: questions.length,
    requestedQuestions: questionCount,
    partial,
    difficulty,
    language,
    timeLimitMinutes,
    startedAt,
    expiresAt,
    serverTime: Date.now(),
    remainingSeconds: Math.max(0, Math.round((expiresAt.getTime() - Date.now()) / 1000)),
  };
}

export async function getActiveQuiz(student, attemptId) {
  validators.objectId(attemptId, 'attempt');

  const attempt = await QuizAttempt.findOne({ _id: attemptId, studentId: student._id });
  if (!attempt) throw ApiError.notFound('Quiz attempt not found');

  if (attempt.status === 'submitted') {
    throw ApiError.conflict('This quiz has already been submitted. Open the result page instead.');
  }

  if (Date.now() > new Date(attempt.expiresAt).getTime()) {
    const result = await submitQuiz(student, attemptId, [], { auto: true });
    return { expired: true, result };
  }

  await attempt.populate([
    { path: 'gradeId', select: 'name number' },
    { path: 'subjectId', select: 'name icon color' },
    { path: 'topicId', select: 'name' },
  ]);

  const questionIds = attempt.questions.map((entry) => entry.questionId);
  const questions = await Question.find({ _id: { $in: questionIds } }).lean();
  const byId = new Map(questions.map((question) => [String(question._id), question]));

  const ordered = attempt.questions
    .map((entry) => byId.get(String(entry.questionId)))
    .filter(Boolean)
    .map(sanitizeQuestion);

  return {
    attemptId: attempt._id,
    status: attempt.status,
    grade: serializeGrade(attempt.gradeId),
    subject: serializeSubject(attempt.subjectId),
    topic: serializeTopic(attempt.topicId),
    questions: ordered,
    totalQuestions: attempt.totalQuestions,
    requestedQuestions: attempt.totalQuestions,
    partial: false,
    difficulty: attempt.difficulty,
    language: attempt.language,
    timeLimitMinutes: attempt.timeLimitMinutes,
    startedAt: attempt.startedAt,
    expiresAt: attempt.expiresAt,
    serverTime: Date.now(),
    remainingSeconds: Math.max(
      0,
      Math.round((new Date(attempt.expiresAt).getTime() - Date.now()) / 1000)
    ),
  };
}

export async function submitQuiz(student, attemptId, answers = [], { auto = false } = {}) {
  validators.objectId(attemptId, 'attempt');

  const attempt = await QuizAttempt.findOne({ _id: attemptId, studentId: student._id });
  if (!attempt) throw ApiError.notFound('Quiz attempt not found');

  if (attempt.status === 'submitted') {
    const result = await buildResult(attempt._id, student._id);
    return { ...result, alreadySubmitted: true };
  }

  const questionIds = attempt.questions.map((entry) => entry.questionId);
  const questionDocs = await Question.find({ _id: { $in: questionIds } }).lean();
  const questionMap = new Map(questionDocs.map((question) => [String(question._id), question]));

  const answerMap = new Map();
  for (const answer of Array.isArray(answers) ? answers : []) {
    const questionId = String(answer?.questionId || '');
    const selected = Number(answer?.selectedAnswer);
    if (
      questionMap.has(questionId) &&
      Number.isInteger(selected) &&
      selected >= 0 &&
      selected <= 3
    ) {
      answerMap.set(questionId, selected);
    }
  }

  const graded = attempt.questions.map((entry) => {
    const question = questionMap.get(String(entry.questionId));
    const selectedAnswer = answerMap.has(String(entry.questionId))
      ? answerMap.get(String(entry.questionId))
      : null;
    const isCorrect =
      question && selectedAnswer !== null ? selectedAnswer === question.correctAnswer : null;

    return { questionId: entry.questionId, selectedAnswer, isCorrect };
  });

  const totalQuestions = graded.length;
  const correctAnswers = graded.filter((item) => item.isCorrect === true).length;
  const incorrectAnswers = graded.filter((item) => item.isCorrect === false).length;
  const unanswered = Math.max(0, totalQuestions - correctAnswers - incorrectAnswers);
  const percentage = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const isPerfect = totalQuestions > 0 && correctAnswers === totalQuestions;
  const xpEarned = correctAnswers * 10 + 20 + (isPerfect ? 30 : 0);

  const submittedAt = new Date();
  const limitSeconds = attempt.timeLimitMinutes * 60;
  const elapsedSeconds = Math.round((submittedAt.getTime() - new Date(attempt.startedAt).getTime()) / 1000);
  const timeTaken = Math.max(0, Math.min(elapsedSeconds, limitSeconds));
  const autoSubmitted = auto || Date.now() > new Date(attempt.expiresAt).getTime();

  const claimed = await QuizAttempt.findOneAndUpdate(
    { _id: attempt._id, studentId: student._id, status: 'in-progress' },
    {
      $set: {
        questions: graded,
        correctAnswers,
        incorrectAnswers,
        unanswered,
        score: correctAnswers,
        percentage,
        xpEarned,
        submittedAt,
        timeTaken,
        status: 'submitted',
        autoSubmitted,
      },
    },
    { new: true }
  );

  // A parallel submission won the race: return that saved result instead of double-awarding XP.
  if (!claimed) {
    const existing = await buildResult(attempt._id, student._id);
    return { ...existing, alreadySubmitted: true };
  }

  await User.updateOne({ _id: student._id }, { $inc: { totalXP: xpEarned } });
  const studentAfterQuizXP = await User.findById(student._id);
  await evaluateAchievements(studentAfterQuizXP, claimed);
  const finalStudent = await User.findById(student._id);
  const result = await buildResult(claimed._id, student._id);

  return {
    ...result,
    xpEarned,
    studentTotalXP: finalStudent?.totalXP ?? 0,
  };
}

async function buildResult(attemptId, studentId) {
  const attempt = await QuizAttempt.findById(attemptId)
    .populate('gradeId', 'name number')
    .populate('subjectId', 'name icon color')
    .populate('topicId', 'name')
    .lean();

  if (!attempt) throw ApiError.notFound('Quiz attempt not found');

  const achievements = attempt.earnedAchievementIds?.length
    ? await Achievement.find({ _id: { $in: attempt.earnedAchievementIds } }).lean()
    : [];

  return {
    attemptId: attempt._id,
    status: attempt.status,
    grade: serializeGrade(attempt.gradeId),
    subject: serializeSubject(attempt.subjectId),
    topic: serializeTopic(attempt.topicId),
    totalQuestions: attempt.totalQuestions,
    correctAnswers: attempt.correctAnswers,
    incorrectAnswers: attempt.incorrectAnswers,
    unanswered: attempt.unanswered,
    score: attempt.score,
    percentage: attempt.percentage,
    xpEarned: attempt.xpEarned,
    achievementXP: attempt.achievementXP || 0,
    timeTaken: attempt.timeTaken,
    timeLimitMinutes: attempt.timeLimitMinutes,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    autoSubmitted: attempt.autoSubmitted,
    language: attempt.language,
    difficulty: attempt.difficulty,
    achievements: achievements.map((item) => ({
      id: item._id,
      name: item.name,
      description: item.description,
      icon: item.icon,
      xpReward: item.xpReward,
    })),
    performanceMessage: performanceMessage(attempt.percentage),
  };
}

export async function getResult(student, attemptId) {
  validators.objectId(attemptId, 'attempt');
  const attempt = await QuizAttempt.findOne({ _id: attemptId, studentId: student._id }).lean();
  if (!attempt) throw ApiError.notFound('Quiz attempt not found');
  if (attempt.status !== 'submitted') {
    throw ApiError.badRequest('This quiz has not been submitted yet');
  }

  const result = await buildResult(attempt._id, student._id);
  return { ...result, studentTotalXP: student.totalXP };
}

export async function getReview(student, attemptId) {
  validators.objectId(attemptId, 'attempt');

  const attempt = await QuizAttempt.findOne({ _id: attemptId, studentId: student._id })
    .populate('gradeId', 'name number')
    .populate('subjectId', 'name icon color')
    .populate('topicId', 'name')
    .lean();

  if (!attempt) throw ApiError.notFound('Quiz attempt not found');
  if (attempt.status !== 'submitted') {
    throw ApiError.badRequest('Submit the quiz before reviewing answers');
  }

  const questionIds = attempt.questions.map((entry) => entry.questionId);
  const questions = await Question.find({ _id: { $in: questionIds } }).lean();
  const byId = new Map(questions.map((question) => [String(question._id), question]));

  const items = attempt.questions.map((entry, index) => {
    const question = byId.get(String(entry.questionId));
    return {
      number: index + 1,
      questionId: entry.questionId,
      text: question?.question || { en: 'This question is no longer available', ur: '', sd: '' },
      options: question?.options || [],
      correctAnswer: question?.correctAnswer ?? null,
      selectedAnswer: entry.selectedAnswer,
      isCorrect: entry.isCorrect,
      explanation: question?.explanation || { en: '', ur: '', sd: '' },
      difficulty: question?.difficulty || 'easy',
    };
  });

  return {
    attemptId: attempt._id,
    grade: serializeGrade(attempt.gradeId),
    subject: serializeSubject(attempt.subjectId),
    topic: serializeTopic(attempt.topicId),
    totalQuestions: attempt.totalQuestions,
    correctAnswers: attempt.correctAnswers,
    incorrectAnswers: attempt.incorrectAnswers,
    unanswered: attempt.unanswered,
    percentage: attempt.percentage,
    score: attempt.score,
    submittedAt: attempt.submittedAt,
    language: attempt.language,
    questions: items,
  };
}
