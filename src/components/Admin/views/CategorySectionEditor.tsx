import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Check,
  X,
  ExternalLink,
  Sparkles,
  RefreshCw,
  FolderPlus
} from 'lucide-react';
import { Category, ThemeConfig } from '../../../types';

export interface CategorySectionEditorProps {
  theme: ThemeConfig;
  updateTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  onSelectCategoryToEdit?: (categoryId: string) => void;
  showToast?: (message: string) => void;
}

// Curated high-resolution, reliable Unsplash images for instant selection
export const CATEGORY_IMAGE_PRESETS = [
  {
    name: 'Smart Watches',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    category: 'Watch'
  },
  {
    name: 'Earbuds & Audio',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    category: 'Audio'
  },
  {
    name: 'Power & Charging',
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    category: 'Power'
  },
  {
    name: 'Computer & Gaming',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    category: 'Gaming'
  },
  {
    name: 'Home & Kitchen',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    category: 'Home'
  },
  {
    name: "Men's Caps & Fashion",
    url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80',
    category: 'Fashion'
  },
  {
    name: 'Health & Grooming',
    url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80',
    category: 'Grooming'
  },
  {
    name: 'Mobile Accessories',
    url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
    category: 'Mobile'
  },
  {
    name: 'Sneakers & Shoes',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    category: 'Shoes'
  },
  {
    name: 'Travel & Backpacks',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    category: 'Bags'
  },
  {
    name: 'Camera & Optics',
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    category: 'Camera'
  },
  {
    name: 'Drones & Tech Toys',
    url: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600&auto=format&fit=crop&q=80',
    category: 'Drone'
  }
];

export const FALLBACK_CATEGORY_IMAGE =
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80';

export const CategorySectionEditor: React.FC<CategorySectionEditorProps> = ({
  theme,
  updateTheme,
  showToast
}) => {
  const currentCategories: Category[] = theme.categoriesSection.items || [];
  
  // State for active modal / editor
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newCatForm, setNewCatForm] = useState<Partial<Category>>({
    name: '',
    banglaName: '',
    slug: '',
    link: '',
    image: CATEGORY_IMAGE_PRESETS[0].url,
    itemCount: 12,
    iconName: 'Zap'
  });
  const [showPresetPicker, setShowPresetPicker] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to persist categories to theme config
  const handleSaveCategories = (updatedCategories: Category[]) => {
    updateTheme((prev) => ({
      ...prev,
      categoriesSection: {
        ...prev.categoriesSection,
        items: updatedCategories
      }
    }));
  };

  // Re-order Move
  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentCategories.length) return;

    const copy = [...currentCategories];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    handleSaveCategories(copy);
    if (showToast) showToast(`ক্যাটাগরি স্থান পরিবর্তন করা হয়েছে`);
  };

  // Delete Category
  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`আপনি কি "${name}" ক্যাটাগরিটি ডিলিট করতে চান?`)) {
      const updated = currentCategories.filter((c) => c.id !== id);
      handleSaveCategories(updated);
      if (editingCategory?.id === id) setEditingCategory(null);
      if (showToast) showToast(`"${name}" ক্যাটাগরি ডিলিট করা হয়েছে`);
    }
  };

  // Handle local image file upload (Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('ইমেজের সাইজ সর্বোচ্চ 2MB হতে হবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      if (isEditing && editingCategory) {
        setEditingCategory({ ...editingCategory, image: base64Url });
      } else {
        setNewCatForm((prev) => ({ ...prev, image: base64Url }));
      }
      if (showToast) showToast('ইমেজ সফলভাবে আপলোড করা হয়েছে');
    };
    reader.readAsDataURL(file);
  };

  // Save new category
  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatForm.name?.trim()) {
      alert('অনুগ্রহ করে ক্যাটাগরির নাম প্রদান করুন');
      return;
    }

    const slug =
      newCatForm.slug?.trim() ||
      newCatForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCatForm.name.trim(),
      banglaName: newCatForm.banglaName?.trim() || newCatForm.name.trim(),
      slug: slug,
      link: newCatForm.link?.trim() || slug,
      iconName: newCatForm.iconName || 'Zap',
      image: newCatForm.image?.trim() || CATEGORY_IMAGE_PRESETS[0].url,
      itemCount: Number(newCatForm.itemCount) || 0,
      subcategories: []
    };

    const updated = [...currentCategories, newCategory];
    handleSaveCategories(updated);
    setIsAddingNew(false);
    setNewCatForm({
      name: '',
      banglaName: '',
      slug: '',
      link: '',
      image: CATEGORY_IMAGE_PRESETS[0].url,
      itemCount: 12,
      iconName: 'Zap'
    });
    if (showToast) showToast(`নতুন ক্যাটাগরি "${newCategory.name}" যোগ করা হয়েছে!`);
  };

  // Save edited category
  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const updated = currentCategories.map((c) =>
      c.id === editingCategory.id ? editingCategory : c
    );
    handleSaveCategories(updated);
    setEditingCategory(null);
    if (showToast) showToast(`ক্যাটাগরি "${editingCategory.name}" আপডেট করা হয়েছে!`);
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, !!editingCategory)}
      />

      {/* Section Header Controls */}
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-extrabold text-xs text-gray-900 block">ক্যাটাগরি সেকশন সেটিংস</span>
            <span className="text-[11px] text-gray-500">হোমপেজে দৃশ্যমান বা লুকানো</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={theme.categoriesSection.enabled}
              onChange={(e) =>
                updateTheme((prev) => ({
                  ...prev,
                  categoriesSection: { ...prev.categoriesSection, enabled: e.target.checked }
                }))
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div>
          <label className="font-semibold text-gray-700 block mb-1 text-xs">
            প্রধান শিরোনাম (Section Title)
          </label>
          <input
            type="text"
            value={theme.categoriesSection.title}
            onChange={(e) =>
              updateTheme((prev) => ({
                ...prev,
                categoriesSection: { ...prev.categoriesSection, title: e.target.value }
              }))
            }
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-rose-500"
            placeholder="পপুলার ক্যাটাগরি ব্রাউজ করুন"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 block mb-1 text-xs">
            সাব-টাইটেল (Subtitle)
          </label>
          <input
            type="text"
            value={theme.categoriesSection.subtitle}
            onChange={(e) =>
              updateTheme((prev) => ({
                ...prev,
                categoriesSection: { ...prev.categoriesSection, subtitle: e.target.value }
              }))
            }
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 outline-none focus:border-rose-500"
            placeholder="আপনার পছন্দের পণ্যটি খুব সহজেই খুঁজে নিন"
          />
        </div>
      </div>

      {/* CATEGORIES MANAGEMENT LIST */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="font-extrabold text-xs text-gray-900">
              ক্যাটাগরি তালিকা ({currentCategories.length} টি)
            </h4>
            <p className="text-[10px] text-gray-500">
              ইমেজ, লিংক ও নাম পরিবর্তন করতে এডিট বাটনে ক্লিক করুন
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsAddingNew(true);
              setEditingCategory(null);
            }}
            className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Category</span>
          </button>
        </div>

        {/* Categories List Cards */}
        <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-0.5">
          {currentCategories.map((cat, index) => (
            <div
              key={cat.id}
              className="p-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-2xs flex items-center justify-between gap-2 group transition-all"
            >
              {/* Reorder Arrows */}
              <div className="flex flex-col items-center shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveCategory(index, 'up')}
                  className="p-0.5 text-gray-400 hover:text-gray-900 disabled:opacity-20 cursor-pointer"
                  title="উপরে তুলুন"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={index === currentCategories.length - 1}
                  onClick={() => moveCategory(index, 'down')}
                  className="p-0.5 text-gray-400 hover:text-gray-900 disabled:opacity-20 cursor-pointer"
                  title="নিচে নামান"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              {/* Category Image Thumbnail */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200 relative">
                <img
                  src={cat.image || FALLBACK_CATEGORY_IMAGE}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_CATEGORY_IMAGE;
                  }}
                />
              </div>

              {/* Title, Bangla Title, Link Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-gray-900 text-xs truncate">{cat.name}</p>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-gray-100 text-gray-600 font-mono shrink-0">
                    {cat.itemCount || 0} আইটেম
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 truncate">
                  <span className="truncate">{cat.banglaName}</span>
                  <span>•</span>
                  <span className="text-rose-600 font-mono truncate flex items-center gap-0.5">
                    <LinkIcon className="w-2.5 h-2.5 inline" />
                    {cat.link || cat.slug || 'filter'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory({ ...cat });
                    setIsAddingNew(false);
                  }}
                  className="p-1.5 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="ক্যাটাগরি, ইমেজ ও লিংক এডিট করুন"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="ডিলিট করুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {currentCategories.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <FolderPlus className="w-8 h-8 mx-auto text-gray-400 mb-1" />
              <p className="text-xs font-bold text-gray-700">কোনো ক্যাটাগরি নেই</p>
              <p className="text-[11px] text-gray-500 mb-2">নতুন ক্যাটাগরি যোগ করতে বাটনে ক্লিক করুন</p>
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold"
              >
                + ক্যাটাগরি যোগ করুন
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL / DRAWER: ADD NEW CATEGORY */}
      {isAddingNew && (
        <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 space-y-3 relative">
          <div className="flex items-center justify-between border-b border-rose-200 pb-2">
            <span className="font-extrabold text-xs text-rose-950 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-rose-600" />
              নতুন ক্যাটাগরি যোগ করুন
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleAddNewCategory} className="space-y-3 text-xs">
            {/* 1. Category Name & Bangla Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  ইংরেজি নাম <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatForm.name}
                  onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                  placeholder="যেমন: Smart Watches"
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">বাংলা নাম</label>
                <input
                  type="text"
                  value={newCatForm.banglaName}
                  onChange={(e) => setNewCatForm({ ...newCatForm, banglaName: e.target.value })}
                  placeholder="যেমন: স্মার্টওয়াচ ও ব্যান্ড"
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* 2. Category Image with Live Preview, Upload, & Preset Gallery */}
            <div className="space-y-1.5 p-2.5 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-800 block">ক্যাটাগরি ইমেজ</label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-gray-600" />
                    <span>ডিভাইস থেকে আপলোড</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPresetPicker(!showPresetPicker)}
                    className="px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-rose-600" />
                    <span>প্রিসেট গ্যালারি</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 relative">
                  <img
                    src={newCatForm.image || FALLBACK_CATEGORY_IMAGE}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_CATEGORY_IMAGE;
                    }}
                  />
                </div>

                <div className="flex-1">
                  <input
                    type="url"
                    value={newCatForm.image}
                    onChange={(e) => setNewCatForm({ ...newCatForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none focus:bg-white focus:border-rose-500 font-mono"
                  />
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    সরাসরি যেকোনো ফটো URL দিন বা গ্যালারি থেকে বেছে নিন
                  </span>
                </div>
              </div>

              {/* Preset Image Picker Drawer */}
              {showPresetPicker && (
                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-600 block">
                    রেডিমেড গ্যাজেট ও ফ্যাশন ইমেজ বেছে নিন:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto p-1 bg-gray-50 rounded-lg border border-gray-200">
                    {CATEGORY_IMAGE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewCatForm((prev) => ({ ...prev, image: p.url }));
                          setShowPresetPicker(false);
                        }}
                        className="group relative aspect-square rounded-md overflow-hidden border border-gray-200 hover:ring-2 hover:ring-rose-500 cursor-pointer"
                        title={p.name}
                      >
                        <img
                          src={p.url}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] truncate px-0.5 text-center">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Category Link & Slug Destination */}
            <div className="space-y-1 p-2.5 bg-white rounded-lg border border-gray-200">
              <label className="font-bold text-gray-800 block">
                ক্যাটাগরি লিংক বা রিডাইরেকশন (Link / Destination)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCatForm.link}
                  onChange={(e) => setNewCatForm({ ...newCatForm, link: e.target.value })}
                  placeholder="যেমন: smart-watches বা /collections/audio বা #catalog"
                  className="flex-1 px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none focus:bg-white focus:border-rose-500 font-mono"
                />
              </div>
              <span className="text-[10px] text-gray-400 block">
                কাস্টমার এই ক্যাটাগরিতে ক্লিক করলে কোন লিংকে বা ফিল্টারে যাবে
              </span>
            </div>

            {/* Submit & Cancel */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL / DRAWER: EDIT CATEGORY */}
      {editingCategory && (
        <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-3 relative">
          <div className="flex items-center justify-between border-b border-indigo-200 pb-2">
            <div>
              <span className="font-extrabold text-xs text-indigo-950 block">
                ক্যাটাগরি এডিট: {editingCategory.name}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                ID: {editingCategory.id}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleUpdateCategory} className="space-y-3 text-xs">
            {/* 1. Category Name & Bangla Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  ইংরেজি নাম <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">বাংলা নাম</label>
                <input
                  type="text"
                  value={editingCategory.banglaName}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, banglaName: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* 2. Edit Image with upload & preset picker */}
            <div className="space-y-1.5 p-2.5 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-800 block">ক্যাটাগরি ইমেজ পরিবর্তন</label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-gray-600" />
                    <span>আপলোড করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPresetPicker(!showPresetPicker)}
                    className="px-2 py-0.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>প্রিসেট ইমেজ</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 relative">
                  <img
                    src={editingCategory.image || FALLBACK_CATEGORY_IMAGE}
                    alt={editingCategory.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_CATEGORY_IMAGE;
                    }}
                  />
                </div>

                <div className="flex-1">
                  <input
                    type="url"
                    value={editingCategory.image}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, image: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none focus:bg-white focus:border-indigo-500 font-mono"
                  />
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    ইমেজের সরাসরি লিংক দিন বা প্রিসেট থেকে পছন্দ করুন
                  </span>
                </div>
              </div>

              {/* Preset Gallery for Editing */}
              {showPresetPicker && (
                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-600 block">
                    রেডিমেড গ্যাজেট ও ফ্যাশন ইমেজ বেছে নিন:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto p-1 bg-gray-50 rounded-lg border border-gray-200">
                    {CATEGORY_IMAGE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setEditingCategory((prev) => (prev ? { ...prev, image: p.url } : null));
                          setShowPresetPicker(false);
                        }}
                        className="group relative aspect-square rounded-md overflow-hidden border border-gray-200 hover:ring-2 hover:ring-indigo-500 cursor-pointer"
                        title={p.name}
                      >
                        <img
                          src={p.url}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] truncate px-0.5 text-center">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Category Link / Destination URL */}
            <div className="space-y-1 p-2.5 bg-white rounded-lg border border-gray-200">
              <label className="font-bold text-gray-800 block">
                ক্যাটাগরি লিংক বা ইউআরএল (Link / Destination URL)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingCategory.link || editingCategory.slug || ''}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      link: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })
                  }
                  placeholder="যেমন: smart-watches বা /collections/watches বা https://..."
                  className="flex-1 px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none focus:bg-white focus:border-indigo-500 font-mono"
                />
              </div>
              <span className="text-[10px] text-gray-400 block">
                এই ক্যাটাগরিতে ক্লিক করলে কালেকশন ফিল্টার বা নির্দিষ্ট পৃষ্ঠায় যাবে
              </span>
            </div>

            {/* 4. Product Count */}
            <div>
              <label className="font-bold text-gray-800 block mb-1">প্রোডাক্ট সংখ্যা (Item Count)</label>
              <input
                type="number"
                min="0"
                value={editingCategory.itemCount}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    itemCount: parseInt(e.target.value, 10) || 0
                  })
                }
                className="w-32 px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>

            {/* Submit & Cancel */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>পরিবর্তন সেভ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
