import User from '../models/User.js';
import Resume from '../models/Resume.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import JobMatch from '../models/JobMatch.js';
import UserSkill from '../models/UserSkill.js';
import InterviewSession from '../models/InterviewSession.js';
import Report from '../models/Report.js';
import BuiltResume from '../models/BuiltResume.js';
import ContactMessage from '../models/ContactMessage.js';
import env from '../config/env.js';

export async function getAdminOverview(_req, res, next) {
  try {
    const [
      registeredUsers,
      uploadedResumes,
      completedAnalyses,
      failedAnalyses,
      jobMatches,
      interviewSessions,
      avgAgg,
    ] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      ResumeAnalysis.countDocuments({ status: 'completed' }),
      ResumeAnalysis.countDocuments({ status: 'failed' }),
      JobMatch.countDocuments(),
      InterviewSession.countDocuments(),
      ResumeAnalysis.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, avg: { $avg: '$atsScore' } } },
      ]),
    ]);

    return res.json({
      stats: {
        registeredUsers,
        uploadedResumes,
        completedAnalyses,
        failedAnalyses,
      },
      usage: {
        jobMatches,
        interviewSessions,
        averageAtsScore: avgAgg[0]?.avg ? Math.round(avgAgg[0].avg) : 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const { search = '', role = '', status = '', page = 1, limit = 10 } = req.query;
    const query = {};

    if (search.trim()) {
      const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ fullName: regex }, { email: regex }];
    }
    if (role === 'user' || role === 'admin') query.role = role;
    if (status === 'active' || status === 'suspended') query.status = status;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).select('-password'),
      User.countDocuments(query),
    ]);

    return res.json({
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUserByAdmin(req, res, next) {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    if (id === req.user._id.toString() && (role === 'user' || status === 'suspended')) {
      return res.status(400).json({ message: 'You cannot demote or suspend your own admin account.' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (role && ['user', 'admin'].includes(role)) user.role = role;
    if (status && ['active', 'suspended'].includes(status)) user.status = status;
    await user.save();

    return res.json({ message: 'User updated.', user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

export async function getPlatformUsage(_req, res, next) {
  try {
    const [
      totalUsers,
      activeUsers,
      totalResumes,
      totalAnalyses,
      totalJobMatches,
      totalSkillProfiles,
      totalInterviewSessions,
      totalReports,
      totalBuiltResumes,
      totalContactMessages,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      Resume.countDocuments(),
      ResumeAnalysis.countDocuments(),
      JobMatch.countDocuments(),
      UserSkill.countDocuments(),
      InterviewSession.countDocuments(),
      Report.countDocuments(),
      BuiltResume.countDocuments(),
      ContactMessage.countDocuments(),
    ]);

    return res.json({
      usage: {
        totalUsers,
        activeUsers,
        totalResumes,
        totalAnalyses,
        totalJobMatches,
        totalSkillProfiles,
        totalInterviewSessions,
        totalReports,
        totalBuiltResumes,
        totalContactMessages,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function listMonitoringAnalyses(_req, res, next) {
  try {
    // Privacy-safe projection: never expose private resume text, contact info, or file names
    const records = await ResumeAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('_id analysisMode atsScore status processingMs errorMessage createdAt userId')
      .populate('userId', 'role');

    const analyses = records.map((r) => ({
      _id: r._id,
      userRole: r.userId?.role || 'user',
      analysisMode: r.analysisMode,
      atsScore: r.atsScore,
      status: r.status,
      processingMs: r.processingMs,
      errorMessage: r.errorMessage,
      createdAt: r.createdAt,
    }));

    return res.json({ analyses });
  } catch (err) {
    next(err);
  }
}

export async function getPlatformAnalytics(_req, res, next) {
  try {
    const [resumes, analyses, jobMatches, interviews, reports, daily] = await Promise.all([
      Resume.countDocuments(),
      ResumeAnalysis.countDocuments(),
      JobMatch.countDocuments(),
      InterviewSession.countDocuments(),
      Report.countDocuments(),
      ResumeAnalysis.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 14 },
      ]),
    ]);

    return res.json({
      featureUsage: [
        { feature: 'Uploads', count: resumes },
        { feature: 'Analyses', count: analyses },
        { feature: 'Job Match', count: jobMatches },
        { feature: 'Interviews', count: interviews },
        { feature: 'PDF Reports', count: reports },
      ],
      dailyTrend: daily.map((d) => ({ date: d._id, count: d.count })),
    });
  } catch (err) {
    next(err);
  }
}

export async function bootstrapAdmin(req, res, next) {
  try {
    if (!env.adminBootstrapToken) {
      return res.status(403).json({ message: 'Admin bootstrap endpoint is disabled.' });
    }
    if (req.headers['x-bootstrap-token'] !== env.adminBootstrapToken) {
      return res.status(403).json({ message: 'Invalid bootstrap token.' });
    }
    const existingAdminCount = await User.countDocuments({ role: 'admin' });
    if (existingAdminCount > 0) {
      return res.status(409).json({ message: 'An admin account already exists.' });
    }

    const { fullName, email, password } = req.body;
    const admin = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'admin',
      status: 'active',
      acceptedTerms: true,
    });

    return res.status(201).json({ message: 'Admin initialized.', user: admin.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}
