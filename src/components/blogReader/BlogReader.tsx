import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPost, BlogSiteTree } from './types';
import { parseYaml, findBlogByRoutePath, loadBlogContent } from './BlogUtils';
import BlogContent from './BlogContent';
import AnimatedBackground from '../AnimatedBackground';
import Header from '../Header';
import Footer from '../Footer';
import { BlogReaderLanguageProvider, useBlogReaderLanguage } from './context/BlogReaderLanguageContext';

// Create a wrapper component that uses the language context
const BlogReaderContent: React.FC = () => {
  const { '*': routePath } = useParams();
  const navigate = useNavigate();
  const { language, getBlogRoot } = useBlogReaderLanguage();
  
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [siteTree, setSiteTree] = useState<BlogSiteTree | null>(null);

  // Load blog site tree and initialize blogs
  useEffect(() => {
    const loadBlogSiteTree = async () => {
      try {
        setLoading(true);
        // Use language-specific blog root
        const response = await fetch(`${getBlogRoot()}/content/site-tree.yml`);
        if (!response.ok) {
          throw new Error(`Failed to load site tree: ${response.status}`);
        }
        
        const yamlText = await response.text();
        const parsedSiteTree = parseYaml(yamlText);
        setSiteTree(parsedSiteTree);
        
        // Convert documents to BlogPost objects
        const blogPosts: BlogPost[] = parsedSiteTree.documents.map(doc => ({
          title: doc.title,
          path: doc.path,
          description: doc.description,
          category: doc.category,
          author: doc.author,
          date: doc.date,
          readTime: doc.readTime,
          tags: doc.tags,
          icon: doc.icon
        }));
        
        setBlogs(blogPosts);
      } catch (error) {
        console.error('Error loading blog site tree:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogSiteTree();
  }, [language, getBlogRoot]);

  // Handle route changes and load specific blog content
  useEffect(() => {
    if (!routePath || blogs.length === 0) {
      setCurrentBlog(null);
      return;
    }

    // Extract language and actual path from route
    // Route format: /blog/en-us/20250115/introducing-asdm or /blog/zh-cn/20250115/introducing-asdm
    const pathParts = routePath.split('/');
    const routeLanguage = pathParts[0]; // en-us or zh-cn
    const actualPath = pathParts.slice(1).join('/'); // 20250115/introducing-asdm
    
    // Only process if the route language matches current language
    if (routeLanguage !== language) {
      setCurrentBlog(null);
      return;
    }

    const blog = findBlogByRoutePath(actualPath, blogs);
    if (blog && siteTree) {
      setContentLoading(true);
      // Use language-specific blog root for content loading
      const blogContentRoot = `${getBlogRoot()}/content`;
      loadBlogContent(blog, blogContentRoot, setBlogs)
        .then(loadedBlog => {
          setCurrentBlog(loadedBlog);
        })
        .catch(error => {
          console.error('Error loading blog content:', error);
          setCurrentBlog(blog); // Set blog without content
        })
        .finally(() => {
          setContentLoading(false);
        });
    } else {
      setCurrentBlog(null);
    }
  }, [routePath, blogs, siteTree, language]);

  const handleBack = () => {
    navigate('/blog');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10">
          <Header />
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-300 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading blog...</p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // If no route path, redirect to main blog page
  if (!routePath) {
    navigate('/blog');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />
        <BlogContent
          currentBlog={currentBlog}
          contentLoading={contentLoading}
          onBack={handleBack}
        />
        <Footer />
      </div>
    </div>
  );
};

// Main component that provides the language context
const BlogReader: React.FC = () => {
  return (
    <BlogReaderLanguageProvider>
      <BlogReaderContent />
    </BlogReaderLanguageProvider>
  );
};

export default BlogReader;