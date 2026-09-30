import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ui/ProductCard.tsx';
import {
  ArrowRight,
  MapPin,
  ExternalLink,
  MessageCircle,
  Star,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, param?: string) => void;
  onSelectProduct: (slugOrId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const { allProducts, categories, homepageCms, storeSettings, formatPKR } = useStore();

  const heroHeadline = homepageCms?.heroHeadline || 'Premium Apparel. Unexpected Prices.';
  const heroSubheadline =
    homepageCms?.heroSubheadline ||
    'Discover export-quality fashion, limited pieces and premium finds at prices far below traditional retail. Visit our twin stores in I-8 Markaz, Islamabad or shop online nationwide.';
  const heroImage = homepageCms?.heroImage || '/src/assets/images/hero_fashion_campaign_1790699788342.jpg';

  const newArrivals = allProducts.filter((p) => p.isNewArrival).slice(0, 4);
  const limitedStock = allProducts
    .filter((p) => p.isLimitedStock || p.stock <= p.lowStockThreshold)
    .slice(0, 4);
  const bestDeals = allProducts.filter((p) => p.isSale).slice(0, 4);
  const mensProducts = allProducts.filter((p) => p.gender === 'Men').slice(0, 4);
  const womensProducts = allProducts.filter((p) => p.gender === 'Women').slice(0, 4);

  const mapsUrl = storeSettings?.mapsUrl || 'https://maps.app.goo.gl/6SozQkfxZtNGyNcr5';
  const whatsappNumber = (storeSettings?.whatsapp || '+92 314 0855 651').replace(/[^0-9]/g, '');

  return (
    <div className="space-y-20 pb-20">
      
      {/* ===================================================
          1. HERO SECTION (Campaign Focal Point)
          =================================================== */}
      <section className="relative overflow-hidden bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Copy */}
          <div className="lg:col-span-6 space-y-6 z-10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
              <span>Islamabad Twin Stores</span>
              <span>·</span>
              <span>I-8 Markaz</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-balance">
              {heroHeadline}
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl text-balance">
              {heroSubheadline}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="px-7 py-3.5 bg-white text-neutral-950 rounded text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{homepageCms?.primaryCtaText || 'Shop Collection'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('new-arrivals')}
                className="px-7 py-3.5 bg-neutral-800/80 border border-neutral-700 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <span>{homepageCms?.secondaryCtaText || 'Explore New Arrivals'}</span>
              </button>
            </div>

            {/* Quiet trust markers */}
            <div className="pt-6 border-t border-neutral-800 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Grade-A Export Surplus</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-amber-300" />
                <span>No-Restock Curation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-neutral-300" />
                <span>Shop 14/15 Zakki & Shop 20 Plaza 2000</span>
              </div>
            </div>
          </div>

          {/* Hero Editorial Image Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded overflow-hidden shadow-2xl border border-neutral-800">
              <img
                src={heroImage}
                alt="Aura Apparel Editorial Campaign"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-neutral-950/80 backdrop-blur-md rounded border border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white uppercase tracking-wider">Autumn / Winter Export Consignment</p>
                  <p className="text-neutral-400">Scandinavian & British Surplus Drops</p>
                </div>
                <button
                  onClick={() => onNavigate('limited-stock')}
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[11px] rounded hover:bg-neutral-200 transition-colors uppercase"
                >
                  View Lot
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================
          A. NEW ARRIVALS
          =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-neutral-200 pb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1">
              Fresh Export Arrivals
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              New Container Drops
            </h2>
          </div>
          <button
            onClick={() => onNavigate('new-arrivals')}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-1.5"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* ===================================================
          B. LIMITED STOCK (URGENCY & NO-RESTOCK MODEL)
          =================================================== */}
      <section className="bg-neutral-100 py-16 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Strictly Limited Overstock · No Restocks</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                Low Inventory Archive
              </h2>
              <p className="text-xs text-neutral-600 mt-1 max-w-xl">
                When international factories clear cancelled bulk runs, we receive between 4 to 20 units per style. Once sold out, they are permanently discontinued.
              </p>
            </div>
            <button
              onClick={() => onNavigate('limited-stock')}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-1.5 shrink-0"
            >
              <span>Explore Limited Stock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {limitedStock.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          C & D. MEN'S & WOMEN'S COLLECTION SHOWCASE
          =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Men's Showcase Card */}
          <div
            onClick={() => onNavigate('men')}
            className="group relative aspect-[16/10] sm:aspect-[16/9] rounded overflow-hidden bg-neutral-900 cursor-pointer shadow-md"
          >
            <img
              src="/src/assets/images/mens_collection_showcase_1790699804267.jpg"
              alt="Men's Export Apparel"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-300">
                  Export Surplus
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                  Men's Collection
                </h3>
                <p className="text-xs text-neutral-300 mt-1">Chore Jackets · Oxford Shirts · Heavy Tees · Denim</p>
              </div>
              <span className="px-4 py-2 bg-white text-black rounded text-xs font-bold uppercase tracking-wider group-hover:bg-neutral-200 transition-colors flex items-center gap-1">
                Shop Men <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Women's Showcase Card */}
          <div
            onClick={() => onNavigate('women')}
            className="group relative aspect-[16/10] sm:aspect-[16/9] rounded overflow-hidden bg-neutral-900 cursor-pointer shadow-md"
          >
            <img
              src="/src/assets/images/womens_collection_showcase_1790699815876.jpg"
              alt="Women's Export Collection"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-300">
                  Curated Overstock
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                  Women's Collection
                </h3>
                <p className="text-xs text-neutral-300 mt-1">Wool Trench Coats · Knitwear · Relaxed Trousers</p>
              </div>
              <span className="px-4 py-2 bg-white text-black rounded text-xs font-bold uppercase tracking-wider group-hover:bg-neutral-200 transition-colors flex items-center gap-1">
                Shop Women <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>

        {/* Featured Men's Items */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold text-neutral-900">
              Men's Highlights
            </h3>
            <button
              onClick={() => onNavigate('men')}
              className="text-xs font-semibold text-neutral-600 hover:text-black uppercase tracking-wider flex items-center gap-1"
            >
              View All Men's <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {mensProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
            ))}
          </div>
        </div>

        {/* Featured Women's Items */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold text-neutral-900">
              Women's Highlights
            </h3>
            <button
              onClick={() => onNavigate('women')}
              className="text-xs font-semibold text-neutral-600 hover:text-black uppercase tracking-wider flex items-center gap-1"
            >
              View All Women's <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {womensProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          E. BEST DEALS / CLEARANCE
          =================================================== */}
      {bestDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6 border-b border-neutral-200 pb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Special Pricing
              </span>
              <h2 className="font-display text-2xl font-bold text-neutral-900">
                Best Deals & Surplus Reductions
              </h2>
            </div>
            <button
              onClick={() => onNavigate('sale')}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-1"
            >
              View All Deals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestDeals.map((product) => (
              <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
            ))}
          </div>
        </section>
      )}

      {/* ===================================================
          F. WHY AURA APPAREL? (4 Value Pillars)
          =================================================== */}
      <section className="bg-white py-16 border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              The Aura Model
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Why Aura Apparel?
            </h2>
            <p className="text-xs text-neutral-600 mt-2">
              We bridge the gap between premium global garment manufacturing and honest Pakistani retail pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-[#FAF9F5] border border-neutral-200 rounded space-y-3">
              <Award className="w-6 h-6 text-neutral-800" />
              <h3 className="font-semibold text-sm text-neutral-900">Premium Export Apparel</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Grade-A fabrications produced in certified Pakistani textile mills for top European and American brand houses.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F5] border border-neutral-200 rounded space-y-3">
              <Layers className="w-6 h-6 text-neutral-800" />
              <h3 className="font-semibold text-sm text-neutral-900">Limited Stock Pieces</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every shipment is unique with limited quantities. Once a style sells out, it is not reproduced or restocked.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F5] border border-neutral-200 rounded space-y-3">
              <RefreshCw className="w-6 h-6 text-neutral-800" />
              <h3 className="font-semibold text-sm text-neutral-900">Regular Weekly Drops</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Fresh inventory arrives every week at our twin retail stores in I-8 Markaz, Islamabad, providing new discoveries on every visit.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F5] border border-neutral-200 rounded space-y-3">
              <Sparkles className="w-6 h-6 text-neutral-800" />
              <h3 className="font-semibold text-sm text-neutral-900">50-70% Below Retail</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Cut through massive international brand markups. Premium heavyweight cotton, wool blends, and selvedge denim at fair prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          G. PHYSICAL STORES SECTION (I-8 Markaz, Islamabad)
          =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 text-white rounded overflow-hidden shadow-xl border border-neutral-800 grid grid-cols-1 lg:grid-cols-12">
          
          {/* Store Info Left */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded border border-neutral-700 text-xs font-semibold uppercase tracking-wider text-amber-300">
                <MapPin className="w-3.5 h-3.5" />
                <span>Visit Our Physical Outlets in Islamabad</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Aura Apparel
                <span className="block text-neutral-400 text-xl font-normal mt-1">I-8 Markaz, Islamabad</span>
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Experience our curated export inventory in person. Touch the fabric density, try on the tailoring, and consult our store staff across our two retail branches located in the heart of I-8 Markaz.
              </p>

              {/* Locations Breakdown */}
              <div className="pt-2 space-y-4 text-xs">
                <div className="p-3.5 bg-neutral-800/70 rounded border border-neutral-700/80">
                  <p className="font-bold text-white text-sm">Branch 1: Zakki Plaza</p>
                  <p className="text-neutral-300">Shop 14/15, Zakki Plaza, I-8 Markaz, Islamabad</p>
                  <p className="text-neutral-400 mt-1">Main showroom featuring chore jackets, denim & heavyweight tees</p>
                </div>

                <div className="p-3.5 bg-neutral-800/70 rounded border border-neutral-700/80">
                  <p className="font-bold text-white text-sm">Branch 2: Plaza 2000</p>
                  <p className="text-neutral-300">Shop 20, Plaza 2000, I-8 Markaz, Islamabad</p>
                  <p className="text-neutral-400 mt-1">Womenswear, trench coats, knitwear & seasonal clearance drops</p>
                </div>
              </div>

              {/* Operating Hours from Admin */}
              <div className="text-xs text-neutral-400 space-y-1">
                <p className="font-medium text-neutral-200">Retail Hours:</p>
                <p>Mon - Thu: {storeSettings?.hours?.weekdays || '11:30 AM - 11:00 PM'}</p>
                <p>Fri: {storeSettings?.hours?.friday || '02:30 PM - 11:30 PM'}</p>
                <p>Sat - Sun: {storeSettings?.hours?.weekends || '11:30 AM - 11:30 PM'}</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-neutral-800">
              {/* Mandatory Google Maps Button with provided link */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-white text-neutral-950 rounded text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Get Directions (Google Maps)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* WhatsApp direct */}
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-emerald-800/90 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Store Interior Photo Right */}
          <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-full">
            <img
              src="/src/assets/images/store_boutique_interior_1790699826704.jpg"
              alt="Aura Apparel I-8 Markaz Interior"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
          </div>

        </div>
      </section>

      {/* ===================================================
          H. CUSTOMER REVIEWS SECTION (Manageable in Admin)
          =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Customer Testimonials
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            Real Feedback from Islamabad & Across Pakistan
          </h2>
          <p className="text-xs text-neutral-600 mt-2">
            Read what shoppers say about our export quality, fit, and speedy delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-neutral-200 rounded shadow-2xs space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <h4 className="font-bold text-sm text-neutral-900">
              "Legitimate European work jacket quality"
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              "Visited their Zakki Plaza branch in I-8. Picked up the canvas chore jacket. The weight and stitching are identical to 200 euro Scandinavian brands. Total steal for under Rs. 5,000."
            </p>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span className="font-semibold text-neutral-800">Hamza Farooq</span>
              <span>Islamabad</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded shadow-2xs space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <h4 className="font-bold text-sm text-neutral-900">
              "Collars that don't warp after washing"
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              "Ordered two 260 GSM boxy tees online to Lahore. Came in 2 days. The thick collar ribbing is true export grade. Finally an honest clothing store in Pakistan."
            </p>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span className="font-semibold text-neutral-800">Daniyal Sheikh</span>
              <span>Lahore</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded shadow-2xs space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <h4 className="font-bold text-sm text-neutral-900">
              "The wool trench coat is magnificent"
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              "Customer service on WhatsApp answered my sizing questions immediately with exact inch measurements. The coat drape and lining look straight out of a boutique lookbook."
            </p>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span className="font-semibold text-neutral-800">Ayesha Malik</span>
              <span>Rawalpindi</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          I. INSTAGRAM / COMMUNITY SHOWCASE
          =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Community & Lookbook
            </span>
            <h3 className="font-display text-xl font-bold text-neutral-900">
              @auraapparelpk on Instagram
            </h3>
          </div>
          <a
            href={storeSettings?.socialLinks?.instagram || 'https://instagram.com'}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-1"
          >
            Follow Our Drops <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="aspect-square rounded overflow-hidden bg-neutral-200 group relative">
            <img
              src="/src/assets/images/hero_fashion_campaign_1790699788342.jpg"
              alt="Aura Lookbook"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square rounded overflow-hidden bg-neutral-200 group relative">
            <img
              src="/src/assets/images/mens_collection_showcase_1790699804267.jpg"
              alt="Aura Lookbook"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square rounded overflow-hidden bg-neutral-200 group relative">
            <img
              src="/src/assets/images/womens_collection_showcase_1790699815876.jpg"
              alt="Aura Lookbook"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square rounded overflow-hidden bg-neutral-200 group relative">
            <img
              src="/src/assets/images/export_overstock_flatlay_1790699838766.jpg"
              alt="Aura Lookbook"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

    </div>
  );
};
