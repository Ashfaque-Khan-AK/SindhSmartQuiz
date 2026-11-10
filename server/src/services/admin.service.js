import mongoose from 'mongoose';
import Achievement from '../models/Achievement.js';
import Grade from '../models/Grade.js';
import Question from '../models/Question.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { validators } from '../utils/validators.js';
import { daysAgo } from '../utils/dates.js';

function paginate(page, limit) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  return { page: safePage, limit: safeLimit, skip: (safePage - 1) * safeLimit };
}

function paged(items, total, page, limit) {
  return {
    items,
    pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
  };
}

function formatDay(date) {
  const shifted = new Date(new Date(date).getTime() + 5 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
}

export async function getAdminDashboard() {
  const since = daysAgo(13);

  const [
    totalStudents,
    activeStudents,
    totalSubjects,
    totalTopics,
    totalQuestions,
    totalAttempts,
    averageAgg,
    attemptsOverTime,
    subjectParticipation,
    gradePerformance,
    recentAttempts,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'student', isActive: true }),
    Subject.countDocuments({ isActive: true }),
    Topic.countDocuments({ isActive: true }),
    Question.countDocuments({ isActive: true }),
    QuizAttempt.countDocuments({ status: 'submitted' }),
    QuizAttempt.aggregate([
      { $match: { status: 'submitted' } },
      { $group: { _id: null, average: { $avg: '$percentage' } } },
    ]),
    QuizAttempt.aggregate([
      { $match: { status: 'submitted', submittedAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$submittedAt', timezone: '+05:00' },
          },
          attempts: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    QuizAttempt.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$subjectId',
          attempts: { $sum: 1 },
          average: { $avg: '$percentage' },
        },
      },
      { $lookup: { from: 'subjects', localField: '_id', foreignField: '_id', as: 'subject' } },
      { $unwind: '$subject' },
      {
        $project: {
          _id: 0,
          name: '$subject.name',
          icon: '$subject.icon',
          attempts: 1,
          average: { $round: ['$average', 0] },
        },
      },
      { $sort: { attempts: -1 } },
    ]),
    QuizAttempt.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$gradeId',
          attempts: { $sum: 1 },
          average: { $avg: '$percentage' },
        },
      },
      { $lookup: { from: 'grades', localField: '_id', foreignField: '_id', as: 'grade' } },
      { $unwind: '$grade' },
      {
        $project: {
          _id: 0,
          name: '$grade.name',
          number: '$grade.number',
          attempts: 1,
          average: { $round: ['$average', 0] },
        },
      },
      { $sort: { number: 1 } },
    ]),
    QuizAttempt.find({ status: 'submitted' })
      .sort({ submittedAt: -1 })
      .limit(6)
      .populate('studentId', 'name grade')
      .populate('subjectId', 'name icon')
      .populate('topicId', 'name')
      .lean(),
  ]);

  const byDay = new Map(attemptsOverTime.map((row) => [row._id, row.attempts]));
  const series = [];
  for (let offset = 13; offset >= 0; offset -= 1) {
    const key = formatDay(daysAgo(offset));
    series.push({ date: key, attempts: byDay.get(key) || 0 });
  }

  return {
    stats: {
      totalStudents,
      activeStudents,
      totalSubjects,
      totalTopics,
      totalQuestions,
      totalAttempts,
      averageScore: Math.round(averageAgg[0]?.average || 0),
    },
    charts: {
      attemptsOverTime: series,
      subjectParticipation,
      gradePerformance,
    },
    recentAttempts: recentAttempts.map((attempt) => ({
      id: attempt._id,
      student: attempt.studentId?.name || 'Unknown',
      grade: attempt.studentId?.grade || null,
      subject: attempt.subjectId?.name || '—',
      topic: attempt.topicId?.name || '—',
      percentage: attempt.percentage,
      submittedAt: attempt.submittedAt,
    })),
  };
}

export async function listStudents(query = {}) {
  const { page, limit, skip } = paginate(query.page, query.limit);
  const filter = { role: 'student' };

  if (query.grade) filter.grade = validators.gradeNumber(query.grade);
  if (query.search) {
    const regex = new RegExp(String(query.search).trim().slice(0, 60), 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }
  if (query.status === 'active') filter.isActive = true;
  if (query.status === 'inactive') filter.isActive = false;

  const [students, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  const ids = students.map((student) => student._id);
  const stats = await QuizAttempt.aggregate([
    { $match: { studentId: { $in: ids }, status: 'submitted' } },
    {
      $group: {
        _id: '$studentId',
        quizzes: { $sum: 1 },
        average: { $avg: '$percentage' },
        lastAttemptAt: { $max: '$submittedAt' },
      },
    },
  ]);
  const statsMap = new Map(stats.map((row) => [String(row._id), row]));

  return paged(
    students.map((student) => {
      const stat = statsMap.get(String(student._id));
      return {
        id: student._id,
        name: student.name,
        email: student.email,
        grade: student.grade,
        language: student.language,
        totalXP: student.totalXP,
        isActive: student.isActive,
        createdAt: student.createdAt,
        lastLoginAt: student.lastLoginAt,
        quizzes: stat?.quizzes || 0,
        averageScore: stat ? Math.round(stat.average) : 0,
        lastAttemptAt: stat?.lastAttemptAt || null,
      };
    }),
    total,
    page,
    limit
  );
}

export async function setStudentStatus(studentId, isActive) {
  validators.objectId(studentId, 'student');
  const student = await User.findOneAndUpdate(
    { _id: studentId, role: 'student' },
    { $set: { isActive: Boolean(isActive) } },
    { new: true }
  );
  if (!student) throw ApiError.notFound('Student not found');
  return { id: student._id, name: student.name, isActive: student.isActive };
}

/* ---------------------------------- Grades --------------------------------- */

export async function listGrades() {
  const [grades, topicCounts, studentCounts] = await Promise.all([
    Grade.find().sort({ number: 1 }).lean(),
    Topic.aggregate([{ $group: { _id: '$gradeId', topics: { $sum: 1 } } }]),
    User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$grade', students: { $sum: 1 } } },
    ]),
  ]);

  const topicMap = new Map(topicCounts.map((row) => [String(row._id), row.topics]));
  const studentMap = new Map(studentCounts.map((row) => [row._id, row.students]));

  return grades.map((grade) => ({
    ...grade,
    id: grade._id,
    topics: topicMap.get(String(grade._id)) || 0,
    students: studentMap.get(grade.number) || 0,
  }));
}

export async function createGrade(payload = {}) {
  const number = validators.gradeNumber(payload.number);
  const exists = await Grade.findOne({ number });
  if (exists) throw ApiError.conflict(`Grade ${number} already exists`);

  return Grade.create({
    number,
    name: validators.optionalString(payload.name, 'Grade name', { max: 60 }) || `Grade ${number}`,
    isActive: payload.isActive !== false,
  });
}

export async function updateGrade(gradeId, payload = {}) {
  validators.objectId(gradeId, 'grade');
  const grade = await Grade.findById(gradeId);
  if (!grade) throw ApiError.notFound('Grade not found');

  if (payload.number !== undefined) {
    const number = validators.gradeNumber(payload.number);
    if (number !== grade.number) {
      const taken = await Grade.findOne({ number, _id: { $ne: grade._id } });
      if (taken) throw ApiError.conflict(`Grade ${number} already exists`);
      grade.number = number;
    }
  }

  if (payload.name !== undefined) {
    grade.name =
      validators.optionalString(payload.name, 'Grade name', { max: 60 }) || `Grade ${grade.number}`;
  }

  if (payload.isActive !== undefined) grade.isActive = Boolean(payload.isActive);

  await grade.save();
  return grade;
}

export async function deleteGrade(gradeId) {
  validators.objectId(gradeId, 'grade');
  const grade = await Grade.findById(gradeId);
  if (!grade) throw ApiError.notFound('Grade not found');

  const [topics, subjects] = await Promise.all([
    Topic.countDocuments({ gradeId: grade._id }),
    Subject.countDocuments({ grades: grade._id }),
  ]);

  if (topics || subjects) {
    throw ApiError.badRequest(
      `Grade ${grade.number} is in use by ${topics} topic(s) and ${subjects} subject(s). Deactivate it instead.`
    );
  }

  await grade.deleteOne();
  return true;
}

/* --------------------------------- Subjects -------------------------------- */

async function resolveGradeIds(list) {
  if (!Array.isArray(list) || list.length === 0) {
    throw ApiError.badRequest('Assign the subject to at least one grade');
  }
  const ids = [...new Set(list.map((value) => String(value)))];
  ids.forEach((value) => validators.objectId(value, 'grade'));
  const count = await Grade.countDocuments({ _id: { $in: ids } });
  if (count !== ids.length) throw ApiError.badRequest('One or more grades were not found');
  return ids;
}

export async function listSubjects(query = {}) {
  const filter = {};
  if (query.gradeId) {
    validators.objectId(query.gradeId, 'grade');
    filter.grades = query.gradeId;
  }
  if (query.search) {
    filter.name = new RegExp(String(query.search).trim().slice(0, 60), 'i');
  }

  const subjects = await Subject.find(filter)
    .sort({ name: 1 })
    .populate('grades', 'name number')
    .lean();

  const [topicCounts, questionCounts] = await Promise.all([
    Topic.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: { subjectId: '$subjectId', gradeId: '$gradeId' }, count: { $sum: 1 } } },
    ]),
    Question.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$subjectId', count: { $sum: 1 } } },
    ]),
  ]);

  const topicMap = new Map();
  for (const row of topicCounts) {
    const key = String(row._id.subjectId);
    topicMap.set(key, (topicMap.get(key) || 0) + row.count);
  }
  const questionMap = new Map(questionCounts.map((row) => [String(row._id), row.count]));

  return subjects.map((subject) => ({
    ...subject,
    id: subject._id,
    topics: topicMap.get(String(subject._id)) || 0,
    questions: questionMap.get(String(subject._id)) || 0,
  }));
}

export async function createSubject(payload = {}) {
  return Subject.create({
    name: validators.requiredString(payload.name, 'Subject name', { max: 80 }),
    description: validators.optionalString(payload.description, 'Description', { max: 400 }),
    icon: validators.optionalString(payload.icon, 'Icon', { max: 60 }) || 'BookOpen',
    color: validators.optionalString(payload.color, 'Color', { max: 30 }) || 'primary',
    grades: await resolveGradeIds(payload.grades),
    isActive: payload.isActive !== false,
  });
}

export async function updateSubject(subjectId, payload = {}) {
  validators.objectId(subjectId, 'subject');
  const subject = await Subject.findById(subjectId);
  if (!subject) throw ApiError.notFound('Subject not found');

  if (payload.name !== undefined) {
    subject.name = validators.requiredString(payload.name, 'Subject name', { max: 80 });
  }
  if (payload.description !== undefined) {
    subject.description = validators.optionalString(payload.description, 'Description', {
      max: 400,
    });
  }
  if (payload.icon !== undefined) {
    subject.icon = validators.optionalString(payload.icon, 'Icon', { max: 60 }) || 'BookOpen';
  }
  if (payload.color !== undefined) {
    subject.color = validators.optionalString(payload.color, 'Color', { max: 30 }) || 'primary';
  }
  if (payload.grades !== undefined) {
    subject.grades = await resolveGradeIds(payload.grades);
  }
  if (payload.isActive !== undefined) subject.isActive = Boolean(payload.isActive);

  await subject.save();
  return subject;
}

export async function deleteSubject(subjectId) {
  validators.objectId(subjectId, 'subject');
  const subject = await Subject.findById(subjectId);
  if (!subject) throw ApiError.notFound('Subject not found');

  const [topics, questions] = await Promise.all([
    Topic.countDocuments({ subjectId: subject._id }),
    Question.countDocuments({ subjectId: subject._id }),
  ]);

  if (topics || questions) {
    throw ApiError.badRequest(
      `This subject has ${topics} topic(s) and ${questions} question(s). Deactivate it or remove its content first.`
    );
  }

  await subject.deleteOne();
  return true;
}

/* ---------------------------------- Topics --------------------------------- */

export async function listTopics(query = {}) {
  const filter = {};
  if (query.gradeId) {
    validators.objectId(query.gradeId, 'grade');
    filter.gradeId = query.gradeId;
  }
  if (query.subjectId) {
    validators.objectId(query.subjectId, 'subject');
    filter.subjectId = query.subjectId;
  }
  if (query.search) {
    filter.name = new RegExp(String(query.search).trim().slice(0, 60), 'i');
  }

  const topics = await Topic.find(filter)
    .sort({ name: 1 })
    .populate('subjectId', 'name icon')
    .populate('gradeId', 'name number')
    .lean();

  const counts = await Question.aggregate([
    { $match: { topicId: { $in: topics.map((topic) => topic._id) } } },
    { $group: { _id: '$topicId', questions: { $sum: 1 }, active: { $sum: { $cond: ['$isActive', 1, 0] } } } },
  ]);
  const countMap = new Map(counts.map((row) => [String(row._id), row]));

  return topics.map((topic) => ({
    ...topic,
    id: topic._id,
    questions: countMap.get(String(topic._id))?.questions || 0,
    activeQuestions: countMap.get(String(topic._id))?.active || 0,
  }));
}

async function resolveTopicParents(payload) {
  validators.objectId(payload.subjectId, 'subject');
  validators.objectId(payload.gradeId, 'grade');

  const [subject, grade] = await Promise.all([
    Subject.findById(payload.subjectId),
    Grade.findById(payload.gradeId),
  ]);

  if (!subject) throw ApiError.notFound('Subject not found');
  if (!grade) throw ApiError.notFound('Grade not found');
  if (!subject.grades.some((id) => String(id) === String(grade._id))) {
    throw ApiError.badRequest('Assign this subject to the grade first');
  }

  return { subject, grade };
}

export async function createTopic(payload = {}) {
  const { subject, grade } = await resolveTopicParents(payload);
  const name = validators.requiredString(payload.name, 'Topic name', { max: 100 });

  const duplicate = await Topic.findOne({ name, subjectId: subject._id, gradeId: grade._id });
  if (duplicate) throw ApiError.conflict('This topic already exists for the selected subject and grade');

  return Topic.create({
    name,
    subjectId: subject._id,
    gradeId: grade._id,
    difficulty: validators.difficulty(payload.difficulty, { fallback: 'easy' }),
    isActive: payload.isActive !== false,
  });
}

export async function updateTopic(topicId, payload = {}) {
  validators.objectId(topicId, 'topic');
  const topic = await Topic.findById(topicId);
  if (!topic) throw ApiError.notFound('Topic not found');

  if (payload.name !== undefined) {
    topic.name = validators.requiredString(payload.name, 'Topic name', { max: 100 });
  }
  if (payload.difficulty !== undefined) {
    topic.difficulty = validators.difficulty(payload.difficulty, { fallback: topic.difficulty });
  }
  if (payload.subjectId !== undefined || payload.gradeId !== undefined) {
    const parents = await resolveTopicParents({
      subjectId: payload.subjectId || topic.subjectId,
      gradeId: payload.gradeId || topic.gradeId,
    });
    topic.subjectId = parents.subject._id;
    topic.gradeId = parents.grade._id;
  }
  if (payload.isActive !== undefined) topic.isActive = Boolean(payload.isActive);

  await topic.save();
  return topic;
}

export async function deleteTopic(topicId) {
  validators.objectId(topicId, 'topic');
  const topic = await Topic.findById(topicId);
  if (!topic) throw ApiError.notFound('Topic not found');

  const questions = await Question.countDocuments({ topicId: topic._id });
  if (questions) {
    throw ApiError.badRequest(
      `This topic has ${questions} question(s). Delete the questions or deactivate the topic first.`
    );
  }

  await topic.deleteOne();
  return true;
}

/* -------------------------------- Questions -------------------------------- */

function buildQuestionPayload(payload, topic) {
  const options = Array.isArray(payload.options) ? payload.options : [];
  if (options.length !== 4) {
    throw ApiError.badRequest('Exactly four answer options are required');
  }

  const correctAnswer = Number(payload.correctAnswer);
  if (!Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
    throw ApiError.badRequest('Select one correct answer (A–D)');
  }

  return {
    topicId: topic._id,
    gradeId: topic.gradeId,
    subjectId: topic.subjectId,
    question: validators.translation(payload.question, 'Question text'),
    options: options.map((option, index) =>
      validators.translation(option, `Option ${String.fromCharCode(65 + index)}`)
    ),
    correctAnswer,
    explanation: validators.translation(payload.explanation || {}, 'Explanation', {
      requireEnglish: false,
    }),
    difficulty: validators.difficulty(payload.difficulty, { fallback: 'easy' }),
    isActive: payload.isActive !== false,
  };
}

export async function listQuestions(query = {}) {
  const { page, limit, skip } = paginate(query.page, query.limit);
  const filter = {};

  if (query.gradeId) {
    validators.objectId(query.gradeId, 'grade');
    filter.gradeId = query.gradeId;
  }
  if (query.subjectId) {
    validators.objectId(query.subjectId, 'subject');
    filter.subjectId = query.subjectId;
  }
  if (query.topicId) {
    validators.objectId(query.topicId, 'topic');
    filter.topicId = query.topicId;
  }
  if (query.difficulty) filter.difficulty = validators.difficulty(query.difficulty);
  if (query.status === 'active') filter.isActive = true;
  if (query.status === 'inactive') filter.isActive = false;
  if (query.search) {
    filter['question.en'] = new RegExp(String(query.search).trim().slice(0, 80), 'i');
  }

  const [items, total] = await Promise.all([
    Question.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('topicId', 'name')
      .populate('subjectId', 'name')
      .populate('gradeId', 'name number')
      .lean(),
    Question.countDocuments(filter),
  ]);

  return paged(items, total, page, limit);
}

export async function createQuestion(payload = {}) {
  validators.objectId(payload.topicId, 'topic');
  const topic = await Topic.findById(payload.topicId);
  if (!topic) throw ApiError.notFound('Topic not found');

  return Question.create(buildQuestionPayload(payload, topic));
}

export async function updateQuestion(questionId, payload = {}) {
  validators.objectId(questionId, 'question');
  const question = await Question.findById(questionId);
  if (!question) throw ApiError.notFound('Question not found');

  let topic = await Topic.findById(question.topicId);
  if (payload.topicId && String(payload.topicId) !== String(question.topicId)) {
    validators.objectId(payload.topicId, 'topic');
    topic = await Topic.findById(payload.topicId);
    if (!topic) throw ApiError.notFound('Topic not found');
  }

  if (!topic) throw ApiError.badRequest('The question topic no longer exists');

  const update = buildQuestionPayload(
    {
      question: payload.question ?? question.question,
      options: payload.options ?? question.options,
      correctAnswer: payload.correctAnswer ?? question.correctAnswer,
      explanation: payload.explanation ?? question.explanation,
      difficulty: payload.difficulty ?? question.difficulty,
      isActive: payload.isActive ?? question.isActive,
    },
    topic
  );

  Object.assign(question, update);
  await question.save();
  return question;
}

export async function setQuestionStatus(questionId, isActive) {
  validators.objectId(questionId, 'question');
  const question = await Question.findByIdAndUpdate(
    questionId,
    { $set: { isActive: Boolean(isActive) } },
    { new: true }
  );
  if (!question) throw ApiError.notFound('Question not found');
  return question;
}

export async function deleteQuestion(questionId) {
  validators.objectId(questionId, 'question');
  const question = await Question.findByIdAndDelete(questionId);
  if (!question) throw ApiError.notFound('Question not found');
  return true;
}

/* -------------------------------- Attempts --------------------------------- */

export async function listAttempts(query = {}) {
  const { page, limit, skip } = paginate(query.page, query.limit);
  const filter = { status: 'submitted' };

  if (query.grade) {
    const number = validators.gradeNumber(query.grade);
    const grade = await Grade.findOne({ number }).select('_id').lean();
    if (!grade) return paged([], 0, page, limit);
    filter.gradeId = grade._id;
  }
  if (query.subjectId) {
    validators.objectId(query.subjectId, 'subject');
    filter.subjectId = query.subjectId;
  }
  if (query.search) {
    const regex = new RegExp(String(query.search).trim().slice(0, 60), 'i');
    const students = await User.find({ role: 'student', name: regex }).select('_id').lean();
    filter.studentId = { $in: students.map((student) => student._id) };
  }

  const [items, total, summary] = await Promise.all([
    QuizAttempt.find(filter)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('studentId', 'name email grade')
      .populate('subjectId', 'name icon')
      .populate('topicId', 'name')
      .populate('gradeId', 'name number')
      .lean(),
    QuizAttempt.countDocuments(filter),
    QuizAttempt.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          average: { $avg: '$percentage' },
          correct: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: '$totalQuestions' },
        },
      },
    ]),
  ]);

  return {
    ...paged(
      items.map((attempt) => ({
        id: attempt._id,
        student: attempt.studentId
          ? {
              id: attempt.studentId._id,
              name: attempt.studentId.name,
              email: attempt.studentId.email,
              grade: attempt.studentId.grade,
            }
          : null,
        grade: attempt.gradeId?.number ?? attempt.studentId?.grade ?? null,
        subject: attempt.subjectId?.name || '—',
        topic: attempt.topicId?.name || '—',
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.correctAnswers,
        score: attempt.score,
        percentage: attempt.percentage,
        timeTaken: attempt.timeTaken,
        submittedAt: attempt.submittedAt,
      })),
      total,
      page,
      limit
    ),
    summary: {
      averageScore: Math.round(summary[0]?.average || 0),
      correctAnswers: summary[0]?.correct || 0,
      totalQuestions: summary[0]?.totalQuestions || 0,
    },
  };
}

/* --------------------------------- Reports --------------------------------- */

export async function getReports() {
  const [
    gradeWise,
    subjectWise,
    hardestTopics,
    topStudents,
    attemptTotals,
    achievementCount,
  ] = await Promise.all([
    QuizAttempt.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$gradeId',
          attempts: { $sum: 1 },
          average: { $avg: '$percentage' },
          best: { $max: '$percentage' },
        },
      },
      { $lookup: { from: 'grades', localField: '_id', foreignField: '_id', as: 'grade' } },
      { $unwind: '$grade' },
      {
        $project: {
          _id: 0,
          name: '$grade.name',
          number: '$grade.number',
          attempts: 1,
          average: { $round: ['$average', 0] },
          best: 1,
        },
      },
      { $sort: { number: 1 } },
    ]),
    QuizAttempt.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$subjectId',
          attempts: { $sum: 1 },
          average: { $avg: '$percentage' },
          best: { $max: '$percentage' },
        },
      },
      { $lookup: { from: 'subjects', localField: '_id', foreignField: '_id', as: 'subject' } },
      { $unwind: '$subject' },
      {
        $project: {
          _id: 0,
          name: '$subject.name',
          icon: '$subject.icon',
          attempts: 1,
          average: { $round: ['$average', 0] },
          best: 1,
        },
      },
      { $sort: { attempts: -1 } },
    ]),
    QuizAttempt.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$topicId',
          attempts: { $sum: 1 },
          average: { $avg: '$percentage' },
        },
      },
      { $match: { attempts: { $gte: 1 } } },
      { $lookup: { from: 'topics', localField: '_id', foreignField: '_id', as: 'topic' } },
      { $unwind: '$topic' },
      {
        $lookup: {
          from: 'subjects',
          localField: 'topic.subjectId',
          foreignField: '_id',
          as: 'subject',
        },
      },
      {
        $project: {
          _id: 0,
          name: '$topic.name',
          subject: { $ifNull: [{ $first: '$subject.name' }, '—'] },
          attempts: 1,
          average: { $round: ['$average', 0] },
        },
      },
      { $sort: { average: 1, attempts: -1 } },
      { $limit: 8 },
    ]),
    User.aggregate([
      { $match: { role: 'student', isActive: true } },
      { $sort: { totalXP: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: 'quizattempts',
          let: { studentId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$studentId', '$$studentId'] }, status: 'submitted' } },
            { $group: { _id: null, quizzes: { $sum: 1 }, average: { $avg: '$percentage' } } },
          ],
          as: 'stats',
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          grade: 1,
          totalXP: 1,
          quizzes: { $ifNull: [{ $first: '$stats.quizzes' }, 0] },
          averageScore: { $round: [{ $ifNull: [{ $first: '$stats.average' }, 0] }, 0] },
        },
      },
    ]),
    QuizAttempt.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: null,
          attempts: { $sum: 1 },
          questions: { $sum: '$totalQuestions' },
          correct: { $sum: '$correctAnswers' },
        },
      },
    ]),
    User.countDocuments({ role: 'student' }),
  ]);

  const totals = attemptTotals[0] || { attempts: 0, questions: 0, correct: 0 };

  return {
    summary: {
      totalAttempts: totals.attempts,
      totalQuestionsAnswered: totals.questions,
      totalCorrect: totals.correct,
      accuracy: totals.questions ? Math.round((totals.correct / totals.questions) * 100) : 0,
      totalStudents: achievementCount,
    },
    gradeWise,
    subjectWise,
    mostAttemptedSubjects: subjectWise.slice(0, 5),
    hardestTopics,
    topStudents,
  };
}

export async function listAchievements() {
  return Achievement.find().sort({ createdAt: 1 }).lean();
}

export { mongoose };
