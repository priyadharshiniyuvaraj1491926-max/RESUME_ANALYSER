import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Upload, FileSearch, BarChart3, Target, Briefcase,
  Wand2, Compass, MessageSquare, FileText, History, User, Settings,
  ChevronLeft, ChevronRight, Bell, LogOut, Shield,
} from 'lucide-react';
import Logo from '../components/common/Logo.jsx';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { label: 'Overview',         href: '/dashboard',                  icon: LayoutDashboard },
  { label: 'Upload Resume',    href: '/dashboard/upload',            icon: Upload },
  { label: 'Analysis',         href: '/dashboard/analysis',          icon: FileSearch },
  { label: 'ATS Score',        href: '/dashboard/ats',               icon: BarChart3 },
  { label: 'Skill Gap',        href: '/dashboard/skill-gap',         icon: Target },
  { label: 'Job Matcher',      href: '/dashboard/job-matcher',       icon: Briefcase },
  { label: 'Resume Improver',  href: '/dashboard/improver',          icon: Wand2 },
  { label: 'Career Advice',    href: '/dashboard/career',            icon: Compass },
  { label: 'Interview Prep',   href: '/dashboard/interview',         icon: MessageSquare },
  { label: 'Resume Builder',   href: '/dashboard/builder',           icon: FileText },
  { label: 'History',          href: '/dashboard/history',           icon: History },
  { label: 'Profile',          href: '/dashboard/profile',           icon: User },
  { label: 'Settings',         href: '/dashboard/settings',          icon: Settings },
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const isActive = (href) =>
    href === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(href);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          background: 'var(--bg-sidebar)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          transition: 'width 0.25s ease',
          overflow: 'hidden',
          zIndex: 'var(--z-sticky)',
        }}
      >
        {/* Sidebar header */}
        <div
          style={{
            height: 'var(--topbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '0' : '0 var(--space-4)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}
        >
          {!collapsed && <Logo size="sm" linkTo="/dashboard" />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 28, height: 28,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: 'var(--text-on-sidebar)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-3) var(--space-2)' }}>
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                to={href}
                title={collapsed ? label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: collapsed ? '0.625rem' : '0.625rem var(--space-3)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: 'var(--space-1)',
                  textDecoration: 'none',
                  background: active ? 'var(--bg-sidebar-active)' : 'transparent',
                  color: active ? 'var(--text-on-sidebar-active)' : 'var(--text-on-sidebar)',
                  fontWeight: active ? 'var(--font-semibold)' : 'var(--font-normal)',
                  fontSize: 'var(--text-sm)',
                  transition: 'all 0.15s',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderLeft: active ? '3px solid var(--color-primary-500)' : '3px solid transparent',
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: 'var(--space-3) var(--space-2)', flexShrink: 0 }}>
          {isAdmin && (
            <Link
              to="/admin"
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: collapsed ? '0.625rem' : '0.625rem var(--space-3)',
                borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-1)',
                textDecoration: 'none', color: '#fbbf24',
                fontSize: 'var(--text-sm)', justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              title={collapsed ? 'Admin Panel' : undefined}
            >
              <Shield size={16} style={{ flexShrink: 0 }} />
              {!collapsed && 'Admin Panel'}
            </Link>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: collapsed ? '0.625rem' : '0.625rem var(--space-3)',
              borderRadius: 'var(--radius-lg)', background: 'transparent', border: 'none',
              color: 'var(--text-on-sidebar)', cursor: 'pointer',
              fontSize: 'var(--text-sm)', justifyContent: collapsed ? 'center' : 'flex-start',
            }}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header
          style={{
            height: 'var(--topbar-height)',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--space-6)',
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              Welcome back,{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                {user?.fullName?.split(' ')[0] || 'User'}
              </span>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <ThemeToggle />
            <Link
              to="/dashboard/profile"
              style={{
                width: 36, height: 36,
                borderRadius: '50%',
                background: 'var(--gradient-brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
                fontWeight: 'var(--font-bold)',
                fontSize: 'var(--text-sm)',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-6)',
            background: 'var(--bg-subtle)',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
