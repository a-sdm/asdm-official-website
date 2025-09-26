import React, { useState, useRef, useEffect } from 'react';
import { Brain, Menu, X, Book, ChevronLeft, ChevronDown, ChevronRight, FileText, Sun, Moon, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocFile, DocMenuItem } from './types';
import { useTheme } from '../../context/ThemeContext';
import { useDocsReaderLanguage, LanguageCode } from './context/DocsReaderLanguageContext';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title?: string;
  docs?: DocFile[];
  menuTree?: DocMenuItem[];
  currentDoc?: DocFile | null;
  expandedItems?: Set<string>;
  setExpandedItems?: React.Dispatch<React.SetStateAction<Set<string>>>;
  onDocumentSelect?: (doc: DocFile) => void;
}

export default function Header({ 
  sidebarOpen, 
  setSidebarOpen, 
  title = 'Documentation',
  docs = [],
  menuTree = [],
  currentDoc = null,
  expandedItems = new Set<string>(),
  setExpandedItems = () => {},
  onDocumentSelect = () => {}
}: HeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, loadTranslations, isLoaded } = useDocsReaderLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ right: false });
  
  // Load header translations
  useEffect(() => {
    loadTranslations('Header');
  }, [language, loadTranslations]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDocsDropdown = () => {
    // Calculate dropdown position before opening
    if (!docsDropdownOpen && dropdownButtonRef.current) {
      const buttonRect = dropdownButtonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const spaceOnRight = viewportWidth - buttonRect.right;
      
      // If there's not enough space on the right (less than 300px), position dropdown to the right
      setDropdownPosition({ right: spaceOnRight < 300 });
    }
    
    setDocsDropdownOpen(!docsDropdownOpen);
    // Close language menu if open
    if (languageMenuOpen) setLanguageMenuOpen(false);
  };
  
  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
    // Close docs dropdown if open
    if (docsDropdownOpen) setDocsDropdownOpen(false);
  };

  const changeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    setLanguageMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDocsDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find doc by path
  const findDocByPath = (path: string): DocFile | undefined => {
    return docs.find(doc => doc.path === path);
  };

  // Toggle expanded state for menu items
  const toggleExpanded = (path: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(path)) {
      newExpandedItems.delete(path);
    } else {
      newExpandedItems.add(path);
    }
    setExpandedItems(newExpandedItems);
  };

  // Render menu items recursively
  const renderMenuItems = (items: DocMenuItem[], level = 0, isMobile = false) => {
    return (
      <div className="space-y-1">
        {items.map((item, index) => {
          const doc = findDocByPath(item.path);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = hasChildren && expandedItems.has(item.path);
          
          if (!doc) return null;
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center">
                {/* Indentation based on level */}
                {level > 0 && (
                  <div className="w-4" style={{ marginLeft: `${level * 8}px` }}></div>
                )}
                
                {/* Expand/collapse button */}
                <div className="w-5 flex-shrink-0 flex items-center justify-center">
                  {hasChildren ? (
                    <button 
                      onClick={(e) => toggleExpanded(item.path, e)}
                      className={`p-1 focus:outline-none rounded-full ${
                        theme === 'dark' 
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-yellow-400' 
                          : 'text-gray-500 hover:bg-gray-200 hover:text-blue-600'
                      }`}
                      aria-label={isExpanded 
                        ? (isLoaded('Header') ? t('collapseSection', 'Header') : "Collapse section") 
                        : (isLoaded('Header') ? t('expandSection', 'Header') : "Expand section")}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </button>
                  ) : level > 0 ? (
                    <div className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                  ) : null}
                </div>
                
                {/* Document link */}
                <button
                  onClick={() => {
                    onDocumentSelect(doc);
                    setDocsDropdownOpen(false);
                    if (isMobile) {
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`flex-1 flex items-center space-x-2 px-2 py-1 text-left rounded-md transition-colors ${
                    currentDoc?.path === doc.path
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-yellow-400/20 to-red-500/20 text-yellow-400'
                        : 'bg-gradient-to-r from-blue-400/20 to-blue-500/20 text-blue-600'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-200'
                  } ${hasChildren ? 'font-medium' : ''}`}
                >
                  <div className="w-4 flex-shrink-0 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{item["menu-title"] || doc.title}</span>
                </button>
              </div>
              
              {/* Render children if expanded */}
              {hasChildren && isExpanded && item.children && (
                renderMenuItems(item.children, level + 1, isMobile)
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <header className={`px-6 py-4 border-b backdrop-blur-sm sticky top-0 z-[1000] theme-aware theme-transition ${
        theme === 'dark' 
          ? 'border-gray-800/50 bg-black/20' 
          : 'border-gray-200/50 bg-white/80'
      }`}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Sidebar toggle button - desktop only */}
            <button
              onClick={toggleSidebar}
              className={`hidden md:block mr-2 transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-yellow-300' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              aria-label={isLoaded('Header') ? t('toggleSidebar', 'Header') : "Toggle sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <Brain className="w-8 h-8 text-yellow-300" />
              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>ASDM</span>
            </button>
            
            <div className="hidden md:flex items-center">
              <ChevronLeft className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <Book className={`w-5 h-5 ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
              <span className={`ml-2 font-medium text-sm truncate max-w-[200px] ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {title}
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className={`transition-colors font-medium text-sm flex items-center pb-1 ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-yellow-300' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {isLoaded('Header') ? t('home', 'Header') : 'Home'}
            </button>
            
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className={`transition-colors font-medium text-sm flex items-center pb-1 ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-yellow-300' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              aria-label={theme === 'dark' 
                ? (isLoaded('Header') ? t('lightMode', 'Header') : 'Switch to light mode') 
                : (isLoaded('Header') ? t('darkMode', 'Header') : 'Switch to dark mode')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 mr-1" />
              ) : (
                <Moon className="w-4 h-4 mr-1" />
              )}
              <span>{theme === 'dark' 
                  ? (isLoaded('Header') ? t('lightMode', 'Header') : 'Light Mode') 
                  : (isLoaded('Header') ? t('darkMode', 'Header') : 'Dark Mode')}
                </span>
            </button>
            
            {/* Language Switcher */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={toggleLanguageMenu}
                className={`flex items-center space-x-2 transition-colors font-medium text-sm ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-yellow-300' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                aria-label={isLoaded('Header') ? t('changeLanguage', 'Header') : "Change language"}
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'en-us' ? 'English' : '中文'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Language Dropdown */}
              {languageMenuOpen && (
                <div 
                  className={`absolute top-full right-0 mt-2 w-32 rounded-md shadow-lg z-50 theme-aware theme-transition ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border border-gray-800' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => changeLanguage('en-us')}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      language === 'en-us' 
                        ? theme === 'dark' ? 'text-yellow-300' : 'text-blue-600'
                        : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    } hover:bg-gray-800/50 rounded-t-md`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('zh-cn')}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      language === 'zh-cn' 
                        ? theme === 'dark' ? 'text-yellow-300' : 'text-blue-600'
                        : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    } hover:bg-gray-800/50 rounded-b-md`}
                  >
                    中文
                  </button>
                </div>
              )}
            </div>
            
            {/* Docs dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                ref={dropdownButtonRef}
                onClick={toggleDocsDropdown}
                className={`flex items-center space-x-1 transition-colors font-medium text-sm border-b pb-1 ${
                  theme === 'dark' 
                    ? 'text-yellow-300 border-yellow-300' 
                    : 'text-blue-600 border-blue-500'
                }`}
              >
                <span>{isLoaded('Header') ? t('docs', 'Header') : 'Docs'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${docsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {docsDropdownOpen && menuTree.length > 0 && (
                <div 
                  className={`absolute top-full mt-2 w-64 max-h-[70vh] overflow-y-auto rounded-md shadow-lg z-50 dropdown theme-aware theme-transition ${
                    dropdownPosition.right ? 'right-0' : 'left-0'
                  } ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border border-gray-800' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="p-2">
                    {renderMenuItems(menuTree)}
                  </div>
                </div>
              )}
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden transition-colors ${
              theme === 'dark' 
                ? 'text-gray-300 hover:text-yellow-300' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Separate from header */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[2000] bg-black bg-opacity-50">
          <div className={`fixed top-16 left-0 right-0 bottom-0 z-[2001] overflow-y-auto ${
            theme === 'dark' 
              ? 'bg-gray-900 text-white' 
              : 'bg-white text-gray-800'
          }`}>
            
            <div className="p-4 pt-10 space-y-4">
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-md ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {isLoaded('Header') ? t('home', 'Header') : 'Home'}
              </button>
              
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-md flex items-center ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-5 h-5 mr-3" />
                    <span>{isLoaded('Header') ? t('lightMode', 'Header') : 'Light Mode'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 mr-3" />
                    <span>{isLoaded('Header') ? t('darkMode', 'Header') : 'Dark Mode'}</span>
                  </>
                )}
              </button>
              
              {/* Mobile Language Switcher */}
              <div className={`p-3 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800/50' 
                  : 'bg-gray-100'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  theme === 'dark' 
                    ? 'text-yellow-300' 
                    : 'text-blue-600'
                }`}>
                  {isLoaded('Header') ? t('language', 'Header') : 'Language'}
                </h3>
                
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      changeLanguage('en-us');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-md flex items-center ${
                      language === 'en-us'
                        ? theme === 'dark' ? 'text-yellow-300' : 'text-blue-600'
                        : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    } ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-800' 
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    <span>English</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      changeLanguage('zh-cn');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-md flex items-center ${
                      language === 'zh-cn'
                        ? theme === 'dark' ? 'text-yellow-300' : 'text-blue-600'
                        : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    } ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-800' 
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    <span>中文</span>
                  </button>
                </div>
              </div>
              
              <div className={`p-3 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800/50' 
                  : 'bg-gray-100'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  theme === 'dark' 
                    ? 'text-yellow-300' 
                    : 'text-blue-600'
                }`}>
                  {isLoaded('Header') ? t('documentation', 'Header') : 'Documentation'}
                </h3>
                
                {menuTree.length > 0 ? (
                  <div className="pl-2 space-y-1">
                    {renderMenuItems(menuTree, 0, true)}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">{isLoaded('Header') ? t('noDocsAvailable', 'Header') : 'No documentation available'}</p>
                )}
              </div>
              
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-center p-3 mt-4 rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {isLoaded('Header') ? t('closeMenu', 'Header') : 'Close Menu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}