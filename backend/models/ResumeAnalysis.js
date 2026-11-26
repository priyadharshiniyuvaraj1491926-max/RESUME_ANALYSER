import mongoose from 'mongoose';

const improvementSuggestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    category: { type: String, required: true },
    original: { type: String, required: true },
    improved: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { _id: false }
);

const resumeAnalysisSchema = new mongoose.Schema(
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
      index: true,
    },
    resumeName: {
      type: String,
      required: true,
    },
    analysisMode: {
      type: String,
      enum: ['rule-based', 'llm-enhanced'],
      default: 'rule-based',
    },
    status: {
      type: String,
      enum: ['completed', 'failed'],
      default: 'completed',
    },
    processingMs: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    extractedSections: {
      name: { type: String, default: '' },
      contact: {
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
      },
      summary: { type: String, default: '' },
      education: { type: [String], default: [] },
      experience: { type: [String], default: [] },
      projects: { type: [String], default: [] },
      certifications: { type: [String], default: [] },
    },
    detectedSkills: {
      type: [String],
      default: [],
    },
    technicalSkills: {
      type: [String],
      default: [],
    },
    softSkills: {
      type: [String],
      default: [],
    },
    missingSections: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    contentSuggestions: {
      type: [String],
      default: [],
    },
    formattingFeedback: {
      type: [String],
      default: [],
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    atsBreakdown: {
      formatting: { type: Number, default: 0 },
      keywords: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      structure: { type: Number, default: 0 },
      readability: { type: Number, default: 0 },
    },
    improvementSuggestions: {
      type: [improvementSuggestionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Compound indexes for efficient per-user queries
resumeAnalysisSchema.index({ userId: 1, createdAt: -1 });
resumeAnalysisSchema.index({ userId: 1, atsScore: -1 });

export default mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
