import React from 'react';
import '../component_css/outside_kitchen.css';
import outsideKitchenImage from '../images/outside_kitchen.jpeg'; 

function Outside_Kitchen() {
  return (
    <div className="outside_kitchen">
      <div className="outside_kitchen_image">
        <img src={outsideKitchenImage} alt="Outside Kitchen" />
      </div>
      <div className="separator"></div>
      <div className="outside_kitchen_description">
        <h1>Outside Kitchen</h1>
        <p>This is the outside kitchen. It is a spacious area with modern appliances and a beautiful view.</p>
        <div className="button-container">
          <button className="book_button">Book Now</button>
          <button className="learn_more_button">Learn More</button>
        </div>
      </div>
    </div>
  );
}

export default Outside_Kitchen; 