import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';

interface CodeBlockRendererProps {
  code: string;
  language?: string;
  className?: string;
}

const CodeBlockRenderer: React.FC<CodeBlockRendererProps> = ({ 
  code, 
  language = 'text',
  className = '' 
}) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      // Clear any existing highlighting
      codeRef.current.removeAttribute('data-highlighted');
      
      // Apply syntax highlighting
      if (language && language !== 'text') {
        try {
          const highlighted = hljs.highlight(code, { language });
          codeRef.current.innerHTML = highlighted.value;
        } catch (error) {
          // If language is not supported, try auto-detection
          try {
            const highlighted = hljs.highlightAuto(code);
            codeRef.current.innerHTML = highlighted.value;
          } catch (autoError) {
            // Fallback to plain text
            codeRef.current.textContent = code;
          }
        }
      } else {
        // Plain text
        codeRef.current.textContent = code;
      }
    }
  }, [code, language]);

  return (
    <div className="blog-code-block-wrapper">
      <pre className={`blog-code-block ${className}`}>
        <code 
          ref={codeRef}
          className={`blog-code-content ${language ? `language-${language}` : ''}`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlockRenderer;