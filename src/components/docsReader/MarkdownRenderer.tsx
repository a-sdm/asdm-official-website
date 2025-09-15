import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Components } from 'react-markdown';
import mermaid from 'mermaid';

interface MarkdownRendererProps {
  content: string;
}

// Mermaid diagram component
const MermaidDiagram: React.FC<{ content: string }> = ({ content }) => {
  const ref = useRef<HTMLDivElement>(null);
  // Use a stable ID based on content hash to prevent re-renders
  const id = `mermaid-${content.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0).toString(36)}`;

  useEffect(() => {
    // Configure mermaid once
    mermaid.initialize({
      startOnLoad: false, // Important: we'll manually render
      theme: 'dark',
      securityLevel: 'loose',
      themeVariables: {
        // Enhanced color scheme for better readability on dark backgrounds
        primaryColor: '#f59e0b',           // Yellow accent color
        primaryTextColor: '#ffffff',       // White text for primary elements
        primaryBorderColor: '#f59e0b',     // Yellow border
        
        // Background colors with better contrast
        mainBkg: '#1e293b',               // Darker blue background
        secondaryBkg: '#334155',          // Medium blue for secondary backgrounds
        tertiaryBkg: '#475569',           // Lighter blue for tertiary backgrounds
        
        // Text colors with high contrast
        textColor: '#f8fafc',             // Very light gray, almost white
        lineColor: '#f8fafc',             // Light color for lines
        
        // Node colors
        nodeBorder: '#f59e0b',            // Yellow border for nodes
        clusterBkg: '#1e293b',            // Dark blue for cluster backgrounds
        clusterBorder: '#64748b',         // Medium gray for cluster borders
        
        // Relationship colors
        edgeLabelBackground: '#334155',   // Medium blue for edge labels
        
        // Contrast colors for different node types
        secondaryColor: '#3b82f6',        // Bright blue
        tertiaryColor: '#2dd4bf',         // Teal
        
        // Additional colors for better differentiation
        activeTaskBkgColor: '#f59e0b',    // Yellow for active tasks
        activeTaskBorderColor: '#fbbf24', // Lighter yellow for borders
        
        // Title and label colors
        titleColor: '#f59e0b',            // Yellow for titles
        labelColor: '#f8fafc',            // White for labels
        
        // Font settings
        fontSize: '16px',                 // Larger font size
        fontFamily: 'ui-sans-serif, system-ui, sans-serif'
      }
    });
    
    const renderDiagram = async () => {
      if (ref.current) {
        try {
          // Clear previous content
          ref.current.innerHTML = '';
          
          // Create a container for mermaid to render into
          const container = document.createElement('div');
          container.id = id;
          container.style.width = '100%';
          container.style.display = 'flex';
          container.style.justifyContent = 'center';
          container.textContent = content;
          ref.current.appendChild(container);
          
          // Process and render the diagram
          await mermaid.run({
            nodes: [container]
          });
        } catch (error) {
          console.error("Mermaid rendering failed:", error);
          if (ref.current) {
            ref.current.innerHTML = `<div class="text-red-500 p-2">Diagram rendering failed</div>`;
          }
        }
      }
    };
    
    // Small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      renderDiagram();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [content, id]);

  return (
    <div className="my-6 bg-gray-900 p-6 rounded-lg shadow-xl overflow-auto border border-yellow-500/30">
      <div ref={ref} className="flex justify-center min-h-[150px]" />
    </div>
  );
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Initialize mermaid only once when component mounts
  useEffect(() => {
    // This ensures mermaid is properly initialized once
    mermaid.initialize({
      startOnLoad: false, // We'll manually render diagrams
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    });
    
    // No cleanup needed - mermaid will be reinitialized if needed
    return () => {};
  }, []);
  return (
    <div className="prose prose-base max-w-none prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mb-5 pb-2 border-b-4 border-yellow-400 shadow-lg">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-yellow-400 mt-6 mb-3 border-l-4 border-transparent hover:border-yellow-400 pl-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-white mt-5 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-3 text-gray-300 text-sm">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-300 text-sm">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-4 text-sm">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-8 border-yellow-400 pl-4 py-2 my-3 bg-yellow-400/10 shadow-lg">
              <div className="text-gray-300 italic text-sm">
                {children}
              </div>
            </blockquote>
          ),
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            
            // Handle mermaid diagrams
            if (!props.inline && match && match[1] === 'mermaid') {
              return <MermaidDiagram content={String(children)} />;
            }
            
            return !props.inline && match ? (
              <div className="my-3 rounded-lg overflow-hidden text-xs">
                <SyntaxHighlighter
                  style={tomorrow as any}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ fontSize: '0.75rem', padding: '0.75rem' }}
                  codeTagProps={{ style: { fontSize: '0.75rem' } }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-gray-800 text-yellow-400 px-1 py-0.5 text-xs shadow-md" {...props}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full divide-y divide-gray-700 border-2 border-gray-700 shadow-lg hover:border-yellow-400/50">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 bg-gray-800 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider border-b-2 border-gray-700 hover:bg-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-300 border-b border-gray-800 hover:bg-gray-800/50">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}