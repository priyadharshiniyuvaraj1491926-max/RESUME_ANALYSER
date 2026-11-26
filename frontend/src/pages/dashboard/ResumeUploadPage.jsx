import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, FileText, Eye } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';

const ResumeUploadPage = () => {
  const { toast }  = useToast();
  const fileInput  = useRef(null);
  const [resumes, setResumes]   = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUpload]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoad]      = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading]   = useState(false);

  const fetchResumes = () => {
    api.get('/resumes').then((r) => setResumes(r.data?.data || [])).catch(() => setResumes([])).finally(() => setLoad(false));
  };

  useEffect(() => { fetchResumes(); }, []);

  const uploadFile = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) { toast.error('Only PDF and DOCX files are supported.'); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error('File must be under 5 MB.'); return; }

    setUpload(true); setProgress(0);
    const fd = new FormData();
    fd.append('resume', file);
    try {
      await api.post('/resumes/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      toast.success('Resume uploaded and parsed successfully!');
      fetchResumes();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUpload(false); setProgress(0);
    }
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); uploadFile(e.dataTransfer.files[0]); };

  const confirmDelete = async () => {
    if (!resumeToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/resumes/${resumeToDelete}`);
      toast.success('Resume deleted.');
      setResumes((p) => p.filter((r) => r._id !== resumeToDelete));
      if (preview?._id === resumeToDelete) setPreview(null);
      setResumeToDelete(null);
    } catch {
      toast.error('Failed to delete resume.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Upload Resume</h1>

      {/* Drop zone */}
      <div
        className={`drop-zone ${dragging ? 'drag-active' : ''}`}
        onClick={() => fileInput.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{ marginBottom: 'var(--space-6)' }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Upload size={26} style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <p style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)' }}>
            {dragging ? 'Drop your resume here' : 'Click or drag to upload'}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>PDF or DOCX · Max 5 MB</p>
        </div>
        <input ref={fileInput} type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={(e) => uploadFile(e.target.files[0])} />
      </div>

      {/* Upload progress */}
      {uploading && (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
            <span>Uploading and parsing…</span><span>{progress}%</span>
          </div>
          <div className="progress-bar-wrapper">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Resume list */}
      {loading ? (
        <div className="page-loader" style={{ padding: 'var(--space-12)' }}><div className="spinner" /></div>
      ) : resumes.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} style={{ color: 'var(--text-muted)' }} />
          <p>No resumes uploaded yet. Upload your first one above.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {resumes.map((r) => (
            <div key={r._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', justifyContent: 'space-between', padding: 'var(--space-4) var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.originalName || r.filename}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {r.mimeType === 'application/pdf' ? 'PDF' : 'DOCX'} · {r.wordCount ?? '?'} words · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setPreview(preview?._id === r._id ? null : r)}>
                  <Eye size={14} /> {preview?._id === r._id ? 'Hide' : 'Preview'}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setResumeToDelete(r._id)}
                  aria-label={`Delete ${r.originalName || 'resume'}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="card card-muted" style={{ marginTop: 'var(--space-6)' }}>
          <div className="card-header">
            <span className="card-title">Extracted Text — {preview.originalName}</span>
          </div>
          <pre style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', maxHeight: 400, overflowY: 'auto', lineHeight: 'var(--leading-relaxed)', fontFamily: 'var(--font-mono)' }}>
            {preview.extractedText || '(No text extracted)'}
          </pre>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(resumeToDelete)}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? All associated ATS analysis records and scores will also be permanently removed."
        confirmText="Delete Resume"
        isDanger={true}
        isLoading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => !deleteLoading && setResumeToDelete(null)}
      />
    </div>
  );
};

export default ResumeUploadPage;
