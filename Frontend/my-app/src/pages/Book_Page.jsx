import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../pages_css/Book_Page.css';

function Book_Page() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="booking-container">
          <div className="booking_header">
            <h1>Book Your Stay</h1>
            <p>Reserve your perfect room at TayAndTos</p>
          </div>

          <div className="booking-content">
            <div className="booking-form-container">
              <form className="booking-form">
                <div className="form-section">
                  <h2>Personal Information</h2>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input type="text" id="firstName" name="firstName" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input type="text" id="lastName" name="lastName" required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input type="tel" id="phone" name="phone" required />
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
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="checkOut">Check-out Date *</label>
                      <input
                        type="date"
                        id="checkOut"
                        name="checkOut"
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
                    />
                  </div>
                </div>

                <div className="booking-summary">
                  <h2>Booking Summary</h2>
                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Room Type:</span>
                      <span>Not selected</span>
                    </div>
                    <div className="summary-row">
                      <span>Number of Nights:</span>
                      <span>0</span>
                    </div>
                    <div className="summary-row">
                      <span>Guests:</span>
                      <span>1</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total Price:</span>
                      <span>$0</span>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <Link to="/" className="cancel-button">Cancel</Link>
                  <button 
                    type="submit" 
                    className="submit-button"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Book_Page;
