import React from 'react';

/**
 * Consistent page header for dashboard and admin views.
 */
const PageHeader = ({ title, subtitle, actions }) => (
  <div className="page-header">
    <div>
      <h1 className="page-header-title">{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
    {actions && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        {actions}
      </div>
    )}
  </div>
);

export default PageHeader;
