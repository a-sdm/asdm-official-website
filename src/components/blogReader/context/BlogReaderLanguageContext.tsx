import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

// Define paths for language-specific blog roots
export const LANGUAGE_BLOG_ROOTS = {
  'en-us': '/blogs/en-us',
  'zh-cn': '/blogs/zh-cn'
};

// Define the available languages
export type LanguageCode = 'en-us' | 'zh-cn';

// Define the language context type
interface BlogReaderLanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, component?: string) => string;
  loadTranslations: (component: string) => Promise<void>;
  isLoaded: (component: string) => boolean;
  getBlogRoot: () => string;
}

// Create the context with default values
const BlogReaderLanguageContextValue = createContext<BlogReaderLanguageContextType>({
  language: 'en-us',
  setLanguage: () => {},
  t: () => '',
  loadTranslations: async () => {},
  isLoaded: () => false,
  getBlogRoot: () => LANGUAGE_BLOG_ROOTS['en-us'],
});

// Cache for loaded translations
type TranslationsCache = {
  [language: string]: {
    [component: string]: Record<string, any>;
  };
};

interface BlogReaderLanguageProviderProps {
  children: ReactNode;
}

const BlogReaderLanguageProviderComponent: React.FC<BlogReaderLanguageProviderProps> = ({ children }) => {
  // Get language from main app context to stay in sync
  const { language: mainAppLanguage } = useLanguage();
  const [language, setLanguage] = useState<LanguageCode>(mainAppLanguage);
  
  // Cache for loaded translations
  const [translationsCache, setTranslationsCache] = useState<TranslationsCache>({
    'en-us': {},
    'zh-cn': {}
  });

  // Sync with main app language changes
  useEffect(() => {
    setLanguage(mainAppLanguage);
  }, [mainAppLanguage]);

  // Function to change language (delegates to main app context)
  const changeLanguage = (newLanguage: LanguageCode) => {
    // This will be handled by the main app's language context
    // We don't change language directly here to maintain single source of truth
    console.warn('Language changes should be handled by the main app language context');
  };

  // Function to load translations for a specific component
  const loadTranslations = async (component: string): Promise<void> => {
    // Skip if already loaded
    if (translationsCache[language][component]) {
      return;
    }

    try {
      // Dynamic import of the JSON file with PascalCase component name
      // Note the path is relative to the blogReader directory
      const module = await import(`../locale/${language}/${component}.json`);
      
      // Update cache with the loaded translations
      setTranslationsCache(prevCache => ({
        ...prevCache,
        [language]: {
          ...prevCache[language],
          [component]: module.default || module
        }
      }));
    } catch (error) {
      console.error(`Failed to load translations for ${component} in ${language}:`, error);
    }
  };

  // Check if translations for a component are loaded
  const isLoaded = (component: string): boolean => {
    return !!translationsCache[language][component];
  };

  // Translation function
  const translate = (key: string, component?: string): string => {
    // If component is specified, use it; otherwise, parse from key
    const [componentName, ...keyParts] = component ? [component, ...key.split('.')] : key.split('.');
    const keyPath = component ? key : keyParts.join('.');
    
    // Check if translations for this component are loaded
    if (!translationsCache[language][componentName]) {
      return key; // Return key if translations aren't loaded yet
    }
    
    // Navigate through the nested properties
    const keys = keyPath.split('.');
    let value: any = translationsCache[language][componentName];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // If the key doesn't exist, return the key itself
        return key;
      }
    }
    
    return value;
  };

  // Function to get the blog root path for the current language
  const getBlogRoot = (): string => {
    return LANGUAGE_BLOG_ROOTS[language];
  };

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <BlogReaderLanguageContextValue.Provider value={{ 
      language, 
      setLanguage: changeLanguage, 
      t: translate,
      loadTranslations,
      isLoaded,
      getBlogRoot
    }}>
      {children}
    </BlogReaderLanguageContextValue.Provider>
  );
};

// Export the provider component
export const BlogReaderLanguageProvider = BlogReaderLanguageProviderComponent;

// Custom hook to use the language context
export function useBlogReaderLanguage() {
  const context = useContext(BlogReaderLanguageContextValue);
  if (context === undefined) {
    throw new Error('useBlogReaderLanguage must be used within a BlogReaderLanguageProvider');
  }
  return context;
}

// Export the context for use in other files
export const BlogReaderLanguageContext = BlogReaderLanguageContextValue;