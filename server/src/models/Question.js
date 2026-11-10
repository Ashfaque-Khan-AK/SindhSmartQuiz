import mongoose from 'mongoose';
import { DIFFICULTIES } from '../utils/validation.js';

const translationSchema = new mongoose.Schema(
  {
    en: { type: String, trim: true, default: '' },
    ur: { type: String, trim: true, default: '' },
    sd: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
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
    question: {
      type: translationSchema,
      required: true,
    },
    options: {
      type: [translationSchema],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length === 4;
        },
        message: 'A question must have exactly four options',
      },
      required: true,
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    explanation: {
      type: translationSchema,
      default: () => ({}),
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      default: 'easy',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

questionSchema.index({ gradeId: 1, subjectId: 1, topicId: 1, isActive: 1 });
questionSchema.index({ gradeId: 1, subjectId: 1, difficulty: 1, isActive: 1 });

questionSchema.pre('validate', function ensureEnglish(next) {
  if (!this.question || !this.question.en) {
    return next(new Error('English question text is required'));
  }
  if (!Array.isArray(this.options) || this.options.length !== 4) {
    return next(new Error('A question must have exactly four options'));
  }
  if (this.options.some((option) => !option || !option.en)) {
    return next(new Error('Every option needs English text'));
  }
  return next();
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
