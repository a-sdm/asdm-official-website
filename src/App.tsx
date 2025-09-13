import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import DocumentationCenter from './components/DocumentationCenter';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'docs'>('landing');

  return (
    <div className="min-h-screen bg-white">
      {currentPage === 'landing' ? (
        <LandingPage onNavigate={() => setCurrentPage('docs')} />
      ) : (
        <DocumentationCenter onNavigateHome={() => setCurrentPage('landing')} />
      )}
    </div>
  );
}

export default App;