import React, { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const CareerRecommendationsPage = () => {
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState([]);
  const [selected, setSelected] = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoad]      = useState(false);

  useEffect(() => { api.get('/analysis').then((r) => setAnalyses(r.data?.analyses || [])).catch(() => {}); }, []);

  const run = async () => {
    setLoad(true);
    try {
      const { data } = await api.get('/careers/recommendations');
      setResult(data || null);
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to load recommendations.'); }
    finally { setLoad(false); }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Career Recommendations</h1>

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 220 }}>
            <label className="form-label">Select Analysis</label>
            <select className="form-select" value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">— choose —</option>
              {analyses.map((a) => <option key={a._id} value={a._id}>{a.resumeName || a._id.slice(-6)}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={run} disabled={loading || !selected}>
            {loading ? <><span className="spinner spinner-sm" /> Loading…</> : <><Compass size={16} /> Get Recommendations</>}
          </button>
        </div>
      </div>

      {!result ? (
        <div className="empty-state"><Compass size={48} style={{ color: 'var(--text-muted)' }} /><p>Select an analysis to discover career paths that match your skills.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
          {(result.recommendations || []).map((rec, i) => (
            <div key={i} className="card card-hoverable">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>{rec.role}</h3>
                <div style={{ background: 'var(--gradient-brand)', color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                  {rec.fitScore ?? rec.fitPercentage ?? '?'}%
                </div>
              </div>

              {rec.matchingSkills?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>Matching Skills</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {rec.matchingSkills.map((s) => <span key={s} className="badge badge-success" style={{ margin: '0 var(--space-1) var(--space-1) 0' }}>{s}</span>)}
                  </div>
                </div>
              )}

              {rec.missingSkills?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>Skills to Learn</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {rec.missingSkills.map((s) => <span key={s} className="badge badge-warning" style={{ margin: '0 var(--space-1) var(--space-1) 0' }}>{s}</span>)}
                  </div>
                </div>
              )}

              {rec.learningPath?.length > 0 && (
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>Learning Path</p>
                  <ol style={{ paddingLeft: 'var(--space-5)', listStyle: 'decimal' }}>
                    {rec.learningPath.map((step, j) => (
                      <li key={j} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)', lineHeight: 'var(--leading-relaxed)' }}>
                        {typeof step === 'string' ? step : step.skill || JSON.stringify(step)}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerRecommendationsPage;
