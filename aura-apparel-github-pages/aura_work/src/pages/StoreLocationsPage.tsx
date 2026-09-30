import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import {
  MapPin,
  ExternalLink,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const StoreLocationsPage: React.FC = () => {
  const { storeSettings } = useStore();

  const mapsUrl = storeSettings?.mapsUrl || 'https://maps.app.goo.gl/6SozQkfxZtNGyNcr5';
  const whatsappNum = (storeSettings?.whatsapp || '+92 314 0855 651').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title */}
      <div className="border-b border-neutral-200 pb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Islamabad Twin Outlets
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
          Store Locations
        </h1>
        <p className="text-xs text-neutral-600 mt-1 max-w-xl">
          Visit Aura Apparel in the heart of I-8 Markaz, Islamabad. Try on our curated export garments, touch the fabric weights, and consult our retail stylists.
        </p>
      </div>

      {/* Featured Location Banner with Interior Photo */}
      <div className="bg-neutral-900 text-white rounded overflow-hidden shadow-xl border border-neutral-800 grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              Flagship Retail Showroom
            </span>
            <h2 className="font-display text-3xl font-bold">
              Shop 14/15, Zakki Plaza
              <span className="block text-lg font-normal text-neutral-400 mt-1">I-8 Markaz, Islamabad</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Our flagship destination showcasing new Scandinavian chore jackets, 260-280 GSM heavyweight tees, selvedge denim, and European casual button-downs.
            </p>

            <div className="space-y-2 text-xs text-neutral-300 pt-2">
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>Operating Hours: {storeSettings?.hours?.weekdays || '11:30 AM - 11:00 PM'} (Open 7 Days)</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400" />
                <span>Direct Contact: {storeSettings?.phone || '+92 314 0855 651'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-neutral-800">
            {/* Get Directions Button with Exact Link */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-white text-neutral-950 rounded text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${whatsappNum}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-emerald-800 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Store</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[300px]">
          <img
            src="/src/assets/images/store_boutique_interior_1790699826704.jpg"
            alt="Aura Apparel Interior"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Two Retail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Branch 1 */}
        <div className="bg-white p-7 rounded border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Branch 1
            </span>
            <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-800 text-[11px] font-semibold rounded">
              Main Store
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-neutral-900">
            Zakki Plaza
          </h3>

          <div className="space-y-2 text-xs text-neutral-600">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <span>Shop 14/15, Zakki Plaza, I-8 Markaz, Islamabad, Pakistan</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-800 shrink-0" />
              <span>Mon-Sun: {storeSettings?.hours?.weekdays || '11:30 AM - 11:00 PM'} (Fri from 2:30 PM)</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-800 shrink-0" />
              <span>{storeSettings?.phone || '+92 314 0855 651'}</span>
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-black underline"
            >
              <span>Get Directions to Zakki Plaza</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Branch 2 */}
        <div className="bg-white p-7 rounded border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Branch 2
            </span>
            <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-800 text-[11px] font-semibold rounded">
              Clearance & Womenswear
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-neutral-900">
            Plaza 2000
          </h3>

          <div className="space-y-2 text-xs text-neutral-600">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <span>Shop 20, Plaza 2000, I-8 Markaz, Islamabad, Pakistan</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-800 shrink-0" />
              <span>Mon-Sun: {storeSettings?.hours?.weekdays || '11:30 AM - 11:00 PM'} (Fri from 2:30 PM)</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-800 shrink-0" />
              <span>{storeSettings?.phone || '+92 314 0855 651'}</span>
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-black underline"
            >
              <span>Get Directions to Plaza 2000</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
