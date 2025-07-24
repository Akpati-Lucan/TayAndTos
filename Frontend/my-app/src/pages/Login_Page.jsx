import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../pages_css/Login_Page.css';
import showPasswordIcon from '../images/show-password.webp';

function Login_Page() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:8080/users/login', {
                email: formData.email,
                password: formData.password
            });

            const { token, user } = response.data;

            // Store token in localStorage
            localStorage.setItem('token', token);
            
            // Store user data if remember me is checked
            if (formData.rememberMe) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                sessionStorage.setItem('user', JSON.stringify(user));
            }

            setSuccess('Login successful! Redirecting...');
            
            // Redirect to home page after a short delay
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="login_page">
                    <div className="login_card">
                        <h2>Login</h2>
                        <p className="login_subtitle">Login to continue</p>
                        
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
                        
                        <form className="login-form" onSubmit={handleSubmit}>
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
                            
                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        id="rememberMe" 
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                    />
                                    <span className="checkmark"></span>
                                    Remember me
                                </label>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`auth-button ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        
                        <p className="auth-redirect">
                            Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
                        </p>
                        
                        <p className="forgot-password">
                            <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login_Page;