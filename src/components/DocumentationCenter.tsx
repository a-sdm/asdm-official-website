import React, { useState, useEffect } from 'react';
import { Home, Menu, X, FileText, ChevronRight } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface DocumentationCenterProps {
  onNavigateHome: () => void;
}

interface DocFile {
  name: string;
  path: string;
  content: string;
  title: string;
}

interface DocMetadata {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export default function DocumentationCenter({ onNavigateHome }: DocumentationCenterProps) {
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
        
        // Define the documentation files to load (just paths)
        const docFiles = [
          { path: 'introduction.md' },
          { path: 'core-principles.md' },
          { path: 'implementation-guide.md' },
          { path: 'best-practices.md' }
        ];

        const loadedDocs: DocFile[] = [];

        for (const docFile of docFiles) {
          try {
            const response = await fetch(`/docs/${docFile.path}`);
            if (response.ok) {
              const content = await response.text();
              
              // Parse metadata from markdown content
              const metadata = parseMetadata(content);
              const contentWithoutMetadata = removeMetadata(content);
              
              // Extract name from path (remove .md extension)
              const name = docFile.path.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              loadedDocs.push({
                name,
                path: docFile.path,
                content: contentWithoutMetadata,
                title: metadata.title || name
              });
            } else {
              console.warn(`Failed to load ${docFile.path}: ${response.status}`);
            }
          } catch (err) {
            console.warn(`Error loading ${docFile.path}:`, err);
          }
        }

        if (loadedDocs.length === 0) {
          throw new Error('No documentation files could be loaded');
        }

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

  // Function to parse metadata from markdown content
  const parseMetadata = (content: string): DocMetadata => {
    const metadata: DocMetadata = { title: '' };
    const metadataRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = content.match(metadataRegex);
    
    if (match) {
      const metadataContent = match[1];
      const lines = metadataContent.split('\n');
      
      lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          if (key.trim() === 'title') {
            metadata.title = value;
          } else if (key.trim() === 'description') {
            metadata.description = value;
          } else if (key.trim() === 'category') {
            metadata.category = value;
          } else if (key.trim() === 'tags') {
            metadata.tags = value.split(',').map(tag => tag.trim());
          }
        }
      });
    }
    
    return metadata;
  };

  // Function to remove metadata from markdown content
  const removeMetadata = (content: string): string => {
    return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
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
            onClick={onNavigateHome}
            className="bg-gradient-to-r from-yellow-400 to-red-500 text-black px-4 py-2 rounded hover:from-yellow-500 hover:to-red-600 transition-colors font-semibold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-900 border-r border-yellow-400/20 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-yellow-400/20">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onNavigateHome}
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
                <span className="text-sm">{doc.name}</span>
                <ChevronRight className={`w-3 h-3 ml-auto ${currentDoc?.path === doc.path ? 'text-yellow-400' : 'text-gray-500'}`} />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900 border-b border-yellow-400/20 px-6 py-4">
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
              <h1 className="text-xl font-semibold text-white">
                {currentDoc?.title || 'ASDM Documentation'}
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-black">
          {currentDoc ? (
            <div className="max-w-4xl mx-auto px-6 py-8">
              <MarkdownRenderer content={currentDoc.content} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Select a document to view its content</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}