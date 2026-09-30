import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';
import { Customer, Order } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  Users,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  DollarSign,
  Calendar,
  X,
  FileText,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { customers, customersLoading, loadCustomers, updateCustomerNotes } = useAdmin();
  const { formatPKR } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  const handleOpenCustomer = async (cust: Customer) => {
    setSelectedCustomer(cust);
    setInternalNotes(cust.notes || '');
    setLoadingDetails(true);
    try {
      const data = await api.getCustomer(cust.id);
      setCustomerOrders(data.orders);
    } catch (err) {
      console.error('Failed to load customer orders:', err);
      setCustomerOrders([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedCustomer) return;
    setSavingNotes(true);
    try {
      await updateCustomerNotes(selectedCustomer.id, internalNotes);
      selectedCustomer.notes = internalNotes;
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 uppercase">
            Customer Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Dedicated Customer records with lifetime value and linked historical order trees.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded border border-neutral-200 flex items-center gap-3 shadow-2xs text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone (+92...), email, or city..."
            className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Primary City</th>
                <th className="py-3 px-4">Lifetime Orders</th>
                <th className="py-3 px-4">Total Spending</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No customers match your search query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-900">{cust.name}</td>
                    <td className="py-3.5 px-4 font-mono">{cust.phone}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{cust.email}</td>
                    <td className="py-3.5 px-4">{cust.city || 'Islamabad'}</td>
                    <td className="py-3.5 px-4 font-mono font-bold">{cust.totalOrders} orders</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-950 tabular-nums">
                      {formatPKR(cust.totalSpent)}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 text-[11px] font-mono">
                      {cust.lastOrderDate ? new Date(cust.lastOrderDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenCustomer(cust)}
                        className="px-3 py-1 bg-neutral-900 text-white rounded text-[11px] font-semibold hover:bg-neutral-800"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded border border-neutral-300 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs">
            
            {/* Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-neutral-900">
                    {selectedCustomer.name}
                  </h2>
                  <p className="text-[11px] text-neutral-500">
                    Customer ID: {selectedCustomer.id} · Profile created {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-neutral-500 hover:text-black rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Metrics Box */}
              <div className="grid grid-cols-3 gap-4 bg-neutral-100 p-4 rounded text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Lifetime Orders</span>
                  <span className="font-mono text-lg font-bold text-neutral-900">{selectedCustomer.totalOrders}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Lifetime Spending</span>
                  <span className="font-mono text-lg font-bold text-neutral-950 tabular-nums">
                    {formatPKR(selectedCustomer.totalSpent)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Last Active</span>
                  <span className="font-mono text-xs font-semibold text-neutral-700 block mt-1">
                    {selectedCustomer.lastOrderDate ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Contact & Shipping Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded border border-neutral-200">
                <div className="space-y-1">
                  <h4 className="font-bold uppercase tracking-wider text-[11px] text-neutral-800">
                    Contact Information
                  </h4>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{selectedCustomer.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{selectedCustomer.email}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold uppercase tracking-wider text-[11px] text-neutral-800">
                    Saved Delivery Address
                  </h4>
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                    <span>{selectedCustomer.address || 'Address on file with orders'}, {selectedCustomer.city || 'Islamabad'}, {selectedCustomer.province || 'ICT'}</span>
                  </p>
                </div>
              </div>

              {/* Complete Linked Order History (Mandatory Requirement) */}
              <div className="space-y-3">
                <h3 className="font-display font-bold uppercase tracking-wider text-xs text-neutral-900">
                  Complete Order History ({customerOrders.length})
                </h3>

                {loadingDetails ? (
                  <p className="text-neutral-500 py-4">Loading historical orders...</p>
                ) : customerOrders.length === 0 ? (
                  <p className="text-neutral-500 py-2">No past orders found.</p>
                ) : (
                  <div className="border border-neutral-200 rounded divide-y divide-neutral-100">
                    {customerOrders.map((ord) => (
                      <div key={ord.id} className="p-3 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-neutral-900">#{ord.id}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">
                              {ord.orderStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            {new Date(ord.createdAt).toLocaleDateString()} · {ord.items.length} items ({ord.paymentMethod.toUpperCase()})
                          </p>
                          <p className="text-[10px] text-neutral-600 truncate max-w-md">
                            {ord.items.map((i) => `${i.productName} (${i.size})`).join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-neutral-950 tabular-nums">
                            {formatPKR(ord.grandTotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Internal Customer Notes (Mandatory Requirement) */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <label className="block text-neutral-800 font-bold uppercase tracking-wider text-[11px]">
                  Internal Staff Notes on Customer
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. VIP shopper, visits Zakki Plaza store regularly, prefers European size Large"
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-4 py-1.5 bg-neutral-900 text-white rounded text-[11px] font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingNotes ? 'Saving...' : 'Save Customer Notes'}</span>
                </button>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-neutral-900 text-white rounded font-semibold uppercase tracking-wider hover:bg-neutral-800"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
