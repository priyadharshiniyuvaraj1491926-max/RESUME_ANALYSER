import { describe, it, expect } from 'vitest';
import { extractSkillsFromText, parseResumeSections, performRuleBasedAnalysis } from '../services/nlpService.js';
import { calculateAtsScore } from '../services/atsScoringService.js';
import { matchJobDescription } from '../services/jobMatcherService.js';

const SAMPLE_RESUME = `
Alex Rivera
alex.rivera@example.com | (555) 123-4567 | linkedin.com/in/alexrivera | github.com/alexrivera

Professional Summary
Results-driven Full Stack Developer with 3+ years of experience building scalable web applications.

Technical Skills
JavaScript, TypeScript, React, Node.js, Express, MongoDB, Docker, Git, REST APIs, Communication, Leadership

Work Experience
Software Engineer at TechCorp (2022 - Present)
- Developed React and Node.js microservices serving 50,000+ users.
- Reduced API latency by 35% through MongoDB indexing and caching.
- Collaborated with cross-functional teams to ship 12 production releases.
- Automated CI/CD pipelines using Docker and GitHub Actions.

Projects
ResumeIQ AI Platform
- Built full-stack analytics dashboard with React, Express, and MongoDB.
- Implemented automated PDF parsing and scoring rubric.

Education
B.Tech in Computer Science, State University (2018 - 2022)
`;

describe('NLP, ATS Scoring & Job Matcher Unit Tests', () => {
  it('extracts technical and soft skills from resume text', () => {
    const { technicalSkills, softSkills, detectedSkills } = extractSkillsFromText(SAMPLE_RESUME);
    expect(technicalSkills).toContain('React');
    expect(technicalSkills).toContain('Node.js');
    expect(technicalSkills).toContain('MongoDB');
    expect(softSkills).toContain('Communication');
    expect(detectedSkills.length).toBeGreaterThan(5);
  });

  it('parses resume sections and contact details', () => {
    const sections = parseResumeSections(SAMPLE_RESUME);
    expect(sections.contact.email).toBe('alex.rivera@example.com');
    expect(sections.experience.length).toBeGreaterThan(0);
    expect(sections.education.length).toBeGreaterThan(0);
    expect(sections.projects.length).toBeGreaterThan(0);
  });

  it('calculates a valid 0-100 ATS score with 7-category breakdown', () => {
    const analysis = performRuleBasedAnalysis(SAMPLE_RESUME);
    const { atsScore, atsBreakdown } = calculateAtsScore(SAMPLE_RESUME, analysis);

    expect(atsScore).toBeGreaterThan(40);
    expect(atsScore).toBeLessThanOrEqual(100);
    expect(atsBreakdown.formatting).toBeLessThanOrEqual(15);
    expect(atsBreakdown.keywords).toBeLessThanOrEqual(20);
    expect(atsBreakdown.skills).toBeLessThanOrEqual(20);
    expect(atsBreakdown.experience).toBeLessThanOrEqual(20);
    expect(atsBreakdown.education).toBeLessThanOrEqual(10);
    expect(atsBreakdown.structure).toBeLessThanOrEqual(10);
    expect(atsBreakdown.readability).toBeLessThanOrEqual(5);
  });

  it('matches job description and reports missing skills', () => {
    const { detectedSkills } = extractSkillsFromText(SAMPLE_RESUME);
    const jd = 'Looking for a Full Stack Developer with React, Node.js, MongoDB, Kubernetes, and AWS experience.';
    const match = matchJobDescription(SAMPLE_RESUME, detectedSkills, jd);

    expect(match.matchPercentage).toBeGreaterThan(0);
    expect(match.matchPercentage).toBeLessThanOrEqual(100);
    expect(match.existingSkills).toContain('React');
    expect(match.missingKeywords).toEqual(expect.arrayContaining(['Kubernetes', 'AWS']));
  });
});
