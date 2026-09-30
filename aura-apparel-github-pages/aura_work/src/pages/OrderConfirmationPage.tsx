import React from 'react';
import { Order } from '../types/index.ts';
import { useStore } from '../context/StoreContext.tsx';
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  MessageCircle,
  Truck,
  Building,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface OrderConfirmationPageProps {
  order: Order | null;
  onNavigateToShop: () => void;
  onNavigateToAccount: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onNavigateToShop,
  onNavigateToAccount,
}) => {
  const { storeSettings, paymentSettings, formatPKR } = useStore();

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-neutral-900">No Active Order Found</h2>
        <p className="text-xs text-neutral-500">Please browse our collection or check your order history.</p>
        <button
          onClick={onNavigateToShop}
          className="px-6 py-2.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const whatsappNum = (storeSettings?.whatsapp || '+92 314 0855 651').replace(/[^0-9]/g, '');
  const whatsappMsg = encodeURIComponent(
    `Hello Aura Apparel! I just placed order #${order.id} for ${formatPKR(order.grandTotal)}. Name: ${order.customerName}, Phone: ${order.customerPhone}. Please confirm dispatch status.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${whatsappMsg}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Success Card Header */}
      <div className="bg-white p-6 sm:p-10 rounded border border-neutral-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Order #{order.id} Confirmed
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mt-3">
            Thank You For Your Order!
          </h1>
          <p className="text-xs text-neutral-600 mt-2 max-w-lg mx-auto">
            Your order has been recorded in our database and routed to our fulfillment showroom at <strong>I-8 Markaz, Islamabad</strong>.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-emerald-800 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm Order on WhatsApp</span>
          </a>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-neutral-100 border border-neutral-300 text-neutral-800 rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Bank Transfer Instructions If Bank Method Selected */}
      {order.paymentMethod === 'bank_transfer' && paymentSettings?.bankDetails && (
        <div className="bg-amber-50/80 border border-amber-300 p-6 rounded space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
            <Building className="w-4 h-4 text-amber-800" />
            <span>Bank Transfer / Meezan Raast Payment Instructions</span>
          </div>
          <p className="text-amber-900">
            Please transfer the grand total of <strong className="font-mono text-neutral-950">{formatPKR(order.grandTotal)}</strong> to our official bank account:
          </p>
          <div className="p-3 bg-white rounded border border-amber-200 font-mono text-neutral-900 space-y-1">
            <p><strong>Bank:</strong> {paymentSettings.bankDetails.bankName}</p>
            <p><strong>Account Title:</strong> {paymentSettings.bankDetails.accountTitle}</p>
            <p><strong>Account Number:</strong> {paymentSettings.bankDetails.accountNumber}</p>
            <p><strong>IBAN:</strong> {paymentSettings.bankDetails.iban}</p>
            <p><strong>Branch:</strong> {paymentSettings.bankDetails.branch}</p>
          </div>
          <p className="text-amber-900">
            Once sent, WhatsApp your payment receipt screenshot along with Order ID <strong>#{order.id}</strong> to <strong>+92 314 0855 651</strong>.
          </p>
        </div>
      )}

      {/* Order Details & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        
        {/* Customer & Shipping Info */}
        <div className="bg-white p-6 rounded border border-neutral-200 space-y-4">
          <h3 className="font-display font-bold uppercase tracking-wider text-neutral-900 text-sm pb-2 border-b border-neutral-100">
            Delivery & Customer Details
          </h3>
          <div className="space-y-2 text-neutral-700">
            <p><strong className="text-neutral-900">Name:</strong> {order.customerName}</p>
            <p><strong className="text-neutral-900">Phone:</strong> {order.customerPhone}</p>
            <p><strong className="text-neutral-900">Email:</strong> {order.customerEmail}</p>
            <p>
              <strong className="text-neutral-900">Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
            </p>
            {order.customerNotes && (
              <p><strong className="text-neutral-900">Delivery Notes:</strong> {order.customerNotes}</p>
            )}
            <p>
              <strong className="text-neutral-900">Payment:</strong>{' '}
              {order.paymentMethod === 'cod'
                ? 'Cash on Delivery (COD)'
                : order.paymentMethod === 'bank_transfer'
                ? 'Bank Transfer / Raast'
                : 'In-Store / Manual'}
            </p>
            <p>
              <strong className="text-neutral-900">Order Status:</strong>{' '}
              <span className="font-semibold text-amber-800">{order.orderStatus}</span>
            </p>
          </div>
        </div>

        {/* Fulfillment Outlet Info */}
        <div className="bg-white p-6 rounded border border-neutral-200 space-y-4">
          <h3 className="font-display font-bold uppercase tracking-wider text-neutral-900 text-sm pb-2 border-b border-neutral-100">
            Dispatched From Our Store
          </h3>
          <div className="space-y-2 text-neutral-700">
            <p className="font-semibold text-neutral-900">Aura Apparel Retail Outlet</p>
            <p>Shop 14/15, Zakki Plaza & Shop 20 Plaza 2000, I-8 Markaz, Islamabad</p>
            <p><strong>Support WhatsApp:</strong> +92 314 0855 651</p>
            <p><strong>Estimated Arrival:</strong> 1-2 Days (Islamabad/Rwp) · 3-5 Days (Nationwide)</p>
            <div className="pt-2">
              <a
                href={storeSettings?.mapsUrl || 'https://maps.app.goo.gl/6SozQkfxZtNGyNcr5'}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-900 underline font-semibold flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View Store on Google Maps</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Purchased Items Table */}
      <div className="bg-white p-6 rounded border border-neutral-200 space-y-4">
        <h3 className="font-display font-bold uppercase tracking-wider text-neutral-900 text-sm pb-2 border-b border-neutral-100">
          Purchased Articles
        </h3>

        <div className="divide-y divide-neutral-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-14 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">{item.productName}</h4>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    SKU: {item.sku} · Size: {item.size} · Color: {item.colorName} × {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-bold text-neutral-950 tabular-nums">
                {formatPKR(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Calculation Summary */}
        <div className="pt-4 border-t border-neutral-200 space-y-1.5 text-xs text-neutral-600 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-neutral-900 font-semibold tabular-nums">{formatPKR(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount ({order.couponCode})</span>
              <span className="tabular-nums">-{formatPKR(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span className="text-neutral-900 font-semibold tabular-nums">
              {order.deliveryFee === 0 ? 'FREE' : formatPKR(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-neutral-950 pt-2 border-t border-neutral-200">
            <span>Grand Total</span>
            <span className="tabular-nums">{formatPKR(order.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Nav Action */}
      <div className="text-center pt-4">
        <button
          onClick={onNavigateToShop}
          className="px-8 py-3 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
