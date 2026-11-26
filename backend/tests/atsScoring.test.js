import { describe, it, expect } from 'vitest';
import { calculateAtsScore } from '../services/atsScoringService.js';
import { ACTION_VERBS } from '../services/skillTaxonomy.js';

describe('ATS Scoring Service & Rubric Tests', () => {
  it('action verbs taxonomy contains at least 50 curated verbs', () => {
    expect(ACTION_VERBS.length).toBeGreaterThanOrEqual(50);
    expect(ACTION_VERBS).toContain('spearheaded');
    expect(ACTION_VERBS).toContain('orchestrated');
    expect(ACTION_VERBS).toContain('containerized');
  });

  it('calculates score with complete breakdown across all 7 categories', () => {
    const sampleText = `
John Doe
john@example.com | +1 555-0100 | linkedin.com/in/johndoe | github.com/johndoe
- Engineered scalable microservices serving 100k requests/s with 99.99% uptime.
- Spearheaded database migration reducing latency by 45%.
- Architected CI/CD pipeline deploying 50 microservices on AWS.
- Mentored 6 software engineers and conducted code reviews.
- Automated vulnerability scanning saving $200k annually.
- Containerized legacy applications using Docker and Kubernetes.
Bachelor of Science in Computer Science, University of Technology
`;

    const sampleAnalysis = {
      extractedSections: {
        contact: {
          email: 'john@example.com',
          phone: '+1 555-0100',
          linkedin: 'linkedin.com/in/johndoe',
          github: 'github.com/johndoe',
        },
        experience: ['Job 1', 'Job 2', 'Job 3', 'Job 4'],
        projects: ['Project 1', 'Project 2'],
        education: ['B.S. Computer Science'],
      },
      technicalSkills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL'],
      softSkills: ['Communication', 'Leadership'],
      missingSections: [],
    };

    const { atsScore, atsBreakdown } = calculateAtsScore(sampleText, sampleAnalysis);

    expect(atsScore).toBeGreaterThanOrEqual(80);
    expect(atsBreakdown.formatting).toBeLessThanOrEqual(15);
    expect(atsBreakdown.keywords).toBeLessThanOrEqual(20);
    expect(atsBreakdown.skills).toBeLessThanOrEqual(20);
    expect(atsBreakdown.experience).toBeLessThanOrEqual(20);
    expect(atsBreakdown.education).toBeLessThanOrEqual(10);
    expect(atsBreakdown.structure).toBeLessThanOrEqual(10);
    expect(atsBreakdown.readability).toBeLessThanOrEqual(5);

    const sum =
      atsBreakdown.formatting +
      atsBreakdown.keywords +
      atsBreakdown.skills +
      atsBreakdown.experience +
      atsBreakdown.education +
      atsBreakdown.structure +
      atsBreakdown.readability;
    expect(atsScore).toBe(Math.min(100, sum));
  });

  it('handles minimal/sparse resume gracefully without throwing', () => {
    const emptyText = 'Hello world';
    const minimalAnalysis = {
      extractedSections: {
        contact: { email: '', phone: '', linkedin: '', github: '' },
        experience: [],
        projects: [],
        education: [],
      },
      technicalSkills: [],
      softSkills: [],
      missingSections: ['Summary', 'Experience', 'Projects', 'Education'],
    };

    const { atsScore, atsBreakdown } = calculateAtsScore(emptyText, minimalAnalysis);
    expect(atsScore).toBeGreaterThanOrEqual(0);
    expect(atsScore).toBeLessThan(40);
    expect(atsBreakdown.skills).toBe(0);
    expect(atsBreakdown.experience).toBe(0);
  });
});
