import React, { useCallback, useEffect } from 'react';
import { Menu, ChevronRight, Home } from 'lucide-react';
import { DocFile } from './types';
import MarkdownRenderer from './MarkdownRenderer';
import { useTheme } from '../../context/ThemeContext';
import { useDocsReaderLanguage } from './context/DocsReaderLanguageContext';

interface DocContentProps {
  currentDoc: DocFile | null;
  contentLoading: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onNavigate?: (path: string) => void;
}

const DocContent: React.FC<DocContentProps> = ({
  currentDoc,
  contentLoading,
  sidebarOpen,
  setSidebarOpen,
  onNavigate
}) => {
  const { theme } = useTheme();
  const { t, loadTranslations, isLoaded, language } = useDocsReaderLanguage();
  
  // Load translations for this component
  useEffect(() => {
    loadTranslations('DocContent');
  }, [loadTranslations, language]);
  
  // Function to handle breadcrumb navigation
  const handleBreadcrumbClick = useCallback((index: number) => {
    if (!currentDoc?.path || !onNavigate) return;
    
    const pathParts = currentDoc.path.split('/').filter(Boolean);
    // Navigate to the path up to the clicked breadcrumb
    let targetPath = pathParts.slice(0, index + 1).join('/');
    
    // Check if we need to add _index.md for directory navigation
    if (!targetPath.endsWith('.md')) {
      targetPath = `${targetPath}/_index.md`;
    }
    
    onNavigate(targetPath);
  }, [currentDoc, onNavigate]);
  return (
    <div className="flex-1 flex flex-col">
      {/* Content Header */}
      <div className={`border-b px-4 sm:px-6 py-3 sm:py-4 w-full overflow-hidden content theme-aware theme-transition ${
        theme === 'dark' 
          ? 'bg-gray-900 border-yellow-400/20' 
          : 'bg-gray-100 border-yellow-400/10'
      }`}>
        {/* Breadcrumbs - Hide on small screens */}
        {currentDoc?.path && (
          <div className={`hidden sm:flex items-center text-sm mb-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Home className="w-3 h-3 mr-1" />
            <span 
              className="hover:text-yellow-400 cursor-pointer transition-colors"
              onClick={() => onNavigate && onNavigate('')}
            >
              {t('docs', 'DocContent')}
            </span>
            {currentDoc.path.split('/').filter(Boolean).map((part, index, array) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-3 h-3 mx-1" />
                <span 
                  className={`${index === array.length - 1 ? 'text-yellow-400' : 'hover:text-yellow-400 cursor-pointer transition-colors'} break-all max-w-[100px] md:max-w-none`}
                  onClick={() => index < array.length - 1 && handleBreadcrumbClick(index)}
                  role={index < array.length - 1 ? "button" : undefined}
                  tabIndex={index < array.length - 1 ? 0 : undefined}
                >
                  {part.replace(/-/g, ' ').replace(/^_index$/, t('overview', 'DocContent'))}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
        
        <div className="flex flex-col w-full overflow-hidden">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            {/* Sidebar toggle button removed */}
            <div className="overflow-hidden min-w-0 flex-1">
              <h1 className={`text-lg sm:text-xl font-semibold break-words ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {currentDoc?.title || t('asdmDocumentation', 'DocContent')}
              </h1>
              {currentDoc?.description && (
                <p className={`text-xs sm:text-sm mt-1 break-words ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>{currentDoc.description}</p>
              )}
            </div>
          </div>
          
          {currentDoc?.tags && currentDoc.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-3 overflow-hidden">
              {currentDoc.tags.map((tag, index) => (
                <span key={index} className={`px-2 py-0.5 sm:py-1 text-xs rounded-full break-words ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-gray-300' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {tag.replace(/^"(.*)"$/, '$1')}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className={`flex-1 overflow-y-auto w-full ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        {contentLoading ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-yellow-400 mx-auto mb-3 sm:mb-4"></div>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('loadingDocumentContent', 'DocContent')}</p>
            </div>
          </div>
        ) : currentDoc && currentDoc.content ? (
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8">
            <div className="w-full">
              <MarkdownRenderer content={currentDoc.content} />
              {(currentDoc.lastUpdated || currentDoc.author) && (
                <div className={`mt-6 sm:mt-8 pt-3 sm:pt-4 border-t text-xs sm:text-sm ${
                  theme === 'dark' 
                    ? 'border-gray-800 text-gray-400' 
                    : 'border-gray-200 text-gray-500'
                }`}>
                  {currentDoc.lastUpdated && (
                    <p>{t('lastUpdated', 'DocContent')}{currentDoc.lastUpdated}</p>
                  )}
                  {currentDoc.author && (
                    <p>{t('author', 'DocContent')}{currentDoc.author}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('selectDocument', 'DocContent')}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocContent;