import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer";

function Privacy_Policy() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="legal-page" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem", lineHeight: "1.8" }}>
          <h1>Privacy Policy</h1>
          <p><em>Last updated: August 2026</em></p>

          <p>This Privacy Policy describes how Tay and Tos Accommodation ("we", "us", or "our") collects, uses, and shares your personal information when you use our website and services.</p>

          <h2>1. Information We Collect</h2>
          <p>When you use our services, we may collect the following types of information:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account.</li>
            <li><strong>Booking Information:</strong> Room preferences, check-in/check-out dates, number of guests, and special requests.</li>
            <li><strong>Guest Booking Information:</strong> For unregistered guests, we collect name, email address, and phone number necessary to process your booking.</li>
            <li><strong>Communication Data:</strong> Information you provide when contacting us for support.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Process and manage your bookings</li>
            <li>Send booking confirmations, updates, and reminders</li>
            <li>Send password reset emails and account-related notifications</li>
            <li>Provide customer support</li>
            <li>Improve our services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Third-Party Services</h2>
          <p>We use the following third-party service providers:</p>
          <ul>
            <li><strong>SendGrid</strong> &mdash; for sending transactional emails (booking confirmations, password resets, etc.). Your email address is shared with SendGrid for delivery purposes.</li>
          </ul>

          <h2>4. Data Storage and Security</h2>
          <p>Your personal data is stored securely in our database. We implement appropriate security measures including password hashing (bcrypt), JWT authentication, and encrypted connections. However, no method of electronic storage is 100% secure.</p>

          <h2>5. Data Retention</h2>
          <p>We retain your personal information for as long as your account is active or as needed to provide you services. Booking records may be retained for business and legal compliance purposes.</p>

          <h2>6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (see "Delete Account" in your profile settings)</li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>

          <h2>7. Data Deletion</h2>
          <p>You can delete your account and associated data through your profile settings. If you need assistance, please contact us.</p>

          <h2>8. Cookies</h2>
          <p>We use essential cookies for authentication and session management. No tracking or advertising cookies are used. By using our website, you consent to the use of essential cookies.</p>

          <h2>9. Contact Us</h2>
          <p>For privacy-related inquiries, please contact us:</p>
          <p>
            Email: support@tayandtoscorporations.com<br />
            Phone: +234 814 074 9365<br />
            Address: NO. 5, UNITY QUARTERS, FEDERAL PRISON AREA, OFF ARE/AFAO ROAD, ADO-EKITI, EKITI STATE, NIGERIA
          </p>

          <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#666" }}>
            <em>This privacy policy is provided as a template and should be reviewed by a qualified legal professional to ensure compliance with applicable laws, including the Nigeria Data Protection Regulation (NDPR), GDPR (if serving EU users), and other relevant regulations.</em>
          </p>

          <Link to="/" style={{ display: "inline-block", marginTop: "1rem", color: "#F15A29" }}>&larr; Back to Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Privacy_Policy;
