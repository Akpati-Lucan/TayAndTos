import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import backendService from '../services/backendService';
import '../pages_css/Find_Booking_Page.css';

function Find_Booking_Page() {
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

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setBooking(null);

    try {
      const foundBooking = await backendService.findBookingByConfirmation(searchForm.confirmationCode, searchForm.email);
      setBooking(foundBooking);
      setEditForm({
        room: foundBooking.room,
        check_in_date: foundBooking.check_in_date,
        check_out_date: foundBooking.check_out_date,
        number_of_guests: foundBooking.number_of_guests,
        special_requests: foundBooking.special_requests || ''
      });
      setSuccess('Booking found successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedBooking = await backendService.updateBookingByConfirmation(
        booking.confirmation_code,
        editForm
      );
      setBooking(updatedBooking);
      setIsEditing(false);
      setSuccess('Booking updated successfully!');
    } catch (err) {
      setError(err.message);
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
      await backendService.cancelBookingByConfirmation(booking.confirmation_code);
      setBooking({ ...booking, status: 'cancelled' });
      setSuccess('Booking cancelled successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

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
                                  onClick={() => setIsEditing(true)}
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
                <p>📧 Email: support@tayandtos.com</p>
                <p>📞 Phone: +1 (555) 123-4567</p>
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