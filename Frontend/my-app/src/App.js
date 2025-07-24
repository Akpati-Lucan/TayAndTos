import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import backendService from './services/backendService';

import Home_Page from './pages/Home_Page';
import LearnMore from './pages/Learn_More';
import Book_Page from './pages/Book_Page';
import Profile_Page from './pages/Profile_Page';
import Login_Page from './pages/Login_Page';
import Signup_Page from './pages/Sign-up_Page';
import Manage_Users from './pages/Manage_Users';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize backend service when app starts
    backendService.startHealthChecks();
    
    // Cleanup on app unmount
    return () => {
      backendService.stopHealthChecks();
    };
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login_Page />} />
          <Route path="/signup" element={<Signup_Page />} />
          <Route path="/" element={<Home_Page />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/book-page" element={<Book_Page />} />
          <Route path="/profile-page" element={<Profile_Page />} />
          <Route path="/manage-users" element={<Manage_Users />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
