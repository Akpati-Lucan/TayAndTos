import React from 'react';
import '../component_css/Master_Bedroom.css';
import masterBedroomImage from '../images/master_bedroom.jpg'; 

function Master_Bedroom() {
  return (
    <div className="master_bedroom">
      <div className="master_bedroom_image">
        <img src={masterBedroomImage} alt="Master Bedroom" />
      </div>
      <div className="separator"></div>
      <div className="master_bedroom_description">
        <h1>Master Bedroom</h1>
        <p>This is the master bedroom. It is a large room with a king-size bed, a dresser, and a closet.</p>
        <div className="button-container">
          <button className="book_button">Book Now</button>
          <button className="learn_more_button">Learn More</button>
        </div>
      </div>
    </div>
  );
}

export default Master_Bedroom;
