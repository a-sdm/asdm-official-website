import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlockRenderer from './CodeBlockRenderer';

interface BlogMarkdownRendererProps {
  content: string;
}

const BlogMarkdownRenderer: React.FC<BlogMarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          const codeContent = String(children).replace(/\n$/, '');
          const inline = !className;

          if (!inline && codeContent) {
            return (
              <CodeBlockRenderer
                code={codeContent}
                language={language}
                className={className}
              />
            );
          }

          // Inline code
          return (
            <code className="blog-inline-code" {...props}>
              {children}
            </code>
          );
        },
        // Custom heading renderer for better styling
        h1({ children }) {
          return <h1 className="blog-h1">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="blog-h2">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="blog-h3">{children}</h3>;
        },
        h4({ children }) {
          return <h4 className="blog-h4">{children}</h4>;
        },
        // Custom paragraph renderer
        p({ children }) {
          return <p className="blog-paragraph">{children}</p>;
        },
        // Custom blockquote renderer
        blockquote({ children }) {
          return <blockquote className="blog-blockquote">{children}</blockquote>;
        },
        // Custom list renderers
        ul({ children }) {
          return <ul className="blog-ul">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="blog-ol">{children}</ol>;
        },
        li({ children }) {
          return <li className="blog-li">{children}</li>;
        },
        // Custom link renderer
        a({ href, children }) {
          return (
            <a 
              href={href} 
              className="blog-link"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          );
        },
        // Custom table renderers
        table({ children }) {
          return <table className="blog-table">{children}</table>;
        },
        thead({ children }) {
          return <thead className="blog-thead">{children}</thead>;
        },
        tbody({ children }) {
          return <tbody className="blog-tbody">{children}</tbody>;
        },
        tr({ children }) {
          return <tr className="blog-tr">{children}</tr>;
        },
        th({ children }) {
          return <th className="blog-th">{children}</th>;
        },
        td({ children }) {
          return <td className="blog-td">{children}</td>;
        },
        // Custom horizontal rule
        hr() {
          return <hr className="blog-hr" />;
        },
        // Custom image renderer
        img({ src, alt }) {
          return <img src={src} alt={alt} className="blog-img" />;
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default BlogMarkdownRenderer;