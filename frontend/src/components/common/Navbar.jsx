import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_LINKS = [
  { label: 'Features',     href: '/features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing',      href: '/pricing' },
  { label: 'About',        href: '/about' },
  { label: 'Contact',      href: '/contact' },
];

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        background: scrolled ? 'var(--bg-navbar-scrolled)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-base)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'var(--topbar-height)',
        }}
      >
        <Logo />

        {/* Desktop nav */}
        <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              style={{
                padding: '0.4rem 0.875rem',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: location.pathname === l.href ? 'var(--color-primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>
          ) : (
            <>
              <Link to="/signin" className="btn btn-ghost btn-sm hide-mobile">Sign In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
          {/* Hamburger */}
          <button
            className="btn btn-ghost btn-icon"
            style={{ display: 'none' }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            id="hamburger-btn"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-base)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link to="/signin" className="btn btn-secondary" style={{ marginTop: 'var(--space-2)' }}>Sign In</Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          #hamburger-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
