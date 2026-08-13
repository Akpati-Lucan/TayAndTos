import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer';
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
              
              {/* Display Images */}
              {section.image && section.image.length > 0 && (
                <div className="learn_more_images">
                  <h4>Photo Gallery</h4>
                  <div className="image_grid">
                    {section.image.map((image, i) => (
                      <div className="image_container" key={i}>
                        <img src={image.src} alt={image.alt} />
                        <p className="image_caption">{image.alt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
{/* Display Videos */}
{section.video && section.video.length > 0 && (
  <div className="learn_more_videos">
    <h4>Video Tours</h4>
    <div className="video_grid">
      {section.video.map((video, i) => (
        <div className="video_container" key={i}>
          <video 
            controls 
            preload="metadata"
            playsInline
            muted
            style={{ width: "100%", height: "auto", borderRadius: "12px" }}
          >
            <source src={video.src} type="video/mp4" />
            <source src={video.src.replace(".mp4", ".webm")} type="video/webm" />
            <p>Your browser does not support the video tag.</p>
          </video>
          <p className="video_caption">{video.alt}</p>
        </div>
      ))}
    </div>
  </div>
)}

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
