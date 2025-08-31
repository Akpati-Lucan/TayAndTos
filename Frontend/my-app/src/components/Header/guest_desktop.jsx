import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../TayAndTos_logo.png';
import '../../component_css/Header/guest_desktop.css';

function GuestDesktop() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="TayAndTos Logo" className="logo-image" />
        </Link>
      </div>
      <nav className="nav desktop-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/book-page" className="nav-link">Book Now</Link>
        <Link to="/find-booking" className="nav-link">Find Booking</Link>
        <Link to="/learn-more" className="nav-link">Learn More</Link>
        <div className="auth-buttons">
          <Link to="/login" className="nav-link auth-link">Login</Link>
          <Link to="/signup" className="nav-link auth-link signup-link">Sign Up</Link>
        </div>
      </nav>
    </header>
  );
}

export default GuestDesktop;
