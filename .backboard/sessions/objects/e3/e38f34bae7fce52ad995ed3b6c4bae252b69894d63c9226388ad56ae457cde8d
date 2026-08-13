import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer';
import '../pages_css/Book_Page.css';

function Booking_Success_Page() {
  const location = useLocation();
  const message = location.state?.message || 'Booking confirmed successfully! You will receive a confirmation email shortly.';
  const confirmationCode = location.state?.confirmationCode;
  const buttonText = 'View My Bookings';
  const redirectTo = '/profile-page';

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="success-message">
          <h2>Booking Confirmed!</h2>
          <p>Your booking has been confirmed you will recieve an email confirmation soon</p>
          {confirmationCode && (
            <div className="confirmation-code-section">
              <p><strong>Here is your confirmation code:</strong></p>
              <div className="confirmation-code">{confirmationCode}</div>
            </div>
          )}
          <p>{message}</p>
          <Link to={redirectTo} className="back-home-button">{buttonText}</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Booking_Success_Page; 