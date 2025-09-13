import React from 'react';
import { Brain, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-gray-800/50 backdrop-blur-sm bg-black/20">
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
      </div>
    </footer>
  );
}