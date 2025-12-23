import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'pulsing' | 'opening' | 'complete'>('pulsing');
  const [statusText, setStatusText] = useState('Initializing Hearts...');

  useEffect(() => {
    const statusMessages = [
      'Synchronizing Heartbeats...',
      'Aligning Neural Networks...',
      'Loading Our Story...',
      'Welcome to Our Journey'
    ];

    let messageIdx = 0;
    const messageInterval = setInterval(() => {
      if (messageIdx < statusMessages.length) {
        setStatusText(statusMessages[messageIdx]);
        messageIdx++;
      }
    }, 800);

    const openingTimeout = setTimeout(() => {
      setStage('opening');
    }, 3500);

    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(openingTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#FCFBF4] flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${stage === 'opening' ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-maroon/5 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Heart Container */}
        <div className={`relative transition-all duration-1000 ease-in-out ${stage === 'opening' ? 'scale-[20] opacity-0' : 'scale-100 opacity-100'}`}>
          {/* The Heart Shape */}
          <div className="relative w-32 h-32 md:w-48 md:h-48">
             {/* Left Half */}
             <div 
               className={`absolute top-0 left-0 w-1/2 h-full bg-maroon rounded-t-full origin-bottom transition-transform duration-1000 ${stage === 'opening' ? '-translate-x-full' : ''}`}
               style={{ borderRadius: '50% 50% 0 0', transform: 'rotate(-45deg)', left: '15%' }}
             ></div>
             {/* Right Half */}
             <div 
               className={`absolute top-0 right-0 w-1/2 h-full bg-maroon rounded-t-full origin-bottom transition-transform duration-1000 ${stage === 'opening' ? 'translate-x-full' : ''}`}
               style={{ borderRadius: '50% 50% 0 0', transform: 'rotate(45deg)', right: '15%' }}
             ></div>
             
             {/* Pulsing Core */}
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-8 h-8 bg-white/20 rounded-full animate-ping"></div>
             </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className={`mt-12 text-center transition-all duration-700 ${stage === 'opening' ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
          <p className="serif text-2xl text-maroon italic mb-4">{statusText}</p>
          <div className="w-48 h-1 bg-slate-100 mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-maroon animate-loading-bar"></div>
          </div>
          <p className="mt-4 mono text-[10px] uppercase tracking-[0.4em] text-slate-400">Noor & Danial • 2026</p>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; transform: translateX(50%); }
          100% { width: 100%; transform: translateX(200%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;