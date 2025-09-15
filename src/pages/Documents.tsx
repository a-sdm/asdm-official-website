import React, { useState, useEffect } from 'react';
import { Home, Menu, X, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';

interface DocFile {
  name: string;
  path: string;
  content?: string; // Content is optional now, will be loaded on demand
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  lastUpdated?: string;
  created?: string;
  updated?: string;
  author?: string;
  weight?: number;
}

interface DocMenuItem {
  path: string;
  "menu-title"?: string;
  children?: DocMenuItem[];
}

interface SiteTree {
  docRoot: string;
  documents: Array<{
    title: string;
    path: string;
    description?: string;
    category?: string;
    tags?: string[];
    lastUpdated?: string;
    created?: string;
    updated?: string;
    author?: string;
    weight?: number;
  }>;
  "menu-tree"?: DocMenuItem[];
}

// Menu Tree View Component
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

export default function Documents() {
  const navigate = useNavigate();
  const location = useLocation();
  const [docs, setDocs] = useState<DocFile[]>([]);
  const [currentDoc, setCurrentDoc] = useState<DocFile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuTree, setMenuTree] = useState<DocMenuItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [docRoot, setDocRoot] = useState<string>('/docs/content');
  
  // Helper function to get route path from document path
  const getRoutePathFromDocPath = (docPath: string): string => {
    // If the path ends with _index.md, remove the filename and just use the directory
    if (docPath.endsWith('/_index.md') || docPath.endsWith('\\_index.md')) {
      const parts = docPath.split('/');
      parts.pop(); // Remove _index.md
      return parts.join('/');
    }
    
    // Otherwise, remove the .md extension
    return docPath.replace(/\.md$/, '');
  };
  
  // Helper function to get document path from route path
  const getDocPathFromRoutePath = (routePath: string): string => {
    // If the path doesn't have an extension, check if it's a directory (might need _index.md)
    if (!routePath.endsWith('.md')) {
      // Try with _index.md first
      return `${routePath}/_index.md`;
    }
    return routePath;
  };
  
  // Find document by route path
  const findDocByRoutePath = (routePath: string, docsList: DocFile[] = docs): DocFile | undefined => {
    // Remove leading /docs/ if present
    const normalizedPath = routePath.replace(/^\/docs\//, '');
    
    if (!normalizedPath) {
      // If we're at /docs/, find the first document in the menu tree
      if (menuTree.length > 0) {
        return docsList.find(doc => doc.path === menuTree[0].path);
      }
      return docsList[0]; // Fallback to first doc
    }
    
    // Try to find exact match first
    let doc = docsList.find(doc => {
      const docRoutePath = getRoutePathFromDocPath(doc.path);
      return docRoutePath === normalizedPath;
    });
    
    // If not found, try with _index.md
    if (!doc) {
      doc = docsList.find(doc => doc.path === `${normalizedPath}/_index.md`);
    }
    
    // If still not found, try without _index.md
    if (!doc && normalizedPath.endsWith('/_index')) {
      const pathWithoutIndex = normalizedPath.replace('/_index', '');
      doc = docsList.find(doc => {
        const docRoutePath = getRoutePathFromDocPath(doc.path);
        return docRoutePath === pathWithoutIndex;
      });
    }
    
    return doc;
  };

  // Function to load document content
  const loadDocumentContent = async (doc: DocFile): Promise<DocFile> => {
    // If content is already loaded, return the doc as is
    if (doc.content) {
      return doc;
    }
    
    try {
      setContentLoading(true);
      
      const response = await fetch(`${docRoot}/${doc.path}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${doc.path}: ${response.status}`);
      }
      
      const content = await response.text();
      const contentWithoutMetadata = removeMetadata(content);
      
      // Create a new doc object with the content
      const updatedDoc = { ...doc, content: contentWithoutMetadata };
      
      // Update the doc in the docs array
      setDocs(prevDocs => 
        prevDocs.map(d => d.path === doc.path ? updatedDoc : d)
      );
      
      return updatedDoc;
    } catch (err) {
      console.error(`Error loading document content for ${doc.path}:`, err);
      return doc; // Return the original doc without content
    } finally {
      setContentLoading(false);
    }
  };

  // Load site-tree.yml and initialize document metadata
  useEffect(() => {
    const loadSiteTree = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load site-tree.yml
        const siteTreeResponse = await fetch('/docs/site-tree.yml');
        if (!siteTreeResponse.ok) {
          throw new Error('Failed to load site-tree.yml');
        }
        const siteTreeText = await siteTreeResponse.text();
        
        // Parse YAML
        const yamlData = parseYaml(siteTreeText);
        const siteTree: SiteTree = yamlData;
        
        // Set document root
        setDocRoot(siteTree.docRoot);

        // Set menu tree if available
        if (siteTree["menu-tree"]) {
          setMenuTree(siteTree["menu-tree"] || []);
        }

        // Create document metadata without loading content
        const docsMetadata: DocFile[] = siteTree.documents.map(doc => {
          // Extract name from filename (remove directory and .md extension)
          const fileName = doc.path.split('/').pop() || doc.path;
          const name = fileName.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          return {
            name,
            path: doc.path,
            title: doc.title,
            description: doc.description,
            category: doc.category,
            tags: doc.tags,
            lastUpdated: doc.lastUpdated,
            created: doc.created,
            updated: doc.updated,
            author: doc.author,
            weight: doc.weight
          };
        });

        // Sort docs by weight if available, then by title
        docsMetadata.sort((a, b) => {
          if (a.weight !== undefined && b.weight !== undefined) {
            return a.weight - b.weight;
          }
          // Add null checks to prevent errors if title is missing
          if (!a.title) return -1;
          if (!b.title) return 1;
          return a.title.localeCompare(b.title);
        });

        setDocs(docsMetadata);
        
        // Now that we have the metadata, load the current document based on URL
        const pathSegments = location.pathname.split('/').filter(Boolean);
        let docToLoad: DocFile | undefined;
        
        if (pathSegments.length <= 1) {
          // We're at /docs/ or /, show the first document in the menu tree
          if (siteTree["menu-tree"] && siteTree["menu-tree"].length > 0) {
            const firstMenuPath = siteTree["menu-tree"][0].path;
            docToLoad = docsMetadata.find(doc => doc.path === firstMenuPath);
          }
          
          if (!docToLoad) {
            docToLoad = docsMetadata[0]; // Fallback to first doc
          }
        } else {
          // We have a specific document path in the URL
          const docPath = pathSegments.slice(1).join('/');
          docToLoad = findDocByRoutePath(docPath, docsMetadata);
          
          if (!docToLoad) {
            docToLoad = docsMetadata[0]; // Fallback to first doc
          }
          
          // Expand the menu tree to show the current document
          const expandParentPaths = new Set<string>();
          
          // Function to recursively find and expand parent menu items
          const findAndExpandParents = (items: DocMenuItem[], targetPath: string): boolean => {
            for (const item of items) {
              if (item.path === targetPath) {
                return true;
              }
              
              if (item.children && item.children.length > 0) {
                if (findAndExpandParents(item.children, targetPath)) {
                  expandParentPaths.add(item.path);
                  return true;
                }
              }
            }
            return false;
          };
          
          findAndExpandParents(siteTree["menu-tree"] || [], docToLoad.path);
          setExpandedItems(expandParentPaths);
        }
        
        // Load the content for the selected document
        if (docToLoad) {
          const docWithContent = await loadDocumentContent(docToLoad);
          setCurrentDoc(docWithContent);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load documentation');
        console.error('Error loading documentation:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSiteTree();
  }, []);
  
  // Handle URL changes to load the appropriate document
  useEffect(() => {
    if (docs.length === 0) return; // Wait for docs metadata to be loaded
    
    const loadDocumentFromUrl = async () => {
      try {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        
        if (pathSegments.length <= 1) {
          // We're at /docs/ or /, show the first document in the menu tree
          if (menuTree.length > 0) {
            const firstMenuPath = menuTree[0].path;
            const docToLoad = docs.find(doc => doc.path === firstMenuPath);
            if (docToLoad) {
              const docWithContent = await loadDocumentContent(docToLoad);
              setCurrentDoc(docWithContent);
            }
          }
        } else {
          // We have a specific document path in the URL
          const docPath = pathSegments.slice(1).join('/');
          const docToLoad = findDocByRoutePath(docPath);
          
          if (docToLoad) {
            const docWithContent = await loadDocumentContent(docToLoad);
            setCurrentDoc(docWithContent);
            
            // Expand the menu tree to show the current document
            const expandParentPaths = new Set<string>();
            
            // Function to recursively find and expand parent menu items
            const findAndExpandParents = (items: DocMenuItem[], targetPath: string): boolean => {
              for (const item of items) {
                if (item.path === targetPath) {
                  return true;
                }
                
                if (item.children && item.children.length > 0) {
                  if (findAndExpandParents(item.children, targetPath)) {
                    expandParentPaths.add(item.path);
                    return true;
                  }
                }
              }
              return false;
            };
            
            findAndExpandParents(menuTree, docToLoad.path);
            setExpandedItems(expandParentPaths);
          }
        }
      } catch (err) {
        console.error('Error loading document from URL:', err);
      }
    };
    
    loadDocumentFromUrl();
  }, [location.pathname, docs.length]);

  // Function to parse YAML
  const parseYaml = (yamlText: string): SiteTree => {
    const lines = yamlText.split('\n');
    const result: Record<string, unknown> = {
      docRoot: '',
      documents: []
    };
    const documentArray: Array<Record<string, unknown>> = [];
    let currentObject: Record<string, unknown> | null = null;
    let isInArray = false;
    let currentSection = '';
    
    // For menu tree parsing
    const menuTree: DocMenuItem[] = [];
    let currentParent: DocMenuItem | null = null;
    let inChildrenSection = false;
    let lastChildItem: DocMenuItem | null = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;

      // Handle menu-tree section
      if (trimmedLine === 'menu-tree:') {
        currentSection = 'menu-tree';
        continue;
      }

      if (currentSection === 'menu-tree') {
        // Handle top-level menu items
        if (line.startsWith('  - path:')) {
          const path = trimmedLine.substring(7).trim();
          currentParent = { path };
          menuTree.push(currentParent);
          inChildrenSection = false;
          continue;
        }
        
        // Handle menu-title for top-level items
        if (line.startsWith('    menu-title:')) {
          if (currentParent) {
            // Extract the menu title value after the colon, removing quotes if present
            const colonIndex = trimmedLine.indexOf(':');
            if (colonIndex !== -1) {
              let menuTitle = trimmedLine.substring(colonIndex + 1).trim();
              // Remove surrounding quotes if present
              menuTitle = menuTitle.replace(/^"(.*)"$/, '$1');
              currentParent["menu-title"] = menuTitle;
            }
          }
          continue;
        }
        
        // Handle children section
        if (line.startsWith('    children:')) {
          inChildrenSection = true;
          if (currentParent && !currentParent.children) {
            currentParent.children = [];
          }
          continue;
        }
        
        // Handle child items
        if (inChildrenSection && line.startsWith('      - path:')) {
          const path = trimmedLine.substring(7).trim();
          if (currentParent && currentParent.children) {
            lastChildItem = { path };
            currentParent.children.push(lastChildItem);
          }
          continue;
        }
        
        // Handle menu-title for child items
        if (inChildrenSection && line.startsWith('        menu-title:')) {
          if (lastChildItem) {
            // Extract the menu title value after the colon, removing quotes if present
            const colonIndex = trimmedLine.indexOf(':');
            if (colonIndex !== -1) {
              let menuTitle = trimmedLine.substring(colonIndex + 1).trim();
              // Remove surrounding quotes if present
              menuTitle = menuTitle.replace(/^"(.*)"$/, '$1');
              lastChildItem["menu-title"] = menuTitle;
            }
          }
          continue;
        }
        
        // Exit menu-tree section
        if (trimmedLine.startsWith('documents:')) {
          currentSection = 'documents';
          isInArray = false;
          continue;
        }
      }

      if (trimmedLine.startsWith('- ')) {
        if (currentObject) {
          documentArray.push(currentObject);
        }
        currentObject = {};
        isInArray = true;
        const [key, ...valueParts] = trimmedLine.substring(2).split(':');
        if (valueParts.length > 0) {
          currentObject[key.trim()] = valueParts.join(':').trim().replace(/^"(.*)"$/, '$1');
        }
      } else if (trimmedLine.includes(':')) {
        const [key, ...valueParts] = trimmedLine.split(':');
        const value = valueParts.join(':').trim().replace(/^"(.*)"$/, '$1');
        if (isInArray && currentObject) {
          if (value.startsWith('[') && value.endsWith(']')) {
            currentObject[key.trim()] = value.slice(1, -1).split(',').map(v => v.trim());
          } else {
            currentObject[key.trim()] = value;
          }
        } else {
          result[key.trim()] = value;
        }
      }
    }

    if (currentObject) {
      documentArray.push(currentObject);
    }
    
    if (isInArray) {
      result.documents = documentArray;
    }
    
    if (menuTree.length > 0) {
      result['menu-tree'] = menuTree;
    }

    // Type assertion to ensure we have the required fields
    return {
      docRoot: result.docRoot as string,
      documents: result.documents as SiteTree['documents'],
      "menu-tree": result['menu-tree'] as DocMenuItem[] | undefined
    };
  };

  // Function to remove metadata from markdown content
  const removeMetadata = (content: string): string => {
    return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
  };

  const handleNavigateHome = () => {
    navigate('/');
  };
  
  // Handle document selection and URL update
  const handleDocumentSelect = async (doc: DocFile) => {
    // Update the URL based on the document path
    const routePath = getRoutePathFromDocPath(doc.path);
    navigate(`/docs/${routePath}`);
    
    // Load document content if not already loaded
    if (!doc.content) {
      const docWithContent = await loadDocumentContent(doc);
      setCurrentDoc(docWithContent);
    } else {
      setCurrentDoc(doc);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error loading documentation:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button
            onClick={handleNavigateHome}
            className="bg-gradient-to-r from-yellow-400 to-red-500 text-black px-4 py-2 rounded hover:from-yellow-500 hover:to-red-600 transition-colors font-semibold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-900 border-r border-yellow-400/20 flex flex-col overflow-hidden`}>
          <div className="p-4 border-b border-yellow-400/20">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleNavigateHome}
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-all transform hover:scale-105 hover:-translate-x-1"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">Back to Home</span>
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-800 text-gray-300 hover:text-white transform hover:scale-110 hover:rotate-90 transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-lg font-semibold text-white">Documentation</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <nav className="space-y-1">
              {menuTree.length > 0 ? (
                <MenuTreeView 
                  menuItems={menuTree} 
                  docs={docs} 
                  currentDoc={currentDoc} 
                  setCurrentDoc={handleDocumentSelect}
                  expandedItems={expandedItems}
                  setExpandedItems={setExpandedItems}
                />
              ) : (
                docs.map((doc, index) => (
                  <button
                    key={index}
                    onClick={() => handleDocumentSelect(doc)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left transition-all transform hover:scale-105 hover:-translate-x-1 ${
                      currentDoc?.path === doc.path
                        ? 'bg-gradient-to-r from-yellow-400/20 to-red-500/20 text-yellow-400 border-r-4 border-yellow-400 shadow-lg shadow-yellow-400/20'
                        : 'text-gray-300 hover:bg-gray-800 hover:border-r-2 hover:border-yellow-400/50'
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Content Header */}
          <div className="bg-gray-900 border-b border-yellow-400/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 hover:bg-gray-800 text-gray-300 hover:text-white transform hover:scale-110 hover:rotate-180 transition-all duration-300"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    {currentDoc?.title || 'ASDM Documentation'}
                  </h1>
                  {currentDoc?.description && (
                    <p className="text-sm text-gray-400 mt-1">{currentDoc.description}</p>
                  )}
                </div>
              </div>
              {currentDoc?.tags && currentDoc.tags.length > 0 && (
                <div className="flex gap-2">
                  {currentDoc.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-full">
                      {tag}
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading document content...</p>
                </div>
              </div>
            ) : currentDoc && currentDoc.content ? (
              <div className="max-w-4xl mx-auto px-6 py-8">
                <MarkdownRenderer content={currentDoc.content} />
                {(currentDoc.lastUpdated || currentDoc.author) && (
                  <div className="mt-8 pt-4 border-t border-gray-800 text-sm text-gray-400">
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
      </div>
      
      <Footer />
    </div>
  );
}