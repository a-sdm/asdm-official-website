import React, { useState, useEffect } from 'react';
import { Brain, Menu, X, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage, LanguageCode } from '../context/LanguageContext';

interface HeaderProps {
  // No props needed for now
}

export default function Header({}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const { language, setLanguage, t, loadTranslations, isLoaded } = useLanguage();
  
  // Load header translations
  useEffect(() => {
    loadTranslations('Header');
  }, [language, loadTranslations]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };

  const changeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    setLanguageMenuOpen(false);
    
    // Update URL to reflect the new language
    const currentPath = location.pathname;
    
    if (currentPath.startsWith('/blog/')) {
      // If we're on a blog page, update the language in the URL
      const pathParts = currentPath.split('/');
      if (pathParts.length >= 3) {
        // Replace the language part: /blog/en-us/... -> /blog/zh-cn/...
        pathParts[2] = lang;
        navigate(pathParts.join('/'));
      } else {
        // If it's just /blog, navigate to language-specific blog
        navigate(`/blog/${lang}`);
      }
    } else if (currentPath === '/blog') {
      // If we're on the base blog page, navigate to language-specific blog
      navigate(`/blog/${lang}`);
    }
    // For other pages (home, docs), we don't need to change the URL
    // as they don't have language-specific routes
  };

  return (
    <header className="px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm bg-black/20 relative z-[1000]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <Brain className="w-8 h-8 text-yellow-300" />
          <span className="text-xl font-bold text-white tracking-wide">ASDM</span>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-yellow-300 transition-colors font-medium text-sm px-2 py-1"
          >
            {isLoaded('Header') ? t('home', 'Header') : 'Home'}
          </button>
          <button
            onClick={() => navigate(`/blog/${language}`)}
            className="text-gray-300 hover:text-yellow-300 transition-colors font-medium text-sm px-2 py-1"
          >
            {isLoaded('Header') ? t('blog', 'Header') : 'Blog'}
          </button>
          <button
            onClick={() => navigate('/docs')}
            className="text-gray-300 hover:text-yellow-300 transition-colors font-medium text-sm px-2 py-1"
          >
            {isLoaded('Header') ? t('docs', 'Header') : 'Docs'}
          </button>
          
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={toggleLanguageMenu}
              className="flex items-center space-x-2 text-gray-300 hover:text-yellow-300 transition-colors font-medium text-sm px-2 py-1"
              aria-label="Change language"
            >
              <Globe className="w-4 h-4" />
              <span className="inline-block">{language === 'en-us' ? 'English' : '中文'}</span>
            </button>
            
            {/* Language Dropdown */}
            {languageMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-36 bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-md shadow-lg z-50">
                <button
                  onClick={() => changeLanguage('en-us')}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    language === 'en-us' ? 'text-yellow-300 font-medium' : 'text-gray-300'
                  } hover:bg-gray-800/50 rounded-t-md flex items-center justify-between`}
                >
                  <span>English</span>
                  {language === 'en-us' && <span className="text-xs">✓</span>}
                </button>
                <button
                  onClick={() => changeLanguage('zh-cn')}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    language === 'zh-cn' ? 'text-yellow-300 font-medium' : 'text-gray-300'
                  } hover:bg-gray-800/50 rounded-b-md flex items-center justify-between`}
                >
                  <span>中文</span>
                  {language === 'zh-cn' && <span className="text-xs">✓</span>}
                </button>
              </div>
            )}
          </div>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-300 hover:text-yellow-300 transition-colors p-1"
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
        <div className="md:hidden fixed top-16 left-0 right-0 z-[100] bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-xl">
          <nav className="flex flex-col p-4 space-y-3">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-yellow-300 transition-colors font-medium py-2 px-4 hover:bg-gray-800/50 rounded-md w-full text-left text-sm"
            >
              {isLoaded('Header') ? t('home', 'Header') : 'Home'}
            </button>
            <button
              onClick={() => {
                navigate(`/blog/${language}`);
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-yellow-300 transition-colors font-medium py-2 px-4 hover:bg-gray-800/50 rounded-md w-full text-left text-sm"
            >
              {isLoaded('Header') ? t('blog', 'Header') : 'Blog'}
            </button>
            <button
              onClick={() => {
                navigate('/docs');
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-yellow-300 transition-colors font-medium py-2 px-4 hover:bg-gray-800/50 rounded-md w-full text-left text-sm"
            >
              {isLoaded('Header') ? t('docs', 'Header') : 'Docs'}
            </button>
            
            {/* Mobile Language Switcher */}
            <div className="border-t border-gray-800 mt-3 pt-3">
              <p className="text-gray-400 text-xs px-4 mb-2">{isLoaded('Header') ? t('language', 'Header') : 'Language'}</p>
              <button
                onClick={() => {
                  changeLanguage('en-us');
                  setMobileMenuOpen(false);
                }}
                className={`text-sm py-2 px-4 w-full text-left ${
                  language === 'en-us' ? 'text-yellow-300 font-medium' : 'text-gray-300'
                } hover:bg-gray-800/50 rounded-md flex items-center justify-between`}
              >
                <span>English</span>
                {language === 'en-us' && <span className="text-xs">✓</span>}
              </button>
              <button
                onClick={() => {
                  changeLanguage('zh-cn');
                  setMobileMenuOpen(false);
                }}
                className={`text-sm py-2 px-4 w-full text-left ${
                  language === 'zh-cn' ? 'text-yellow-300 font-medium' : 'text-gray-300'
                } hover:bg-gray-800/50 rounded-md flex items-center justify-between mt-1`}
              >
                <span>中文</span>
                {language === 'zh-cn' && <span className="text-xs">✓</span>}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}