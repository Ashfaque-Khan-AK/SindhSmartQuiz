import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240,
    },
    icon: {
      type: String,
      trim: true,
      default: 'Award',
    },
    criteria: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    xpReward: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
