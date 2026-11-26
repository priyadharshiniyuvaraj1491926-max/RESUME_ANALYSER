import { ACTION_VERBS, SOFT_SKILLS, TECHNICAL_SKILLS } from './skillTaxonomy.js';

const SECTION_PATTERNS = {
  summary: /^(professional\s+summary|summary|profile|objective|about\s+me)\b/i,
  skills: /^(technical\s+skills|skills|core\s+competencies|technologies)\b/i,
  experience: /^(work\s+experience|professional\s+experience|experience|employment|internships?)\b/i,
  projects: /^(projects|academic\s+projects|key\s+projects|personal\s+projects)\b/i,
  education: /^(education|academic\s+background|qualifications)\b/i,
  certifications: /^(certifications?|licenses?|achievements?|awards?)\b/i,
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractSkillsFromText(text) {
  const technicalSkills = [];
  const softSkills = [];

  for (const skill of TECHNICAL_SKILLS) {
    const pattern = new RegExp(`(^|[^a-zA-Z0-9+#.])${escapeRegex(skill)}([^a-zA-Z0-9+#.]|$)`, 'i');
    if (pattern.test(text)) technicalSkills.push(skill);
  }

  for (const skill of SOFT_SKILLS) {
    const pattern = new RegExp(`(^|[^a-zA-Z0-9])${escapeRegex(skill)}([^a-zA-Z0-9]|$)`, 'i');
    if (pattern.test(text)) softSkills.push(skill);
  }

  const detectedSkills = [...new Set([...technicalSkills, ...softSkills])];
  return { technicalSkills, softSkills, detectedSkills };
}

export function parseResumeSections(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/);
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);

  const firstLine = lines[0] || '';
  const inferredName =
    firstLine && !firstLine.includes('@') && firstLine.split(/\s+/).length <= 5
      ? firstLine
      : '';

  const buckets = {
    summary: [],
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
  };

  let currentSection = null;
  for (const line of lines) {
    let matchedHeader = null;
    for (const [key, regex] of Object.entries(SECTION_PATTERNS)) {
      if (regex.test(line) && line.length < 55) {
        matchedHeader = key;
        break;
      }
    }
    if (matchedHeader) {
      currentSection = matchedHeader;
      continue;
    }
    if (currentSection && buckets[currentSection]) {
      buckets[currentSection].push(line);
    }
  }

  return {
    name: inferredName,
    contact: {
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0].trim() : '',
      linkedin: linkedinMatch ? linkedinMatch[0] : '',
      github: githubMatch ? githubMatch[0] : '',
    },
    summary: buckets.summary.join(' '),
    education: buckets.education.slice(0, 12),
    experience: buckets.experience.slice(0, 20),
    projects: buckets.projects.slice(0, 15),
    certifications: buckets.certifications.slice(0, 10),
  };
}

export function performRuleBasedAnalysis(text) {
  const extractedSections = parseResumeSections(text);
  const { technicalSkills, softSkills, detectedSkills } = extractSkillsFromText(text);
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  const missingSections = [];
  if (!extractedSections.summary) missingSections.push('Summary');
  if (detectedSkills.length === 0) missingSections.push('Skills');
  if (extractedSections.experience.length === 0) missingSections.push('Experience');
  if (extractedSections.projects.length === 0) missingSections.push('Projects');
  if (extractedSections.education.length === 0) missingSections.push('Education');

  const strengths = [];
  const weaknesses = [];
  const contentSuggestions = [];
  const formattingFeedback = [];

  if (extractedSections.contact.email && extractedSections.contact.phone) {
    strengths.push('Clear email and phone contact details detected.');
  } else {
    weaknesses.push('Incomplete contact block (ensure both email and phone number are included).');
  }

  if (technicalSkills.length >= 6) {
    strengths.push(`Strong technical stack detected (${technicalSkills.length} technical skills).`);
  } else {
    weaknesses.push('Limited recognized technical skills; add a clear Skills section with specific tools and languages.');
  }

  const matchedVerbs = ACTION_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, 'i').test(lower));
  if (matchedVerbs.length >= 4) {
    strengths.push(`Good usage of measurable action verbs (${matchedVerbs.slice(0, 5).join(', ')}).`);
  } else {
    contentSuggestions.push('Start experience and project bullets with strong action verbs such as Built, Engineered, Optimized, or Automated.');
  }

  const hasMetrics = /\b\d+%|\$\d+|\b\d+\+?\s*(users|requests|ms|hours|days|projects|clients)\b/i.test(text);
  if (hasMetrics) {
    strengths.push('Includes quantified metrics or numeric impact.');
  } else {
    contentSuggestions.push('Quantify real outcomes where truthful (e.g., latency reduction, test coverage, or user count).');
  }

  if (missingSections.length > 0) {
    weaknesses.push(`Missing or undetected standard headings: ${missingSections.join(', ')}.`);
  }

  if (wordCount < 180) {
    formattingFeedback.push('Resume appears quite short (< 180 words); ensure projects and experience bullets are sufficiently detailed.');
  } else if (wordCount > 1100) {
    formattingFeedback.push('Resume exceeds 1,100 words; consider tightening older details to keep it concise (1–2 pages).');
  } else {
    formattingFeedback.push(`Healthy document length (${wordCount} words) for ATS readability.`);
  }

  const bulletLines = lines.filter((l) => /^[-•*]/.test(l));
  if (bulletLines.length < 3) {
    formattingFeedback.push('Use clean bullet points (- or •) under Experience and Projects for easier ATS scanning.');
  }

  return {
    extractedSections,
    detectedSkills,
    technicalSkills,
    softSkills,
    missingSections,
    strengths,
    weaknesses,
    contentSuggestions,
    formattingFeedback,
  };
}
