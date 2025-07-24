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
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
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

  return (
    <div className="app">
      <Header />
      <main className="main-content" style={{ minHeight: '60vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: 32 }}>
          <h1 style={{ marginBottom: 24 }}>Manage Users</h1>
          {error && <div style={{ color: '#dc2626', marginBottom: 16 }}>{error}</div>}
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
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: 8 }}>{user.first_name} {user.last_name}</td>
                    <td style={{ padding: 8 }}>{user.email}</td>
                    <td style={{ padding: 8 }}>{user.phone_number}</td>
                    <td style={{ padding: 8 }}>{user.admin ? 'Yes' : 'No'}</td>
                    <td style={{ padding: 8, textAlign: 'center' }}>{user.booking_count}</td>
                    <td style={{ padding: 8 }}>
                      <button
                        onClick={() => handleDelete(user.id, user.first_name + ' ' + user.last_name)}
                        disabled={deletingId === user.id || user.admin}
                        style={{
                          background: user.admin ? '#e5e7eb' : '#dc2626',
                          color: user.admin ? '#888' : '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 14px',
                          cursor: user.admin ? 'not-allowed' : 'pointer',
                          fontWeight: 600
                        }}
                        title={user.admin ? 'Cannot delete admin accounts' : 'Delete user'}
                      >
                        {deletingId === user.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
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