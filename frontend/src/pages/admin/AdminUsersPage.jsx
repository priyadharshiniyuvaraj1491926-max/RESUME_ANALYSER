import React, { useEffect, useState } from 'react';
import { Search, Users } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminUsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers]     = useState([]);
  const [loading, setLoad]    = useState(true);
  const [search, setSearch]   = useState('');
  const [roleFilter, setRole] = useState('');
  const [statusFilter, setStatus] = useState('');
  const [page, setPage]       = useState(1);
  const perPage = 15;

  useEffect(() => {
    api.get('/admin/users')
      .then((r) => setUsers(r.data?.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoad(false));
  }, []);

  const updateUser = async (id, updates) => {
    try {
      await api.put(`/admin/users/${id}`, updates);
      setUsers((p) => p.map((u) => (u._id === id ? { ...u, ...updates } : u)));
      toast.success('User updated.');
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to update user.'); }
  };

  const filtered = users.filter((u) => {
    if (search && !u.fullName?.toLowerCase().includes(search.toLowerCase()) && !u.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    if (statusFilter && u.status !== statusFilter) return false;
    return true;
  });

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>;

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>Manage Users</h1>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
            <label className="form-label">Search</label>
            <div className="input-wrapper">
              <Search size={16} className="input-icon-left" />
              <input className="form-input has-icon-left" placeholder="Name or email…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 130 }}>
            <label className="form-label">Role</label>
            <select className="form-select" value={roleFilter} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
              <option value="">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 130 }}>
            <label className="form-label">Status</label>
            <select className="form-select" value={statusFilter} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {paged.map((u) => (
              <tr key={u._id}>
                <td style={{ fontWeight: 'var(--font-medium)' }}>{u.fullName}</td>
                <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{u.email}</td>
                <td>
                  <select
                    className="form-select"
                    value={u.role}
                    onChange={(e) => updateUser(u._id, { role: e.target.value })}
                    style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--text-xs)', width: 90 }}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td><span className={`badge badge-${u.status === 'active' ? 'success' : 'error'}`}>{u.status || 'active'}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className={`btn btn-sm ${u.status === 'suspended' ? 'btn-primary' : 'btn-danger'}`}
                    onClick={() => updateUser(u._id, { status: u.status === 'suspended' ? 'active' : 'suspended' })}
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`pagination-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button className="pagination-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>›</button>
        </div>
      )}

      <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
        Showing {paged.length} of {filtered.length} users
      </p>
    </div>
  );
};

export default AdminUsersPage;
