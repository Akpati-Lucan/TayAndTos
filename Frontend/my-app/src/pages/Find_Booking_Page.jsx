import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import backendService from '../services/backendService';
import '../pages_css/Find_Booking_Page.css';

function Find_Booking_Page() {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    confirmationCode: '',
    email: ''
  });
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Handle pre-filled search data from profile page
  useEffect(() => {
    const prefilledSearch = sessionStorage.getItem('prefilled_search');
    if (prefilledSearch) {
      try {
        const searchData = JSON.parse(prefilledSearch);
        setSearchForm({
          confirmationCode: searchData.confirmationCode || '',
          email: searchData.email || ''
        });
        
        // If edit mode, cancel mode, or view mode is enabled, automatically search for the booking
        if (searchData.editMode || searchData.cancelMode || searchData.viewMode) {
          // Trigger the search automatically after a short delay
          setTimeout(() => {
            const searchEvent = new Event('submit', { bubbles: true, cancelable: true });
            const form = document.querySelector('.search-form');
            if (form) {
              form.dispatchEvent(searchEvent);
            }
          }, 100);
        }
        
        // Clear the pre-filled data after using it
        sessionStorage.removeItem('prefilled_search');
      } catch (error) {
        console.error('Error parsing pre-filled search data:', error);
        sessionStorage.removeItem('prefilled_search');
      }
    }
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; 
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setBooking(null);

    try {
      // Use authenticated endpoint to find booking
      const foundBooking = await backendService.makeAuthenticatedRequest(`/bookings/find`, {
        method: 'POST',
        data: {
          confirmation_code: searchForm.confirmationCode,
          email: searchForm.email
        }
      });
      
      setBooking(foundBooking);
      setEditForm({
        room: foundBooking.room,
        check_in_date: formatDate(foundBooking.check_in_date),
        check_out_date: formatDate(foundBooking.check_out_date),
        number_of_guests: foundBooking.number_of_guests,
        special_requests: foundBooking.special_requests || ''
      });
      setSuccess('Booking found successfully!');
    } catch (err) {
      console.error('Authenticated search failed:', err);
      
      // If authenticated search fails, try guest booking search with token generation
      try {
        console.log('Trying guest booking search with token generation...');
        const guestResult = await backendService.findGuestBookingAndGenerateToken(searchForm.confirmationCode, searchForm.email);
        
        // Store the guest token and auth info for future authenticated operations
        if (guestResult.guest_token) {
          sessionStorage.setItem('guest_token', guestResult.guest_token);
          sessionStorage.setItem('guest_auth', JSON.stringify({
            confirmation_code: searchForm.confirmationCode,
            email: searchForm.email
          }));
          console.log('Guest token and auth info stored for future operations:', guestResult.guest_token.substring(0, 20) + '...');
        }

        // Add type field to identify this as a guest booking
        const guestBooking = {
          ...guestResult.booking,
          type: 'guest'
        };
        
        setBooking(guestBooking);
        setEditForm({
          room: guestResult.booking.room,
          check_in_date: formatDate(guestResult.booking.check_in_date),
          check_out_date: formatDate(guestResult.booking.check_out_date),
          number_of_guests: guestResult.booking.number_of_guests,
          special_requests: guestResult.booking.special_requests || ''
        });
        setSuccess('Guest booking found successfully! Token generated for secure operations.');
      } catch (guestErr) {
        console.error('Guest booking search also failed:', guestErr);
        setError(`Search failed: ${err.message}. Guest booking search also failed: ${guestErr.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

const handleGuestBookingUpdate = async (booking, formattedData) => {
    console.log('Handling guest booking update...');
    
    let guestToken = sessionStorage.getItem('guest_token');
    
    if (!guestToken) {
      console.log('No guest token found, generating new one...');
      const newToken = await refreshGuestToken(booking);
      if (!newToken) {
        throw new Error('Failed to generate guest token');
      }
      guestToken = newToken;
    }

    try {
      console.log('Attempting guest booking update with token...');
      const updatedBooking = await backendService.makeGuestRequest(
        'PUT',
        `/guest_bookings/${booking.booking_id}`,
        formattedData,
        {
          Authorization: `Bearer ${guestToken}`
        }
      );
      console.log('Guest booking update successful:', updatedBooking);
      return updatedBooking;
    } catch (guestError) {
      console.error('Guest booking update failed:', guestError);
      
      const status = guestError.response?.status;
      const message = guestError.response?.data?.message;

      if (status === 403 && message === "Invalid or expired token") {
        console.log('Token expired, attempting to refresh...');
        sessionStorage.removeItem('guest_token');
        
        const newToken = await refreshGuestToken(booking);
        if (newToken) {
          console.log('Token refreshed, retrying update...');
          const retryUpdatedBooking = await backendService.makeGuestRequest(
            'PUT',
            `/guest_bookings/${booking.booking_id}`,
            formattedData,
            {
              Authorization: `Bearer ${newToken}`
            }
          );
          console.log('Guest booking update successful after token refresh:', retryUpdatedBooking);
          return retryUpdatedBooking;
        } else {
          // Token refresh failed, reset form
          setBooking(null);
          setSearchForm({ confirmationCode: '', email: '' });
          sessionStorage.removeItem('guest_auth');
          throw new Error('Your session expired. Please re-enter your confirmation code and email.');
        }
      } else {
        throw guestError;
      }
    }
  };

const handleUserBookingUpdate = async (booking, formattedData) => {
    console.log('Handling user booking update...');
    
    const updatedBooking = await backendService.makeAuthenticatedRequest(`/bookings/${booking.booking_id}`, {
      method: 'PUT',
      data: formattedData
    });
    
    console.log('User booking update successful:', updatedBooking);
    return updatedBooking;
  };

const refreshGuestToken = async (booking) => {
    try {
      const cachedGuest = JSON.parse(sessionStorage.getItem("guest_auth") || "{}");
  
      const confirmationCode = booking.confirmation_code || cachedGuest.confirmation_code;
      const email = booking.email || booking.guest_email || cachedGuest.email;
  
      if (!confirmationCode || !email) throw new Error('Missing guest info to refresh token');
  
      const result = await backendService.findGuestBookingAndGenerateToken(confirmationCode, email);
  
      if (result?.guest_token) {
        sessionStorage.setItem("guest_token", result.guest_token);
        return result.guest_token;
      } else {
        throw new Error('No guest token received from backend');
      }
    } catch (err) {
      console.error('Failed to refresh guest token:', err);
      return null;
    }
  };
  
    const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      console.log('Booking data:', booking);
      console.log('Edit form data:', editForm);
      console.log('Full booking object for debugging:', JSON.stringify(booking, null, 2));

      if (!booking || !booking.booking_id || !booking.confirmation_code) {
        throw new Error('Invalid booking data. Please search for your booking again.');
      }

      const formattedData = {
        ...editForm,
        check_in_date: formatDate(editForm.check_in_date),
        check_out_date: formatDate(editForm.check_out_date),
        confirmation_code: booking.confirmation_code
      };

      // Determine if this is a guest booking
      const guestToken = sessionStorage.getItem('guest_token');
      
      // More reliable guest booking detection
      const hasGuestToken = !!guestToken;
      const hasGuestType = booking.type === 'guest';
      const hasGuestFields = !!(booking.guest_email || booking.guest_first_name || booking.guest_last_name);
      const hasUserFields = !!(booking.user_id || booking.first_name || booking.last_name);
      
      // If the booking has user fields (user_id, first_name, last_name), it's a user booking
      // regardless of whether there's a guest token in session storage
      // Guest token alone should not override clear user booking indicators
      const isGuestBooking = hasGuestType || (hasGuestFields && !hasUserFields);

      console.log('Booking type detection:', { 
        hasGuestToken,
        hasGuestType,
        hasGuestFields,
        hasUserFields,
        bookingType: booking.type, 
        guestEmail: booking.guest_email,
        userEmail: booking.email,
        guestFirstName: booking.guest_first_name,
        userFirstName: booking.first_name,
        isGuestBooking 
      });

      let updatedBooking;

      if (isGuestBooking) {
        console.log('Processing as guest booking...');
        // Only use guest token if this is actually a guest booking
        if (hasGuestToken) {
          updatedBooking = await handleGuestBookingUpdate(booking, formattedData);
        } else {
          // This shouldn't happen, but handle gracefully
          console.warn('Guest booking detected but no guest token found');
          setError('Guest session expired. Please search for your booking again.');
          return;
        }
      } else {
        console.log('Processing as user booking...');
        // Clear any lingering guest tokens for user bookings
        if (hasGuestToken) {
          console.log('Clearing guest token for user booking');
          sessionStorage.removeItem('guest_token');
          sessionStorage.removeItem('guest_auth');
        }
        updatedBooking = await handleUserBookingUpdate(booking, formattedData);
      }

      if (!updatedBooking || typeof updatedBooking !== 'object') {
        throw new Error('Invalid response from server');
      }

      setBooking(updatedBooking);
      setIsEditing(false);
      setSuccess('Booking updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);

      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 401) {
        setError('Authentication failed. Please try searching for your booking again.');
        return;
      }

      if (status === 404) {
        setError('Booking not found. Please check your confirmation code and email.');
        return;
      }

      setError(message || err.message || 'Failed to update booking.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if we have a guest token for this booking
      const guestToken = sessionStorage.getItem('guest_token');
      
      // Use the same reliable guest booking detection logic
      const hasGuestToken = !!guestToken;
      const hasGuestType = booking.type === 'guest';
      const hasGuestFields = !!(booking.guest_email || booking.guest_first_name || booking.guest_last_name);
      const hasUserFields = !!(booking.user_id || booking.first_name || booking.last_name);
      
      // If the booking has user fields, it's a user booking regardless of guest token
      const isGuestBooking = hasGuestType || (hasGuestFields && !hasUserFields);
      
      if (isGuestBooking) {
        console.log('Using guest booking endpoint for cancellation with guest token');
        await backendService.makeGuestRequest(
          'DELETE',
          `/guest_bookings/${booking.booking_id}`,
          {
            confirmation_code: booking.confirmation_code
          },
          {
            'Authorization': `Bearer ${guestToken}`
          }
        );
      } else {
        // Use regular authenticated endpoint
        console.log('Using authenticated endpoint for cancellation with booking ID:', booking.booking_id);
        await backendService.makeAuthenticatedRequest(`/bookings/${booking.booking_id}`, {
          method: 'DELETE',
          data: {
            confirmation_code: booking.confirmation_code
          }
        });
      }
      
      setBooking({ ...booking, status: 'cancelled' });
      setSuccess('Booking cancelled successfully!');
    } catch (err) {
      console.error('Cancellation failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to cancel booking.');
    } finally {
      setLoading(false);
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

  // Add error boundary for the component
  if (error && error.includes('Failed to fetch') || error.includes('Network Error')) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="find-booking-page">
            <div className="find-booking-container">
              <div className="error-message">
                <h2>Connection Error</h2>
                <p>Unable to connect to the server. Please check your internet connection and try again.</p>
                <button onClick={() => window.location.reload()}>Retry</button>
              </div>
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
        <div className="find-booking-page">
          <div className="find-booking-container">
            <div className="page-header">
              <h1>Find Your Booking</h1>
              <p>Enter your confirmation code and email to find and manage your booking</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {!booking ? (
              <div className="search-section">
                <div className="search-container">
                  <form className="search-form" onSubmit={handleSearch}>
                    <div className="form-group">
                      <label htmlFor="confirmationCode">Confirmation Code</label>
                      <input
                        type="text"
                        id="confirmationCode"
                        value={searchForm.confirmationCode}
                        onChange={(e) => setSearchForm({...searchForm, confirmationCode: e.target.value})}
                        placeholder="Enter your confirmation code"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        value={searchForm.email}
                        onChange={(e) => setSearchForm({...searchForm, email: e.target.value})}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <button type="submit" className="search-button" disabled={loading}>
                      {loading ? 'Searching...' : 'Find Booking'}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="booking-details-section">
                <div className="booking-table-container">
                  {/* Desktop Table View */}
                  <table className="booking-table">
                    <thead>
                      <tr>
                        <th>Booking Information</th>
                        <th>Details</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="booking-row">
                        <td className="booking-info">
                          <div className="info-group">
                            <div className="info-item">
                              <label>Confirmation Code</label>
                              <span>{booking.confirmation_code}</span>
                            </div>
                            <div className="info-item">
                              <label>Room</label>
                              <span>{booking.room}</span>
                            </div>
                            <div className="info-item">
                              <label>Status</label>
                              <span className={`status-badge ${getStatusColor(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="booking-details">
                          <div className="details-group">
                            <div className="detail-item">
                              <label>Check-in Date</label>
                              <span>{formatDate(booking.check_in_date)}</span>
                            </div>
                            <div className="detail-item">
                              <label>Check-out Date</label>
                              <span>{formatDate(booking.check_out_date)}</span>
                            </div>
                            <div className="detail-item">
                              <label>Number of Guests</label>
                              <span>{booking.number_of_guests}</span>
                            </div>
                            <div className="detail-item">
                              <label>Email</label>
                              <span>{booking.email || booking.guest_email}</span>
                            </div>
                            {booking.special_requests && (
                              <div className="detail-item">
                                <label>Special Requests</label>
                                <span>{booking.special_requests}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="action-buttons">
                          {booking.status !== 'cancelled' ? (
                            !isEditing ? (
                              <>
                                <button 
                                  className="edit-button" 
                                  onClick={() => {
                                    setEditForm({
                                      room: booking.room,
                                      check_in_date: formatDate(booking.check_in_date),
                                      check_out_date: formatDate(booking.check_out_date),
                                      number_of_guests: booking.number_of_guests,
                                      special_requests: booking.special_requests || ''
                                    });
                                    setIsEditing(true);
                                  }}
                                  disabled={loading}
                                >
                                  Edit Booking
                                </button>
                                <button 
                                  className="delete-button" 
                                  onClick={handleCancelBooking}
                                  disabled={loading}
                                >
                                  Cancel Booking
                                </button>
                              </>
                            ) : (
                              <div className="edit-actions">
                                <button 
                                  type="button" 
                                  className="save-button" 
                                  onClick={handleEditSubmit}
                                  disabled={loading}
                                >
                                  {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button 
                                  type="button" 
                                  className="cancel-button" 
                                  onClick={() => setIsEditing(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                            )
                          ) : (
                            <span className="cancelled-status">Booking Cancelled</span>
                          )}
                        </td>
                      </tr>
                      {isEditing && (
                        <tr className="edit-form-row">
                          <td colSpan="3">
                            <form className="edit-form" onSubmit={handleEditSubmit}>
                              <div className="edit-form-grid">
                                <div className="form-group">
                                  <label htmlFor="editRoom">Room</label>
                                  <input
                                    type="text"
                                    id="editRoom"
                                    value={editForm.room}
                                    onChange={(e) => setEditForm({...editForm, room: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="editGuests">Number of Guests</label>
                                  <input
                                    type="number"
                                    id="editGuests"
                                    value={editForm.number_of_guests}
                                    onChange={(e) => setEditForm({...editForm, number_of_guests: parseInt(e.target.value)})}
                                    min="1"
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="editCheckIn">Check-in Date</label>
                                  <input
                                    type="date"
                                    id="editCheckIn"
                                    value={editForm.check_in_date}
                                    onChange={(e) => setEditForm({...editForm, check_in_date: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="editCheckOut">Check-out Date</label>
                                  <input
                                    type="date"
                                    id="editCheckOut"
                                    value={editForm.check_out_date}
                                    onChange={(e) => setEditForm({...editForm, check_out_date: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="form-group full-width">
                                  <label htmlFor="editSpecialRequests">Special Requests</label>
                                  <textarea
                                    id="editSpecialRequests"
                                    value={editForm.special_requests}
                                    onChange={(e) => setEditForm({...editForm, special_requests: e.target.value})}
                                    rows="3"
                                  />
                                </div>
                              </div>
                            </form>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Mobile Card View */}
                  <div className="mobile-booking-card">
                    <div className="mobile-card-section">
                      <h4>Booking Information</h4>
                      <div className="mobile-info-item">
                        <label>Confirmation Code</label>
                        <span>{booking.confirmation_code}</span>
                      </div>
                      <div className="mobile-info-item">
                        <label>Room</label>
                        <span>{booking.room}</span>
                      </div>
                      <div className="mobile-info-item">
                        <label>Status</label>
                        <span className={`status-badge ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mobile-card-section">
                      <h4>Booking Details</h4>
                      <div className="mobile-detail-item">
                        <label>Check-in Date</label>
                        <span>{formatDate(booking.check_in_date)}</span>
                      </div>
                      <div className="mobile-detail-item">
                        <label>Check-out Date</label>
                        <span>{formatDate(booking.check_out_date)}</span>
                      </div>
                      <div className="mobile-detail-item">
                        <label>Number of Guests</label>
                        <span>{booking.number_of_guests}</span>
                      </div>
                      <div className="mobile-detail-item">
                        <label>Email</label>
                        <span>{booking.email || booking.guest_email}</span>
                      </div>
                      {booking.special_requests && (
                        <div className="mobile-detail-item">
                          <label>Special Requests</label>
                          <span>{booking.special_requests}</span>
                        </div>
                      )}
                    </div>

                    {booking.status !== 'cancelled' ? (
                      !isEditing ? (
                        <div className="mobile-actions">
                          <button 
                            className="mobile-edit-button" 
                            onClick={() => {
                              setEditForm({
                                room: booking.room,
                                check_in_date: formatDate(booking.check_in_date),
                                check_out_date: formatDate(booking.check_out_date),
                                number_of_guests: booking.number_of_guests,
                                special_requests: booking.special_requests || ''
                              });
                              setIsEditing(true);
                            }}
                            disabled={loading}
                          >
                            Edit Booking
                          </button>
                          <button 
                            className="mobile-delete-button" 
                            onClick={handleCancelBooking}
                            disabled={loading}
                          >
                            Cancel Booking
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="mobile-edit-actions">
                            <button 
                              type="button" 
                              className="mobile-save-button" 
                              onClick={handleEditSubmit}
                              disabled={loading}
                            >
                              {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button 
                              type="button" 
                              className="mobile-cancel-button" 
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </button>
                          </div>
                          <div className="mobile-edit-form">
                            <form onSubmit={handleEditSubmit}>
                              <div className="form-group">
                                <label htmlFor="mobileEditRoom">Room</label>
                                <input
                                  type="text"
                                  id="mobileEditRoom"
                                  value={editForm.room}
                                  onChange={(e) => setEditForm({...editForm, room: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="mobileEditGuests">Number of Guests</label>
                                <input
                                  type="number"
                                  id="mobileEditGuests"
                                  value={editForm.number_of_guests}
                                  onChange={(e) => setEditForm({...editForm, number_of_guests: parseInt(e.target.value)})}
                                  min="1"
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="mobileEditCheckIn">Check-in Date</label>
                                <input
                                  type="date"
                                  id="mobileEditCheckIn"
                                  value={editForm.check_in_date}
                                  onChange={(e) => setEditForm({...editForm, check_in_date: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="mobileEditCheckOut">Check-out Date</label>
                                <input
                                  type="date"
                                  id="mobileEditCheckOut"
                                  value={editForm.check_out_date}
                                  onChange={(e) => setEditForm({...editForm, check_out_date: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="mobileEditSpecialRequests">Special Requests</label>
                                <textarea
                                  id="mobileEditSpecialRequests"
                                  value={editForm.special_requests}
                                  onChange={(e) => setEditForm({...editForm, special_requests: e.target.value})}
                                  rows="3"
                                />
                              </div>
                            </form>
                          </div>
                        </>
                      )
                    ) : (
                      <div className="mobile-actions">
                        <span className="cancelled-status">Booking Cancelled</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="back-to-search">
                  <button 
                    className="new-search-button" 
                    onClick={() => {
                      setBooking(null);
                      setSearchForm({ confirmationCode: '', email: '' });
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Search Another Booking
                  </button>
                </div>
              </div>
            )}

            <div className="help-section">
              <h3>Need Help?</h3>
              <p>If you can't find your booking or need assistance, please contact us:</p>
              <div className="contact-info">
                <p>📧 Email: divinetay-toscorporations@ gmail.com</p>
                <p>📞 Phone: +234 (814) 074-9365</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Find_Booking_Page; 