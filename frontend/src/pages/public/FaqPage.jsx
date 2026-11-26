import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS } from '../../utils/platformData.js';

const FaqPage = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="fade-in">
      <section style={{ background: 'var(--gradient-hero)', padding: 'var(--space-16) 0', textAlign: 'center' }}>
        <div className="container">
          <span className="section-label">FAQ</span>
          <h1 className="section-title" style={{ fontSize: 'var(--text-5xl)' }}>Frequently Asked Questions</h1>
          <p className="section-desc" style={{ margin: '0 auto' }}>Everything you need to know about ResumeIQ AI.</p>
        </div>
      </section>
      <section className="section">
        <div className="container-sm">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            const headerId = `faq-header-${i}`;
            const panelId = `faq-panel-${i}`;
            return (
              <div key={i} className="accordion-item">
                <button
                  id={headerId}
                  className={`accordion-trigger ${isOpen ? 'open' : ''}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  type="button"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp size={18} aria-hidden="true" style={{ flexShrink: 0, marginLeft: 'var(--space-3)' }} />
                  ) : (
                    <ChevronDown size={18} aria-hidden="true" style={{ flexShrink: 0, marginLeft: 'var(--space-3)' }} />
                  )}
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headerId}
                    className="accordion-content"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
