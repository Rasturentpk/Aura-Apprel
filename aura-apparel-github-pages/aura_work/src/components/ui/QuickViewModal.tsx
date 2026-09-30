import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { X, Check, Heart, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface QuickViewModalProps {
  onNavigateToProduct: (slugOrId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigateToProduct }) => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    storeSettings,
    formatPKR,
  } = useStore();

  const product = quickViewProduct;

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // Sync initial state when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'Standard');
      setSelectedColorIndex(0);
      setQuantity(1);
      setActiveImageIdx(0);
    }
  }, [product]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockThreshold;

  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const selectedColor = product.colors[selectedColorIndex] || { name: 'Standard', hex: '#111' };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setQuickViewProduct(null);
  };

  // WhatsApp Integration (Mandatory Requirement #28)
  const whatsappNum = (storeSettings?.whatsapp || '+92 314 0855 651').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    `Hello Aura Apparel! I am interested in: "${product.name}" (SKU: ${product.sku}, Price: ${formatPKR(currentPrice)}, Size: ${selectedSize}). Is this currently available at your I-8 Markaz store?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FAF9F5] border border-neutral-300 rounded shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-10 p-2 text-neutral-500 hover:text-black bg-white/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery */}
        <div className="w-full md:w-1/2 p-4 bg-neutral-100 flex flex-col justify-between">
          <div className="aspect-[3/4] w-full overflow-hidden rounded bg-neutral-200">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-18 rounded overflow-hidden border shrink-0 transition-all ${
                    activeImageIdx === idx ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-300 opacity-70'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Controls */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category & Status */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider mb-1">
              <span>{product.categoryName}</span>
              <span>·</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h2 className="font-display text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-xl font-bold text-neutral-950 tabular-nums">
                {formatPKR(currentPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-neutral-400 line-through tabular-nums">
                    {formatPKR(product.price)}
                  </span>
                  <span className="text-xs font-semibold text-neutral-900 px-1.5 py-0.5 bg-neutral-200/80 rounded">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="mt-2 text-xs">
              {isOutOfStock ? (
                <span className="text-red-700 font-semibold">Sold Out</span>
              ) : isLowStock ? (
                <span className="text-amber-800 font-semibold">
                  Only {product.stock} left in stock (I-8 Markaz)
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready to Dispatch
                </span>
              )}
            </div>

            {/* Description excerpt */}
            <p className="mt-3 text-xs text-neutral-600 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-neutral-800 uppercase tracking-wide">
                  Select Size
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-neutral-500 hover:text-black underline text-xs cursor-pointer"
                >
                  Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-10 px-3 py-1.5 text-xs font-medium rounded border transition-all ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-300 text-neutral-700 hover:border-neutral-500'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mt-4">
                <span className="block text-xs font-semibold text-neutral-800 uppercase tracking-wide mb-2">
                  Color: <span className="font-normal text-neutral-600">{selectedColor.name}</span>
                </span>
                <div className="flex gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                        selectedColorIndex === idx ? 'border-neutral-900 scale-110' : 'border-neutral-300'
                      }`}
                      title={c.name}
                    >
                      <div className="w-full h-full rounded-full" style={{ backgroundColor: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">
                Quantity:
              </span>
              <div className="flex items-center border border-neutral-300 rounded bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-sm font-semibold text-neutral-600 hover:text-black"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-mono font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-2.5 py-1 text-sm font-semibold text-neutral-600 hover:text-black"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2.5">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2.5 rounded border transition-colors ${
                  isFavorited ? 'border-red-300 bg-red-50 text-red-600' : 'border-neutral-300 text-neutral-600 hover:text-black'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* WhatsApp Integration Button (Mandatory #28) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 border border-emerald-700/80 bg-emerald-50 text-emerald-900 rounded text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>Ask About This Product on WhatsApp</span>
            </a>

            {/* Full Product Page Link */}
            <button
              onClick={() => {
                setQuickViewProduct(null);
                onNavigateToProduct(product.slug || product.id);
              }}
              className="w-full py-1 text-xs text-neutral-500 hover:text-black flex items-center justify-center gap-1 font-medium transition-colors"
            >
              <span>View Full Details & Sizing Specs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
