import React, { useState, useRef, useEffect } from 'react';
import { Brain, Menu, X, Book, ChevronLeft, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocFile, DocMenuItem } from './types';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ right: false });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDocsDropdownOpen(false);
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
                      className="p-1 text-gray-400 hover:text-yellow-400 focus:outline-none rounded-full hover:bg-gray-800"
                      aria-label={isExpanded ? "Collapse section" : "Expand section"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </button>
                  ) : level > 0 ? (
                    <div className="w-1 h-1 rounded-full bg-gray-600"></div>
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
                      ? 'bg-gradient-to-r from-yellow-400/20 to-red-500/20 text-yellow-400'
                      : 'text-gray-300 hover:bg-gray-800'
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
    <header className="px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm bg-black/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Sidebar toggle button - desktop only */}
          <button
            onClick={toggleSidebar}
            className="hidden md:block mr-2 text-gray-300 hover:text-yellow-300 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Brain className="w-8 h-8 text-yellow-300" />
            <span className="text-xl font-bold text-white">ASDM</span>
          </button>
          
          <div className="hidden md:flex items-center">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
            <Book className="w-5 h-5 text-gray-300 ml-2" />
            <span className="ml-2 text-gray-300 font-medium text-sm truncate max-w-[200px]">
              {title}
            </span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-yellow-300 transition-colors font-medium text-sm flex items-center pb-1"
          >
            Home
          </button>
          
          {/* Docs dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              ref={dropdownButtonRef}
              onClick={toggleDocsDropdown}
              className="flex items-center space-x-1 text-yellow-300 transition-colors font-medium text-sm border-b border-yellow-300 pb-1"
            >
              <span>Docs</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${docsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {docsDropdownOpen && menuTree.length > 0 && (
              <div 
                className={`absolute top-full mt-2 w-64 max-h-[70vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-md shadow-lg z-50 ${
                  dropdownPosition.right ? 'right-0' : 'left-0'
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
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate('/docs');
                  setMobileMenuOpen(false);
                }}
                className="text-yellow-300 transition-colors font-medium py-2 px-4 hover:bg-gray-800/50 rounded-md w-full text-left text-xs border-l-2 border-yellow-300"
              >
                Docs
              </button>
              
              {/* Mobile docs menu */}
              {menuTree.length > 0 && (
                <div className="ml-4 pl-2 border-l border-gray-700">
                  {renderMenuItems(menuTree, 0, true)}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}