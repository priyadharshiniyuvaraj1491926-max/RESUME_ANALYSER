import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Technical', 'HR', 'Role-Based'],
    required: true,
  },
  question: { type: String, required: true },
  sampleStructure: { type: String, required: true },
  userAnswer: { type: String, default: '' },
  feedback: { type: String, default: '' },
  improvementSuggestions: { type: [String], default: [] },
  score: { type: Number, min: 0, max: 10, default: null },
});

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('InterviewSession', interviewSessionSchema);
