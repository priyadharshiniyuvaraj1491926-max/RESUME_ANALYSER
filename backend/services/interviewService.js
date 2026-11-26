export function generateInterviewQuestions(targetRole, detectedSkills = []) {
  const topSkill = detectedSkills[0] || 'your primary technology stack';
  const secondSkill = detectedSkills[1] || 'system design';

  return [
    {
      category: 'Technical',
      question: `Explain a challenging technical issue you solved using ${topSkill} and how you verified the fix.`,
      sampleStructure: 'Context -> Root cause investigation -> Solution implemented -> Verification/testing & measurable outcome.',
    },
    {
      category: 'Technical',
      question: `How do you ensure code quality, security, and performance when building with ${secondSkill}?`,
      sampleStructure: 'Architecture/input validation -> Automated testing -> Profiling/bottleneck resolution.',
    },
    {
      category: 'Role-Based',
      question: `For a ${targetRole} role, how would you design and scale an end-to-end feature from requirements to deployment?`,
      sampleStructure: 'Clarify requirements -> Data model & API contract -> Implementation -> Monitoring & edge cases.',
    },
    {
      category: 'Role-Based',
      question: `Walk through your strongest project on your resume and explain one trade-off you made.`,
      sampleStructure: 'Problem statement -> Options evaluated -> Trade-off rationale -> Impact.',
    },
    {
      category: 'HR',
      question: 'Tell me about a time you received critical feedback or faced a tight deadline. How did you respond?',
      sampleStructure: 'STAR: Situation -> Task -> Action taken -> Constructive Result & lesson learned.',
    },
  ];
}

export function evaluateInterviewAnswer(answerText) {
  const words = answerText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = answerText.toLowerCase();

  let score = 4;
  const suggestions = [];

  if (wordCount >= 40) score += 2;
  else suggestions.push('Expand your explanation with concrete technical or behavioral specifics (aim for 50–120 words).');

  if (/\b(because|therefore|result|outcome|improved|reduced|built|designed|tested)\b/i.test(lower)) {
    score += 2;
  } else {
    suggestions.push('Explicitly highlight the Action you took and the final Result (STAR structure).');
  }

  if (/\b\d+%|\b\d+\b/.test(answerText)) {
    score += 2;
  } else {
    suggestions.push('Add real metrics or concrete scope (e.g., team size, latency, test count) if applicable.');
  }

  score = Math.min(10, score);
  const feedback =
    score >= 8
      ? 'Strong, structured response with clear action and concrete detail.'
      : score >= 6
      ? 'Solid foundation; tightening structure and measurable outcomes will make this answer stand out.'
      : 'Good start; structure your answer around Situation, Task, Action, and Result with specific examples.';

  return { score, feedback, improvementSuggestions: suggestions };
}
