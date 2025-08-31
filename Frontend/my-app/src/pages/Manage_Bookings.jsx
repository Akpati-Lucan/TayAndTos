import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import backendService from '../backend_services';
import '../pages_css/Manage_Bookings.css';

function Manage_Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [user, setUser] = useState(null);
  
  // Search, sort, and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('guest');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const formatDate = (date) => {
    if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
  };

  const formatRoomName = (roomType) => {
    if (!roomType) return 'Not specified';
    return roomType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const formatGuestName = (booking) => {
    if (booking.first_name && booking.last_name) {
      return `${booking.first_name} ${booking.last_name}`;
    } else if (booking.first_name) {
      return booking.first_name;
    } else if (booking.last_name) {
      return booking.last_name;
    } else {
      return 'Guest User';
    }
  };

  const formatBookingType = (booking) => {
    if (booking.type === 'guest') {
      return 'Guest';
    } else if (booking.type === 'user') {
      return 'User';
    } else {
      // Fallback detection based on field presence
      if (booking.guest_email || booking.guest_first_name) {
        return 'Guest';
      } else if (booking.user_id || booking.first_name) {
        return 'User';
      } else {
        return 'Unknown';
      }
    }
  };

  // Filter and sort bookings
  const filteredAndSortedBookings = bookings
    .filter(booking => {
      const guestName = formatGuestName(booking);
      const matchesSearch = searchTerm === '' || 
        guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.confirmation_code?.includes(searchTerm);
      
      const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
      const matchesType = filterType === 'all' || formatBookingType(booking).toLowerCase() === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'guest':
          aValue = formatGuestName(a).toLowerCase();
          bValue = formatGuestName(b).toLowerCase();
          break;
        case 'email':
          aValue = a.email?.toLowerCase() || '';
          bValue = b.email?.toLowerCase() || '';
          break;
        case 'room':
          aValue = a.room?.toLowerCase() || '';
          bValue = b.room?.toLowerCase() || '';
          break;
        case 'check_in':
          aValue = new Date(a.check_in_date);
          bValue = new Date(b.check_in_date);
          break;
        case 'status':
          aValue = a.status?.toLowerCase() || '';
          bValue = b.status?.toLowerCase() || '';
          break;
        case 'type':
          aValue = formatBookingType(a).toLowerCase();
          bValue = formatBookingType(b).toLowerCase();
          break;
        default:
          aValue = a[sortBy]?.toLowerCase() || '';
          bValue = b[sortBy]?.toLowerCase() || '';
      }
      
      if (sortBy === 'check_in') {
        if (sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else {
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
    });

  useEffect(() => {
    const loadUser = async () => {
      try {
        setUserLoading(true);
        const cachedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (cachedUser) {
          const userData = JSON.parse(cachedUser);
          console.log('Loaded cached user:', userData);
          setUser(userData);
        } else {
          console.log('No cached user found');
          // Try to get user profile from backend if token exists
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          if (token) {
            console.log('Token found, fetching user profile...');
            try {
              const userProfile = await backendService.getUserProfile();
              console.log('Fetched user profile:', userProfile);
              setUser(userProfile);
            } catch (profileError) {
              console.error('Failed to fetch user profile:', profileError);
              setError('Authentication failed. Please log in again.');
            }
          } else {
            console.log('No token found');
            setError('Please log in to access this page.');
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setError('Error loading user data. Please log in again.');
      } finally {
        setUserLoading(false);
      }
    };
    
    loadUser();
  }, []);

  useEffect(() => {
    if (user && user.admin) {
      console.log('User is admin, fetching bookings...');
      fetchBookings();
    } else if (user && !user.admin) {
      console.log('User is not admin:', user);
      setError('Access denied. Only administrators can view this page.');
      setLoading(false);
    } else {
      console.log('No user found or user not loaded yet');
    }
  }, [user]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Debug: Log bookings state changes
  useEffect(() => {
    console.log('Bookings state updated:', bookings);
    
    // Check for duplicate booking IDs
    const bookingIds = bookings.map(b => b.booking_id);
    const uniqueIds = [...new Set(bookingIds)];
    if (bookingIds.length !== uniqueIds.length) {
      console.warn('Duplicate booking IDs found:', bookingIds);
      console.warn('Unique booking IDs:', uniqueIds);
    }
    
    // Check for duplicate keys
    const keys = bookings.map((b, index) => `${b.booking_id}-${b.type}-${index}`);
    const uniqueKeys = [...new Set(keys)];
    if (keys.length !== uniqueKeys.length) {
      console.warn('Duplicate keys found:', keys);
      console.warn('Unique keys:', uniqueKeys);
    }
  }, [bookings]);
  

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user is authenticated before making the request
      const authStatus = backendService.isUserAuthenticated();
      console.log('Authentication status before fetching bookings:', authStatus);
      
      if (!authStatus.isAuthenticated) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      const data = await backendService.makeAuthenticatedRequest('/bookings');
      console.log('Fetched bookings data:', data);
      if (data.length > 0) {
        console.log('Sample booking structure:', data[0]);
      }
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    // Check if user is still admin
    if (!user || !user.admin) {
      setError('Access denied. Only administrators can delete bookings.');
      return;
    }
    
    try {
      setDeletingId(bookingId);
      const booking = bookings.find(b => b.booking_id === bookingId);
      
      console.log('Deleting booking:', booking);
      console.log('Booking type:', booking.type);
      console.log('Current user:', user);
      
      // Check authentication status before making the request
      const authStatus = backendService.isUserAuthenticated();
      console.log('Authentication status:', authStatus);
      
      // Extract original ID from the booking_id (remove 'user_' or 'guest_' prefix)
      const originalId = booking.original_id || booking.booking_id.replace(/^(user_|guest_)/, '');
      
      // Determine the correct endpoint based on booking type
      const endpoint = booking.type === 'guest'
      ? `/guest_bookings/${originalId}`  
      : `/bookings/${originalId}`;
      console.log('Delete endpoint:', endpoint);
      console.log('Original ID:', originalId);
      console.log('Booking type:', booking.type);
      
      await backendService.makeAuthenticatedDelete(endpoint);
      
      // Update local state by filtering out the deleted booking
      setBookings(prevBookings => prevBookings.filter(b => b.booking_id !== bookingId));
      setSuccess('Booking deleted successfully');
      
      // Clear any existing errors
      setError('');
    } catch (err) {
      console.error('Delete error:', err);
      if (err.message.includes('authentication') || err.message.includes('token')) {
        setError('Authentication error. Please log in again.');
      } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setError('Access denied. You do not have permission to delete this booking.');
      } else {
        setError(err.message || 'Failed to delete booking');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      const booking = bookings.find(b => b.booking_id === bookingId);
      
      console.log('Updating booking:', booking);
      console.log('New status:', newStatus);
      console.log('Booking type:', booking.type);
      
      // Extract original ID from the booking_id (remove 'user_' or 'guest_' prefix)
      const originalId = booking.original_id || booking.booking_id.replace(/^(user_|guest_)/, '');
      
      // Determine the correct endpoint based on booking type
      const endpoint = booking.type === 'guest' ? `/guest_bookings/${originalId}` : `/bookings/${originalId}`;
      console.log('Update endpoint:', endpoint);
      console.log('Original ID:', originalId);
      console.log('Booking type:', booking.type);
      
      // Prepare correct payload based on booking type
      let updatePayload = {
        room: booking.room,
        check_in_date: formatDate(booking.check_in_date),
        check_out_date: formatDate(booking.check_out_date),
        number_of_guests: booking.number_of_guests,
        status: newStatus,
        special_requests: booking.special_requests
      };
      
      if (booking.type === 'guest') {
        // For guest bookings, use guest field names
        updatePayload.guest_first_name = booking.first_name;
        updatePayload.guest_last_name = booking.last_name;
        updatePayload.guest_email = booking.email;
        updatePayload.guest_phone_number = booking.phone_number;
      } else {
        // For user bookings, use user field names
        updatePayload.first_name = booking.first_name;
        updatePayload.last_name = booking.last_name;
        updatePayload.email = booking.email;
        updatePayload.phone_number = booking.phone_number;
      }
      
      console.log('Update payload:', updatePayload);
      
      const response = await backendService.makeAuthenticatedRequest(endpoint, {
        method: 'PUT',
        data: updatePayload
      });
      console.log('Backend response:', response);
      
      // Update local state by mapping over the bookings and updating the specific one
      setBookings(prevBookings => {
        const updatedBookings = prevBookings.map(b => 
          b.booking_id === bookingId ? { ...b, status: newStatus } : b
        );
        console.log('Updated bookings state:', updatedBookings);
        console.log('Updated booking:', updatedBookings.find(b => b.booking_id === bookingId));
        return updatedBookings;
      });
      
      // Force a re-render by updating a timestamp
      setSuccess(`Booking status updated successfully at ${new Date().toLocaleTimeString()}`);
      
      // Clear any existing errors
      setError('');
    } catch (err) {
      console.error('Update error:', err);
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
              <div className="header-content">
                <div>
                  <h1>Manage Bookings</h1>
                  <p>View and manage all bookings</p>
                </div>
                <button 
                  className="refresh-button" 
                  onClick={fetchBookings}
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {/* Search, Sort, and Filter Controls */}
            <div className="controls-section">
              <div className="controls-header">
                <h3>Search & Filter</h3>
                <div className="results-info">
                  <span className="results-count">{filteredAndSortedBookings.length}</span>
                  <span className="results-label">of {bookings.length} bookings</span>
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
                      placeholder="Search by guest, email, room, or confirmation code..."
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
                    <label className="filter-label">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label className="filter-label">Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Types</option>
                      <option value="guest">Guest</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label className="filter-label">Sort by</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                    >
                      <option value="guest">Guest</option>
                      <option value="email">Email</option>
                      <option value="room">Room</option>
                      <option value="check_in">Check-in</option>
                      <option value="status">Status</option>
                      <option value="type">Type</option>
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
            
            {userLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading user data...</p>
              </div>
            ) : loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading bookings...</p>
              </div>
            ) : (
              <div className="bookings-table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Guest/User</th>
                      <th>Type</th>
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
                  {filteredAndSortedBookings.map((booking, index) => (
                      <tr 
                        key={`${booking.booking_id}-${booking.type}-${index}`}
                        className={`booking-row ${updatingId === booking.booking_id ? 'updating' : ''} ${deletingId === booking.booking_id ? 'deleting' : ''}`}
                      >
                        <td>{formatGuestName(booking)}</td>
                        <td>
                          <span className={`booking-type-badge ${booking.type === 'guest' ? 'guest-type' : 'user-type'}`}>
                            {formatBookingType(booking)}
                          </span>
                        </td>
                        <td>{booking.email || 'No email'}</td>
                        <td>{booking.phone_number || 'No phone'}</td>
                        <td>{formatRoomName(booking.room)}</td>
                        <td>{formatDate(booking.check_in_date)}</td>
                        <td>{formatDate(booking.check_out_date)}</td>
                        <td>{booking.number_of_guests}</td>
                        <td>
                          <div className="status-cell">
                            <span className={`status-badge ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <select
                              value={booking.status}
                              onChange={e => handleStatusChange(booking.booking_id, e.target.value)}
                              disabled={updatingId === booking.booking_id}
                              className="status-select"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {/* Debug info - remove after testing */}
                            <small style={{display: 'none'}}>Debug: {booking.status}</small>
                          </div>
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