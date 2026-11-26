import React, { useEffect, useState } from 'react';
import { History, Trash2, Download } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const scoreColor = (s) => s >= 75 ? 'var(--color-success)' : s >= 50 ? 'var(--color-warning)' : 'var(--color-error)';

const AnalysisHistoryPage = () => {
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoad]       = useState(true);

  useEffect(() => {
    api.get('/analysis').then((r) => setAnalyses(r.data?.data || [])).catch(() => {}).finally(() => setLoad(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis? This action cannot be undone.')) return;
    try {
      await api.delete(`/analysis/${id}`);
      setAnalyses((p) => p.filter((a) => a._id !== id));
      toast.success('Analysis deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const downloadPdf = async (id, name) => {
    try {
      const res = await api.get(`/reports/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url; a.download = `${name || 'analysis'}_report.pdf`; a.click();
      window.URL.revokeObjectURL(url);
    } catch { toast.error('PDF download failed.'); }
  };

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Analysis History</h1>

      {analyses.length === 0 ? (
        <div className="empty-state"><History size={48} style={{ color: 'var(--text-muted)' }} /><p>No analyses yet. Upload a resume and run your first analysis.</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Resume</th><th>ATS Score</th><th>Engine</th><th>Skills Detected</th><th>Date</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {analyses.map((a) => (
                <tr key={a._id}>
                  <td style={{ fontWeight: 'var(--font-medium)' }}>{a.resumeName || 'Unnamed'}</td>
                  <td><span style={{ fontWeight: 'var(--font-bold)', color: scoreColor(a.atsScore) }}>{a.atsScore}%</span></td>
                  <td><span className="badge badge-muted">{a.engine || 'rule-based'}</span></td>
                  <td><span className="badge badge-primary">{a.detectedSkills?.length || 0}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => downloadPdf(a._id, a.resumeName)} title="Download PDF report"><Download size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a._id)} title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistoryPage;
