import React from 'react';
import { Link } from 'react-router-dom';
import '../component_css/Childrens_Bedroom.css';
import childrensBedroomImage from '../images/childrens_bedroom.jpeg'; 

function Childrens_Bedroom() {
  return (
    <div className="childrens_bedroom">
      <div className="childrens_bedroom_image">
        <img src={childrensBedroomImage} alt="Childrens Bedroom" />
      </div>
      <div className="separator"></div>
      <div className="childrens_bedroom_description">
        <h1>Childrens Bedroom</h1>
        <p>This is the childrens bedroom. It is a large room with a king-size bed, a dresser, and a closet.</p>
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

export default Childrens_Bedroom;
