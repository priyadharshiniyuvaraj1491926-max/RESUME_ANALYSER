import React, { useEffect, useState } from 'react';
import { Target } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'UI/UX Designer', 'Machine Learning Engineer'];

const SkillGapPage = () => {
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState([]);
  const [form, setForm]         = useState({ analysisId: '', targetRole: '' });
  const [result, setResult]     = useState(null);
  const [loading, setLoad]      = useState(false);

  useEffect(() => { api.get('/analysis').then((r) => setAnalyses(r.data?.analyses || [])).catch(() => {}); }, []);

  const run = async () => {
    if (!form.analysisId || !form.targetRole) { toast.error('Select an analysis and target role.'); return; }
    setLoad(true);
    try {
      const { data } = await api.post('/skills/analyze-gap', form);
      setResult(data || null);
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to compute skill gap.'); }
    finally { setLoad(false); }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Skill Gap Analysis</h1>

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Analysis</label>
            <select className="form-select" value={form.analysisId} onChange={(e) => setForm((p) => ({ ...p, analysisId: e.target.value }))}>
              <option value="">— choose —</option>
              {analyses.map((a) => <option key={a._id} value={a._id}>{a.resumeName || a._id.slice(-6)}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Target Role</label>
            <select className="form-select" value={form.targetRole} onChange={(e) => setForm((p) => ({ ...p, targetRole: e.target.value }))}>
              <option value="">— choose —</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={run} disabled={loading}>
            {loading ? <><span className="spinner spinner-sm" /> Analysing…</> : <><Target size={16} /> Analyse Gap</>}
          </button>
        </div>
      </div>

      {!result ? (
        <div className="empty-state"><Target size={48} style={{ color: 'var(--text-muted)' }} /><p>Select an analysis and target role to see skill gaps.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Match score */}
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>Role Match</p>
            <div className="score-circle" style={{ margin: '0 auto var(--space-3)' }}>
              <span className="score-circle-value">{result.coveragePercent ?? '—'}%</span>
            </div>
            <p style={{ fontWeight: 'var(--font-semibold)' }}>{form.targetRole}</p>
          </div>

          {/* Present skills */}
          <div className="card">
            <div className="card-header"><span className="card-title">Skills You Have ✓</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {(result.existingSkills || []).map((s) => <span key={s} className="badge badge-success" style={{ marginRight: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>{s}</span>)}
              {!result.existingSkills?.length && <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>None detected for this role.</p>}
            </div>
          </div>

          {/* Missing skills */}
          <div className="card">
            <div className="card-header"><span className="card-title">Skills to Acquire</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {(result.missingSkills || []).map((s) => <span key={s} className="badge badge-error" style={{ marginRight: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>{s}</span>)}
              {!result.missingSkills?.length && <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-sm)' }}>✓ You have all required skills!</p>}
            </div>
          </div>

          {/* Learning path */}
          {result.roadmap?.length > 0 && (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="card-header"><span className="card-title">Suggested Learning Path</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                {result.roadmap.map((step, i) => (
                  <div key={i} style={{ padding: 'var(--space-4)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', borderLeft: '3px solid var(--color-primary)' }}>
                    <p style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>{step.skill}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{step.recommendation || step.resource || 'Build a focused project using this skill'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillGapPage;
