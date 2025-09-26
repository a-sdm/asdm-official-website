// Define the available languages
export type LanguageCode = 'en-us' | 'zh-cn';

// Define the language context type
export interface DocsReaderLanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, component?: string) => string;
  loadTranslations: (component: string) => Promise<void>;
  isLoaded: (component: string) => boolean;
}

// Cache for loaded translations
export type TranslationsCache = {
  [language: string]: {
    [component: string]: Record<string, any>;
  };
};