import React from 'react';

/**
 * Standardized empty state card with icon, message, and optional CTA.
 */
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="card empty-state">
    {Icon && (
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <Icon size={26} />
      </div>
    )}
    {title && <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{title}</h3>}
    {description && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', maxWidth: 420 }}>{description}</p>}
    {action}
  </div>
);

export default EmptyState;
