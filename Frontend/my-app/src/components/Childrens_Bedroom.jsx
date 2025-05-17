import React from 'react';
import '../component_css/Childrens_Bedroom.css';
import childrensBedroomImage from '../images/childrens_bedroom.jpg'; 

function Childrens_Bedroom() {
  return (
    <div className="master_bedroom">
      <div className="master_bedroom_image">
        <img src={childrensBedroomImage} alt="Childrens Bedroom" />
      </div>
      <div className="separator"></div>
      <div className="master_bedroom_description">
        <h1>Childrens Bedroom</h1>
        <p>This is the childrens bedroom. It is a large room with a king-size bed, a dresser, and a closet.</p>
        <div className="button-container">
          <button className="book_button">Book Now</button>
          <button className="learn_more_button">Learn More</button>
        </div>
      </div>
    </div>
  );
}

export default Childrens_Bedroom;
