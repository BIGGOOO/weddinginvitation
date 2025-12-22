import React, { useEffect, useState } from 'react';

// Master list of all wedding events with visual icons
const ALL_EVENTS = [
  { day: "1", date: "3 Feb 2026", title: "Dua-e-Khair", icon: "🤲", time: "4:00 PM", location: "Groom's Residence" },
  { day: "1", date: "3 Feb 2026", title: "Ubtan", icon: "✨", time: "8:00 PM", location: "Groom's Residence" },
  { day: "2", date: "5 Feb 2026", title: "Barat", icon: "💍", time: "3:00 PM", location: "Main Hall", note: "Please come early as we need to leave for Hyderabad" },
  { day: "3", date: "6 Feb 2026", title: "Mehndi", icon: "🌿", time: "7:00 PM", location: "The Grand Lawn" },
  { day: "3", date: "6 Feb 2026", title: "Qawali Night", icon: "🎶", time: "11:00 PM", location: "The Grand Lawn" },
  { day: "4", date: "7 Feb 2026", title: "Walima", icon: "🥂", time: "7:00 PM", location: "The Glass House, Cupertino" }
];

const EventCard = ({ day, date, title, time, note, location, index, icon }: any) => (
  <div 
    role="listitem"
    className="reveal bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start hover:shadow-xl hover:scale-[1.01] hover:border-maroon/20 transition-all duration-500"
    style={{ transitionDelay: `${index * 0.1}s` }}
  >
    <div className="md:w-1/4">
      <div className="text-maroon font-bold text-sm tracking-widest uppercase mb-2">Day {day}</div>
      <div className="serif text-3xl text-slate-900">{date}</div>
      <div className="mt-4 text-4xl opacity-20 grayscale group-hover:grayscale-0 transition-all" aria-hidden="true">
        {icon}
      </div>
    </div>
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-3xl md:text-4xl" aria-hidden="true">{icon}</span>
        <h3 className="serif text-4xl text-maroon">{title}</h3>
      </div>
      <div className="flex flex-wrap items-center gap-4 md:gap-8 text-slate-500 font-medium">
        <span className="flex items-center gap-1" aria-label={`Time: ${time}`}>🕒 {time}</span>
        <span className="flex items-center gap-1" aria-label={`Location: ${location}`}>📍 {location}</span>
      </div>
      {note && (
        <div className="p-4 bg-maroon/5 border-l-4 border-maroon rounded-r-lg" role="note">
          <p className="text-maroon text-sm font-medium italic">“{note}”</p>
        </div>
      )}
      <div className="flex gap-4 pt-4">
        <button 
          aria-label={`View location for ${title}`}
          className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-black transition-all"
        >
          View Location
        </button>
      </div>
    </div>
  </div>
);

const Events: React.FC = () => {
  const [isPastEventHidden] = useState<boolean>(true);

  useEffect(() => {
    // Reveal animations observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Logic to hide past events
  const today = new Date();
  const visibleEvents = isPastEventHidden 
    ? ALL_EVENTS.filter(event => new Date(event.date + ' 2026') >= today) 
    : ALL_EVENTS;

  return (
    <div className="animate-in fade-in duration-700 bg-slate-50/50 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-20 reveal">
          <div className="mb-4 inline-block px-4 py-1.5 bg-maroon/5 border border-maroon/10 rounded-full">
             <span className="text-xs font-bold text-maroon uppercase tracking-widest">Wedding Schedule</span>
          </div>
          <h1 className="text-5xl md:text-7xl text-maroon mb-6">Wedding Events</h1>
          <p className="serif text-xl text-slate-500 italic">
            Please join us for our multi-day celebration
          </p>
        </header>

        <div role="list" className="space-y-8 mb-24">
          {visibleEvents.length > 0 ? (
            visibleEvents.map((event, i) => (
              <EventCard key={i} index={i} {...event} />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 italic">No upcoming events found.</p>
            </div>
          )}
        </div>

        <section className="pt-24 border-t border-slate-200">
          <h2 className="text-4xl text-center mb-16 text-maroon reveal">Venue Logistics</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4 reveal" style={{ transitionDelay: '0.1s' }}>
              <h4 className="serif text-xl font-bold">The Glass House</h4>
              <p className="text-slate-500 text-sm mb-4">250 Main St, San Jose, CA 95113</p>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100">
                 <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.332533530!2d-122.03077!3d37.33182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb596e9e188fd%3A0x3a0d839758d51c58!2sApple%20Park!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
                  title="Venue Map: The Glass House"
                ></iframe>
              </div>
            </div>
            <div className="space-y-4 reveal" style={{ transitionDelay: '0.2s' }}>
              <h4 className="serif text-xl font-bold">The Grand Lawn</h4>
              <p className="text-slate-500 text-sm mb-4">Mountain View, California</p>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.63929!2d-122.0840!3d37.4220!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425dad8f%3A0x6c296c66619367e0!2sGoogleplex!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  title="Venue Map: The Grand Lawn"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Events;