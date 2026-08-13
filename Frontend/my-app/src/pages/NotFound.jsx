import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer";

function NotFound() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div style={{ textAlign: "center", padding: "4rem 2rem", maxWidth: "600px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "4rem", color: "#F15A29", margin: "0" }}>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for does not exist or has been moved.</p>
          <div style={{ marginTop: "2rem" }}>
            <Link to="/" className="action_button primary">Go to Home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NotFound;
