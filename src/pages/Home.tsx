import React, { useEffect } from 'react';
import { Code, Zap, ArrowRight, Brain, Github, Twitter, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParadigmTransition from '../components/ParadigmTransition';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const navigate = useNavigate();
  const { t, loadTranslations, isLoaded, language } = useLanguage();
  
  // Load home page translations
  useEffect(() => {
    loadTranslations('Home');
  }, [language, loadTranslations]);

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
                {isLoaded('Home') ? t('hero.title1', 'Home') : 'AI Powered System'}
                <br />
              </span>
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                {isLoaded('Home') ? t('hero.title2', 'Home') : 'Development Methodology'}
              </span>
            </h1>
            
            {/* Paradigm Shift Highlight with Animation */}
            <div className="mb-8 sm:mb-12">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-20 animate-pulse"></div>
                <h2 className="relative text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    {isLoaded('Home') ? t('hero.highlight', 'Home') : 'From Human-Centric to AI-Centric'}
                  </span>
                </h2>
                <p className="relative text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 max-w-4xl mx-auto leading-relaxed">
                  {isLoaded('Home') ? t('hero.subtitle', 'Home') : 'Transforming system development from "designing for humans" to "designing for AI" - a fundamental paradigm shift for the AI era.'}
                </p>
                <div className="relative flex justify-center items-center mb-6">
                  <div className="bg-gray-800 rounded-full p-3 mr-2">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600"></div>
                    </div>
                    <div className="relative bg-gray-900 px-4 py-2 rounded-full border border-gray-700">
                      <span className="text-sm sm:text-base font-medium text-gray-300">Transform</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-full p-3 ml-2">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate(`/docs/${language}`)}
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg border border-yellow-300 hover:from-yellow-400 hover:to-amber-500 transition-all transform hover:scale-105 font-semibold text-base flex items-center justify-center space-x-2"
              >
                <span>{isLoaded('Home') ? t('hero.getStarted', 'Home') : 'Get Started'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto border border-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 font-semibold text-base">
                {isLoaded('Home') ? t('hero.watchDemo', 'Home') : 'Watch Demo'}
              </button>
            </div>
          </div>
        </section>

        {/* Paradigm Shift Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-20 bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16 text-white">
              {isLoaded('Home') ? t('methodology.title', 'Home') : 'AI-First Development Framework'}
            </h2>
            
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
                {/* Human-Centric Design */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-gray-900/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-blue-500/30">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {isLoaded('Home') ? t('paradigm.human.title', 'Home') || 'Human-Centric Design' : 'Human-Centric Design'}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-300">
                          {isLoaded('Home') ? t('paradigm.human.point1', 'Home') || 'Designed for human usability and comprehension' : 'Designed for human usability and comprehension'}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-300">
                          {isLoaded('Home') ? t('paradigm.human.point2', 'Home') || 'Human-driven decision making at every step' : 'Human-driven decision making at every step'}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-300">
                          {isLoaded('Home') ? t('paradigm.human.point3', 'Home') || 'Visual interfaces prioritize human interaction' : 'Visual interfaces prioritize human interaction'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* AI-Centric Design */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-gray-900/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-purple-500/30">
                    <div className="flex items-center mb-6">
                      <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {isLoaded('Home') ? t('paradigm.ai.title', 'Home') || 'AI-Centric Design' : 'AI-Centric Design'}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-300">
                          {isLoaded('Home') ? t('paradigm.ai.point1', 'Home') || 'Optimized for AI comprehension and processing' : 'Optimized for AI comprehension and processing'}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-300">
                          {isLoaded('Home') ? t('paradigm.ai.point2', 'Home') || 'AI-driven execution with human guidance' : 'AI-driven execution with human guidance'}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-300">
                          {isLoaded('Home') ? t('paradigm.ai.point3', 'Home') || 'Text-based interfaces maximize AI efficiency' : 'Text-based interfaces maximize AI efficiency'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Paradigm Transition Animation */}
            <div className="my-12 sm:my-16">
              <ParadigmTransition />
            </div>
              
              {/* Benefits of AI-Centric Approach */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 text-white">
                  {isLoaded('Home') ? t('paradigm.benefits.title', 'Home') || 'Why This Shift Matters' : 'Why This Shift Matters'}
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-bold text-purple-400 mb-2">10x</div>
                    <p className="text-gray-300 text-sm">
                      {isLoaded('Home') ? t('paradigm.benefits.speed', 'Home') : 'Development Speed'}
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-bold text-purple-400 mb-2">80%</div>
                    <p className="text-gray-300 text-sm">
                      {isLoaded('Home') ? t('paradigm.benefits.automation', 'Home') : 'Task Automation'}
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 transform hover:scale-105 transition-transform">
                    <div className="text-3xl font-bold text-purple-400 mb-2">3x</div>
                    <p className="text-gray-300 text-sm">
                      {isLoaded('Home') ? t('paradigm.benefits.consistency', 'Home') : 'Output Consistency'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16 text-white">
              {isLoaded('Home') ? t('features.title', 'Home') : 'Three Foundational Capabilities'}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-105">
                <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 mb-4" />
                <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-white">
                  {isLoaded('Home') ? t('features.contextual.title', 'Home') : 'Contextual Awareness'}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {isLoaded('Home') ? t('features.contextual.description', 'Home') : 'Providing AI with appropriate contextual environments. Building effective context is key to improving AI generation accuracy through text-based inputs.'}
                </p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-105">
                <Code className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 mb-4" />
                <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-white">
                  {isLoaded('Home') ? t('features.autonomous.title', 'Home') : 'Autonomous Execution'}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {isLoaded('Home') ? t('features.autonomous.description', 'Home') : 'Providing AI with appropriate toolchains. AI excels with command-line tools and prefers text-based logging information for direct development participation.'}
                </p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-105 sm:col-span-2 md:col-span-1">
                <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 mb-4" />
                <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-white">
                  {isLoaded('Home') ? t('features.selfIteration.title', 'Home') : 'Self-Iteration Capability'}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {isLoaded('Home') ? t('features.selfIteration.description', 'Home') : 'Maintaining project state synchronization and tool adaptation. Continuously updating capabilities as projects evolve to ensure sustained effectiveness.'}
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
                  {isLoaded('Home') ? t('methodology.title', 'Home') : 'AI-First Development Framework'}
                </h2>
                <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                  {isLoaded('Home') ? t('methodology.description', 'Home') : 'ASDM represents a fundamental paradigm shift from human-centric to AI-centric development, where AI assumes responsibility for most output tasks while humans guide and make critical decisions.'}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-gray-900 font-bold text-xs sm:text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 sm:mb-2">
                        {isLoaded('Home') ? t('methodology.step1.title', 'Home') : 'Value Creation Shift'}
                      </h4>
                      <p className="text-sm sm:text-base text-gray-300">
                        {isLoaded('Home') ? t('methodology.step1.description', 'Home') : 'Transform from human-only to \'AI + Human\' collaboration where majority of deliverables are AI-generated.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-gray-900 font-bold text-xs sm:text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 sm:mb-2">
                        {isLoaded('Home') ? t('methodology.step2.title', 'Home') : 'Capability Architecture'}
                      </h4>
                      <p className="text-sm sm:text-base text-gray-300">
                        {isLoaded('Home') ? t('methodology.step2.description', 'Home') : 'Establish foundational capabilities that support scenario-specific tools across the software lifecycle.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-gray-900 font-bold text-xs sm:text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 sm:mb-2">
                        {isLoaded('Home') ? t('methodology.step3.title', 'Home') : 'AI-Enabled Scenarios'}
                      </h4>
                      <p className="text-sm sm:text-base text-gray-300">
                        {isLoaded('Home') ? t('methodology.step3.description', 'Home') : 'Deploy AI tools for specific tasks like writing requirements, generating code, designing tests, and code reviews.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-300/10 to-amber-400/10 p-6 sm:p-8 rounded-2xl border border-yellow-300/20 backdrop-blur-sm mt-6 lg:mt-0">
                <div className="text-center">
                  <Brain className="w-16 h-16 sm:w-24 sm:h-24 text-yellow-300 mx-auto mb-4 sm:mb-6" />
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                    {isLoaded('Home') ? t('methodology.cta.title', 'Home') : 'Ready to Transform?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-5 sm:mb-6">
                    {isLoaded('Home') ? t('methodology.cta.description', 'Home') : 'Join the AI-first development revolution and be part of the community shaping the future of system development.'}
                  </p>
                  <button
                    onClick={() => navigate(`/docs/${language}`)}
                    className="w-full sm:w-auto bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 px-5 sm:px-6 py-2 sm:py-3 rounded-lg border border-yellow-300 hover:from-yellow-400 hover:to-amber-500 transition-all transform hover:scale-105 font-semibold"
                  >
                    {isLoaded('Home') ? t('methodology.cta.button', 'Home') : 'Explore Docs'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="px-4 sm:px-6 py-12 sm:py-20 bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">
              {isLoaded('Home') ? t('community.title', 'Home') : 'Join Our Community'}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto">
              {isLoaded('Home') ? t('community.description', 'Home') : 'Join our growing community of developers and organizations adopting AI-first development methodologies. Share experiences and shape the future of AI-powered system development.'}
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