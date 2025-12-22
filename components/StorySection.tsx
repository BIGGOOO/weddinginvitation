
import React, { useState, useEffect } from 'react';
import { generateStory } from '../services/geminiService';
import { StoryState } from '../types';

const StorySection: React.FC = () => {
  const [story, setStory] = useState<StoryState>({
    content: "Calculating the optimal narrative path for two engineers...",
    loading: false,
    style: 'classic'
  });

  const fetchStory = async (style: StoryState['style']) => {
    setStory(prev => ({ ...prev, loading: true, style }));
    const newContent = await generateStory(style);
    setStory({ content: newContent, loading: false, style });
  };

  useEffect(() => {
    fetchStory('classic');
  }, []);

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="reveal bg-white rounded-[2rem] p-10 md:p-16 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none" aria-hidden="true">
            <pre className="text-[8px] mono text-slate-900">
              {`def merge(love, commitment):
    return love + commitment`}
            </pre>
          </div>
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-gold mb-2 block">Our Origin Story</span>
            <h2 className="text-4xl text-maroon">The Neural Connection</h2>
          </div>

          <div 
            className={`transition-opacity duration-500 min-h-[150px] flex items-center ${story.loading ? 'opacity-30' : 'opacity-100'}`}
            aria-live="polite"
          >
            <p className="serif text-2xl leading-relaxed text-slate-700 italic text-center mx-auto max-w-2xl">
              “{story.content}”
            </p>
          </div>

          {story.loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50" aria-label="Loading our story...">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}

          <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col items-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-6 font-bold">Adjust Narrative Parameters</p>
            <div className="flex flex-wrap justify-center gap-4" role="group" aria-label="Select story style">
              {(['classic', 'tech', 'poetic', 'sci-fi'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => fetchStory(s)}
                  disabled={story.loading}
                  aria-pressed={story.style === s}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all border ${
                    story.style === s 
                    ? 'bg-maroon text-white border-maroon shadow-md' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-gold hover:text-gold'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
