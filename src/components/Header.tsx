import React from 'react';
import { Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  showDocumentationButton?: boolean;
}

export default function Header({ showDocumentationButton = true }: HeaderProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/documents');
  };

  return (
    <header className="px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-yellow-300" />
          <span className="text-xl font-bold">ASDM</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-yellow-300 transition-colors">Features</a>
          <a href="#methodology" className="text-gray-300 hover:text-yellow-300 transition-colors">Methodology</a>
          <a href="#community" className="text-gray-300 hover:text-yellow-300 transition-colors">Community</a>
          {showDocumentationButton && (
            <button
              onClick={handleNavigate}
              className="bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 px-4 py-2 rounded-lg border border-yellow-300 hover:from-yellow-400 hover:to-amber-500 transition-all transform hover:scale-105 font-semibold"
            >
              Documentation
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}