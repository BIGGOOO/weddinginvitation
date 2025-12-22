import React, { useState } from 'react';
import { generateRSVPAcknowledgment } from '../services/geminiService';
import CelebrationOverlay, { useCelebration } from './Celebration';

const RSVP: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    attending: 'true',
    plusOne: false,
    dietary: '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { particles, trigger } = useCelebration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Trigger celebration on button position
    const rect = (e.target as HTMLFormElement).querySelector('button')?.getBoundingClientRect();
    if (rect) {
      trigger(rect.left + rect.width / 2, rect.top);
    }

    const isAttending = formData.attending === 'true';

    // Store in localStorage for personalization across the app
    localStorage.setItem('wedding_guest_data', JSON.stringify({
      name: formData.name,
      attending: isAttending,
      timestamp: new Date().getTime()
    }));
    
    const response = await generateRSVPAcknowledgment({
      name: formData.name,
      attending: isAttending,
      message: formData.message
    });
    
    setAiResponse(response || "RSVP Received.");
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <section id="rsvp" className="py-24 px-6 bg-slate-900 text-white text-center">
        <CelebrationOverlay particles={particles} />
        <div className="max-w-xl mx-auto">
          <div className="w-20 h-20 bg-maroon rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-maroon/50 animate-bounce">
            <span className="text-3xl">❤️</span>
          </div>
          <h2 className="text-4xl mb-6 serif">RSVP Logged</h2>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 mb-8 shadow-2xl">
            <p className="mono text-[10px] text-gold mb-4 uppercase tracking-[0.3em] font-bold">Neural Acknowledgment</p>
            <p className="serif text-xl italic leading-relaxed text-slate-200">"{aiResponse}"</p>
          </div>
          <button 
            onClick={() => { setStatus('idle'); setAiResponse(null); }}
            className="text-gold hover:text-white transition-colors mono text-[10px] uppercase tracking-widest font-bold underline decoration-maroon underline-offset-8"
          >
            EDIT_SUBMISSION.sh
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-24 px-6 bg-white">
      <CelebrationOverlay particles={particles} />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.4em] uppercase text-gold mb-4 block">Request For Proposal</span>
          <h2 className="text-5xl text-maroon mb-6 serif">RSVP</h2>
          <p className="text-slate-500 max-w-md mx-auto">Please confirm your presence in our physical stack by joining our union.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <label className="block mono text-[10px] text-slate-400 uppercase mb-2 font-bold tracking-widest">Guest Identity</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Full Name"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-maroon/10 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block mono text-[10px] text-slate-400 uppercase mb-2 font-bold tracking-widest">Attendance Status</label>
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center gap-2 p-4 border rounded-2xl cursor-pointer transition-all ${formData.attending === 'true' ? 'bg-maroon text-white border-maroon' : 'bg-white border-slate-100 hover:border-maroon/20'}`}>
                  <input 
                    type="radio" 
                    name="attending" 
                    value="true" 
                    checked={formData.attending === 'true'}
                    onChange={(e) => setFormData({...formData, attending: e.target.value})}
                    className="hidden"
                  />
                  <span className="text-sm font-bold uppercase tracking-widest">Coming!</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-4 border rounded-2xl cursor-pointer transition-all ${formData.attending === 'false' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100 hover:border-slate-900/20'}`}>
                  <input 
                    type="radio" 
                    name="attending" 
                    value="false"
                    checked={formData.attending === 'false'}
                    onChange={(e) => setFormData({...formData, attending: e.target.value})}
                    className="hidden"
                  />
                  <span className="text-sm font-bold uppercase tracking-widest">Declined</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input 
                type="checkbox" 
                id="plusOne"
                checked={formData.plusOne}
                onChange={(e) => setFormData({...formData, plusOne: e.target.checked})}
                className="w-5 h-5 accent-maroon"
              />
              <label htmlFor="plusOne" className="text-xs font-bold uppercase tracking-widest text-slate-600">Requesting a Plus One (+1)</label>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mono text-[10px] text-slate-400 uppercase mb-2 font-bold tracking-widest">Dietary Constraints</label>
              <textarea 
                value={formData.dietary}
                onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                placeholder="Allergies or preferences..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-maroon/10 min-h-[100px] text-sm font-medium"
              />
            </div>

            <div>
              <label className="block mono text-[10px] text-slate-400 uppercase mb-2 font-bold tracking-widest">Message to Couple</label>
              <textarea 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="A warm wish for the AI engineers..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-maroon/10 min-h-[100px] text-sm font-medium"
              />
            </div>

            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full py-5 bg-maroon text-white rounded-full hover:bg-[#600000] transition-all font-bold uppercase tracking-widest shadow-xl hover:shadow-maroon/20 disabled:opacity-50 hover:scale-[1.02]"
            >
              {status === 'submitting' ? 'SYNCING RSVP...' : 'Submit RSVP'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RSVP;