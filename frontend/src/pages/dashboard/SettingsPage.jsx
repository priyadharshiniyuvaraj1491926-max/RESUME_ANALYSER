import React, { useState } from 'react';
import { Settings, Moon, Sun, Lock, Trash2, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import api from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { logout } = useAuth();
  const { toast }  = useToast();
  const navigate   = useNavigate();

  const [pwForm, setPwForm]       = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoad]    = useState(false);
  const [delConfirm, setDelConf]  = useState(false);
  const [delLoading, setDelLoad]  = useState(false);

  const handlePwChange = (e) => setPwForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match.'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setPwLoad(true);
    try {
      await api.put('/users/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to change password.'); }
    finally { setPwLoad(false); }
  };

  const deleteAccount = async () => {
    setDelLoad(true);
    try {
      await api.delete('/users/account');
      await logout();
      toast.success('Account deleted.');
      navigate('/', { replace: true });
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to delete account.'); }
    finally { setDelLoad(false); }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Settings</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 600 }}>
        {/* Theme */}
        <div className="card">
          <div className="card-header"><span className="card-title">Appearance</span></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
              <div>
                <p style={{ fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>Theme</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Currently: {isDark ? 'Dark' : 'Light'}</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={toggleTheme}>
              Switch to {isDark ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        {/* Change password */}
        <div className="card">
          <div className="card-header"><span className="card-title">Change Password</span></div>
          <form onSubmit={changePassword}>
            <div className="form-group">
              <label className="form-label form-label-required">Current Password</label>
              <input type="password" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} required className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">New Password</label>
              <input type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} required className="form-input" placeholder="Min. 6 characters" />
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={pwForm.confirmPassword} onChange={handlePwChange} required className={`form-input ${pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword ? 'is-error' : ''}`} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={pwLoading}>
              {pwLoading ? <><span className="spinner spinner-sm" /> Changing…</> : <><Lock size={16} /> Change Password</>}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="card" style={{ border: '1px solid var(--color-error-border)' }}>
          <div className="card-header" style={{ borderBottomColor: 'var(--color-error-border)' }}>
            <span className="card-title" style={{ color: 'var(--color-error)' }}>Danger Zone</span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 'var(--leading-relaxed)' }}>
            Permanently delete your account and all associated data — resumes, analyses, job matches, interview sessions and reports. This cannot be undone.
          </p>
          {!delConfirm ? (
            <button className="btn btn-danger" onClick={() => setDelConf(true)}>
              <Trash2 size={16} /> Delete My Account
            </button>
          ) : (
            <div>
              <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>Are you absolutely sure? All your data will be permanently deleted.</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button className="btn btn-danger" onClick={deleteAccount} disabled={delLoading}>
                  {delLoading ? <><span className="spinner spinner-sm" /> Deleting…</> : 'Yes, Delete Everything'}
                </button>
                <button className="btn btn-secondary" onClick={() => setDelConf(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
