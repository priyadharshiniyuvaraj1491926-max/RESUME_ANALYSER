import React from 'react';
import { Shield, Eye, Heart, Zap } from 'lucide-react';

const VALUES = [
  { icon: Shield, title: 'Privacy-First',   desc: 'Your resume data belongs to you. Delete it anytime. We never sell personal data.', color: '#6d28d9' },
  { icon: Eye,    title: 'Transparency',     desc: 'ATS scores are always labeled as estimates. AI suggestions never fabricate content.', color: '#2563eb' },
  { icon: Heart,  title: 'Accessibility',   desc: 'Open-source, no paywall. Career intelligence should be available to everyone.', color: '#10b981' },
  { icon: Zap,    title: 'Real Utility',     desc: 'Built for real job seekers — not demo screenshots. Every feature must actually work.', color: '#f59e0b' },
];

const AboutPage = () => (
  <div className="fade-in">
    <section style={{ background: 'var(--gradient-hero)', padding: 'var(--space-20) 0', textAlign: 'center' }}>
      <div className="container">
        <span className="section-label">About</span>
        <h1 className="section-title" style={{ fontSize: 'var(--text-5xl)' }}>
          Built by engineers,<br /><span className="text-gradient">for job seekers</span>
        </h1>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          ResumeIQ AI is a final-year engineering capstone project — a full-stack SaaS platform combining real AI, modern web development and practical career tools.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
          <div className="card">
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-3)' }}>Mission</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
              Democratize access to AI-powered career intelligence. No subscription, no gatekeeping — just powerful resume tools for anyone searching for their next opportunity.
            </p>
          </div>
          <div className="card">
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-3)' }}>Vision</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
              A world where every job seeker has access to the same quality of resume feedback and career guidance, regardless of budget or background.
            </p>
          </div>
        </div>

        {/* Values */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <span className="section-label">Core Values</span>
          <h2 className="section-title">What we stand for</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
          {VALUES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card card-hoverable">
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>{title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Tech stack note */}
        <div className="card card-muted" style={{ marginTop: 'var(--space-12)', textAlign: 'center' }}>
          <h3 style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)' }}>Technology Stack</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
            React · Vite · Framer Motion · Recharts · Node.js · Express · MongoDB · Mongoose · JWT · bcrypt · pdf-parse · mammoth · Multer
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
