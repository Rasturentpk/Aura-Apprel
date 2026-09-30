import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { storeSettings, showToast } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mapsUrl = storeSettings?.mapsUrl || 'https://maps.app.goo.gl/6SozQkfxZtNGyNcr5';
  const whatsappNum = (storeSettings?.whatsapp || '+92 314 0855 651').replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('Please fill out all required fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been received! Our team will respond shortly.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-neutral-200 pb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Customer Service & Retail Desks
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
          Contact Us
        </h1>
        <p className="text-xs text-neutral-600 mt-1 max-w-xl">
          We are available 7 days a week via WhatsApp, phone, and in person at our physical stores in I-8 Markaz, Islamabad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Contact Info & Store Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Channels */}
          <div className="bg-white p-6 rounded border border-neutral-200 space-y-4">
            <h3 className="font-display font-bold uppercase tracking-wider text-xs text-neutral-900">
              Direct Contact Channels
            </h3>

            <div className="space-y-3 text-xs text-neutral-700">
              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-emerald-50 border border-emerald-300 rounded flex items-center gap-3 text-emerald-900 font-semibold hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-emerald-700" />
                <div>
                  <p className="text-sm">WhatsApp Assistance</p>
                  <p className="text-[11px] font-normal text-emerald-700">{storeSettings?.whatsapp || '+92 314 0855 651'}</p>
                </div>
              </a>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded flex items-center gap-3">
                <Phone className="w-5 h-5 text-neutral-800" />
                <div>
                  <p className="font-semibold text-neutral-900">Phone Support</p>
                  <p className="text-neutral-600">{storeSettings?.phone || '+92 314 0855 651'}</p>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-800" />
                <div>
                  <p className="font-semibold text-neutral-900">Email Inquiries</p>
                  <p className="text-neutral-600">{storeSettings?.email || 'contact@auraapparel.pk'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Locations */}
          <div className="bg-white p-6 rounded border border-neutral-200 space-y-4">
            <h3 className="font-display font-bold uppercase tracking-wider text-xs text-neutral-900">
              Retail Stores (Islamabad)
            </h3>

            <div className="space-y-4 text-xs text-neutral-600">
              <div className="space-y-1">
                <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Branch 1: Zakki Plaza
                </p>
                <p className="pl-5">Shop 14/15, Zakki Plaza, I-8 Markaz, Islamabad</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Branch 2: Plaza 2000
                </p>
                <p className="pl-5">Shop 20, Plaza 2000, I-8 Markaz, Islamabad</p>
              </div>

              <div className="pt-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500 space-y-1">
              <p className="font-semibold text-neutral-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Operating Hours:
              </p>
              <p>Mon - Thu: {storeSettings?.hours?.weekdays || '11:30 AM - 11:00 PM'}</p>
              <p>Fri: {storeSettings?.hours?.friday || '02:30 PM - 11:30 PM'}</p>
              <p>Sat - Sun: {storeSettings?.hours?.weekends || '11:30 AM - 11:30 PM'}</p>
            </div>
          </div>

        </div>

        {/* Right: Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded border border-neutral-200 shadow-2xs">
          <h2 className="font-display text-lg font-bold text-neutral-900 uppercase tracking-tight mb-2">
            Send an Online Inquiry
          </h2>
          <p className="text-xs text-neutral-600 mb-6">
            Inquire about specific sizes, international lot arrivals, or order tracking.
          </p>

          {submitted ? (
            <div className="p-8 text-center bg-neutral-50 rounded border border-neutral-200 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-neutral-900 text-base">Inquiry Dispatched</h3>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                Thank you, {name}! Your message has been routed to our I-8 Markaz retail team. We will contact you at {phone}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-semibold text-neutral-900 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Daniyal Sheikh"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0314 0855651"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. daniyal@example.com"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Message / Inquired Article *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you are looking for or mention your Order ID..."
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
