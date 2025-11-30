import React, { useEffect, useRef, useState } from 'react';
import { Brain, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ParadigmTransitionProps {
  className?: string;
}

const ParadigmTransition: React.FC<ParadigmTransitionProps> = ({ className = '' }) => {
  const { t, isLoaded } = useLanguage();
  const [phase, setPhase] = useState<'human' | 'transitioning' | 'ai'>('human');
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-animate through phases
    const startAnimation = () => {
      intervalRef.current = setInterval(() => {
        setPhase(currentPhase => {
          if (currentPhase === 'human') return 'transitioning';
          if (currentPhase === 'transitioning') return 'ai';
          return 'human';
        });
      }, 3000);
    };

    // Delay initial animation start
    const timeoutId = setTimeout(startAnimation, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handlePhaseChange = (newPhase: 'human' | 'ai') => {
    if (newPhase !== phase && phase !== 'transitioning') {
      setPhase('transitioning');
      setTimeout(() => setPhase(newPhase), 500);
    }
  };

  return (
    <div className={`paradigm-transition ${className}`}>
      <div className="flex justify-center items-center space-x-8 sm:space-x-16">
        {/* Human Side */}
        <div 
          className={`flex flex-col items-center cursor-pointer transition-all duration-500 ${
            phase === 'human' ? 'scale-110 opacity-100' : phase === 'ai' ? 'scale-90 opacity-60' : 'scale-95 opacity-80'
          }`}
          onClick={() => handlePhaseChange('human')}
        >
          <div className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-700 ${
            phase === 'human' 
              ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/50' 
              : 'bg-gradient-to-br from-gray-600 to-gray-800'
          }`}>
            <User className={`w-12 h-12 sm:w-16 sm:h-16 ${phase === 'human' ? 'text-white' : 'text-gray-400'}`} />
            {phase === 'human' && (
              <div className="absolute -inset-1 rounded-full bg-blue-500 opacity-30 animate-pulse"></div>
            )}
          </div>
          <span className={`mt-4 font-medium transition-all duration-500 ${
            phase === 'human' ? 'text-white text-lg' : 'text-gray-400 text-base'
          }`}>
            {isLoaded('Home') && t('paradigm.human.title', 'Home') ? t('paradigm.human.title', 'Home').split(' ')[0] + '设计' : '为人类设计'}
          </span>
          <span className={`mt-1 text-xs transition-all duration-500 ${
            phase === 'human' ? 'text-blue-300' : 'text-gray-500'
          }`}>
            Human-Centric
          </span>
        </div>

        {/* Transition Arrow */}
        <div className={`transition-all duration-700 ${phase === 'transitioning' ? 'scale-125' : 'scale-100'}`}>
          <div className={`h-1 w-16 sm:w-24 rounded-full transition-all duration-700 ${
            phase === 'human' 
              ? 'bg-gradient-to-r from-blue-500 to-gray-600' 
              : phase === 'ai' 
                ? 'bg-gradient-to-r from-gray-600 to-purple-500' 
                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-purple-500'
          }`}></div>
          <div className="flex justify-center -mt-2">
            <div className={`w-6 h-6 rounded-full bg-gray-900 border-2 transition-all duration-700 ${
              phase === 'human' 
                ? 'border-blue-500' 
                : phase === 'ai' 
                  ? 'border-purple-500' 
                  : 'border-purple-500'
            }`}>
              <div className={`w-full h-full rounded-full transition-all duration-700 ${
                phase === 'transitioning' ? 'bg-purple-500 animate-pulse' : ''
              }`}></div>
            </div>
          </div>
        </div>

        {/* AI Side */}
        <div 
          className={`flex flex-col items-center cursor-pointer transition-all duration-500 ${
            phase === 'ai' ? 'scale-110 opacity-100' : phase === 'human' ? 'scale-90 opacity-60' : 'scale-95 opacity-80'
          }`}
          onClick={() => handlePhaseChange('ai')}
        >
          <div className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-700 ${
            phase === 'ai' 
              ? 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg shadow-purple-500/50' 
              : 'bg-gradient-to-br from-gray-600 to-gray-800'
          }`}>
            <Brain className={`w-12 h-12 sm:w-16 sm:h-16 ${phase === 'ai' ? 'text-white' : 'text-gray-400'}`} />
            {phase === 'ai' && (
              <div className="absolute -inset-1 rounded-full bg-purple-500 opacity-30 animate-pulse"></div>
            )}
          </div>
          <span className={`mt-4 font-medium transition-all duration-500 ${
            phase === 'ai' ? 'text-white text-lg' : 'text-gray-400 text-base'
          }`}>
            {isLoaded('Home') && t('paradigm.ai.title', 'Home') ? t('paradigm.ai.title', 'Home').split(' ')[0] + '设计' : '为AI设计'}
          </span>
          <span className={`mt-1 text-xs transition-all duration-500 ${
            phase === 'ai' ? 'text-purple-300' : 'text-gray-500'
          }`}>
            AI-Centric
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 text-center max-w-2xl mx-auto">
        {phase === 'human' && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium text-blue-400 mb-2">
              {isLoaded('Home') ? t('paradigm.human.title', 'Home') : 'Human-Centric Design'}
            </h3>
            <p className="text-gray-300 text-sm">
              {isLoaded('Home') ? t('paradigm.human.description', 'Home') : 'Traditional system design focuses on human interaction experiences, meeting user needs through graphical interfaces and visual operations.'}
            </p>
          </div>
        )}
        {phase === 'transitioning' && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium text-purple-400 mb-2">
              {isLoaded('Home') ? t('paradigm.transition.title', 'Home') : 'Paradigm Shift'}
            </h3>
            <p className="text-gray-300 text-sm">
              {isLoaded('Home') ? t('paradigm.transition.description', 'Home') : 'The AI era requires fundamentally rethinking system design, shifting from human usage to AI understanding and execution.'}
            </p>
          </div>
        )}
        {phase === 'ai' && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium text-purple-400 mb-2">
              {isLoaded('Home') ? t('paradigm.ai.title', 'Home') : 'AI-Centric Design'}
            </h3>
            <p className="text-gray-300 text-sm">
              {isLoaded('Home') ? t('paradigm.ai.description', 'Home') : 'In the new paradigm, systems prioritize AI comprehension and processing efficiency, maximizing AI capabilities through text interfaces and structured data.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParadigmTransition;