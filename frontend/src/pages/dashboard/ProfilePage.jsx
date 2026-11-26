import React, { useState } from 'react';
import { User, Mail, Save, Briefcase } from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const ProfilePage = () => {
  const { user, updateUserState } = useAuth();
  const { toast } = useToast();
  const [form, setForm]     = useState({ fullName: user?.fullName || '', targetRole: user?.targetRole || '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUserState(data?.data || form);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to update profile.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>My Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Avatar card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-8)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'var(--font-extrabold)', fontSize: 'var(--text-3xl)' }}>
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>{user?.fullName}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{user?.email}</p>
            <span className="badge badge-primary" style={{ marginTop: 'var(--space-2)' }}>{user?.role || 'user'}</span>
          </div>
          <div style={{ width: '100%', borderTop: '1px solid var(--border-base)', paddingTop: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Account created</span>
              <span style={{ fontWeight: 'var(--font-medium)' }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Account status</span>
              <span className="badge badge-success">Active</span>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="card">
          <div className="card-header"><span className="card-title">Edit Profile</span></div>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label form-label-required">Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon-left" />
                <input name="fullName" value={form.fullName} onChange={handleChange} required className="form-input has-icon-left" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email (read-only)</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon-left" />
                <input value={user?.email || ''} readOnly className="form-input has-icon-left" style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Target Role</label>
              <div className="input-wrapper">
                <Briefcase size={16} className="input-icon-left" />
                <input name="targetRole" value={form.targetRole} onChange={handleChange} placeholder="e.g. Full Stack Developer" className="form-input has-icon-left" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={saving}>
              {saving ? <><span className="spinner spinner-sm" /> Saving…</> : <><Save size={16} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
