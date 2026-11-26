const WEAK_OPENERS = [
  { regex: /^(?:i\s+)?worked\s+on\s+/i, replacement: 'Developed and contributed to ', reason: 'Replace passive "worked on" with a stronger action verb.' },
  { regex: /^(?:i\s+)?helped\s+(?:with\s+)?/i, replacement: 'Collaborated to deliver ', reason: 'Clarify active contribution instead of generic "helped".' },
  { regex: /^(?:i\s+)?was\s+responsible\s+for\s+/i, replacement: 'Managed and executed ', reason: 'Use active ownership phrasing rather than "responsible for".' },
  { regex: /^(?:i\s+)?did\s+/i, replacement: 'Executed ', reason: 'Replace informal "did" with an executive action verb.' },
  { regex: /^(?:i\s+)?made\s+/i, replacement: 'Built ', reason: 'Replace generic "made" with "Built" or "Engineered".' },
];

export function generateResumeImprovements(analysis) {
  const suggestions = [];
  const sections = analysis.extractedSections || {};

  if (sections.summary) {
    const cleaned = sections.summary
      .replace(/\b(i am|my name is|i have)\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    if (cleaned !== sections.summary || sections.summary.length < 120) {
      suggestions.push({
        id: 'imp-summary',
        category: 'Professional Summary',
        original: sections.summary,
        improved:
          cleaned.charAt(0).toUpperCase() +
          cleaned.slice(1) +
          (sections.summary.endsWith('.') ? '' : '.') +
          (analysis.technicalSkills?.length
            ? ` Core technical background includes ${analysis.technicalSkills.slice(0, 5).join(', ')}.`
            : ''),
        reason: 'Tightens first-person filler and surfaces your existing verified skills upfront.',
        status: 'pending',
      });
    }
  }

  const candidateLines = [
    ...(sections.experience || []),
    ...(sections.projects || []),
  ].filter((line) => line.length >= 25);

  candidateLines.slice(0, 8).forEach((line, idx) => {
    const stripped = line.replace(/^[-•*]\s*/, '').trim();
    for (const rule of WEAK_OPENERS) {
      if (rule.regex.test(stripped)) {
        const improved = stripped.replace(rule.regex, rule.replacement);
        suggestions.push({
          id: `imp-bullet-${idx}`,
          category: 'Action Verbs & Clarity',
          original: stripped,
          improved,
          reason: rule.reason,
          status: 'pending',
        });
        return;
      }
    }

    if (stripped.length > 15 && !/[.]$/.test(stripped)) {
      suggestions.push({
        id: `imp-readability-${idx}`,
        category: 'Readability & Grammar',
        original: stripped,
        improved: `${stripped.charAt(0).toUpperCase()}${stripped.slice(1)}.`,
        reason: 'Standardizes capitalization and punctuation across bullet items.',
        status: 'pending',
      });
    }
  });

  return suggestions.slice(0, 8);
}
