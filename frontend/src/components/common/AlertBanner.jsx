import React from 'react';
import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calculator,
  X,
} from 'lucide-react';

const VARIANT_CONFIG = {
  info: {
    icon: Info,
    bg: 'var(--color-primary-50, #eff6ff)',
    border: 'var(--color-primary-200, #bfdbfe)',
    text: 'var(--color-primary-800, #1e40af)',
    iconColor: 'var(--color-primary-600, #2563eb)',
    role: 'status',
  },
  warning: {
    icon: AlertTriangle,
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#92400e',
    iconColor: '#d97706',
    role: 'alert',
  },
  error: {
    icon: AlertCircle,
    bg: '#fef2f2',
    border: '#fecaca',
    text: '#991b1b',
    iconColor: '#dc2626',
    role: 'alert',
  },
  success: {
    icon: CheckCircle2,
    bg: '#f0fdf4',
    border: '#bbf7d0',
    text: '#166534',
    iconColor: '#16a34a',
    role: 'status',
  },
  estimate: {
    icon: Calculator,
    bg: '#f8fafc',
    border: '#e2e8f0',
    text: '#334155',
    iconColor: '#64748b',
    role: 'note',
  },
};

/**
 * AlertBanner - Consistent banner component for feedback, warnings, and estimate notices.
 *
 * @param {'info'|'warning'|'error'|'success'|'estimate'} [variant='info']
 * @param {string} [title] - Optional bold title
 * @param {React.ReactNode} children - Alert message content
 * @param {Function} [onDismiss] - Optional dismiss handler
 */
export const AlertBanner = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  style = {},
}) => {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      role={config.role}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 'var(--radius-lg, 0.5rem)',
        color: config.text,
        fontSize: '0.875rem',
        lineHeight: 1.5,
        ...style,
      }}
    >
      <Icon
        size={18}
        style={{
          color: config.iconColor,
          flexShrink: 0,
          marginTop: '0.125rem',
        }}
        aria-hidden="true"
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{ fontWeight: 600, marginBottom: '0.15rem' }}>
            {title}
          </div>
        )}
        <div>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.15rem',
            cursor: 'pointer',
            color: config.text,
            opacity: 0.6,
            transition: 'opacity 0.15s ease',
            marginLeft: 'auto',
            borderRadius: '0.25rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
