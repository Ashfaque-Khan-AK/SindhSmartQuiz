import mongoose from 'mongoose';
import { DIFFICULTIES } from '../utils/validation.js';

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Topic name is required'],
      trim: true,
      maxlength: 100,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    gradeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grade',
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      default: 'easy',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

topicSchema.index({ subjectId: 1, gradeId: 1, name: 1 }, { unique: true });
topicSchema.index({ gradeId: 1, subjectId: 1, isActive: 1, name: 1 });

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
