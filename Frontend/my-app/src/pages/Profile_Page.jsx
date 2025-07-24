import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import backendService from '../services/backendService';
import '../pages_css/Profile_Page.css';

function Profile_Page() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  // Form states
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Get user data from backend service (with fallback to cache)
        const userData = await backendService.getUserProfile();
        const bookingsData = await backendService.getUserBookings();
        
        setUser(userData);
        setEditForm({
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone_number: userData.phone_number
        });
        setBookings(bookingsData);
        setSuccess('Profile loaded successfully');
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await backendService.updateUserProfile(editForm);
      setUser(updatedUser);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      await backendService.updateUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      setError(null);
      setSuccess('Password updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="profile_page">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && (error.includes('401') || error.includes('No authentication token found'))) {
    return (
      <div className="app">
        <Header />
        <div className="profile_page">
          <div className="error-container">
            <h2>Authentication Required</h2>
            <p>Please log in to view your profile.</p>
            <Link to="/login" className="login-button">
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app">
        <Header />
        <div className="profile_page">
          <div className="auth-prompt-container">
            <h2>Welcome to TayAndTos</h2>
            <p>Please log in or create an account to view your profile and manage your bookings.</p>
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Login
              </Link>
              <Link to="/signup" className="signup-button">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="profile_page">
          <div className="profile_container">
            <div className="profile_header">
              <h1>My Profile</h1>
              <p>Manage your account and view your bookings</p>
              {success && (
                <div className="success-message">
                  {success}
                </div>
              )}
            </div>

            <div className="profile_content">
              {/* Profile Information Section */}
              <div className="profile_section">
                <div className="section_header">
                  <h2>Personal Information</h2>
                  {!isEditing && (
                    <button 
                      className="edit_button"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="profile_info">
                    <div className="info_row">
                      <div className="info_item">
                        <label>Full Name</label>
                        <p>{user?.first_name} {user?.last_name}</p>
                      </div>
                      <div className="info_item">
                        <label>Email</label>
                        <p>{user?.email}</p>
                      </div>
                    </div>
                    <div className="info_row">
                      <div className="info_item">
                        <label>Phone Number</label>
                        <p>{user?.phone_number}</p>
                      </div>
                      <div className="info_item">
                        <label>Account Type</label>
                        <p>{user?.admin ? 'Administrator' : 'Regular User'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form className="edit_form" onSubmit={handleEditSubmit}>
                    <div className="form_row">
                      <div className="form_group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form_group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="form_row">
                      <div className="form_group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          value={editForm.phone_number}
                          onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="form_actions">
                      <button type="button" className="cancel_button" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="save_button">
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Password Change Section */}
              <div className="profile_section">
                <div className="section_header">
                  <h2>Security</h2>
                  {!isChangingPassword && (
                    <button 
                      className="edit_button"
                      onClick={() => setIsChangingPassword(true)}
                    >
                      Change Password
                    </button>
                  )}
                </div>

                {isChangingPassword && (
                  <form className="password_form" onSubmit={handlePasswordSubmit}>
                    {error && <div className="error_message">{error}</div>}
                    <div className="form_group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form_row">
                      <div className="form_group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form_group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="form_actions">
                      <button type="button" className="cancel_button" onClick={() => setIsChangingPassword(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="save_button">
                        Update Password
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Booking History Section */}
              <div className="profile_section">
                <div className="section_header">
                  <h2>Booking History</h2>
                  <Link to="/book-page" className="new_booking_button">
                    New Booking
                  </Link>
                </div>

                {bookings.length === 0 ? (
                  <div className="no_bookings">
                    <p>You haven't made any bookings yet.</p>
                    <Link to="/book-page" className="book_now_button">
                      Book Your First Stay
                    </Link>
                  </div>
                ) : (
                  <div className="bookings_list">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="booking_card">
                        <div className="booking_header">
                          <h3>{booking.room}</h3>
                          <span className={`status ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="booking_details">
                          <div className="detail_row">
                            <span className="detail_label">Check-in:</span>
                            <span className="detail_value">{formatDate(booking.check_in_date)}</span>
                          </div>
                          <div className="detail_row">
                            <span className="detail_label">Check-out:</span>
                            <span className="detail_value">{formatDate(booking.check_out_date)}</span>
                          </div>
                          <div className="detail_row">
                            <span className="detail_label">Guests:</span>
                            <span className="detail_value">{booking.number_of_guests}</span>
                          </div>
                          {booking.special_requests && (
                            <div className="detail_row">
                              <span className="detail_label">Special Requests:</span>
                              <span className="detail_value">{booking.special_requests}</span>
                            </div>
                          )}
                        </div>
                        <div className="booking_actions">
                          <button className="view_details_button">View Details</button>
                          {booking.status === 'pending' && (
                            <button className="cancel_booking_button">Cancel</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile_Page;