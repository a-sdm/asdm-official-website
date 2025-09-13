import React from 'react';
import { Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  // No props needed for now
}

export default function Header({}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <Brain className="w-8 h-8 text-yellow-300" />
          <span className="text-xl font-bold text-white">ASDM</span>
        </button>
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-yellow-300 transition-colors font-medium"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/documents')}
            className="text-gray-300 hover:text-yellow-300 transition-colors font-medium"
          >
            Documents
          </button>
        </nav>
      </div>
    </header>
  );
}