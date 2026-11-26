import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, Target, Briefcase, Wand2, Compass, MessageSquare,
  FileText, History, CheckCircle, ChevronDown, ChevronUp, Upload, Shield, Lock, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { CORE_FEATURES, WORKFLOW_STEPS, FAQ_ITEMS } from '../../utils/platformData.js';

const ICON_MAP = { BarChart3, Target, Briefcase, Wand2, Compass, MessageSquare, FileText, History, Upload };

const CAPABILITIES = [
  {
    icon: BarChart3,
    title: 'Transparent 7-Category ATS Rubric',
    desc: 'Every score breaks down formatting, keywords, skills, experience, education, structure, and readability — clearly labeled as an estimate.',
    color: '#6d28d9',
  },
  {
    icon: Shield,
    title: 'Zero-Fabrication Improvement Policy',
    desc: 'Suggestions only refine and strengthen your existing experience and projects. We never invent fake roles, metrics, or skills.',
    color: '#2563eb',
  },
  {
    icon: Lock,
    title: 'Privacy-First & Full Data Control',
    desc: 'Parse PDF and DOCX resumes securely with JWT-protected endpoints, and delete any resume or your account at any time.',
    color: '#10b981',
  },
  {
    icon: Sparkles,
    title: 'Rule-Based + Optional LLM Mode',
    desc: 'Works out of the box with a deterministic NLP engine, with optional backend OpenAI or Gemini enhancement when configured.',
    color: '#f59e0b',
  },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="fade-in">
      {/* ── Hero + Product Dashboard Preview ── */}
      <section
        style={{
          background: 'var(--gradient-hero)',
          padding: 'var(--space-20) 0 var(--space-16)',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-muted)',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '0.375rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-primary-100)',
                border: '1px solid var(--color-primary-200)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }} />
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)', letterSpacing: '0.02em' }}>
                AI-Powered Resume &amp; Career Intelligence Platform
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                fontWeight: 'var(--font-extrabold)',
                lineHeight: 1.12,
                letterSpacing: '-0.025em',
                marginBottom: 'var(--space-5)',
              }}
            >
              Analyze. Improve.{' '}
              <span className="text-gradient">Get Hired.</span>
            </h1>

            <p
              style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                maxWidth: 620,
                margin: '0 auto var(--space-8)',
              }}
            >
              Upload your PDF or DOCX resume to receive an instant 7-category ATS compatibility estimate, skill gap insights, job description matching, and guided interview prep.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="btn btn-primary btn-lg">
                {isAuthenticated ? 'Go to Dashboard' : 'Start Free Analysis'}
                <ArrowRight size={18} />
              </Link>
              <Link to="/how-it-works" className="btn btn-secondary btn-lg">
                See How It Works
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)', marginTop: 'var(--space-8)', flexWrap: 'wrap' }}>
              {['PDF & DOCX Parsing', '100-Point ATS Rubric', 'No Credit Card', 'Open Source'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  <CheckCircle size={15} style={{ color: 'var(--color-success)' }} />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* ── Product Workspace Preview (Illustrative UI Mockup) ── */}
          <div
            className="card"
            style={{
              maxWidth: 960,
              margin: 'var(--space-12) auto 0',
              padding: 0,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-base)',
            }}
          >
            {/* Window bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-5)',
                background: 'var(--bg-subtle)',
                borderBottom: '1px solid var(--border-base)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>
                ResumeIQ Workspace Preview · Sample Rubric View
              </span>
              <span className="badge badge-primary">13 Modules</span>
            </div>

            {/* Preview body */}
            <div className="grid-2col" style={{ padding: 'var(--space-6)', gap: 'var(--space-6)', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-2)' }}>
                  7-Category ATS Rubric Breakdown
                </p>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                  Structured, explainable scoring
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {[
                    ['Formatting & Contact', '15 pts'],
                    ['Action Verbs & Keywords', '20 pts'],
                    ['Technical & Soft Skills', '20 pts'],
                    ['Experience & Projects', '20 pts'],
                    ['Education & Structure', '20 pts'],
                    ['Readability Length', '5 pts'],
                  ].map(([label, pts]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>{label}</span>
                      <span className="badge badge-blue">{pts}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-subtle)', border: '1px solid var(--border-base)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Workflow Pipeline</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <CheckCircle size={15} style={{ color: 'var(--color-success)' }} />
                      <span>1. Upload PDF / DOCX (magic-byte verified)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <CheckCircle size={15} style={{ color: 'var(--color-success)' }} />
                      <span>2. Extract sections, skills &amp; contact metadata</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <CheckCircle size={15} style={{ color: 'var(--color-success)' }} />
                      <span>3. Match job descriptions &amp; identify skill gaps</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <CheckCircle size={15} style={{ color: 'var(--color-success)' }} />
                      <span>4. Export PDF report or build tailored resume</span>
                    </div>
                  </div>
                </div>
                <div className="estimate-notice">
                  <span>ATS scores are deterministic estimates — never a guarantee of real ATS outcomes.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" style={{ background: 'var(--bg-base)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Platform Features</span>
            <h2 className="section-title">Everything your resume needs</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Eight integrated career tools in one cohesive workspace from upload to interview prep.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 'var(--space-5)' }}>
            {CORE_FEATURES.map((f) => {
              const Icon = ICON_MAP[f.icon];
              return (
                <div
                  key={f.id}
                  className="card card-hoverable"
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'left' }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-lg)', background: f.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)', flexShrink: 0 }}>
                    {Icon && <Icon size={21} style={{ color: f.color }} />}
                  </div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', flex: 1 }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Workflow</span>
            <h2 className="section-title">How ResumeIQ works</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>From upload to interview readiness in six clear steps.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
            {WORKFLOW_STEPS.map((s) => (
              <div key={s.step} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)', flexShrink: 0 }}>
                    {s.step}
                  </div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>{s.title}</h3>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', flex: 1 }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits & Capabilities ── */}
      <section className="section" style={{ background: 'var(--bg-base)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Engineering &amp; Trust</span>
            <h2 className="section-title">Built for accuracy and privacy</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>Honest scoring, real document parsing, and zero fabricated claims.</p>
          </div>
          <div className="grid-2col">
            {CAPABILITIES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', height: '100%' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>{title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Preview ── */}
      <section className="section" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container-sm">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Common questions</h2>
          </div>
          {FAQ_ITEMS.slice(0, 4).map((item, i) => (
            <div key={i} className="accordion-item">
              <button
                className={`accordion-trigger ${openFaq === i ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {item.q}
                {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openFaq === i && (
                <div className="accordion-content">{item.a}</div>
              )}
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
            <Link to="/faq" className="btn btn-outline-primary">View all FAQs</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ background: 'var(--gradient-brand)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-extrabold)', color: '#fff', marginBottom: 'var(--space-4)' }}>
            Ready to elevate your resume?
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.88)', marginBottom: 'var(--space-8)', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            Create a free account and run your first ATS &amp; skill-gap analysis in seconds.
          </p>
          <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="btn btn-lg" style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 'var(--font-bold)' }}>
            {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
