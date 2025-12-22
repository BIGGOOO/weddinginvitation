
import React, { useState, useEffect, useRef } from 'react';
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

const Carousel = ({ images }: { images: PhotoItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full h-full overflow-hidden rounded-2xl bg-black flex items-center justify-center">
        <img
          src={images[currentIndex].url}
          alt={`Frame ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain animate-in fade-in duration-500"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/10"
              aria-label="Previous Frame"
            >
              ←
            </button>
            <button
              onClick={next}
              className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/10"
              aria-label="Next Frame"
            >
              →
            </button>
          </>
        )}

        <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white">
          <p className="text-[10px] mono uppercase tracking-widest text-gold mb-1">Frame Source</p>
          <p className="font-medium text-sm">
            {images[currentIndex].contributor || "Official Archive"}
          </p>
        </div>
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-2 mt-4">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-8 bg-gold' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PhotoFolder = ({ folder, onOpen, index, isFiltered }: { folder: EventFolder; onOpen: () => void; index: number; isFiltered?: boolean }) => (
  <div
    className={`group cursor-pointer reveal ${isFiltered ? 'scale-105 shadow-gold/20' : ''}`}
    style={{ transitionDelay: `${index * 0.1}s` }}
    onClick={onOpen}
    role="button"
    tabIndex={0}
  >
    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl border border-slate-100">
      {/* Visual Stack Effect */}
      <div className="absolute inset-0 bg-slate-200 translate-x-2 -translate-y-2 rounded-[2.5rem] -z-10 opacity-40"></div>
      <div className="absolute inset-0 bg-slate-100 translate-x-4 -translate-y-4 rounded-[2.5rem] -z-20 opacity-20"></div>

      <img
        src={folder.images[0].url}
        alt={folder.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
        <span className="mono text-[10px] uppercase tracking-[0.3em] mb-2 opacity-80">Dataset Partition</span>
        <h3 className="serif text-3xl mb-1">{folder.title}</h3>
        <p className="text-white/60 text-xs uppercase tracking-widest">{folder.date}</p>
        
        <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
          <span className="px-4 py-2 bg-white text-maroon rounded-full text-[10px] font-bold uppercase tracking-widest">
            {folder.images.length} Frames
          </span>
          <span className="text-xs font-bold">Inspect →</span>
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
  
  // Storage for official and guest photos
  const [eventFolders, setEventFolders] = useState<EventFolder[]>([
    { title: "Dua-e-Khair", date: "3 Feb 2026", images: [{ url: "https://picsum.photos/seed/inv1/800/1000", timestamp: Date.now() }] },
    { title: "Ubtan", date: "3 Feb 2026", images: [{ url: "https://picsum.photos/seed/inv2/800/1000", timestamp: Date.now() }] },
    { title: "Barat", date: "5 Feb 2026", images: [{ url: "https://picsum.photos/seed/inv3/800/1000", timestamp: Date.now() }] },
    { title: "Mehndi", date: "6 Feb 2026", images: [{ url: "https://picsum.photos/seed/inv4/800/1000", timestamp: Date.now() }] },
    { title: "Qawali Night", date: "6 Feb 2026", images: [{ url: "https://picsum.photos/seed/inv5/800/1000", timestamp: Date.now() }] },
    { title: "Walima", date: "7 Feb 2026", images: [{ url: "https://picsum.photos/seed/inv6/800/1000", timestamp: Date.now() }] },
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
    
    // Simulate cloud packet transmission
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
          <h1 className="text-5xl md:text-8xl text-maroon mb-6 leading-tight">Neural Archive</h1>
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
              <h2 className="text-4xl md:text-5xl text-maroon mb-2">Event Partitions</h2>
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
              <h2 className="text-5xl text-maroon mb-6 leading-tight">Synchronize Your Frames</h2>
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

      {/* Folder Detail Modal with Carousel */}
      {selectedFolder && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" 
            onClick={() => setSelectedFolder(null)}
          ></div>
          
          <div className="relative z-10 w-full max-w-6xl h-full flex flex-col items-center justify-between py-12 px-6">
            <div className="w-full flex justify-between items-center text-white mb-8">
              <div className="text-left">
                <span className="mono text-[10px] uppercase tracking-widest text-gold mb-1 block">Dataset Inspection Active</span>
                <h3 className="serif text-4xl leading-none">{selectedFolder.title}</h3>
                <p className="text-slate-400 text-xs mt-2 mono uppercase tracking-widest">{selectedFolder.date}</p>
              </div>
              <button 
                onClick={() => setSelectedFolder(null)}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white text-white hover:text-maroon flex items-center justify-center transition-all border border-white/20 shadow-2xl"
              >
                <span className="text-2xl font-bold">&times;</span>
              </button>
            </div>

            <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
              <Carousel images={selectedFolder.images} />
            </div>

            <div className="mt-12 w-full max-w-md mx-auto">
               <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                      📊
                    </div>
                    <div>
                      <p className="text-[10px] mono uppercase text-slate-400 tracking-widest">Dataset Statistics</p>
                      <p className="text-white font-bold text-sm">{selectedFolder.images.length} High-Res Frames</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-gold uppercase tracking-widest border border-gold/40 px-4 py-2 rounded-full hover:bg-gold hover:text-white transition-all">
                    Download All
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
