import mongoose from 'mongoose';

const userSkillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    targetRole: {
      type: String,
      default: 'Full-Stack Developer',
    },
    existingSkills: { type: [String], default: [] },
    technicalSkills: { type: [String], default: [] },
    softSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    coveragePercent: { type: Number, default: 0 },
    roadmap: [
      {
        skill: String,
        priority: String,
        recommendation: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('UserSkill', userSkillSchema);
