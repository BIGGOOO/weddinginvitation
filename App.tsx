import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Events from './pages/Events';
import Photos from './pages/Photos';
import LoadingScreen from './components/LoadingScreen';
import CelebrationOverlay, { useCelebration } from './components/Celebration';

type Page = 'home' | 'events' | 'photos';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { particles, trigger, triggerPageChange } = useCelebration();

  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.focus();
      triggerPageChange();
    }
  }, [currentPage, isLoading]);

  const handleLogoClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if ('clientX' in e) {
      trigger(e.clientX, e.clientY);
    } else {
      trigger(window.innerWidth / 2, 40);
    }
    setCurrentPage('home');
  };

  const handleNavClick = (page: Page) => {
    if (currentPage !== page) {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} />;
      case 'events': return <Events />;
      case 'photos': return <Photos />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative animate-in fade-in duration-1000">
      <CelebrationOverlay particles={particles} />
      
      <header role="banner" className="fixed top-0 left-0 right-0 z-50 bg-[#FCFBF4]/90 backdrop-blur-md border-b border-slate-100">
        <nav role="navigation" aria-label="Primary Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div 
            role="button"
            tabIndex={0}
            aria-label="Noor and Danial Wedding Home"
            className="text-xl sm:text-2xl serif font-bold text-maroon cursor-pointer tracking-tight hover:scale-105 transition-transform active:scale-95"
            onClick={handleLogoClick}
            onKeyDown={(e) => e.key === 'Enter' && handleLogoClick(e)}
          >
            Noor & Danial
          </div>
          <div className="flex items-center gap-3 sm:gap-8">
            <button 
              onClick={() => handleNavClick('home')}
              className={`text-[9px] sm:text-xs uppercase tracking-widest font-bold nav-link ${currentPage === 'home' ? 'active text-maroon' : 'text-slate-500'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('events')}
              className={`text-[9px] sm:text-xs uppercase tracking-widest font-bold nav-link ${currentPage === 'events' ? 'active text-maroon' : 'text-slate-500'}`}
            >
              Events
            </button>
            <button 
              onClick={() => handleNavClick('photos')}
              className={`text-[9px] sm:text-xs uppercase tracking-widest font-bold nav-link ${currentPage === 'photos' ? 'active text-maroon' : 'text-slate-500'}`}
            >
              Photos
            </button>
          </div>
        </nav>
      </header>

      <main id="main-content" role="main" tabIndex={-1} className="flex-1 pt-20 outline-none">
        {renderPage()}
      </main>

      <footer role="contentinfo" className="py-12 sm:py-16 px-6 bg-white border-t border-slate-100 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="serif text-xl sm:text-2xl mb-4 text-maroon italic">“We look forward to celebrating with you”</h2>
          <p className="text-slate-900 font-semibold text-base sm:text-lg mb-2">Noor Fatima Memon & Muhammad Danial Siddiqui</p>
          <p className="text-slate-400 text-xs sm:text-sm">Contact: <a href="tel:+923368273918" className="hover:text-maroon underline">+923368273918</a></p>
          <div className="mt-8 pt-8 border-t border-slate-50">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-300">
              Handcrafted for the union of two AI Engineers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;