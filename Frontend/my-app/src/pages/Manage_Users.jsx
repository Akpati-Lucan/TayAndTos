import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import backendService from '../services/backendService';

function Manage_Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const user = backendService.getCachedUserData();
    if (!user || !user.admin) {
      navigate('/');
      return;
    }
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const res = await backendService.makeAuthenticatedRequest('/users');
      setUsers(res);
    } catch (err) {
      setError((err.response?.data?.message || err.message || 'Failed to fetch users') + '\n' + JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This cannot be undone.`)) return;
    setDeletingId(userId);
    setError('');
    setSuccess('');
    try {
      await backendService.deleteUser(userId);
      setSuccess('User deleted successfully');
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      admin: user.admin,
      password: ''
    });
    setError('');
    setSuccess('');
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
    setError('');
    setSuccess('');
  };

  const handleEditSave = async (userId) => {
    setEditLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = {
        ...editForm,
      };
      if (!data.password) delete data.password; // Don't send empty password
      const updated = await backendService.makeAuthenticatedPut(`/users/${userId}`, data);
      setUsers(users.map(u => u.id === userId ? updated : u));
      setSuccess('User updated successfully');
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update user');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content" style={{ minHeight: '60vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: 32 }}>
          <h1 style={{ marginBottom: 24 }}>Manage Users</h1>
          {error && <div style={{ color: '#dc2626', marginBottom: 16, whiteSpace: 'pre-wrap' }}>{error}</div>}
          {success && <div style={{ color: '#059669', marginBottom: 16 }}>{success}</div>}
          {loading ? (
            <div>Loading users...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Name</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Email</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Phone</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Admin</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Bookings</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  editingId === user.id ? (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', background: '#f3f4f6' }}>
                      <td style={{ padding: 8 }}>
                        <input
                          type="text"
                          name="first_name"
                          value={editForm.first_name}
                          onChange={handleEditChange}
                          style={{ width: '90%' }}
                        />
                        <input
                          type="text"
                          name="last_name"
                          value={editForm.last_name}
                          onChange={handleEditChange}
                          style={{ width: '90%', marginTop: 4 }}
                        />
                      </td>
                      <td style={{ padding: 8 }}>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          style={{ width: '95%' }}
                        />
                      </td>
                      <td style={{ padding: 8 }}>
                        <input
                          type="text"
                          name="phone_number"
                          value={editForm.phone_number}
                          onChange={handleEditChange}
                          style={{ width: '95%' }}
                        />
                      </td>
                      <td style={{ padding: 8, textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          name="admin"
                          checked={!!editForm.admin}
                          onChange={handleEditChange}
                          disabled={user.id === editingId}
                        />
                      </td>
                      <td style={{ padding: 8, textAlign: 'center' }}>{user.booking_count}</td>
                      <td style={{ padding: 8 }}>
                        <input
                          type="password"
                          name="password"
                          value={editForm.password}
                          onChange={handleEditChange}
                          placeholder="New password (optional)"
                          style={{ width: '95%', marginBottom: 4 }}
                        />
                        <div>
                          <button
                            onClick={() => handleEditSave(user.id)}
                            disabled={editLoading}
                            style={{
                              background: '#059669', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', marginRight: 8, fontWeight: 600, cursor: 'pointer'
                            }}
                          >
                            {editLoading ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleEditCancel}
                            style={{ background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: 8 }}>{user.first_name} {user.last_name}</td>
                      <td style={{ padding: 8 }}>{user.email}</td>
                      <td style={{ padding: 8 }}>{user.phone_number}</td>
                      <td style={{ padding: 8 }}>{user.admin ? 'Yes' : 'No'}</td>
                      <td style={{ padding: 8, textAlign: 'center' }}>{user.booking_count}</td>
                      <td style={{ padding: 8 }}>
                        <button
                          onClick={() => handleEditClick(user)}
                          disabled={editingId !== null || user.admin}
                          style={{
                            background: user.admin ? '#e5e7eb' : '#2563eb',
                            color: user.admin ? '#888' : '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 10px',
                            marginRight: 8,
                            fontWeight: 600,
                            cursor: user.admin ? 'not-allowed' : 'pointer'
                          }}
                          title={user.admin ? 'Cannot edit admin accounts' : 'Edit user'}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.first_name + ' ' + user.last_name)}
                          disabled={deletingId === user.id || user.admin}
                          style={{
                            background: user.admin ? '#e5e7eb' : '#dc2626',
                            color: user.admin ? '#888' : '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 14px',
                            fontWeight: 600,
                            cursor: user.admin ? 'not-allowed' : 'pointer'
                          }}
                          title={user.admin ? 'Cannot delete admin accounts' : 'Delete user'}
                        >
                          {deletingId === user.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Manage_Users;
