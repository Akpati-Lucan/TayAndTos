import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../pages_css/Book_Page.css';

function Book_Page() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const roomOptions = [
    { value: 'master-bedroom', label: 'Master Bedroom', price: 150 },
    { value: 'mini-bedroom', label: 'Mini Bedroom', price: 100 },
    { value: 'childrens-bedroom', label: "Children's Bedroom", price: 80 },
    { value: 'outside-kitchen', label: 'Outside Kitchen', price: 120 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    const selectedRoom = roomOptions.find(room => room.value === formData.roomType);
    const nights = calculateTotalNights();
    return selectedRoom ? selectedRoom.price * nights : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          checkIn: '',
          checkOut: '',
          guests: 1,
          roomType: '',
          specialRequests: ''
        });
        setSubmitSuccess(false);
      }, 3000);
    }, 2000);
  };

  const getMinCheckOutDate = () => {
    if (formData.checkIn) {
      const nextDay = new Date(formData.checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split('T')[0];
    }
    return '';
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="booking-container">
          <div className="booking-header">
            <h1>Book Your Stay</h1>
            <p>Reserve your perfect room at TayAndTos</p>
          </div>

          {submitSuccess ? (
            <div className="success-message">
              <h2>Booking Submitted Successfully!</h2>
              <p>Thank you for choosing TayAndTos. We'll contact you shortly to confirm your reservation.</p>
              <Link to="/" className="back-home-button">Back to Home</Link>
            </div>
          ) : (
            <div className="booking-content">
              <div className="booking-form-container">
                <form onSubmit={handleSubmit} className="booking-form">
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
                          min={getMinCheckOutDate()}
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
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
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
                          {roomOptions.map(room => (
                            <option key={room.value} value={room.value}>
                              {room.label} - ${room.price}/night
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="specialRequests">Special Requests</label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Any special requests or requirements..."
                      />
                    </div>
                  </div>

                  <div className="booking-summary">
                    <h2>Booking Summary</h2>
                    <div className="summary-details">
                      <div className="summary-row">
                        <span>Room Type:</span>
                        <span>{roomOptions.find(room => room.value === formData.roomType)?.label || 'Not selected'}</span>
                      </div>
                      <div className="summary-row">
                        <span>Number of Nights:</span>
                        <span>{calculateTotalNights()}</span>
                      </div>
                      <div className="summary-row">
                        <span>Guests:</span>
                        <span>{formData.guests}</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total Price:</span>
                        <span>${calculateTotalPrice()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <Link to="/" className="cancel-button">Cancel</Link>
                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="booking-info">
                <div className="info-card">
                  <h3>Why Choose TayAndTos?</h3>
                  <ul>
                    <li>Comfortable and clean accommodations</li>
                    <li>Prime location with easy access</li>
                    <li>Flexible booking options</li>
                    <li>24/7 customer support</li>
                    <li>Competitive pricing</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h3>Booking Policy</h3>
                  <ul>
                    <li>Check-in: 3:00 PM</li>
                    <li>Check-out: 11:00 AM</li>
                    <li>Free cancellation up to 24 hours before check-in</li>
                    <li>Payment required at booking</li>
                    <li>Valid ID required at check-in</li>
                  </ul>
                </div>
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
