import React from 'react';

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
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error loading documentation:</strong>
          <span className="block sm:inline"> {message}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors font-semibold"
            >
              Try Again
            </button>
          )}
          <button
            onClick={onNavigateHome}
            className="bg-gradient-to-r from-yellow-400 to-red-500 text-black px-4 py-2 rounded hover:from-yellow-500 hover:to-red-600 transition-colors font-semibold"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;