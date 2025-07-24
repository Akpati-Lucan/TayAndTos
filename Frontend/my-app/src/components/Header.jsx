import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../component_css/Header.css';
import logo from '../TayAndTos_logo.png';
import profileIcon from '../images/profile_icon.jpeg';

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

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
    setShowDropdown(false);
    
    // Redirect to home page
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="TayAndTos Logo" className="logo-image" />
        </Link>
      </div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/book-page" className="nav-link">Book Now</Link>
        <Link to="/learn-more" className="nav-link">Learn More</Link>
        
        {isLoggedIn ? (
          <div className="profile-dropdown">
            <button 
              className="profile-button"
              onClick={toggleDropdown}
            >
              <img src={profileIcon} alt="Profile" className="profile-icon" />
              <span className="user-name">{user?.first_name}</span>
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile-page" className="dropdown-item" onClick={closeDropdown}>
                  My Profile
                </Link>
                <Link to="/book-page" className="dropdown-item" onClick={closeDropdown}>
                  My Bookings
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout-button">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="nav-link auth-link">Login</Link>
            <Link to="/signup" className="nav-link auth-link signup-link">Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header; 