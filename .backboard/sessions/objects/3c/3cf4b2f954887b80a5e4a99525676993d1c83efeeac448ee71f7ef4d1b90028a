import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header/Header';
import Footer from '../components/Footer';
import '../pages_css/Sign-up_Page.css';
import showPasswordIcon from '../images/show-password.webp';
import backendService from '../backend_services';

function Signup_Page() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [showResendButton, setShowResendButton] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        
        // Basic password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(formData.password)) {
            setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/users/signup', {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone_number: formData.phone,
                password: formData.password
            });

            const { token, user } = response.data;

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setSuccess('Account created successfully! A confirmation email has been sent to your email address.');
            setShowResendButton(true);
            
            // Redirect to home page after a longer delay to allow resend option
            setTimeout(() => {
                navigate('/');
            }, 5000);

        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendConfirmationEmail = async () => {
        setResendLoading(true);
        setError('');
        
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                setError('User data not found. Please try logging in again.');
                return;
            }

            await backendService.resendNewUserConfirmationEmail(user.email, user.first_name, user.last_name);
            setSuccess('Confirmation email resent successfully!');
            setShowResendButton(false);
        } catch (err) {
            setError(err.message || 'Failed to resend confirmation email. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="signup_page">
                    <div className="signup_card">
                        <h2>Sign Up</h2>
                        <p className="signup_subtitle">Create an account to continue</p>
                        
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className="success-message">
                                {success}
                                {showResendButton && (
                                    <div className="resend-section">
                                        <p>Didn't receive the email?</p>
                                        <button 
                                            type="button"
                                            className="resend-button"
                                            onClick={handleResendConfirmationEmail}
                                            disabled={resendLoading}
                                        >
                                            {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <form className="signup-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input 
                                    type="text" 
                                    id="firstName" 
                                    placeholder="Enter your first name" 
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input 
                                    type="text" 
                                    id="lastName" 
                                    placeholder="Enter your last name" 
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    placeholder="Enter your email" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    placeholder="Enter your phone number" 
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="password-input-container">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        id="password" 
                                        placeholder="Enter your password" 
                                        value={formData.password}
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
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="password-input-container">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword" 
                                        placeholder="Confirm your password" 
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
                                className={`auth-button ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </form>
                        
                        <p className="auth-redirect">
                            Already have an account? <Link to="/login" className="auth-link">Login</Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Signup_Page;