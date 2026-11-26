import { describe, it, expect } from 'vitest';
import { matchJobDescription, normalizeSkill, SKILL_SYNONYMS } from '../services/jobMatcherService.js';

describe('Job Matcher Service & Synonym Normalization Tests', () => {
  it('normalizes common technology abbreviations to canonical skill names', () => {
    expect(normalizeSkill('k8s')).toBe('Kubernetes');
    expect(normalizeSkill('K8s')).toBe('Kubernetes');
    expect(normalizeSkill('ReactJS')).toBe('React');
    expect(normalizeSkill('NodeJS')).toBe('Node.js');
    expect(normalizeSkill('Postgres')).toBe('PostgreSQL');
    expect(normalizeSkill('Amazon Web Services')).toBe('AWS');
    expect(normalizeSkill('UnknownSkill')).toBe('UnknownSkill');
  });

  it('matches skills accurately across synonymous terms', () => {
    const resumeText = 'Experienced developer in React, Node.js, and Kubernetes orchestration with strong expertise.';
    const resumeSkills = ['React', 'Node.js', 'Kubernetes'];
    const jobDescription = 'Looking for a developer with ReactJS, NodeJS, and K8s expertise.';

    const result = matchJobDescription(resumeText, resumeSkills, jobDescription);

    expect(result.existingSkills).toContain('React');
    expect(result.existingSkills).toContain('Node.js');
    expect(result.existingSkills).toContain('Kubernetes');
    expect(result.missingSkills.length).toBe(0);
    expect(result.matchPercentage).toBeGreaterThanOrEqual(75);
    expect(result.experienceAlignment).toBe('Strong Textual Alignment');
  });

  it('calculates gap and recommendations when target skills are missing', () => {
    const resumeText = 'Junior frontend developer skilled in HTML, CSS, JavaScript.';
    const resumeSkills = ['JavaScript', 'HTML', 'CSS'];
    const jobDescription = 'Senior Cloud Architect: AWS, Kubernetes, Terraform, Docker, Python required.';

    const result = matchJobDescription(resumeText, resumeSkills, jobDescription);

    expect(result.matchPercentage).toBeLessThan(50);
    expect(result.missingSkills.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});
