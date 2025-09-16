import React, { useState } from 'react';
import { Brain, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  // No props needed for now
}

export default function Header({}: HeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-yellow-300 transition-colors font-medium text-sm"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/docs')}
            className="text-gray-300 hover:text-yellow-300 transition-colors font-medium text-sm"
          >
            Docs
          </button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-300 hover:text-yellow-300 transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
          <nav className="flex flex-col p-4 space-y-4">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-yellow-300 transition-colors font-medium py-2 px-4 hover:bg-gray-800/50 rounded-md w-full text-left text-xs"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate('/docs');
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-yellow-300 transition-colors font-medium py-2 px-4 hover:bg-gray-800/50 rounded-md w-full text-left text-xs"
            >
              Docs
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}