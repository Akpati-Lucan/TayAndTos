import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../pages_css/Forgot_Password.css';

function Forgot_Password() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset instructions have been sent to your email address.');
        setEmail('');
      } else {
        setError(data.message || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="forgot-password-page">
          <div className="forgot-password-card">
            <h2>Forgot Password</h2>
            <p className="forgot-password-subtitle">
              Enter your email address and we'll send you instructions to reset your password.
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
            
            <form className="forgot-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                className="reset-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>
            
            <div className="forgot-password-links">
              <Link to="/login" className="back-to-login">
                ← Back to Login
              </Link>
              <Link to="/signup" className="create-account">
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Forgot_Password; 