import React, { useEffect, useState, useRef, useMemo } from 'react';

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
  { day: "1", date: "3 Feb 2026", title: "Dua-e-Khair", icon: "🤲", time: "4:00 PM", location: "Groom's Residence", mapQuery: "24.878270282370465, 67.18175388041092" },
  { day: "1", date: "3 Feb 2026", title: "Ubtan", icon: "✨", time: "8:00 PM", location: "Groom's Residence", mapQuery: "24.878270282370465, 67.18175388041092" },
  { day: "2", date: "5 Feb 2026", title: "Barat Departure", icon: "💍", time: "3:00 PM", location: "Groom's Residence", note: "Departure for Hyderabad", mapQuery: "24.878270282370465, 67.18175388041092" },
  { day: "3", date: "6 Feb 2026", title: "Mehndi", icon: "🌿", time: "7:00 PM", location: "Celebration Venue", mapQuery: "24.911276, 67.238557" },
  { day: "4", date: "7 Feb 2026", title: "Walima", icon: "🥂", time: "7:00 PM", location: "Celebration Venue", mapQuery: "24.911276, 67.238557" }
];

const Events: React.FC<{ isWalimaOnly?: boolean }> = ({ isWalimaOnly }) => {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const filteredEvents = useMemo(() => {
    return isWalimaOnly ? ALL_EVENTS.filter(e => e.title === "Walima") : ALL_EVENTS;
  }, [isWalimaOnly]);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
        if (entry.isIntersecting) {
          setActiveIndices(prev => Array.from(new Set([...prev, index])));
        } else {
          setActiveIndices(prev => prev.filter(i => i !== index));
        }
      });
    }, { threshold: 0.3 });

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
  }, [filteredEvents]);

  return (
    <div className="min-h-screen bg-[#FCFBF4] py-16 sm:py-24 md:py-32 px-4 relative overflow-hidden">
      {/* RICH BEAUTIFUL BACKGROUND LAYERS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.05] grayscale"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1522673607200-164883eecd0c?auto=format&fit=crop&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-40-39c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm13 67c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm19-8c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-33-26c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-20-66c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-4-7c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66 66c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-7-57c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-34 27c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-3-47c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23B8860B' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }} />

        <div className="absolute top-[10%] -left-20 w-[40vw] h-[40vw] bg-maroon/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] -right-20 w-[35vw] h-[35vw] bg-gold/5 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute bottom-[10%] left-10 w-[30vw] h-[30vw] bg-maroon/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-16 sm:mb-24 md:mb-40 reveal px-4">
          <div className="mb-4 sm:mb-6 inline-block px-4 py-2 bg-maroon/5 border border-maroon/10 rounded-full backdrop-blur-sm">
            <span className="text-[9px] sm:text-[10px] font-bold text-maroon uppercase tracking-[0.3em] sm:tracking-[0.4em]">
              {isWalimaOnly ? "Exclusive Reception" : "Protocol Timeline"}
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-9xl text-maroon mb-6 sm:mb-8 leading-tight serif">
            {isWalimaOnly ? "The Reception" : "The Timeline"}
          </h1>
          <p className="serif text-base sm:text-xl md:text-3xl text-slate-500 italic max-w-3xl mx-auto leading-relaxed">
            {isWalimaOnly ? "A special evening dedicated to gratitude and celebration." : "A precisely tuned protocol for our wedding festivities across four days."}
          </p>
        </header>

        <div ref={timelineRef} className="relative pb-24 sm:pb-40 px-2 sm:px-0">
          {!isWalimaOnly && (
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-200/50 backdrop-blur-sm">
              <div 
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-maroon via-gold to-maroon/20 transition-transform duration-300 ease-out origin-top"
                style={{ transform: `scaleY(${scrollProgress})`, height: '100%' }}
              />
            </div>
          )}

          <div className={`relative ${isWalimaOnly ? 'flex justify-center' : 'space-y-20 sm:space-y-32 md:space-y-20'}`}>
            {filteredEvents.map((event, i) => {
              const isActive = activeIndices.includes(i) || isWalimaOnly;
              const isEven = i % 2 === 0 && !isWalimaOnly;

              return (
                <div 
                  key={i} 
                  data-index={i} 
                  className={`event-card-trigger relative flex flex-col md:flex-row items-center ${isWalimaOnly ? 'w-full max-w-2xl' : 'w-full'}`}
                >
                  {!isWalimaOnly && (
                    <div 
                      className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-[#FCFBF4] z-30 transition-all duration-700 ${
                        isActive ? 'bg-maroon scale-110 sm:scale-125 shadow-xl ring-4 ring-maroon/10' : 'bg-slate-300'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 rounded-full animate-ping bg-maroon/30" />
                      )}
                    </div>
                  )}

                  {!isWalimaOnly && (
                    <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[1px] bg-slate-200 transition-all duration-1000 z-10 ${
                      isEven ? 'left-1/2 w-[15%]' : 'right-1/2 w-[15%]'
                    } ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                  )}

                  <div className={`w-full ${isWalimaOnly ? '' : 'md:w-1/2 pl-10 sm:pl-12 md:pl-0'} ${isEven ? 'md:order-last md:pl-24' : !isWalimaOnly ? 'md:pr-24 md:text-right' : ''}`}>
                    <div className={`bg-white/80 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-md border transition-all duration-1000 ease-out ${
                      isActive 
                        ? 'border-gold shadow-2xl translate-y-0 opacity-100 scale-[1.01] sm:scale-[1.02]' 
                        : 'border-slate-100/50 translate-y-8 sm:translate-y-12 opacity-0'
                    }`}>
                      <div className="flex flex-col gap-4 sm:gap-6">
                        <div className={`flex items-start gap-4 ${!isEven && !isWalimaOnly ? 'md:flex-row-reverse' : ''}`}>
                          <div className={`text-4xl sm:text-5xl transition-transform duration-700 ${isActive ? 'scale-110 rotate-6' : ''}`}>
                            {event.icon}
                          </div>
                          <div className={`flex-1 ${!isEven && !isWalimaOnly ? 'md:text-right' : ''}`}>
                            <div className="text-[8px] sm:text-[10px] font-bold text-maroon tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-1">
                              {isWalimaOnly ? "Exclusive Event" : `Day ${event.day} • ${event.date}`}
                            </div>
                            <h3 className="serif text-2xl sm:text-3xl md:text-4xl text-slate-800 leading-tight">{event.title}</h3>
                            {isWalimaOnly && <p className="text-slate-500 text-sm mt-2">{event.date}</p>}
                          </div>
                        </div>

                        <div className={`flex flex-wrap gap-2 sm:gap-3 text-slate-500 font-bold text-[9px] sm:text-xs ${!isEven && !isWalimaOnly ? 'md:justify-end' : ''}`}>
                          <span className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/50 rounded-full border border-slate-100 whitespace-nowrap shadow-sm">🕒 {event.time}</span>
                          <span className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/50 rounded-full border border-slate-100 shadow-sm">📍 {event.location}</span>
                        </div>

                        {event.note && (
                          <div className={`p-3 sm:p-4 border-l-2 bg-white/30 rounded-r-2xl transition-all ${isActive ? 'border-gold' : 'border-slate-200'}`}>
                            <p className={`text-[11px] sm:text-[12px] italic leading-relaxed text-slate-500 ${!isEven && !isWalimaOnly ? 'md:text-right' : ''}`}>
                              “{event.note}”
                            </p>
                          </div>
                        )}

                        <div className={`flex gap-2 sm:gap-3 pt-2 sm:pt-4 ${!isEven && !isWalimaOnly ? 'md:justify-end' : ''}`}>
                          <button 
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`, '_blank')}
                            className="px-6 py-3 sm:px-8 sm:py-3.5 bg-slate-900 text-white rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] hover:bg-black transition-all btn-shine shadow-lg"
                          >
                            Map
                          </button>
                          <button 
                            onClick={() => window.open(generateCalendarUrl(event.title, event.date, event.time, event.location, event.note), '_blank')}
                            className="px-6 py-3 sm:px-8 sm:py-3.5 bg-white text-maroon border border-maroon/20 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] hover:border-maroon transition-all btn-shine"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isWalimaOnly && <div className="hidden md:block md:w-1/2" />}
                </div>
              );
            })}
          </div>
        </div>

        <section className="pt-24 sm:pt-32 border-t border-slate-200/50 reveal px-4">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-7xl text-maroon mb-6 serif">Venue Logistics</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-[11px]">Coordinate Space Information</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-1 max-w-2xl mx-auto gap-8 sm:gap-12">
            {[
              { title: "Celebration Venue", coords: "24.911276, 67.238557", note: "Central node for group celebrations" }
            ].map((v, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-md p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all group overflow-hidden relative">
                <div className="flex justify-between items-start mb-6 sm:mb-8">
                  <div>
                    <h4 className="serif text-2xl sm:text-3xl text-slate-800 mb-2">{v.title}</h4>
                    <p className="mono text-[9px] sm:text-[10px] text-maroon font-bold tracking-[0.2em]">{v.coords}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-maroon/5 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl group-hover:rotate-12 transition-transform duration-500">📍</div>
                </div>

                <div className="aspect-[16/9] w-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-50 mb-6 sm:mb-8 shadow-inner relative">
                  <iframe 
                    src={`https://maps.google.com/maps?q=${v.coords}&z=16&output=embed`}
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
                    title={`Venue Map: ${v.title}`}
                    className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                
                <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 italic">"{v.note}"</p>

                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${v.coords}`, '_blank')}
                  className="w-full py-4 sm:py-5 bg-white/50 hover:bg-slate-900 hover:text-white rounded-full text-[9px] sm:text-[10px] font-bold text-maroon transition-all uppercase tracking-[0.2em] sm:tracking-[0.3em] flex items-center justify-center gap-3 border border-slate-100"
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