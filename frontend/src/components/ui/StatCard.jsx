import React from 'react';

/**
 * Standardized KPI stat card used across user and admin dashboards.
 */
const StatCard = ({ label, value, icon: Icon, color = '#6d28d9', hint }) => (
  <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
      <div className="stat-card-icon" style={{ background: `${color}18`, marginBottom: 0 }}>
        {Icon && <Icon size={20} style={{ color }} />}
      </div>
      {hint && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
    <div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  </div>
);

export default StatCard;
