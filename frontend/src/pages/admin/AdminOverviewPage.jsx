import React, { useEffect, useState } from 'react';
import { Users, FileSearch, Activity, BarChart2 } from 'lucide-react';
import api from '../../services/api.js';

const AdminOverviewPage = () => {
  const [data, setData]   = useState(null);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    api.get('/admin/overview')
      .then((r) => setData(r.data || null))
      .catch(() => setData(null))
      .finally(() => setLoad(false));
  }, []);

  const s = data?.stats || {};
  const u = data?.usage || {};
  const kpis = [
    { label: 'Registered Users',    value: s.registeredUsers ?? 0,    icon: Users,      color: '#6d28d9' },
    { label: 'Completed Analyses',  value: s.completedAnalyses ?? 0,  icon: FileSearch,  color: '#2563eb' },
    { label: 'Uploaded Resumes',    value: s.uploadedResumes ?? 0,    icon: Activity,    color: '#10b981' },
    { label: 'Job Matches',         value: u.jobMatches ?? 0,         icon: BarChart2,   color: '#f59e0b' },
  ];

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Admin Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-card-icon" style={{ background: color + '18' }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick summary */}
      {data?.usage && (
        <div className="card">
          <div className="card-header"><span className="card-title">Platform Summary</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
            {Object.entries(data.usage).map(([k, v]) => (
              <div key={k} style={{ padding: 'var(--space-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--color-primary)' }}>{v}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverviewPage;
