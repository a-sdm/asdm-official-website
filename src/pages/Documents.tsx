import React, { useState, useEffect } from 'react';
import { Home, Menu, X, FileText, ChevronRight } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

interface DocFile {
  name: string;
  path: string;
  content: string;
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
}

export default function Documents() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<DocFile[]>([]);
  const [currentDoc, setCurrentDoc] = useState<DocFile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load documentation files
  useEffect(() => {
    const loadDocumentation = async () => {
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
        const siteTree: SiteTree = yamlData as SiteTree;

        const loadedDocs: DocFile[] = [];

        for (const doc of siteTree.documents) {
          try {
            const response = await fetch(`${siteTree.docRoot}/${doc.path}`);
            if (response.ok) {
              const content = await response.text();
              const contentWithoutMetadata = removeMetadata(content);
              
              // Extract name from filename (remove directory and .md extension)
              const fileName = doc.path.split('/').pop() || doc.path;
              const name = fileName.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              loadedDocs.push({
                name,
                path: doc.path,
                content: contentWithoutMetadata,
                title: doc.title,
                description: doc.description,
                category: doc.category,
                tags: doc.tags,
                lastUpdated: doc.lastUpdated,
                created: doc.created,
                updated: doc.updated,
                author: doc.author,
                weight: doc.weight
              });
            } else {
              console.warn(`Failed to load ${doc.path}: ${response.status}`);
            }
          } catch (err) {
            console.warn(`Error loading ${doc.path}:`, err);
          }
        }

        if (loadedDocs.length === 0) {
          throw new Error('No documentation files could be loaded');
        }

        // Sort docs by weight if available, then by title
        loadedDocs.sort((a, b) => {
          if (a.weight !== undefined && b.weight !== undefined) {
            return a.weight - b.weight;
          }
          return a.title.localeCompare(b.title);
        });

        setDocs(loadedDocs);
        setCurrentDoc(loadedDocs[0]); // Set first doc as default
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load documentation');
        console.error('Error loading documentation:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDocumentation();
  }, []);

  // Function to parse YAML
  const parseYaml = (yamlText: string): any => {
    const lines = yamlText.split('\n');
    const result: any = {};
    let currentArray: any[] = [];
    let currentObject: any = null;
    let isInArray = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;

      if (trimmedLine.startsWith('- ')) {
        if (currentObject) {
          currentArray.push(currentObject);
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
      currentArray.push(currentObject);
    }
    if (isInArray) {
      result.documents = currentArray;
    }

    return result;
  };

  // Function to remove metadata from markdown content
  const removeMetadata = (content: string): string => {
    return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
  };

  const handleNavigateHome = () => {
    navigate('/');
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

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {docs.map((doc, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDoc(doc)}
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
              ))}
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
            {currentDoc ? (
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