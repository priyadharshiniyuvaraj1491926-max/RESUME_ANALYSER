import { extractSkillsFromText } from './nlpService.js';

export const SKILL_SYNONYMS = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  react: 'React',
  reactjs: 'React',
  'react.js': 'React',
  node: 'Node.js',
  nodejs: 'Node.js',
  'node.js': 'Node.js',
  express: 'Express',
  expressjs: 'Express',
  'express.js': 'Express',
  k8s: 'Kubernetes',
  kubernetes: 'Kubernetes',
  mongo: 'MongoDB',
  mongodb: 'MongoDB',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  aws: 'AWS',
  'amazon web services': 'AWS',
  gcp: 'GCP',
  'google cloud': 'GCP',
  'google cloud platform': 'GCP',
  py: 'Python',
  python: 'Python',
  docker: 'Docker',
  'ci/cd': 'CI/CD',
  cicd: 'CI/CD',
  'continuous integration': 'CI/CD',
  rest: 'REST API',
  restful: 'REST API',
  'rest api': 'REST API',
  graphql: 'GraphQL',
  tailwind: 'Tailwind CSS',
  tailwindcss: 'Tailwind CSS',
};

export function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  const lower = skill.trim().toLowerCase();
  return SKILL_SYNONYMS[lower] || skill.trim();
}

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
  const { detectedSkills: baseJdSkills } = extractSkillsFromText(jobDescription);
  const jdSkillSet = new Set(baseJdSkills.map(normalizeSkill));

  // Check synonym variants in JD text
  for (const [syn, canonical] of Object.entries(SKILL_SYNONYMS)) {
    const pattern = new RegExp(`(^|[^a-zA-Z0-9+#.])${syn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-zA-Z0-9+#.]|$)`, 'i');
    if (pattern.test(jobDescription)) {
      jdSkillSet.add(canonical);
    }
  }

  const jdSkills = [...jdSkillSet];
  const resumeLower = resumeText.toLowerCase();
  const normalizedResumeSkills = resumeSkills.map(normalizeSkill);
  const resumeSkillSet = new Set(normalizedResumeSkills.map((s) => s.toLowerCase()));

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
    missingSkills,
    experienceAlignment,
    recommendations,
  };
}
