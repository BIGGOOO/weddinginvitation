
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchPhotosByFace } from '../services/geminiService';

interface PhotoItem {
  url: string;
  contributor?: string;
  timestamp: number;
}

interface EventFolder {
  title: string;
  date: string;
  images: PhotoItem[];
}

const Carousel = ({ images, onClose }: { images: PhotoItem[]; onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  const next = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Slideshow Logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        next();
      }, 3000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, next]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev, isPlaying, onClose]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full h-full overflow-hidden rounded-3xl bg-black/40 backdrop-blur-sm flex items-center justify-center group/carousel">
        {/* Main Image */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <img
            key={currentIndex}
            src={images[currentIndex].url}
            alt={`Event photo ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain shadow-2xl animate-in fade-in zoom-in-95 duration-500 rounded-lg"
          />
        </div>
        
        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-6 w-14 h-14 rounded-full bg-black/20 hover:bg-white/20 backdrop-blur-xl text-white flex items-center justify-center transition-all border border-white/10 opacity-0 group-hover/carousel:opacity-100 -translate-x-4 group-hover/carousel:translate-x-0"
              aria-label="Previous Photo"
            >
              <span className="text-2xl">←</span>
            </button>
            <button
              onClick={next}
              className="absolute right-6 w-14 h-14 rounded-full bg-black/20 hover:bg-white/20 backdrop-blur-xl text-white flex items-center justify-center transition-all border border-white/10 opacity-0 group-hover/carousel:opacity-100 translate-x-4 group-hover/carousel:translate-x-0"
              aria-label="Next Photo"
            >
              <span className="text-2xl">→</span>
            </button>
          </>
        )}

        {/* Info Overlay */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
          <div className="px-6 py-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl text-white pointer-events-auto">
            <p className="text-[10px] mono uppercase tracking-widest text-gold mb-1">Source Node</p>
            <p className="font-medium text-sm">
              {images[currentIndex].contributor || "Official Dataset"}
            </p>
          </div>

          <div className="flex gap-3 pointer-events-auto">
             <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border flex items-center gap-2 ${
                 isPlaying ? 'bg-gold text-white border-gold' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
               }`}
             >
               {isPlaying ? '⏸ Pause Slideshow' : '▶ Play Slideshow'}
             </button>
          </div>
        </div>
      </div>
      
      {/* Thumbnails / Indicators */}
      {images.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-2xl px-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentIndex(idx); setIsPlaying(false); }}
              className={`relative h-12 w-12 rounded-lg overflow-hidden transition-all border-2 ${
                idx === currentIndex ? 'border-gold scale-110' : 'border-transparent opacity-40 hover:opacity-100'
              }`}
            >
              <img src={img.url} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PhotoFolder: React.FC<{ 
  folder: EventFolder; 
  onOpen: () => void; 
  index: number; 
  isFiltered?: boolean; 
}> = ({ folder, onOpen, index, isFiltered }) => (
  <div
    className={`group cursor-pointer reveal ${isFiltered ? 'scale-105 shadow-gold/20' : ''}`}
    style={{ transitionDelay: `${index * 0.1}s` }}
    onClick={onOpen}
    role="button"
    tabIndex={0}
  >
    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl border border-slate-100">
      <div className="absolute inset-0 bg-slate-200 translate-x-2 -translate-y-2 rounded-[2.5rem] -z-10 opacity-40"></div>
      <div className="absolute inset-0 bg-slate-100 translate-x-4 -translate-y-4 rounded-[2.5rem] -z-20 opacity-20"></div>

      <img
        src={folder.images[0].url}
        alt={folder.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
        <span className="mono text-[10px] uppercase tracking-[0.3em] mb-2 opacity-80">Memory Cluster</span>
        <h3 className="serif text-3xl mb-1">{folder.title}</h3>
        <p className="text-white/60 text-xs uppercase tracking-widest">{folder.date}</p>
        
        <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
          <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
            {folder.images.length} Frames
          </span>
          <span className="text-xs font-bold bg-gold px-4 py-2 rounded-full shadow-lg">View Photos →</span>
        </div>
      </div>

      {isFiltered && (
        <div className="absolute top-6 left-6 px-3 py-1 bg-gold text-white text-[8px] font-bold rounded-full uppercase tracking-widest shadow-lg animate-pulse">
          Matched Profile
        </div>
      )}
    </div>
  </div>
);

const Photos: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<EventFolder | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[] | null>(null);
  const [facePreviewUrl, setFacePreviewUrl] = useState<string | null>(null);
  
  // Storage for official and guest photos - with more mock data for the carousel
  const [eventFolders, setEventFolders] = useState<EventFolder[]>([
    { 
      title: "Dua-e-Khair", 
      date: "3 Feb 2026", 
      images: [
        { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() },
        { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() + 100 },
        { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() + 200 },
      ] 
    },
    { 
      title: "Ubtan", 
      date: "3 Feb 2026", 
      images: [
        { url: "https://images.unsplash.com/photo-1544124499-58ec529dd233?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() },
        { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() + 100 },
      ] 
    },
    { 
      title: "Barat", 
      date: "5 Feb 2026", 
      images: [
        { url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() },
        { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() + 100 },
        { url: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() + 200 },
      ] 
    },
    { 
      title: "Mehndi", 
      date: "6 Feb 2026", 
      images: [
        { url: "https://images.unsplash.com/photo-1606103836293-0a063ee20566?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() },
        { url: "https://images.unsplash.com/photo-1550005816-09246d377488?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() + 100 },
      ] 
    },
    { 
      title: "Walima", 
      date: "7 Feb 2026", 
      images: [
        { url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() },
        { url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800", timestamp: Date.now() + 100 },
      ] 
    },
  ]);

  // Upload Form State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    contributor: '',
    event: 'Barat',
    files: [] as File[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    if (selectedFolder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      observer.disconnect();
      document.body.style.overflow = 'auto';
    };
  }, [selectedFolder, searchResults, eventFolders]);

  const handleFaceSearchUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSearching(true);
    setSearchResults(null);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setFacePreviewUrl(dataUrl);
      const base64Data = dataUrl.split(',')[1];
      
      const results = await searchPhotosByFace(base64Data, eventFolders);
      setSearchResults(results);
      setIsSearching(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUserUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadForm.files.length === 0 || !uploadForm.contributor) return;

    setIsUploading(true);
    
    setTimeout(() => {
      const newImages: PhotoItem[] = uploadForm.files.map(file => ({
        url: URL.createObjectURL(file),
        contributor: uploadForm.contributor,
        timestamp: Date.now()
      }));

      setEventFolders(prev => prev.map(folder => {
        if (folder.title === uploadForm.event) {
          return { ...folder, images: [...newImages, ...folder.images] };
        }
        return folder;
      }));

      setIsUploading(false);
      setUploadSuccess(true);
      setUploadForm({ contributor: '', event: 'Barat', files: [] });
      
      setTimeout(() => setUploadSuccess(false), 5000);
    }, 2000);
  };

  const filteredFolders = searchResults 
    ? eventFolders.filter(folder => searchResults.includes(folder.title))
    : eventFolders;

  return (
    <div className="animate-in fade-in duration-700 py-24 px-6 bg-[#FCFBF4]">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 reveal">
          <h1 className="text-5xl md:text-8xl text-maroon mb-6 leading-tight serif">Neural Archive</h1>
          <p className="serif text-xl md:text-2xl text-slate-500 italic mb-12">“Indexing memories across the space-time continuum”</p>
          
          {/* AI Face Search Block */}
          <div className="max-w-4xl mx-auto mb-32 p-12 bg-slate-900 text-white rounded-[4rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                <div className="mb-6 inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
                  <span className="mono text-[10px] uppercase tracking-widest text-gold font-bold">Biometric Search Online</span>
                </div>
                <h2 className="serif text-4xl mb-6 text-white leading-tight">Retrieve Your Timeline</h2>
                <p className="text-slate-400 mb-10 text-sm leading-relaxed max-w-sm">
                  Our Computer Vision model has processed every frame. Upload a portrait to automatically cluster the event folders containing your presence.
                </p>
                <div className="flex flex-col gap-4">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFaceSearchUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSearching}
                    className="w-full md:w-auto px-10 py-5 bg-gold text-white rounded-full font-bold hover:scale-105 transition-all shadow-xl hover:shadow-gold/20 disabled:opacity-50 text-sm uppercase tracking-widest"
                  >
                    {isSearching ? 'PROCESSING DATA...' : 'IDENTIFY FACE'}
                  </button>
                  {searchResults && (
                    <button 
                      onClick={() => { setSearchResults(null); setFacePreviewUrl(null); }}
                      className="text-slate-500 hover:text-white text-[10px] mono uppercase tracking-widest text-left mt-2 flex items-center gap-2"
                    >
                      <span>×</span> Clear Filter
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                {facePreviewUrl ? (
                  <div className="relative group">
                    <div className="absolute -inset-4 border border-gold/30 rounded-[3rem] animate-[spin_10s_linear_infinite]"></div>
                    <img 
                      src={facePreviewUrl} 
                      alt="Face scan" 
                      className="w-56 h-56 md:w-64 md:h-64 rounded-[2.5rem] object-cover border-4 border-gold shadow-2xl relative z-10"
                    />
                    <div className="absolute -top-4 -right-4 bg-gold text-white text-[9px] px-4 py-2 rounded-full font-bold shadow-2xl tracking-[0.2em] z-20">
                      {isSearching ? 'ANALYZING' : 'READY'}
                    </div>
                  </div>
                ) : (
                  <div className="w-56 h-56 md:w-64 md:h-64 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 px-12 text-center group hover:border-gold/30 transition-all">
                    <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">👤</span>
                    <p className="mono text-[10px] uppercase tracking-widest">Awaiting Biometric Input</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Folders Grid */}
        <div className="mb-40">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 reveal gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl text-maroon mb-2 serif">Event Partitions</h2>
              <p className="text-slate-400 text-sm">Organized by sequential event timestamps</p>
            </div>
            {searchResults && (
              <div className="flex items-center gap-3 bg-gold/10 text-gold px-6 py-2 rounded-full border border-gold/20 font-bold text-[10px] uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                Filtering: Biometric Match Found
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
            {filteredFolders.map((folder, i) => (
              <PhotoFolder 
                key={folder.title} 
                index={i} 
                folder={folder} 
                isFiltered={searchResults?.includes(folder.title)}
                onOpen={() => setSelectedFolder(folder)} 
              />
            ))}
            {filteredFolders.length === 0 && (
              <div className="col-span-full py-32 text-center animate-in fade-in">
                <p className="serif text-4xl text-slate-300 italic mb-4">No matching data frames found.</p>
                <button 
                  onClick={() => setSearchResults(null)}
                  className="text-maroon font-bold text-xs uppercase tracking-widest underline decoration-gold underline-offset-8"
                >
                  View Full Memory Dump
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Form Section */}
        <section className="reveal max-w-5xl mx-auto pt-40 border-t border-slate-200">
          <div className="grid md:grid-cols-5 gap-16 items-start">
            <div className="md:col-span-2">
              <span className="text-xs font-bold tracking-[0.4em] uppercase text-gold mb-4 block">Contribute</span>
              <h2 className="text-5xl text-maroon mb-6 leading-tight serif">Synchronize Your Frames</h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Every attendee is a remote node in our wedding network. Upload your captured frames to contribute to the collective dataset of our union.
              </p>
              <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200">
                <h4 className="mono text-[10px] uppercase tracking-widest text-slate-400 mb-3">Sync Protocol</h4>
                <ul className="space-y-3">
                  <li className="text-[11px] mono flex items-center gap-2">
                    <span className="text-gold">01</span> Select specific event partition
                  </li>
                  <li className="text-[11px] mono flex items-center gap-2">
                    <span className="text-gold">02</span> Upload up to 10 frames per sync
                  </li>
                  <li className="text-[11px] mono flex items-center gap-2">
                    <span className="text-gold">03</span> Frames are optimized for cloud storage
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl border border-slate-100 relative">
                {uploadSuccess ? (
                  <div className="bg-slate-900 text-white p-12 rounded-[3rem] text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-gold text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gold/30">
                      <span className="text-3xl">✓</span>
                    </div>
                    <h3 className="serif text-3xl mb-4">Transfer Complete</h3>
                    <p className="text-slate-400 mb-10 text-sm">Your visual data has been successfully integrated into the archive.</p>
                    <button 
                      onClick={() => setUploadSuccess(false)}
                      className="px-8 py-4 bg-white text-slate-900 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all"
                    >
                      Initiate New Sync
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUserUpload} className="space-y-10">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="mono text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-4">Contributor ID</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Your Name"
                          value={uploadForm.contributor}
                          onChange={(e) => setUploadForm({...uploadForm, contributor: e.target.value})}
                          className="w-full px-8 py-5 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-gold/20 bg-slate-50 text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="mono text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-4">Destination Partition</label>
                        <select 
                          value={uploadForm.event}
                          onChange={(e) => setUploadForm({...uploadForm, event: e.target.value})}
                          className="w-full px-8 py-5 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-gold/20 bg-slate-50 text-sm font-medium appearance-none"
                        >
                          {eventFolders.map(g => <option key={g.title} value={g.title}>{g.title}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="mono text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-4">Frame Payloads</label>
                      <div 
                        onClick={() => uploadInputRef.current?.click()}
                        className="border-4 border-dashed border-slate-100 rounded-[3rem] p-16 text-center hover:bg-slate-50 transition-all cursor-pointer group"
                      >
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          ref={uploadInputRef}
                          onChange={(e) => setUploadForm({...uploadForm, files: Array.from(e.target.files || [])})}
                        />
                        <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all group-hover:scale-110">📁</div>
                        <p className="text-slate-800 font-bold text-lg mb-2">
                          {uploadForm.files.length > 0 
                            ? `${uploadForm.files.length} Data Frames Selected` 
                            : "Browse or Drop Frames"}
                        </p>
                        <p className="text-slate-400 text-xs mono uppercase tracking-widest">Protocol: Multi-part Sync</p>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isUploading || uploadForm.files.length === 0 || !uploadForm.contributor}
                      className="w-full py-6 bg-maroon text-white rounded-full font-bold text-sm uppercase tracking-[0.2em] hover:bg-[#600000] transition-all shadow-2xl hover:shadow-maroon/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                    >
                      {isUploading ? "TRANSMITTING DATA..." : "SYNC TO CLOUD ARCHIVE"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Improved Folder Detail Modal with Interactive Carousel */}
      {selectedFolder && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" 
            onClick={() => setSelectedFolder(null)}
          ></div>
          
          <div className="relative z-10 w-full max-w-7xl h-full flex flex-col items-center justify-between py-12 px-6">
            <div className="w-full flex justify-between items-center text-white mb-8 max-w-6xl">
              <div className="text-left">
                <div className="flex items-center gap-3 mb-1">
                  <span className="mono text-[10px] uppercase tracking-widest text-gold block">Inspection Protocol v1.2</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gold/30"></div>
                  </div>
                </div>
                <h3 className="serif text-4xl leading-none">{selectedFolder.title}</h3>
                <p className="text-slate-400 text-xs mt-2 mono uppercase tracking-widest">{selectedFolder.date} • Partition 0x{selectedFolder.title.length.toString(16)}</p>
              </div>
              <button 
                onClick={() => setSelectedFolder(null)}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white text-white hover:text-maroon flex items-center justify-center transition-all border border-white/20 shadow-2xl group"
              >
                <span className="text-2xl font-bold group-hover:rotate-90 transition-transform">&times;</span>
              </button>
            </div>

            <div className="flex-1 w-full flex items-center justify-center overflow-hidden max-w-6xl">
              <Carousel images={selectedFolder.images} onClose={() => setSelectedFolder(null)} />
            </div>

            <div className="mt-12 w-full max-w-md mx-auto pointer-events-auto">
               <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold text-xl">
                      📊
                    </div>
                    <div>
                      <p className="text-[10px] mono uppercase text-slate-400 tracking-widest">Dataset Load</p>
                      <p className="text-white font-bold text-sm">{selectedFolder.images.length} High-Res Frames</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-gold uppercase tracking-widest border border-gold/40 px-6 py-3 rounded-full hover:bg-gold hover:text-white transition-all shadow-lg shadow-gold/10">
                    Download Segment
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
