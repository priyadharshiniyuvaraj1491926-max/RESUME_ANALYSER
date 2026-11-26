import React, { useEffect, useState } from 'react';
import { FileSearch, Play } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 'var(--space-6)' }}>
    <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
    {children}
  </div>
);

const SkillChip = ({ label, variant = 'primary' }) => (
  <span className={`badge badge-${variant}`} style={{ marginRight: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>{label}</span>
);

const ResumeAnalysisPage = () => {
  const { toast } = useToast();
  const [resumes, setResumes]     = useState([]);
  const [analyses, setAnalyses]   = useState([]);
  const [selected, setSelected]   = useState({ resumeId: '', analysisId: '' });
  const [analysis, setAnalysis]   = useState(null);
  const [running, setRunning]     = useState(false);

  useEffect(() => {
    Promise.all([api.get('/resumes'), api.get('/analysis')])
      .then(([r, a]) => {
        setResumes(r.data?.data || []);
        setAnalyses(a.data?.data || []);
      }).catch(() => {});
  }, []);

  const runAnalysis = async () => {
    if (!selected.resumeId) { toast.error('Select a resume first.'); return; }
    setRunning(true);
    try {
      const { data } = await api.post('/analysis/run', { resumeId: selected.resumeId });
      const a = data?.data || null;
      setAnalysis(a);
      if (a) setAnalyses((prev) => [a, ...prev]);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Analysis failed.');
    } finally {
      setRunning(false);
    }
  };

  const loadAnalysis = (id) => {
    const a = analyses.find((x) => x._id === id);
    if (a) setAnalysis(a);
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Resume Analysis</h1>

      {/* Controls */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Resume</label>
            <select className="form-select" value={selected.resumeId} onChange={(e) => setSelected((p) => ({ ...p, resumeId: e.target.value }))}>
              <option value="">— choose —</option>
              {resumes.map((r) => <option key={r._id} value={r._id}>{r.originalName || r.filename}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Or load past analysis</label>
            <select className="form-select" value={selected.analysisId} onChange={(e) => { setSelected((p) => ({ ...p, analysisId: e.target.value })); loadAnalysis(e.target.value); }}>
              <option value="">— choose —</option>
              {analyses.map((a) => <option key={a._id} value={a._id}>{a.resumeName || a._id.slice(-6)} — {new Date(a.createdAt).toLocaleDateString()}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={runAnalysis} disabled={running || !selected.resumeId}>
            {running ? <><span className="spinner spinner-sm" /> Analysing…</> : <><Play size={16} /> Run Analysis</>}
          </button>
        </div>
      </div>

      {!analysis ? (
        <div className="empty-state">
          <FileSearch size={48} style={{ color: 'var(--text-muted)' }} />
          <p>Select a resume and run an analysis, or load a past result.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Left column */}
          <div>
            {/* Contact */}
            {analysis.contactInfo && (
              <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
                <Section title="Contact Information">
                  {Object.entries(analysis.contactInfo).filter(([, v]) => v).map(([k, v]) => (
                    <p key={k} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                      <strong style={{ textTransform: 'capitalize' }}>{k}:</strong> {v}
                    </p>
                  ))}
                </Section>
              </div>
            )}

            {/* Skills */}
            <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
              <Section title="Detected Skills">
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {(analysis.detectedSkills || []).map((s) => <SkillChip key={s} label={s} />)}
                  {!analysis.detectedSkills?.length && <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No skills detected.</p>}
                </div>
              </Section>
              {analysis.missingSections?.length > 0 && (
                <Section title="Missing Sections">
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {analysis.missingSections.map((s) => <SkillChip key={s} label={s} variant="error" />)}
                  </div>
                </Section>
              )}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="card">
              {analysis.strengths?.length > 0 && (
                <Section title="Strengths">
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {analysis.strengths.map((s, i) => <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', paddingLeft: 'var(--space-4)', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--color-success)' }}>✓</span>{s}</li>)}
                  </ul>
                </Section>
              )}
              {analysis.weaknesses?.length > 0 && (
                <Section title="Areas to Improve">
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {analysis.weaknesses.map((s, i) => <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', paddingLeft: 'var(--space-4)', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--color-warning)' }}>⚠</span>{s}</li>)}
                  </ul>
                </Section>
              )}
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* ATS score summary */}
            <div className="card" style={{ marginBottom: 'var(--space-5)', textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>ATS Score Estimate</p>
              <div className="score-circle" style={{ margin: '0 auto var(--space-3)' }}>
                <span className="score-circle-value">{analysis.atsScore ?? '—'}</span>
                <span className="score-circle-label">/ 100</span>
              </div>
              <div className="estimate-notice">
                <span>⚠ This is a rule-based estimate, not a guarantee of real ATS outcomes.</span>
              </div>
            </div>

            {/* Improvement suggestions */}
            {analysis.improvementSuggestions?.length > 0 && (
              <div className="card">
                <Section title="Improvement Suggestions">
                  {analysis.improvementSuggestions.map((s, i) => (
                    <div key={i} style={{ padding: 'var(--space-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                      {typeof s === 'object' ? s.suggestion || s.text || JSON.stringify(s) : s}
                    </div>
                  ))}
                </Section>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysisPage;
