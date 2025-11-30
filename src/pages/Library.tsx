import { useEffect, useState } from 'react';
import { Download, ExternalLink, Package, Search, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

interface Toolset {
  id: string;
  name: string;
  description: string;
  version: string;
  downloadUrl: string;
  category?: string;
  tags?: string[];
  author?: string;
  homepage?: string;
}

interface RegistryData {
  version: string;
  toolsets: Toolset[];
}

export default function Library() {
  const navigate = useNavigate();
  const { t, loadTranslations, isLoaded, language } = useLanguage();
  const [toolsets, setToolsets] = useState<Toolset[]>([]);
  const [filteredToolsets, setFilteredToolsets] = useState<Toolset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Helper function to get translation or fallback
  const getText = (key: string, fallback: string) => {
    const translation = t(key, 'Library');
    return translation !== key ? translation : fallback;
  };
  
  // Load library page translations
  useEffect(() => {
    loadTranslations('Library');
  }, [language, loadTranslations]);

  // Fetch toolsets data
  useEffect(() => {
    const fetchToolsets = async () => {
      try {
        const response = await fetch('https://asdm.ai/repo/toolsets-repo/registry.json');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: RegistryData = await response.json();
        setToolsets(data.toolsets);
        setFilteredToolsets(data.toolsets);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch toolsets:', err);
        setError(getText('fetchError', 'Failed to load toolsets. Please try again later.'));
        setLoading(false);
      }
    };

    fetchToolsets();
  }, [t, isLoaded]);

  // Filter toolsets based on search term and category
  useEffect(() => {
    let result = toolsets;
    
    if (searchTerm) {
      result = result.filter(toolset => 
        toolset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        toolset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (toolset.tags && toolset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(toolset => toolset.category === selectedCategory);
    }
    
    setFilteredToolsets(result);
  }, [toolsets, searchTerm, selectedCategory]);

  const handleDownload = (toolset: Toolset) => {
    window.open(`https://asdm.ai/repo/toolsets-repo/${toolset.downloadUrl}`, '_blank');
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    
    const fetchToolsets = async () => {
      try {
        const response = await fetch('https://asdm.ai/repo/toolsets-repo/registry.json');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: RegistryData = await response.json();
        setToolsets(data.toolsets);
        setFilteredToolsets(data.toolsets);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch toolsets:', err);
        setError(getText('fetchError', 'Failed to load toolsets. Please try again later.'));
        setLoading(false);
      }
    };

    fetchToolsets();
  };

  const categories = ['all', 'development', 'testing', 'deployment', 'monitoring'];

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
                {getText('title', 'ASDM')}
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                {getText('subtitle', 'Toolset Library')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-200 mb-6 max-w-4xl mx-auto leading-relaxed">
              {getText('description', 'Discover and download toolsets to enhance your ASDM development workflow. Each toolset is carefully crafted to address specific development needs.')}
            </p>
            
            {/* Toolset Explanation Section */}
            <div className="max-w-5xl mx-auto mb-8">
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
                    {language === 'zh-cn' ? '什么是工具包？' : 'What is a Toolset?'}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {getText('detailedDescription', language === 'zh-cn' ? '工具包（Toolset）是ASDM的交付单元，每个工具包都是一个可以独立开发、测试、打包和持续交付的模块。工具包被设计成独立于工作空间（workspace）的模式，不依赖于任何特定的工作空间。' : 'A Toolset is the delivery unit of ASDM. Each toolset is a module that can be independently developed, tested, packaged, and continuously delivered. Toolsets are designed to be independent of workspaces and do not rely on any specific workspace.')}
                  </p>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg sm:text-xl font-semibold text-white mb-3">
                    {language === 'zh-cn' ? '广泛兼容性' : 'Wide Compatibility'}
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {getText('compatibility', language === 'zh-cn' ? '任何ASDM工具包都可以在各类AI Coding工具中运行，包括：Claude Code CLI/插件，GitHub Copilot，OpenAI Codex，Cursor，Cline, Trae，CodeBuddy，Tongyi等；同时也可以在非AI Coding环境中运行，比如：Claude Desktop，Claude.ai，GitHub Coding Agent，Cursor Background Agent等。' : 'Any ASDM toolset can run in various AI Coding tools, including: Claude Code CLI/Plugins, GitHub Copilot, OpenAI Codex, Cursor, Cline, Trae, CodeBuddy, Tongyi, etc. They can also run in non-AI Coding environments, such as: Claude Desktop, Claude.ai, GitHub Coding Agent, Cursor Background Agent, etc.')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={getText('searchPlaceholder', 'Search toolsets...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 transition-colors"
                  />
                </div>
                
                <button
                  onClick={handleRefresh}
                  className="bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-white hover:bg-gray-700 transition-colors flex items-center justify-center"
                  title={getText('refresh', 'Refresh')}
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900'
                        : 'bg-gray-800/70 border border-gray-700 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {getText(`category.${category}`, category.charAt(0).toUpperCase() + category.slice(1))}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Toolsets List Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300 mb-4"></div>
                <p className="text-gray-400">{getText('loading', 'Loading toolsets...')}</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 mb-8 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
                >
                  {getText('tryAgain', 'Try Again')}
                </button>
              </div>
            ) : filteredToolsets.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  {getText('noResults.title', 'No toolsets found')}
                </h3>
                <p className="text-gray-400 mb-6">
                  {getText('noResults.description', 'Try adjusting your search or filter criteria')}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 px-6 py-2 rounded-lg hover:from-yellow-400 hover:to-amber-500 transition-colors font-medium"
                >
                  {getText('clearFilters', 'Clear Filters')}
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredToolsets.map((toolset) => (
                  <div key={toolset.id} className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-yellow-300/50 transition-all transform hover:scale-105 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-gradient-to-r from-yellow-300 to-amber-400 p-2 rounded-lg">
                          <Package className="w-6 h-6 text-gray-900" />
                        </div>
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-400">
                          v{toolset.version}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-2">{toolset.name}</h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">{toolset.description}</p>
                      
                      {toolset.tags && toolset.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {toolset.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(toolset)}
                          className="flex-1 bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-900 py-2 px-4 rounded-lg hover:from-yellow-400 hover:to-amber-500 transition-all flex items-center justify-center font-medium"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {getText('download', 'Download')}
                        </button>
                        
                        {toolset.homepage && (
                          <button
                            onClick={() => window.open(toolset.homepage, '_blank')}
                            className="bg-gray-800 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors"
                            title={getText('viewHomepage', 'View Homepage')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-20 bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
              {getText('cta.title', 'Looking for Something Specific?')}
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              {getText('cta.description', 'Can\'t find the toolset you need? Let us know what you\'re looking for, and we\'ll consider adding it to our library.')}
            </p>
            <button
              onClick={() => navigate(`/docs/${language}/contribute`)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 font-medium flex items-center space-x-2 mx-auto"
            >
              <span>{getText('cta.button', 'Request a Toolset')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}