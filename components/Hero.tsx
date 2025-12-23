import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 neural-bg">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-100 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="mb-6 inline-block">
          <span className="mono text-xs tracking-widest uppercase text-slate-400 bg-white/50 px-3 py-1 rounded-full border border-slate-200">
            System Initialization: 2026.02.03
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl mb-6 text-slate-800 tracking-tight leading-none px-4">
          Noor Fatima Memon <span className="text-slate-300 font-light">&</span> Muhammad Danial Siddiqui
        </h1>
        <p className="serif text-xl md:text-2xl text-slate-500 italic mb-12">
          Converging in Love, Synchronized in Purpose
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <a href="#rsvp" className="px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-xl hover:shadow-indigo-200/50">
            Send RSVP
          </a>
          <a href="#venue" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
            Event Logistics
          </a>
        </div>

        <div className="mt-20 flex flex-col items-center">
          <div className="w-px h-24 bg-gradient-to-b from-slate-200 to-transparent"></div>
          <span className="mt-4 mono text-[10px] text-slate-400 uppercase tracking-tighter">Scroll to Explore Neural Network</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;