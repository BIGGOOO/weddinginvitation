
import React, { useState, useEffect } from 'react';
import { generateStory } from '../services/geminiService';
import { StoryState } from '../types';

const OurStory: React.FC = () => {
  const [story, setStory] = useState<StoryState>({
    content: "Once upon a Git repository, two developers found a connection that no debugger could break...",
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
    <section id="story" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">The Initialization</h2>
          <div className="w-12 h-1 bg-rose-200 mx-auto"></div>
        </div>

        <div className="glass p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 relative">
          <div className="absolute -top-4 -left-4 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs mono">
            AI Storyteller Active
          </div>
          
          <div className={`transition-opacity duration-500 ${story.loading ? 'opacity-30' : 'opacity-100'}`}>
            <p className="serif text-xl leading-relaxed text-slate-700 italic">
              "{story.content}"
            </p>
          </div>

          {story.loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="mono text-[10px] text-slate-400 uppercase mb-4 text-center">Re-render our story in another dimension:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {(['classic', 'tech', 'poetic', 'sci-fi'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => fetchStory(s)}
                  disabled={story.loading}
                  className={`px-4 py-2 rounded-full text-xs mono transition-all border ${
                    story.style === s 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
