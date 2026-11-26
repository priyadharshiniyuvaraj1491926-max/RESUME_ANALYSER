import React, { useEffect, useState } from 'react';
import { Briefcase, Search } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const JobMatcherPage = () => {
  const { toast } = useToast();
  const [resumes, setResumes]   = useState([]);
  const [matches, setMatches]   = useState([]);
  const [form, setForm]         = useState({ resumeId: '', jobTitle: '', jobDescription: '' });
  const [result, setResult]     = useState(null);
  const [loading, setLoad]      = useState(false);

  useEffect(() => {
    Promise.all([api.get('/resumes'), api.get('/jobs/matches')])
      .then(([r, m]) => { setResumes(r.data?.resumes || []); setMatches(m.data?.matches || []); })
      .catch(() => {});
  }, []);

  const run = async () => {
    if (!form.resumeId || !form.jobDescription) { toast.error('Select a resume and paste a job description.'); return; }
    setLoad(true);
    try {
      const { data } = await api.post('/jobs/match', form);
      const r = data?.match || null;
      setResult(r);
      if (r) setMatches((p) => [r, ...p]);
      toast.success('Job match complete!');
    } catch (err) { toast.error(err?.response?.data?.message || 'Match failed.'); }
    finally { setLoad(false); }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Job Description Matcher</h1>

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Resume</label>
            <select className="form-select" value={form.resumeId} onChange={(e) => setForm((p) => ({ ...p, resumeId: e.target.value }))}>
              <option value="">— choose —</option>
              {resumes.map((r) => <option key={r._id} value={r._id}>{r.originalName || r.filename}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Job Title (optional)</label>
            <input className="form-input" value={form.jobTitle} onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))} placeholder="e.g. Senior React Developer" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label form-label-required">Job Description</label>
          <textarea className="form-textarea" rows={6} value={form.jobDescription} onChange={(e) => setForm((p) => ({ ...p, jobDescription: e.target.value }))} placeholder="Paste the full job description here…" />
        </div>
        <button className="btn btn-primary" onClick={run} disabled={loading}>
          {loading ? <><span className="spinner spinner-sm" /> Matching…</> : <><Search size={16} /> Match Job</>}
        </button>
      </div>

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>Match Percentage</p>
            <div className="score-circle" style={{ margin: '0 auto' }}>
              <span className="score-circle-value">{result.matchPercentage ?? '—'}%</span>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Matched Keywords</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {(result.matchingKeywords || []).map((k) => <span key={k} className="badge badge-success" style={{ margin: '0 var(--space-2) var(--space-2) 0' }}>{k}</span>)}
              {!result.matchingKeywords?.length && <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No keywords matched.</p>}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Missing Keywords</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {(result.missingKeywords || []).map((k) => <span key={k} className="badge badge-error" style={{ margin: '0 var(--space-2) var(--space-2) 0' }}>{k}</span>)}
              {!result.missingKeywords?.length && <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-sm)' }}>All keywords present!</p>}
            </div>
          </div>
          {result.recommendations?.length > 0 && (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="card-header"><span className="card-title">Tailoring Suggestions</span></div>
              {result.recommendations.map((s, i) => (
                <div key={i} style={{ padding: 'var(--space-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {typeof s === 'string' ? s : s.text || JSON.stringify(s)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {matches.length > 0 && (
        <div className="card">
          <div className="card-header"><span className="card-title">Match History</span></div>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Job Title</th><th>Match %</th><th>Date</th></tr></thead>
              <tbody>
                {matches.slice(0, 10).map((m) => (
                  <tr key={m._id} onClick={() => setResult(m)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: 'var(--font-medium)' }}>{m.jobTitle || 'Untitled'}</td>
                    <td><span className="badge badge-primary">{m.matchPercentage}%</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
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

export default JobMatcherPage;
