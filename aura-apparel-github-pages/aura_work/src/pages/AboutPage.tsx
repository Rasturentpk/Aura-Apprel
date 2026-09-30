import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ShieldCheck, Award, RefreshCw, Sparkles, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigateToShop: () => void;
  onNavigateToStores: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToShop, onNavigateToStores }) => {
  const { storeSettings } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Our Story & Philosophy
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
          Premium Apparel.
          <span className="block text-neutral-500 font-normal">Unexpected Prices.</span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pt-2">
          Founded in I-8 Markaz, Islamabad, <strong>Aura Apparel</strong> was created to solve a persistent dilemma in Pakistani fashion retail: why should authentic, world-class export garments carry astronomical international markups?
        </p>
      </div>

      {/* Hero Visual Section */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded overflow-hidden shadow-xl border border-neutral-200">
        <img
          src="/src/assets/images/export_overstock_flatlay_1790699838766.jpg"
          alt="Aura Apparel Export Textiles"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white text-xs sm:text-sm font-medium">
          <p className="font-bold uppercase tracking-wider text-xs">Direct Factory Consignments</p>
          <p className="text-neutral-300">Grade-A textile surplus from Scandinavian, British, and North American export programs.</p>
        </div>
      </div>

      {/* The Export Leftover & Overstock Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <h2 className="font-display text-2xl font-bold text-neutral-900">
            How The Export Leftover Model Works
          </h2>
          <p>
            Pakistan is one of the world's premier textile manufacturers, producing high-thread-count cottons, selvedge denim, and structured outerwear for prestigious global brands.
          </p>
          <p>
            When major overseas retailers produce collections, mills inevitably produce 3% to 5% buffer overrun units to safeguard against quality rejections. When orders ship overseas, this Grade-A surplus remains behind—flawless in fabrication, hardware, and stitching.
          </p>
          <p>
            At Aura Apparel, our sourcing specialists inspect these lots directly at factory gates. We select only pristine first-tier surplus, bringing them straight to our stores in I-8 Markaz at 50% to 70% below international retail price tags.
          </p>
        </div>

        <div className="bg-neutral-100 p-8 rounded border border-neutral-200 space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-neutral-900">The "No-Restock" Rule</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Because every consignment is a surplus clearance rather than mass manufactured fast-fashion, every piece is strictly limited. When a style or size runs out, it will never be reproduced.
            </p>
          </div>

          <div className="space-y-1 border-t border-neutral-200 pt-4">
            <h3 className="font-bold text-sm text-neutral-900">Weekly Shipments</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              New containers and cartons are opened weekly at our twin stores (Shop 14/15 Zakki Plaza and Shop 20 Plaza 2000, I-8 Markaz). Every visit offers fresh discoveries.
            </p>
          </div>

          <div className="space-y-1 border-t border-neutral-200 pt-4">
            <h3 className="font-bold text-sm text-neutral-900">Nationwide Transparency</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Whether you visit in person in Islamabad or order online to Lahore, Karachi, or Peshawar with Cash on Delivery, you receive exactly what is described with 7-day exchange support.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8 border-t border-neutral-200 space-y-4">
        <h3 className="font-display text-xl font-bold text-neutral-900">
          Experience Aura Apparel Today
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onNavigateToShop}
            className="px-6 py-3 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
          >
            Explore Catalog
          </button>
          <button
            onClick={onNavigateToStores}
            className="px-6 py-3 border border-neutral-300 text-neutral-900 rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-100"
          >
            Visit I-8 Markaz Stores
          </button>
        </div>
      </div>

    </div>
  );
};
