import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import JobMatch from '../models/JobMatch.js';
import { extractResumeText } from '../services/documentParserService.js';

export async function uploadResume(req, res, next) {
  const uploadedFile = req.file;
  if (!uploadedFile) {
    return res.status(400).json({ message: 'Please attach a PDF or DOCX resume file.' });
  }

  const ext = path.extname(uploadedFile.originalname).toLowerCase().replace('.', '');
  try {
    const { extractedText, wordCount } = await extractResumeText(uploadedFile.path, ext);

    if (process.env.NODE_ENV !== 'production') {
      console.log('[ResumeUpload]', {
        fileType: ext,
        extractedCharCount: extractedText?.length || 0,
        wordCount,
      });
    }

    const resume = await Resume.create({
      userId: req.user._id,
      originalName: uploadedFile.originalname,
      storedFileName: uploadedFile.filename,
      filePath: uploadedFile.path,
      fileType: ext,
      mimeType: uploadedFile.mimetype,
      fileSize: uploadedFile.size,
      extractedText,
      wordCount,
      extractionStatus: 'extracted',
    });

    return res.status(201).json({
      message: 'Resume uploaded and text extracted successfully.',
      resume,
    });
  } catch (err) {
    // Never retain failed/corrupted documents
    if (uploadedFile.path && fs.existsSync(uploadedFile.path)) {
      fs.unlinkSync(uploadedFile.path);
    }
    return res.status(400).json({ message: err.message || 'Document text extraction failed.' });
  }
}

export async function listResumes(req, res, next) {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ resumes });
  } catch (err) {
    next(err);
  }
}

export async function getResumeById(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    return res.json({ resume });
  } catch (err) {
    next(err);
  }
}

export async function deleteResume(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });

    if (resume.filePath && fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await Promise.all([
      ResumeAnalysis.deleteMany({ resumeId: resume._id, userId: req.user._id }),
      JobMatch.deleteMany({ resumeId: resume._id, userId: req.user._id }),
      Resume.deleteOne({ _id: resume._id, userId: req.user._id }),
    ]);

    return res.json({ message: 'Resume and related records deleted.' });
  } catch (err) {
    next(err);
  }
}
