import Resume from '../models/Resume.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import UserSkill from '../models/UserSkill.js';
import { performRuleBasedAnalysis } from '../services/nlpService.js';
import { calculateAtsScore } from '../services/atsScoringService.js';
import { enhanceAnalysisWithLlm } from '../services/llmProviderService.js';
import { computeSkillGap } from '../services/careerService.js';
import { generateResumeImprovements } from '../services/resumeImproverService.js';

export async function runAnalysis(req, res, next) {
  const startedAt = Date.now();
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }
    if (resume.extractionStatus !== 'extracted' || !resume.extractedText) {
      return res.status(400).json({ message: 'Cannot analyze a resume whose text extraction failed.' });
    }

    const useExternalAi = Boolean(req.body?.useExternalAi) && Boolean(req.user?.preferences?.allowExternalAi || req.body?.useExternalAi);
    const inputCharCount = resume.extractedText.length;
    const base = performRuleBasedAnalysis(resume.extractedText);
    const { mode, analysis: finalAnalysis } = await enhanceAnalysisWithLlm(
      resume.extractedText,
      base,
      useExternalAi
    );
    const { atsScore, atsBreakdown } = calculateAtsScore(resume.extractedText, finalAnalysis);
    const improvementSuggestions = generateResumeImprovements(finalAnalysis);

    if (process.env.NODE_ENV !== 'production') {
      console.log('[ResumeAnalysis]', {
        resumeId: String(resume._id),
        fileType: resume.fileType,
        inputCharCount,
        detectedSkillsCount: finalAnalysis.detectedSkills?.length || 0,
        atsScore,
      });
    }

    const record = await ResumeAnalysis.create({
      userId: req.user._id,
      resumeId: resume._id,
      resumeName: resume.originalName,
      analysisMode: mode,
      status: 'completed',
      processingMs: Date.now() - startedAt,
      extractedSections: finalAnalysis.extractedSections,
      detectedSkills: finalAnalysis.detectedSkills,
      technicalSkills: finalAnalysis.technicalSkills,
      softSkills: finalAnalysis.softSkills,
      missingSections: finalAnalysis.missingSections,
      strengths: finalAnalysis.strengths,
      weaknesses: finalAnalysis.weaknesses,
      contentSuggestions: finalAnalysis.contentSuggestions,
      formattingFeedback: finalAnalysis.formattingFeedback,
      atsScore,
      atsBreakdown,
      improvementSuggestions,
    });

    // Refresh UserSkill snapshot
    const gap = computeSkillGap(
      finalAnalysis.technicalSkills,
      finalAnalysis.softSkills,
      req.user.targetRole || 'Full-Stack Developer'
    );
    await UserSkill.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, ...gap },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      message: `Analysis completed (${mode}).`,
      analysis: record,
    });
  } catch (err) {
    next(err);
  }
}

export async function listAnalyses(req, res, next) {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ analyses });
  } catch (err) {
    next(err);
  }
}

export async function getAnalysisById(req, res, next) {
  try {
    const analysis = await ResumeAnalysis.findOne({ _id: req.params.id, userId: req.user._id });
    if (!analysis) return res.status(404).json({ message: 'Analysis not found.' });
    return res.json({ analysis });
  } catch (err) {
    next(err);
  }
}

export async function deleteAnalysis(req, res, next) {
  try {
    const deleted = await ResumeAnalysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deleted) return res.status(404).json({ message: 'Analysis record not found.' });
    return res.json({ message: 'Analysis record deleted.' });
  } catch (err) {
    next(err);
  }
}

export async function generateImprovementsForAnalysis(req, res, next) {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.analysisId,
      userId: req.user._id,
    });
    if (!analysis) return res.status(404).json({ message: 'Analysis not found.' });

    if (!analysis.improvementSuggestions || analysis.improvementSuggestions.length === 0) {
      analysis.improvementSuggestions = generateResumeImprovements(analysis);
      await analysis.save();
    }
    return res.json({ suggestions: analysis.improvementSuggestions });
  } catch (err) {
    next(err);
  }
}

export async function decideImprovement(req, res, next) {
  try {
    const { suggestionId, status } = req.body;
    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid suggestion status.' });
    }
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.analysisId,
      userId: req.user._id,
    });
    if (!analysis) return res.status(404).json({ message: 'Analysis not found.' });

    const item = analysis.improvementSuggestions.find((s) => s.id === suggestionId);
    if (!item) return res.status(404).json({ message: 'Suggestion not found.' });
    item.status = status;
    await analysis.save();

    return res.json({ suggestions: analysis.improvementSuggestions });
  } catch (err) {
    next(err);
  }
}
