import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../pages_css/Sign-up_Page.css';

function Signup_Page() {
    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="signup_page">
                    <div className="signup_card">
                        <h2>Sign Up</h2>
                        <p className="signup_subtitle">Create an account to continue</p>
                        
                        <form className="signup-form">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" placeholder="Enter your first name" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" placeholder="Enter your last name" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="Enter your email" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="tel" id="phone" placeholder="Enter your phone number" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" placeholder="Enter your username" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" placeholder="Enter your password" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input type="password" id="confirmPassword" placeholder="Confirm your password" required />
                            </div>
                            
                            <button type="submit" className="auth-button">
                                Sign Up
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