import React, { useState, useRef } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  Upload,
  Search,
  Copy,
  Check,
  Eye,
  X,
  SlidersHorizontal,
  FolderOpen,
  Maximize2,
  Sparkles
} from 'lucide-react';

interface ShopifyContentViewProps {
  showToast?: (message: string) => void;
}

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  dimensions: string;
  type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/svg';
  category: 'Products' | 'Banners' | 'Logos' | 'General';
  uploadedAt: string;
}

interface StorePage {
  id: string;
  title: string;
  slug: string;
  content: string;
  updated: string;
  status: 'Published' | 'Draft';
}

interface StoreBanner {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
}

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-1',
    name: 'smartwatch-ultra-edition.jpg',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    size: '342 KB',
    dimensions: '1200 x 1200',
    type: 'image/jpeg',
    category: 'Products',
    uploadedAt: 'Today, 10:45 AM'
  },
  {
    id: 'med-2',
    name: 'wireless-earbuds-pro.jpg',
    url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800',
    size: '289 KB',
    dimensions: '1000 x 1000',
    type: 'image/jpeg',
    category: 'Products',
    uploadedAt: 'Yesterday'
  },
  {
    id: 'med-3',
    name: 'noise-cancelling-headphones.jpg',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    size: '412 KB',
    dimensions: '1400 x 1400',
    type: 'image/jpeg',
    category: 'Products',
    uploadedAt: '3 days ago'
  },
  {
    id: 'med-4',
    name: 'hero-gadgets-mega-sale.jpg',
    url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
    size: '620 KB',
    dimensions: '1920 x 800',
    type: 'image/jpeg',
    category: 'Banners',
    uploadedAt: '5 days ago'
  },
  {
    id: 'med-5',
    name: 'banglaxpress-logo-badge.png',
    url: 'https://images.unsplash.com/photo-1584679109597-c656b19974c9?w=800',
    size: '115 KB',
    dimensions: '512 x 512',
    type: 'image/png',
    category: 'Logos',
    uploadedAt: '1 week ago'
  },
  {
    id: 'med-6',
    name: 'mechanical-keyboard-rgb.jpg',
    url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
    size: '510 KB',
    dimensions: '1200 x 900',
    type: 'image/jpeg',
    category: 'Products',
    uploadedAt: '2 weeks ago'
  }
];

const INITIAL_PAGES: StorePage[] = [
  {
    id: 'page-1',
    title: 'About Us (আমাদের সম্পর্কে)',
    slug: '/about-us',
    content: 'GPE Bangladesh is Bangladesh’s premier curated e-commerce destination for authentic electronics, smart gadgets, and lifestyle essentials with express home delivery.',
    updated: '2 days ago',
    status: 'Published'
  },
  {
    id: 'page-2',
    title: 'Return & Refund Policy (রিটার্ন ও রিফান্ড পলিসি)',
    slug: '/return-policy',
    content: 'We offer a 7-day hassle-free return and replacement guarantee if any product arrives damaged, defective, or different from described.',
    updated: '1 week ago',
    status: 'Published'
  },
  {
    id: 'page-3',
    title: 'Terms & Conditions (শর্তাবলী)',
    slug: '/terms',
    content: 'All orders placed through GPE Bangladesh are governed by our standard terms of service. Prices include all applicable taxes in BDT.',
    updated: '2 weeks ago',
    status: 'Published'
  },
  {
    id: 'page-4',
    title: 'Privacy Policy (গোপনীয়তা নীতি)',
    slug: '/privacy-policy',
    content: 'Your privacy is paramount. Customer phone numbers, addresses, and transaction histories are strictly encrypted and never shared.',
    updated: '1 month ago',
    status: 'Published'
  },
  {
    id: 'page-5',
    title: 'Delivery & Shipping Guide (ডেলিভারি তথ্য)',
    slug: '/delivery-guide',
    content: 'Inside Dhaka metro: 24-48 hours (৳60). Outside Dhaka: 48-72 hours (৳120) via Steadfast & Pathao courier partner network.',
    updated: 'Yesterday',
    status: 'Published'
  }
];

const INITIAL_BANNERS: StoreBanner[] = [
  {
    id: 'ban-1',
    badge: 'Mega Sale',
    badgeColor: 'bg-rose-600',
    title: 'Smart Gadgets 50% Off',
    subtitle: 'Fast Express Delivery nationwide across Bangladesh in 24-48 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200',
    ctaText: 'Shop Gadgets',
    ctaLink: '/collections/gadgets',
    active: true
  },
  {
    id: 'ban-2',
    badge: 'Special Fest',
    badgeColor: 'bg-amber-500',
    title: 'Ramadan & Eid Tech Fest',
    subtitle: 'Cash on delivery available nationwide with authentic official warranty',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
    ctaText: 'Explore Offers',
    ctaLink: '/collections/eid-sale',
    active: true
  }
];

const BANNER_PRESETS = [
  {
    name: 'Smart Watches & Bands',
    url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Wireless Audio & Headphones',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Minimalist Tech Watch',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Gaming & Computer Desk',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Modern Gadgets & Lifestyle',
    url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Studio Earbuds & Sound',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&auto=format&fit=crop&q=80'
  }
];

export const ShopifyContentView: React.FC<ShopifyContentViewProps> = ({
  showToast = (_msg: string) => {}
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'media' | 'pages' | 'banners'>('media');

  // Media State with LocalStorage Persistence
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('banglaxpress_admin_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MEDIA_ITEMS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Products' | 'Banners' | 'Logos' | 'General'>('All');
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUrlUploadOpen, setIsUrlUploadOpen] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customImageName, setCustomImageName] = useState('');
  const [customCategory, setCustomCategory] = useState<'Products' | 'Banners' | 'Logos' | 'General'>('Products');

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);

  // In-app Delete Confirmation State
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [isBatchDeleteConfirmOpen, setIsBatchDeleteConfirmOpen] = useState(false);

  // Pages State
  const [pagesList, setPagesList] = useState<StorePage[]>(INITIAL_PAGES);
  const [editingPage, setEditingPage] = useState<StorePage | null>(null);
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [pageForm, setPageForm] = useState({ title: '', slug: '', content: '', status: 'Published' as 'Published' | 'Draft' });

  // Banners State with LocalStorage Persistence
  const [bannersList, setBannersList] = useState<StoreBanner[]>(() => {
    try {
      const saved = localStorage.getItem('banglaxpress_admin_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BANNERS;
  });

  const persistBanners = (list: StoreBanner[]) => {
    try {
      localStorage.setItem('banglaxpress_admin_banners', JSON.stringify(list));
    } catch (e) {
      console.warn(e);
    }
  };

  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    badge: 'Special Offer',
    badgeColor: 'bg-rose-600',
    title: '',
    subtitle: '',
    imageUrl: '',
    ctaText: 'Shop Now',
    ctaLink: '/collections',
    active: true
  });

  // Banner image upload state & ref
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);
  const [bannerUploadTab, setBannerUploadTab] = useState<'upload' | 'url' | 'presets'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save Media List to LocalStorage Helper
  const persistMedia = (list: MediaItem[]) => {
    try {
      localStorage.setItem('banglaxpress_admin_media', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage limit or error:', e);
    }
  };

  // Banner File Upload Handler
  const handleBannerFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      showToast('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('ছবির সাইজ সর্বোচ্চ 8MB হতে পারে');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setBannerForm((prev) => ({ ...prev, imageUrl: dataUrl }));

      // Also persist to store's media library for future reuse
      const newMedia: MediaItem = {
        id: `med-${Date.now()}`,
        name: file.name,
        url: dataUrl,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        dimensions: '1920 x 800',
        type: (file.type as any) || 'image/jpeg',
        category: 'Banners',
        uploadedAt: 'Just now'
      };
      setMediaList((prev) => {
        const next = [newMedia, ...prev];
        persistMedia(next);
        return next;
      });

      showToast('ব্যানার ইমেজ সফলভাবে আপলোড হয়েছে');
    };
    reader.readAsDataURL(file);
  };

  // Process Files from Input or Drag-and-Drop
  const processFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showToast('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP, SVG) নির্বাচন করুন');
      return;
    }

    let loadedCount = 0;
    const newItems: MediaItem[] = [];

    validFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const fileSizeKb = Math.round(file.size / 1024);
          const newItem: MediaItem = {
            id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            url: reader.result,
            size: `${fileSizeKb} KB`,
            dimensions: '1200 x 1200',
            type: (file.type as MediaItem['type']) || 'image/jpeg',
            category: 'General',
            uploadedAt: 'Just now'
          };
          newItems.push(newItem);
          loadedCount++;

          if (loadedCount === validFiles.length) {
            setMediaList((prev) => {
              const updated = [...newItems, ...prev];
              persistMedia(updated);
              return updated;
            });
            showToast(`${validFiles.length} টি ছবি সফলভাবে আপলোড সম্পন্ন হয়েছে!`);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // File Upload Handler (Computer / Device)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  // URL Upload Handler
  const handleAddUrlImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customImageUrl.trim()) return;

    const newMedia: MediaItem = {
      id: `med-${Date.now()}`,
      name: customImageName.trim() || `image-${Date.now()}.jpg`,
      url: customImageUrl.trim(),
      size: '250 KB',
      dimensions: '1200 x 1200',
      type: 'image/jpeg',
      category: customCategory,
      uploadedAt: 'Just now'
    };

    setMediaList((prev) => {
      const updated = [newMedia, ...prev];
      persistMedia(updated);
      return updated;
    });

    setIsUrlUploadOpen(false);
    setCustomImageUrl('');
    setCustomImageName('');
    showToast('নতুন মিডিয়া ফাইল যুক্ত করা হয়েছে!');
  };

  // Trigger Delete Single Media (Safe In-App Modal)
  const promptDeleteMedia = (item: MediaItem) => {
    setMediaToDelete(item);
  };

  const confirmExecuteDelete = () => {
    if (!mediaToDelete) return;
    const { id, name } = mediaToDelete;
    setMediaList((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      persistMedia(updated);
      return updated;
    });
    setSelectedMediaIds((prev) => prev.filter((i) => i !== id));
    if (previewMedia?.id === id) setPreviewMedia(null);
    showToast(`"${name}" ছবিটি সফলভাবে ডিলিট করা হয়েছে!`);
    setMediaToDelete(null);
  };

  // Trigger Delete Selected Media (Safe In-App Modal)
  const promptBatchDelete = () => {
    if (selectedMediaIds.length === 0) return;
    setIsBatchDeleteConfirmOpen(true);
  };

  const confirmExecuteBatchDelete = () => {
    const count = selectedMediaIds.length;
    setMediaList((prev) => {
      const updated = prev.filter((m) => !selectedMediaIds.includes(m.id));
      persistMedia(updated);
      return updated;
    });
    showToast(`${count} টি মিডিয়া ফাইল সফলভাবে মুছে ফেলা হয়েছে!`);
    setSelectedMediaIds([]);
    setIsBatchDeleteConfirmOpen(false);
  };

  // Quick helper to delete directly if needed
  const handleDeleteMedia = (id: string, name: string) => {
    const item = mediaList.find((m) => m.id === id);
    if (item) {
      promptDeleteMedia(item);
    } else {
      setMediaList((prev) => {
        const updated = prev.filter((m) => m.id !== id);
        persistMedia(updated);
        return updated;
      });
      showToast(`"${name}" ডিলিট করা হয়েছে`);
    }
  };

  // Copy Link
  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    showToast('ইমেজ লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Media
  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pages Handlers
  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageForm.title.trim()) return;

    if (editingPage) {
      setPagesList((prev) =>
        prev.map((p) =>
          p.id === editingPage.id
            ? { ...p, title: pageForm.title, slug: pageForm.slug, content: pageForm.content, status: pageForm.status, updated: 'Just now' }
            : p
        )
      );
      setEditingPage(null);
      showToast('পেজ আপডেট সফল হয়েছে!');
    } else {
      const newPage: StorePage = {
        id: `page-${Date.now()}`,
        title: pageForm.title,
        slug: pageForm.slug.startsWith('/') ? pageForm.slug : `/${pageForm.slug}`,
        content: pageForm.content,
        updated: 'Just now',
        status: pageForm.status
      };
      setPagesList((prev) => [...prev, newPage]);
      setIsAddPageOpen(false);
      showToast('নতুন পেজ তৈরি সম্পন্ন হয়েছে!');
    }

    setPageForm({ title: '', slug: '', content: '', status: 'Published' });
  };

  const handleDeletePage = (id: string, title: string) => {
    if (confirm(`Delete page "${title}"?`)) {
      setPagesList((prev) => prev.filter((p) => p.id !== id));
      showToast('পেজটি মুছে ফেলা হয়েছে!');
    }
  };

  // Banners Handlers
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) {
      showToast('অনুগ্রহ করে ব্যানারের টাইটেল লিখুন');
      return;
    }
    if (!bannerForm.imageUrl.trim()) {
      showToast('অনুগ্রহ করে ব্যানার ইমেজ আপলোড বা সিলেক্ট করুন');
      return;
    }

    const newBanner: StoreBanner = {
      id: `ban-${Date.now()}`,
      badge: bannerForm.badge,
      badgeColor: bannerForm.badgeColor,
      title: bannerForm.title,
      subtitle: bannerForm.subtitle,
      imageUrl: bannerForm.imageUrl,
      ctaText: bannerForm.ctaText,
      ctaLink: bannerForm.ctaLink,
      active: bannerForm.active
    };

    setBannersList((prev) => {
      const next = [newBanner, ...prev];
      persistBanners(next);
      return next;
    });
    setIsAddBannerOpen(false);
    setBannerForm({
      badge: 'Special Offer',
      badgeColor: 'bg-rose-600',
      title: '',
      subtitle: '',
      imageUrl: '',
      ctaText: 'Shop Now',
      ctaLink: '/collections',
      active: true
    });
    showToast('নতুন ব্যানার স্লাইডার যুক্ত হয়েছে!');
  };

  const handleToggleBanner = (id: string) => {
    setBannersList((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b));
      persistBanners(next);
      return next;
    });
    showToast('ব্যানারের ভিজিবিলিটি পরিবর্তন করা হয়েছে');
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('Delete this banner slide?')) {
      setBannersList((prev) => {
        const next = prev.filter((b) => b.id !== id);
        persistBanners(next);
        return next;
      });
      showToast('ব্যানার স্লাইডার মুছে ফেলা হয়েছে!');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Hidden File Input for Device Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            <span>Content & Media Management</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your store's media files, policy pages, promotional banners, and visual branding assets.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('media')}
            className={`px-3.5 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'media' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Media Files ({mediaList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('banners')}
            className={`px-3.5 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'banners' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hero Banners ({bannersList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('pages')}
            className={`px-3.5 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'pages' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pages ({pagesList.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: MEDIA FILES (FULL DELETE & UPLOAD SUPPORT) */}
      {activeSubTab === 'media' && (
        <div className="space-y-4">
          {/* Storage Stat & Actions Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-gray-500 block">Total Files</span>
                <span className="font-bold text-gray-900 font-mono text-sm">{mediaList.length} assets</span>
              </div>
              <div className="h-7 w-px bg-gray-200" />
              <div>
                <span className="text-gray-500 block">Cloud Storage</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">3.4 MB / 5 GB</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedMediaIds.length > 0 && (
                <button
                  type="button"
                  onClick={promptBatchDelete}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedMediaIds.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsUrlUploadOpen(true)}
                className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Add from URL</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload Media (Device)</span>
              </button>
            </div>
          </div>

          {/* Active Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer bg-white ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50 scale-[1.008]'
                : 'border-gray-300 hover:border-emerald-500 hover:bg-gray-50/70 shadow-2xs'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  ছবি আপলোড করতে ড্র্যাগ করে এখানে ছাড়ুন অথবা ক্লিক করুন
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  সাপোর্ট: JPG, PNG, WEBP, SVG • একাধিক ছবি একসাথে সিলেক্ট করে আপলোড করতে পারবেন
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-3 py-1 bg-gray-900 text-white text-[11px] font-semibold rounded-lg shadow-xs hover:bg-gray-800 transition-colors">
                  ডিভাইস থেকে ফাইল বেছে নিন
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUrlUploadOpen(true);
                  }}
                  className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-[11px] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ইমেজ URL দিন
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media files by name..."
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-hidden focus:border-gray-900"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['All', 'Products', 'Banners', 'Logos', 'General'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Media Grid with Active Delete and Copy Link */}
          {filteredMedia.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">No media files found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Upload images from your computer or provide image URLs to store and organize product and banner photos.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold"
              >
                Upload image now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {filteredMedia.map((item) => {
                const isSelected = selectedMediaIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl border transition-all overflow-hidden group relative flex flex-col justify-between ${
                      isSelected ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-md' : 'border-gray-200 shadow-2xs hover:shadow-md'
                    }`}
                  >
                    {/* Thumbnail Image Container */}
                    <div className="aspect-square bg-gray-50 relative overflow-hidden flex items-center justify-center">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Select Checkbox (Always visible if selected, visible on hover) */}
                      <div
                        className={`absolute top-2 left-2 z-10 ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        } transition-opacity`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            setSelectedMediaIds((prev) =>
                              prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id]
                            )
                          }
                          className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-0 cursor-pointer accent-emerald-600"
                        />
                      </div>

                      {/* Quick Action Overlay (View & Delete & Copy) */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        {/* View Preview */}
                        <button
                          type="button"
                          onClick={() => setPreviewMedia(item)}
                          className="p-1.5 bg-white/90 hover:bg-white text-gray-800 rounded-md shadow-xs transition-colors"
                          title="View Full Size"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Copy Link */}
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(item)}
                          className="p-1.5 bg-white/90 hover:bg-white text-gray-800 rounded-md shadow-xs transition-colors"
                          title="Copy Image URL"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete Image */}
                        <button
                          type="button"
                          onClick={() => promptDeleteMedia(item)}
                          className="p-1.5 bg-white/90 hover:bg-rose-50 text-rose-600 rounded-md shadow-xs transition-colors cursor-pointer"
                          title="Delete File"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Meta details footer with quick delete action */}
                    <div className="p-2 border-t border-gray-100 bg-white">
                      <div className="flex items-start justify-between gap-1">
                        <div className="text-[11px] font-semibold text-gray-900 truncate flex-1" title={item.name}>
                          {item.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => promptDeleteMedia(item)}
                          className="text-gray-400 hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1 font-mono">
                        <span>{item.size}</span>
                        <span className="px-1 py-0.2 bg-gray-100 rounded text-gray-600">{item.category}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: HERO BANNERS */}
      {activeSubTab === 'banners' && (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Storefront Hero Sliders & Banners</h3>
              <p className="text-xs text-gray-500">
                Live banners displayed at the top of your store homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddBannerOpen(true)}
              className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bannersList.map((banner) => (
              <div
                key={banner.id}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
              >
                {/* Banner Preview Visual */}
                <div className="h-40 relative overflow-hidden bg-slate-900">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-between text-white">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${banner.badgeColor}`}>
                        {banner.badge}
                      </span>
                      <h4 className="text-base font-black mt-1.5 text-white drop-shadow-sm">{banner.title}</h4>
                      <p className="text-xs text-gray-200 line-clamp-1 mt-0.5">{banner.subtitle}</p>
                    </div>

                    <span className="inline-block self-start px-3 py-1 bg-white text-gray-900 rounded-md font-bold text-xs shadow-xs">
                      {banner.ctaText} →
                    </span>
                  </div>
                </div>

                {/* Banner Settings Row */}
                <div className="p-3 bg-gray-50/70 border-t border-gray-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleBanner(banner.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        banner.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {banner.active ? '● Active on Home' : '○ Disabled'}
                    </button>
                    <span className="text-gray-400 font-mono text-[11px]">{banner.ctaLink}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                    title="Delete banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: POLICY & INFO PAGES */}
      {activeSubTab === 'pages' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Store Policy & Info Pages</h3>
              <p className="text-xs text-gray-500 mt-0.5">Published pages appear in your store's footer navigation.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingPage(null);
                setPageForm({ title: '', slug: '', content: '', status: 'Published' });
                setIsAddPageOpen(true);
              }}
              className="px-3.5 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-800 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add page</span>
            </button>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {pagesList.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors">
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">{p.title}</h4>
                  <span className="text-xs text-emerald-800 font-mono">{p.slug}</span>
                  <p className="text-xs text-gray-500 line-clamp-1 max-w-xl">{p.content}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Published'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingPage(p);
                      setPageForm({ title: p.title, slug: p.slug, content: p.content, status: p.status });
                      setIsAddPageOpen(true);
                    }}
                    className="p-1.5 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100"
                    title="Edit page"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePage(p.id, p.title)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                    title="Delete page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Full-Screen Image Lightbox Preview */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="truncate pr-2">
                <h3 className="font-bold text-gray-900 text-sm truncate">{previewMedia.name}</h3>
                <span className="text-xs text-gray-500 font-mono">
                  {previewMedia.dimensions} • {previewMedia.size} • {previewMedia.uploadedAt}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 text-gray-400 hover:text-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] bg-slate-950 flex items-center justify-center p-4">
              <img
                src={previewMedia.url}
                alt={previewMedia.name}
                className="max-h-[50vh] max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="p-4 border-t flex items-center justify-between text-xs bg-gray-50">
              <button
                type="button"
                onClick={() => handleCopyUrl(previewMedia)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white flex items-center gap-1.5 font-semibold text-gray-700"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image URL</span>
              </button>

              <button
                type="button"
                onClick={() => promptDeleteMedia(previewMedia)}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-1.5 font-semibold shadow-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Media via URL */}
      {isUrlUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddUrlImage}
            className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-gray-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Add Image from URL</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUrlUploadOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Image URL (https://...)</label>
              <input
                type="url"
                required
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">File Name (Optional)</label>
              <input
                type="text"
                value={customImageName}
                onChange={(e) => setCustomImageName(e.target.value)}
                placeholder="e.g. smart-watch-banner.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Category</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              >
                <option value="Products">Products</option>
                <option value="Banners">Banners</option>
                <option value="Logos">Logos</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsUrlUploadOpen(false)}
                className="px-3.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg font-semibold"
              >
                Add Image
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add/Edit Page */}
      {isAddPageOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePage}
            className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{editingPage ? 'Edit Page' : 'Create New Store Page'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddPageOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Page Title</label>
              <input
                type="text"
                required
                value={pageForm.title}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoSlug = `/${val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}`;
                  setPageForm({ ...pageForm, title: val, slug: pageForm.slug || autoSlug });
                }}
                placeholder="e.g. Warranty Claim & Service Policy"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">URL Handle (Slug)</label>
              <input
                type="text"
                required
                value={pageForm.slug}
                onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                placeholder="/warranty-claim"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Page Content</label>
              <textarea
                rows={5}
                required
                value={pageForm.content}
                onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                placeholder="Type policy page content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Status</label>
              <select
                value={pageForm.status}
                onChange={(e) => setPageForm({ ...pageForm, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsAddPageOpen(false)}
                className="px-3.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg font-semibold"
              >
                Save Page
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Banner */}
      {isAddBannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddBanner}
            className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Create Homepage Hero Banner</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddBannerOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Badge Text</label>
                <input
                  type="text"
                  required
                  value={bannerForm.badge}
                  onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                  placeholder="e.g. Flash Deal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Badge Color</label>
                <select
                  value={bannerForm.badgeColor}
                  onChange={(e) => setBannerForm({ ...bannerForm, badgeColor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
                >
                  <option value="bg-rose-600">Red (Sale)</option>
                  <option value="bg-amber-500">Amber (Special)</option>
                  <option value="bg-emerald-600">Emerald (New)</option>
                  <option value="bg-purple-600">Purple (Fest)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Banner Headline</label>
              <input
                type="text"
                required
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                placeholder="e.g. Exclusive Wireless Audio Collection"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Subtitle Description</label>
              <input
                type="text"
                required
                value={bannerForm.subtitle}
                onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                placeholder="e.g. Free shipping on all orders over ৳2,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
              />
            </div>

            {/* Banner Background Image (Upload, URL, or Presets) */}
            <div className="space-y-2 pt-1 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-gray-800">
                  Banner Image (ব্যানার ইমেজ) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setBannerUploadTab('upload')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      bannerUploadTab === 'upload'
                        ? 'bg-white text-gray-900 shadow-2xs font-bold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ডিভাইস আপলোড
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerUploadTab('url')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      bannerUploadTab === 'url'
                        ? 'bg-white text-gray-900 shadow-2xs font-bold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerUploadTab('presets')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      bannerUploadTab === 'presets'
                        ? 'bg-white text-gray-900 shadow-2xs font-bold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    প্রিসেট গ্যালারি
                  </button>
                </div>
              </div>

              {/* Hidden file input for Banner Image */}
              <input
                type="file"
                ref={bannerFileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleBannerFileSelect(e.target.files);
                  if (e.target) e.target.value = '';
                }}
              />

              {/* TAB 1: Device Image Upload */}
              {bannerUploadTab === 'upload' && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingBanner(true);
                  }}
                  onDragLeave={() => setIsDraggingBanner(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingBanner(false);
                    handleBannerFileSelect(e.dataTransfer.files);
                  }}
                  onClick={() => bannerFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    isDraggingBanner
                      ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-200'
                      : 'border-gray-300 hover:border-indigo-400 bg-gray-50/70 hover:bg-indigo-50/30'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-2xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-xs">
                        ক্লিক করে ডিভাইস থেকে ব্যানার ইমেজ আপলোড করুন
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        JPG, PNG, WEBP ফাইল ড্র্যাগ & ড্রপ করুন (সর্বোচ্চ 8MB)
                      </p>
                    </div>
                    <span className="mt-1 inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 text-gray-700 font-bold text-[11px] rounded-lg shadow-2xs hover:bg-gray-50">
                      <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                      Browse File (ছবি নির্বাচন)
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: Direct Image URL */}
              {bannerUploadTab === 'url' && (
                <div className="space-y-1">
                  <input
                    type="url"
                    value={bannerForm.imageUrl}
                    onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden text-xs font-mono"
                  />
                  <p className="text-[10px] text-gray-400">
                    যেকোনো অনলাইন ইমেজ লিঙ্ক (Unsplash, Imgur, বা CDN) পেস্ট করুন
                  </p>
                </div>
              )}

              {/* TAB 3: Curated Preset Banners */}
              {bannerUploadTab === 'presets' && (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-0.5">
                  {BANNER_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBannerForm({ ...bannerForm, imageUrl: p.url })}
                      className={`relative rounded-lg overflow-hidden border text-left group transition-all aspect-video cursor-pointer ${
                        bannerForm.imageUrl === p.url
                          ? 'ring-2 ring-indigo-600 border-indigo-600 shadow-xs'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-1.5">
                        <span className="text-[9px] font-bold text-white line-clamp-1 drop-shadow-xs">
                          {p.name}
                        </span>
                      </div>
                      {bannerForm.imageUrl === p.url && (
                        <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow-2xs">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Real-time Banner Visual Preview Box */}
              {bannerForm.imageUrl && (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-950 text-white p-3 shadow-inner">
                  <div className="absolute inset-0">
                    <img
                      src={bannerForm.imageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover opacity-60"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
                  </div>

                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="space-y-1 max-w-[70%]">
                      <span className={`inline-block text-[9.5px] font-bold px-2 py-0.5 rounded text-white ${bannerForm.badgeColor || 'bg-rose-600'}`}>
                        {bannerForm.badge || 'Special Offer'}
                      </span>
                      <h4 className="text-xs font-black line-clamp-1 drop-shadow-sm text-white">
                        {bannerForm.title || 'Banner Headline Preview'}
                      </h4>
                      <p className="text-[10px] text-gray-300 line-clamp-1">
                        {bannerForm.subtitle || 'Subtitle description preview'}
                      </p>
                      <span className="inline-block text-[10px] font-bold bg-white text-gray-900 px-2 py-0.5 rounded shadow-xs mt-1">
                        {bannerForm.ctaText || 'Shop Now'} →
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 z-10">
                      <button
                        type="button"
                        onClick={() => bannerFileInputRef.current?.click()}
                        className="px-2.5 py-1 bg-white/90 hover:bg-white text-gray-900 text-[10px] font-bold rounded shadow-xs flex items-center gap-1 cursor-pointer"
                        title="Upload different image"
                      >
                        <Upload className="w-3 h-3 text-indigo-600" />
                        <span>ছবি বদলান</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, imageUrl: '' })}
                        className="px-2.5 py-1 bg-rose-600/90 hover:bg-rose-600 text-white text-[10px] font-bold rounded shadow-xs flex items-center gap-1 cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>রিমুভ</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  required
                  value={bannerForm.ctaText}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                  placeholder="Shop Now"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Button Link</label>
                <input
                  type="text"
                  required
                  value={bannerForm.ctaLink}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaLink: e.target.value })}
                  placeholder="/collections/audio"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsAddBannerOpen(false)}
                className="px-3.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg font-semibold"
              >
                Publish Banner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* In-App Modal: Confirm Delete Single Media */}
      {mediaToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4 text-xs animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-gray-900">ছবিটি ডিলিট করতে চান?</h3>
              <p className="text-gray-500 text-xs">
                আপনি কি নিশ্চিত যে <span className="font-semibold text-gray-800">"{mediaToDelete.name}"</span> মুছে ফেলতে চান? এটি স্থায়ীভাবে বাতিল হবে।
              </p>
            </div>

            {mediaToDelete.url && (
              <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img src={mediaToDelete.url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setMediaToDelete(null)}
                className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={confirmExecuteDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                হ্যাঁ, ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Modal: Confirm Batch Delete Selected Media */}
      {isBatchDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4 text-xs animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-gray-900">একসাথে {selectedMediaIds.length} টি ছবি ডিলিট করবেন?</h3>
              <p className="text-gray-500 text-xs">
                নির্বাচিত {selectedMediaIds.length} টি মিডিয়া ফাইল আপনার স্টোর লাইব্রেরি থেকে স্থায়ীভাবে মুছে ফেলা হবে।
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsBatchDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={confirmExecuteBatchDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                সব মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
