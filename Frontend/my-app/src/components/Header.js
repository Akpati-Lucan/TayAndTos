import React from 'react';
import '../component_css/Header.css';
import logo from '../TayAndTos_logo.png';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="TayAndTos Logo" className="logo-image" />
      </div>
      <nav className="nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header; 