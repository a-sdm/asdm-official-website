import React, { useEffect } from 'react';
import { useDocsReaderLanguage } from './context/DocsReaderLanguageContext';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  onNavigateHome: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message, 
  onRetry, 
  onNavigateHome 
}) => {
  const { t, loadTranslations, isLoaded, language } = useDocsReaderLanguage();
  
  // Load translations for this component
  useEffect(() => {
    loadTranslations('ErrorState');
  }, [loadTranslations, language]);
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">{t('errorLoadingDocumentation', 'ErrorState')}</strong>
          <span className="block sm:inline"> {message}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors font-semibold"
            >
              {t('tryAgain', 'ErrorState')}
            </button>
          )}
          <button
            onClick={onNavigateHome}
            className="bg-gradient-to-r from-yellow-400 to-red-500 text-black px-4 py-2 rounded hover:from-yellow-500 hover:to-red-600 transition-colors font-semibold"
          >
            {t('returnToHome', 'ErrorState')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;