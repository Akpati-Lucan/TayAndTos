import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../component_css/Header.css';
import logo from '../TayAndTos_logo.png';
import profileIcon from '../images/profile_icon.jpeg';

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    // Update state
    setIsLoggedIn(false);
    setUser(null);
    
    // Close sidebar
    setIsSidebarOpen(false);
    
    // Redirect to home page
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };



  return (
    <>
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="TayAndTos Logo" className="logo-image" />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/book-page" className="nav-link">Book Now</Link>
          <Link to="/find-booking" className="nav-link">Find Booking</Link>
          <Link to="/learn-more" className="nav-link">Learn More</Link>
          
          {isLoggedIn ? (
            <div className="user-nav">
              <Link to="/profile-page" className="nav-link profile-link">
                <img src={profileIcon} alt="Profile" className="profile-icon" />
                <span className="user-name">{user?.first_name}</span>
              </Link>
              {user?.admin && (
                <>
                  <Link to="/manage-users" className="nav-link">Manage Users</Link>
                  <Link to="/manage-bookings" className="nav-link">Manage Bookings</Link>
                </>
              )}
              <button onClick={handleLogout} className="nav-link logout-link">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link auth-link">Login</Link>
              <Link to="/signup" className="nav-link auth-link signup-link">Sign Up</Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Menu */}
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <span className={`hamburger ${isSidebarOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isSidebarOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isSidebarOpen ? 'open' : ''}`}></span>
        </button>
      </header>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logo} alt="TayAndTos Logo" className="sidebar-logo-image" />
          </div>
          <button className="close-sidebar-btn" onClick={closeSidebar}>
            <span className="close-icon">×</span>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link" onClick={closeSidebar}>Home</Link>
          <Link to="/book-page" className="sidebar-link" onClick={closeSidebar}>Book Now</Link>
          <Link to="/find-booking" className="sidebar-link" onClick={closeSidebar}>Find Booking</Link>
          <Link to="/learn-more" className="sidebar-link" onClick={closeSidebar}>Learn More</Link>
          
          {isLoggedIn ? (
            <div className="sidebar-user-section">
              <div className="sidebar-profile">
                <img src={profileIcon} alt="Profile" className="sidebar-profile-icon" />
                <span className="sidebar-user-name">{user?.first_name}</span>
              </div>
              <Link to="/profile-page" className="sidebar-link" onClick={closeSidebar}>My Profile</Link>
              {user?.admin && (
                <>
                  <Link to="/manage-users" className="sidebar-link" onClick={closeSidebar}>Manage Users</Link>
                  <Link to="/manage-bookings" className="sidebar-link" onClick={closeSidebar}>Manage Bookings</Link>
                </>
              )}
              <button onClick={handleLogout} className="sidebar-logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="sidebar-auth-section">
              <Link to="/login" className="sidebar-link" onClick={closeSidebar}>Login</Link>
              <Link to="/signup" className="sidebar-link sidebar-signup" onClick={closeSidebar}>Sign Up</Link>
            </div>
          )}
        </nav>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </>
  );
}

export default Header; 