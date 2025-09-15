import React from 'react';
import { FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { DocFile, DocMenuItem } from './types';

interface MenuTreeViewProps {
  menuItems: DocMenuItem[];
  docs: DocFile[];
  currentDoc: DocFile | null;
  setCurrentDoc: (doc: DocFile) => void;
  expandedItems: Set<string>;
  setExpandedItems: React.Dispatch<React.SetStateAction<Set<string>>>;
  level?: number;
}

const MenuTreeView: React.FC<MenuTreeViewProps> = ({ 
  menuItems, 
  docs, 
  currentDoc, 
  setCurrentDoc, 
  expandedItems, 
  setExpandedItems,
  level = 0 
}) => {
  // Find doc by path
  const findDocByPath = (path: string): DocFile | undefined => {
    return docs.find(doc => doc.path === path);
  };

  // Toggle expanded state
  const toggleExpanded = (path: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(path)) {
      newExpandedItems.delete(path);
    } else {
      newExpandedItems.add(path);
    }
    setExpandedItems(newExpandedItems);
  };

  return (
    <div className="space-y-1">
      {menuItems.map((item, index) => {
        const doc = findDocByPath(item.path);
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = hasChildren && expandedItems.has(item.path);
        
        if (!doc) return null;
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center">
              {/* Always reserve space for expand/collapse button to ensure alignment */}
              <div className="w-5 flex-shrink-0 flex items-center justify-center">
                {hasChildren ? (
                  <button 
                    onClick={() => toggleExpanded(item.path)}
                    className="p-1 text-gray-400 hover:text-yellow-400 focus:outline-none rounded-full hover:bg-gray-800"
                    aria-label={isExpanded ? "Collapse section" : "Expand section"}
                    title={isExpanded ? "Collapse section" : "Expand section"}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ) : level > 0 ? (
                  <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                ) : null}
              </div>
              <button
                onClick={() => setCurrentDoc(doc)}
                className={`flex-1 flex items-center space-x-2 px-2 py-1.5 text-left rounded-md transition-colors ${
                  currentDoc?.path === doc.path
                    ? 'bg-gradient-to-r from-yellow-400/20 to-red-500/20 text-yellow-400 border-r-4 border-yellow-400 shadow-lg shadow-yellow-400/20'
                    : 'text-gray-300 hover:bg-gray-800 hover:border-r-2 hover:border-yellow-400/50'
                } ${hasChildren ? 'font-medium' : ''}`}
              >
                <div className="w-4 flex-shrink-0 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-sm">{item["menu-title"] || doc.title}</span>
                {hasChildren && !isExpanded && item.children && (
                  <span className="ml-1 text-xs text-gray-500">(+{item.children.length})</span>
                )}
              </button>
            </div>
            
            {hasChildren && isExpanded && item.children && (
              <div className="border-l border-gray-700 ml-4 mt-1">
                <MenuTreeView
                  menuItems={item.children}
                  docs={docs}
                  currentDoc={currentDoc}
                  setCurrentDoc={setCurrentDoc}
                  expandedItems={expandedItems}
                  setExpandedItems={setExpandedItems}
                  level={level + 1}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MenuTreeView;