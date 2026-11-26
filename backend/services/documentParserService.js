import fs from 'fs';
import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

export function verifyFileSignature(buffer, fileType) {
  if (!buffer || buffer.length < 4) return false;
  if (fileType === 'pdf') {
    return buffer.slice(0, 4).toString('ascii') === '%PDF';
  }
  if (fileType === 'docx') {
    // ZIP/OOXML magic bytes: PK\x03\x04
    return (
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x03 &&
      buffer[3] === 0x04
    );
  }
  return false;
}

export async function extractResumeText(filePath, fileType) {
  const stats = fs.statSync(filePath);
  if (!stats || stats.size === 0) {
    throw new Error('Uploaded file is empty (0 bytes).');
  }

  const buffer = fs.readFileSync(filePath);
  if (!verifyFileSignature(buffer, fileType)) {
    throw new Error(`File signature verification failed for ${fileType.toUpperCase()} document.`);
  }

  let rawText = '';
  try {
    if (fileType === 'pdf') {
      const parsed = await pdfParse(buffer);
      rawText = parsed?.text || '';
    } else if (fileType === 'docx') {
      const parsed = await mammoth.extractRawText({ buffer });
      rawText = parsed?.value || '';
    } else {
      throw new Error('Unsupported document type.');
    }
  } catch (err) {
    throw new Error(`Corrupted or unreadable ${fileType.toUpperCase()} document: ${err.message}`);
  }

  const normalized = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .trim();

  const alphaNumCount = (normalized.match(/[a-zA-Z0-9]/g) || []).length;
  if (alphaNumCount < 20) {
    throw new Error('Document contains no extractable text (empty or image-only PDF/DOCX).');
  }

  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  return { extractedText: normalized, wordCount };
}
