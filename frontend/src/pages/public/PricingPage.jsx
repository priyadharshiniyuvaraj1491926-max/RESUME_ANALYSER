import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Server, Cloud } from 'lucide-react';

const TIERS = [
  {
    name: 'Self-Hosted',
    icon: Server,
    price: 'Free',
    desc: 'Run ResumeIQ AI on your own server or local machine.',
    features: [
      'All 8 analysis modules',
      'Unlimited resume uploads',
      '13 dashboard modules',
      'Admin panel',
      'Rule-based ATS engine',
      'Optional LLM integration (bring your own key)',
      'Full source code access',
    ],
    cta: { label: 'View on GitHub', href: 'https://github.com/priyadharshiniyuvaraj1491926-max/RESUME_ANALYSER', external: true },
    highlight: false,
  },
  {
    name: 'Demo Instance',
    icon: Cloud,
    price: 'Free',
    desc: 'Explore ResumeIQ AI through this hosted demonstration.',
    features: [
      'Full feature access',
      'Real resume parsing',
      'ATS score estimates',
      'Skill gap & career guidance',
      'Interview prep generator',
      'Resume builder + PDF export',
      'Secure JWT authentication',
    ],
    cta: { label: 'Get Started Free', href: '/signup', external: false },
    highlight: true,
  },
];

const PricingPage = () => (
  <div className="fade-in">
    <section style={{ background: 'var(--gradient-hero)', padding: 'var(--space-16) 0', textAlign: 'center' }}>
      <div className="container">
        <span className="section-label">Pricing</span>
        <h1 className="section-title" style={{ fontSize: 'var(--text-5xl)' }}>
          Always <span className="text-gradient">Free</span>
        </h1>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          No subscriptions, no paywalls, no credit card. ResumeIQ AI is an open-source academic project.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', gap: 'var(--space-8)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {TIERS.map(({ name, icon: Icon, price, desc, features, cta, highlight }) => (
            <div
              key={name}
              className="card"
              style={{
                width: 360,
                border: highlight ? '2px solid var(--color-primary)' : undefined,
                position: 'relative',
              }}
            >
              {highlight && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--gradient-brand)', color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', padding: '0.25rem 1rem', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>
                  RECOMMENDED
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>{name}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{desc}</p>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <span style={{ fontSize: 'var(--text-5xl)', fontWeight: 'var(--font-extrabold)', background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{price}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginLeft: 'var(--space-2)' }}>forever</span>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                {features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <CheckCircle size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              {cta.external ? (
                <a href={cta.href} target="_blank" rel="noopener noreferrer" className={`btn w-full ${highlight ? 'btn-primary' : 'btn-secondary'}`}>
                  {cta.label} <ArrowRight size={16} />
                </a>
              ) : (
                <Link to={cta.href} className={`btn w-full ${highlight ? 'btn-primary' : 'btn-secondary'}`}>
                  {cta.label} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default PricingPage;
