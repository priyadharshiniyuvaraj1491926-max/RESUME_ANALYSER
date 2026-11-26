import React, { useState } from 'react';
import { Send, Mail, User, MessageSquare, FileText } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const ContactPage = () => {
  const { toast } = useToast();
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      toast.success('Message sent! We will follow up via email.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fade-in">
      <section style={{ background: 'var(--gradient-hero)', padding: 'var(--space-16) 0', textAlign: 'center' }}>
        <div className="container">
          <span className="section-label">Contact</span>
          <h1 className="section-title" style={{ fontSize: 'var(--text-5xl)' }}>Get in touch</h1>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Have a question, feedback or want to contribute? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-sm">
          <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)' }}>
            <Mail size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Note:</strong> This contact form saves messages to the database for the administrator to review. Email delivery is not configured in the current deployment.
            </span>
          </div>

          {sent && (
            <div className="alert alert-success" style={{ marginBottom: 'var(--space-6)' }}>
              <Send size={16} style={{ flexShrink: 0 }} />
              Message received! Check back or look for a follow-up from the team.
            </div>
          )}

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label form-label-required">Your Name</label>
                  <div className="input-wrapper">
                    <User size={16} className="input-icon-left" />
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" required className="form-input has-icon-left" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label form-label-required">Email</label>
                  <div className="input-wrapper">
                    <Mail size={16} className="input-icon-left" />
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" required className="form-input has-icon-left" />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Subject</label>
                <div className="input-wrapper">
                  <FileText size={16} className="input-icon-left" />
                  <input name="subject" value={form.subject} onChange={handleChange} placeholder="Question about ATS scoring" required className="form-input has-icon-left" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us more…" required rows={6} className="form-textarea" />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={sending}>
                {sending ? <><span className="spinner spinner-sm" /> Sending…</> : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
