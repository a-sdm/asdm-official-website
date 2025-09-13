import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg max-w-none prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mb-6 pb-3 border-b-4 border-yellow-400 shadow-lg transform hover:scale-105 transition-all duration-300">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-yellow-400 mt-8 mb-4 transform hover:scale-105 hover:-translate-x-2 transition-all duration-300 border-l-4 border-transparent hover:border-yellow-400 pl-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-white mt-6 mb-3 transform hover:scale-105 hover:-translate-x-1 transition-all duration-300">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-4">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-8 border-yellow-400 pl-4 py-2 my-4 bg-yellow-400/10 transform hover:scale-105 hover:-translate-x-2 transition-all duration-300 shadow-lg hover:shadow-yellow-400/20">
              <div className="text-gray-300 italic">
                {children}
              </div>
            </blockquote>
          ),
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="my-4 rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-gray-800 text-yellow-400 px-2 py-1 text-sm transform hover:scale-105 hover:bg-gray-700 transition-all duration-200 shadow-md" {...props}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-700 border-2 border-gray-700 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:border-yellow-400/50">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 bg-gray-800 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider border-b-2 border-gray-700 transform hover:scale-105 hover:bg-gray-700 transition-all duration-300">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-200">
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