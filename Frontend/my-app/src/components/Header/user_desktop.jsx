import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../TayAndTos_logo.png';
import '../../component_css/Header/user_desktop.css';

function UserDesktop({ user, handleLogout }) {
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
        <div className="user-nav">
          <Link to="/profile" className="nav-link profile-link">
            <span className="user-name">{user?.first_name || 'User'}</span>
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
        </div>
      </nav>
    </header>
  );
}

export default UserDesktop;
