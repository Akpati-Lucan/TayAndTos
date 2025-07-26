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
        <div className="find_booking_page">
          <div className="find_booking_container">
            <div className="page_header">
              <h1>Find Your Booking</h1>
              <p>Enter your confirmation code and email to find and manage your booking</p>
            </div>

            {error && <div className="error_message">{error}</div>}
            {success && <div className="success_message">{success}</div>}

            {!booking ? (
              <div className="search_section">
                <form className="search_form" onSubmit={handleSearch}>
                  <div className="form_group">
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
                  <div className="form_group">
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
                  <button type="submit" className="search_button" disabled={loading}>
                    {loading ? 'Searching...' : 'Find Booking'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="booking_details_section">
                <div className="booking_card">
                  <div className="booking_header">
                    <h2>Booking Details</h2>
                    <span className={`status ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="booking_info">
                    <div className="info_row">
                      <div className="info_item">
                        <label>Confirmation Code</label>
                        <p>{booking.confirmation_code}</p>
                      </div>
                      <div className="info_item">
                        <label>Room</label>
                        <p>{booking.room}</p>
                      </div>
                    </div>
                    <div className="info_row">
                      <div className="info_item">
                        <label>Check-in Date</label>
                        <p>{formatDate(booking.check_in_date)}</p>
                      </div>
                      <div className="info_item">
                        <label>Check-out Date</label>
                        <p>{formatDate(booking.check_out_date)}</p>
                      </div>
                    </div>
                    <div className="info_row">
                      <div className="info_item">
                        <label>Number of Guests</label>
                        <p>{booking.number_of_guests}</p>
                      </div>
                      <div className="info_item">
                        <label>Email</label>
                        <p>{booking.email || booking.guest_email}</p>
                      </div>
                    </div>
                    {booking.special_requests && (
                      <div className="info_row">
                        <div className="info_item full_width">
                          <label>Special Requests</label>
                          <p>{booking.special_requests}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {booking.status !== 'cancelled' && (
                    <div className="booking_actions">
                      {!isEditing ? (
                        <>
                          <button 
                            className="edit_button" 
                            onClick={() => setIsEditing(true)}
                            disabled={loading}
                          >
                            Edit Booking
                          </button>
                          <button 
                            className="cancel_booking_button" 
                            onClick={handleCancelBooking}
                            disabled={loading}
                          >
                            Cancel Booking
                          </button>
                        </>
                      ) : (
                        <form className="edit_form" onSubmit={handleEditSubmit}>
                          <div className="form_row">
                            <div className="form_group">
                              <label htmlFor="editRoom">Room</label>
                              <input
                                type="text"
                                id="editRoom"
                                value={editForm.room}
                                onChange={(e) => setEditForm({...editForm, room: e.target.value})}
                                required
                              />
                            </div>
                            <div className="form_group">
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
                          </div>
                          <div className="form_row">
                            <div className="form_group">
                              <label htmlFor="editCheckIn">Check-in Date</label>
                              <input
                                type="date"
                                id="editCheckIn"
                                value={editForm.check_in_date}
                                onChange={(e) => setEditForm({...editForm, check_in_date: e.target.value})}
                                required
                              />
                            </div>
                            <div className="form_group">
                              <label htmlFor="editCheckOut">Check-out Date</label>
                              <input
                                type="date"
                                id="editCheckOut"
                                value={editForm.check_out_date}
                                onChange={(e) => setEditForm({...editForm, check_out_date: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                          <div className="form_group">
                            <label htmlFor="editSpecialRequests">Special Requests</label>
                            <textarea
                              id="editSpecialRequests"
                              value={editForm.special_requests}
                              onChange={(e) => setEditForm({...editForm, special_requests: e.target.value})}
                              rows="3"
                            />
                          </div>
                          <div className="form_actions">
                            <button type="button" className="cancel_button" onClick={() => setIsEditing(false)}>
                              Cancel
                            </button>
                            <button type="submit" className="save_button" disabled={loading}>
                              {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                <div className="back_to_search">
                  <button 
                    className="new_search_button" 
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

            <div className="help_section">
              <h3>Need Help?</h3>
              <p>If you can't find your booking or need assistance, please contact us:</p>
              <div className="contact_info">
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