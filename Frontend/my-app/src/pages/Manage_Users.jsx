import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import backendService from '../backend_services';
import showPasswordIcon from '../images/show-password.webp';
import '../pages_css/Manage_Users.css';

function Manage_Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    admin: false,
    password: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Search, sort, and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
        if (!user.admin) {
          setError('Access denied. Only administrators can view this page.');
          setLoading(false);
          return;
        }
        await fetchUsers();
      } catch (err) {
        setError('Access denied. Only administrators can view this page.');
        setLoading(false);
      }
    };

    checkAdminAndFetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await backendService.makeAuthenticatedRequest('/users');
      setUsers(response);
      setSuccess('Users loaded successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(userId);
      setError(null);
      await backendService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setSuccess(`${userName} has been deleted successfully`);
    } catch (err) {
      setError(err.message);
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
    setShowPassword(false);
    setError(null);
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
    setEditForm({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      admin: false,
      password: ''
    });
    setShowPassword(false);
    setError(null);
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number?.includes(searchTerm);
      
      const matchesRole = filterRole === 'all' || 
        (filterRole === 'admin' && user.admin) ||
        (filterRole === 'user' && !user.admin);
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'email':
          aValue = a.email?.toLowerCase() || '';
          bValue = b.email?.toLowerCase() || '';
          break;
        case 'role':
          aValue = a.admin ? 'admin' : 'user';
          bValue = b.admin ? 'admin' : 'user';
          break;
        default:
          aValue = a[sortBy]?.toLowerCase() || '';
          bValue = b[sortBy]?.toLowerCase() || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  const handleEditSave = async (userId) => {
    try {
      setEditLoading(true);
      setError(null);
      
      const dataToUpdate = { ...editForm };
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }
      
      await backendService.makeAuthenticatedPut(`/users/${userId}`, dataToUpdate);
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, ...dataToUpdate }
          : user
      ));
      
      // Check if admin status was changed
      const originalUser = users.find(user => user.id === userId);
      const adminStatusChanged = originalUser && originalUser.admin !== dataToUpdate.admin;
      
      let successMessage = 'User updated successfully';
      if (adminStatusChanged) {
        successMessage += '. Note: The user will need to log out and log back in for admin privileges to take effect.';
      }
      
      setSuccess(successMessage);
      handleEditCancel();
    } catch (err) {
      setError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="manage-users-page">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading users...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && error.includes('Access denied')) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="manage-users-page">
            <div className="error-container">
              <h2>Access Denied</h2>
              <p>{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="manage-users-page">
          <div className="manage-users-container">
            <div className="page-header">
              <h1>Manage Users</h1>
              <p>View and manage user accounts</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Search, Sort, and Filter Controls */}
            <div className="controls-section">
              <div className="controls-header">
                <h3>Search & Filter</h3>
                <div className="results-info">
                  <span className="results-count">{filteredAndSortedUsers.length}</span>
                  <span className="results-label">of {users.length} users</span>
                </div>
              </div>
              
              <div className="controls-content">
                <div className="search-control">
                  <div className="search-input-wrapper">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="clear-search-btn"
                        title="Clear search"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="filter-controls">
                  <div className="filter-group">
                    <label className="filter-label">Role</label>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admins Only</option>
                      <option value="user">Users Only</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label className="filter-label">Sort by</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                    >
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="role">Role</option>
                    </select>
                  </div>
                  
                  <div className="sort-order-group">
                    <label className="filter-label">Order</label>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="sort-order-btn"
                      title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {sortOrder === 'asc' ? (
                          <path d="m18 15-6-6-6 6"/>
                        ) : (
                          <path d="m6 9 6 6 6-6"/>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Bookings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedUsers.map((user) => (
                    <React.Fragment key={user.id}>
                      <tr className={`user-row ${editingId === user.id ? 'editing' : ''}`}>
                        <td className="user-name">
                          {editingId === user.id ? (
                            <div className="edit-name-group">
                              <input
                                type="text"
                                name="first_name"
                                value={editForm.first_name}
                                onChange={handleEditChange}
                                className="edit-input"
                                placeholder="First Name"
                              />
                              <input
                                type="text"
                                name="last_name"
                                value={editForm.last_name}
                                onChange={handleEditChange}
                                className="edit-input"
                                placeholder="Last Name"
                              />
                            </div>
                          ) : (
                            <span>{user.first_name} {user.last_name}</span>
                          )}
                        </td>
                        <td className="user-email">
                          {editingId === user.id ? (
                            <input
                              type="email"
                              name="email"
                              value={editForm.email}
                              onChange={handleEditChange}
                              className="edit-input"
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td className="user-phone">
                          {editingId === user.id ? (
                            <input
                              type="tel"
                              name="phone_number"
                              value={editForm.phone_number}
                              onChange={handleEditChange}
                              className="edit-input"
                            />
                          ) : (
                            user.phone_number
                          )}
                        </td>
                        <td className="admin-status">
                          {editingId === user.id ? (
                            <label className="admin-checkbox-label">
                              <input
                                type="checkbox"
                                name="admin"
                                checked={editForm.admin}
                                onChange={handleEditChange}
                                className="admin-checkbox"
                              />
                              <span className="admin-text">{editForm.admin ? 'Admin' : 'User'}</span>
                            </label>
                          ) : (
                            <span className={`admin-badge ${user.admin ? 'admin' : 'user'}`}>
                              {user.admin ? 'Admin' : 'User'}
                            </span>
                          )}
                        </td>
                        <td className="bookings-count">{user.booking_count}</td>
                        <td className="action-buttons">
                          {editingId === user.id ? (
                            <div className="edit-actions">
                              <button
                                onClick={() => handleEditSave(user.id)}
                                disabled={editLoading}
                                className="save-button"
                              >
                                {editLoading ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="cancel-button"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(user)}
                                disabled={user.admin}
                                className="edit-button"
                                title={user.admin ? 'Cannot edit admin accounts' : 'Edit user'}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(user.id, user.first_name + ' ' + user.last_name)}
                                disabled={deletingId === user.id || user.admin}
                                className="delete-button"
                                title={user.admin ? 'Cannot delete admin accounts' : 'Delete user'}
                              >
                                {deletingId === user.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                      {editingId === user.id && (
                        <tr className="edit-password-row">
                          <td colSpan="6">
                            <div className="password-edit-section">
                              <label>New Password (Optional)</label>
                              <div className="password-input-container">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  name="password"
                                  value={editForm.password}
                                  onChange={handleEditChange}
                                  placeholder="Leave blank to keep current password"
                                  className="edit-input password-input"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="password-toggle"
                                >
                                  <img 
                                    src={showPasswordIcon} 
                                    alt={showPassword ? "Hide password" : "Show password"}
                                    className={`password-icon ${showPassword ? 'hide' : 'show'}`}
                                  />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Manage_Users;
