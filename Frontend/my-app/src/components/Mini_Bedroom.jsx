import React from 'react';
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
        <p>This is the mini bedroom. It is a small room with a single bed, a dresser, and a closet.</p>
        <div className="button-container">
          <button className="book_button">Book Now</button>
          <button className="learn_more_button">Learn More</button>
        </div>
      </div>
    </div>
  );
}

export default Mini_Bedroom; 