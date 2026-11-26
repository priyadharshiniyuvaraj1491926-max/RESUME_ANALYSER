import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

const Footer = () => (
  <footer
    style={{
      background: 'var(--bg-subtle)',
      borderTop: '1px solid var(--border-base)',
      padding: 'var(--space-12) 0 var(--space-8)',
      marginTop: 'auto',
    }}
  >
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-8)', marginBottom: 'var(--space-10)' }}>
        {/* Brand */}
        <div>
          <Logo size="sm" />
          <p style={{ marginTop: 'var(--space-4)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', maxWidth: 240 }}>
            AI-powered resume analysis &amp; career intelligence. Analyze. Improve. Get Hired.
          </p>
        </div>

        {/* Product */}
        <div>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Product</p>
          {[
            ['Features', '/features'],
            ['How It Works', '/how-it-works'],
            ['Pricing', '/pricing'],
            ['FAQ', '/faq'],
          ].map(([label, href]) => (
            <Link key={href} to={href} style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{label}</Link>
          ))}
        </div>

        {/* Company */}
        <div>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Company</p>
          {[
            ['About', '/about'],
            ['Contact', '/contact'],
          ].map(([label, href]) => (
            <Link key={href} to={href} style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{label}</Link>
          ))}
        </div>

        {/* Account */}
        <div>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Account</p>
          {[
            ['Sign In', '/signin'],
            ['Create Account', '/signup'],
            ['Dashboard', '/dashboard'],
          ].map(([label, href]) => (
            <Link key={href} to={href} style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{label}</Link>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-base)', paddingTop: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} ResumeIQ AI. Final-year engineering project. Open-source for educational use.
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          ATS scores are estimates only — not guaranteed ATS outcomes.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
