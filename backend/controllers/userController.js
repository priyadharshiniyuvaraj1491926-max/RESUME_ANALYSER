import fs from 'fs';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import JobMatch from '../models/JobMatch.js';
import UserSkill from '../models/UserSkill.js';
import InterviewSession from '../models/InterviewSession.js';
import Report from '../models/Report.js';
import BuiltResume from '../models/BuiltResume.js';
import { recommendCareers } from '../services/careerService.js';

export async function getDashboardOverview(req, res, next) {
  try {
    const userId = req.user._id;
    const analyses = await ResumeAnalysis.find({ userId, status: 'completed' }).sort({ createdAt: -1 });
    const userSkill = await UserSkill.findOne({ userId });

    const totalResumesAnalyzed = analyses.length;
    const latestAtsScore = totalResumesAnalyzed > 0 ? analyses[0].atsScore : 0;
    const averageAtsScore =
      totalResumesAnalyzed > 0
        ? Math.round(analyses.reduce((sum, a) => sum + (a.atsScore || 0), 0) / totalResumesAnalyzed)
        : 0;

    const detectedSkills = analyses[0]?.detectedSkills || [];
    const recommendedRoles = recommendCareers(detectedSkills);

    const atsProgress = [...analyses]
      .slice(0, 8)
      .reverse()
      .map((a, idx) => ({
        label: `#${idx + 1}`,
        score: a.atsScore,
      }));

    const skillGapChart = userSkill
      ? [
          { category: 'Existing', count: userSkill.existingSkills?.length || 0 },
          { category: 'Missing', count: userSkill.missingSkills?.length || 0 },
        ]
      : detectedSkills.length > 0
      ? [
          { category: 'Technical', count: analyses[0].technicalSkills?.length || 0 },
          { category: 'Soft', count: analyses[0].softSkills?.length || 0 },
        ]
      : [];

    const recentHistory = analyses.slice(0, 5).map((a) => ({
      _id: a._id,
      resumeName: a.resumeName,
      atsScore: a.atsScore,
      analysisMode: a.analysisMode,
      status: a.status,
      createdAt: a.createdAt,
    }));

    return res.json({
      stats: {
        totalResumesAnalyzed,
        latestAtsScore,
        averageAtsScore,
        detectedSkillsCount: detectedSkills.length,
      },
      detectedSkills,
      recommendedRoles,
      recentHistory,
      atsProgress,
      skillGapChart,
    });
  } catch (err) {
    next(err);
  }
}

export async function getNotifications(req, res, next) {
  try {
    const recent = await ResumeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('resumeName atsScore status createdAt');

    const notifications = recent.map((item) => ({
      title: item.status === 'completed' ? 'Analysis Completed' : 'Analysis Issue',
      message: `${item.resumeName}: Estimated ATS Score ${item.atsScore}/100`,
      createdAt: item.createdAt,
    }));

    return res.json({ notifications });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { fullName, targetRole } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (fullName) user.fullName = fullName.trim();
    if (targetRole) user.targetRole = targetRole.trim();
    await user.save();

    return res.json({ message: 'Profile updated.', user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const { analysisAlerts, weeklyTips, allowExternalAi } = req.body;
    const user = await User.findById(req.user._id);
    user.preferences = {
      analysisAlerts: Boolean(analysisAlerts),
      weeklyTips: Boolean(weeklyTips),
      allowExternalAi: Boolean(allowExternalAi),
    };
    await user.save();
    return res.json({ message: 'Preferences updated.', user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New passwords do not match.' });
    }
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();
    return res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function deleteAccount(req, res, next) {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Current password is required to delete account.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const resumes = await Resume.find({ userId: user._id });
    for (const r of resumes) {
      if (r.filePath && fs.existsSync(r.filePath)) {
        fs.unlinkSync(r.filePath);
      }
    }

    await Promise.all([
      Resume.deleteMany({ userId: user._id }),
      ResumeAnalysis.deleteMany({ userId: user._id }),
      JobMatch.deleteMany({ userId: user._id }),
      UserSkill.deleteMany({ userId: user._id }),
      InterviewSession.deleteMany({ userId: user._id }),
      Report.deleteMany({ userId: user._id }),
      BuiltResume.deleteMany({ userId: user._id }),
      User.findByIdAndDelete(user._id),
    ]);

    return res.json({ message: 'Account and all associated records deleted.' });
  } catch (err) {
    next(err);
  }
}
