import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';
import { Order, OrderStatus, PaymentStatus } from '../../types/index.ts';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  X,
  AlertCircle,
  FileText,
  User,
  MapPin,
  Calendar,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const {
    orders,
    ordersLoading,
    updateOrderStatus,
    updateOrderPayment,
    updateOrderNotes,
    loadOrders,
  } = useAdmin();
  const { formatPKR } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Modal editing state
  const [editStatus, setEditStatus] = useState<OrderStatus>('Pending');
  const [editPayment, setEditPayment] = useState<PaymentStatus>('Pending');
  const [editTracking, setEditTracking] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (paymentFilter !== 'all' && o.paymentStatus !== paymentFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      const matchEmail = o.customerEmail.toLowerCase().includes(q);
      const matchCity = o.shippingAddress.city.toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchEmail || matchCity;
    }
    return true;
  });

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.orderStatus);
    setEditPayment(order.paymentStatus);
    setEditTracking(order.trackingNumber || '');
    setEditNotes(order.adminNotes || '');
    setStatusNote('');
  };

  const handleSaveChanges = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      if (editStatus !== selectedOrder.orderStatus) {
        await updateOrderStatus(selectedOrder.id, editStatus, statusNote);
      }
      if (editPayment !== selectedOrder.paymentStatus) {
        await updateOrderPayment(selectedOrder.id, editPayment);
      }
      if (editNotes !== (selectedOrder.adminNotes || '') || editTracking !== (selectedOrder.trackingNumber || '')) {
        await updateOrderNotes(selectedOrder.id, editNotes, editTracking);
      }

      // Refresh order view
      const refreshed = orders.find((o) => o.id === selectedOrder.id);
      if (refreshed) setSelectedOrder(refreshed);
    } catch (err) {
      console.error('Failed to update order:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 uppercase">
            Order Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Total {orders.length} orders recorded in persistent database.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded border border-neutral-200 flex flex-wrap items-center gap-3 shadow-2xs text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, customer, phone, or city..."
            className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-semibold uppercase text-[10px]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 border border-neutral-300 rounded text-neutral-800 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-semibold uppercase text-[10px]">Payment:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-2.5 py-2 border border-neutral-300 rounded text-neutral-800 bg-white"
          >
            <option value="all">All Payments</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Articles</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800 font-mono">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-neutral-500 font-sans">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-950">#{ord.id}</td>
                    <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium">{ord.customerName}</td>
                    <td className="py-3.5 px-4">{ord.customerPhone}</td>
                    <td className="py-3.5 px-4 font-sans text-neutral-600">{ord.shippingAddress.city}</td>
                    <td className="py-3.5 px-4">{ord.items.length} items</td>
                    <td className="py-3.5 px-4 font-bold text-neutral-950 tabular-nums">
                      {formatPKR(ord.grandTotal)}
                    </td>
                    <td className="py-3.5 px-4 font-sans uppercase text-[10px] text-neutral-600">
                      {ord.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.orderStatus === 'Processing'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <button
                        onClick={() => handleOpenOrder(ord)}
                        className="px-2.5 py-1 bg-neutral-900 text-white rounded text-[11px] font-semibold hover:bg-neutral-800"
                      >
                        Open Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded border border-neutral-300 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-bold text-neutral-900">
                  Order Details: #{selectedOrder.id}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-neutral-900 text-white">
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 border border-neutral-300 rounded text-xs font-semibold hover:bg-white flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-neutral-500 hover:text-black rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Customer & Delivery Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 p-5 rounded border border-neutral-200">
                <div className="space-y-2">
                  <h3 className="font-display font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Customer Details
                  </h3>
                  <p><strong className="text-neutral-800">Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong className="text-neutral-800">Phone:</strong> {selectedOrder.customerPhone}</p>
                  <p><strong className="text-neutral-800">Email:</strong> {selectedOrder.customerEmail}</p>
                  {selectedOrder.customerNotes && (
                    <p className="pt-1 text-amber-900">
                      <strong>Customer Notes:</strong> "{selectedOrder.customerNotes}"
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Delivery Address
                  </h3>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}</p>
                  <p>Postal Code: {selectedOrder.shippingAddress.postalCode || 'N/A'}</p>
                  <p className="pt-1 font-mono text-[11px] text-neutral-500">
                    Order Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Status & Payment Status Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded border border-neutral-200">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Update Order Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-semibold text-neutral-900"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Update Payment Status
                  </label>
                  <select
                    value={editPayment}
                    onChange={(e) => setEditPayment(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-semibold text-neutral-900"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Tracking Number (TCS / Leopards)
                  </label>
                  <input
                    type="text"
                    value={editTracking}
                    onChange={(e) => setEditTracking(e.target.value)}
                    placeholder="e.g. TCS-902192"
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-neutral-700 font-bold mb-1">
                    Status Update Note / Timeline Entry
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Customer verified via phone call, parcel packed at Zakki Plaza branch"
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
                  />
                </div>
              </div>

              {/* Items List Table */}
              <div className="space-y-3">
                <h3 className="font-display font-bold uppercase tracking-wider text-neutral-900 text-xs">
                  Purchased Items ({selectedOrder.items.length})
                </h3>

                <div className="border border-neutral-200 rounded divide-y divide-neutral-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{item.productName}</p>
                          <p className="text-[11px] text-neutral-500 font-mono">
                            SKU: {item.sku} · Size: {item.size} · Color: {item.colorName} × {item.quantity} pcs
                          </p>
                        </div>
                      </div>
                      <span className="font-bold font-mono text-neutral-950 tabular-nums">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation */}
                <div className="p-4 bg-neutral-50 rounded border border-neutral-200 space-y-1.5 max-w-xs ml-auto font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPKR(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span>-{formatPKR(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : formatPKR(selectedOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-950 pt-2 border-t border-neutral-200 text-sm">
                    <span>Grand Total:</span>
                    <span>{formatPKR(selectedOrder.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Status History Timeline */}
              <div className="space-y-3 pt-3 border-t border-neutral-200">
                <h3 className="font-display font-bold uppercase tracking-wider text-neutral-900 text-xs">
                  Recorded Order Status History
                </h3>
                <div className="space-y-2 pl-3 border-l-2 border-neutral-300">
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="text-[11px]">
                      <span className="font-bold text-neutral-900 uppercase">{h.status}:</span>{' '}
                      <span className="text-neutral-700">{h.note}</span>{' '}
                      <span className="text-neutral-400 font-mono">({new Date(h.timestamp).toLocaleString()})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div className="space-y-2 pt-3 border-t border-neutral-200">
                <label className="block text-neutral-700 font-bold uppercase tracking-wider text-xs">
                  Internal Staff Notes (Not visible to customer)
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Customer requested urgent Friday delivery, call dispatch manager"
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-neutral-300 rounded font-semibold text-neutral-700 hover:bg-white"
              >
                Close
              </button>

              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-6 py-2 bg-neutral-900 text-white rounded font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
              >
                {isSaving ? 'Saving Changes...' : 'Save Order Changes'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
