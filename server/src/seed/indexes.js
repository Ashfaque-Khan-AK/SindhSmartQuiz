import mongoose from 'mongoose';
import Achievement from '../models/Achievement.js';
import Grade from '../models/Grade.js';
import Question from '../models/Question.js';
import QuizAttempt from '../models/QuizAttempt.js';
import StudentAchievement from '../models/StudentAchievement.js';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import { connectMongo } from '../config/atlas.js';
import { config } from '../config/env.js';

const models = {
  Achievement,
  Grade,
  Question,
  QuizAttempt,
  StudentAchievement,
  Subject,
  Topic,
  User,
};

async function run() {
  mongoose.set('autoIndex', false);
  await connectMongo(config.mongoUri, { autoIndex: false });

  for (const [name, model] of Object.entries(models)) {
    const indexes = await model.createIndexes();
    const count = Array.isArray(indexes) ? indexes.length : 'all';
    console.log(`[indexes] ${name}: ${count} index(es) ready`);
  }

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('[indexes] Failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
