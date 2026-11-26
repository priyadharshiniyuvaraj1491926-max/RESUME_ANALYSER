import fs from 'fs';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extractTextFromPdfBuffer(buffer) {
  const uint8 = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8, verbosity: 0 });
  const pdf = await loadingTask.promise;
  const pageTexts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let lastY;
    const lines = [];
    let currentLine = '';

    for (const item of content.items) {
      const text = item.str || '';
      const y = item.transform ? item.transform[5] : null;

      if (lastY !== undefined && y !== null && Math.abs(y - lastY) > 3) {
        if (currentLine.trim()) lines.push(currentLine.trim());
        currentLine = text;
      } else {
        currentLine = currentLine ? `${currentLine} ${text}` : text;
      }
      if (item.hasEOL) {
        if (currentLine.trim()) lines.push(currentLine.trim());
        currentLine = '';
      }
      lastY = y;
    }
    if (currentLine.trim()) lines.push(currentLine.trim());
    pageTexts.push(lines.join('\n'));
  }
  return pageTexts.join('\n\n');
}

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
      rawText = await extractTextFromPdfBuffer(buffer);
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
