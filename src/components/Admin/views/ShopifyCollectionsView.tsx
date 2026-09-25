import React, { useState, useMemo } from 'react';
import {
  Tag,
  Search,
  ArrowUpDown,
  Columns,
  Plus,
  Trash2,
  X,
  ExternalLink
} from 'lucide-react';
import { Product } from '../../../types';
import { ShopifyAddCollectionView } from './ShopifyAddCollectionView';

interface ShopifyCollectionsViewProps {
  products: Product[];
  onOpenStorefrontCategory?: (category: string) => void;
  showToast?: (message: string) => void;
}

export interface CollectionItem {
  id: string;
  title: string;
  productsCount: number;
  conditions: string;
  image: string;
  badgeLogoText?: string;
  categoryMatch?: string;
}

// Matches the exact list in the screenshot
const SCREENSHOT_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1',
    title: 'Gadgets & Electric Accessories',
    productsCount: 22,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'BANGLA XPRESS GADGETS'
  },
  {
    id: 'col-2',
    title: 'Computer & IT Accessories',
    productsCount: 2,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'BANGLA XPRESS COMPUTER'
  },
  {
    id: 'col-3',
    title: 'Electronics',
    productsCount: 4,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'BANGLA XPRESS ELECTRONICS'
  },
  {
    id: 'col-4',
    title: 'Best Sellers',
    productsCount: 3,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'BEST SELLER COLLECTION'
  },
  {
    id: 'col-5',
    title: 'Health & Fitness',
    productsCount: 3,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'HEALTH & FITNESS'
  },
  {
    id: 'col-6',
    title: 'Home Appliances',
    productsCount: 2,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'HOME APPLIANCES'
  },
  {
    id: 'col-7',
    title: 'Caps',
    productsCount: 4,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'CAPS & APPAREL'
  }
];

export const ShopifyCollectionsView: React.FC<ShopifyCollectionsViewProps> = ({
  products,
  onOpenStorefrontCategory,
  showToast = (_msg: string) => {}
}) => {
  const [collections, setCollections] = useState<CollectionItem[]>(SCREENSHOT_COLLECTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'add'>('list');

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCollections.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCollections.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredCollections = useMemo(() => {
    return collections.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [collections, searchQuery]);

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedIds.length} collection(s)?`)) {
      setCollections((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      showToast(`${selectedIds.length} টি কালেকশন মুছে ফেলা হয়েছে`);
    }
  };

  // If in 'add' mode, render the full Add Collection page matching the PDF screenshot
  if (currentView === 'add') {
    return (
      <ShopifyAddCollectionView
        products={products}
        onBack={() => setCurrentView('list')}
        onSave={(newCol) => {
          setCollections((prev) => [newCol, ...prev]);
          setCurrentView('list');
        }}
        showToast={showToast}
      />
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Header matching screenshot */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-gray-700 stroke-[2.2]" />
          <h1 className="text-xl font-bold text-[#202223] tracking-tight">Collections</h1>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('add')}
          className="px-3.5 py-1.5 bg-[#303030] hover:bg-[#202020] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          Add collection
        </button>
      </div>

      {/* Main Table Card matching screenshot */}
      <div className="bg-white border border-[#d2d5d8] rounded-xl shadow-2xs overflow-hidden">
        {/* Search and filter toolbar */}
        <div className="px-3 py-2 border-b border-[#e1e3e5] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1">
            {/* "All" dropdown filter button */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#202223] font-medium text-xs bg-white transition-colors"
            >
              <span>All</span>
              <div className="flex flex-col -space-y-1 text-gray-500">
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </button>

            {/* Search Input with magnifying glass */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search and filter"
                className="w-full bg-white text-xs text-[#202223] pl-8 pr-3 py-1.5 rounded-lg border border-[#c9cccf] focus:border-[#303030] focus:ring-1 focus:ring-[#303030] outline-hidden placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Right tool buttons */}
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete ({selectedIds.length})</span>
              </button>
            )}

            <button
              type="button"
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-[#f6f6f7] rounded-lg transition-colors"
              title="Columns"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table matching screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e1e3e5] bg-white text-[#5c5f62] font-medium select-none">
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredCollections.length > 0 &&
                      selectedIds.length === filteredCollections.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#202223] focus:ring-0 focus:outline-hidden cursor-pointer accent-[#202223]"
                  />
                </th>
                <th className="py-2.5 px-3 text-[#5c5f62] font-normal text-xs">Title</th>
                <th className="py-2.5 px-6 text-right font-normal text-[#5c5f62] text-xs w-28">Products</th>
                <th className="py-2.5 px-6 text-left font-normal text-[#5c5f62] text-xs w-44">Conditions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5] bg-white">
              {filteredCollections.map((col) => {
                const isSelected = selectedIds.includes(col.id);

                return (
                  <tr
                    key={col.id}
                    className={`hover:bg-[#f6f6f7] transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#f1f2f4]' : ''
                    }`}
                    onClick={() => toggleSelectOne(col.id)}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-3 px-3 text-center w-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(col.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#202223] focus:ring-0 focus:outline-hidden cursor-pointer accent-[#202223]"
                      />
                    </td>

                    {/* Title with circular Badge/Logo Thumbnail */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        {/* Circular Brand Stamp / Thumbnail matching image */}
                        <div className="w-10 h-10 rounded-full border border-gray-300 overflow-hidden bg-white shadow-2xs shrink-0 flex items-center justify-center p-0.5 relative group">
                          <img
                            src={col.image}
                            alt={col.title}
                            className="w-full h-full object-cover rounded-full"
                          />
                          <div className="absolute inset-0 rounded-full border-2 border-emerald-600/40 pointer-events-none" />
                        </div>

                        <span className="font-semibold text-xs text-[#202223] hover:underline">
                          {col.title}
                        </span>
                      </div>
                    </td>

                    {/* Products count */}
                    <td className="py-3 px-6 text-right font-normal text-[#202223] text-xs">
                      {col.productsCount}
                    </td>

                    {/* Conditions */}
                    <td className="py-3 px-6 text-left text-gray-500 text-xs font-mono">
                      {col.conditions || ''}
                    </td>
                  </tr>
                );
              })}

              {filteredCollections.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 text-xs">
                    No collections found matching "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer helper note matching screenshot: "Learn more about collections" */}
      <div className="text-center pt-2 pb-6">
        <a
          href="#learn-more"
          onClick={(e) => {
            e.preventDefault();
            alert('Collections allow you to group products for easy browsing and promotional marketing campaigns.');
          }}
          className="text-xs text-[#5c5f62] hover:text-[#202223] hover:underline"
        >
          Learn more about collections
        </a>
      </div>
    </div>
  );
};
