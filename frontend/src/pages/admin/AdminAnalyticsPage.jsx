import React, { useEffect, useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import api from '../../services/api.js';

const AdminAnalyticsPage = () => {
  const [data, setData]   = useState(null);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then((r) => setData(r.data || null))
      .catch(() => setData(null))
      .finally(() => setLoad(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Platform Analytics</h1>

      {!data ? (
        <div className="empty-state"><BarChart2 size={48} style={{ color: 'var(--text-muted)' }} /><p>Analytics data not available yet. Users need to interact with the platform first.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Feature usage bar chart */}
          {data.featureUsage?.length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-title">Feature Usage</span></div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.featureUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" />
                  <XAxis dataKey="feature" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6d28d9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Daily registrations line chart */}
          {data.dailyTrend?.length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-title">Daily Registrations</span></div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Avg ATS score */}
          {data.avgAtsScore != null && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>Average ATS Score (all users)</p>
              <div className="score-circle" style={{ width: 100, height: 100 }}>
                <span className="score-circle-value" style={{ fontSize: 'var(--text-2xl)' }}>{Math.round(data.avgAtsScore)}</span>
                <span className="score-circle-label">/ 100</span>
              </div>
            </div>
          )}

          {/* Top skills */}
          {data.topSkills?.length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-title">Most Common Skills</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {data.topSkills.map((s) => (
                  <span key={s.skill || s} className="badge badge-primary" style={{ fontSize: 'var(--text-xs)' }}>
                    {s.skill || s} {s.count != null && <span style={{ opacity: 0.7, marginLeft: 4 }}>({s.count})</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
