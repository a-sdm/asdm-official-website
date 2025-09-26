import React, { useEffect } from 'react';
import { Home, X, FileText, ChevronRight } from 'lucide-react';
import { DocFile, DocMenuItem } from './types';
import MenuTreeView from './MenuTreeView';
import { useTheme } from '../../context/ThemeContext';
import { useDocsReaderLanguage } from './context/DocsReaderLanguageContext';

interface DocSidebarProps {
  docs: DocFile[];
  menuTree: DocMenuItem[];
  currentDoc: DocFile | null;
  onDocumentSelect: (doc: DocFile) => void;
  expandedItems: Set<string>;
  setExpandedItems: React.Dispatch<React.SetStateAction<Set<string>>>;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onNavigateHome: () => void;
}

const DocSidebar: React.FC<DocSidebarProps> = ({
  docs,
  menuTree,
  currentDoc,
  onDocumentSelect,
  expandedItems,
  setExpandedItems,
  sidebarOpen,
  setSidebarOpen,
  onNavigateHome
}) => {
  const { theme } = useTheme();
  const { t, loadTranslations, isLoaded } = useDocsReaderLanguage();
  
  // Load translations for this component
  useEffect(() => {
    if (!isLoaded('DocSidebar')) {
      loadTranslations('DocSidebar');
    }
  }, [loadTranslations, isLoaded]);
  return (
    <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 flex flex-col overflow-hidden h-full sticky top-0 sidebar theme-aware theme-transition ${
      theme === 'dark' 
        ? 'bg-gray-900 border-r border-yellow-400/20' 
        : 'bg-gray-100 border-r border-yellow-400/10'
    }`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-yellow-400/20' : 'border-yellow-400/10'}`}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onNavigateHome}
            className={`flex items-center space-x-2 hover:text-yellow-400 transition-all transform hover:scale-105 hover:-translate-x-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">{t('backToHome', 'DocSidebar')}</span>
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`p-2 transform hover:scale-110 hover:rotate-90 transition-all duration-300 ${
              theme === 'dark' 
                ? 'hover:bg-gray-800 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
            aria-label={t('closeSidebar', 'DocSidebar')}
            title={t('closeSidebar', 'DocSidebar')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{t('documentation', 'DocSidebar')}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          {menuTree.length > 0 ? (
            <MenuTreeView 
              menuItems={menuTree} 
              docs={docs} 
              currentDoc={currentDoc} 
              setCurrentDoc={onDocumentSelect}
              expandedItems={expandedItems}
              setExpandedItems={setExpandedItems}
            />
          ) : (
            docs.map((doc, index) => (
              <button
                key={index}
                onClick={() => onDocumentSelect(doc)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left transition-all transform hover:scale-105 hover:-translate-x-1 ${
                  currentDoc?.path === doc.path
                    ? 'bg-gradient-to-r from-yellow-400/20 to-red-500/20 text-yellow-400 border-r-4 border-yellow-400 shadow-lg shadow-yellow-400/20'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:border-r-2 hover:border-yellow-400/50'
                      : 'text-gray-600 hover:bg-gray-200 hover:border-r-2 hover:border-yellow-400/50'
                }`}
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{doc.title}</span>
                <ChevronRight className={`w-3 h-3 ml-auto ${currentDoc?.path === doc.path ? 'text-yellow-400' : 'text-gray-500'}`} />
              </button>
            ))
          )}
        </nav>
      </div>
    </div>
  );
};

export default DocSidebar;