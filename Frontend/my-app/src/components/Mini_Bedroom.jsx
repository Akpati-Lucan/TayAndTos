import React from 'react';
import { Link } from 'react-router-dom';
import '../component_css/Mini_Bedroom.css';
import miniBedroomImage from '../images/mini_bedroom.jpeg'; 

function Mini_Bedroom() {
  return (
    <div className="mini_bedroom">
      <div className="mini_bedroom_image">
        <img src={miniBedroomImage} alt="Mini Bedroom" />
      </div>
      <div className="separator"></div>
      <div className="mini_bedroom_description">
        <h1>Mini Bedroom</h1>
        <p>This is the mini bedroom. It is a large room with a king-size bed, a dresser, and a closet.</p>
        <div className="button-container">
          <button className="book_button">Book Now</button>
          <Link to="/learn-more" className="learn_more_link">
            <button className="learn_more_button">Learn More</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Mini_Bedroom; 