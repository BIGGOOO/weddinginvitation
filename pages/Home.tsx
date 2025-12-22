import React, { useEffect, useState } from 'react';
import StorySection from '../components/StorySection';
import CelebrationOverlay, { useCelebration } from '../components/Celebration';
import FloatingParticles from '../components/FloatingParticles';

interface HomeProps {
  onNavigate: (page: 'home' | 'events' | 'photos') => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [scrollY, setScrollY] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const { particles, trigger } = useCelebration();
  const [hasClickedComing, setHasClickedComing] = useState(false);
  
  const calculateTimeLeft = (): TimeLeft | null => {
    const targetDate = new Date('2026-02-03T00:00:00').getTime();
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
  }, []);

  const handleImComing = (e: React.MouseEvent) => {
    trigger(e.clientX, e.clientY);
    setHasClickedComing(true);
    // Persist intent locally
    localStorage.setItem('quick_rsvp_coming', 'true');
    
    // Reset after a few seconds to allow multiple clicks if they want more fun
    setTimeout(() => setHasClickedComing(false), 3000);
  };

  return (
    <div className="animate-in fade-in duration-700 overflow-hidden relative">
      <FloatingParticles />
      <CelebrationOverlay particles={particles} />
      
      {/* Hero Section with Parallax */}
      <section 
        className="relative h-[95vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')`,
          backgroundPosition: `center ${scrollY * 0.5}px`,
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-[#FCFBF4]/65"></div>
        <div className="relative z-10 max-w-5xl">
          <h1 className="text-7xl md:text-9xl mb-8 text-maroon leading-tight reveal">Lovely Invitation</h1>
          
          <p className="serif text-xl md:text-3xl text-slate-700 italic mb-4 max-w-2xl mx-auto leading-relaxed reveal" style={{ transitionDelay: '0.2s' }}>
            “Together with our families, we invite you to celebrate our wedding”
          </p>
          <p className="serif text-lg md:text-xl text-maroon font-semibold tracking-[0.2em] uppercase mb-10 reveal" style={{ transitionDelay: '0.4s' }}>
            3 – 7 February 2026
          </p>

          {/* Enhanced Countdown Timer */}
          <div 
            className="flex flex-col items-center mb-12 reveal" 
            style={{ transitionDelay: '0.5s' }}
          >
            <div className="flex justify-center gap-4 md:gap-10 p-8 md:p-10 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-2xl">
              {timeLeft ? (
                [
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Mins', value: timeLeft.minutes },
                  { label: 'Secs', value: timeLeft.seconds }
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center min-w-[70px] md:min-w-[90px]">
                    <div className="relative">
                      <span className="text-4xl md:text-6xl font-light text-maroon serif tracking-tighter">
                        {item.value.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-slate-500 font-bold mt-3">
                      {item.label}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-4 px-10">
                  <span className="serif text-3xl text-maroon animate-pulse uppercase tracking-widest">Initialization Complete</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 reveal" style={{ transitionDelay: '0.7s' }}>
            <button 
              onClick={() => onNavigate('events')}
              className="px-12 py-5 bg-maroon text-white rounded-full hover:bg-[#600000] transition-all shadow-xl hover:shadow-maroon/30 text-lg font-medium hover:scale-105 btn-shine"
            >
              Explore the Events
            </button>

            {/* Fun "I'm Coming" Button */}
            <button 
              onClick={handleImComing}
              className={`group flex items-center gap-3 px-8 py-5 bg-white text-maroon border border-maroon/20 rounded-full hover:border-maroon transition-all shadow-lg hover:shadow-xl font-bold uppercase tracking-widest text-sm relative overflow-hidden ${hasClickedComing ? 'scale-110 border-maroon' : ''}`}
            >
              <span className={`text-xl transition-transform group-hover:scale-125 ${hasClickedComing ? 'animate-bounce' : 'animate-pulse-soft'}`}>
                {hasClickedComing ? '❤️' : '💖'}
              </span>
              <span>{hasClickedComing ? "See You Soon!" : "I'm Coming!"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl mb-8 text-maroon reveal">Welcome</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-12 reveal" style={{ transitionDelay: '0.2s' }}>
            As two engineers who have spent our careers building neural networks and complex architectures, 
            we've found that the most significant connection isn't digital—it's the one we share with each other 
            and with all of you. We are honored to welcome you to this four-day celebration of our union.
          </p>
          <div className="w-24 h-px bg-gold mx-auto reveal" style={{ transitionDelay: '0.4s' }}></div>
        </div>
      </section>

      {/* AI Story Section */}
      <StorySection />

      {/* Highlights Section */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "4 Days of Celebration", desc: "A journey from prayers to parties.", icon: "✨" },
              { title: "Wedding Events Timeline", desc: "Complete schedule from Feb 3rd to 7th.", icon: "📅" },
              { title: "Event Locations", desc: "Digital maps to guide your physical transit.", icon: "📍" },
              { title: "Find Your Photos Online", desc: "Relive the high-res moments instantly.", icon: "📸" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-10 border border-slate-100 rounded-2xl text-center hover:border-gold transition-colors group reveal"
                style={{ transitionDelay: `${idx * 0.1}s` }}
              >
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all" aria-hidden="true">{item.icon}</div>
                <h3 className="serif text-xl mb-3 text-maroon">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;