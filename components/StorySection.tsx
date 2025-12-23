import React from 'react';

const StorySection: React.FC = () => {
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
            <h2 className="text-4xl text-maroon serif">Our Story of Neural Connection</h2>
          </div>

          <div className="flex items-center">
            <p className="serif text-xl md:text-2xl leading-relaxed text-slate-700 italic text-center mx-auto max-w-3xl">
              “I met her at a moment when I did not realize my life was about to rewire itself. What began as a simple interaction slowly grew into something deeply meaningful, as if our thoughts and emotions were connecting in the most natural way, heart to heart. With every conversation, our bond became stronger, building trust, warmth, and a love that felt effortless and meant to be. Somewhere between shared smiles and quiet understanding, I realized she is my life, my half, my world, and in that moment, our journey together truly began.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;