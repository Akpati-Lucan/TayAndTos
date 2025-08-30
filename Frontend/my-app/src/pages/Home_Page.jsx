import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import home_page_sections from '../components/home_page_data';
import '../pages_css/Home_Page.css';

function Home_Page() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <h1>Welcome to TayAndTos</h1>
        <p>Your trusted partner in excellence</p>
        
        <div className="quick_actions">
          <div className="action_card">
            <h2>Book Your Stay</h2>
            <p>Reserve your perfect room for an unforgettable experience</p>
            <Link to="/book-page" className="action_button primary">Book Now</Link>
          </div>
          <div className="action_card">
            <h2>Find Your Booking</h2>
            <p>Manage your existing reservations with confirmation code</p>
            <Link to="/find-booking" className="action_button secondary">Find Booking</Link>
          </div>
        </div>
        
        <div className="home_page_components">
        {home_page_sections.map((section) => (
          <div className="component_container" key={section.key}>
            <div className="component_image">
              <img src={section.image[0].src} alt={section.image[0].alt} />
            </div>
            <div className="separator"></div>
            <div className="component_description">
              <h1>{section.title}</h1>
              <p>{section.description}</p>
              <div className="button-container">
                <Link to="/book-page" className="book_button">Book Now</Link>
                <Link to="/learn-more" className="learn_more_button">Learn More</Link>
              </div>
            </div>
          </div>
        ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home_Page;
