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
  const { language: routeLanguage, '*': routePath } = useParams();
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
        const blogRoot = getBlogRoot();
        console.log('Loading blog site tree for language:', language, 'from:', `${blogRoot}/site-tree.yml`);
        
        const response = await fetch(`${blogRoot}/site-tree.yml`);
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
        
        console.log('Loaded blog posts:', blogPosts.map(b => ({ title: b.title, path: b.path })));
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

    // Extract language from route params and use wildcard as the actual path
    const actualPath = routePath; // e.g., 20250115/productivity-automation
    
    // Validate that we have a valid language and path
    if (!routeLanguage || !actualPath) {
      setCurrentBlog(null);
      return;
    }

    // Find the blog post using the actual path (without language prefix)
    console.log('Looking for blog with path:', actualPath);
    console.log('Available blogs:', blogs.map(b => ({ title: b.title, path: b.path })));
    
    const blog = findBlogByRoutePath(actualPath, blogs);
    console.log('Found blog:', blog ? { title: blog.title, path: blog.path } : 'null');
    
    if (blog && siteTree) {
      setContentLoading(true);
      // Use language-specific blog root for content loading
      const blogContentRoot = `${getBlogRoot()}/content`;
      console.log('Loading content from:', blogContentRoot);
      
      loadBlogContent(blog, blogContentRoot, setBlogs)
        .then(loadedBlog => {
          console.log('Successfully loaded blog content');
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
      console.log('Blog not found:', { 
        actualPath, 
        routeLanguage,
        currentLanguage: language,
        availableBlogs: blogs.map(b => ({ title: b.title, path: b.path })),
        siteTreeExists: !!siteTree
      });
      setCurrentBlog(null);
    }
  }, [routePath, blogs, siteTree, language, getBlogRoot]);

  const handleBack = () => {
    navigate(`/blog/${language}`);
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