import React from 'react';
import Header from '../components/Header';
import Footer from '../components/footer';
import '../pages_css/Learn_More.css';
import learnMoreSections from '../components/learn_more_data'; // adjust path as needed

function LearnMore() {
  return (
    <div className="app">
      <Header />
      <div className="learn_more">
        <h1>Learn More About Our Services</h1>
        <div className="learn_more_content">
          {learnMoreSections.map((section, index) => (
            <section className="learn_more_section" key={index}>
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
            </section>
          ))}

          <div className="learn_more_cta">
            <button>Book Your Stay Now</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LearnMore;
