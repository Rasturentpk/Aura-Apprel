import React from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ExternalLink,
  Shield,
  Instagram,
  Facebook,
  ArrowUpRight,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { storeSettings } = useStore();

  const mapsUrl = storeSettings?.mapsUrl || 'https://maps.app.goo.gl/6SozQkfxZtNGyNcr5';
  const whatsappNumber = storeSettings?.whatsapp || '+92 314 0855 651';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800/80 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-neutral-800">
          
          {/* Column 1: Brand & Positioning */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold tracking-tight text-white uppercase">
              {storeSettings?.brandName || 'AURA APPAREL'}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Premium export apparel, authentic factory overruns, and limited overstock pieces. We source export-grade fabrics and tailoring at prices far below traditional flagship retail.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <p className="font-medium text-neutral-300">Strict Limited Stock Policy</p>
              <p>Every piece is uniquely curated with zero mass restocks once an international lot clears.</p>
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <a
                href={storeSettings?.socialLinks?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={storeSettings?.socialLinks?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs font-medium flex items-center gap-1.5 hover:bg-emerald-900 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Column 2: Physical Retail Stores in Islamabad */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Twin Store Locations
            </h4>
            
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <p className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  Shop 14/15, Zakki Plaza
                </p>
                <p className="text-neutral-400 pl-5">I-8 Markaz, Islamabad, Pakistan</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  Shop 20, Plaza 2000
                </p>
                <p className="text-neutral-400 pl-5">I-8 Markaz, Islamabad, Pakistan</p>
              </div>

              <div className="pt-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-xs font-medium text-white transition-colors"
                >
                  <span>Get Directions (Google Maps)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </a>
              </div>
            </div>

            {/* Retail Hours from Admin */}
            <div className="pt-2 text-xs space-y-1 border-t border-neutral-900">
              <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Retail Operating Hours</span>
              </div>
              <p className="text-neutral-400">
                Mon - Thu: {storeSettings?.hours?.weekdays || '11:30 AM - 11:00 PM'}
              </p>
              <p className="text-neutral-400">
                Fri: {storeSettings?.hours?.friday || '02:30 PM - 11:30 PM'}
              </p>
              <p className="text-neutral-400">
                Sat - Sun: {storeSettings?.hours?.weekends || '11:30 AM - 11:30 PM'}
              </p>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Collections & Catalog
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  All Collections
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('men')} className="hover:text-white transition-colors">
                  Men's Export Apparel
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('women')} className="hover:text-white transition-colors">
                  Women's Overstock & Trench
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('new-arrivals')} className="hover:text-white transition-colors">
                  Latest Container Drops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('limited-stock')} className="hover:text-white transition-colors">
                  Limited Pieces (No-Restock)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sale')} className="hover:text-white transition-colors">
                  Deals & Markdown Items
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stores')} className="hover:text-white transition-colors">
                  I-8 Markaz Store Details
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Policies */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Support & Info
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Aura Apparel
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Us & WhatsApp
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-white transition-colors">
                  Track My Order / Account
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-white transition-colors">
                  Return & Exchange Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Owner Admin Panel</span>
                </button>
              </li>
            </ul>

            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{storeSettings?.phone || '+92 314 0855 651'}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{storeSettings?.email || 'contact@auraapparel.pk'}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>
            © {new Date().getFullYear()} Aura Apparel. All rights reserved. I-8 Markaz, Islamabad, Pakistan.
          </p>
          <div className="flex items-center gap-6">
            <span>Cash on Delivery (Nationwide)</span>
            <span>·</span>
            <span>Meezan Bank Raast</span>
            <span>·</span>
            <button onClick={() => onNavigate('admin')} className="hover:text-neutral-300">
              Store Dashboard
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
