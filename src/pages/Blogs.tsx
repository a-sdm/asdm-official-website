import React, { useEffect } from 'react';
import { Calendar, User, ArrowRight, Code, Zap, Users, Brain, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  icon: React.ReactNode;
}

export default function Blogs() {
  const navigate = useNavigate();
  const { t, loadTranslations, isLoaded, language } = useLanguage();
  
  // Load blog page translations
  useEffect(() => {
    loadTranslations('Blogs');
  }, [language, loadTranslations]);

  // Example blog posts based on Home.tsx content
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Introducing ASDM: The Future of AI-Powered Development",
      excerpt: "Discover how our new framework revolutionizes development with AI-first principles, integrating intelligent automation from the ground up.",
      author: "ASDM Team",
      date: "2025-01-15",
      readTime: "5 min read",
      category: "Framework",
      icon: <Brain className="w-5 h-5" />
    },
    {
      id: 2,
      title: "Building AI-First Development Workflows",
      excerpt: "Learn how to integrate AI capabilities throughout your development lifecycle, from planning to deployment and maintenance.",
      author: "Sarah Chen",
      date: "2025-01-10",
      readTime: "8 min read",
      category: "Best Practices",
      icon: <Code className="w-5 h-5" />
    },
    {
      id: 3,
      title: "Enhancing Team Productivity with Intelligent Automation",
      excerpt: "Explore how AI-assisted development accelerates cycles with intelligent code generation, automated testing, and smart debugging.",
      author: "Michael Rodriguez",
      date: "2025-01-05",
      readTime: "6 min read",
      category: "Productivity",
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 4,
      title: "Fostering Human-AI Collaboration in Development Teams",
      excerpt: "Discover strategies for creating synergistic workflows between human developers and AI systems in modern development environments.",
      author: "Emily Johnson",
      date: "2024-12-28",
      readTime: "7 min read",
      category: "Collaboration",
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 5,
      title: "The Three-Step ASDM Implementation Guide",
      excerpt: "A comprehensive walkthrough of Assessment & Planning, Foundation Setup, and Implementation & Scaling phases of the ASDM methodology.",
      author: "David Kim",
      date: "2024-12-20",
      readTime: "10 min read",
      category: "Implementation",
      icon: <Lightbulb className="w-5 h-5" />
    }
  ];

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
            <div className="grid gap-8 md:gap-12">
              {blogPosts.map((post, index) => (
                <article 
                  key={post.id}
                  className="bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-[1.02] cursor-pointer group"
                  onClick={() => {
                    // In a real app, this would navigate to the individual blog post
                    console.log(`Navigate to blog post ${post.id}`);
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
                        {post.excerpt}
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