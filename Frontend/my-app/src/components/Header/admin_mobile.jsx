import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../TayAndTos_logo.png';
import '../../component_css/Header/admin_mobile.css';

function AdminMobile({ user, handleLogout, toggleSidebar, isSidebarOpen, closeSidebar }) {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/" onClick={closeSidebar}>
          <img src={logo} alt="TayAndTos Logo" className="logo-image" />
        </Link>
      </div>
      
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
      </button>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="mobile-sidebar open">
          <div className="sidebar-header">
            <img src={logo} alt="TayAndTos Logo" className="sidebar-logo-image" />
            <button className="close-sidebar-btn" onClick={closeSidebar}>
              <span>&times;</span>
            </button>
          </div>
          <nav className="sidebar-nav">
            <Link to="/" className="sidebar-link" onClick={closeSidebar}>Home</Link>
            <Link to="/book-page" className="sidebar-link" onClick={closeSidebar}>Book Now</Link>
            <Link to="/find-booking" className="sidebar-link" onClick={closeSidebar}>Find Booking</Link>
            <Link to="/learn-more" className="sidebar-link" onClick={closeSidebar}>Learn More</Link>
            <div className="sidebar-user-section">
              <div className="sidebar-profile">
                <img src={logo} alt="Profile" className="sidebar-profile-icon" />
                <div className="sidebar-user-name">
                  {user?.first_name || 'Admin'}
                  <span className="admin-badge">Admin</span>
                </div>
              </div>
              <Link to="/manage-bookings" className="sidebar-link" onClick={closeSidebar}>Manage Bookings</Link>
              <Link to="/manage-users" className="sidebar-link" onClick={closeSidebar}>Manage Users</Link>
              <Link to="/profile" className="sidebar-link" onClick={closeSidebar}>Profile</Link>
              <button onClick={() => { handleLogout(); closeSidebar(); }} className="sidebar-logout-btn">
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default AdminMobile;
