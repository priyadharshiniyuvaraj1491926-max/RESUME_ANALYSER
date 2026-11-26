import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const ResetPasswordPage = () => {
  const { toast } = useToast();
  const navigate  = useNavigate();
  const [params]  = useSearchParams();

  const [form, setForm]     = useState({ token: params.get('token') || '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState('');

  const handleChange = (e) => { setForm((p) => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return; }
    setLoad(true); setError('');
    try {
      await api.post('/auth/reset-password', { token: form.token, password: form.password });
      toast.success('Password reset successfully! Please sign in.');
      navigate('/signin', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setLoad(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-2)' }}>Reset password</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Enter your reset token and choose a new password.</p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-5)' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label form-label-required">Reset Token</label>
          <div className="input-wrapper">
            <KeyRound size={16} className="input-icon-left" />
            <input type="text" name="token" value={form.token} onChange={handleChange} required placeholder="Paste your reset token" className="form-input has-icon-left" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label form-label-required">New Password</label>
          <div className="input-wrapper">
            <Lock size={16} className="input-icon-left" />
            <input
              type={showPw ? 'text' : 'password'}
              name="password" value={form.password} onChange={handleChange}
              required placeholder="Min. 6 characters"
              className="form-input has-icon-left has-icon-right"
            />
            <button type="button" className="input-icon-right" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label form-label-required">Confirm New Password</label>
          <div className="input-wrapper">
            <Lock size={16} className="input-icon-left" />
            <input
              type={showPw ? 'text' : 'password'}
              name="confirm" value={form.confirm} onChange={handleChange}
              required placeholder="Re-enter new password"
              className={`form-input has-icon-left ${form.confirm && form.password !== form.confirm ? 'is-error' : ''}`}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
          {loading ? <><span className="spinner spinner-sm" /> Resetting…</> : <><Lock size={16} /> Reset Password</>}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
        <Link to="/signin" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-semibold)' }}>Back to Sign In</Link>
      </p>
    </div>
  );
};

export default ResetPasswordPage;
