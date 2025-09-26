import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import {
  DocSidebar,
  DocContent,
  LoadingState,
  ErrorState,
  DocFile,
  DocMenuItem,
  parseYaml,
  loadDocumentContent,
  findDocByRoutePath,
  getRoutePathFromDocPath,
  findAndExpandParents,
  Header,
  DocsReaderLanguageProvider,
  useDocsReaderLanguage
} from '../components/docsReader';

// Create a wrapper component that uses the language context
const DocumentsContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { language, getDocRoot } = useDocsReaderLanguage();
  const [docs, setDocs] = useState<DocFile[]>([]);
  const [currentDoc, setCurrentDoc] = useState<DocFile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuTree, setMenuTree] = useState<DocMenuItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [docRoot, setDocRoot] = useState<string>(`${getDocRoot()}/content`);
  
  // Function to load document content with state updates
  const handleLoadDocumentContent = async (doc: DocFile): Promise<DocFile> => {
    setContentLoading(true);
    try {
      // Use the language-specific document root
      const docWithContent = await loadDocumentContent(doc, `${getDocRoot()}/content`, setDocs);
      setContentLoading(false);
      return docWithContent;
    } catch (err) {
      setContentLoading(false);
      throw err;
    }
  };

  // Load site-tree.yml and initialize document metadata
  useEffect(() => {
    // Reset state when language changes
    setCurrentDoc(null);
    setDocs([]);
    
    const loadSiteTree = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Update docRoot based on current language
        setDocRoot(`${getDocRoot()}/content`);
        
        // Load site-tree.yml from language-specific path
        const siteTreeResponse = await fetch(`${getDocRoot()}/site-tree.yml`);
        if (!siteTreeResponse.ok) {
          throw new Error('Failed to load site-tree.yml');
        }
        const siteTreeText = await siteTreeResponse.text();
        
        // Parse YAML
        const siteTree = parseYaml(siteTreeText);
        
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
        
        if (pathSegments.length <= 2) {
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
          // Skip the language segment (pathSegments[1]) and get the rest
          const docPath = pathSegments.slice(2).join('/');
          docToLoad = findDocByRoutePath(docPath, docsMetadata);
          
          if (!docToLoad) {
            docToLoad = docsMetadata[0]; // Fallback to first doc
          }
          
          // Expand the menu tree to show the current document
          const expandParentPaths = new Set<string>();
          
          if (siteTree["menu-tree"]) {
            findAndExpandParents(siteTree["menu-tree"], docToLoad.path, expandParentPaths);
            setExpandedItems(expandParentPaths);
          }
        }
        
        // Load the content for the selected document
        if (docToLoad) {
          const docWithContent = await handleLoadDocumentContent(docToLoad);
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
  }, [language]); // Re-run when language changes
  
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
              const docWithContent = await handleLoadDocumentContent(docToLoad);
              setCurrentDoc(docWithContent);
            }
          }
        } else {
          // We have a specific document path in the URL
          const docPath = pathSegments.slice(1).join('/');
          const docToLoad = findDocByRoutePath(docPath, docs);
          
          if (docToLoad) {
            const docWithContent = await handleLoadDocumentContent(docToLoad);
            setCurrentDoc(docWithContent);
            
            // Expand the menu tree to show the current document
            const expandParentPaths = new Set<string>();
            findAndExpandParents(menuTree, docToLoad.path, expandParentPaths);
            setExpandedItems(expandParentPaths);
          }
        }
      } catch (err) {
        console.error('Error loading document from URL:', err);
      }
    };
    
    loadDocumentFromUrl();
  }, [location.pathname, docs.length]);

  const handleNavigateHome = () => {
    navigate('/');
  };
  
  // Handle document selection and URL update
  const handleDocumentSelect = async (doc: DocFile) => {
    // Update the URL based on the document path
    const routePath = getRoutePathFromDocPath(doc.path);
    // Extract language code from the doc root path
    const langCode = getDocRoot().split('/').pop();
    navigate(`/docs/${langCode}/${routePath}`);
    
    // Load document content if not already loaded
    if (!doc.content) {
      const docWithContent = await handleLoadDocumentContent(doc);
      setCurrentDoc(docWithContent);
    } else {
      setCurrentDoc(doc);
    }
  };

  if (loading) {
    return <LoadingState message="Loading documentation..." size="large" />;
  }

  if (error) {
    return <ErrorState message={error} onNavigateHome={handleNavigateHome} />;
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title={currentDoc?.title || 'Documentation'}
          docs={docs}
          menuTree={menuTree}
          currentDoc={currentDoc}
          expandedItems={expandedItems}
          setExpandedItems={setExpandedItems}
          onDocumentSelect={handleDocumentSelect}
        />
      
      <div className="flex flex-1 relative">
        {/* Desktop-only sidebar */}
        <div className="hidden md:block">
          <DocSidebar
            docs={docs}
            menuTree={menuTree}
            currentDoc={currentDoc}
            onDocumentSelect={handleDocumentSelect}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onNavigateHome={handleNavigateHome}
          />
        </div>

        <DocContent
          currentDoc={currentDoc}
          contentLoading={contentLoading}
          sidebarOpen={sidebarOpen && window.innerWidth >= 768} // Only consider sidebar open on desktop
          setSidebarOpen={setSidebarOpen}
          onNavigate={(path) => {
            // If it's the root, navigate to the first document
            if (path === '') {
              if (menuTree.length > 0) {
                const firstDoc = docs.find(doc => doc.path === menuTree[0].path);
                if (firstDoc) {
                  handleDocumentSelect(firstDoc);
                }
              }
              return;
            }
            
            // First try to find an exact match for the path
            let docToNavigate = docs.find(doc => doc.path === path);
            
            // If not found and the path ends with _index.md, try to find a document in that directory
            if (!docToNavigate && path.endsWith('/_index.md')) {
              const dirPath = path.replace('/_index.md', '');
              // Look for a document that represents the directory index
              docToNavigate = docs.find(doc => 
                doc.path === path || 
                doc.path === `${dirPath}/_index.md` || 
                doc.path === `${dirPath}/index.md`
              );
              
              // If still not found, find any document in that directory
              if (!docToNavigate) {
                docToNavigate = docs.find(doc => doc.path.startsWith(`${dirPath}/`));
              }
            }
            
            if (docToNavigate) {
              handleDocumentSelect(docToNavigate);
            }
          }}
        />
      </div>
      
      <Footer />
    </div>
  );
};

// Main component that provides the language context
export default function Documents() {
  return (
    <DocsReaderLanguageProvider>
      <DocumentsContent />
    </DocsReaderLanguageProvider>
  );
}