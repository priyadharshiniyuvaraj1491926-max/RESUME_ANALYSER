import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'UI/UX Designer', 'Machine Learning Engineer'];

const InterviewPrepPage = () => {
  const { toast } = useToast();
  const [analyses, setAnalyses]     = useState([]);
  const [sessions, setSessions]     = useState([]);
  const [form, setForm]             = useState({ analysisId: '', targetRole: '' });
  const [session, setSession]       = useState(null);
  const [generating, setGen]        = useState(false);
  const [answers, setAnswers]       = useState({});
  const [feedbacks, setFeedbacks]   = useState({});
  const [submitting, setSubmitting] = useState({});
  const [expanded, setExpanded]     = useState({});

  useEffect(() => {
    Promise.all([api.get('/analysis'), api.get('/interview/sessions')])
      .then(([a, s]) => { setAnalyses(a.data?.analyses || []); setSessions(s.data?.sessions || []); })
      .catch(() => {});
  }, []);

  const generate = async () => {
    if (!form.analysisId || !form.targetRole) { toast.error('Select analysis and role.'); return; }
    setGen(true);
    try {
      const { data } = await api.post('/interview/generate', form);
      const s = data?.session || null;
      setSession(s);
      if (s) setSessions((p) => [s, ...p]);
      toast.success('Interview questions generated!');
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to generate.'); }
    finally { setGen(false); }
  };

  const submitAnswer = async (sessionId, questionId, questionIndex) => {
    const userAnswer = answers[questionIndex];
    if (!userAnswer?.trim()) { toast.error('Type your answer first.'); return; }
    setSubmitting((p) => ({ ...p, [questionIndex]: true }));
    try {
      const { data } = await api.post(`/interview/sessions/${sessionId}/answer`, { questionId, userAnswer });
      const updatedQ = data?.session?.questions?.[questionIndex];
      setFeedbacks((p) => ({ ...p, [questionIndex]: updatedQ?.feedback || 'Answer submitted.' }));
      toast.success('Feedback received!');
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to submit answer.'); }
    finally { setSubmitting((p) => ({ ...p, [questionIndex]: false })); }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Interview Preparation</h1>

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
          <button className="btn btn-primary" onClick={generate} disabled={generating}>
            {generating ? <><span className="spinner spinner-sm" /> Generating…</> : <><MessageSquare size={16} /> Generate Questions</>}
          </button>
        </div>
      </div>

      {/* Load past session */}
      {sessions.length > 0 && !session && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header"><span className="card-title">Past Sessions</span></div>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Role</th><th>Questions</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {sessions.slice(0, 8).map((s) => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 'var(--font-medium)' }}>{s.targetRole}</td>
                    <td>{s.questions?.length || 0}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td><button className="btn btn-secondary btn-sm" onClick={() => setSession(s)}>Load</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Questions */}
      {session ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <span className="badge badge-primary">{session.targetRole}</span>
            <span className="badge badge-muted">{session.questions?.length || 0} questions</span>
          </div>
          {(session.questions || []).map((q, i) => (
            <div key={i} className="card">
              <button
                onClick={() => setExpanded((p) => ({ ...p, [i]: !p[i] }))}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                <p style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', flex: 1 }}>
                  <span style={{ color: 'var(--color-primary)', marginRight: 'var(--space-2)' }}>Q{i + 1}.</span>
                  {q.question || q.text || q}
                </p>
                {expanded[i] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {expanded[i] && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">Your Answer</label>
                    <textarea className="form-textarea" rows={4} placeholder="Type your mock answer here…" value={answers[i] || ''} onChange={(e) => setAnswers((p) => ({ ...p, [i]: e.target.value }))} />
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => submitAnswer(session._id, q._id, i)} disabled={submitting[i]}>
                    {submitting[i] ? <><span className="spinner spinner-sm" /> Submitting…</> : <><Send size={14} /> Submit for Feedback</>}
                  </button>
                  {feedbacks[i] && (
                    <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--color-info-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-info-border)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                      <strong style={{ color: 'var(--color-info)' }}>Feedback:</strong> {feedbacks[i]}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !sessions.length && (
          <div className="empty-state"><MessageSquare size={48} style={{ color: 'var(--text-muted)' }} /><p>Generate interview questions for your target role.</p></div>
        )
      )}
    </div>
  );
};

export default InterviewPrepPage;
