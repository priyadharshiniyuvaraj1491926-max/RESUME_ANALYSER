import React, { useEffect, useState } from 'react';
import { Wand2, Check, X, AlertTriangle } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const ResumeImproverPage = () => {
  const { toast } = useToast();
  const [analyses, setAnalyses]       = useState([]);
  const [selected, setSelected]       = useState('');
  const [improvements, setImprove]    = useState(null);
  const [loading, setLoad]            = useState(false);

  useEffect(() => { api.get('/analysis').then((r) => setAnalyses(r.data?.data || [])).catch(() => {}); }, []);

  const generate = async () => {
    if (!selected) { toast.error('Select an analysis first.'); return; }
    setLoad(true);
    try {
      const { data } = await api.post(`/analysis/improver/generate/${selected}`);
      setImprove(data?.data || data || null);
      toast.success('Improvement suggestions generated!');
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to generate improvements.'); }
    finally { setLoad(false); }
  };

  const decide = async (index, action) => {
    try {
      await api.patch(`/analysis/improver/${selected}/decision`, { index, status: action === 'accept' ? 'accepted' : 'rejected' });
      toast.success(`Suggestion ${action === 'accept' ? 'accepted' : 'rejected'}.`);
    } catch { /* ignore */ }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Resume Improver</h1>

      <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)' }}>
        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
        <span><strong>Zero fabrication policy:</strong> Suggestions only rephrase and enhance your existing content — they never invent skills, roles or achievements.</span>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 220 }}>
            <label className="form-label">Select Analysis</label>
            <select className="form-select" value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">— choose —</option>
              {analyses.map((a) => <option key={a._id} value={a._id}>{a.resumeName || a._id.slice(-6)} — {new Date(a.createdAt).toLocaleDateString()}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={generate} disabled={loading || !selected}>
            {loading ? <><span className="spinner spinner-sm" /> Generating…</> : <><Wand2 size={16} /> Generate Improvements</>}
          </button>
        </div>
      </div>

      {!improvements ? (
        <div className="empty-state"><Wand2 size={48} style={{ color: 'var(--text-muted)' }} /><p>Select an analysis and generate improvement suggestions.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {(improvements.suggestions || improvements || []).map((item, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <span className="badge badge-primary">{item.section || `Suggestion ${i + 1}`}</span>
                {item.priority && <span className={`badge badge-${item.priority === 'high' ? 'error' : item.priority === 'medium' ? 'warning' : 'muted'}`}>{item.priority}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {/* Original */}
                <div style={{ padding: 'var(--space-4)', background: 'var(--color-error-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-error-border)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-error)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>Original</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{item.original || '—'}</p>
                </div>
                {/* Improved */}
                <div style={{ padding: 'var(--space-4)', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-success-border)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-success)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>Improved</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{item.improved || '—'}</p>
                </div>
              </div>
              {item.reasoning && (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-3)', lineHeight: 'var(--leading-relaxed)' }}>
                  <strong>Why:</strong> {item.reasoning}
                </p>
              )}
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <button className="btn btn-sm" style={{ background: 'var(--color-success)', color: '#fff', border: 'none' }} onClick={() => decide(i, 'accept')}>
                  <Check size={14} /> Accept
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => decide(i, 'reject')}>
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeImproverPage;
