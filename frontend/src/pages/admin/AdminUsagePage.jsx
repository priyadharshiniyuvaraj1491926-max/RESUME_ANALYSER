import React, { useEffect, useState } from 'react';
import { Activity, FileText, Upload, FileSearch, BarChart3, Target, Briefcase, Wand2, MessageSquare, Compass } from 'lucide-react';
import api from '../../services/api.js';

const METRIC_ICONS = { totalUploads: Upload, totalAnalyses: FileSearch, totalAtsChecks: BarChart3, totalSkillGaps: Target, totalJobMatches: Briefcase, totalImprovements: Wand2, totalInterviews: MessageSquare, totalCareerRecs: Compass, totalBuilderDrafts: FileText, totalReports: Activity };

const AdminUsagePage = () => {
  const [data, setData]   = useState(null);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    api.get('/admin/usage')
      .then((r) => setData(r.data?.usage || null))
      .catch(() => setData(null))
      .finally(() => setLoad(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>;

  const metrics = data ? Object.entries(data).filter(([, v]) => typeof v === 'number') : [];

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Platform Usage</h1>

      {metrics.length === 0 ? (
        <div className="empty-state"><Activity size={48} style={{ color: 'var(--text-muted)' }} /><p>No usage data available yet.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-5)' }}>
          {metrics.map(([key, value]) => {
            const Icon = METRIC_ICONS[key] || Activity;
            return (
              <div key={key} className="stat-card">
                <div className="stat-card-icon" style={{ background: 'var(--color-primary-100)' }}>
                  <Icon size={20} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-label" style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').replace(/^total\s?/, '')}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminUsagePage;
