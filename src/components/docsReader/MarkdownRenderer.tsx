import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
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