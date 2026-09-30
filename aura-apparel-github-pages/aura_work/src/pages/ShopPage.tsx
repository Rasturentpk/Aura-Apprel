import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ui/ProductCard.tsx';
import { Product, Gender } from '../types/index.ts';
import {
  SlidersHorizontal,
  X,
  Search,
  ArrowUpDown,
  Check,
  RotateCcw,
} from 'lucide-react';

interface ShopPageProps {
  onSelectProduct: (slugOrId: string) => void;
  initialCategory?: string;
  initialGender?: string;
  initialOnlyLimited?: boolean;
  initialOnlySale?: boolean;
  initialOnlyNew?: boolean;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onSelectProduct,
  initialCategory,
  initialGender,
  initialOnlyLimited = false,
  initialOnlySale = false,
  initialOnlyNew = false,
}) => {
  const { allProducts, categories, searchQuery, setSearchQuery, formatPKR } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedGender, setSelectedGender] = useState<string>(initialGender || 'all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyLimited, setOnlyLimited] = useState<boolean>(initialOnlyLimited);
  const [onlySale, setOnlySale] = useState<boolean>(initialOnlySale);
  const [onlyNew, setOnlyNew] = useState<boolean>(initialOnlyNew);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Derive unique sizes across all products
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [allProducts]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) =>
          p.categoryId === selectedCategory ||
          p.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Gender
    if (selectedGender !== 'all') {
      result = result.filter(
        (p) => p.gender.toLowerCase() === selectedGender.toLowerCase() || p.gender === 'Unisex'
      );
    }

    // Size
    if (selectedSize !== 'all') {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    // In Stock
    if (onlyInStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // Limited Stock
    if (onlyLimited) {
      result = result.filter((p) => p.isLimitedStock || p.stock <= p.lowStockThreshold);
    }

    // Sale
    if (onlySale) {
      result = result.filter((p) => p.isSale || (p.salePrice && p.salePrice < p.price));
    }

    // New Arrivals
    if (onlyNew) {
      result = result.filter((p) => p.isNewArrival);
    }

    // Price
    result = result.filter((p) => (p.salePrice ?? p.price) <= maxPrice);

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [
    allProducts,
    searchQuery,
    selectedCategory,
    selectedGender,
    selectedSize,
    onlyInStock,
    onlyLimited,
    onlySale,
    onlyNew,
    maxPrice,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedSize('all');
    setOnlyInStock(false);
    setOnlyLimited(false);
    setOnlySale(false);
    setOnlyNew(false);
    setMaxPrice(10000);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedGender !== 'all' ||
    selectedSize !== 'all' ||
    onlyInStock ||
    onlyLimited ||
    onlySale ||
    onlyNew ||
    maxPrice < 10000 ||
    searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Aura Apparel Catalog
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            {onlyLimited
              ? 'Limited Stock Overrun Archive'
              : onlySale
              ? 'Deals & Clearance'
              : onlyNew
              ? 'New Export Arrivals'
              : selectedGender === 'Men'
              ? "Men's Export Apparel"
              : selectedGender === 'Women'
              ? "Women's Export Collection"
              : 'All Export Apparel'}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Displaying {filteredProducts.length} pieces available at our I-8 Markaz Islamabad stores and nationwide dispatch.
          </p>
        </div>

        {/* Action Controls: Search, Sort & Mobile Filter Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-800 flex items-center gap-2 hover:bg-neutral-100"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-neutral-300 rounded px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:border-neutral-900"
            >
              <option value="newest">Sort: Newest Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Best Sellers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills (Zero-pill text representation) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 bg-neutral-100/70 p-2.5 rounded border border-neutral-200">
          <span className="font-semibold text-neutral-800">Active filters:</span>
          {selectedCategory !== 'all' && (
            <span className="bg-white px-2 py-0.5 rounded border border-neutral-300 flex items-center gap-1">
              Category: {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedGender !== 'all' && (
            <span className="bg-white px-2 py-0.5 rounded border border-neutral-300 flex items-center gap-1">
              Gender: {selectedGender}
              <button onClick={() => setSelectedGender('all')} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedSize !== 'all' && (
            <span className="bg-white px-2 py-0.5 rounded border border-neutral-300 flex items-center gap-1">
              Size: {selectedSize}
              <button onClick={() => setSelectedSize('all')} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {onlyLimited && (
            <span className="bg-white px-2 py-0.5 rounded border border-neutral-300 flex items-center gap-1">
              Limited Stock
              <button onClick={() => setOnlyLimited(false)} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {onlyInStock && (
            <span className="bg-white px-2 py-0.5 rounded border border-neutral-300 flex items-center gap-1">
              In Stock Only
              <button onClick={() => setOnlyInStock(false)} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {onlySale && (
            <span className="bg-white px-2 py-0.5 rounded border border-neutral-300 flex items-center gap-1">
              On Sale
              <button onClick={() => setOnlySale(false)} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="bg-white px-2 py-0.5 rounded border border-neutral-300 flex items-center gap-1">
              Keyword: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="ml-auto text-xs font-semibold text-neutral-800 hover:text-red-700 underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset All
          </button>
        </div>
      )}

      {/* Main Layout: Desktop Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 pr-4 border-r border-neutral-200 text-xs">
          
          {/* Gender */}
          <div className="space-y-2">
            <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
              Gender
            </h3>
            <div className="space-y-1">
              {['all', 'Men', 'Women', 'Unisex'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors ${
                    selectedGender === g
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span>{g === 'all' ? 'All Genders' : g}</span>
                  {selectedGender === g && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2 pt-4 border-t border-neutral-200">
            <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
              Category
            </h3>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  {selectedCategory === c.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2 pt-4 border-t border-neutral-200">
            <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
              Size
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedSize('all')}
                className={`px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
                  selectedSize === 'all'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 text-neutral-700 hover:border-neutral-500'
                }`}
              >
                All
              </button>
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-2.5 py-1 rounded border text-xs font-medium font-mono transition-colors ${
                    selectedSize === s
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 text-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="space-y-2 pt-4 border-t border-neutral-200">
            <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
              Availability & Deals
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-black">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-black">
                <input
                  type="checkbox"
                  checked={onlyLimited}
                  onChange={(e) => setOnlyLimited(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <span>Limited Stock / No-Restock</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-black">
                <input
                  type="checkbox"
                  checked={onlySale}
                  onChange={(e) => setOnlySale(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <span>Sale / Markdown</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-black">
                <input
                  type="checkbox"
                  checked={onlyNew}
                  onChange={(e) => setOnlyNew(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <span>New Arrivals</span>
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
              <span>Max Price</span>
              <span className="font-mono text-neutral-950">{formatPKR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="1500"
              max="10000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
          </div>

        </aside>

        {/* Product Grid (9 cols on desktop) */}
        <div className="col-span-1 lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white border border-neutral-200 rounded p-8 space-y-4">
              <p className="font-semibold text-neutral-800 text-base">No pieces match your filters</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try expanding your search query, adjusting the price slider, or resetting size filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-[#FAF9F5] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <h2 className="font-display font-bold text-sm uppercase">Filter Products</h2>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <h3 className="font-bold text-xs uppercase mb-2">Gender</h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['all', 'Men', 'Women', 'Unisex'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGender(g)}
                        className={`py-1.5 text-xs rounded border ${
                          selectedGender === g
                            ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                            : 'border-neutral-300 text-neutral-700'
                        }`}
                      >
                        {g === 'all' ? 'All' : g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-1 pt-3 border-t border-neutral-200">
                  <h3 className="font-bold text-xs uppercase mb-2">Category</h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left py-1 px-2 rounded text-xs ${
                        selectedCategory === 'all' ? 'bg-neutral-900 text-white' : 'text-neutral-700'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.id)}
                        className={`w-full text-left py-1 px-2 rounded text-xs ${
                          selectedCategory === c.id ? 'bg-neutral-900 text-white' : 'text-neutral-700'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Price */}
                <div className="space-y-1 pt-3 border-t border-neutral-200">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>Max Price</span>
                    <span className="font-mono">{formatPKR(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="10000"
                    step="250"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-neutral-900"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200 space-y-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Apply Filters ({filteredProducts.length} items)
                </button>
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2 border border-neutral-300 text-neutral-700 rounded text-xs font-medium"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
