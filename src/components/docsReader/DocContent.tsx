import React, { useCallback } from 'react';
import { Menu, ChevronRight, Home } from 'lucide-react';
import { DocFile } from './types';
import MarkdownRenderer from './MarkdownRenderer';

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
      <div className="bg-gray-900 border-b border-yellow-400/20 px-4 sm:px-6 py-3 sm:py-4">
        {/* Breadcrumbs - Hide on small screens */}
        {currentDoc?.path && (
          <div className="hidden sm:flex items-center text-sm text-gray-400 mb-3">
            <Home className="w-3 h-3 mr-1" />
            <span 
              className="hover:text-yellow-400 cursor-pointer transition-colors"
              onClick={() => onNavigate && onNavigate('')}
            >
              Docs
            </span>
            {currentDoc.path.split('/').filter(Boolean).map((part, index, array) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-3 h-3 mx-1" />
                <span 
                  className={`${index === array.length - 1 ? 'text-yellow-400' : 'hover:text-yellow-400 cursor-pointer transition-colors'} truncate max-w-[100px] md:max-w-none`}
                  onClick={() => index < array.length - 1 && handleBreadcrumbClick(index)}
                  role={index < array.length - 1 ? "button" : undefined}
                  tabIndex={index < array.length - 1 ? 0 : undefined}
                >
                  {part.replace(/-/g, ' ').replace(/^_index$/, 'Overview')}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 sm:p-2 hover:bg-gray-800 text-gray-300 hover:text-white transform hover:scale-110 hover:rotate-180 transition-all duration-300"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="overflow-hidden">
              <h1 className="text-lg sm:text-xl font-semibold text-white truncate">
                {currentDoc?.title || 'ASDM Documentation'}
              </h1>
              {currentDoc?.description && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">{currentDoc.description}</p>
              )}
            </div>
          </div>
          
          {currentDoc?.tags && currentDoc.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
              {currentDoc.tags.map((tag, index) => (
                <span key={index} className="px-2 py-0.5 sm:py-1 bg-gray-800 text-xs text-gray-300 rounded-full">
                  {tag.replace(/^"(.*)"$/, '$1')}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-black">
        {contentLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-yellow-400 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-400">Loading document content...</p>
            </div>
          </div>
        ) : currentDoc && currentDoc.content ? (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <MarkdownRenderer content={currentDoc.content} />
            {(currentDoc.lastUpdated || currentDoc.author) && (
              <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-800 text-xs sm:text-sm text-gray-400">
                {currentDoc.lastUpdated && (
                  <p>Last updated: {currentDoc.lastUpdated}</p>
                )}
                {currentDoc.author && (
                  <p>Author: {currentDoc.author}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Select a document to view its content</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocContent;