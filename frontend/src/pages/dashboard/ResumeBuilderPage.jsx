import React, { useEffect, useState } from 'react';
import { FileText, Download, Save, Eye } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const TEMPLATES = [
  { id: 'professional', name: 'Professional', desc: 'Clean, modern layout ideal for corporate roles.', color: '#6d28d9' },
  { id: 'minimal',      name: 'Minimal',      desc: 'Simple, ATS-friendly with maximum readability.', color: '#2563eb' },
  { id: 'creative',     name: 'Creative',      desc: 'Bold layout with accent colors for design roles.', color: '#10b981' },
];

const EMPTY = { template: 'professional', fullName: '', email: '', phone: '', location: '', summary: '', experience: '', education: '', skills: '', projects: '', certifications: '' };

const ResumeBuilderPage = () => {
  const { toast } = useToast();
  const [form, setForm]       = useState({ ...EMPTY });
  const [saving, setSaving]   = useState(false);
  const [exporting, setExport] = useState(false);
  const [showPreview, setShow] = useState(false);

  useEffect(() => {
    api.get('/builder/draft').then((r) => {
      if (r.data?.draft) setForm({ ...EMPTY, ...r.data.draft });
    }).catch(() => {});
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const saveDraft = async () => {
    setSaving(true);
    try {
      await api.put('/builder/draft', form);
      toast.success('Draft saved!');
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to save draft.'); }
    finally { setSaving(false); }
  };

  const exportPdf = async () => {
    setExport(true);
    try {
      const res = await api.post('/builder/export-pdf', form, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url; a.download = `${form.fullName || 'resume'}_resumeiq.pdf`; a.click();
      window.URL.revokeObjectURL(url);
      toast.success('PDF exported!');
    } catch (err) { toast.error(err?.response?.data?.message || 'Export failed.'); }
    finally { setExport(false); }
  };

  const importFromAnalysis = async () => {
    try {
      const { data } = await api.get('/analysis');
      const latest = (data?.analyses || [])[0];
      if (!latest) { toast.warning('No analysis found to import from.'); return; }
      const sec = latest.extractedSections || {};
      setForm((p) => ({
        ...p,
        fullName: sec.name || p.fullName,
        email: sec.contact?.email || p.email,
        phone: sec.contact?.phone || p.phone,
        summary: sec.summary || p.summary,
        skills: (latest.detectedSkills || []).join(', ') || p.skills,
      }));
      toast.success('Imported data from latest analysis!');
    } catch { toast.error('Failed to import analysis data.'); }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Resume Builder</h1>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary btn-sm" onClick={importFromAnalysis}>Import from Analysis</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setShow(!showPreview)}><Eye size={14} /> {showPreview ? 'Hide' : 'Show'} Preview</button>
        </div>
      </div>

      {/* Template picker */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setForm((p) => ({ ...p, template: t.id }))}
            className="card"
            style={{
              cursor: 'pointer', flex: '1 1 180px', textAlign: 'center', border: form.template === t.id ? `2px solid ${t.color}` : undefined,
              background: form.template === t.id ? `${t.color}08` : undefined, padding: 'var(--space-4)',
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: t.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-3)' }}>
              <FileText size={18} style={{ color: t.color }} />
            </div>
            <p style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>{t.name}</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t.desc}</p>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', gap: 'var(--space-6)' }}>
        {/* Editor */}
        <div className="card">
          <div className="card-header"><span className="card-title">Resume Content</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            {['fullName', 'email', 'phone', 'location'].map((f) => (
              <div key={f} className="form-group">
                <label className="form-label" style={{ textTransform: 'capitalize' }}>{f.replace(/([A-Z])/g, ' $1')}</label>
                <input name={f} value={form[f]} onChange={handleChange} className="form-input" />
              </div>
            ))}
          </div>
          {['summary', 'experience', 'education', 'skills', 'projects', 'certifications'].map((f) => (
            <div key={f} className="form-group">
              <label className="form-label" style={{ textTransform: 'capitalize' }}>{f}</label>
              <textarea name={f} value={form[f]} onChange={handleChange} className="form-textarea" rows={f === 'summary' ? 3 : 4} placeholder={f === 'skills' ? 'Comma-separated skills' : `Enter your ${f}…`} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <button className="btn btn-secondary" onClick={saveDraft} disabled={saving}>
              {saving ? <><span className="spinner spinner-sm" /> Saving…</> : <><Save size={16} /> Save Draft</>}
            </button>
            <button className="btn btn-primary" onClick={exportPdf} disabled={exporting}>
              {exporting ? <><span className="spinner spinner-sm" /> Exporting…</> : <><Download size={16} /> Export PDF</>}
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="card" style={{ background: '#fff', color: '#1a1a2e', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
            <div style={{ padding: 'var(--space-6)', borderBottom: '3px solid #6d28d9' }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', color: '#1a1a2e' }}>{form.fullName || 'Your Name'}</h2>
              <p style={{ fontSize: 'var(--text-sm)', color: '#666' }}>{[form.email, form.phone, form.location].filter(Boolean).join(' • ')}</p>
            </div>
            {form.summary && (
              <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid #eee' }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', color: '#6d28d9', marginBottom: 'var(--space-2)' }}>Summary</h3>
                <p style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', whiteSpace: 'pre-wrap' }}>{form.summary}</p>
              </div>
            )}
            {['experience', 'education', 'projects', 'certifications'].map((sec) =>
              form[sec] ? (
                <div key={sec} style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', color: '#6d28d9', marginBottom: 'var(--space-2)' }}>{sec}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', whiteSpace: 'pre-wrap' }}>{form[sec]}</p>
                </div>
              ) : null
            )}
            {form.skills && (
              <div style={{ padding: 'var(--space-4) var(--space-6)' }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', color: '#6d28d9', marginBottom: 'var(--space-2)' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {form.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                    <span key={s} style={{ padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: '#ede9fe', color: '#6d28d9', fontSize: 'var(--text-xs)', fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
