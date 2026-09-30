import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  MapPin,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string, param?: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { cartCount, wishlist, setIsCartDrawerOpen, searchQuery, setSearchQuery } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Shop All', page: 'shop' },
    { label: "Men", page: 'men' },
    { label: "Women", page: 'women' },
    { label: 'New Arrivals', page: 'new-arrivals' },
    { label: 'Limited Stock', page: 'limited-stock' },
    { label: 'Deals', page: 'sale' },
    { label: 'Stores', page: 'stores' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      {/* 3-ZONE TOP BAR CONTRACT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-neutral-800 hover:text-black focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => onNavigate('home')}
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 uppercase hover:opacity-90 transition-opacity text-left whitespace-nowrap"
          >
            AURA APPAREL
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-600">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`py-1 transition-colors relative hover:text-neutral-950 ${
                  isActive ? 'text-neutral-950 font-bold' : ''
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-neutral-900" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
            aria-label="Search catalog"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Stores Shortcut */}
          <button
            onClick={() => onNavigate('stores')}
            className="hidden sm:flex items-center gap-1.5 p-2 text-neutral-700 hover:text-neutral-950 transition-colors text-xs font-medium"
            title="I-8 Markaz Stores"
          >
            <MapPin className="w-4 h-4 text-neutral-800" />
            <span className="hidden xl:inline">I-8 Markaz</span>
          </button>

          {/* Account */}
          <button
            onClick={() => onNavigate('account')}
            className="p-2 text-neutral-700 hover:text-neutral-950 transition-colors"
            title="My Orders & Account"
            aria-label="Customer account"
          >
            <User className="w-4.5 h-4.5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => onNavigate('wishlist')}
            className="p-2 text-neutral-700 hover:text-neutral-950 transition-colors relative"
            title="Wishlist"
            aria-label="Wishlist items"
          >
            <Heart className="w-4.5 h-4.5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 text-[10px] font-bold text-neutral-900">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            aria-label="Open shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="tabular-nums font-mono">({cartCount})</span>
          </button>

          {/* Admin Direct Access Badge */}
          <button
            onClick={() => onNavigate('admin')}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-300 text-neutral-700 rounded text-[11px] font-medium hover:border-neutral-900 hover:text-neutral-900 transition-colors"
            title="Admin Portal"
          >
            <Shield className="w-3.5 h-3.5 text-neutral-600" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {searchOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-3 shadow-inner">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search export overstock, chore jackets, oxford shirts, tees..."
                className="w-full pl-9 pr-24 py-2 bg-neutral-50 border border-neutral-200 rounded text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1 bg-neutral-900 text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-[#FAF9F5] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm font-semibold uppercase tracking-wider text-neutral-800 hover:text-black py-1 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-200 space-y-2">
            <button
              onClick={() => {
                onNavigate('stores');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-xs text-neutral-600 hover:text-black py-1.5 flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-neutral-800" />
              <span>Visit Stores (I-8 Markaz, Islamabad)</span>
            </button>
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-xs text-neutral-600 hover:text-black py-1.5 flex items-center gap-2"
            >
              <Shield className="w-3.5 h-3.5 text-neutral-800" />
              <span>Admin Management Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
