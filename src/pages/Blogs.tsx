import React, { useEffect } from 'react';
import { Calendar, User, ArrowRight, Code, Zap, Users, Brain, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

interface BlogPost {
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  icon: React.ReactNode;
  path: string;
  tags: string[];
}

interface BlogData {
  docRoot: string;
  documents: {
    title: string;
    path: string;
    description: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    tags: string[];
    icon: string;
  }[];
}

export default function Blogs() {
  const navigate = useNavigate();
  const { t, loadTranslations, isLoaded, language } = useLanguage();
  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Load blog page translations
  useEffect(() => {
    loadTranslations('Blogs');
  }, [language, loadTranslations]);

  // Load blog posts from YAML file
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const response = await fetch('/blogs/content/site-tree.yml');
        const yamlText = await response.text();
        
        // Simple YAML parser for our specific structure
        const lines = yamlText.split('\n');
        const documents: BlogPost[] = [];
        let currentDoc: any = {};
        let inDocuments = false;
        
        for (const line of lines) {
          const trimmed = line.trim();
          
          if (trimmed === 'documents:') {
            inDocuments = true;
            continue;
          }
          
          if (!inDocuments) continue;
          
          if (trimmed.startsWith('- title:')) {
            if (currentDoc.title) {
              documents.push(createBlogPost(currentDoc));
            }
            currentDoc = { title: trimmed.replace('- title:', '').replace(/"/g, '').trim() };
          } else if (trimmed.startsWith('path:')) {
            currentDoc.path = trimmed.replace('path:', '').trim();
          } else if (trimmed.startsWith('description:')) {
            currentDoc.description = trimmed.replace('description:', '').replace(/"/g, '').trim();
          } else if (trimmed.startsWith('category:')) {
            currentDoc.category = trimmed.replace('category:', '').replace(/"/g, '').trim();
          } else if (trimmed.startsWith('author:')) {
            currentDoc.author = trimmed.replace('author:', '').replace(/"/g, '').trim();
          } else if (trimmed.startsWith('date:')) {
            currentDoc.date = trimmed.replace('date:', '').replace(/"/g, '').trim();
          } else if (trimmed.startsWith('readTime:')) {
            currentDoc.readTime = trimmed.replace('readTime:', '').replace(/"/g, '').trim();
          } else if (trimmed.startsWith('icon:')) {
            currentDoc.icon = trimmed.replace('icon:', '').replace(/"/g, '').trim();
          } else if (trimmed.startsWith('tags:')) {
            currentDoc.tags = [];
          } else if (trimmed.startsWith('-') && currentDoc.tags) {
            currentDoc.tags.push(trimmed.replace('-', '').replace(/"/g, '').trim());
          }
        }
        
        // Add the last document
        if (currentDoc.title) {
          documents.push(createBlogPost(currentDoc));
        }
        
        setBlogPosts(documents);
      } catch (error) {
        console.error('Error loading blog posts:', error);
        // Fallback to empty array
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  const createBlogPost = (doc: any): BlogPost => {
    const getIconComponent = (iconName: string) => {
      switch (iconName) {
        case 'brain': return <Brain className="w-5 h-5" />;
        case 'code': return <Code className="w-5 h-5" />;
        case 'zap': return <Zap className="w-5 h-5" />;
        case 'users': return <Users className="w-5 h-5" />;
        case 'lightbulb': return <Lightbulb className="w-5 h-5" />;
        default: return <Brain className="w-5 h-5" />;
      }
    };

    return {
      title: doc.title,
      description: doc.description,
      author: doc.author,
      date: doc.date,
      readTime: doc.readTime,
      category: doc.category,
      icon: getIconComponent(doc.icon),
      path: doc.path,
      tags: doc.tags || []
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Framework': 'bg-yellow-300/10 text-yellow-300 border-yellow-300/20',
      'Best Practices': 'bg-blue-300/10 text-blue-300 border-blue-300/20',
      'Productivity': 'bg-green-300/10 text-green-300 border-green-300/20',
      'Collaboration': 'bg-purple-300/10 text-purple-300 border-purple-300/20',
      'Implementation': 'bg-orange-300/10 text-orange-300 border-orange-300/20'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-300/10 text-gray-300 border-gray-300/20';
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                {isLoaded('Blogs') ? t('hero.title', 'Blogs') : 'ASDM Blog'}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              {isLoaded('Blogs') ? t('hero.subtitle', 'Blogs') : 'Insights, updates, and best practices for AI-powered development methodology.'}
            </p>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-300"></div>
                <p className="text-gray-300 mt-4">Loading blog posts...</p>
              </div>
            ) : (
              <div className="grid gap-8 md:gap-12">
                {blogPosts.map((post, index) => (
                <article 
                  key={index}
                  className="bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-[1.02] cursor-pointer group"
                  onClick={() => {
                    // Navigate to the individual blog post
                    const routePath = post.path.replace(/\.md$/, '');
                    navigate(`/blog/${routePath}`);
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                    {/* Content */}
                    <div className="flex-1">
                      {/* Category and Meta */}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                          {post.icon}
                          <span>{post.category}</span>
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white group-hover:text-yellow-300 transition-colors">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {post.description}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center space-x-2 text-yellow-300 group-hover:text-yellow-400 transition-colors">
                        <span className="font-medium">Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className="lg:w-48 lg:flex-shrink-0 mt-6 lg:mt-0">
                      <div className="bg-gradient-to-br from-yellow-300/10 to-amber-400/10 p-6 rounded-xl border border-yellow-300/20 backdrop-blur-sm h-32 lg:h-40 flex items-center justify-center">
                        <div className="text-yellow-300 opacity-50">
                          {React.cloneElement(post.icon as React.ReactElement, { 
                            className: "w-12 h-12 lg:w-16 lg:h-16" 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
                ))}
              </div>
            )}

            {/* Load More Section */}
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 px-8 py-4 rounded-lg border border-yellow-300 hover:from-yellow-400 hover:to-amber-500 transition-all transform hover:scale-105 font-semibold">
                {isLoaded('Blogs') ? t('loadMore', 'Blogs') : 'Load More Posts'}
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-20 bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
              {isLoaded('Blogs') ? t('newsletter.title', 'Blogs') : 'Stay Updated'}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              {isLoaded('Blogs') ? t('newsletter.description', 'Blogs') : 'Subscribe to our newsletter to get the latest insights on AI-powered development methodology delivered to your inbox.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder={isLoaded('Blogs') ? t('newsletter.placeholder', 'Blogs') : 'Enter your email'}
                className="w-full sm:flex-1 px-4 py-3 rounded-lg bg-black/40 border border-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300/50 backdrop-blur-sm"
              />
              <button className="w-full sm:w-auto bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 px-6 py-3 rounded-lg border border-yellow-300 hover:from-yellow-400 hover:to-amber-500 transition-all transform hover:scale-105 font-semibold">
                {isLoaded('Blogs') ? t('newsletter.subscribe', 'Blogs') : 'Subscribe'}
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}