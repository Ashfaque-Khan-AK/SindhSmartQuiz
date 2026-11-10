import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: 80,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 400,
    },
    icon: {
      type: String,
      trim: true,
      default: 'BookOpen',
    },
    color: {
      type: String,
      trim: true,
      default: 'primary',
    },
    grades: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Grade' }],
      default: [],
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

subjectSchema.index({ name: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
