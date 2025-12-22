import React, { useEffect, useState } from 'react';

// Helper to generate Google Calendar URL
const generateCalendarUrl = (title: string, dateStr: string, timeStr: string, location: string, note?: string) => {
  const base = "https://www.google.com/calendar/render?action=TEMPLATE";
  
  // Basic date parsing (Specific to our format "D MMM YYYY")
  const months: { [key: string]: string } = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
  const parts = dateStr.split(' ');
  const day = parts[0].padStart(2, '0');
  const month = months[parts[1]];
  const year = parts[2];

  // Basic time parsing (Specific to "H:MM AM/PM")
  let [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12' && modifier === 'AM') hours = '00';
  if (modifier === 'PM' && hours !== '12') hours = (parseInt(hours, 10) + 12).toString();
  hours = hours.padStart(2, '0');
  minutes = minutes.padStart(2, '0');

  const startTimestamp = `${year}${month}${day}T${hours}${minutes}00`;
  const endHours = (parseInt(hours, 10) + 3).toString().padStart(2, '0'); // Assume 3 hour duration
  const endTimestamp = `${year}${month}${day}T${endHours}${minutes}00`;

  const details = note ? `Note: ${note}` : "Join us for our wedding celebration!";
  
  return `${base}&text=${encodeURIComponent(title)}&dates=${startTimestamp}/${endTimestamp}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
};

// Master list of all wedding events with visual icons
const ALL_EVENTS = [
  { 
    day: "1", 
    date: "3 Feb 2026", 
    title: "Dua-e-Khair", 
    icon: "🤲", 
    time: "4:00 PM", 
    location: "Groom's Residence, Karachi", 
    mapQuery: "24.913683,67.238560" 
  },
  { 
    day: "1", 
    date: "3 Feb 2026", 
    title: "Ubtan", 
    icon: "✨", 
    time: "8:00 PM", 
    location: "Groom's Residence, Karachi", 
    mapQuery: "24.913683,67.238560" 
  },
  { 
    day: "2", 
    date: "5 Feb 2026", 
    title: "Barat Departure", 
    icon: "💍", 
    time: "3:00 PM", 
    location: "Groom's Residence, Karachi", 
    note: "Please come early as we need to leave for Hyderabad", 
    mapQuery: "24.913683,67.238560" 
  },
  { 
    day: "3", 
    date: "6 Feb 2026", 
    title: "Mehndi", 
    icon: "🌿", 
    time: "7:00 PM", 
    location: "Celebration Venue", 
    mapQuery: "24.911276568066082,67.23855745454762" 
  },
  { 
    day: "3", 
    date: "6 Feb 2026", 
    title: "Qawali Night", 
    icon: "🎶", 
    time: "11:00 PM", 
    location: "Celebration Venue", 
    mapQuery: "24.911276568066082,67.23855745454762" 
  },
  { 
    day: "4", 
    date: "7 Feb 2026", 
    title: "Walima", 
    icon: "🥂", 
    time: "7:00 PM", 
    location: "Celebration Venue", 
    mapQuery: "24.911276568066082,67.23855745454762" 
  }
];

const EventCard = ({ day, date, title, time, note, location, index, icon, mapQuery }: any) => {
  const handleAddToCalendar = () => {
    const url = generateCalendarUrl(title, date, time, location, note);
    window.open(url, '_blank');
  };

  const handleViewLocation = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      role="listitem"
      className="reveal event-card-glow bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start hover:shadow-xl hover:scale-[1.01] hover:border-gold transition-all duration-500 group"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="md:w-1/4">
        <div className="text-maroon font-bold text-sm tracking-widest uppercase mb-2 group-hover:text-gold transition-colors">Day {day}</div>
        <div className="serif text-3xl text-slate-900">{date}</div>
        <div className="mt-4 text-4xl opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all transform group-hover:scale-110" aria-hidden="true">
          {icon}
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl md:text-4xl transition-transform group-hover:rotate-12" aria-hidden="true">{icon}</span>
          <h3 className="serif text-4xl text-maroon group-hover:text-gold transition-colors">{title}</h3>
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
        <div className="flex flex-wrap gap-4 pt-4">
          <button 
            onClick={handleViewLocation}
            aria-label={`View location for ${title}`}
            className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-black transition-all btn-shine"
          >
            View Location
          </button>
          <button 
            onClick={handleAddToCalendar}
            aria-label={`Add ${title} to calendar`}
            className="px-6 py-3 bg-white text-maroon border border-maroon/20 rounded-full text-sm font-bold uppercase tracking-widest hover:border-maroon transition-all btn-shine"
          >
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

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
    <div className="animate-in fade-in duration-700 bg-slate-50/50 py-24 px-6 relative">
      <div className="max-w-5xl mx-auto relative">
        {/* Timeline Connecting Line */}
        <div className="absolute left-1/2 top-60 bottom-40 w-px bg-slate-200 hidden md:block -z-10 opacity-50" aria-hidden="true"></div>

        <header className="text-center mb-20 reveal">
          <div className="mb-4 inline-block px-4 py-1.5 bg-maroon/5 border border-maroon/10 rounded-full">
             <span className="text-xs font-bold text-maroon uppercase tracking-widest">Wedding Schedule</span>
          </div>
          <h1 className="text-5xl md:text-7xl text-maroon mb-6">Wedding Events</h1>
          <p className="serif text-xl text-slate-500 italic">
            Please join us for our multi-day celebration
          </p>
        </header>

        <div role="list" className="space-y-8 mb-24 relative">
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
              <h4 className="serif text-xl font-bold">Groom's Residence</h4>
              <p className="text-slate-500 text-sm mb-4">Location: 24.913683, 67.238560</p>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100">
                 <iframe 
                  src="https://maps.google.com/maps?q=24.913683,67.238560&z=15&output=embed" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
                  title="Venue Map: Groom's Residence"
                ></iframe>
              </div>
            </div>
            <div className="space-y-4 reveal" style={{ transitionDelay: '0.2s' }}>
              <h4 className="serif text-xl font-bold">Celebration Venue</h4>
              <p className="text-slate-500 text-sm mb-4">Location: 24.911276, 67.238557</p>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100">
                <iframe 
                  src="https://maps.google.com/maps?q=24.911276,67.238557&z=15&output=embed" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  title="Venue Map: Celebration Venue"
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