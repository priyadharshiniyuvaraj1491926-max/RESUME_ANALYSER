import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';
import api from '../../services/api.js';

const ForgotPasswordPage = () => {
  const [email, setEmail]   = useState('');
  const [loading, setLoad]  = useState(false);
  const [token, setToken]   = useState('');
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true); setError(''); setToken('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      // In development mode the backend returns the raw token for display
      setToken(data?.data?.resetToken || data?.resetToken || '(check server logs)');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to generate reset token.');
    } finally {
      setLoad(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-2)' }}>Forgot password?</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Enter your email and we'll generate a reset token.</p>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: 'var(--space-5)' }}>
        <Mail size={16} style={{ flexShrink: 0 }} />
        <span>Email delivery is not configured in this deployment. The reset token will be shown below after submission.</span>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-5)' }}>{error}</div>}

      {token ? (
        <div>
          <div className="alert alert-success" style={{ marginBottom: 'var(--space-5)' }}>
            <span>✓ Reset token generated. Copy it below and use the reset password page.</span>
          </div>
          <div style={{ background: 'var(--bg-muted)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', wordBreak: 'break-all', marginBottom: 'var(--space-5)', color: 'var(--text-primary)' }}>
            {token}
          </div>
          <Link to="/reset-password" className="btn btn-primary w-full">
            Go to Reset Password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label form-label-required">Email address</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon-left" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@example.com" className="form-input has-icon-left" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? <><span className="spinner spinner-sm" /> Generating…</> : <><Send size={16} /> Generate Reset Token</>}
          </button>
        </form>
      )}

      <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
        Remembered it? <Link to="/signin" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-semibold)' }}>Sign in</Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
