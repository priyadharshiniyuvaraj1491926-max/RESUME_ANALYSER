import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, FileSearch, BarChart2, LogOut, ChevronLeft } from 'lucide-react';
import Logo from '../components/common/Logo.jsx';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const ADMIN_NAV = [
  { label: 'Overview',   href: '/admin',           icon: LayoutDashboard },
  { label: 'Users',      href: '/admin/users',      icon: Users },
  { label: 'Usage',      href: '/admin/usage',      icon: Activity },
  { label: 'Analyses',   href: '/admin/analyses',   icon: FileSearch },
  { label: 'Analytics',  href: '/admin/analytics',  icon: BarChart2 },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (href) =>
    href === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(href);

  const handleLogout = async () => { await logout(); navigate('/signin'); };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          background: '#0d0b1a',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div style={{ height: 'var(--topbar-height)', display: 'flex', alignItems: 'center', padding: '0 var(--space-5)', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 'var(--space-3)' }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--radius-md)', background: '#fbbf2422', color: '#fbbf24' }}>
            <LayoutDashboard size={16} />
          </span>
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: '#fbbf24' }}>Admin Panel</span>
        </div>

        <nav style={{ flex: 1, padding: 'var(--space-3) var(--space-2)', overflowY: 'auto' }}>
          {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                to={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: '0.625rem var(--space-3)', borderRadius: 'var(--radius-lg)',
                  marginBottom: 'var(--space-1)', textDecoration: 'none',
                  background: active ? 'rgba(251,191,36,0.1)' : 'transparent',
                  color: active ? '#fbbf24' : '#c4b5fd',
                  fontWeight: active ? 'var(--font-semibold)' : 'var(--font-normal)',
                  fontSize: 'var(--text-sm)',
                  borderLeft: active ? '3px solid #fbbf24' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: 'var(--space-3) var(--space-2)' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: '0.625rem var(--space-3)', borderRadius: 'var(--radius-lg)',
              textDecoration: 'none', color: '#c4b5fd', fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-1)',
            }}
          >
            <ChevronLeft size={16} />
            User Dashboard
          </Link>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: '0.625rem var(--space-3)', borderRadius: 'var(--radius-lg)',
              background: 'transparent', border: 'none', color: '#c4b5fd',
              cursor: 'pointer', fontSize: 'var(--text-sm)',
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header
          style={{
            height: 'var(--topbar-height)',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-base)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 var(--space-6)', flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Logo size="sm" linkTo="/admin" />
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: '#fbbf2422', color: '#fbbf24', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' }}>
              ADMIN
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <ThemeToggle />
            <div
              style={{
                width: 36, height: 36, borderRadius: '50%', background: '#fbbf24',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0d0b1a', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)',
              }}
            >
              {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', background: 'var(--bg-subtle)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
