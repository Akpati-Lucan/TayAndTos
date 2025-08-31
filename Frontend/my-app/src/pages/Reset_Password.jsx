import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer';
import showPasswordIcon from '../images/show-password.webp';
import '../pages_css/Reset_Password.css';

function Reset_Password() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid reset link. Please request a new password reset.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password has been reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="reset-password-page">
            <div className="reset-password-card">
              <h2>Invalid Reset Link</h2>
              <p className="reset-password-subtitle">
                The password reset link is invalid or has expired.
              </p>
              <div className="reset-password-links">
                <Link to="/forgot-password" className="request-new-reset">
                  Request New Password Reset
                </Link>
                <Link to="/login" className="back-to-login">
                  ← Back to Login
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="reset-password-page">
          <div className="reset-password-card">
            <h2>Reset Password</h2>
            <p className="reset-password-subtitle">
              Enter your new password below.
            </p>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {success && (
              <div className="success-message">
                {success}
              </div>
            )}
            
            <form className="reset-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="newPassword" 
                    placeholder="Enter your new password" 
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required 
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img 
                      src={showPasswordIcon} 
                      alt={showPassword ? "Hide password" : "Show password"}
                      className={`password-icon ${showPassword ? 'hide' : 'show'}`}
                    />
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input-container">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword" 
                    placeholder="Confirm your new password" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required 
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <img 
                      src={showPasswordIcon} 
                      alt={showConfirmPassword ? "Hide password" : "Show password"}
                      className={`password-icon ${showConfirmPassword ? 'hide' : 'show'}`}
                    />
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="reset-button"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
            
            <div className="reset-password-links">
              <Link to="/login" className="back-to-login">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Reset_Password; 