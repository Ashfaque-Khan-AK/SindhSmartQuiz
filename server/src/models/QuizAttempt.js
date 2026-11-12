import mongoose from 'mongoose';

const attemptQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedAnswer: {
      type: Number,
      min: 0,
      max: 3,
      default: null,
    },
    isCorrect: {
      type: Boolean,
      default: null,
    },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    gradeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grade',
      required: true,
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      default: null,
      index: true,
    },
    questions: {
      type: [attemptQuestionSchema],
      default: [],
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    correctAnswers: { type: Number, default: 0, min: 0 },
    incorrectAnswers: { type: Number, default: 0, min: 0 },
    unanswered: { type: Number, default: 0, min: 0 },
    score: { type: Number, default: 0, min: 0 },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    xpEarned: { type: Number, default: 0, min: 0 },
    achievementXP: { type: Number, default: 0, min: 0 },
    earnedAchievementIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'mixed',
    },
    language: {
      type: String,
      enum: ['en', 'ur', 'sd'],
      default: 'en',
    },
    timeLimitMinutes: {
      type: Number,
      default: 10,
      min: 1,
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    timeTaken: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'submitted'],
      default: 'in-progress',
      index: true,
    },
    autoSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ studentId: 1, status: 1, submittedAt: -1 });
quizAttemptSchema.index({ studentId: 1, gradeId: 1, status: 1, subjectId: 1 });
quizAttemptSchema.index({ studentId: 1, subjectId: 1, status: 1, submittedAt: -1 });
quizAttemptSchema.index({ status: 1, submittedAt: -1 });
quizAttemptSchema.index({ submittedAt: -1 });
quizAttemptSchema.index({ studentId: 1, createdAt: -1 });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

export default QuizAttempt;
