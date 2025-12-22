import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Events from './pages/Events';
import Photos from './pages/Photos';

type Page = 'home' | 'events' | 'photos';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Focus management for SPAs: help screen readers know page changed
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.focus();
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} />;
      case 'events': return <Events />;
      case 'photos': return <Photos />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header role="banner" className="fixed top-0 left-0 right-0 z-50 bg-[#FCFBF4]/80 backdrop-blur-md border-b border-slate-100">
        <nav role="navigation" aria-label="Primary Navigation" className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            role="button"
            tabIndex={0}
            aria-label="Lovely Invitation Home"
            className="text-2xl serif font-bold text-maroon cursor-pointer tracking-tight"
            onClick={() => setCurrentPage('home')}
            onKeyDown={(e) => e.key === 'Enter' && setCurrentPage('home')}
          >
            Danial & Noor
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => setCurrentPage('home')}
              aria-current={currentPage === 'home' ? 'page' : undefined}
              className={`text-[10px] md:text-xs uppercase tracking-widest font-medium nav-link ${currentPage === 'home' ? 'active text-maroon font-bold' : 'text-slate-500'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('events')}
              aria-current={currentPage === 'events' ? 'page' : undefined}
              className={`text-[10px] md:text-xs uppercase tracking-widest font-medium nav-link ${currentPage === 'events' ? 'active text-maroon font-bold' : 'text-slate-500'}`}
            >
              Events
            </button>
            <button 
              onClick={() => setCurrentPage('photos')}
              aria-current={currentPage === 'photos' ? 'page' : undefined}
              className={`text-[10px] md:text-xs uppercase tracking-widest font-medium nav-link ${currentPage === 'photos' ? 'active text-maroon font-bold' : 'text-slate-500'}`}
            >
              Photos
            </button>
          </div>
        </nav>
      </header>

      <main id="main-content" role="main" tabIndex={-1} className="flex-1 pt-20 outline-none">
        {renderPage()}
      </main>

      <footer role="contentinfo" className="py-16 px-6 bg-white border-t border-slate-100 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="serif text-2xl mb-4 text-maroon italic">“We look forward to celebrating with you”</h2>
          <p className="text-slate-900 font-semibold text-lg mb-2">Muhammad Danial Siddiqui & Noor Fatima Memon</p>
          <p className="text-slate-400 text-sm">Contact: <a href="mailto:hello@lovelyinvitation.com" className="hover:text-maroon underline">hello@lovelyinvitation.com</a></p>
          <div className="mt-8 pt-8 border-t border-slate-50">
            <p className="text-[10px] uppercase tracking-widest text-slate-300">
              Handcrafted for the union of two AI Engineers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;