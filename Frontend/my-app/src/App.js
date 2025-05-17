import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home_Page from './pages/Home_Page';
import LearnMore from './pages/Learn_More';
import './App.css';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home_Page />} />
          <Route path="/learn-more" element={<LearnMore />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
