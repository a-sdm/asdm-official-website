import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockRendererProps {
  language: string;
  children: string;
  theme: 'dark' | 'light';
}

const CodeBlockRenderer: React.FC<CodeBlockRendererProps> = ({ language, children, theme }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`my-3 rounded-lg w-full text-xs relative border ${
      theme === 'dark' 
        ? 'border-gray-800' 
        : 'border-gray-200'
    }`}>
      <button
        onClick={handleCopy}
        className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium transition-colors z-10 ${
          theme === 'dark'
            ? copied 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            : copied 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
        aria-label="Copy code to clipboard"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <div className="overflow-x-auto max-w-full" style={{ 
        maxWidth: '100%', 
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        scrollbarColor: theme === 'dark' ? '#4b5563 #1f2937' : '#cbd5e1 #f1f5f9'
      }}>
        <SyntaxHighlighter
          style={(theme === 'dark' ? tomorrow : oneLight) as any}
          language={language}
          PreTag="div"
          customStyle={{ 
            fontSize: '0.75rem', 
            padding: '0.75rem',
            margin: 0,
            borderRadius: '0.375rem',
            width: 'auto',
            minWidth: '100%',
            maxWidth: 'max-content',
            textAlign: 'left'
          }}
          codeTagProps={{ style: { fontSize: '0.75rem' } }}
          wrapLongLines={true}
          wrapLines={true}
          showLineNumbers={true}
          showInlineLineNumbers={false}
          lineNumberStyle={{
            textAlign: 'right',
            paddingRight: '1em',
            minWidth: '3em',
            userSelect: 'none',
            color: theme === 'dark' ? '#6b7280' : '#9ca3af',
            borderRight: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
            marginRight: '1em',
            position: 'sticky',
            left: 0
          }}
          lineProps={() => ({
            style: { 
              display: 'block',
              textAlign: 'left',
              paddingLeft: '0',
              textIndent: '0',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }
          })}
        >
          {children.replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlockRenderer;