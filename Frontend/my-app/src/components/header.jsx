import React from 'react';
import '../component_css/header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>TayAndTos</h1>
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