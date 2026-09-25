import React, { useState, useMemo, useEffect } from 'react';
import {
  Tag,
  Search,
  ArrowUpDown,
  Columns,
  Plus,
  Trash2,
  X,
  ExternalLink,
  Edit2,
  Eye,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Product, ThemeConfig, Category } from '../../../types';
import { DEFAULT_THEME_CONFIG } from '../../../data/defaultThemeConfig';
import { CATEGORIES } from '../../../data/mockData';
import { ShopifyAddCollectionView } from './ShopifyAddCollectionView';

export interface CollectionItem {
  id: string;
  title: string;
  description?: string;
  productsCount: number;
  conditions: string;
  image: string;
  badgeLogoText?: string;
  categoryMatch?: string;
  banglaTitle?: string;
  slug?: string;
}

interface ShopifyCollectionsViewProps {
  products: Product[];
  onOpenStorefrontCategory?: (category: string) => void;
  showToast?: (message: string) => void;
  themeConfig?: ThemeConfig;
  onSaveTheme?: (updatedTheme: ThemeConfig) => void;
  onUpdateProduct?: (product: Product) => void;
}

// Matches the exact list in the screenshot
export const SCREENSHOT_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1',
    title: 'Gadgets & Electric Accessories',
    description: 'Explore the latest trending gadgets, power electronics, chargers, and tech accessories.',
    productsCount: 22,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'BANGLA XPRESS GADGETS',
    banglaTitle: 'গ্যাজেট ও ইলেকট্রিক এক্সেসরিজ'
  },
  {
    id: 'col-2',
    title: 'Computer & IT Accessories',
    description: 'High-performance laptop stands, keyboards, gaming mice, and computing peripherals.',
    productsCount: 2,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'BANGLA XPRESS COMPUTER',
    banglaTitle: 'কম্পিউটার ও আইটি এক্সেসরিজ'
  },
  {
    id: 'col-3',
    title: 'Electronics',
    description: 'Consumer electronics, audio devices, smart devices, and daily tech essentials.',
    productsCount: 4,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'BANGLA XPRESS ELECTRONICS',
    banglaTitle: 'ইলেকট্রনিক্স ও গ্যাজেট'
  },
  {
    id: 'col-4',
    title: 'Best Sellers',
    description: 'Top-selling and highly rated products loved by our customers throughout Bangladesh.',
    productsCount: 3,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'BEST SELLER COLLECTION',
    banglaTitle: 'টপ বেস্ট সেলার কালেকশন'
  },
  {
    id: 'col-5',
    title: 'Health & Fitness',
    description: 'Fitness trackers, wellness gear, massage devices, and health monitoring tools.',
    productsCount: 3,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'HEALTH & FITNESS',
    banglaTitle: 'হেলথ ও ফিটনেস গ্যাজেট'
  },
  {
    id: 'col-6',
    title: 'Home Appliances',
    description: 'Smart kitchen gadgets, electric appliances, smart LED lights, and desk fans.',
    productsCount: 2,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'HOME APPLIANCES',
    banglaTitle: 'হোম ও কিচেন এপ্লায়েন্স'
  },
  {
    id: 'col-7',
    title: 'Caps',
    description: 'Premium baseball caps, embroidered snapbacks, stylish streetwear, and headwear.',
    productsCount: 4,
    conditions: '',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=150&auto=format&fit=crop&q=80',
    badgeLogoText: 'CAPS & APPAREL',
    banglaTitle: 'ক্যাপস ও ফ্যাশন কালেকশন'
  }
];

export const getBanglaTitleForCollection = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('gadget') || t.includes('electric')) return 'গ্যাজেট ও ইলেকট্রিক এক্সেসরিজ';
  if (t.includes('computer') || t.includes('it')) return 'কম্পিউটার ও আইটি এক্সেসরিজ';
  if (t.includes('electronic')) return 'ইলেকট্রনিক্স ও গ্যাজেট';
  if (t.includes('best seller')) return 'টপ বেস্ট সেলার কালেকশন';
  if (t.includes('fitness') || t.includes('health')) return 'হেলথ ও ফিটনেস গ্যাজেট';
  if (t.includes('home') || t.includes('appliance')) return 'হোম ও কিচেন এপ্লায়েন্স';
  if (t.includes('cap')) return 'ক্যাপস ও ফ্যাশন কালেকশন';
  if (t.includes('watch')) return 'স্মার্টওয়াচ ও ব্যান্ড';
  if (t.includes('audio') || t.includes('earbud')) return 'টিডব্লিউএস ও ব্লুটুথ হেডফোন';
  if (t.includes('charge') || t.includes('power')) return 'চার্জার ও পাওয়ার ব্যাংক';
  return title;
};

export const getCategoryIconForCollection = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('watch')) return 'Watch';
  if (t.includes('audio') || t.includes('headphone') || t.includes('earbud')) return 'Headphones';
  if (t.includes('computer') || t.includes('laptop') || t.includes('it')) return 'Laptop';
  if (t.includes('home') || t.includes('kitchen') || t.includes('appliance')) return 'Home';
  if (t.includes('cap') || t.includes('fashion') || t.includes('apparel')) return 'Shirt';
  if (t.includes('health') || t.includes('fitness') || t.includes('grooming')) return 'Sparkles';
  if (t.includes('mobile') || t.includes('phone')) return 'Smartphone';
  return 'Zap';
};

export const ShopifyCollectionsView: React.FC<ShopifyCollectionsViewProps> = ({
  products,
  onOpenStorefrontCategory,
  showToast = (_msg: string) => {},
  themeConfig,
  onSaveTheme,
  onUpdateProduct
}) => {
  // Load saved collections from storage or default to screenshot collections
  const [collections, setCollections] = useState<CollectionItem[]>(() => {
    try {
      const saved = localStorage.getItem('bx_shopify_collections');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load collections from localStorage:', e);
    }
    return SCREENSHOT_COLLECTIONS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);

  // Synchronize collections directly with theme.categoriesSection.items
  // This guarantees that any collection added or edited is IMMEDIATELY reflected on the home page!
  const syncCollectionsToTheme = (currentCollections: CollectionItem[]) => {
    try {
      const baseTheme: ThemeConfig = themeConfig || DEFAULT_THEME_CONFIG;
      const existingItems: Category[] = baseTheme.categoriesSection?.items || CATEGORIES;

      // 1. Map each collection to a Category on the homepage
      const collectionCategories: Category[] = currentCollections.map((col) => {
        const existing = existingItems.find(
          (cat) =>
            cat.id === `cat-${col.id}` ||
            cat.id === col.id ||
            cat.name.toLowerCase() === col.title.toLowerCase()
        );

        return {
          id: existing?.id || (col.id.startsWith('cat-') ? col.id : `cat-${col.id}`),
          name: col.title,
          banglaName: col.banglaTitle || existing?.banglaName || getBanglaTitleForCollection(col.title),
          slug: col.slug || existing?.slug || col.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
          iconName: existing?.iconName || getCategoryIconForCollection(col.title),
          image: col.image || existing?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          itemCount: col.productsCount || existing?.itemCount || 0,
          subcategories: existing?.subcategories || []
        };
      });

      // 2. Preserve any other store categories that are not part of collections
      const otherCategories = existingItems.filter(
        (cat) =>
          !currentCollections.some(
            (col) =>
              cat.id === `cat-${col.id}` ||
              cat.id === col.id ||
              cat.name.toLowerCase() === col.title.toLowerCase()
          )
      );

      const mergedCategories = [...collectionCategories, ...otherCategories];

      const updatedTheme: ThemeConfig = {
        ...baseTheme,
        categoriesSection: {
          ...(baseTheme.categoriesSection || {
            enabled: true,
            title: 'পপুলার ক্যাটাগরি ব্রাউজ করুন',
            subtitle: 'আপনার পছন্দের পণ্যটি খুব সহজেই খুঁজে নিন'
          }),
          items: mergedCategories
        }
      };

      if (onSaveTheme) {
        onSaveTheme(updatedTheme);
      }
      localStorage.setItem('bx_theme_config', JSON.stringify(updatedTheme));
    } catch (err) {
      console.error('Failed to sync collections to theme:', err);
    }
  };

  // Initial synchronization on mount if not yet synchronized
  useEffect(() => {
    const saved = localStorage.getItem('bx_shopify_collections');
    if (!saved) {
      localStorage.setItem('bx_shopify_collections', JSON.stringify(SCREENSHOT_COLLECTIONS));
      syncCollectionsToTheme(SCREENSHOT_COLLECTIONS);
    }
  }, []);

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

  // Handle open edit mode for a collection
  const handleOpenEdit = (col: CollectionItem) => {
    setEditingCollection(col);
    setCurrentView('edit');
  };

  // Handle Save (both Add and Edit)
  const handleSaveCollection = (colToSave: CollectionItem, isEdit?: boolean) => {
    let updatedCollections: CollectionItem[];
    if (isEdit) {
      updatedCollections = collections.map((c) => (c.id === colToSave.id ? colToSave : c));
    } else {
      updatedCollections = [colToSave, ...collections];
    }

    setCollections(updatedCollections);
    try {
      localStorage.setItem('bx_shopify_collections', JSON.stringify(updatedCollections));
    } catch (e) {
      console.error(e);
    }

    // Immediately sync to theme so it is reflected on homepage
    syncCollectionsToTheme(updatedCollections);

    // If products were associated with this collection, update them
    if (onUpdateProduct && products.length > 0) {
      products.forEach((p) => {
        const hasCol = p.collections?.includes(colToSave.title);
        if (colToSave.conditions && colToSave.conditions.toLowerCase().includes(p.category.toLowerCase())) {
          if (!hasCol) {
            onUpdateProduct({
              ...p,
              collections: [...(p.collections || []), colToSave.title]
            });
          }
        }
      });
    }

    setCurrentView('list');
    setEditingCollection(null);

    showToast(
      isEdit
        ? `"${colToSave.title}" কালেকশন সফলভাবে আপডেট করা হয়েছে এবং হোমপেজে যুক্ত হয়েছে!`
        : `"${colToSave.title}" নতুন কালেকশন সফলভাবে যুক্ত হয়েছে এবং হোমপেজে প্রতিফলিত হয়েছে!`
    );
  };

  // Handle Delete a collection
  const handleDeleteCollection = (collectionId: string) => {
    const updatedCollections = collections.filter((c) => c.id !== collectionId);
    setCollections(updatedCollections);
    try {
      localStorage.setItem('bx_shopify_collections', JSON.stringify(updatedCollections));
    } catch (e) {
      console.error(e);
    }
    syncCollectionsToTheme(updatedCollections);

    setCurrentView('list');
    setEditingCollection(null);
    showToast('কালেকশনটি সফলভাবে মুছে ফেলা হয়েছে এবং হোমপেজ আপডেট হয়েছে');
  };

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedIds.length} collection(s)?`)) {
      const updated = collections.filter((c) => !selectedIds.includes(c.id));
      setCollections(updated);
      setSelectedIds([]);
      try {
        localStorage.setItem('bx_shopify_collections', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      syncCollectionsToTheme(updated);
      showToast(`${selectedIds.length} টি কালেকশন মুছে ফেলা হয়েছে`);
    }
  };

  // If in 'add' or 'edit' mode, render the full Shopify Add/Edit Collection view
  if (currentView === 'add' || currentView === 'edit') {
    return (
      <ShopifyAddCollectionView
        products={products}
        editCollection={editingCollection}
        onBack={() => {
          setCurrentView('list');
          setEditingCollection(null);
        }}
        onSave={(savedCol, isEdit) => {
          handleSaveCollection(savedCol, isEdit);
        }}
        onDelete={(colId) => {
          handleDeleteCollection(colId);
        }}
        onViewOnStorefront={(colTitle) => {
          onOpenStorefrontCategory?.(colTitle);
        }}
        showToast={showToast}
      />
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Top Header matching screenshot */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-gray-700 stroke-[2.2]" />
          <div>
            <h1 className="text-xl font-bold text-[#202223] tracking-tight">Collections</h1>
            <p className="text-[11px] text-gray-500 hidden sm:block">
              যেকোনো কালেকশনে ক্লিক করে এডিট করুন; নতুন কালেকশন যুক্ত করলে তা সাথে সাথে হোমপেজে প্রদর্শিত হবে।
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCollection(null);
            setCurrentView('add');
          }}
          className="px-3.5 py-1.5 bg-[#303030] hover:bg-[#202020] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add collection</span>
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
                placeholder="Search and filter collections"
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
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete ({selectedIds.length})</span>
              </button>
            )}

            <button
              type="button"
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-[#f6f6f7] rounded-lg transition-colors cursor-pointer"
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
                <th className="py-2.5 px-4 text-center font-normal text-[#5c5f62] text-xs w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5] bg-white">
              {filteredCollections.map((col) => {
                const isSelected = selectedIds.includes(col.id);

                return (
                  <tr
                    key={col.id}
                    onClick={() => handleOpenEdit(col)}
                    className={`hover:bg-[#f6f6f7] transition-colors cursor-pointer group select-none ${
                      isSelected ? 'bg-[#f1f2f4]' : ''
                    }`}
                    title={`Click to edit collection: "${col.title}"`}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-3 px-3 text-center w-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectOne(col.id);
                      }}
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
                        {/* Circular Brand Stamp / Thumbnail matching screenshot */}
                        <div className="w-10 h-10 rounded-full border border-gray-300 overflow-hidden bg-white shadow-2xs shrink-0 flex items-center justify-center p-0.5 relative group-hover:border-emerald-600 transition-colors">
                          <img
                            src={col.image}
                            alt={col.title}
                            className="w-full h-full object-cover rounded-full"
                          />
                          <div className="absolute inset-0 rounded-full border-2 border-emerald-600/30 pointer-events-none" />
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#202223] group-hover:text-emerald-700 group-hover:underline transition-colors">
                              {col.title}
                            </span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center gap-0.5">
                              <Edit2 className="w-2.5 h-2.5" />
                              <span>Edit</span>
                            </span>
                          </div>
                          {col.banglaTitle && (
                            <span className="text-[10px] text-gray-500 mt-0.5">
                              {col.banglaTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Products count */}
                    <td className="py-3 px-6 text-right font-normal text-[#202223] text-xs font-mono">
                      {col.productsCount}
                    </td>

                    {/* Conditions */}
                    <td className="py-3 px-6 text-left text-gray-500 text-xs font-mono">
                      {col.conditions || '—'}
                    </td>

                    {/* Actions: Edit & View on Storefront */}
                    <td
                      className="py-3 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(col)}
                          className="p-1.5 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
                          title="Edit collection"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {onOpenStorefrontCategory && (
                          <button
                            type="button"
                            onClick={() => onOpenStorefrontCategory(col.title)}
                            className="p-1.5 text-gray-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-sky-200"
                            title="View on storefront homepage"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCollections.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
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
            alert('Collections allow you to group products for easy browsing and promotional marketing campaigns. Any collections you add or edit are immediately synced to your home page categories!');
          }}
          className="text-xs text-[#5c5f62] hover:text-[#202223] hover:underline"
        >
          Learn more about collections
        </a>
      </div>
    </div>
  );
};
