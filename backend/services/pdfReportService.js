import PDFDocument from 'pdfkit';

export function generateAnalysisReportPdf(analysis) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48, size: 'A4' });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fillColor('#6d28d9').fontSize(20).text('ResumeIQ AI — Analysis Report');
    doc.fillColor('#475569').fontSize(10).text(`Generated: ${new Date(analysis.createdAt).toLocaleString()} | Mode: ${analysis.analysisMode}`);
    doc.moveDown(0.75);

    doc.fillColor('#0f172a').fontSize(13).text(`Resume: ${analysis.resumeName}`);
    doc.fontSize(15).fillColor('#6d28d9').text(`Estimated ATS Score: ${analysis.atsScore} / 100`);
    doc.fillColor('#475569').fontSize(9).text(
      'Disclaimer: This ATS score is an estimate based on our documented rubric and does not guarantee results on third-party ATS platforms.'
    );
    doc.moveDown(1);

    doc.fillColor('#0f172a').fontSize(12).text('Category Breakdown', { underline: true });
    doc.moveDown(0.3);
    const b = analysis.atsBreakdown || {};
    const rows = [
      `Formatting: ${b.formatting ?? 0}/15`,
      `Keywords: ${b.keywords ?? 0}/20`,
      `Skills: ${b.skills ?? 0}/20`,
      `Experience: ${b.experience ?? 0}/20`,
      `Education: ${b.education ?? 0}/10`,
      `Structure: ${b.structure ?? 0}/10`,
      `Readability: ${b.readability ?? 0}/5`,
    ];
    doc.fontSize(10).fillColor('#1e293b').text(rows.join('   |   '));
    doc.moveDown(1);

    const writeSection = (title, items) => {
      doc.fillColor('#0f172a').fontSize(12).text(title, { underline: true });
      doc.moveDown(0.25);
      if (!items || items.length === 0) {
        doc.fontSize(10).fillColor('#64748b').text('None recorded.');
      } else {
        items.forEach((item) => {
          doc.fontSize(10).fillColor('#1e293b').text(`• ${item}`);
        });
      }
      doc.moveDown(0.75);
    };

    writeSection('Detected Skills', analysis.detectedSkills);
    writeSection('Missing Sections', analysis.missingSections);
    writeSection('Strengths', analysis.strengths);
    writeSection('Weaknesses', analysis.weaknesses);
    writeSection('Improvement Recommendations', analysis.contentSuggestions);

    doc.end();
  });
}

export function generateResumeBuilderPdf(payload) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 46, size: 'A4' });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const accent =
      payload.template === 'technical'
        ? '#2563eb'
        : payload.template === 'classic'
        ? '#0f172a'
        : '#6d28d9';

    const info = payload.personalInfo || {};
    doc.fillColor(accent).fontSize(20).text(info.fullName || 'Candidate Resume');
    const contactLine = [info.email, info.phone, info.location, info.linkedin, info.github]
      .filter(Boolean)
      .join('  •  ');
    if (contactLine) {
      doc.fillColor('#475569').fontSize(9.5).text(contactLine);
    }
    doc.moveDown(0.8);

    if (info.summary) {
      doc.fillColor(accent).fontSize(11).text('PROFESSIONAL SUMMARY');
      doc.fillColor('#1e293b').fontSize(10).text(info.summary);
      doc.moveDown(0.75);
    }

    if (payload.skills?.length) {
      doc.fillColor(accent).fontSize(11).text('SKILLS');
      doc.fillColor('#1e293b').fontSize(10).text(payload.skills.join(', '));
      doc.moveDown(0.75);
    }

    const writeList = (heading, items) => {
      if (!items || items.length === 0) return;
      doc.fillColor(accent).fontSize(11).text(heading);
      doc.moveDown(0.2);
      items.forEach((line) => {
        doc.fillColor('#1e293b').fontSize(10).text(`• ${line}`);
      });
      doc.moveDown(0.75);
    };

    writeList('EXPERIENCE', payload.experience);
    writeList('PROJECTS', payload.projects);
    writeList('EDUCATION', payload.education);
    writeList('CERTIFICATIONS', payload.certifications);

    doc.end();
  });
}
