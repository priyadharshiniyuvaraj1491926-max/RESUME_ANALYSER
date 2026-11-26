import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import ScoreGauge from '../../components/common/ScoreGauge.jsx';
import AlertBanner from '../../components/common/AlertBanner.jsx';

const CATEGORIES = [
  { key: 'formatting',  label: 'Formatting',   max: 15 },
  { key: 'keywords',    label: 'Keywords',      max: 20 },
  { key: 'skills',      label: 'Skills',        max: 20 },
  { key: 'experience',  label: 'Experience',    max: 20 },
  { key: 'education',   label: 'Education',     max: 10 },
  { key: 'structure',   label: 'Structure',     max: 10 },
  { key: 'readability', label: 'Readability',   max: 5 },
];

const scoreColor = (s) => s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';

const AtsScorePage = () => {
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState([]);
  const [selected, setSelected] = useState('');
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => { api.get('/analysis').then((r) => setAnalyses(r.data?.data || [])).catch(() => {}); }, []);

  const load = (id) => {
    const a = analyses.find((x) => x._id === id);
    setAnalysis(a || null);
  };

  const breakdown = analysis?.atsBreakdown || {};
  const chartData = CATEGORIES.map((c) => ({
    name: c.label,
    score: breakdown[c.key] ?? 0,
    max: c.max,
    pct: c.max ? Math.round(((breakdown[c.key] ?? 0) / c.max) * 100) : 0,
  }));

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>ATS Score</h1>

      <AlertBanner variant="estimate" style={{ marginBottom: 'var(--space-6)' }}>
        ATS Score is a rule-based estimate using a 7-category rubric. It is NOT a guarantee of real ATS pass/fail outcomes.
      </AlertBanner>

      {/* Selector */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 220 }}>
            <label className="form-label">Select Analysis</label>
            <select className="form-select" value={selected} onChange={(e) => { setSelected(e.target.value); load(e.target.value); }}>
              <option value="">— choose an analysis —</option>
              {analyses.map((a) => <option key={a._id} value={a._id}>{a.resumeName || a._id.slice(-6)} — {new Date(a.createdAt).toLocaleDateString()}</option>)}
            </select>
          </div>
        </div>
      </div>

      {!analysis ? (
        <div className="empty-state">
          <p>Select an analysis to view the ATS score breakdown. <br />Go to <strong>Resume Analysis</strong> to run a new one.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Score gauge */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
            <ScoreGauge score={analysis.atsScore} size={150} strokeWidth={12} label={`${analysis.analysisMode || analysis.engine || 'rule-based'} engine`} />
          </div>

          {/* Bar chart */}
          <div className="card">
            <div className="card-header"><span className="card-title">Category Breakdown</span></div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} unit="%" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} width={80} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={scoreColor(entry.pct)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Formula table */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header"><span className="card-title">Scoring Formula (100 pts total)</span></div>
            <div className="table-wrapper">
              <table className="table">
                <thead><tr><th>Category</th><th>Your Score</th><th>Max</th><th>Weight</th></tr></thead>
                <tbody>
                  {CATEGORIES.map((c) => (
                    <tr key={c.key}>
                      <td style={{ fontWeight: 'var(--font-medium)' }}>{c.label}</td>
                      <td><span style={{ fontWeight: 'var(--font-bold)', color: scoreColor(c.max ? Math.round(((breakdown[c.key] ?? 0) / c.max) * 100) : 0) }}>{breakdown[c.key] ?? 0}</span></td>
                      <td style={{ color: 'var(--text-muted)' }}>{c.max}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{c.max}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtsScorePage;
