import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import Documents from './pages/Documents';
import { BlogReader } from './components/blogReader';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blogs />} />
        <Route path="/blog/*" element={<BlogReader />} />
        <Route path="/docs" element={<Documents />} />
        <Route path="/docs/*" element={<Documents />} />
      </Routes>
    </div>
  );
}

export default App;