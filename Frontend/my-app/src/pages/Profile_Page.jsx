import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import backendService from '../services/backendService';
import showPasswordIcon from '../images/show-password.webp';
import '../pages_css/Profile_Page.css';

function Profile_Page() {
  const cachedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const [user, setUser] = useState(cachedUser ? JSON.parse(cachedUser) : null);
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Profile page: Starting data fetch...');
        
        // Test backend connection first
        console.log('Profile page: Testing backend connection...');
        const backendConnected = await backendService.testBackendConnection();
        console.log('Profile page: Backend connected:', backendConnected);
        
        const authStatus = backendService.isUserAuthenticated();
        console.log('Profile page: Authentication status:', authStatus);
        
        if (!authStatus.isAuthenticated) {
          console.log('Profile page: User not authenticated');
          throw new Error('User not authenticated');
        }

        console.log('Profile page: Fetching user profile...');
        const userData = await backendService.getUserProfile();
        console.log('Profile page: User data received:', userData);
        console.log('Profile page: User ID:', userData.id);
        
        console.log('Profile page: Fetching bookings...');
        try {
          const bookingsData = await backendService.getUserBookings();
          console.log('Profile page: Bookings data received:', bookingsData);
          
          // Ensure bookingsData is an array
          const bookingsArray = Array.isArray(bookingsData) ? bookingsData : [];
          console.log('Profile page: Processed bookings array:', bookingsArray);
          
          setBookings(bookingsArray);
        } catch (bookingError) {
          console.error('Profile page: Error fetching bookings:', bookingError);
          setError(`Failed to load bookings: ${bookingError.message}`);
          setBookings([]);
        }
        
        setUser(userData);
        setEditForm({
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone_number: userData.phone_number,
          email: userData.email
        });
        setSuccess('Profile loaded successfully');
        console.log('Profile page: Data loaded successfully');
      } catch (err) {
        console.error('Profile page: Error occurred:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log('Save button clicked, editForm data:', editForm);
    try {
      console.log('Calling backendService.updateUserProfile...');
      const updatedUser = await backendService.updateUserProfile(editForm);
      console.log('Profile update successful, updated user data:', updatedUser);
      setUser(updatedUser);
      // Update cached user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Update editForm with new data
      setEditForm({
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone_number: updatedUser.phone_number,
        email: updatedUser.email
      });
      setIsEditing(false);
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Error in handleEditSubmit:', err);
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
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
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
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handleViewDetails = (booking) => {
    // Navigate to find booking page with pre-filled data for viewing
    const searchData = {
      confirmationCode: booking.confirmation_code,
      email: user.email,
      viewMode: true
    };
    sessionStorage.setItem('prefilled_search', JSON.stringify(searchData));
    window.location.href = '/find-booking';
  };

  const handleCancelBooking = (booking) => {
    // Navigate to find booking page with pre-filled data for cancellation
    const searchData = {
      confirmationCode: booking.confirmation_code,
      email: user.email,
      cancelMode: true
    };
    sessionStorage.setItem('prefilled_search', JSON.stringify(searchData));
    window.location.href = '/find-booking';
  };

  const handleEditBooking = (booking) => {
    // Navigate to find booking page with pre-filled data for editing
    const searchData = {
      confirmationCode: booking.confirmation_code,
      email: user.email,
      editMode: true
    };
    sessionStorage.setItem('prefilled_search', JSON.stringify(searchData));
    window.location.href = '/find-booking';
  };

  if (loading) return <div className="app"><Header /><div className="loading-spinner"><p>Loading profile...</p></div><Footer /></div>;

  if (error && (error.includes('401') || error.includes('No authentication token') || error.includes('User not authenticated'))) {
    return (
      <div className="app">
        <Header />
        <div className="profile_page">
          <div className="error-container">
            <h2>Authentication Required</h2>
            <p>Please log in to view your profile.</p>
            <Link to="/login" className="login-button">Go to Login</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return (
    <div className="app">
      <Header />
      <div className="profile_page">
        <div className="auth-prompt-container">
          <h2>Welcome to TayAndTos</h2>
          <p>Please log in or create an account to view your profile and manage your bookings.</p>
          <div className="auth-buttons">
            <Link to="/login" className="login-button">Login</Link>
            <Link to="/signup" className="signup-button">Sign Up</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="profile_page">
          <div className="profile_container">
            <div className="profile_header">
              <h1>My Profile</h1>
              <p>Manage your account and view your bookings</p>
              {success && <div className="success-message">{success}</div>}
            </div>

            <div className="profile_content">
              <div className="profile_section">
                <div className="section_header">
                  <h2>Personal Information</h2>
                  {!isEditing && <button className="edit_button" onClick={() => setIsEditing(true)}>Edit Profile</button>}
                </div>

                {!isEditing ? (
                  <div className="profile_info">
                    <div className="info_row">
                      <div className="info_item"><label>Full Name</label><p>{user.first_name} {user.last_name}</p></div>
                      <div className="info_item"><label>Email</label><p>{user.email}</p></div>
                    </div>
                    <div className="info_row">
                      <div className="info_item"><label>Phone Number</label><p>{user.phone_number}</p></div>
                      <div className="info_item"><label>Account Type</label><p>{user.admin ? 'Administrator' : 'Regular User'}</p></div>
                    </div>
                  </div>
                ) : (
                  <form className="edit_form" onSubmit={handleEditSubmit}>
                    <div className="form_row">
                      <div className="form_group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" value={editForm.first_name} onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} required />
                      </div>
                      <div className="form_group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" value={editForm.last_name} onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} required />
                      </div>
                    </div>
                    <div className="form_row">
                      <div className="form_group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" value={editForm.phone_number} onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})} required />
                      </div>
                      <div className="form_group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} required />
                      </div>
                    </div>
                    <div className="form_actions">
                      <button type="button" className="cancel_button" onClick={() => setIsEditing(false)}>Cancel</button>
                      <button type="submit" className="save_button">Save Changes</button>
                    </div>
                  </form>
                )}
              </div>

              <div className="profile_section">
                <div className="section_header">
                  <h2>Security</h2>
                  {!isChangingPassword && <button className="edit_button" onClick={() => setIsChangingPassword(true)}>Change Password</button>}
                </div>

                {isChangingPassword && (
                  <form className="password_form" onSubmit={handlePasswordSubmit}>
                    {error && <div className="error_message">{error}</div>}
                    <div className="form_group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <div className="password-input-container">
                        <input 
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword" 
                          value={passwordForm.currentPassword} 
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} 
                          required 
                        />
                        <button 
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          <img 
                            src={showPasswordIcon} 
                            alt={showCurrentPassword ? "Hide password" : "Show password"}
                            className={`password-icon ${showCurrentPassword ? 'hide' : 'show'}`}
                          />
                        </button>
                      </div>
                    </div>
                    <div className="form_row">
                      <div className="form_group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="password-input-container">
                          <input 
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword" 
                            value={passwordForm.newPassword} 
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
                            required 
                          />
                          <button 
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            <img 
                              src={showPasswordIcon} 
                              alt={showNewPassword ? "Hide password" : "Show password"}
                              className={`password-icon ${showNewPassword ? 'hide' : 'show'}`}
                            />
                          </button>
                        </div>
                      </div>
                      <div className="form_group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="password-input-container">
                          <input 
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword" 
                            value={passwordForm.confirmPassword} 
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} 
                            required 
                          />
                          <button 
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <img 
                              src={showPasswordIcon} 
                              alt={showConfirmPassword ? "Hide password" : "Show password"}
                              className={`password-icon ${showConfirmPassword ? 'hide' : 'show'}`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form_actions">
                      <button type="button" className="cancel_button" onClick={() => setIsChangingPassword(false)}>Cancel</button>
                      <button type="submit" className="save_button">Update Password</button>
                    </div>
                  </form>
                )}
              </div>

              <div className="profile_section">
                <div className="section_header">
                  <h2>Booking History</h2>
                  <Link to="/book-page" className="new_booking_button">New Booking</Link>
                </div>

                {bookings.length === 0 ? (
                  <div className="no_bookings">
                    <p>You haven't made any bookings yet.</p>
                    <Link to="/book-page" className="book_now_button">Book Your First Stay</Link>
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
                          <div className="detail_row"><span className="detail_label">Check-in:</span><span className="detail_value">{formatDate(booking.check_in_date)}</span></div>
                          <div className="detail_row"><span className="detail_label">Check-out:</span><span className="detail_value">{formatDate(booking.check_out_date)}</span></div>
                          <div className="detail_row"><span className="detail_label">Guests:</span><span className="detail_value">{booking.number_of_guests}</span></div>
                          {booking.special_requests && (
                            <div className="detail_row">
                              <span className="detail_label">Special Requests:</span>
                              <span className="detail_value">{booking.special_requests}</span>
                            </div>
                          )}
                        </div>
                        <div className="booking_actions">
                          <button 
                            className="view_details_button" 
                            onClick={() => handleViewDetails(booking)}
                          >
                            View Details
                          </button>
                          {booking.status !== 'cancelled' && (
                            <button 
                              className="edit_booking_button" 
                              onClick={() => handleEditBooking(booking)}
                            >
                              Edit
                            </button>
                          )}
                          {booking.status === 'pending' && (
                            <button 
                              className="cancel_booking_button" 
                              onClick={() => handleCancelBooking(booking)}
                            >
                              Cancel
                            </button>
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
