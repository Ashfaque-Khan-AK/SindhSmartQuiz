import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import Achievement from '../models/Achievement.js';
import Grade from '../models/Grade.js';
import Question from '../models/Question.js';
import QuizAttempt from '../models/QuizAttempt.js';
import StudentAchievement from '../models/StudentAchievement.js';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import { evaluateAchievements } from '../services/achievement.service.js';
import { ACHIEVEMENTS, CURRICULUM, QUESTION_BANK, SUBJECTS } from './data/index.js';
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } from './adminCredentials.js';

const DEMO_PASSWORD = 'Student@12345';

const DEMO_STUDENTS = [
  { name: 'Ali Raza', email: 'student@sindhsmartquiz.pk', grade: 8, language: 'en', attempts: 4, accuracy: 0.86 },
  { name: 'Ayesha Khan', email: 'ayesha@sindhsmartquiz.pk', grade: 8, language: 'en', attempts: 7, accuracy: 0.92 },
  { name: 'Bilal Ahmed', email: 'bilal@sindhsmartquiz.pk', grade: 7, language: 'ur', attempts: 6, accuracy: 0.78 },
  { name: 'Hina Soomro', email: 'hina@sindhsmartquiz.pk', grade: 9, language: 'sd', attempts: 5, accuracy: 0.84 },
  { name: 'Usman Ali', email: 'usman@sindhsmartquiz.pk', grade: 10, language: 'en', attempts: 8, accuracy: 0.88 },
  { name: 'Zara Memon', email: 'zara@sindhsmartquiz.pk', grade: 6, language: 'sd', attempts: 3, accuracy: 0.72 },
  { name: 'Fatima Noor', email: 'fatima@sindhsmartquiz.pk', grade: 8, language: 'ur', attempts: 5, accuracy: 0.95 },
];

function mulberry32(seed) {
  let value = seed;
  return function random() {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260101);
const pick = (list) => list[Math.floor(rng() * list.length)];

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function seedGrades() {
  const grades = {};
  for (const number of [6, 7, 8, 9, 10]) {
    const grade = await Grade.findOneAndUpdate(
      { number },
      { $set: { name: `Grade ${number}`, isActive: true } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    grades[number] = grade;
  }
  return grades;
}

async function seedSubjects(grades) {
  const gradeIds = Object.values(grades).map((grade) => grade._id);
  const subjects = {};

  for (const subject of SUBJECTS) {
    const doc = await Subject.findOneAndUpdate(
      { name: subject.name },
      {
        $set: {
          description: subject.description,
          icon: subject.icon,
          color: subject.color,
          grades: gradeIds,
          isActive: true,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    subjects[subject.key] = doc;
  }

  return subjects;
}

async function seedTopics(grades, subjects) {
  const topicMap = new Map();

  for (const [gradeNumber, subjectTopics] of Object.entries(CURRICULUM)) {
    const grade = grades[Number(gradeNumber)];

    for (const [subjectKey, topicNames] of Object.entries(subjectTopics)) {
      const subject = subjects[subjectKey];

      for (const [index, name] of topicNames.entries()) {
        const topic = await Topic.findOneAndUpdate(
          { name, subjectId: subject._id, gradeId: grade._id },
          { $set: { difficulty: index === 0 ? 'easy' : 'medium', isActive: true } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        topicMap.set(`${grade.number}|${subjectKey}|${name}`, topic);
      }
    }
  }

  return topicMap;
}

async function seedQuestions(topicMap) {
  const operations = QUESTION_BANK.map((row, index) => {
    const topic = topicMap.get(`${row.grade}|${row.subject}|${row.topic}`);
    if (!topic) throw new Error(`Missing topic for ${row.grade} ${row.subject} ${row.topic}`);

    // Shuffle options deterministically so the correct answer is not always A.
    const order = shuffle([0, 1, 2, 3]);
    const options = order.map((position) => row.options[position]);
    const correctAnswer = order.indexOf(row.correct);

    return {
      updateOne: {
        filter: { topicId: topic._id, 'question.en': row.en },
        update: {
          $set: {
            topicId: topic._id,
            gradeId: topic.gradeId,
            subjectId: topic.subjectId,
            question: { en: row.en, ur: row.ur, sd: row.sd },
            options,
            correctAnswer,
            explanation: row.explanation,
            difficulty: row.difficulty,
            isActive: true,
          },
        },
        upsert: true,
      },
    };
  });

  const result = await Question.bulkWrite(operations, { ordered: false });
  return {
    upserted: result.upsertedCount || 0,
    updated: result.modifiedCount || 0,
    total: QUESTION_BANK.length,
  };
}

async function seedAchievements() {
  for (const achievement of ACHIEVEMENTS) {
    await Achievement.findOneAndUpdate(
      { criteria: achievement.criteria },
      { $set: { ...achievement, isActive: true } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }
  return ACHIEVEMENTS.length;
}

async function seedUsers() {
  let admin = await User.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      isActive: true,
    });
  }

  const students = [];
  for (const demo of DEMO_STUDENTS) {
    let student = await User.findOne({ email: demo.email });
    if (!student) {
      student = await User.create({
        name: demo.name,
        email: demo.email,
        password: DEMO_PASSWORD,
        role: 'student',
        grade: demo.grade,
        language: demo.language,
        isActive: true,
      });
    }
    students.push({ student, demo });
  }

  return { admin, students };
}

async function seedDemoAttempts(student, demo, grades, subjects) {
  const existing = await QuizAttempt.countDocuments({ studentId: student._id });
  if (existing > 0) return { attempts: 0, xp: student.totalXP };

  const grade = grades[student.grade];
  if (!grade) return { attempts: 0, xp: student.totalXP };

  const subjectList = Object.values(subjects);
  const attemptCount = demo.attempts;
  let totalXP = 0;
  let lastAttempt = null;

  for (let index = 0; index < attemptCount; index += 1) {
    const subject = pick(subjectList);
    const topics = await Topic.find({ subjectId: subject._id, gradeId: grade._id, isActive: true }).lean();
    if (!topics.length) continue;
    const topic = pick(topics);

    let pool = await Question.find({
      gradeId: grade._id,
      subjectId: subject._id,
      topicId: topic._id,
      isActive: true,
    }).lean();

    if (pool.length < 5) {
      pool = await Question.find({
        gradeId: grade._id,
        subjectId: subject._id,
        isActive: true,
      }).lean();
    }
    if (pool.length < 3) continue;

    const desired = rng() > 0.55 ? 10 : 5;
    const count = Math.min(desired, pool.length);
    const selected = shuffle(pool).slice(0, count);

    const answers = selected.map((question) => {
      const correct = rng() < demo.accuracy;
      const selectedAnswer = correct
        ? question.correctAnswer
        : pick([0, 1, 2, 3].filter((value) => value !== question.correctAnswer));
      return {
        questionId: question._id,
        selectedAnswer,
        isCorrect: selectedAnswer === question.correctAnswer,
      };
    });

    const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
    const incorrectAnswers = answers.length - correctAnswers;
    const percentage = Math.round((correctAnswers / answers.length) * 100);
    const isPerfect = correctAnswers === answers.length;
    const xpEarned = correctAnswers * 10 + 20 + (isPerfect ? 30 : 0);
    const daysBack = index * 2 + Math.floor(rng() * 2);
    const submittedAt = new Date(Date.now() - daysBack * 86400000 - Math.floor(rng() * 8) * 3600000);
    const timeTaken = 120 + Math.floor(rng() * 380);
    const startedAt = new Date(submittedAt.getTime() - timeTaken * 1000);

    lastAttempt = await QuizAttempt.create({
      studentId: student._id,
      gradeId: grade._id,
      subjectId: subject._id,
      topicId: topic._id,
      questions: answers,
      totalQuestions: answers.length,
      correctAnswers,
      incorrectAnswers,
      unanswered: 0,
      score: correctAnswers,
      percentage,
      xpEarned,
      difficulty: 'mixed',
      language: student.language,
      timeLimitMinutes: 10,
      startedAt,
      expiresAt: new Date(startedAt.getTime() + 10 * 60 * 1000),
      submittedAt,
      timeTaken,
      status: 'submitted',
      autoSubmitted: false,
    });

    totalXP += xpEarned;
  }

  if (totalXP > 0) {
    await User.updateOne({ _id: student._id }, { $set: { totalXP } });
  }

  if (lastAttempt) {
    const refreshed = await User.findById(student._id);
    await evaluateAchievements(refreshed, lastAttempt);
  }

  const finalUser = await User.findById(student._id).lean();
  return { attempts: attemptCount, xp: finalUser.totalXP };
}

async function seed({ fresh = false } = {}) {
  await connectDatabase();

  if (fresh) {
    console.log('[seed] --fresh received: clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Grade.deleteMany({}),
      Subject.deleteMany({}),
      Topic.deleteMany({}),
      Question.deleteMany({}),
      QuizAttempt.deleteMany({}),
      Achievement.deleteMany({}),
      StudentAchievement.deleteMany({}),
    ]);
  }

  const grades = await seedGrades();
  console.log(`[seed] Grades ready: ${Object.keys(grades).join(', ')}`);

  const subjects = await seedSubjects(grades);
  console.log(`[seed] Subjects ready: ${Object.values(subjects).map((item) => item.name).join(', ')}`);

  const topicMap = await seedTopics(grades, subjects);
  console.log(`[seed] Topics ready: ${topicMap.size}`);

  const questionResult = await seedQuestions(topicMap);
  console.log(
    `[seed] Question bank: ${questionResult.total} questions (${questionResult.upserted} new, ${questionResult.updated} updated)`
  );

  const achievementCount = await seedAchievements();
  console.log(`[seed] Achievements ready: ${achievementCount}`);

  const { admin, students } = await seedUsers();
  console.log(`[seed] Admin ready: ${admin.email}`);

  for (const { student, demo } of students) {
    const result = await seedDemoAttempts(student, demo, grades, subjects);
    console.log(
      `[seed] ${student.email} (Grade ${student.grade}) — attempts: ${result.attempts}, XP: ${result.xp}`
    );
  }

  const counts = {
    grades: await Grade.countDocuments(),
    subjects: await Subject.countDocuments(),
    topics: await Topic.countDocuments(),
    questions: await Question.countDocuments(),
    students: await User.countDocuments({ role: 'student' }),
    attempts: await QuizAttempt.countDocuments(),
  };

  console.log('\n[seed] ✅ Seeding complete');
  console.log(counts);
  console.log('\nDemo credentials:');
  console.log(`  Admin:   ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`  Student: student@sindhsmartquiz.pk / ${DEMO_PASSWORD}`);
}

seed({ fresh: process.argv.includes('--fresh') })
  .then(async () => {
    await disconnectDatabase();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('[seed] Failed:', error);
    await disconnectDatabase();
    process.exit(1);
  });
