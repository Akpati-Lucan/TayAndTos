import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../pages_css/Book_Page.css';

function Booking_Success_Page() {
  const location = useLocation();
  const message = location.state?.message || 'Booking confirmed successfully! You will receive a confirmation email shortly.';
  const buttonText = 'View My Bookings';
  const redirectTo = '/profile-page';

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="success-message">
          <h2>Booking Confirmed!</h2>
          <p>{message}</p>
          <Link to={redirectTo} className="back-home-button">{buttonText}</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Booking_Success_Page; 