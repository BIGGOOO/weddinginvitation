
import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Audio source: Soft, elegant instrumental wedding music
  const audioUrl = "https://www.bensound.com/bensound-music/bensound-love.mp3"; 

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        console.log("Audio playback failed:", err);
      });
      setIsPlaying(true);
    }
    setHasInteracted(true);
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setHasInteracted(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const attemptPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setHasInteracted(true);
      } catch (err) {
        console.log("Autoplay blocked by browser. Awaiting user interaction.");
      }
    };

    attemptPlay();

    const handleFirstInteraction = () => {
      if (!isPlaying) {
        attemptPlay();
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);

    return () => {
      if (audio) {
        audio.pause();
      }
      cleanupListeners();
    };
  }, [isPlaying]);

  return (
    <div className="fixed bottom-8 left-8 z-[60] flex items-center gap-2">
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        autoPlay
        preload="auto"
      />
      
      <div className="flex items-center gap-2 p-1 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-2xl">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying 
              ? 'bg-maroon text-white animate-pulse-soft' 
              : 'text-maroon hover:bg-slate-100'
          }`}
          aria-label={isPlaying ? "Pause Ambiance Music" : "Play Ambiance Music"}
          title={isPlaying ? "Pause Music" : "Play Music"}
        >
          <div className="relative">
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )}
            
            {isPlaying && (
              <>
                <span className="absolute -top-4 -right-1 text-maroon text-[10px] animate-bounce delay-75">♪</span>
                <span className="absolute -top-3 -left-3 text-maroon text-xs animate-bounce">♫</span>
              </>
            )}
          </div>
        </button>

        {/* Stop Button */}
        <button
          onClick={handleStop}
          className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-maroon hover:bg-slate-100 transition-all duration-300"
          aria-label="Stop Ambiance Music"
          title="Stop Music"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        </button>
      </div>

      {!hasInteracted && !isPlaying && (
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-100 shadow-xl animate-in fade-in slide-in-from-left-4 duration-1000">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Play Ambiance</p>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
