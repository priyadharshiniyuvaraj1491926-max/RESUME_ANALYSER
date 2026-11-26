import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', 'var(--color-error)', 'var(--color-warning)', 'var(--color-info)', 'var(--color-success)'];

const SignUpPage = () => {
  const { register } = useAuth();
  const { toast }    = useToast();
  const navigate     = useNavigate();

  const [form, setForm]       = useState({ fullName: '', email: '', password: '', confirm: '', terms: false });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const strength = getStrength(form.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, and a number.');
      return;
    }
    if (!form.terms)                    { setError('Please accept the terms to continue.'); return; }
    setLoading(true); setError('');
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirm,
        acceptedTerms: form.terms,
      });
      toast.success('Account created! Welcome to ResumeIQ AI.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-2)' }}>Create your account</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Free forever — no credit card needed</p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-5)' }}><span>{error}</span></div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label form-label-required">Full Name</label>
          <div className="input-wrapper">
            <User size={16} className="input-icon-left" />
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Jane Doe" className="form-input has-icon-left" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label form-label-required">Email address</label>
          <div className="input-wrapper">
            <Mail size={16} className="input-icon-left" />
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="jane@example.com" className="form-input has-icon-left" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label form-label-required">Password</label>
          <div className="input-wrapper">
            <Lock size={16} className="input-icon-left" />
            <input
              type={showPw ? 'text' : 'password'}
              name="password" value={form.password} onChange={handleChange}
              required placeholder="Min. 8 chars (A-Z, a-z, 0-9)"
              className="form-input has-icon-left has-icon-right"
            />
            <button type="button" className="input-icon-right" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <span className="form-hint">Must be 8+ characters with uppercase, lowercase, and a number.</span>
          {form.password && (
            <div style={{ marginTop: 'var(--space-2)' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= strength ? STRENGTH_COLORS[strength] : 'var(--border-base)', transition: 'background 0.3s' }} />
                ))}
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: STRENGTH_COLORS[strength] }}>{STRENGTH_LABELS[strength]}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label form-label-required">Confirm Password</label>
          <div className="input-wrapper">
            <Lock size={16} className="input-icon-left" />
            <input
              type={showPw ? 'text' : 'password'}
              name="confirm" value={form.confirm} onChange={handleChange}
              required placeholder="Re-enter password"
              className={`form-input has-icon-left ${form.confirm && form.password !== form.confirm ? 'is-error' : ''}`}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange} style={{ marginTop: 2 }} />
          <label htmlFor="terms" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 'var(--leading-relaxed)' }}>
            I agree to the <Link to="/about" style={{ color: 'var(--color-primary)' }}>privacy policy</Link>. My data is processed securely and I can delete my account anytime.
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? <><span className="spinner spinner-sm" /> Creating account…</> : <><UserPlus size={16} /> Create Account</>}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link to="/signin" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-semibold)' }}>Sign in</Link>
      </p>
    </div>
  );
};

export default SignUpPage;
