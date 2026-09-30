import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';
import { Boxes, Search, Check, AlertTriangle, AlertCircle, Save } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { inventory, updateStock } = useAdmin();
  const { formatPKR } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Quick edits map
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});

  const filteredInventory = inventory.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStockChange = (id: string, val: number) => {
    setStockEdits((prev) => ({ ...prev, [id]: Math.max(0, val) }));
  };

  const handleSaveStock = async (id: string) => {
    const newStock = stockEdits[id];
    if (newStock === undefined) return;
    setUpdatingId(id);
    try {
      await updateStock(id, newStock);
      setStockEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900 uppercase">
          Inventory Control
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Real-time physical stock counts at Shop 14/15 Zakki Plaza and Plaza 2000, I-8 Markaz.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded border border-neutral-200 flex flex-wrap items-center gap-3 shadow-2xs text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inventory by garment name, SKU code..."
            className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-semibold uppercase text-[10px]">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded text-neutral-800 bg-white"
          >
            <option value="all">All Inventory</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Inline Stock Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800 font-mono">
              {filteredInventory.map((item) => {
                const currentVal = stockEdits[item.id] !== undefined ? stockEdits[item.id] : item.stock;
                const hasPendingSave = stockEdits[item.id] !== undefined && stockEdits[item.id] !== item.stock;
                return (
                  <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4 font-sans font-bold">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-11 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="truncate max-w-[200px]">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-500">{item.sku}</td>
                    <td className="py-3 px-4 font-sans">{item.categoryName}</td>
                    <td className="py-3 px-4 font-bold text-neutral-900 tabular-nums">
                      {formatPKR(item.salePrice || item.price)}
                    </td>
                    <td className="py-3 px-4 text-neutral-500">
                      {item.lowStockThreshold} pcs
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-950 text-sm tabular-nums">
                      {item.stock} pcs
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'Out of Stock'
                            ? 'bg-red-100 text-red-800'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-sans">
                        <input
                          type="number"
                          min="0"
                          value={currentVal}
                          onChange={(e) => handleStockChange(item.id, Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-neutral-300 rounded font-mono text-center font-bold text-xs"
                        />
                        {hasPendingSave && (
                          <button
                            onClick={() => handleSaveStock(item.id)}
                            disabled={updatingId === item.id}
                            className="px-2.5 py-1 bg-neutral-900 text-white rounded text-[11px] font-semibold hover:bg-neutral-800"
                          >
                            {updatingId === item.id ? '...' : 'Save'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
