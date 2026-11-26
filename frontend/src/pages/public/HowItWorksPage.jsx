import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { WORKFLOW_STEPS } from '../../utils/platformData.js';

const HowItWorksPage = () => (
  <div className="fade-in">
    <section style={{ background: 'var(--gradient-hero)', padding: 'var(--space-20) 0', textAlign: 'center' }}>
      <div className="container">
        <span className="section-label">Workflow</span>
        <h1 className="section-title" style={{ fontSize: 'var(--text-5xl)' }}>
          How <span className="text-gradient">ResumeIQ AI</span> works
        </h1>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          From upload to interview-ready in six intelligent steps.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container-sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'relative' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: 17, top: 36, bottom: 36, width: 2, background: 'var(--border-base)', zIndex: 0 }} />

          {WORKFLOW_STEPS.map((s) => (
            <div key={s.step} style={{ display: 'flex', gap: 'var(--space-6)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)', flexShrink: 0 }}>
                {s.step}
              </div>
              <div className="card" style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>{s.title}</h3>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
          <Link to="/signup" className="btn btn-primary btn-lg">Get Started <ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  </div>
);

export default HowItWorksPage;
