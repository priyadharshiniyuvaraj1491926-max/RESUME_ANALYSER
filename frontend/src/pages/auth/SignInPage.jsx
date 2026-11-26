import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const SignInPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/dashboard';

  const [form, setForm]       = useState({ email: '', password: '', remember: false });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-2)' }}>Welcome back</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Sign in to your ResumeIQ AI account</p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--space-5)' }}>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label form-label-required">Email address</label>
          <div className="input-wrapper">
            <Mail size={16} className="input-icon-left" />
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} required autoComplete="email"
              placeholder="jane@example.com"
              className="form-input has-icon-left"
            />
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label form-label-required">Password</label>
            <Link to="/forgot-password" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>Forgot password?</Link>
          </div>
          <div className="input-wrapper">
            <Lock size={16} className="input-icon-left" />
            <input
              type={showPw ? 'text' : 'password'}
              name="password" value={form.password}
              onChange={handleChange} required autoComplete="current-password"
              placeholder="Your password"
              className="form-input has-icon-left has-icon-right"
            />
            <button type="button" className="input-icon-right" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          <input type="checkbox" id="remember" name="remember" checked={form.remember} onChange={handleChange} />
          <label htmlFor="remember" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>Remember me for 7 days</label>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? <><span className="spinner spinner-sm" /> Signing in…</> : <><LogIn size={16} /> Sign In</>}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-semibold)' }}>Create one free</Link>
      </p>
    </div>
  );
};

export default SignInPage;
