import React, { useState } from 'react';
import { PhoneCall, MapPin, Clock, Mail, MessageSquare, Send, CheckCircle, X, ShieldCheck } from 'lucide-react';
import { getSupabase } from '../services/supabaseClient';

export default function ContactUsModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = getSupabase(); // Get the supabase client instance here
      
      const { error } = await supabase
        .from('inquiries')
        .insert([
          { 
            name: name.trim(), 
            phone: phone.trim(), 
            message: message.trim() 
          }
        ]);

      if (error) throw error;

      setSent(true);
    } catch (err) {
      console.error('Error inserting inquiry:', err.message);
      setErrorMsg('Failed to send inquiry. Please try again or contact via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="soft-card w-full max-w-2xl bg-[#f4f8f8] p-6 sm:p-8 relative border border-white max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl soft-btn text-slate-600 hover:text-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl soft-inset flex items-center justify-center text-teal-600 bg-teal-50">
            <PhoneCall className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">
              Contact MediCure Pharmacy
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              24/7 Qualified Pharmacist Hotline & Customer Support
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Contact Info */}
          <div className="space-y-4">
            
            <div className="p-4 rounded-2xl soft-inset bg-teal-50/70 border border-teal-200 space-y-3">
              <div className="flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase">Emergency Helpline</h4>
                  <p className="text-sm font-black text-teal-800">+92 334 2850819</p>
                  <p className="text-[11px] text-slate-500">Available 24 Hours • Toll Free</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-teal-200/60">
                <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase">WhatsApp Order Line</h4>
                  <p className="text-sm font-bold text-slate-800">+92 334 2850819</p>
                  <a href="https://wa.me/923342850819?text=Hello%20MediCure%20Pharmacy,%20I%20want%20to%20order%20medicine"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-700 underline block mt-0.5"
                  >
                    Click to Chat on WhatsApp &rarr;
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl soft-card bg-slate-100 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span className="font-bold text-slate-800">Flagship Branch & Fulfillment Center</span>
              </div>
              <p className="text-slate-600 pl-6">
                  Karachi, Pakistan
              </p>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <Clock className="w-4 h-4 text-teal-600" />
                <span className="font-bold text-slate-800">Working Hours:</span>
                <span className="text-emerald-700 font-extrabold">Open 24/7 (365 Days)</span>
              </div>
            </div>

          </div>

          {/* Right: Quick Message Form */}
          <div>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Send us a direct message</h3>
                
                {errorMsg && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-[11px]">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 rounded-xl soft-inset-sm text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contact Number"
                    className="w-full px-3 py-2 rounded-xl soft-inset-sm text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Inquiry / Message</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Inquire about medicine availability, formula alternatives..."
                    className="w-full px-3 py-2 rounded-xl soft-inset-sm text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full soft-btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Sending...' : 'Send Inquiry'}</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-extrabold text-slate-800">Message Received!</h4>
                <p className="text-xs text-slate-600">
                  Thank you <strong>{name}</strong>. Our on-duty pharmacist will contact you at {phone} shortly.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setName('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="soft-btn px-4 py-1.5 rounded-xl text-xs font-bold text-slate-700"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}