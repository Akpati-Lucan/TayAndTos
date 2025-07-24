import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import backendService from '../services/backendService';
import '../pages_css/Manage_Bookings.css';

function Manage_Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cachedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
  }, []);

  useEffect(() => {
    if (user && user.admin) {
      fetchBookings();
    } else if (user && !user.admin) {
      setError('Access denied. Only administrators can view this page.');
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await backendService.makeAuthenticatedRequest('/bookings');
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      setDeletingId(bookingId);
      await backendService.makeAuthenticatedDelete(`/bookings/${bookingId}`);
      setBookings(bookings.filter(b => b.booking_id !== bookingId));
      setSuccess('Booking deleted successfully');
    } catch (err) {
      setError(err.message || 'Failed to delete booking');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      const booking = bookings.find(b => b.booking_id === bookingId);
      // Prepare correct payload
      let updatePayload = {
        room: booking.room,
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        number_of_guests: booking.number_of_guests,
        status: newStatus,
        special_requests: booking.special_requests
      };
      if (booking.user_id) {
        updatePayload.first_name = booking.first_name;
        updatePayload.last_name = booking.last_name;
        updatePayload.email = booking.email;
        updatePayload.phone_number = booking.phone_number;
      } else {
        updatePayload.guest_first_name = booking.guest_first_name;
        updatePayload.guest_last_name = booking.guest_last_name;
        updatePayload.guest_email = booking.guest_email;
        updatePayload.guest_phone_number = booking.guest_phone_number;
      }
      await backendService.makeAuthenticatedRequest(`/bookings/${bookingId}`, {
        method: 'PUT',
        data: updatePayload
      });
      setBookings(bookings.map(b => b.booking_id === bookingId ? { ...b, status: newStatus } : b));
      setSuccess('Booking status updated');
    } catch (err) {
      setError(err.message || 'Failed to update booking');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="manage-bookings-page">
          <div className="manage-bookings-container">
            <div className="page-header">
              <h1>Manage Bookings</h1>
              <p>View and manage all bookings</p>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading bookings...</p>
              </div>
            ) : (
              <div className="bookings-table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Guest/User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Room</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Guests</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.booking_id}>
                        <td>{booking.booking_id}</td>
                        <td>{booking.user_id ? `${booking.first_name} ${booking.last_name}` : `${booking.guest_first_name} ${booking.guest_last_name}`}</td>
                        <td>{booking.user_id ? booking.email : booking.guest_email}</td>
                        <td>{booking.user_id ? booking.phone_number : booking.guest_phone_number}</td>
                        <td>{booking.room}</td>
                        <td>{booking.check_in_date}</td>
                        <td>{booking.check_out_date}</td>
                        <td>{booking.number_of_guests}</td>
                        <td>
                          <select
                            value={booking.status}
                            onChange={e => handleStatusChange(booking.booking_id, e.target.value)}
                            disabled={updatingId === booking.booking_id}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(booking.booking_id)}
                            disabled={deletingId === booking.booking_id}
                          >
                            {deletingId === booking.booking_id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Manage_Bookings; 