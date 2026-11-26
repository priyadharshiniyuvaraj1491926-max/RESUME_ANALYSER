import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Logo from '../components/common/Logo.jsx';
import ThemeToggle from '../components/common/ThemeToggle.jsx';

const AuthLayout = () => (
  <div
    style={{
      minHeight: '100vh',
      background: 'var(--gradient-hero)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)',
    }}
  >
    {/* Top bar */}
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-4) var(--space-8)',
        zIndex: 10,
      }}
    >
      <Logo size="sm" />
      <ThemeToggle />
    </div>

    {/* Card */}
    <div
      style={{
        width: '100%',
        maxWidth: 460,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-base)',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-xl)',
        padding: 'var(--space-8)',
        marginTop: 'var(--topbar-height)',
      }}
    >
      <Outlet />
    </div>

    {/* Footer note */}
    <p style={{ marginTop: 'var(--space-6)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center' }}>
      JWT-secured authentication · <Link to="/" style={{ color: 'var(--color-primary)' }}>Back to Home</Link>
    </p>
  </div>
);

export default AuthLayout;
