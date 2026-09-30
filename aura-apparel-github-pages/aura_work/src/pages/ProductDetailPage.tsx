import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { Product, Review } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ProductCard } from '../components/ui/ProductCard.tsx';
import {
  Heart,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Star,
  Check,
  Share2,
  ChevronRight,
  ArrowRight,
  Send,
} from 'lucide-react';

interface ProductDetailPageProps {
  slugOrId: string;
  onNavigateToShop: () => void;
  onNavigateToProduct: (slugOrId: string) => void;
  onNavigateToCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slugOrId,
  onNavigateToShop,
  onNavigateToProduct,
  onNavigateToCheckout,
}) => {
  const {
    allProducts,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    storeSettings,
    deliverySettings,
    showToast,
    formatPKR,
  } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Purchase module selections
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load product data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .getProduct(slugOrId)
      .then((data) => {
        if (!isMounted) return;
        setProduct(data.product);
        setRelated(data.related);
        setReviews(data.reviews);
        setSelectedImageIdx(0);
        setSelectedSize(data.product.sizes[0] || 'Standard');
        setSelectedColorIdx(0);
        setQuantity(1);
      })
      .catch((err) => {
        console.error('Failed to load product:', err);
        // Fallback search in allProducts
        const found = allProducts.find((p) => p.slug === slugOrId || p.id === slugOrId);
        if (found && isMounted) {
          setProduct(found);
          setSelectedSize(found.sizes[0] || 'Standard');
          setRelated(allProducts.filter((p) => p.id !== found.id && p.categoryId === found.categoryId).slice(0, 4));
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slugOrId, allProducts]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Loading garment details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-neutral-900">Garment Not Found</h2>
        <p className="text-xs text-neutral-500">This piece may have been sold out or archived.</p>
        <button
          onClick={onNavigateToShop}
          className="px-6 py-2.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockThreshold;

  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const selectedColor = product.colors[selectedColorIdx] || { name: 'Standard', hex: '#111' };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    onNavigateToCheckout();
  };

  // WhatsApp Integration (Mandatory Requirement #28)
  const whatsappNum = (storeSettings?.whatsapp || '+92 314 0855 651').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    `Hello Aura Apparel! I am inquiring about: "${product.name}" (SKU: ${product.sku}, Price: ${formatPKR(currentPrice)}, Selected Size: ${selectedSize}, Selected Color: ${selectedColor.name}). Can you confirm availability at your I-8 Markaz branch?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${whatsappMessage}`;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Please fill out your name and review comment', 'error');
      return;
    }
    setSubmittingReview(true);
    try {
      const created = await api.submitReview({
        productId: product.id,
        customerName: reviewName,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviews((prev) => [created, ...prev]);
      showToast('Thank you for your review!');
      setReviewName('');
      setReviewTitle('');
      setReviewComment('');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">
        <button onClick={onNavigateToShop} className="hover:text-black">
          Catalog
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>{product.categoryName}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid: Gallery Left + Sticky Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-22 rounded overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIdx === idx ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Display Image */}
          <div className="flex-1 aspect-[3/4] bg-[#F2F1EC] rounded overflow-hidden border border-neutral-200 relative">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {/* Urgency Badge */}
            {isLowStock && (
              <span className="absolute top-4 left-4 bg-amber-50/95 border border-amber-300 text-amber-900 text-xs font-semibold px-2.5 py-1">
                Only {product.stock} pieces remaining
              </span>
            )}
            {isOutOfStock && (
              <span className="absolute top-4 left-4 bg-white/95 border border-neutral-300 text-neutral-900 text-xs font-semibold px-2.5 py-1">
                Sold Out
              </span>
            )}
          </div>

        </div>

        {/* Right: Contiguous Purchase Module (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 bg-white p-6 sm:p-8 rounded border border-neutral-200/80 shadow-2xs">
          
          {/* Header & Meta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-wider">
              <span>{product.categoryName} · {product.gender}</span>
              <span className="font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-bold text-neutral-950 tabular-nums">
                {formatPKR(currentPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-neutral-400 line-through tabular-nums">
                    {formatPKR(product.price)}
                  </span>
                  <span className="text-xs font-semibold text-neutral-900 px-2 py-0.5 bg-neutral-100 rounded border border-neutral-300">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Stock condition */}
            <div className="pt-1 text-xs">
              {isOutOfStock ? (
                <span className="text-red-700 font-semibold">Currently Sold Out</span>
              ) : isLowStock ? (
                <span className="text-amber-800 font-semibold">
                  Low Stock: Only {product.stock} units left at I-8 Markaz stores
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> In Stock for Same-Day Dispatch
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-2 border-t border-neutral-100">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-900 uppercase tracking-wide">
                Select Size: <strong className="font-mono">{selectedSize}</strong>
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-neutral-500 hover:text-black underline flex items-center gap-1 cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-11 px-3.5 py-2 text-xs font-semibold rounded border transition-all ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-600'
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
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <span className="block text-xs font-semibold text-neutral-900 uppercase tracking-wide">
                Color: <span className="font-normal text-neutral-600">{selectedColor.name}</span>
              </span>
              <div className="flex gap-2.5">
                {product.colors.map((c, idx) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                      selectedColorIdx === idx ? 'border-neutral-900 scale-110 shadow-xs' : 'border-neutral-300'
                    }`}
                    title={c.name}
                  >
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Buy CTAs */}
          <div className="pt-2 border-t border-neutral-100 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
                Quantity:
              </span>
              <div className="flex items-center border border-neutral-300 rounded bg-white text-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 font-semibold text-neutral-600 hover:text-black"
                >
                  -
                </button>
                <span className="px-3 py-1 font-mono font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1 font-semibold text-neutral-600 hover:text-black"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 py-3 bg-neutral-100 border border-neutral-300 text-neutral-900 rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                Buy Now
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded border transition-colors ${
                  isFavorited ? 'border-red-300 bg-red-50 text-red-600' : 'border-neutral-300 text-neutral-700 hover:text-black'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* WhatsApp Integration: "Ask About This Product" (Mandatory #28) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-700/80 text-emerald-900 rounded text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>Ask About This Product on WhatsApp</span>
            </a>
          </div>

          {/* Delivery & Assurance Perks */}
          <div className="pt-4 border-t border-neutral-100 space-y-3 text-xs text-neutral-600">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-neutral-900">
                  Speedy Delivery Across Pakistan
                </p>
                <p className="text-[11px] text-neutral-500">
                  {deliverySettings?.estimatedDaysLocal || '1-2 Days in Islamabad/Rawalpindi'} · {deliverySettings?.estimatedDaysNational || '3-5 Days Nationwide'}. Free shipping on orders over {formatPKR(deliverySettings?.freeShippingThreshold || 3500)}.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-neutral-900">7-Day Exchange Guarantee</p>
                <p className="text-[11px] text-neutral-500">
                  Hassle-free size exchange in our I-8 Markaz stores or via courier.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-neutral-900">Grade-A Export Overrun</p>
                <p className="text-[11px] text-neutral-500">
                  {product.details?.exportBatchInfo || 'Authentic factory overstock lot inspected at I-8 Markaz.'}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Garment Technical Specifications Accordion / Specs */}
      <section className="bg-white p-6 sm:p-8 rounded border border-neutral-200">
        <h3 className="font-display text-lg font-bold text-neutral-900 uppercase mb-4">
          Garment Specifications & Fabric Care
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="font-bold text-neutral-900 block mb-1">Fabric Composition</span>
            <span className="text-neutral-600">{product.details?.fabric || '100% Export Grade Combed Cotton'}</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="font-bold text-neutral-900 block mb-1">Fit Profile</span>
            <span className="text-neutral-600">{product.details?.fit || 'Standard Relaxed European Cut'}</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="font-bold text-neutral-900 block mb-1">Washing Instructions</span>
            <span className="text-neutral-600">{product.details?.care || 'Machine wash cold inside-out, tumble dry low'}</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="font-bold text-neutral-900 block mb-1">Surplus Source</span>
            <span className="text-neutral-600">{product.details?.origin || 'European Export Overstock'}</span>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="space-y-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Verified Shopper Feedback
            </span>
            <h3 className="font-display text-2xl font-bold text-neutral-900">
              Customer Reviews ({reviews.length})
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Reviews List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 text-center bg-white border border-neutral-200 rounded text-xs text-neutral-500">
                No reviews yet for this article. Be the first to share your experience!
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="p-5 bg-white border border-neutral-200 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-neutral-900">{r.customerName}</span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="font-semibold text-xs text-neutral-800">{r.title}</p>
                  <p className="text-xs text-neutral-600 leading-relaxed">{r.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Review Submission Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded border border-neutral-200 space-y-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900">
              Write a Review
            </h4>

            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 mb-1 font-medium">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Bilal Ahmed"
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-medium">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewRating ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-medium">Review Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Exceptional fabric weight"
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-medium">Your Comment</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell others about the textile quality, fit, and stitching..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 bg-neutral-900 text-white rounded font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Review</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-neutral-900">
              Complementary Export Pieces
            </h3>
            <button
              onClick={onNavigateToShop}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-1"
            >
              Browse Full Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={(id) => onNavigateToProduct(id)}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
