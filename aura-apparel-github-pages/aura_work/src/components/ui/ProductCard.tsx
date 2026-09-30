import React, { useState } from 'react';
import { Product } from '../../types/index.ts';
import { useStore } from '../../context/StoreContext.tsx';
import { Heart, Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { toggleWishlist, isInWishlist, setQuickViewProduct, addToCart, formatPKR } = useStore();
  const [imageIndex, setImageIndex] = useState(0);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockThreshold;

  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = product.sizes[0] || 'Standard';
    const defaultColor = product.colors[0] || { name: 'Standard', hex: '#111111' };
    addToCart(product, defaultSize, defaultColor, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      onClick={() => onSelectProduct(product.slug || product.id)}
      className="group relative flex flex-col bg-white border border-neutral-200/80 rounded overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-sm hover:border-neutral-400"
    >
      {/* Image Container (65-75% height) */}
      <div
        className="relative w-full aspect-[3/4] bg-[#F2F1EC] overflow-hidden"
        onMouseEnter={() => {
          if (product.images.length > 1) setImageIndex(1);
        }}
        onMouseLeave={() => setImageIndex(0)}
      >
        <img
          src={product.images[imageIndex] || product.images[0] || '/src/assets/images/export_overstock_flatlay_1790699838766.jpg'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
          loading="lazy"
        />

        {/* Quiet unboxed text status (Zero-pill discipline) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {isOutOfStock ? (
            <span className="text-[11px] font-semibold tracking-wide text-neutral-900 bg-white/90 px-2 py-0.5 border border-neutral-300">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-[11px] font-semibold tracking-wide text-amber-900 bg-amber-50/95 px-2 py-0.5 border border-amber-300">
              Only {product.stock} left
            </span>
          ) : product.isLimitedStock ? (
            <span className="text-[11px] font-semibold tracking-wide text-neutral-900 bg-white/90 px-2 py-0.5 border border-neutral-200">
              Limited Pieces
            </span>
          ) : null}

          {hasDiscount && (
            <span className="text-[11px] font-semibold tracking-wide text-neutral-900 bg-white/90 px-2 py-0.5 border border-neutral-200">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-all ${
            isFavorited
              ? 'text-red-600 shadow-xs'
              : 'text-neutral-600 hover:text-black hover:bg-white shadow-2xs'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2 bg-white/95 backdrop-blur-xs text-neutral-900 text-xs font-semibold uppercase tracking-wider rounded border border-neutral-200 hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className="px-3 py-2 bg-neutral-900 text-white rounded text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center shadow-sm"
              title="Quick Add to Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          {/* Category & Origin quiet metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 uppercase tracking-wider mb-1 truncate">
            <span>{product.categoryName || 'Apparel'}</span>
            <span aria-hidden="true">·</span>
            <span>{product.gender}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-xs sm:text-sm text-neutral-900 line-clamp-1 group-hover:text-neutral-700 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Sizes and Price */}
        <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
          {/* Price with tabular numerals */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-neutral-950 tabular-nums">
              {formatPKR(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                {formatPKR(product.price)}
              </span>
            )}
          </div>

          {/* Available Sizes Badge preview */}
          <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
            {product.sizes.slice(0, 3).map((s) => (
              <span key={s} className="px-1 py-0.5 border border-neutral-200 rounded text-neutral-600">
                {s}
              </span>
            ))}
            {product.sizes.length > 3 && <span>+{product.sizes.length - 3}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
