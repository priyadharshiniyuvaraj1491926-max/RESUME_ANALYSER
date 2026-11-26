import { ACTION_VERBS } from './skillTaxonomy.js';

/**
 * Documented 100-Point Estimated ATS Rubric:
 * - formatting (15)
 * - keywords (20)
 * - skills (20)
 * - experience (20)
 * - education (10)
 * - structure (10)
 * - readability (5)
 */
export function calculateAtsScore(text, analysis) {
  const lower = text.toLowerCase();
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // 1. Formatting (max 15)
  let formatting = 4;
  if (analysis.extractedSections.contact.email) formatting += 3;
  if (analysis.extractedSections.contact.phone) formatting += 2;
  const bulletCount = lines.filter((l) => /^[-•*]/.test(l)).length;
  if (bulletCount >= 6) formatting += 4;
  else if (bulletCount >= 2) formatting += 2;
  if (analysis.extractedSections.contact.linkedin || analysis.extractedSections.contact.github) formatting += 2;
  formatting = Math.min(15, formatting);

  // 2. Keywords (max 20)
  const verbHits = ACTION_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, 'i').test(lower)).length;
  const metricHits = (text.match(/\b\d+%|\$\d+|\b\d+\+?\s*(users|ms|x|projects|clients)\b/gi) || []).length;
  let keywords = Math.min(14, verbHits * 2) + Math.min(6, metricHits * 2);
  keywords = Math.min(20, keywords);

  // 3. Skills (max 20)
  const techCount = analysis.technicalSkills.length;
  const softCount = analysis.softSkills.length;
  let skills = Math.min(16, techCount * 2) + Math.min(4, softCount * 2);
  skills = Math.min(20, skills);

  // 4. Experience (max 20)
  const expCount = analysis.extractedSections.experience.length;
  const projCount = analysis.extractedSections.projects.length;
  let experience = 0;
  if (expCount >= 4) experience += 14;
  else if (expCount >= 1) experience += 8;
  if (projCount >= 2) experience += 6;
  else if (projCount >= 1) experience += 3;
  experience = Math.min(20, experience);

  // 5. Education (max 10)
  const eduCount = analysis.extractedSections.education.length;
  const hasDegreeKeyword = /\b(bachelor|master|b\.?tech|b\.?e\.?|b\.?sc|m\.?sc|m\.?tech|ph\.?d|university|college|gpa)\b/i.test(text);
  let education = eduCount > 0 ? 7 : 0;
  if (hasDegreeKeyword) education += 3;
  education = Math.min(10, education);

  // 6. Structure (max 10)
  const presentSectionsCount = 5 - analysis.missingSections.length;
  const structure = Math.min(10, Math.max(0, presentSectionsCount * 2));

  // 7. Readability (max 5)
  let readability = 2;
  if (wordCount >= 200 && wordCount <= 950) readability = 5;
  else if (wordCount >= 120 && wordCount <= 1200) readability = 3;

  const atsScore = formatting + keywords + skills + experience + education + structure + readability;

  return {
    atsScore: Math.min(100, Math.max(0, atsScore)),
    atsBreakdown: {
      formatting,
      keywords,
      skills,
      experience,
      education,
      structure,
      readability,
    },
  };
}
