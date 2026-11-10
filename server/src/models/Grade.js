import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Grade name is required'],
      trim: true,
      maxlength: 60,
    },
    number: {
      type: Number,
      required: [true, 'Grade number is required'],
      unique: true,
      min: 1,
      max: 12,
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

const Grade = mongoose.model('Grade', gradeSchema);

export default Grade;
