import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockRendererProps {
  language: string;
  children: string;
  theme: 'dark' | 'light';
}

const CodeBlockRenderer: React.FC<CodeBlockRendererProps> = ({ language, children, theme }) => {
  return (
    <div className={`my-3 rounded-lg w-full text-xs relative border ${
      theme === 'dark' 
        ? 'border-gray-800' 
        : 'border-gray-200'
    }`}>
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