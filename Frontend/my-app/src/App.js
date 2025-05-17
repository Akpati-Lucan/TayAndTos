import React from 'react';
import Header from './components/Header';
import Footer from './components/footer';
import Master_Bedroom from './components/Master_Bedroom';
import Childrens_Bedroom from './components/Childrens_Bedroom';
import Mini_Bedroom from './components/Mini_Bedroom';
import Outside_Kitchen from './components/Outside_Kitchen';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <h1>Welcome to TayAndTos</h1>
        <p>Your trusted partner in excellence</p>
        <Master_Bedroom />
        <Childrens_Bedroom />
        <Mini_Bedroom />
        <Outside_Kitchen />
      </main>
      <Footer />
    </div>
  );
}

export default App;
