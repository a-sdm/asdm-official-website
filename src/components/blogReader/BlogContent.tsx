import React, { useEffect } from 'react';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';
import { BlogPost } from './types';
import BlogMarkdownRenderer from './BlogMarkdownRenderer';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate, getCategoryColor } from './BlogUtils';
import './BlogMarkdownStyles.css';

interface BlogContentProps {
  currentBlog: BlogPost | null;
  contentLoading: boolean;
  onBack: () => void;
}

const BlogContent: React.FC<BlogContentProps> = ({
  currentBlog,
  contentLoading,
  onBack
}) => {
  const { theme } = useTheme();
  const { t, loadTranslations, isLoaded } = useLanguage();
  
  // Load translations for this component
  useEffect(() => {
    loadTranslations('BlogContent');
  }, [loadTranslations]);

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-300 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-300 mb-4">Blog post not found</p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 px-6 py-3 rounded-lg hover:from-yellow-400 hover:to-amber-500 transition-all transform hover:scale-105 font-semibold"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-4 sm:px-6 py-6 border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-300 hover:text-yellow-300 transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Blog</span>
            </button>

            {/* Blog Meta */}
            <div className="mb-6">
              {currentBlog.category && (
                <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getCategoryColor(currentBlog.category)}`}>
                  <Tag className="w-3 h-3" />
                  <span>{currentBlog.category}</span>
                </span>
              )}
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                {currentBlog.title}
              </h1>
              
              {currentBlog.description && (
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  {currentBlog.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                {currentBlog.author && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{currentBlog.author}</span>
                  </div>
                )}
                {currentBlog.date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(currentBlog.date)}</span>
                  </div>
                )}
                {currentBlog.readTime && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{currentBlog.readTime}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {currentBlog.tags && currentBlog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentBlog.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <main className="px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {currentBlog.content ? (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl">
                <div className="blog-content max-w-none">
                  <BlogMarkdownRenderer content={currentBlog.content} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Content not available</p>
              </div>
            )}
          </div>
        </main>

        {/* Footer Navigation */}
        <div className="px-4 sm:px-6 py-8 border-t border-gray-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 px-8 py-4 rounded-lg hover:from-yellow-400 hover:to-amber-500 transition-all transform hover:scale-105 font-semibold"
            >
              Back to All Posts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContent;