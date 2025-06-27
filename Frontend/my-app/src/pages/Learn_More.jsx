import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/footer';
import '../pages_css/Learn_More.css';
import learnMoreSections from '../components/learn_more_data'; 

function LearnMore() {
  return (
    <div className="app">
      <Header />
      <div className="learn_more">
        <h1>Learn More About Our Services</h1>
        <div className="learn_more_content">
          {learnMoreSections.map((section) => (
            <section className="learn_more_section" key={section.key}>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
              <div className="learn_more_features">
                {section.features.map((feature, i) => (
                  <div className="feature_item" key={i}>
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                ))}
              </div>
              <div className="learn_more_images">
                {section.image.map((image, i) => (
                  <img src={image.src} alt={image.alt} key={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
          <Link to="/book-page" className="book_button">Book Now</Link>
      </div>
      <Footer />
    </div>
  );
}

export default LearnMore;
