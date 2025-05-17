import React from 'react';
import Header from './components/Header';
import Footer from './components/footer';
import Master_Bedroom from './components/Master_Bedroom';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <h1>Welcome to TayAndTos</h1>
        <p>Your trusted partner in excellence</p>
        <Master_Bedroom />
      </main>
      <Footer />
    </div>
  );
}

export default App;
