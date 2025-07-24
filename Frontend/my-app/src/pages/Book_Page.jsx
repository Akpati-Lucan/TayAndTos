import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import backendService from '../services/backendService';
import '../pages_css/Book_Page.css';

function Book_Page() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    roomType: '',
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);

  // Room prices
  const roomPrices = {
    'master-bedroom': 150,
    'mini-bedroom': 100,
    'childrens-bedroom': 80,
    'outside-kitchen': 120
  };

  useEffect(() => {
    // Check if user is logged in
    const cachedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (cachedUser) {
      const userData = JSON.parse(cachedUser);
      setUser(userData);
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone_number || ''
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const diffTime = checkOut - checkIn;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    const pricePerNight = roomPrices[formData.roomType] || 0;
    return nights * pricePerNight;
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required personal information fields');
      return false;
    }

    if (!formData.checkIn || !formData.checkOut) {
      setError('Please select check-in and check-out dates');
      return false;
    }

    if (new Date(formData.checkIn) <= new Date()) {
      setError('Check-in date must be in the future');
      return false;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setError('Check-out date must be after check-in date');
      return false;
    }

    if (!formData.roomType) {
      setError('Please select a room type');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const bookingData = {
        room: formData.roomType,
        check_in_date: formData.checkIn,
        check_out_date: formData.checkOut,
        number_of_guests: parseInt(formData.guests),
        status: 'pending',
        special_requests: formData.specialRequests || null
      };
      // If not logged in, add guest info
      if (!user) {
        bookingData.first_name = formData.firstName;
        bookingData.last_name = formData.lastName;
        bookingData.email = formData.email;
        bookingData.phone_number = formData.phone;
      } else {
        // Use cached user data for logged-in users
        bookingData.first_name = user.first_name;
        bookingData.last_name = user.last_name;
        bookingData.email = user.email;
        bookingData.phone_number = user.phone_number;
      }

      console.log('Submitting booking:', bookingData);

      if (user) {
        await backendService.makeAuthenticatedRequest('/bookings', {
          method: 'POST',
          data: bookingData
        });
      } else {
        // For guests, use a regular POST request
        await backendService.makeGuestBookingRequest('/bookings', bookingData);
      }

      // Redirect to booking success page
      navigate('/booking-success', {
        state: {
          message: 'Your booking has been successfully created. You will receive a confirmation email shortly.'
        }
      });
      return;

    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nights = calculateNights();
  const totalPrice = calculateTotalPrice();
  const roomName = formData.roomType ? formData.roomType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not selected';

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="booking-container">
          <div className="booking-header">
            <h1>Book Your Stay</h1>
            <p>Reserve your perfect room at TayAndTos</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            null
          )}

          {!success && (
            <div className="booking-content">
              <div className="booking-form-container">
                <form className="booking-form" onSubmit={handleSubmit}>
                  {!user && (
                    <div className="form-section">
                      <h2>Personal Information</h2>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="firstName">First Name *</label>
                          <input 
                            type="text" 
                            id="firstName" 
                            name="firstName" 
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="lastName">Last Name *</label>
                          <input 
                            type="text" 
                            id="lastName" 
                            name="lastName" 
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="email">Email *</label>
                          <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Phone Number *</label>
                          <input 
                            type="tel" 
                            id="phone" 
                            name="phone" 
                            value={formData.phone}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-section">
                    <h2>Booking Details</h2>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="checkIn">Check-in Date *</label>
                        <input
                          type="date"
                          id="checkIn"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="checkOut">Check-out Date *</label>
                        <input
                          type="date"
                          id="checkOut"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          min={formData.checkIn || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="guests">Number of Guests *</label>
                        <select
                          id="guests"
                          name="guests"
                          value={formData.guests}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                          <option value="3">3 Guests</option>
                          <option value="4">4 Guests</option>
                          <option value="5">5 Guests</option>
                          <option value="6">6 Guests</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="roomType">Room Type *</label>
                        <select
                          id="roomType"
                          name="roomType"
                          value={formData.roomType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a room</option>
                          <option value="master-bedroom">Master Bedroom - $150/night</option>
                          <option value="mini-bedroom">Mini Bedroom - $100/night</option>
                          <option value="childrens-bedroom">Children's Bedroom - $80/night</option>
                          <option value="outside-kitchen">Outside Kitchen - $120/night</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="specialRequests">Special Requests</label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        rows="4"
                        placeholder="Any special requests or requirements..."
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="booking-summary">
                    <h2>Booking Summary</h2>
                    <div className="summary-details">
                      <div className="summary-row">
                        <span>Room Type:</span>
                        <span>{roomName}</span>
                      </div>
                      <div className="summary-row">
                        <span>Number of Nights:</span>
                        <span>{nights}</span>
                      </div>
                      <div className="summary-row">
                        <span>Guests:</span>
                        <span>{formData.guests}</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total Price:</span>
                        <span>${totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <Link to="/" className="cancel-button">Cancel</Link>
                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={loading}
                    >
                      {loading ? 'Confirming...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>              
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Book_Page;
