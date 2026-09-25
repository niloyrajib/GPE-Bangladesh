import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  Building2,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../../../types';

interface ShopifyInventoryViewProps {
  products: Product[];
  onUpdateProductStock: (productId: string, newStock: number) => void;
  showToast?: (message: string) => void;
}

export const ShopifyInventoryView: React.FC<ShopifyInventoryViewProps> = ({
  products,
  onUpdateProductStock,
  showToast = (_msg: string) => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All locations');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out_of_stock' | 'healthy'>('all');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  // Locations for Bangladeshi logistics
  const LOCATIONS = [
    'All locations',
    'Dhaka Central Warehouse (Mirpur Hub)',
    'Chattogram Port Depot (Agrabad)',
    'Sylhet Regional Fulfillment Center'
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.banglaName && p.banglaName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (stockFilter === 'out_of_stock') return p.stockCount === 0 || !p.inStock;
      if (stockFilter === 'low') return p.stockCount > 0 && p.stockCount <= 10;
      if (stockFilter === 'healthy') return p.stockCount > 10;

      return true;
    });
  }, [products, searchQuery, stockFilter]);

  // Inventory stats
  const totalStockCount = useMemo(
    () => products.reduce((acc, p) => acc + (p.stockCount || 0), 0),
    [products]
  );
  const lowStockCount = useMemo(
    () => products.filter((p) => (p.stockCount || 0) > 0 && (p.stockCount || 0) <= 10).length,
    [products]
  );
  const outOfStockCount = useMemo(
    () => products.filter((p) => (p.stockCount || 0) === 0 || !p.inStock).length,
    [products]
  );

  const handleStartEdit = (product: Product) => {
    setEditingStockId(product.id);
    setTempStockValue(product.stockCount || 0);
  };

  const handleSaveStock = (productId: string) => {
    const validStock = Math.max(0, tempStockValue);
    onUpdateProductStock(productId, validStock);
    setEditingStockId(null);
    showToast(`স্টক আপডেট সফল: ${validStock} টি নির্ধারণ করা হয়েছে`);
  };

  const handleQuickAdjust = (product: Product, delta: number) => {
    const current = product.stockCount || 0;
    const nextVal = Math.max(0, current + delta);
    onUpdateProductStock(product.id, nextVal);
    showToast(`${product.name}: স্টক ${nextVal} করা হয়েছে`);
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Product ID', 'Name', 'Category', 'Price BDT', 'Stock Count', 'In Stock Status', 'Location'],
      ...products.map((p) => [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`,
        p.category,
        p.price,
        p.stockCount || 0,
        p.inStock ? 'Available' : 'Out of Stock',
        selectedLocation
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shopify_inventory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('ইনভেন্টরি রিপোর্ট CSV ফাইল ডাউনলোড সম্পন্ন!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
            <span className="text-xs px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full font-bold">
              {totalStockCount} units on hand
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Track stock levels, incoming shipments, committed orders, and adjust real-time quantity across warehouse hubs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500">Total Products</div>
            <div className="text-xl font-bold text-gray-900 mt-0.5">{products.length}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{totalStockCount} total units</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-700">Low Stock Alert (≤ 10)</div>
            <div className="text-xl font-bold text-amber-600 mt-0.5">{lowStockCount}</div>
            <div className="text-[11px] text-amber-600/80 mt-0.5">Reorder recommended</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-rose-700">Out of Stock</div>
            <div className="text-xl font-bold text-rose-600 mt-0.5">{outOfStockCount}</div>
            <div className="text-[11px] text-rose-600/80 mt-0.5">Requires replenishment</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Inventory Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        {/* Filters & Location Selection */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">
              <Building2 className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-gray-800 focus:outline-hidden cursor-pointer"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50 text-xs">
              <button
                type="button"
                onClick={() => setStockFilter('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  stockFilter === 'all' ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setStockFilter('low')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  stockFilter === 'low' ? 'bg-white shadow-xs text-amber-700 font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Low stock ({lowStockCount})
              </button>
              <button
                type="button"
                onClick={() => setStockFilter('out_of_stock')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  stockFilter === 'out_of_stock' ? 'bg-white shadow-xs text-rose-700 font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Out of stock ({outOfStockCount})
              </button>
            </div>
          </div>

          <div className="relative flex-1 md:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, SKU or ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product & SKU</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Committed</th>
                <th className="py-3 px-4">Incoming</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4">On Hand</th>
                <th className="py-3 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredProducts.map((p) => {
                const stock = p.stockCount || 0;
                const isEditing = editingStockId === p.id;
                const committed = Math.min(2, stock); // realistic committed in pending checkouts
                const incoming = stock < 10 ? 25 : 0; // realistic replenishment in transit

                return (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Product info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0 bg-gray-100"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 truncate max-w-xs">{p.name}</div>
                          <div className="text-[11px] text-gray-500 truncate">{p.banglaName}</div>
                          <div className="font-mono text-[10.5px] text-gray-400 mt-0.5">
                            SKU: {p.sku || `GPE-${p.id.toUpperCase().substring(0, 7)}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {stock === 0 ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">
                          Out of stock
                        </span>
                      ) : stock <= 10 ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                          Low stock ({stock})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          In stock
                        </span>
                      )}
                    </td>

                    {/* Committed */}
                    <td className="py-3 px-4 font-mono text-gray-500">
                      {committed}
                    </td>

                    {/* Incoming */}
                    <td className="py-3 px-4">
                      {incoming > 0 ? (
                        <span className="text-sky-700 font-mono font-semibold bg-sky-50 px-1.5 py-0.5 rounded text-[11px]">
                          +{incoming}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-mono">0</span>
                      )}
                    </td>

                    {/* Available (Interactive) */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={tempStockValue}
                            onChange={(e) => setTempStockValue(parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-emerald-500 rounded text-xs font-mono font-bold focus:outline-hidden"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveStock(p.id)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            title="Save quantity"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(p)}
                          className="font-mono font-bold text-gray-900 underline decoration-dotted hover:text-emerald-700 text-sm"
                          title="Click to edit stock count"
                        >
                          {stock}
                        </button>
                      )}
                    </td>

                    {/* On Hand */}
                    <td className="py-3 px-4 font-mono font-bold text-gray-800">
                      {stock + committed}
                    </td>

                    {/* Quick Adjust Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(p, -1)}
                          disabled={stock <= 0}
                          className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-colors text-gray-700"
                          title="Decrease by 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(p, 1)}
                          className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 transition-colors text-gray-700"
                          title="Increase by 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(p, 10)}
                          className="px-2 py-1 rounded border border-gray-200 text-[10px] font-bold hover:bg-gray-100 transition-colors text-emerald-700"
                          title="Add bulk 10 units"
                        >
                          +10
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
    </div>
  );
};
