import React, { useState, useRef } from 'react';
import {
  Tag,
  ArrowUp,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronsUpDown,
  Plus,
  PlusCircle,
  X,
  Search,
  Check,
  Trash2,
  Image as ImageIcon,
  Share2,
  Sliders,
  CheckSquare,
  Square,
  ExternalLink
} from 'lucide-react';
import { Product } from '../../../types';
import { CollectionItem } from './ShopifyCollectionsView';

interface ShopifyAddCollectionViewProps {
  products: Product[];
  onBack: () => void;
  onSave: (collection: CollectionItem, isEdit?: boolean) => void;
  onDelete?: (collectionId: string) => void;
  editCollection?: CollectionItem | null;
  showToast?: (message: string) => void;
  onViewOnStorefront?: (collectionTitle: string) => void;
}

export const ShopifyAddCollectionView: React.FC<ShopifyAddCollectionViewProps> = ({
  products,
  onBack,
  onSave,
  onDelete,
  editCollection,
  showToast = (_msg: string) => {},
  onViewOnStorefront
}) => {
  const isEditing = Boolean(editCollection);

  // Collection Form State
  const [title, setTitle] = useState(editCollection?.title || '');
  const [description, setDescription] = useState(editCollection?.description || '');
  const [imageUrl, setImageUrl] = useState(editCollection?.image || '');
  const [badgeLogoText, setBadgeLogoText] = useState(
    editCollection?.badgeLogoText || (editCollection ? editCollection.title.toUpperCase() : '')
  );
  const [themeTemplate, setThemeTemplate] = useState('Default collection');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(() => {
    if (editCollection) {
      // Products with matching collection name or matching category
      const matched = products.filter(
        (p) =>
          p.collections?.includes(editCollection.title) ||
          p.category.toLowerCase() === editCollection.title.toLowerCase() ||
          p.category.toLowerCase().includes(editCollection.title.toLowerCase())
      );
      if (matched.length > 0) {
        return matched.map((p) => p.id);
      }
      // If productsCount exists, take initial matching slice
      if (editCollection.productsCount && editCollection.productsCount > 0) {
        return products.slice(0, Math.min(editCollection.productsCount, products.length)).map((p) => p.id);
      }
    }
    return [];
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilterActive, setStatusFilterActive] = useState(true);

  // Channels state
  const [isChannelsOpen, setIsChannelsOpen] = useState(false);
  const [channels, setChannels] = useState({
    onlineStore: true,
    pos: true,
    facebookInstagram: true,
    shopApp: true
  });

  // Modals state
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [productPickerSearch, setProductPickerSearch] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  // Condition modal state
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [conditionField, setConditionField] = useState('Product category');
  const [conditionOperator, setConditionOperator] = useState('is equal to');
  const [conditionValue, setConditionValue] = useState(() => {
    if (editCollection?.conditions) {
      const parts = editCollection.conditions.split('is equal to');
      if (parts.length > 1) return parts[1].trim();
      return editCollection.conditions;
    }
    return '';
  });

  // Image upload reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active channels count
  const activeChannelsCount = Object.values(channels).filter(Boolean).length;

  // Products currently in collection
  const collectionProducts = products.filter((p) => selectedProductIds.includes(p.id));

  // Handle image upload from computer
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          showToast('কালেকশন ছবি সফলভাবে আপলোড করা হয়েছে');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Open product picker
  const handleOpenProductPicker = () => {
    setTempSelectedIds([...selectedProductIds]);
    setProductPickerSearch('');
    setIsProductPickerOpen(true);
  };

  // Toggle product in picker
  const toggleTempProduct = (id: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Apply picked products
  const handleApplyPickedProducts = () => {
    setSelectedProductIds(tempSelectedIds);
    setIsProductPickerOpen(false);
    showToast(`${tempSelectedIds.length} টি প্রোডাক্ট কালেকশনে যুক্ত হয়েছে`);
  };

  // Remove single product from collection
  const handleRemoveProduct = (id: string) => {
    setSelectedProductIds((prev) => prev.filter((i) => i !== id));
  };

  // Apply condition
  const handleApplyCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conditionValue.trim()) return;

    // Filter products matching condition
    const matching = products.filter((p) => {
      const val = conditionValue.toLowerCase();
      if (conditionField === 'Product category') {
        return p.category.toLowerCase().includes(val);
      }
      if (conditionField === 'Product title') {
        return p.name.toLowerCase().includes(val);
      }
      return false;
    });

    const matchingIds = matching.map((p) => p.id);
    const combined = Array.from(new Set([...selectedProductIds, ...matchingIds]));
    setSelectedProductIds(combined);
    setIsConditionModalOpen(false);
    showToast(`শর্ত পূরণকারী ${matching.length} টি প্রোডাক্ট স্বয়ংক্রিয়ভাবে যোগ হয়েছে`);
  };

  // Save collection
  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert('Please enter a collection title');
      return;
    }

    const updatedCollection: CollectionItem = {
      id: editCollection?.id || `col-${Date.now()}`,
      title: trimmedTitle,
      description: description,
      productsCount: selectedProductIds.length,
      conditions: conditionValue ? `${conditionField} ${conditionOperator} ${conditionValue}` : (editCollection?.conditions || ''),
      image:
        imageUrl ||
        (collectionProducts[0]?.images?.[0] ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80'),
      badgeLogoText: badgeLogoText || trimmedTitle.toUpperCase()
    };

    onSave(updatedCollection, isEditing);
    showToast(
      isEditing
        ? `"${trimmedTitle}" কালেকশন সফলভাবে আপডেট করা হয়েছে!`
        : `"${trimmedTitle}" কালেকশন সফলভাবে তৈরি হয়েছে!`
    );
  };

  // Generated URL slug
  const urlSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-12">
      {/* Top Bar with Breadcrumb and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Breadcrumb matching Shopify admin: [Tag icon] › Collections › [Title] */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Back to collections"
          >
            <Tag className="w-4 h-4 text-gray-700" />
          </button>
          <span className="text-gray-400 text-sm font-light">›</span>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-gray-600 hover:text-black hover:underline cursor-pointer"
          >
            Collections
          </button>
          <span className="text-gray-400 text-sm font-light">›</span>
          <h1 className="text-base sm:text-lg font-bold text-[#202223] tracking-tight">
            {isEditing ? `Edit: ${editCollection?.title}` : 'Add collection'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && onViewOnStorefront && (
            <button
              type="button"
              onClick={() => onViewOnStorefront(title || editCollection!.title)}
              className="px-3 py-1.5 border border-emerald-300 hover:bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="হোমপেজে এই কালেকশনটি দেখুন"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View in store</span>
            </button>
          )}

          {isEditing && onDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Are you sure you want to delete collection "${editCollection?.title}"?`)) {
                  onDelete(editCollection!.id);
                }
              }}
              className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}

          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-1.5 border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#202223] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#303030] hover:bg-[#202020] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEditing ? 'Save changes' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT MAIN COLUMN (approx 68% width) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card 1: Title, Description & Collection Image */}
          <div className="bg-white border border-[#d2d5d8] rounded-xl shadow-2xs p-5 relative">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Image Upload Box with dashed border and ArrowUp icon */}
              <div className="shrink-0 w-full sm:w-44">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {imageUrl ? (
                  <div className="w-full sm:w-44 h-44 rounded-xl border border-gray-200 relative group overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt="Collection"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white shadow-xs"
                        title="Replace image"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="p-2 bg-white/90 rounded-full text-rose-600 hover:bg-white shadow-xs"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-44 h-44 border-2 border-dashed border-[#c9cccf] hover:border-gray-400 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-white group select-none"
                    title="Click to upload collection image"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 group-hover:text-black">
                      <ArrowUp className="w-5 h-5 stroke-[2.2]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Description Fields */}
              <div className="flex-1 w-full space-y-3">
                {/* Title Input */}
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add title"
                    className="w-full text-2xl font-bold text-[#202223] placeholder:text-gray-400 border-none outline-hidden focus:ring-0 px-0 py-1 bg-transparent"
                  />
                </div>

                {/* Description Input Area */}
                <div>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add description"
                    className="w-full text-xs text-[#202223] placeholder:text-gray-400 border-none outline-hidden focus:ring-0 px-0 py-1 resize-none bg-transparent"
                  />
                </div>

                {/* Channels indicator at bottom right of card */}
                <div className="flex justify-end pt-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsChannelsOpen(!isChannelsOpen)}
                      className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-black font-medium select-none cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-gray-500" />
                      <span>{activeChannelsCount} channels</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-500" />
                    </button>

                    {/* Channels Dropdown */}
                    {isChannelsOpen && (
                      <div className="absolute right-0 bottom-full mb-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-30 space-y-2 text-xs">
                        <div className="font-bold text-gray-800 border-b pb-1.5">Sales channels</div>
                        <label className="flex items-center justify-between cursor-pointer py-1">
                          <span className="text-gray-700">Online Store</span>
                          <input
                            type="checkbox"
                            checked={channels.onlineStore}
                            onChange={(e) => setChannels({ ...channels, onlineStore: e.target.checked })}
                            className="rounded text-gray-900 focus:ring-0"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer py-1">
                          <span className="text-gray-700">Point of Sale</span>
                          <input
                            type="checkbox"
                            checked={channels.pos}
                            onChange={(e) => setChannels({ ...channels, pos: e.target.checked })}
                            className="rounded text-gray-900 focus:ring-0"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer py-1">
                          <span className="text-gray-700">Facebook & Instagram</span>
                          <input
                            type="checkbox"
                            checked={channels.facebookInstagram}
                            onChange={(e) => setChannels({ ...channels, facebookInstagram: e.target.checked })}
                            className="rounded text-gray-900 focus:ring-0"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer py-1">
                          <span className="text-gray-700">Shop App</span>
                          <input
                            type="checkbox"
                            checked={channels.shopApp}
                            onChange={(e) => setChannels({ ...channels, shopApp: e.target.checked })}
                            className="rounded text-gray-900 focus:ring-0"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Collection items */}
          <div className="bg-white border border-[#d2d5d8] rounded-xl shadow-2xs p-5 space-y-3">
            {/* Header with count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-sm text-[#202223]">Collection items</h3>
                <span className="text-xs text-gray-600 font-mono font-medium">
                  {selectedProductIds.length}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Add conditions or products to populate your collection
            </p>

            {/* Toolbar row with layout toggles, count indicator, and checkbox */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${
                    viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${
                    viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="List view"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-gray-400 ml-1 font-mono">4</span>
              </div>

              <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center cursor-pointer">
                {selectedProductIds.length > 0 && <Check className="w-3 h-3 text-gray-600" />}
              </div>
            </div>

            {/* Filter Pill matching screenshot: Status: Active, Draft, Unlisted, and... [x] Clear all */}
            <div className="flex items-center gap-2 pt-1">
              {statusFilterActive && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                  <span>Status: Active, Draft, Unlisted, and...</span>
                  <button
                    type="button"
                    onClick={() => setStatusFilterActive(false)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => setStatusFilterActive(false)}
                className="text-xs text-gray-500 hover:text-gray-900 hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Collection Items Display Area */}
            {selectedProductIds.length === 0 ? (
              /* 8 Empty Grid Slots matching screenshot (4 per row x 2 rows) */
              <div className="grid grid-cols-4 gap-3 pt-2">
                {[...Array(8)].map((_, idx) => (
                  <div
                    key={idx}
                    onClick={handleOpenProductPicker}
                    className="aspect-square border border-gray-200/80 rounded-lg bg-white hover:border-gray-300 hover:bg-gray-50/50 transition-colors flex items-center justify-center cursor-pointer group"
                    title="Click to add products"
                  >
                    <span className="text-gray-300 group-hover:text-gray-500 text-xs font-mono">
                      +
                    </span>
                  </div>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              /* Populated Product Cards in 4-column grid */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {collectionProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-gray-300 transition-colors relative group"
                  >
                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(prod.id)}
                        className="absolute top-1.5 right-1.5 p-1 bg-white/90 hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-full shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from collection"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-900 truncate" title={prod.name}>
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono">
                        ৳{prod.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Populated Product Cards in List View */
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                {collectionProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                        alt={prod.name}
                        className="w-10 h-10 object-cover rounded border border-gray-100"
                      />
                      <div>
                        <div className="text-xs font-semibold text-gray-900">{prod.name}</div>
                        <div className="text-[11px] text-gray-500">{prod.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold text-gray-900">
                        ৳{prod.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(prod.id)}
                        className="text-gray-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 3: Theme template */}
          <div className="bg-white border border-[#d2d5d8] rounded-xl shadow-2xs p-5 space-y-2">
            <h3 className="font-bold text-xs text-[#202223]">Theme template</h3>
            <div className="relative">
              <select
                value={themeTemplate}
                onChange={(e) => setThemeTemplate(e.target.value)}
                className="w-full bg-white border border-[#c9cccf] rounded-lg px-3 py-2 text-xs text-[#202223] appearance-none focus:border-[#202223] focus:outline-hidden pr-8 cursor-pointer"
              >
                <option value="Default collection">Default collection</option>
                <option value="Banner grid collection">Banner grid collection</option>
                <option value="Sidebar filtered collection">Sidebar filtered collection</option>
              </select>
              <ChevronsUpDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Card 4: Search engine listing */}
          <div className="bg-white border border-[#d2d5d8] rounded-xl shadow-2xs p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#202223]">Search engine listing</h3>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-[#202223] font-medium">GPE Bangladesh</div>
              <div className="text-xs text-emerald-800 break-all">
                https://www.gpebangladesh.store › collections › {urlSlug || ''}
              </div>
              <div className="text-xs text-gray-500 pt-0.5 line-clamp-2">
                {description || 'Discover premium collections and trending products at GPE Bangladesh.'}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN (approx 32% width) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Products (with Add condition & Add products buttons, and Exclude) */}
          <div className="bg-white border border-[#d2d5d8] rounded-xl shadow-2xs p-5 space-y-3">
            {/* Header: Products ↕ */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-gray-600" />
                <h3 className="font-bold text-xs text-[#202223]">Products</h3>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-gray-500" />
            </div>

            {/* Bordered Action Box containing "Add condition" & "Add products" */}
            <div className="border border-[#c9cccf] rounded-lg overflow-hidden divide-y divide-[#e1e3e5]">
              <button
                type="button"
                onClick={() => setIsConditionModalOpen(true)}
                className="w-full px-3 py-2.5 text-left text-xs font-medium text-[#202223] hover:bg-[#f6f6f7] flex items-center gap-2 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-gray-500" />
                <span>Add condition</span>
              </button>

              <button
                type="button"
                onClick={handleOpenProductPicker}
                className="w-full px-3 py-2.5 text-left text-xs font-medium text-[#202223] hover:bg-[#f6f6f7] flex items-center gap-2 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-gray-500" />
                <span>Add products</span>
              </button>
            </div>

            {/* Exclude Button */}
            <button
              type="button"
              onClick={handleOpenProductPicker}
              className="w-full py-2 px-3 border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-lg text-xs font-medium text-[#202223] flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-gray-500" />
              <span>Exclude</span>
            </button>
          </div>

          {/* Card 2: Dashed Box with centered + icon */}
          <div
            onClick={() => showToast('App block / Metafield integration')}
            className="border-2 border-dashed border-[#c9cccf] hover:border-gray-400 rounded-xl p-6 flex items-center justify-center cursor-pointer transition-colors bg-white group"
            title="Add app block or metafield"
          >
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-gray-700" />
          </div>
        </div>
      </div>

      {/* Product Picker Modal */}
      {isProductPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-5 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[#202223] text-sm flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Select products for collection</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsProductPickerOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search filter in picker */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productPickerSearch}
                onChange={(e) => setProductPickerSearch(e.target.value)}
                placeholder="Search products by title or category..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-hidden"
              />
            </div>

            {/* Products List with Checkboxes */}
            <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-lg">
              {products
                .filter((p) =>
                  p.name.toLowerCase().includes(productPickerSearch.toLowerCase()) ||
                  p.category.toLowerCase().includes(productPickerSearch.toLowerCase())
                )
                .map((prod) => {
                  const isChecked = tempSelectedIds.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => toggleTempProduct(prod.id)}
                      className={`p-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                        isChecked ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center">
                          {isChecked && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                        </div>
                        <img
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt={prod.name}
                          className="w-9 h-9 object-cover rounded border border-gray-100"
                        />
                        <div>
                          <div className="text-xs font-semibold text-gray-900">{prod.name}</div>
                          <div className="text-[11px] text-gray-500">{prod.category}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-800">
                        ৳{prod.price.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-gray-500">
                {tempSelectedIds.length} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductPickerOpen(false)}
                  className="px-3.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyPickedProducts}
                  className="px-4 py-1.5 bg-[#303030] hover:bg-[#202020] text-white rounded-lg text-xs font-semibold"
                >
                  Add to collection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Condition Modal */}
      {isConditionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleApplyCondition}
            className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[#202223] text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Add automated condition</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsConditionModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Field</label>
                <select
                  value={conditionField}
                  onChange={(e) => setConditionField(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Product category">Product category</option>
                  <option value="Product title">Product title</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Condition</label>
                <select
                  value={conditionOperator}
                  onChange={(e) => setConditionOperator(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="is equal to">is equal to</option>
                  <option value="contains">contains</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Watch, Gadgets, Accessories"
                  value={conditionValue}
                  onChange={(e) => setConditionValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsConditionModalOpen(false)}
                className="px-3.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#303030] hover:bg-[#202020] text-white rounded-lg text-xs font-semibold"
              >
                Apply Condition
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
