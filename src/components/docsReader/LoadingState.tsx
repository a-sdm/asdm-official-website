import React, { useEffect } from 'react';
import { useDocsReaderLanguage } from './context/DocsReaderLanguageContext';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message, 
  size = 'medium' 
}) => {
  const { t, loadTranslations, isLoaded, language } = useDocsReaderLanguage();
  
  // Load translations for this component
  useEffect(() => {
    loadTranslations('LoadingState');
  }, [loadTranslations, language]);
  
  // Use provided message or default translation
  const displayMessage = message || t('loading', 'LoadingState');
  const spinnerSize = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className={`animate-spin rounded-full ${spinnerSize[size]} border-b-2 border-yellow-400 mx-auto mb-4`}></div>
        <p className="text-gray-400">{displayMessage}</p>
      </div>
    </div>
  );
};

export default LoadingState;