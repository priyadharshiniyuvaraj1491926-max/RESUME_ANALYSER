import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Target, Briefcase, Wand2, Compass, MessageSquare, FileText, History } from 'lucide-react';
import { CORE_FEATURES } from '../../utils/platformData.js';

const ICON_MAP = { BarChart3, Target, Briefcase, Wand2, Compass, MessageSquare, FileText, History };

const FeaturesPage = () => (
  <div className="fade-in">
    {/* Hero */}
    <section style={{ background: 'var(--gradient-hero)', padding: 'var(--space-20) 0 var(--space-16)', textAlign: 'center' }}>
      <div className="container">
        <span className="section-label">Platform Features</span>
        <h1 className="section-title" style={{ fontSize: 'var(--text-5xl)' }}>
          Powerful tools for<br /><span className="text-gradient">every career stage</span>
        </h1>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          Eight AI-powered modules designed to take your resume from average to interview-ready.
        </p>
      </div>
    </section>

    {/* Feature details */}
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          {CORE_FEATURES.map((f, i) => {
            const Icon = ICON_MAP[f.icon];
            const isEven = i % 2 === 0;
            return (
              <div
                key={f.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 'var(--space-10)',
                  alignItems: 'center',
                }}
              >
                <div style={{ order: isEven ? 1 : 2 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 'var(--radius-xl)', background: f.color + '18', marginBottom: 'var(--space-5)' }}>
                    {Icon && <Icon size={26} style={{ color: f.color }} />}
                  </div>
                  <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-4)' }}>{f.title}</h2>
                  <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>{f.description}</p>
                  <Link to="/signup" className="btn btn-primary">Try It Free <ArrowRight size={16} /></Link>
                </div>
                <div style={{ order: isEven ? 2 : 1 }}>
                  <div
                    style={{
                      height: 220,
                      borderRadius: 'var(--radius-2xl)',
                      background: `linear-gradient(135deg, ${f.color}18 0%, ${f.color}08 100%)`,
                      border: `2px solid ${f.color}22`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {Icon && <Icon size={72} style={{ color: f.color, opacity: 0.4 }} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  </div>
);

export default FeaturesPage;
