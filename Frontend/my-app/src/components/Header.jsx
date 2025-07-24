import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../component_css/Header.css';
import logo from '../TayAndTos_logo.png';
import profileIcon from '../images/profile_icon.jpeg';

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
    
    // Redirect to home page
    navigate('/');
  };



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
          <div className="user-nav">
            <Link to="/profile-page" className="nav-link profile-link">
              <img src={profileIcon} alt="Profile" className="profile-icon" />
              <span className="user-name">{user?.first_name}</span>
            </Link>
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
    </header>
  );
}

export default Header; 