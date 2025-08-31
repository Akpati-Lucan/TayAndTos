import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../TayAndTos_logo.png';
import '../../component_css/Header/admin_desktop.css';

function AdminDesktop({ user, handleLogout }) {
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
        <div className="admin-nav">
          <Link to="/manage-bookings" className="nav-link admin-link">Manage Bookings</Link>
          <Link to="/manage-users" className="nav-link admin-link">Manage Users</Link>
        </div>
        <div className="user-nav">
          <Link to="/profile" className="nav-link profile-link">
            <span className="user-name">{user?.first_name || 'Admin'}</span>
            <span className="admin-badge">Admin</span>
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
        </div>
      </nav>
    </header>
  );
}

export default AdminDesktop;
