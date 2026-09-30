import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Truck } from 'lucide-react';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onNavigateToShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCheckout,
  onNavigateToShop,
}) => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
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

  if (!isCartDrawerOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl flex flex-col border-l border-neutral-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4.5 h-4.5 text-neutral-800" />
              <h2 className="font-display text-base font-bold text-neutral-900 uppercase tracking-tight">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-black rounded"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-neutral-100 px-4 py-2.5 border-b border-neutral-200 text-xs">
            {isFreeDelivery ? (
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>You unlocked FREE nationwide delivery!</span>
              </div>
            ) : (
              <div>
                <p className="text-neutral-700 mb-1">
                  Add <span className="font-bold text-neutral-900">{formatPKR(amountNeededForFree)}</span> more to unlock <span className="font-semibold">FREE Delivery</span>
                </p>
                <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-neutral-900 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${freeProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-200/80">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <ShoppingBag className="w-12 h-12 text-neutral-300 stroke-1" />
                <p className="font-semibold text-neutral-800 text-sm">Your shopping bag is empty</p>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Discover authentic export surplus, chore jackets, and heavyweight cotton essentials.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigateToShop();
                  }}
                  className="mt-2 px-5 py-2.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color.name}`} className="py-4 first:pt-0 flex gap-3">
                  {/* Image */}
                  <div className="w-20 h-26 rounded bg-neutral-200 overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0] || '/src/assets/images/export_overstock_flatlay_1790699838766.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size, item.color.name)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
                        <span>Size: <strong className="text-neutral-800 font-mono">{item.size}</strong></span>
                        <span>·</span>
                        <span>{item.color.name}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-neutral-300 rounded bg-white text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.size, item.color.name, item.quantity - 1)}
                          className="px-2 py-0.5 text-neutral-600 hover:text-black font-semibold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.size, item.color.name, item.quantity + 1)}
                          className="px-2 py-0.5 text-neutral-600 hover:text-black font-semibold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-neutral-950 tabular-nums">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Controls & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-neutral-200 space-y-3">
              {/* Coupon input */}
              {appliedCoupon ? (
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-800">
                    <Tag className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong> (-{formatPKR(appliedCoupon.discount)})</span>
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
                    placeholder="Enter coupon (e.g. AURA500)"
                    className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 uppercase"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Order calculation lines */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 font-medium tabular-nums">{formatPKR(cartSubtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-medium tabular-nums">-{formatPKR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="text-neutral-900 font-medium tabular-nums">
                    {estimatedDelivery === 0 ? 'FREE' : formatPKR(estimatedDelivery)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span className="tabular-nums">{formatPKR(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onNavigateToCheckout();
                }}
                className="w-full py-3 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
