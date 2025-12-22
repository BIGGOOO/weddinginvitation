
import React, { useState } from 'react';
import { generateRSVPAcknowledgment } from '../services/geminiService';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
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
        <div className="max-w-xl mx-auto">
          <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-500/50">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-4xl mb-6">RSVP Logged</h2>
          <div className="glass bg-white/10 p-8 rounded-2xl border border-white/20 mb-8">
            <p className="mono text-xs text-indigo-300 mb-4 uppercase tracking-widest">Assistant response</p>
            <p className="serif text-xl italic leading-relaxed">"{aiResponse}"</p>
          </div>
          <button 
            onClick={() => { setStatus('idle'); setAiResponse(null); }}
            className="text-indigo-400 hover:text-indigo-300 mono text-xs underline"
          >
            EDIT SUBMISSION
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">Request For Proposal (RSVP)</h2>
          <p className="text-slate-500 max-w-md mx-auto">Please confirm your presence in our physical stack by September 1st.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <label className="block mono text-[10px] text-slate-400 uppercase mb-2">Guest Identity</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            <div>
              <label className="block mono text-[10px] text-slate-400 uppercase mb-2">Attendance Status</label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition-all hover:bg-slate-50 border-slate-200">
                  <input 
                    type="radio" 
                    name="attending" 
                    value="true" 
                    checked={formData.attending === 'true'}
                    onChange={(e) => setFormData({...formData, attending: e.target.value})}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm font-medium">Attending</span>
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition-all hover:bg-slate-50 border-slate-200">
                  <input 
                    type="radio" 
                    name="attending" 
                    value="false"
                    checked={formData.attending === 'false'}
                    onChange={(e) => setFormData({...formData, attending: e.target.value})}
                    className="accent-rose-600"
                  />
                  <span className="text-sm font-medium">Declined</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="plusOne"
                checked={formData.plusOne}
                onChange={(e) => setFormData({...formData, plusOne: e.target.checked})}
                className="w-5 h-5 accent-indigo-600"
              />
              <label htmlFor="plusOne" className="text-sm text-slate-600">Requesting a Plus One (+1)</label>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mono text-[10px] text-slate-400 uppercase mb-2">Dietary Constraints</label>
              <textarea 
                value={formData.dietary}
                onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                placeholder="Allergies or dietary preferences..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 min-h-[100px]"
              />
            </div>

            <div>
              <label className="block mono text-[10px] text-slate-400 uppercase mb-2">Message to Couple</label>
              <textarea 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="A warm wish or a quirky prompt for the AI..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 min-h-[100px]"
              />
            </div>

            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold disabled:opacity-50"
            >
              {status === 'submitting' ? 'Processing Transaction...' : 'Submit RSVP'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RSVP;
