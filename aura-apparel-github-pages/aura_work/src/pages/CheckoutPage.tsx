import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { api } from '../services/api.ts';
import { Order, PaymentMethod } from '../types/index.ts';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Building,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigateToCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigateToCart,
  onOrderPlaced,
}) => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    clearCart,
    deliverySettings,
    paymentSettings,
    showToast,
    formatPKR,
  } = useStore();

  // Customer Delivery Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [province, setProvince] = useState('Islamabad Capital Territory');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Delivery fee calculation
  const freeThreshold = deliverySettings?.freeShippingThreshold || 3500;
  const isFreeDelivery = cartSubtotal >= freeThreshold;
  
  let deliveryFee = isFreeDelivery ? 0 : deliverySettings?.standardFee || 250;
  if (!isFreeDelivery && deliverySettings?.zones) {
    const matched = deliverySettings.zones.find((z) =>
      z.name.toLowerCase().includes(city.toLowerCase())
    );
    if (matched) deliveryFee = matched.rate;
  }

  const discount = appliedCoupon?.discount || 0;
  const grandTotal = Math.max(0, cartSubtotal - discount + deliveryFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      showToast('Your bag is empty', 'error');
      onNavigateToCart();
      return;
    }

    if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim() || !city.trim()) {
      setErrorMessage('Please fill in all required customer details.');
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Phone validation for Pakistan format
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid Pakistani contact phone number (e.g. 0314 0855 651).');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        customerInfo: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          address: address.trim(),
          city: city.trim(),
          province: province.trim(),
          postalCode: postalCode.trim() || undefined,
          notes: notes.trim() || undefined,
        },
        items: cart.map((item) => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        paymentMethod,
        couponCode: appliedCoupon?.code,
      };

      // REAL BACKEND CALL (Mandatory Requirement)
      const order = await api.submitOrder(orderPayload);

      // Clear local cart
      clearCart();
      showToast(`Order #${order.id} placed successfully!`);
      onOrderPlaced(order);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
      showToast(err.message || 'Order failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const pakistaniCities = [
    'Islamabad',
    'Rawalpindi',
    'Lahore',
    'Karachi',
    'Peshawar',
    'Faisalabad',
    'Multan',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Abbottabad',
    'Wah Cantt',
    'Other City (Pakistan)',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Checkout
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            Shipping & Payment Details
          </h1>
        </div>
        <button
          onClick={onNavigateToCart}
          className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bag</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded flex items-center gap-3 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Form Left (7 Cols) + Summary Right (5 Cols) */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Form: Delivery & Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Customer Information */}
          <div className="bg-white p-6 sm:p-7 rounded border border-neutral-200 space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 uppercase tracking-tight flex items-center gap-2">
              <span>1. Contact & Customer Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Zaryab Khan"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Phone Number (WhatsApp Preferred) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 314 0855651 or 0300 1234567"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. zaryab@example.com"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-white p-6 sm:p-7 rounded border border-neutral-200 space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 uppercase tracking-tight flex items-center gap-2">
              <span>2. Delivery Address (Pakistan)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-semibold mb-1">
                  Complete Street Address / House / Flat / Street *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 42, Street 18, Sector F-8/3"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900 bg-white"
                >
                  {pakistaniCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Province
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900 bg-white"
                >
                  <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Postal / ZIP Code (Optional)
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 44000"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-semibold mb-1">
                  Special Delivery Instructions / Gate Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before arrival, leave at reception, or deliver between 2 PM - 6 PM"
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method (Configurable from Admin) */}
          <div className="bg-white p-6 sm:p-7 rounded border border-neutral-200 space-y-4">
            <h2 className="font-display text-base font-bold text-neutral-900 uppercase tracking-tight flex items-center gap-2">
              <span>3. Select Payment Option</span>
            </h2>

            <div className="space-y-3 text-xs">
              {/* Cash on Delivery */}
              {paymentSettings?.codEnabled !== false && (
                <label
                  className={`block p-4 border rounded cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-neutral-900 bg-neutral-50/70 ring-1 ring-neutral-900'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-neutral-900"
                    />
                    <Banknote className="w-5 h-5 text-neutral-800 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-neutral-900 text-sm">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-neutral-500 text-[11px] mt-0.5">
                        {paymentSettings?.codInstructions ||
                          'Pay cash directly to the TCS/Leopards courier upon parcel delivery.'}
                      </p>
                    </div>
                  </div>
                </label>
              )}

              {/* Bank Transfer / Raast */}
              {paymentSettings?.bankTransferEnabled !== false && (
                <label
                  className={`block p-4 border rounded cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-neutral-900 bg-neutral-50/70 ring-1 ring-neutral-900'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="accent-neutral-900"
                    />
                    <Building className="w-5 h-5 text-neutral-800 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-neutral-900 text-sm">
                        Bank Transfer / Meezan Raast
                      </p>
                      <p className="text-neutral-500 text-[11px] mt-0.5">
                        Transfer to our official Meezan Bank account and WhatsApp screenshot to +92 314 0855 651 for priority dispatch.
                      </p>
                    </div>
                  </div>

                  {paymentMethod === 'bank_transfer' && paymentSettings?.bankDetails && (
                    <div className="mt-3 ml-7 p-3 bg-white border border-neutral-200 rounded text-[11px] space-y-1 font-mono text-neutral-800">
                      <p><strong>Bank:</strong> {paymentSettings.bankDetails.bankName}</p>
                      <p><strong>Title:</strong> {paymentSettings.bankDetails.accountTitle}</p>
                      <p><strong>Account #:</strong> {paymentSettings.bankDetails.accountNumber}</p>
                      <p><strong>IBAN:</strong> {paymentSettings.bankDetails.iban}</p>
                      <p className="font-sans text-[10px] text-neutral-500 pt-1">
                        {paymentSettings.bankDetails.instructions}
                      </p>
                    </div>
                  )}
                </label>
              )}

              {/* Manual / In-Store Pickup */}
              {paymentSettings?.manualPaymentEnabled !== false && (
                <label
                  className={`block p-4 border rounded cursor-pointer transition-all ${
                    paymentMethod === 'manual'
                      ? 'border-neutral-900 bg-neutral-50/70 ring-1 ring-neutral-900'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="manual"
                      checked={paymentMethod === 'manual'}
                      onChange={() => setPaymentMethod('manual')}
                      className="accent-neutral-900"
                    />
                    <CreditCard className="w-5 h-5 text-neutral-800 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-neutral-900 text-sm">
                        In-Store Pickup / JazzCash / EasyPaisa
                      </p>
                      <p className="text-neutral-500 text-[11px] mt-0.5">
                        Pick up directly at Shop 14/15 Zakki Plaza, I-8 Markaz Islamabad, or send payment via mobile wallet.
                      </p>
                    </div>
                  </div>
                </label>
              )}
            </div>
          </div>

        </div>

        {/* Right Summary: Order Items & Place Order Button (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded border border-neutral-200 space-y-6 shadow-2xs lg:sticky lg:top-24">
          <h2 className="font-display text-base font-bold text-neutral-900 uppercase tracking-tight">
            Order Review ({cart.length} {cart.length === 1 ? 'Article' : 'Articles'})
          </h2>

          {/* Items Preview */}
          <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-1">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color.name}`} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-14 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                    <img
                      src={item.product.images[0] || '/src/assets/images/export_overstock_flatlay_1790699838766.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 line-clamp-1">{item.product.name}</h4>
                    <p className="text-[11px] text-neutral-500">
                      {item.size} · {item.color.name} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-neutral-950 tabular-nums">
                  {formatPKR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Math */}
          <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-neutral-900 font-semibold tabular-nums">{formatPKR(cartSubtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Coupon ({appliedCoupon?.code})</span>
                <span className="tabular-nums">-{formatPKR(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Fee ({city})</span>
              <span className="text-neutral-900 font-semibold tabular-nums">
                {deliveryFee === 0 ? 'FREE' : formatPKR(deliveryFee)}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-neutral-950 pt-3 border-t border-neutral-200">
              <span>Grand Total</span>
              <span className="tabular-nums">{formatPKR(grandTotal)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {submitting ? (
              <span>Confirming Order...</span>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-[11px] text-neutral-500 space-y-1.5 pt-2 border-t border-neutral-100">
            <p className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Pakistani Order Verification</span>
            </p>
            <p>
              Your order record will be created in our secure database. A confirmation notification and tracking updates will be communicated on your provided phone number and email.
            </p>
          </div>

        </div>

      </form>

    </div>
  );
};
