import Resume from '../models/Resume.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import JobMatch from '../models/JobMatch.js';
import UserSkill from '../models/UserSkill.js';
import InterviewSession from '../models/InterviewSession.js';
import Report from '../models/Report.js';
import BuiltResume from '../models/BuiltResume.js';
import ContactMessage from '../models/ContactMessage.js';
import { matchJobDescription } from '../services/jobMatcherService.js';
import { computeSkillGap, recommendCareers } from '../services/careerService.js';
import { evaluateInterviewAnswer, generateInterviewQuestions } from '../services/interviewService.js';
import { generateAnalysisReportPdf, generateResumeBuilderPdf } from '../services/pdfReportService.js';
import { extractSkillsFromText } from '../services/nlpService.js';

export async function getAtsReport(req, res, next) {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.analysisId,
      userId: req.user._id,
    });
    if (!analysis) return res.status(404).json({ message: 'ATS analysis not found.' });
    return res.json({
      atsScore: analysis.atsScore,
      atsBreakdown: analysis.atsBreakdown,
      analysisMode: analysis.analysisMode,
      disclaimer:
        'Estimated compatibility score based on ResumeIQ AI documented rubric. Not a guaranteed score from any commercial ATS vendor.',
    });
  } catch (err) {
    next(err);
  }
}

export async function runJobMatch(req, res, next) {
  try {
    const { resumeId, jobTitle, jobDescription } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });

    const { detectedSkills } = extractSkillsFromText(resume.extractedText);
    const result = matchJobDescription(resume.extractedText, detectedSkills, jobDescription);

    const match = await JobMatch.create({
      userId: req.user._id,
      resumeId: resume._id,
      resumeName: resume.originalName,
      jobTitle: (jobTitle || 'Target Position').trim(),
      jobDescription,
      ...result,
    });

    return res.status(201).json({ match });
  } catch (err) {
    next(err);
  }
}

export async function listJobMatches(req, res, next) {
  try {
    const matches = await JobMatch.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ matches });
  } catch (err) {
    next(err);
  }
}

export async function analyzeSkillGap(req, res, next) {
  try {
    const targetRole = (req.body?.targetRole || req.user.targetRole || 'Full-Stack Developer').trim();
    const latest = await ResumeAnalysis.findOne({ userId: req.user._id, status: 'completed' }).sort({ createdAt: -1 });

    const gap = computeSkillGap(
      latest?.technicalSkills || [],
      latest?.softSkills || [],
      targetRole
    );

    await UserSkill.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, ...gap },
      { upsert: true, new: true }
    );

    return res.json(gap);
  } catch (err) {
    next(err);
  }
}

export async function getCareerRecommendations(req, res, next) {
  try {
    const latest = await ResumeAnalysis.findOne({ userId: req.user._id, status: 'completed' }).sort({ createdAt: -1 });
    const recommendations = recommendCareers(latest?.detectedSkills || []);
    return res.json({ recommendations });
  } catch (err) {
    next(err);
  }
}

export async function generateInterview(req, res, next) {
  try {
    const targetRole = (req.body?.targetRole || req.user.targetRole || 'Full-Stack Developer').trim();
    const latest = await ResumeAnalysis.findOne({ userId: req.user._id, status: 'completed' }).sort({ createdAt: -1 });
    const questions = generateInterviewQuestions(targetRole, latest?.detectedSkills || []);

    const session = await InterviewSession.create({
      userId: req.user._id,
      targetRole,
      questions,
    });

    return res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
}

export async function listInterviewSessions(req, res, next) {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ sessions });
  } catch (err) {
    next(err);
  }
}

export async function submitInterviewAnswer(req, res, next) {
  try {
    const { questionId, userAnswer } = req.body;
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      userId: req.user._id,
    });
    if (!session) return res.status(404).json({ message: 'Interview session not found.' });

    const q = session.questions.id(questionId);
    if (!q) return res.status(404).json({ message: 'Question not found.' });

    const evalResult = evaluateInterviewAnswer(userAnswer || '');
    q.userAnswer = userAnswer;
    q.score = evalResult.score;
    q.feedback = evalResult.feedback;
    q.improvementSuggestions = evalResult.improvementSuggestions;
    await session.save();

    return res.json({ session });
  } catch (err) {
    next(err);
  }
}

export async function getBuilderDraft(req, res, next) {
  try {
    const draft = await BuiltResume.findOne({ userId: req.user._id });
    return res.json({ draft });
  } catch (err) {
    next(err);
  }
}

export async function saveBuilderDraft(req, res, next) {
  try {
    const draft = await BuiltResume.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, ...req.body },
      { upsert: true, new: true, runValidators: true }
    );
    return res.json({ message: 'Resume draft saved.', draft });
  } catch (err) {
    next(err);
  }
}

export async function exportBuilderPdf(req, res, next) {
  try {
    const buffer = await generateResumeBuilderPdf(req.body);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="ResumeIQ-Resume.pdf"');
    return res.send(buffer);
  } catch (err) {
    next(err);
  }
}

export async function downloadAnalysisReportPdf(req, res, next) {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.analysisId,
      userId: req.user._id,
    });
    if (!analysis) return res.status(404).json({ message: 'Analysis report not found.' });

    await Report.create({
      userId: req.user._id,
      analysisId: analysis._id,
      resumeName: analysis.resumeName,
      atsScore: analysis.atsScore,
    });

    const buffer = await generateAnalysisReportPdf(analysis);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ResumeIQ-Report-${analysis._id}.pdf"`);
    return res.send(buffer);
  } catch (err) {
    next(err);
  }
}

export async function listReports(req, res, next) {
  try {
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ reports });
  } catch (err) {
    next(err);
  }
}

export async function submitContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;
    await ContactMessage.create({ name, email, subject, message });
    return res.status(201).json({
      message: 'Your inquiry has been saved to our database. Thank you for contacting ResumeIQ AI.',
    });
  } catch (err) {
    next(err);
  }
}
