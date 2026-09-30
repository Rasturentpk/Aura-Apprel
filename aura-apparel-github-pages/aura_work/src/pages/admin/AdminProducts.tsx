import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';
import { Product, Gender } from '../../types/index.ts';
import {
  Plus,
  Search,
  Edit,
  Copy,
  Trash2,
  X,
  Save,
  Check,
  Package,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    createProduct,
    updateProduct,
    duplicateProduct,
    deleteProduct,
  } = useAdmin();
  const { formatPKR } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [gender, setGender] = useState<Gender>('Men');
  const [price, setPrice] = useState(3500);
  const [salePrice, setSalePrice] = useState<string>('');
  const [costPrice, setCostPrice] = useState<string>('');
  const [stock, setStock] = useState(10);
  const [lowStockThreshold, setLowStockThreshold] = useState(3);
  const [sizesInput, setSizesInput] = useState('S, M, L, XL');
  const [colorName, setColorName] = useState('Default');
  const [colorHex, setColorHex] = useState('#111111');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/export_overstock_flatlay_1790699838766.jpg');
  const [tagsInput, setTagsInput] = useState('Export Overstock, Heavyweight');
  const [fabric, setFabric] = useState('100% Combed Cotton');
  const [fit, setFit] = useState('Relaxed Fit');
  const [care, setCare] = useState('Machine wash cold');
  const [origin, setOrigin] = useState('European Export Surplus');
  const [exportBatchInfo, setExportBatchInfo] = useState('I-8 Markaz Retail Lot');

  // Badges
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isLimitedStock, setIsLimitedStock] = useState(true);
  const [isSale, setIsSale] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setSku(`AUR-${Math.floor(1000 + Math.random() * 9000)}`);
    setDescription('');
    setCategoryId(categories[0]?.id || '');
    setGender('Men');
    setPrice(3500);
    setSalePrice('');
    setCostPrice('');
    setStock(10);
    setLowStockThreshold(3);
    setSizesInput('S, M, L, XL');
    setColorName('Charcoal');
    setColorHex('#222222');
    setImageUrl('/src/assets/images/export_overstock_flatlay_1790699838766.jpg');
    setTagsInput('Export Overstock, Heavyweight');
    setFabric('100% Combed Cotton');
    setFit('Relaxed Fit');
    setCare('Machine wash cold');
    setOrigin('European Brand Surplus');
    setExportBatchInfo('Imported batch for I-8 Markaz');
    setIsFeatured(false);
    setIsNewArrival(true);
    setIsBestSeller(false);
    setIsLimitedStock(true);
    setIsSale(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSku(product.sku);
    setDescription(product.description);
    setCategoryId(product.categoryId);
    setGender(product.gender);
    setPrice(product.price);
    setSalePrice(product.salePrice ? String(product.salePrice) : '');
    setCostPrice(product.costPrice ? String(product.costPrice) : '');
    setStock(product.stock);
    setLowStockThreshold(product.lowStockThreshold);
    setSizesInput(product.sizes.join(', '));
    setColorName(product.colors[0]?.name || 'Standard');
    setColorHex(product.colors[0]?.hex || '#111111');
    setImageUrl(product.images[0] || '/src/assets/images/export_overstock_flatlay_1790699838766.jpg');
    setTagsInput(product.tags.join(', '));
    setFabric(product.details?.fabric || '');
    setFit(product.details?.fit || '');
    setCare(product.details?.care || '');
    setOrigin(product.details?.origin || '');
    setExportBatchInfo(product.details?.exportBatchInfo || '');
    setIsFeatured(product.isFeatured);
    setIsNewArrival(product.isNewArrival);
    setIsBestSeller(product.isBestSeller);
    setIsLimitedStock(product.isLimitedStock);
    setIsSale(product.isSale);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const productPayload = {
      name,
      sku,
      description,
      categoryId,
      gender,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      costPrice: costPrice ? Number(costPrice) : undefined,
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      sizes,
      colors: [{ name: colorName, hex: colorHex }],
      images: [imageUrl],
      tags,
      isFeatured,
      isNewArrival,
      isBestSeller,
      isLimitedStock: isLimitedStock || Number(stock) <= Number(lowStockThreshold),
      isSale,
      details: {
        fabric,
        fit,
        care,
        origin,
        exportBatchInfo,
      },
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productPayload);
      } else {
        await createProduct(productPayload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  const handleDuplicate = async (id: string) => {
    await duplicateProduct(id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 uppercase">
            Product Catalog Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage styles, export lots, pricing, SKU codes, and inventory levels.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded border border-neutral-200 flex flex-wrap items-center gap-3 shadow-2xs text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, SKU, or tags..."
            className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-semibold uppercase text-[10px]">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded text-neutral-800 bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Sale Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {filteredProducts.map((p) => {
                const isLow = p.stock <= p.lowStockThreshold;
                const isOut = p.stock === 0;
                return (
                  <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-13 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{p.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">
                            Sizes: {p.sizes.join(', ')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">{p.sku}</td>
                    <td className="py-3 px-4">{p.categoryName || 'General'}</td>
                    <td className="py-3 px-4">{p.gender}</td>
                    <td className="py-3 px-4 font-mono font-bold">{formatPKR(p.price)}</td>
                    <td className="py-3 px-4 font-mono text-neutral-600">
                      {p.salePrice ? formatPKR(p.salePrice) : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          isOut
                            ? 'bg-red-100 text-red-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} pcs
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {p.isFeatured && <span className="bg-neutral-200 px-1.5 py-0.5 rounded">Featured</span>}
                        {p.isLimitedStock && <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">Limited</span>}
                        {p.isNewArrival && <span className="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded">New</span>}
                        {p.isSale && <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">Sale</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p.id)}
                          className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                          title="Duplicate Product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded border border-neutral-300 w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-xs">
            
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <h2 className="font-display text-base font-bold text-neutral-900 uppercase">
                {editingProduct ? `Edit Garment: ${editingProduct.sku}` : 'Add New Export Garment'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-neutral-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Heavyweight Boxy Crewneck Tee"
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. AUR-TEE-04"
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded bg-white text-neutral-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded bg-white text-neutral-900"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Sale / Discounted Price (Optional)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="e.g. 2950"
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Cost Price (Internal Margin Tracking)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Stock Quantity (Units) *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Low Stock Warning Threshold *</label>
                  <input
                    type="number"
                    required
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Available Sizes (Comma Separated)</label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="S, M, L, XL"
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fabric density, origin, Scandi surplus order details..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
                />
              </div>

              {/* Color & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-50 p-3 rounded border border-neutral-200">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Color Name</label>
                  <input
                    type="text"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    placeholder="e.g. Washed Olive"
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Color Hex</label>
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-full h-9 border border-neutral-300 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Image URL / Path</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/src/assets/images/..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-[11px] text-neutral-900"
                  />
                </div>
              </div>

              {/* Technical Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Fabric Spec</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. 100% Combed Cotton (260 GSM)"
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Origin / Export Lot Info</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Scandinavian Workwear Export Overrun"
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
                  />
                </div>
              </div>

              {/* Badges / Flags */}
              <div className="pt-2 border-t border-neutral-200">
                <span className="block font-bold text-neutral-800 uppercase tracking-wider text-[11px] mb-2">
                  Display Tags & Highlights
                </span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-neutral-900"
                    />
                    <span>Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="accent-neutral-900"
                    />
                    <span>New Arrival Drop</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="accent-neutral-900"
                    />
                    <span>Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLimitedStock}
                      onChange={(e) => setIsLimitedStock(e.target.checked)}
                      className="accent-neutral-900"
                    />
                    <span>Limited Stock / No-Restock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSale}
                      onChange={(e) => setIsSale(e.target.checked)}
                      className="accent-neutral-900"
                    />
                    <span>Mark as On Sale</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-neutral-900 text-white rounded font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
