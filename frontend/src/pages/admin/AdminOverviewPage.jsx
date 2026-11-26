import React, { useEffect, useState } from 'react';
import { Users, FileSearch, Activity, BarChart2 } from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';

const AdminOverviewPage = () => {
  const [data, setData]   = useState(null);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    api.get('/admin/overview')
      .then((r) => setData(r.data?.data || null))
      .catch(() => setData(null))
      .finally(() => setLoad(false));
  }, []);

  const kpis = [
    { label: 'Total Users',    value: data?.totalUsers ?? 0,    icon: Users,      color: '#6d28d9' },
    { label: 'Total Analyses', value: data?.totalAnalyses ?? 0, icon: FileSearch,  color: '#2563eb' },
    { label: 'Active Today',   value: data?.activeToday ?? 0,   icon: Activity,    color: '#10b981' },
    { label: 'Total Resumes',  value: data?.totalResumes ?? 0,  icon: BarChart2,   color: '#f59e0b' },
  ];

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>;

  return (
    <div className="fade-in">
      <PageHeader title="Admin Overview" subtitle="Platform-wide usage and health metrics." />

      <div className="grid-kpi">
        {kpis.map(({ label, value, icon, color }) => (
          <StatCard key={label} label={label} value={value} icon={icon} color={color} />
        ))}
      </div>

      {/* Quick summary */}
      {data?.usageSummary && (
        <div className="card">
          <div className="card-header"><span className="card-title">Platform Summary</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
            {Object.entries(data.usageSummary).map(([k, v]) => (
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
