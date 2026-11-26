import React from 'react';
import { FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'md', linkTo = '/', showText = true }) => {
  const sizes = {
    sm: { icon: 18, text: 'var(--text-base)' },
    md: { icon: 22, text: 'var(--text-xl)' },
    lg: { icon: 28, text: 'var(--text-2xl)' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <Link
      to={linkTo}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
    >
      <div
        style={{
          width: s.icon + 14,
          height: s.icon + 14,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--gradient-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <FileSearch size={s.icon} color="#fff" />
      </div>
      {showText && (
        <span
          style={{
            fontSize: s.text,
            fontWeight: 'var(--font-extrabold)',
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
          }}
        >
          ResumeIQ
          <span style={{ WebkitTextFillColor: 'var(--text-primary)', background: 'none', color: 'var(--text-primary)' }}>
            {' '}AI
          </span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
