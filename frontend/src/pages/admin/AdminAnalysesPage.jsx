import React, { useEffect, useState } from 'react';
import { FileSearch } from 'lucide-react';
import api from '../../services/api.js';

const AdminAnalysesPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoad]       = useState(true);

  useEffect(() => {
    api.get('/admin/analyses')
      .then((r) => setAnalyses(r.data?.analyses || []))
      .catch(() => setAnalyses([]))
      .finally(() => setLoad(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Monitor Analyses</h1>

      <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)' }}>
        <FileSearch size={16} style={{ flexShrink: 0 }} />
        <span>This view is privacy-safe. Resume text and personal contact data are not shown to administrators.</span>
      </div>

      {analyses.length === 0 ? (
        <div className="empty-state"><FileSearch size={48} style={{ color: 'var(--text-muted)' }} /><p>No analyses found on the platform yet.</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>User</th><th>Resume</th><th>ATS Score</th><th>Engine</th><th>Skills Detected</th><th>Date</th></tr>
            </thead>
            <tbody>
              {analyses.map((a) => (
                <tr key={a._id}>
                  <td style={{ fontWeight: 'var(--font-medium)' }}>{a.userName || a.userId?.fullName || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{a.resumeName || '—'}</td>
                  <td><span className={`badge badge-${(a.atsScore ?? 0) >= 75 ? 'success' : (a.atsScore ?? 0) >= 50 ? 'warning' : 'error'}`}>{a.atsScore}%</span></td>
                  <td><span className="badge badge-muted">{a.engine || 'rule-based'}</span></td>
                  <td><span className="badge badge-primary">{a.detectedSkills?.length || 0}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAnalysesPage;
