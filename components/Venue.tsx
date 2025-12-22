
import React, { useState, useEffect } from 'react';
import { getVenueGrounding } from '../services/geminiService';

const Venue: React.FC = () => {
  const [venueData, setVenueData] = useState<{ description: string; uri?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenue = async () => {
      setLoading(true);
      setError(null);
      
      let lat: number | undefined;
      let lng: number | undefined;

      // Try to get user location for better grounding relevance
      try {
        if ("geolocation" in navigator) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { 
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 60000 
            });
          });
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        }
      } catch (e) {
        console.log("Geolocation context unavailable, proceeding with standard grounding.");
      }

      try {
        // Mocking a specific high-end venue for an AI engineer
        const data = await getVenueGrounding("The Glass House, Cupertino", lat, lng);
        setVenueData(data);
      } catch (err) {
        console.error("Error fetching venue data:", err);
        setError("Unable to retrieve real-time venue intelligence. Please use the static address below.");
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, []);

  return (
    <section id="venue" className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl mb-8">The Execution Environment</h2>
          <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">The Glass House</h3>
                <p>250 Main St, San Jose, CA 95113</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0">
                <span className="text-xl">📅</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">October 12th, 2024</h3>
                <p>Ceremony at 4:30 PM • Reception to Follow</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0">
                <span className="text-xl">👔</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Dress Code</h3>
                <p>Modern Formal • Think "Silicon Valley Gala"</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-8 flex flex-col">
            <div className="mb-6 flex justify-between items-center">
              <span className="mono text-xs text-indigo-500 font-bold">MAPS_GROUNDING_SERVICE</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-full h-4 bg-slate-100 animate-pulse rounded"></div>
                  <div className="w-3/4 h-4 bg-slate-100 animate-pulse rounded"></div>
                  <div className="w-5/6 h-4 bg-slate-100 animate-pulse rounded"></div>
                  <p className="mono text-[10px] text-slate-400 animate-pulse">OPTIMIZING_LOCATION_CONTEXT...</p>
                </div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-rose-500 serif italic mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-xs mono bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    RETRY_LOOKUP
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="serif italic text-slate-500">
                    {venueData?.description || "An elegant glass-walled sanctuary perfect for a digital union."}
                  </p>
                  {venueData?.uri && (
                    <a 
                      href={venueData.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mono text-xs font-bold"
                    >
                      OPEN IN GOOGLE MAPS →
                    </a>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <img 
                src="https://picsum.photos/seed/venue/600/400" 
                alt="Venue" 
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Venue;
