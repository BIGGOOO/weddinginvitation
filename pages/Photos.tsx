
import React, { useState, useEffect, useRef } from 'react';
import { searchPhotosByFace } from '../services/geminiService';

const PhotoCard = ({ title, date, imgId, onOpen, index }: any) => (
  <div 
    className="group cursor-pointer reveal" 
    style={{ transitionDelay: `${index * 0.1}s` }}
    onClick={onOpen}
    role="button"
    tabIndex={0}
    aria-label={`View photos for ${title}`}
    onKeyDown={(e) => e.key === 'Enter' && onOpen()}
  >
    <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-6 relative shadow-lg">
      <img 
        src={`https://picsum.photos/seed/${imgId}/800/1000`} 
        alt="" 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-maroon/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
        <span className="px-6 py-3 bg-white text-maroon rounded-full text-xs font-bold tracking-widest uppercase shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">Expand Gallery</span>
      </div>
    </div>
    <h3 className="serif text-2xl text-maroon mb-1">{title}</h3>
    <p className="text-slate-400 text-sm uppercase tracking-widest">{date}</p>
  </div>
);

const Photos: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gallery = [
    { title: "Dua-e-Khair", date: "3 Feb 2026", imgId: "inv1" },
    { title: "Ubtan", date: "3 Feb 2026", imgId: "inv2" },
    { title: "Barat", date: "5 Feb 2026", imgId: "inv3" },
    { title: "Mehndi", date: "6 Feb 2026", imgId: "inv4" },
    { title: "Qawali Night", date: "6 Feb 2026", imgId: "inv5" },
    { title: "Walima", date: "7 Feb 2026", imgId: "inv6" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      observer.disconnect();
      document.body.style.overflow = 'auto';
    };
  }, [selectedPhoto, searchResults]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setIsSearching(true);
    setSearchResults(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      const base64Data = dataUrl.split(',')[1];
      
      const results = await searchPhotosByFace(base64Data, gallery);
      setSearchResults(results);
      setIsSearching(false);
    };
    reader.readAsDataURL(file);
  };

  const filteredGallery = searchResults 
    ? gallery.filter(item => searchResults.includes(item.title))
    : gallery;

  return (
    <div className="animate-in fade-in duration-700 py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16 reveal">
          <h1 className="text-5xl md:text-7xl text-maroon mb-6">Find Your Photos</h1>
          <p className="serif text-xl text-slate-500 italic mb-8">“Relive the moments”</p>
          
          {/* AI Face Search Block */}
          <div className="max-w-2xl mx-auto mb-16 p-8 md:p-12 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <pre className="text-[6px] md:text-[8px] mono">
                {`cv2.CascadeClassifier('face.xml')\ndetectMultiScale(gray, 1.1, 4)`}
              </pre>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex items-center justify-center w-14 h-14 bg-white/10 rounded-full border border-white/20">
                <span className="text-2xl">🔍</span>
              </div>
              <h2 className="serif text-3xl mb-4 text-gold">Face Index Search</h2>
              <p className="text-slate-400 mb-8 text-sm max-w-sm">
                Our AI analyzes your face to find which event streams you appear in. 
                Upload a portrait for the neural search.
              </p>

              {isSearching ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-gold rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gold rounded-full animate-bounce delay-100"></div>
                    <div className="w-3 h-3 bg-gold rounded-full animate-bounce delay-200"></div>
                  </div>
                  <p className="mono text-[10px] uppercase tracking-[0.2em] text-gold animate-pulse">Running Neural Inference...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-10 py-4 bg-gold text-white rounded-full font-bold hover:scale-105 transition-all shadow-xl hover:shadow-gold/30"
                  >
                    {previewUrl ? 'SCAN DIFFERENT FACE' : 'UPLOAD FACE FOR SEARCH'}
                  </button>
                  
                  {searchResults && (
                    <button 
                      onClick={() => {
                        setSearchResults(null);
                        setPreviewUrl(null);
                      }}
                      className="text-slate-500 hover:text-white text-[10px] mono uppercase tracking-widest mt-2"
                    >
                      Reset Gallery
                    </button>
                  )}
                </div>
              )}

              {previewUrl && (
                <div className="mt-8 relative animate-in fade-in zoom-in duration-500">
                  <div className="absolute inset-0 border-2 border-gold/40 rounded-2xl animate-pulse"></div>
                  <img 
                    src={previewUrl} 
                    alt="Scan target" 
                    className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-gold shadow-lg"
                  />
                  <div className="absolute -top-2 -right-2 bg-gold text-white text-[8px] px-2 py-1 rounded-full font-bold shadow-md">SCAN_TARGET</div>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-2xl mx-auto p-8 border border-gold/20 bg-[#FCFBF4] rounded-3xl shadow-sm">
            <p className="text-slate-600 leading-relaxed reveal" style={{ transitionDelay: '0.2s' }}>
              {searchResults 
                ? `Search successful. Showing ${filteredGallery.length} matched galleries.` 
                : `Our photographers are uploading new frames constantly. Results refresh every 12 hours.`
              }
            </p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 min-h-[400px]">
          {filteredGallery.map((item, i) => (
            <PhotoCard key={item.title} index={i} {...item} onOpen={() => setSelectedPhoto(item)} />
          ))}
          {filteredGallery.length === 0 && (
            <div className="col-span-full py-20 text-center animate-in fade-in slide-in-from-bottom-4">
              <p className="serif text-3xl text-slate-300 italic mb-4">No frames detected for this face.</p>
              <button 
                onClick={() => setSearchResults(null)}
                className="text-maroon font-bold text-xs uppercase tracking-widest underline"
              >
                View Full Archive
              </button>
            </div>
          )}
        </div>

        <div className="mt-32 p-12 bg-slate-900 rounded-[3rem] text-center text-white reveal">
          <h2 className="serif text-4xl mb-6 text-gold">Cloud Contribution</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">
            Did you capture a moment we missed? Sync your camera roll with our collective memory.
          </p>
          <button 
            aria-label="Upload photos to shared gallery"
            className="px-10 py-5 bg-gold text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg"
          >
            SYNC PHOTOS
          </button>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" 
            onClick={() => setSelectedPhoto(null)}
          ></div>
          <div className="relative z-10 max-w-5xl w-full h-full flex flex-col items-center justify-center gap-6">
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-4 -right-4 md:top-0 md:right-0 bg-white text-maroon w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
            >
              <span className="text-2xl font-bold">&times;</span>
            </button>
            <div className="w-full h-4/5 rounded-2xl overflow-hidden shadow-2xl">
               <img 
                src={`https://picsum.photos/seed/${selectedPhoto.imgId}/1600/1200`} 
                alt={`${selectedPhoto.title}`} 
                className="w-full h-full object-contain bg-black"
              />
            </div>
            <div className="text-center text-white">
              <h3 className="serif text-3xl mb-1">{selectedPhoto.title}</h3>
              <p className="text-slate-400 uppercase tracking-widest text-sm">{selectedPhoto.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
