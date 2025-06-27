import React from 'react';
import { Link } from 'react-router-dom';
import '../component_css/Header.css';
import logo from '../TayAndTos_logo.png';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="TayAndTos Logo" className="logo-image" />
      </div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/book-page" className="nav-link">Book Now</Link>
        <Link to="/learn-more" className="nav-link">Learn More</Link>
      </nav>
    </header>
  );
}

export default Header; 