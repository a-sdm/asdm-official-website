import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the available languages
export type LanguageCode = 'en-us' | 'zh-cn';

// Define the language context type
interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, component?: string) => string;
  loadTranslations: (component: string) => Promise<void>;
  isLoaded: (component: string) => boolean;
}

// Create the context with default values
export const LanguageContext = createContext<LanguageContextType>({
  language: 'en-us',
  setLanguage: () => {},
  t: () => '',
  loadTranslations: async () => {},
  isLoaded: () => false,
});

// Cache for loaded translations
type TranslationsCache = {
  [language: string]: {
    [component: string]: Record<string, any>;
  };
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial language from localStorage or default to English
  const [language, setLanguage] = useState<LanguageCode>(
    () => (localStorage.getItem('language') as LanguageCode) || 'en-us'
  );
  
  // Cache for loaded translations
  const [translationsCache, setTranslationsCache] = useState<TranslationsCache>({
    'en-us': {},
    'zh-cn': {}
  });

  // Function to change language
  const changeLanguage = (newLanguage: LanguageCode) => {
    localStorage.setItem('language', newLanguage);
    setLanguage(newLanguage);
  };

  // Function to load translations for a specific component
  const loadTranslations = async (component: string): Promise<void> => {
    // Skip if already loaded
    if (translationsCache[language][component]) {
      return;
    }

    try {
      // Dynamic import of the JSON file with PascalCase component name
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

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage, 
      t: translate,
      loadTranslations,
      isLoaded
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}