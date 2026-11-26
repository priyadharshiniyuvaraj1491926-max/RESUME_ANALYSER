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
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="accordion-item">
              <button className={`accordion-trigger ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? null : i)}>
                {item.q}
                {open === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {open === i && <div className="accordion-content">{item.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
