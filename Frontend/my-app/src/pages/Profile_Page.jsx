import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../pages_css/Profile_Page.css';

function Profile_Page() {
  return (
    <div className="app">
      <Header />
      <div className="profile_page">
        <h1>Profile Page</h1>
      </div>    
      <Footer />
    </div>
  );
}

export default Profile_Page;