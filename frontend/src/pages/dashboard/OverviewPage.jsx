import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileSearch, BarChart3, Briefcase, ArrowRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const OverviewPage = () => {
  const { user } = useAuth();
  const [data, setData]   = useState(null);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    api.get('/users/dashboard-overview')
      .then((r) => setData(r.data?.data || null))
      .catch(() => setData(null))
      .finally(() => setLoad(false));
  }, []);

  const kpis = [
    { label: 'Resumes Uploaded', value: data?.resumeCount ?? 0, icon: Upload, color: '#6d28d9' },
    { label: 'Analyses Run',     value: data?.analysisCount ?? 0, icon: FileSearch, color: '#2563eb' },
    { label: 'Best ATS Score',   value: data?.bestAtsScore ? `${data.bestAtsScore}%` : '—', icon: BarChart3, color: '#10b981' },
    { label: 'Job Matches',      value: data?.jobMatchCount ?? 0, icon: Briefcase, color: '#f59e0b' },
  ];

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-1)' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.fullName?.split(' ')[0] || 'User'} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Here's your resume intelligence summary.</p>
      </div>

      {/* KPI cards */}
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

      {/* Quick actions */}
      {data?.resumeCount === 0 && (
        <div className="card" style={{ background: 'var(--gradient-brand-soft)', border: '1px solid var(--color-primary-200)', marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>Upload your first resume</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Get instant ATS scoring, skill gap analysis and job matching.</p>
          </div>
          <Link to="/dashboard/upload" className="btn btn-primary">
            <Upload size={16} /> Upload Resume <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">ATS Score Trend</span>
            <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
          </div>
          {data?.atsTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.atsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#6d28d9" strokeWidth={2} dot={{ fill: '#6d28d9' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <p style={{ fontSize: 'var(--text-sm)' }}>Run an analysis to see your ATS score trend.</p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Skill Distribution</span>
          </div>
          {data?.skillDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.skillDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6d28d9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <p style={{ fontSize: 'var(--text-sm)' }}>Upload a resume to see your skill distribution.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent analyses */}
      {data?.recentAnalyses?.length > 0 && (
        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <div className="card-header">
            <span className="card-title">Recent Analyses</span>
            <Link to="/dashboard/history" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}>View all</Link>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Resume</th><th>ATS Score</th><th>Engine</th><th>Date</th></tr></thead>
              <tbody>
                {data.recentAnalyses.map((a) => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 'var(--font-medium)' }}>{a.resumeName || 'Unnamed'}</td>
                    <td><span className="badge badge-primary">{a.atsScore}%</span></td>
                    <td><span className="badge badge-muted">{a.engine || 'rule-based'}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewPage;
