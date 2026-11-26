import React, { useEffect, useState, useCallback } from 'react';
import { History, Trash2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const scoreColor = (s) => s >= 75 ? 'var(--color-success)' : s >= 50 ? 'var(--color-warning)' : 'var(--color-error)';

const PAGE_SIZE = 10;

const AnalysisHistoryPage = () => {
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoad]       = useState(true);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);

  const fetchPage = useCallback(async (p) => {
    setLoad(true);
    try {
      const r = await api.get(`/analysis?page=${p}&limit=${PAGE_SIZE}`);
      setAnalyses(r.data?.analyses || []);
      setPage(r.data?.page || p);
      setTotalPages(r.data?.totalPages || 1);
      setTotal(r.data?.total || (r.data?.analyses?.length ?? 0));
    } catch {
      toast.error('Failed to load analysis history.');
    } finally {
      setLoad(false);
    }
  }, [toast]);

  useEffect(() => { fetchPage(1); }, [fetchPage]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis? This action cannot be undone.')) return;
    try {
      await api.delete(`/analysis/${id}`);
      toast.success('Analysis deleted.');
      fetchPage(page);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Analysis History</h1>
        {total > 0 && (
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            {total} total • page {page} of {totalPages}
          </span>
        )}
      </div>

      {analyses.length === 0 ? (
        <div className="empty-state"><History size={48} style={{ color: 'var(--text-muted)' }} /><p>No analyses yet. Upload a resume and run your first analysis.</p></div>
      ) : (
        <>
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
                    <td><span className="badge badge-muted">{a.analysisMode || 'rule-based'}</span></td>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => fetchPage(page - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                Page {page} / {totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages}
                onClick={() => fetchPage(page + 1)}
                aria-label="Next page"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalysisHistoryPage;
