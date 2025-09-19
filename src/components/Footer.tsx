import React from 'react';
import { Brain, Github, Twitter, Linkedin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  // We'll use the theme context just to know when it changes, but we'll keep the footer dark
  const { theme } = useTheme();
  
  return (
    <footer className="px-6 py-12 border-t border-gray-800/50" style={{ 
      backgroundColor: '#121212', 
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9))'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-yellow-300" />
              <span className="font-bold text-white">ASDM</span>
            </div>
            <p className="text-gray-400 text-sm">
              Building the future of software development through intelligent AI integration.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">Best Practices</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">GitHub</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">Discord</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">Forum</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 ASDM. All rights reserved.
          </p>
        </div>
        {/* This is an empty div with a class that forces the footer to stay in dark mode regardless of theme */}
        <div className="hidden dark:bg-gray-900 dark:text-white"></div>
      </div>
    </footer>
  );
}