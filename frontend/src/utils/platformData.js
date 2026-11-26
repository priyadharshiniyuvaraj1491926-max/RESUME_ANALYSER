// Platform-level static data for public pages

export const CORE_FEATURES = [
  {
    id: 'ats-scoring',
    title: 'ATS Score Analysis',
    description: 'Get an instant estimate of how well your resume passes Applicant Tracking System filters, with a detailed 7-category breakdown.',
    icon: 'BarChart3',
    color: '#6d28d9',
  },
  {
    id: 'skill-gap',
    title: 'Skill Gap Analysis',
    description: 'Compare your skills against industry benchmarks for your target role and discover exactly what to learn next.',
    icon: 'Target',
    color: '#2563eb',
  },
  {
    id: 'job-matcher',
    title: 'Job Description Matcher',
    description: 'Paste any job description and instantly see your match percentage, missing keywords and tailoring tips.',
    icon: 'Briefcase',
    color: '#10b981',
  },
  {
    id: 'resume-improver',
    title: 'AI Resume Improver',
    description: 'Get side-by-side improvement suggestions for every section of your resume — without fabricating content.',
    icon: 'Wand2',
    color: '#f59e0b',
  },
  {
    id: 'career-recommendations',
    title: 'Career Recommendations',
    description: 'Discover roles that match your existing skills, with fit percentages and curated learning paths.',
    icon: 'Compass',
    color: '#8b5cf6',
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation',
    description: 'Generate role-specific interview questions tailored to your background and get instant feedback on mock answers.',
    icon: 'MessageSquare',
    color: '#3b82f6',
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description: 'Build a professional resume from scratch using polished templates, import data from your analysis, and export to PDF.',
    icon: 'FileText',
    color: '#ec4899',
  },
  {
    id: 'history',
    title: 'Analysis History',
    description: 'Track every analysis over time, download PDF reports and see how your resume evolves.',
    icon: 'History',
    color: '#06b6d4',
  },
];

export const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Upload Your Resume',
    description: 'Upload a PDF or DOCX resume (max 5 MB). Your file is processed securely — we extract text without storing the raw binary after parsing.',
  },
  {
    step: 2,
    title: 'Instant Text Extraction',
    description: 'Our parser reads every section of your resume — contact info, experience, skills, education, projects and certifications.',
  },
  {
    step: 3,
    title: 'ATS Score Calculation',
    description: 'A 7-category rubric evaluates formatting, keywords, skills, experience depth, education, structure and readability.',
  },
  {
    step: 4,
    title: 'Skill & Gap Analysis',
    description: 'Your detected skills are matched against role benchmarks to highlight strengths and identify gaps.',
  },
  {
    step: 5,
    title: 'AI-Powered Improvement',
    description: 'When an LLM API key is configured, get deeper insights. Without it, our rule-based engine still provides actionable suggestions.',
  },
  {
    step: 6,
    title: 'Prepare & Get Hired',
    description: 'Match jobs, practice interviews, improve your resume, track your progress — all in one dashboard.',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'Is ResumeIQ AI free to use?',
    a: 'Yes. ResumeIQ AI is an open-source academic project. All features are available without payment.',
  },
  {
    q: 'What file formats are supported?',
    a: 'PDF and DOCX (Microsoft Word). Files must be under 5 MB. Image-only PDFs (scanned documents) cannot be parsed — use a text-based PDF.',
  },
  {
    q: 'Is my resume data stored permanently?',
    a: 'Your resume text and analysis data are stored in a MongoDB database. You can delete any resume or your entire account at any time from the dashboard.',
  },
  {
    q: 'What is the ATS score based on?',
    a: 'It is an estimate based on a 7-category rubric: formatting (15 pts), keywords (20 pts), skills (20 pts), experience depth (20 pts), education (10 pts), structure (10 pts) and readability (5 pts). It is not a guarantee of real ATS outcomes.',
  },
  {
    q: 'Does the AI fabricate experience or achievements?',
    a: 'No. The resume improver only rephrases and enhances existing content — it never invents skills, roles or accomplishments.',
  },
  {
    q: 'Do I need to provide an AI API key?',
    a: 'No. All core features work using our rule-based engine. An LLM API key (OpenAI or Gemini) is optional and enhances improvement quality when configured by the server administrator.',
  },
  {
    q: 'Is this suitable for a production SaaS deployment?',
    a: 'The codebase follows SaaS best practices (JWT auth, bcrypt, rate limiting, input validation, role-based access). For true production use, add email services, HTTPS, cloud storage and a commercial LLM subscription.',
  },
];

export const ROLE_BENCHMARKS_DISPLAY = [
  { role: 'Frontend Developer',    skills: ['React', 'TypeScript', 'CSS', 'REST APIs', 'Git'] },
  { role: 'Backend Developer',     skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'SQL'] },
  { role: 'Full Stack Developer',  skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker'] },
  { role: 'Data Scientist',        skills: ['Python', 'Machine Learning', 'Pandas', 'SQL', 'Statistics'] },
  { role: 'DevOps Engineer',       skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux'] },
  { role: 'UI/UX Designer',        skills: ['Figma', 'User Research', 'Prototyping', 'CSS', 'Accessibility'] },
];
