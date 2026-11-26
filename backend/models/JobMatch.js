import mongoose from 'mongoose';

const jobMatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    resumeName: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    matchPercentage: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    matchingKeywords: { type: [String], default: [] },
    missingKeywords: { type: [String], default: [] },
    requiredSkills: { type: [String], default: [] },
    existingSkills: { type: [String], default: [] },
    experienceAlignment: { type: String, default: '' },
    recommendations: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('JobMatch', jobMatchSchema);
