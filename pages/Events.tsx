
import React, { useEffect, useState, useRef } from 'react';

// Helper to generate Google Calendar URL
const generateCalendarUrl = (title: string, dateStr: string, timeStr: string, location: string, note?: string) => {
  const base = "https://www.google.com/calendar/render?action=TEMPLATE";
  const months: { [key: string]: string } = { 
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', 
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' 
  };
  const parts = dateStr.split(' ');
  const day = parts[0].padStart(2, '0');
  const month = months[parts[1]];
  const year = parts[2];

  let [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  let h = parseInt(hours, 10);
  if (modifier === 'PM' && h < 12) h += 12;
  if (modifier === 'AM' && h === 12) h = 0;
  
  const hStr = h.toString().padStart(2, '0');
  const mStr = minutes.padStart(2, '0');

  const startTimestamp = `${year}${month}${day}T${hStr}${mStr}00`;
  const endH = (h + 3).toString().padStart(2, '0'); 
  const endTimestamp = `${year}${month}${day}T${endH}${mStr}00`;

  const details = note ? `Note: ${note}` : "Join us for our wedding celebration!";
  return `${base}&text=${encodeURIComponent(title)}&dates=${startTimestamp}/${endTimestamp}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
};

const ALL_EVENTS = [
  { day: "1", date: "3 Feb 2026", title: "Dua-e-Khair", icon: "🤲", time: "4:00 PM", location: "Groom's Residence", mapQuery: "24.913683,67.238560" },
  { day: "1", date: "3 Feb 2026", title: "Ubtan", icon: "✨", time: "8:00 PM", location: "Groom's Residence", mapQuery: "24.913683,67.238560" },
  { day: "2", date: "5 Feb 2026", title: "Barat Departure", icon: "💍", time: "3:00 PM", location: "Groom's Residence", note: "Departure for Hyderabad", mapQuery: "24.913683,67.238560" },
  { day: "3", date: "6 Feb 2026", title: "Mehndi", icon: "🌿", time: "7:00 PM", location: "Celebration Venue", mapQuery: "24.911276, 67.238557" },
  { day: "3", date: "6 Feb 2026", title: "Qawali Night", icon: "🎶", time: "11:00 PM", location: "Celebration Venue", mapQuery: "24.911276, 67.238557" },
  { day: "4", date: "7 Feb 2026", title: "Walima", icon: "🥂", time: "7:00 PM", location: "Celebration Venue", mapQuery: "24.911276, 67.238557" }
];

const Events: React.FC = () => {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal Observer for static sections (Header, Venue)
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: "0px 0px -5% 0px"
    });

    // Timeline Observer for active states
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
        if (entry.isIntersecting) {
          setActiveIndices(prev => Array.from(new Set([...prev, index])));
        } else {
          setActiveIndices(prev => prev.filter(i => i !== index));
        }
      });
    }, { 
      threshold: 0.3,
      rootMargin: "-20% 0px -20% 0px"
    });

    // Initialize observers
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    document.querySelectorAll('.event-card-trigger').forEach(el => cardObserver.observe(el));

    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = rect.height;
      const start = rect.top;
      const progress = Math.max(0, Math.min(1, (windowHeight / 2 - start) / totalHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      revealObserver.disconnect();
      cardObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFBF4] py-24 md:py-32 px-4 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-maroon/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-24 md:mb-40 reveal">
          <div className="mb-6 inline-block px-5 py-2 bg-maroon/5 border border-maroon/10 rounded-full">
            <span className="text-[10px] font-bold text-maroon uppercase tracking-[0.4em]">Chronological Events</span>
          </div>
          <h1 className="text-6xl md:text-9xl text-maroon mb-8 leading-none serif">The Timeline</h1>
          <p className="serif text-xl md:text-3xl text-slate-500 italic max-w-3xl mx-auto leading-relaxed">
            A precisely tuned protocol for our wedding festivities across four days.
          </p>
        </header>

        <div ref={timelineRef} className="relative pb-40">
          {/* Main Vertical Stem */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-200">
            <div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-maroon to-gold transition-transform duration-300 ease-out origin-top"
              style={{ transform: `scaleY(${scrollProgress})`, height: '100%' }}
            />
          </div>

          <div className="space-y-32 md:space-y-20 relative">
            {ALL_EVENTS.map((event, i) => {
              const isActive = activeIndices.includes(i);
              const isEven = i % 2 === 0;

              return (
                <div 
                  key={i} 
                  data-index={i} 
                  className="event-card-trigger relative flex flex-col md:flex-row items-center w-full"
                >
                  {/* Timeline Pulse Node */}
                  <div 
                    className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 border-[#FCFBF4] z-30 transition-all duration-700 ${
                      isActive ? 'bg-maroon scale-125 shadow-[0_0_40px_rgba(128,0,0,0.5)]' : 'bg-slate-300'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-full animate-ping bg-maroon/30" />
                    )}
                  </div>

                  {/* Desktop Connecting Line */}
                  <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[1px] bg-slate-200 transition-all duration-1000 z-10 ${
                    isEven ? 'left-1/2 w-[15%] bg-gradient-to-r from-maroon/30 to-transparent' : 'right-1/2 w-[15%] bg-gradient-to-l from-maroon/30 to-transparent'
                  } ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                  {/* Card Component */}
                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:order-last md:pl-24' : 'md:pr-24 md:text-right'}`}>
                    <div className={`bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border transition-all duration-1000 ease-out ${
                      isActive 
                        ? 'border-gold shadow-2xl translate-y-0 opacity-100 scale-[1.02]' 
                        : 'border-slate-100 translate-y-12 opacity-0'
                    }`}>
                      <div className="flex flex-col gap-6">
                        <div className={`flex items-start gap-4 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                          <div className={`text-5xl transition-transform duration-700 ${isActive ? 'scale-110 rotate-6' : ''}`}>
                            {event.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-[10px] font-bold text-maroon tracking-[0.3em] uppercase mb-1">Day {event.day} • {event.date}</div>
                            <h3 className="serif text-3xl md:text-4xl text-slate-800 leading-tight">{event.title}</h3>
                          </div>
                        </div>

                        <div className={`flex flex-wrap gap-3 text-slate-500 font-medium text-xs ${!isEven ? 'md:justify-end' : ''}`}>
                          <span className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">🕒 {event.time}</span>
                          <span className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">📍 {event.location}</span>
                        </div>

                        {event.note && (
                          <div className={`p-4 border-l-2 bg-slate-50 rounded-r-2xl transition-all ${isActive ? 'border-gold' : 'border-slate-200'}`}>
                            <p className={`text-[12px] italic leading-relaxed text-slate-500 ${!isEven ? 'md:text-right' : ''}`}>
                              “{event.note}”
                            </p>
                          </div>
                        )}

                        <div className={`flex gap-3 pt-4 ${!isEven ? 'md:justify-end' : ''}`}>
                          <button 
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`, '_blank')}
                            className="px-8 py-3.5 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all btn-shine shadow-lg"
                          >
                            Map
                          </button>
                          <button 
                            onClick={() => window.open(generateCalendarUrl(event.title, event.date, event.time, event.location, event.note), '_blank')}
                            className="px-8 py-3.5 bg-white text-maroon border border-maroon/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:border-maroon transition-all btn-shine"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Empty Spacer */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Static Map Grounding Section */}
        <section className="pt-32 border-t border-slate-200 reveal">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl text-maroon mb-6 serif">Venue Logistics</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[11px]">Coordinate Space Information</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {[
              { title: "Groom's Residence", coords: "24.913683, 67.238560", note: "Primary hub for initial protocols" },
              { title: "Celebration Venue", coords: "24.911276, 67.238557", note: "Central node for group celebrations" }
            ].map((v, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all group overflow-hidden relative">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="serif text-3xl text-slate-800 mb-2">{v.title}</h4>
                    <p className="mono text-[10px] text-maroon font-bold tracking-[0.2em]">{v.coords}</p>
                  </div>
                  <div className="w-12 h-12 bg-maroon/5 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform duration-500">📍</div>
                </div>

                <div className="aspect-[16/9] w-full rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-50 mb-8 shadow-inner relative">
                  <iframe 
                    src={`https://maps.google.com/maps?q=${v.coords}&z=16&output=embed`}
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
                    title={`Venue Map: ${v.title}`}
                    className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                
                <p className="text-sm text-slate-500 mb-8 italic">"{v.note}"</p>

                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${v.coords}`, '_blank')}
                  className="w-full py-5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-full text-[10px] font-bold text-maroon transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                >
                  START NAVIGATION ↗
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Events;
