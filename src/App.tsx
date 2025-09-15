import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Documents from './pages/Documents';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Documents />} />
        <Route path="/docs/*" element={<Documents />} />
      </Routes>
    </div>
  );
}

export default App;