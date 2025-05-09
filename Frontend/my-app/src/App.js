import React from 'react';
import Header from './components/header';
import Footer from './components/footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <h1>Welcome to TayAndTos</h1>
        <p>Your trusted partner in excellence</p>
      </main>
      <Footer />
    </div>
  );
}

export default App;
