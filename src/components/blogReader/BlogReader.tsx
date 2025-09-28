import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPost, BlogSiteTree } from './types';
import { parseYaml, findBlogByRoutePath, loadBlogContent } from './BlogUtils';
import BlogContent from './BlogContent';
import AnimatedBackground from '../AnimatedBackground';
import Header from '../Header';
import Footer from '../Footer';

const BlogReader: React.FC = () => {
  const { '*': routePath } = useParams();
  const navigate = useNavigate();
  
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
        const response = await fetch('/blogs/content/site-tree.yml');
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
  }, []);

  // Handle route changes and load specific blog content
  useEffect(() => {
    if (!routePath || blogs.length === 0) {
      setCurrentBlog(null);
      return;
    }

    const blog = findBlogByRoutePath(routePath, blogs);
    if (blog && siteTree) {
      setContentLoading(true);
      loadBlogContent(blog, siteTree.docRoot, setBlogs)
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
  }, [routePath, blogs, siteTree]);

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

export default BlogReader;