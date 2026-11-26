import { ROLE_BENCHMARKS } from './skillTaxonomy.js';

export function computeSkillGap(existingTechnical, existingSoft, targetRole = 'Full-Stack Developer') {
  const benchmark = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS['Full-Stack Developer'];
  const existingSet = new Set([...existingTechnical, ...existingSoft].map((s) => s.toLowerCase()));

  const matched = benchmark.required.filter((s) => existingSet.has(s.toLowerCase()));
  const missingSkills = benchmark.required.filter((s) => !existingSet.has(s.toLowerCase()));
  const coveragePercent = benchmark.required.length
    ? Math.round((matched.length / benchmark.required.length) * 100)
    : 0;

  const roadmap = missingSkills.slice(0, 6).map((skill, idx) => ({
    skill,
    priority: idx < 2 ? 'High Priority' : idx < 4 ? 'Medium Priority' : 'Foundational',
    recommendation: `Build a focused hands-on module demonstrating ${skill} and document measurable outcomes on your resume.`,
  }));

  return {
    targetRole,
    existingSkills: [...new Set([...existingTechnical, ...existingSoft])],
    technicalSkills: existingTechnical,
    softSkills: existingSoft,
    missingSkills,
    coveragePercent,
    roadmap,
  };
}

export function recommendCareers(detectedSkills) {
  if (!detectedSkills || detectedSkills.length === 0) return [];
  const userSet = new Set(detectedSkills.map((s) => s.toLowerCase()));

  return Object.entries(ROLE_BENCHMARKS)
    .map(([role, info]) => {
      const matchingSkills = info.required.filter((s) => userSet.has(s.toLowerCase()));
      const missingSkills = info.required.filter((s) => !userSet.has(s.toLowerCase()));
      const fitScore = Math.round((matchingSkills.length / info.required.length) * 100);
      return {
        role,
        fitScore,
        matchingSkills,
        missingSkills,
        reason:
          matchingSkills.length > 0
            ? `Matches ${matchingSkills.length} of ${info.required.length} core skills (${matchingSkills.slice(0, 4).join(', ')}).`
            : 'Entry-level transition path; requires building foundational role skills.',
        learningPath: info.learningPath,
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 5);
}
