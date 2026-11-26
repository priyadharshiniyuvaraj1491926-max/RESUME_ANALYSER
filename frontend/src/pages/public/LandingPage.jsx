import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Target, Briefcase, Wand2, Compass, MessageSquare, FileText, History, CheckCircle, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { CORE_FEATURES, WORKFLOW_STEPS, FAQ_ITEMS } from '../../utils/platformData.js';

const ICON_MAP = { BarChart3, Target, Briefcase, Wand2, Compass, MessageSquare, FileText, History, Upload };

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="fade-in">
      {/* ── Hero ── */}
      <section
        style={{
          background: 'var(--gradient-hero)',
          padding: 'var(--space-24) 0 var(--space-20)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: '0.375rem 1rem', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-100)', border: '1px solid var(--color-primary-200)', marginBottom: 'var(--space-6)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)' }}>AI-Powered Career Intelligence Platform</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 'var(--font-extrabold)',
              lineHeight: 1.1,
              marginBottom: 'var(--space-6)',
            }}
          >
            Analyze. Improve.{' '}
            <span className="text-gradient">Get Hired.</span>
          </h1>

          <p style={{ fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', maxWidth: 640, margin: '0 auto var(--space-10)' }}>
            Upload your resume and get instant ATS scoring, skill gap analysis, job matching, AI-powered improvements, and career guidance — all in one platform.
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

          {/* Trust badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)', marginTop: 'var(--space-10)', flexWrap: 'wrap' }}>
            {['No credit card', 'Instant results', 'Privacy-first', 'Open source'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" style={{ background: 'var(--bg-base)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label">Platform Features</span>
          <h2 className="section-title">Everything your resume needs</h2>
          <p className="section-desc" style={{ margin: '0 auto var(--space-12)' }}>
            Eight powerful tools, one streamlined workflow from upload to job offer.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
            {CORE_FEATURES.map((f) => {
              const Icon = ICON_MAP[f.icon];
              return (
                <div key={f.id} className="card card-hoverable" style={{ textAlign: 'left' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: f.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                    {Icon && <Icon size={22} style={{ color: f.color }} />}
                  </div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label">Workflow</span>
          <h2 className="section-title">How ResumeIQ works</h2>
          <p className="section-desc" style={{ margin: '0 auto var(--space-12)' }}>From upload to hired in six intelligent steps.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)', textAlign: 'left' }}>
            {WORKFLOW_STEPS.map((s) => (
              <div key={s.step} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)', flexShrink: 0 }}>
                    {s.step}
                  </div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>{s.title}</h3>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Preview ── */}
      <section className="section" style={{ background: 'var(--bg-base)' }}>
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
            Ready to get hired faster?
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.85)', marginBottom: 'var(--space-8)' }}>
            Start your free resume analysis now — no credit card required.
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
