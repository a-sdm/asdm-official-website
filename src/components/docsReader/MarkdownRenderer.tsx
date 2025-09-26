import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';
import mermaid from 'mermaid';
import { useTheme } from '../../context/ThemeContext';
import CodeBlockRenderer from './CodeBlockRenderer';

interface MarkdownRendererProps {
  content: string;
}

// Mermaid diagram component
const MermaidDiagram: React.FC<{ content: string }> = ({ content }) => {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  // Use a stable ID based on content hash to prevent re-renders
  const id = `mermaid-${content.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0).toString(36)}`;

  useEffect(() => {
    // Configure mermaid once
    mermaid.initialize({
      startOnLoad: false, // Important: we'll manually render
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      themeVariables: theme === 'dark' ? {
        // Dark theme variables
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
      } : {
        // Light theme variables
        primaryColor: '#3b82f6',           // Blue accent color for light theme
        primaryTextColor: '#1f2937',       // Dark text for primary elements
        primaryBorderColor: '#3b82f6',     // Blue border
        
        // Background colors for light theme
        mainBkg: '#f9fafb',               // Very light gray background
        secondaryBkg: '#f3f4f6',          // Light gray for secondary backgrounds
        tertiaryBkg: '#e5e7eb',           // Medium gray for tertiary backgrounds
        
        // Text colors for light theme
        textColor: '#1f2937',             // Dark gray, almost black
        lineColor: '#4b5563',             // Medium gray for lines
        
        // Node colors
        nodeBorder: '#3b82f6',            // Blue border for nodes
        clusterBkg: '#f9fafb',            // Light background for cluster backgrounds
        clusterBorder: '#9ca3af',         // Medium gray for cluster borders
        
        // Relationship colors
        edgeLabelBackground: '#f3f4f6',   // Light gray for edge labels
        
        // Contrast colors for different node types
        secondaryColor: '#2563eb',        // Darker blue
        tertiaryColor: '#0d9488',         // Darker teal
        
        // Additional colors for better differentiation
        activeTaskBkgColor: '#3b82f6',    // Blue for active tasks
        activeTaskBorderColor: '#60a5fa', // Lighter blue for borders
        
        // Title and label colors
        titleColor: '#2563eb',            // Blue for titles
        labelColor: '#1f2937',            // Dark gray for labels
        
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
    <div className={`my-6 p-6 rounded-lg shadow-xl overflow-auto border w-full ${
      theme === 'dark' 
        ? 'bg-gray-900 border-yellow-500/30' 
        : 'bg-gray-100 border-blue-500/20'
    }`}>
      <div ref={ref} className="flex justify-center min-h-[150px] w-full" />
    </div>
  );
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { theme } = useTheme();
  
  // Initialize mermaid only once when component mounts
  useEffect(() => {
    // This ensures mermaid is properly initialized once
    mermaid.initialize({
      startOnLoad: false, // We'll manually render diagrams
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      themeVariables: theme === 'dark' ? {
        // Dark theme variables
        primaryColor: '#f59e0b',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#f59e0b',
        mainBkg: '#1e293b',
        secondaryBkg: '#334155',
        tertiaryBkg: '#475569',
        textColor: '#f8fafc',
        lineColor: '#f8fafc',
        nodeBorder: '#f59e0b',
        titleColor: '#f59e0b',
        labelColor: '#f8fafc'
      } : {
        // Light theme variables
        primaryColor: '#3b82f6',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#3b82f6',
        mainBkg: '#f9fafb',
        secondaryBkg: '#f3f4f6',
        tertiaryBkg: '#e5e7eb',
        textColor: '#1f2937',
        lineColor: '#4b5563',
        nodeBorder: '#3b82f6',
        titleColor: '#2563eb',
        labelColor: '#1f2937'
      }
    });
    
    // No cleanup needed - mermaid will be reinitialized if needed
    return () => {};
  }, [theme]);
  return (
    <div className={`prose prose-base max-w-none w-full overflow-hidden ${
      theme === 'dark' ? 'prose-invert' : ''
    }`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className={`text-2xl font-bold mb-5 pb-2 shadow-lg break-words ${
              theme === 'dark' 
                ? 'text-white border-b-4 border-yellow-400' 
                : 'text-gray-800 border-b-4 border-blue-500'
            }`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`text-xl font-semibold mt-6 mb-3 border-l-4 border-transparent pl-2 break-words ${
              theme === 'dark' 
                ? 'text-yellow-400 hover:border-yellow-400' 
                : 'text-blue-600 hover:border-blue-500'
            }`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`text-lg font-semibold mt-5 mb-2 break-words ${
              theme === 'dark' ? 'text-white' : 'text-gray-700'
            }`}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className={`text-sm leading-relaxed mb-3 break-words ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className={`list-disc list-inside space-y-1 mb-3 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`list-decimal list-inside space-y-1 mb-3 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-4 text-sm break-words">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className={`border-l-8 pl-4 py-2 my-3 shadow-lg w-full overflow-hidden ${
              theme === 'dark' 
                ? 'border-yellow-400 bg-yellow-400/10' 
                : 'border-blue-500 bg-blue-500/5'
            }`}>
              <div className={`italic text-sm break-words ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
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
              <CodeBlockRenderer 
                language={match[1]} 
                theme={theme} 
                children={String(children)} 
              />
            ) : (
              <code className={`px-1 py-0.5 text-xs shadow-md break-all ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-yellow-400' 
                  : 'bg-gray-100 text-blue-600'
              }`} {...props}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 w-full">
              <table className={`w-full shadow-lg ${
                theme === 'dark'
                  ? 'divide-y divide-gray-700 border-2 border-gray-700 hover:border-yellow-400/50'
                  : 'divide-y divide-gray-200 border-2 border-gray-200 hover:border-blue-500/30'
              }`}>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${
              theme === 'dark'
                ? 'bg-gray-800 text-yellow-400 border-b-2 border-gray-700 hover:bg-gray-700'
                : 'bg-gray-100 text-blue-700 border-b-2 border-gray-200 hover:bg-gray-200'
            }`}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className={`px-3 py-2 text-xs border-b break-words ${
              theme === 'dark'
                ? 'text-gray-300 border-gray-800 hover:bg-gray-800/50'
                : 'text-gray-700 border-gray-200 hover:bg-gray-100/50'
            }`}>
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className={`font-medium underline decoration-2 underline-offset-2 transition-colors ${
                theme === 'dark'
                  ? 'text-yellow-400 hover:text-yellow-300 decoration-yellow-500/30'
                  : 'text-blue-600 hover:text-blue-800 decoration-blue-500/30'
              }`}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          img: ({ src, alt, title }) => (
            <div className={`my-4 flex justify-center ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'
            }`}>
              <img 
                src={src} 
                alt={alt || ''} 
                title={title || alt || ''} 
                className={`max-w-full h-auto rounded-md shadow-md border ${
                  theme === 'dark' 
                    ? 'border-gray-700 shadow-gray-900/50' 
                    : 'border-gray-200 shadow-gray-300/50'
                }`}
                style={{ maxHeight: '500px' }}
              />
            </div>
          ),
          hr: () => (
            <hr className={`my-6 border-0 h-px ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent'
                : 'bg-gradient-to-r from-transparent via-blue-500/30 to-transparent'
            }`} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}