import React from 'react';
import { Code, Zap, Users, ArrowRight, Brain, Github, Twitter, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/docs');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                AI Powered System
                <br />
              </span>
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Development Methodology
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              A new framework revolutionizing development with AI-first principles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/docs')}
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg border border-yellow-300 hover:from-yellow-400 hover:to-amber-500 transition-all transform hover:scale-105 font-semibold text-base flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto border border-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 font-semibold text-base">
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 sm:px-6 py-12 sm:py-20 bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16 text-white">
              Building the Future with ASDM
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-105">
                <Code className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 mb-4" />
                <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-white">AI-First Development</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  We're building a framework that integrates AI capabilities from the ground up, 
                  designing systems that naturally incorporate generative AI and intelligent automation.
                </p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-105">
                <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 mb-4" />
                <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-white">Enhanced Productivity</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Help us accelerate development cycles with intelligent code generation, 
                  automated testing, and smart debugging assistance as we build this framework.
                </p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-105 sm:col-span-2 md:col-span-1">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 mb-4" />
                <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-white">Team Collaboration</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Join us in fostering collaboration between human developers and AI systems, 
                  creating synergistic workflows as we develop this framework together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section id="methodology" className="px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">
                  A Comprehensive Framework
                </h2>
                <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                  ASDM is a comprehensive framework we're building to integrate AI throughout the 
                  development lifecycle, from planning to deployment and maintenance.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-gray-900 font-bold text-xs sm:text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 sm:mb-2">Assessment & Planning</h4>
                      <p className="text-sm sm:text-base text-gray-300">Evaluate current processes and identify AI integration opportunities.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-gray-900 font-bold text-xs sm:text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 sm:mb-2">Foundation Setup</h4>
                      <p className="text-sm sm:text-base text-gray-300">Establish infrastructure and train teams on AI-assisted development.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-gray-900 font-bold text-xs sm:text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 sm:mb-2">Implementation & Scaling</h4>
                      <p className="text-sm sm:text-base text-gray-300">Deploy AI tools and scale successful practices across the organization.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-300/10 to-amber-400/10 p-6 sm:p-8 rounded-2xl border border-yellow-300/20 backdrop-blur-sm mt-6 lg:mt-0">
                <div className="text-center">
                  <Brain className="w-16 h-16 sm:w-24 sm:h-24 text-yellow-300 mx-auto mb-4 sm:mb-6" />
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Ready to Transform?</h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-5 sm:mb-6">
                    Join us in building this revolutionary framework and be part of the early community.
                  </p>
                  <button
                    onClick={() => navigate('/docs')}
                    className="w-full sm:w-auto bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 px-5 sm:px-6 py-2 sm:py-3 rounded-lg border border-yellow-300 hover:from-yellow-400 hover:to-amber-500 transition-all transform hover:scale-105 font-semibold"
                  >
                    Explore Docs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="px-4 sm:px-6 py-12 sm:py-20 bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Join Our Community</h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto">
              Join our growing community of early adopters, share feedback, and help shape the future 
              of AI-powered development methodologies as we build this framework together.
            </p>
            <div className="flex justify-center space-x-4 sm:space-x-6">
              <a
                href="#"
                className="bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-110"
              >
                <Github className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 hover:text-yellow-300 transition-colors" />
              </a>
              <a
                href="#"
                className="bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-110"
              >
                <Twitter className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 hover:text-yellow-300 transition-colors" />
              </a>
              <a
                href="#"
                className="bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-110"
              >
                <Linkedin className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 hover:text-yellow-300 transition-colors" />
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}