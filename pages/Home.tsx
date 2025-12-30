import React, { useEffect, useState } from 'react';
import StorySection from '../components/StorySection';
import CelebrationOverlay, { useCelebration } from '../components/Celebration';
import FloatingParticles from '../components/FloatingParticles';

interface HomeProps {
  onNavigate: (page: 'home' | 'events' | 'photos') => void;
  isWalimaOnly?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Home: React.FC<HomeProps> = ({ onNavigate, isWalimaOnly }) => {
  const [scrollY, setScrollY] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const { particles, trigger } = useCelebration();
  const [hasClickedComing, setHasClickedComing] = useState(false);
  
  const calculateTimeLeft = (): TimeLeft | null => {
    // If Walima only, countdown to Feb 7th
    const targetDate = new Date(isWalimaOnly ? '2026-02-07T19:00:00' : '2026-02-03T00:00:00').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isWalimaOnly]);

  const handleImComing = (e: React.MouseEvent) => {
    trigger(e.clientX, e.clientY);
    setHasClickedComing(true);
    localStorage.setItem('quick_rsvp_coming', 'true');
    setTimeout(() => setHasClickedComing(false), 3000);
  };

  return (
    <div className="animate-in fade-in duration-700 overflow-hidden relative">
      <FloatingParticles />
      <CelebrationOverlay particles={particles} />
      
      <section 
        className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')`,
          backgroundPosition: `center ${scrollY * 0.5}px`,
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-[#FCFBF4]/75"></div>
        <div className="relative z-10 max-w-5xl w-full">
          {isWalimaOnly && (
            <div className="mb-6 reveal">
              <span className="px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse">Exclusive Reception Protocol</span>
            </div>
          )}
          
          <h1 className="text-5xl sm:text-7xl md:text-9xl mb-6 sm:mb-8 text-maroon leading-tight reveal font-bold px-2">
            Two Hearts, One Journey
          </h1>
          
          <p className="serif text-base sm:text-xl md:text-3xl text-slate-700 italic mb-6 max-w-3xl mx-auto leading-relaxed reveal px-4" style={{ transitionDelay: '0.2s' }}>
            “With grateful hearts, together with our families, we invite you to celebrate our wedding and share in our joy.”
          </p>
          <p className="serif text-sm sm:text-lg md:text-xl text-maroon font-bold tracking-[0.2em] uppercase mb-8 sm:mb-12 reveal" style={{ transitionDelay: '0.4s' }}>
            {isWalimaOnly ? "7 February 2026 • Walima Reception" : "3 – 7 February 2026"}
          </p>

          <div 
            className="flex flex-col items-center mb-10 sm:mb-16 reveal px-2" 
            style={{ transitionDelay: '0.5s' }}
          >
            <div className="flex justify-center gap-3 sm:gap-6 md:gap-10 p-5 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-xl sm:shadow-2xl">
              {timeLeft ? (
                [
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Mins', value: timeLeft.minutes },
                  { label: 'Secs', value: timeLeft.seconds }
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center min-w-[55px] sm:min-w-[90px]">
                    <div className="relative">
                      <span className="text-3xl sm:text-6xl font-light text-maroon serif tracking-tighter">
                        {item.value.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[8px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-500 font-bold mt-2 sm:mt-3">
                      {item.label}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-2 px-6">
                  <span className="serif text-xl sm:text-3xl text-maroon animate-pulse uppercase tracking-widest">Live in Spirit</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 reveal px-4" style={{ transitionDelay: '0.7s' }}>
            <button 
              onClick={() => onNavigate('events')}
              className="w-full sm:w-auto px-10 py-4 sm:px-12 sm:py-5 bg-maroon text-white rounded-full hover:bg-[#600000] transition-all shadow-lg text-base sm:text-lg font-bold hover:scale-105 btn-shine uppercase tracking-widest"
            >
              Explore Events
            </button>

            <button 
              onClick={handleImComing}
              className={`w-full sm:w-auto group flex items-center justify-center gap-3 px-8 py-4 sm:py-5 bg-white text-maroon border border-maroon/20 rounded-full hover:border-maroon transition-all shadow-md hover:shadow-lg font-bold uppercase tracking-widest text-xs sm:text-sm relative overflow-hidden ${hasClickedComing ? 'scale-105 border-maroon' : ''}`}
            >
              <span className={`text-xl transition-transform group-hover:scale-125 ${hasClickedComing ? 'animate-bounce' : 'animate-pulse-soft'}`}>
                {hasClickedComing ? '❤️' : '💖'}
              </span>
              <span>{hasClickedComing ? "See You Soon!" : "I'm Coming!"}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl mb-6 sm:mb-8 text-maroon reveal">Welcome</h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-10 sm:mb-12 reveal" style={{ transitionDelay: '0.2s' }}>
            As engineers who have spent years designing systems, we've learned that the most meaningful connection is not built with code, but with hearts. We are truly honored to welcome you to this celebration of our union.
          </p>
          <div className="w-20 h-px bg-gold mx-auto reveal" style={{ transitionDelay: '0.4s' }}></div>
        </div>
      </section>

      <StorySection />

      <section className="py-16 sm:py-24 px-6 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { title: isWalimaOnly ? "Walima Reception" : "4 Days of Joy", desc: isWalimaOnly ? "A night of elegance and gratitude." : "A journey from prayers to parties.", icon: "✨" },
              { title: "Event Timeline", desc: isWalimaOnly ? "The evening protocol for February 7th." : "Complete schedule from Feb 3rd to 7th.", icon: "📅" },
              { title: "Event Locations", desc: "Digital maps for your physical transit.", icon: "📍" },
              { title: "RSVP Active", desc: "Please confirm your presence in our stack.", icon: "✉️" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-8 sm:p-10 border border-slate-100 rounded-3xl text-center hover:border-gold transition-all group reveal bg-slate-50/30"
                style={{ transitionDelay: `${idx * 0.1}s` }}
              >
                <div className="text-3xl sm:text-4xl mb-4 sm:mb-6 transition-all group-hover:scale-110" aria-hidden="true">{item.icon}</div>
                <h3 className="serif text-lg sm:text-xl mb-2 sm:mb-3 text-maroon">{item.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;