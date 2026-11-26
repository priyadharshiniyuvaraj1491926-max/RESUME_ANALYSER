import { extractSkillsFromText } from './nlpService.js';

const STOPWORDS = new Set([
  'with', 'that', 'this', 'from', 'have', 'will', 'your', 'about', 'work', 'team', 'years',
  'experience', 'skills', 'using', 'able', 'good', 'strong', 'role', 'position', 'company',
  'including', 'requirements', 'responsibilities', 'preferred', 'required', 'must', 'should',
]);

function extractImportantTerms(text) {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9+.#/\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  return [...new Set(tokens)];
}

export function matchJobDescription(resumeText, resumeSkills, jobDescription) {
  const { detectedSkills: jdSkills } = extractSkillsFromText(jobDescription);
  const resumeLower = resumeText.toLowerCase();
  const resumeSkillSet = new Set(resumeSkills.map((s) => s.toLowerCase()));

  const existingSkills = jdSkills.filter((s) => resumeSkillSet.has(s.toLowerCase()));
  const missingSkills = jdSkills.filter((s) => !resumeSkillSet.has(s.toLowerCase()));

  const jdTerms = extractImportantTerms(jobDescription).slice(0, 35);
  const matchingKeywords = [];
  const missingKeywords = [];

  for (const term of jdTerms) {
    if (resumeLower.includes(term)) {
      matchingKeywords.push(term);
    } else {
      missingKeywords.push(term);
    }
  }

  const skillWeight = jdSkills.length > 0 ? (existingSkills.length / jdSkills.length) * 65 : 50;
  const kwWeight = jdTerms.length > 0 ? (matchingKeywords.length / jdTerms.length) * 35 : 0;
  const matchPercentage = Math.min(100, Math.round(skillWeight + kwWeight));

  let experienceAlignment = 'Moderate Alignment';
  if (matchPercentage >= 75) experienceAlignment = 'Strong Textual Alignment';
  else if (matchPercentage < 45) experienceAlignment = 'Low Alignment — Significant Skill/Keyword Gaps';

  const recommendations = [
    'Treat keyword match as a screening signal only — only add missing terms if you truly have hands-on experience with them.',
  ];
  if (missingSkills.length > 0) {
    recommendations.push(`Focus on building or highlighting authentic projects with: ${missingSkills.slice(0, 6).join(', ')}.`);
  }
  if (matchPercentage >= 70) {
    recommendations.push('Your resume covers most target terms; tailor your top summary and bullet order for this specific role.');
  }

  return {
    matchPercentage,
    matchingKeywords: [...new Set([...existingSkills, ...matchingKeywords])].slice(0, 20),
    missingKeywords: [...new Set([...missingSkills, ...missingKeywords])].slice(0, 20),
    requiredSkills: jdSkills,
    existingSkills,
    experienceAlignment,
    recommendations,
  };
}
