import mongoose from 'mongoose';

const studentAchievementSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
      index: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

studentAchievementSchema.index({ studentId: 1, achievementId: 1 }, { unique: true });
studentAchievementSchema.index({ studentId: 1, earnedAt: -1 });

const StudentAchievement = mongoose.model('StudentAchievement', studentAchievementSchema);

export default StudentAchievement;
