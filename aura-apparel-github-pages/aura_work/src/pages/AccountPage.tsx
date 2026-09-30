import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { api } from '../services/api.ts';
import { Order } from '../types/index.ts';
import {
  Package,
  Search,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface AccountPageProps {
  onNavigateToShop: () => void;
  onSelectOrder?: (order: Order) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigateToShop }) => {
  const { formatPKR } = useStore();

  const [lookupInput, setLookupInput] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupInput.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.lookupCustomerOrders(lookupInput.trim());
      setOrders(res.orders);
      if (res.orders.length > 0) {
        setSelectedOrder(res.orders[0]);
      } else {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
      setSelectedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-neutral-200 pb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Customer Portal
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
          My Account & Order Tracking
        </h1>
        <p className="text-xs text-neutral-600 mt-1">
          Check live dispatch status, delivery updates, and past purchase receipts.
        </p>
      </div>

      {/* Order Lookup Form */}
      <div className="bg-white p-6 sm:p-8 rounded border border-neutral-200 shadow-2xs max-w-2xl">
        <h2 className="font-display text-base font-bold text-neutral-900 uppercase tracking-tight mb-2">
          Track Your Orders
        </h2>
        <p className="text-xs text-neutral-600 mb-4">
          Enter the phone number (e.g. 0300 5544123) or email address used when placing your order.
        </p>

        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            required
            value={lookupInput}
            onChange={(e) => setLookupInput(e.target.value)}
            placeholder="e.g. 0300 5544123 or zaryab.khan@gmail.com"
            className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Lookup</span>
          </button>
        </form>

        {/* Demo shortcut helper */}
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-2 text-[11px] text-neutral-500">
          <span>Quick test:</span>
          <button
            type="button"
            onClick={() => {
              setLookupInput('zaryab.khan@gmail.com');
            }}
            className="text-neutral-800 underline font-medium hover:text-black"
          >
            zaryab.khan@gmail.com
          </button>
          <span>or</span>
          <button
            type="button"
            onClick={() => {
              setLookupInput('+92 333 8765432');
            }}
            className="text-neutral-800 underline font-medium hover:text-black"
          >
            0333 8765432
          </button>
        </div>
      </div>

      {/* Orders List & Selected Order Timeline */}
      {hasSearched && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded border border-neutral-200 text-center space-y-3">
              <Package className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="font-semibold text-sm text-neutral-800">No Orders Found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No orders match "{lookupInput}". Please check the phone number or email entered.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left: Orders list (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded border border-neutral-200 divide-y divide-neutral-100">
                <div className="p-4 bg-neutral-50 border-b border-neutral-200">
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-800">
                    Your Orders ({orders.length})
                  </h3>
                </div>

                {orders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-neutral-100/80 font-medium' : 'hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-neutral-900">#{ord.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-neutral-200 text-neutral-800">
                          {ord.orderStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                        <span className="font-bold text-neutral-900 tabular-nums">
                          {formatPKR(ord.grandTotal)}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1 truncate">
                        {ord.items.map((i) => i.productName).join(', ')}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Right: Selected Order Detail with Live Timeline (7 Cols) */}
              {selectedOrder && (
                <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded border border-neutral-200 space-y-6">
                  
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-lg font-bold text-neutral-900">
                          Order #{selectedOrder.id}
                        </h2>
                        <span className="px-2.5 py-0.5 bg-neutral-900 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                          {selectedOrder.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()} at{' '}
                        {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {selectedOrder.trackingNumber && (
                      <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs">
                        <span className="text-neutral-500 block text-[10px] uppercase font-mono">Courier Tracking</span>
                        <span className="font-mono font-bold text-neutral-900">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-3">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Tracking Timeline
                    </h3>
                    <div className="space-y-3 pl-2 border-l-2 border-neutral-200">
                      {selectedOrder.statusHistory.map((step, idx) => (
                        <div key={idx} className="relative pl-5 text-xs space-y-0.5">
                          <div className="absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-900 ring-2 ring-white" />
                          <p className="font-bold text-neutral-900">{step.status}</p>
                          <p className="text-neutral-600">{step.note}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            {new Date(step.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 pt-4 border-t border-neutral-200">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Items Ordered
                    </h3>
                    <div className="divide-y divide-neutral-100">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                              <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-semibold text-neutral-900">{item.productName}</p>
                              <p className="text-[11px] text-neutral-500 font-mono">
                                Size: {item.size} · Color: {item.colorName} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-neutral-950 tabular-nums">
                            {formatPKR(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address & Payment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-neutral-200 text-neutral-700">
                    <div>
                      <p className="font-bold text-neutral-900 uppercase text-[11px] mb-1">Delivery Address</p>
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}</p>
                      <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 uppercase text-[11px] mb-1">Payment Method</p>
                      <p>
                        {selectedOrder.paymentMethod === 'cod'
                          ? 'Cash on Delivery'
                          : selectedOrder.paymentMethod === 'bank_transfer'
                          ? 'Bank Transfer / Raast'
                          : 'In-Store / Manual'}
                      </p>
                      <p>Payment Status: <strong className="text-neutral-900">{selectedOrder.paymentStatus}</strong></p>
                      <p className="font-bold text-neutral-900 text-sm mt-2 tabular-nums">
                        Total: {formatPKR(selectedOrder.grandTotal)}
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}
        </div>
      )}

    </div>
  );
};
