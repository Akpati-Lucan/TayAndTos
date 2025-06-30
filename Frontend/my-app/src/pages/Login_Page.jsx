import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../pages_css/Login_Page.css';

function Login_Page() {
    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="login_page">
                    <div className="login_card">
                        <h2>Login</h2>
                        <p className="login_subtitle">Login to continue</p>
                        
                        <form className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">email</label>
                                <input type="text" id="email" placeholder="Enter your email" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" placeholder="Enter your password" required />
                            </div>
                            
                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" id="rememberMe" />
                                    <span className="checkmark"></span>
                                    Remember me
                                </label>
                            </div>
                            
                            <button type="submit" className="auth-button">
                                Login
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