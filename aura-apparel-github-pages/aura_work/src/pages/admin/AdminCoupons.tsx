import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';
import { Coupon } from '../../types/index.ts';
import { Plus, Ticket, Edit, Trash2, X, Check, Save } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const { coupons, createCoupon, updateCoupon, deleteCoupon } = useAdmin();
  const { formatPKR } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [discountValue, setDiscountValue] = useState(500);
  const [minOrderAmount, setMinOrderAmount] = useState(3000);
  const [maxDiscount, setMaxDiscount] = useState<string>('500');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState<string>('200');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('fixed');
    setDiscountValue(500);
    setMinOrderAmount(3000);
    setMaxDiscount('500');
    setExpiryDate('2026-12-31');
    setUsageLimit('100');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coup: Coupon) => {
    setEditingCoupon(coup);
    setCode(coup.code);
    setDiscountType(coup.discountType);
    setDiscountValue(coup.discountValue);
    setMinOrderAmount(coup.minOrderAmount);
    setMaxDiscount(coup.maxDiscount ? String(coup.maxDiscount) : '');
    setExpiryDate(coup.expiryDate || '');
    setUsageLimit(coup.usageLimit ? String(coup.usageLimit) : '');
    setIsActive(coup.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      expiryDate: expiryDate || undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      isActive,
    };

    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, payload);
      } else {
        await createCoupon(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Delete coupon "${code}"?`)) {
      await deleteCoupon(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 uppercase">
            Coupon & Discount Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create promotional coupon codes with minimum order criteria and usage limits.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Discount Value</th>
                <th className="py-3 px-4">Min Order Amount</th>
                <th className="py-3 px-4">Usage Count</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800 font-mono">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-neutral-900 text-sm">{c.code}</td>
                  <td className="py-3 px-4 font-sans uppercase text-[10px] text-neutral-500">
                    {c.discountType}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-800">
                    {c.discountType === 'percentage' ? `${c.discountValue}% Off` : formatPKR(c.discountValue)}
                  </td>
                  <td className="py-3 px-4 tabular-nums">{formatPKR(c.minOrderAmount)}</td>
                  <td className="py-3 px-4">
                    {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : 'uses'}
                  </td>
                  <td className="py-3 px-4 text-neutral-500">{c.expiryDate || 'No expiry'}</td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1 text-neutral-600 hover:text-black"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="p-1 text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded border border-neutral-300 w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h2 className="font-display text-base font-bold text-neutral-900 uppercase">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. AURA500"
                  className="w-full px-3 py-2 border border-neutral-300 rounded uppercase font-mono font-bold text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded bg-white text-neutral-900"
                  >
                    <option value="fixed">Fixed PKR Amount</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Min Order Amount (PKR)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Max Cap (For %)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-neutral-900"
                  />
                  <span>Active & Redeemable at Checkout</span>
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded font-semibold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-neutral-900 text-white rounded font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
