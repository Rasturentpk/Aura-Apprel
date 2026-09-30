import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  Truck,
  ShieldCheck,
} from 'lucide-react';

interface CartPageProps {
  onNavigateToShop: () => void;
  onNavigateToCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigateToShop,
  onNavigateToCheckout,
}) => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    deliverySettings,
    formatPKR,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const freeThreshold = deliverySettings?.freeShippingThreshold || 3500;
  const isFreeDelivery = cartSubtotal >= freeThreshold;
  const amountNeededForFree = Math.max(0, freeThreshold - cartSubtotal);
  const freeProgress = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));

  const discount = appliedCoupon?.discount || 0;
  const estimatedDelivery = cart.length > 0 ? (isFreeDelivery ? 0 : deliverySettings?.standardFee || 250) : 0;
  const grandTotal = Math.max(0, cartSubtotal - discount + estimatedDelivery);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput);
    setCouponLoading(false);
    setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-neutral-900">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Explore our latest export arrivals, Scandinavian chore jackets, and heavyweight tees before limited lots run out.
        </p>
        <button
          onClick={onNavigateToShop}
          className="px-6 py-3 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Review Selection</span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            Shopping Bag ({cartCount} {cartCount === 1 ? 'Item' : 'Items'})
          </h1>
        </div>
        <button
          onClick={onNavigateToShop}
          className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Free Shipping Alert Banner */}
      <div className="p-4 bg-white border border-neutral-200 rounded">
        {isFreeDelivery ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Truck className="w-4 h-4 text-emerald-700" />
            <span>Congratulations! You qualify for FREE nationwide shipping across Pakistan!</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-neutral-700">
              <span>
                Add <strong className="text-neutral-900">{formatPKR(amountNeededForFree)}</strong> more to your order for <strong className="text-emerald-700">FREE Delivery</strong>
              </span>
              <span className="font-mono text-[11px] text-neutral-500">{freeProgress}%</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-neutral-900 h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Items Table Left + Order Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded divide-y divide-neutral-200/80 overflow-hidden">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color.name}`} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              
              {/* Product Info */}
              <div className="flex gap-4 items-center">
                <div className="w-20 h-26 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                  <img
                    src={item.product.images[0] || '/src/assets/images/export_overstock_flatlay_1790699838766.jpg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase">
                    SKU: {item.product.sku}
                  </span>
                  <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>Size: <strong className="text-neutral-900 font-mono">{item.size}</strong></span>
                    <span>·</span>
                    <span>Color: <strong>{item.color.name}</strong></span>
                  </div>
                  <div className="text-xs font-bold text-neutral-900 sm:hidden">
                    {formatPKR(item.price)} each
                  </div>
                </div>
              </div>

              {/* Controls & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-neutral-300 rounded bg-white text-xs">
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.size, item.color.name, item.quantity - 1)}
                    className="px-2.5 py-1 text-neutral-600 hover:text-black font-semibold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-mono font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.size, item.color.name, item.quantity + 1)}
                    className="px-2.5 py-1 text-neutral-600 hover:text-black font-semibold"
                  >
                    +
                  </button>
                </div>

                {/* Line Total */}
                <span className="text-sm font-bold text-neutral-950 tabular-nums w-24 text-right">
                  {formatPKR(item.price * item.quantity)}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.productId, item.size, item.color.name)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded p-6 space-y-6 shadow-2xs">
          <h2 className="font-display text-base font-bold text-neutral-900 uppercase tracking-tight">
            Order Summary
          </h2>

          {/* Coupon Input */}
          <div className="space-y-2">
            {appliedCoupon ? (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-800">
                  <Tag className="w-4 h-4 text-neutral-700" />
                  <span>Coupon: <strong>{appliedCoupon.code}</strong></span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-neutral-500 hover:text-red-600 underline font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon (e.g. AURA500)"
                  className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 uppercase"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponInput.trim()}
                  className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Math Lines */}
          <div className="space-y-2.5 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-neutral-900 font-semibold tabular-nums">{formatPKR(cartSubtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Coupon Discount</span>
                <span className="tabular-nums">-{formatPKR(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-neutral-900 font-semibold tabular-nums">
                {estimatedDelivery === 0 ? 'FREE' : formatPKR(estimatedDelivery)}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-neutral-950 pt-3 border-t border-neutral-200">
              <span>Estimated Total</span>
              <span className="tabular-nums">{formatPKR(grandTotal)}</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Taxes included. City-specific shipping verified at checkout.
            </p>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={onNavigateToCheckout}
            className="w-full py-3.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-[11px] text-neutral-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0" />
            <span>Secure Cash on Delivery & Meezan Raast supported</span>
          </div>
        </div>

      </div>

    </div>
  );
};
