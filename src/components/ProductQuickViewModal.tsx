import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Heart,
  Share2,
  Sliders,
  FileText,
  Phone,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Package,
  BadgeCheck,
  HelpCircle,
  ThumbsUp,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  Bell,
  BellRing,
  Mail,
  Scale
} from 'lucide-react';
import { Product } from '../types';
import { STORE_SETTINGS } from '../data/mockData';
import { GpeLogo } from './GpeLogo';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onFastBuyNow: (product: Product, quantity: number, color?: string, size?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  isCompared?: boolean;
  compareCount?: number;
  onToggleCompare?: (product: Product) => void;
  onOpenCompare?: () => void;
  onSelectCategory?: (category: string) => void;
  onOpenCart?: () => void;
  cartCount?: number;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onFastBuyNow,
  isWishlisted,
  onToggleWishlist,
  isCompared = false,
  compareCount = 0,
  onToggleCompare,
  onOpenCompare,
  onSelectCategory,
  onOpenCart,
  cartCount = 0,
  allProducts = [],
  onSelectProduct
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors && product.colors.length > 0 ? product.colors[0].name : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'warranty' | 'reviews'>('specs');

  // --- Safe Close Handler that ensures document.body scroll is immediately restored ---
  const handleSafeClose = () => {
    document.body.style.overflow = '';
    document.body.style.removeProperty('overflow');
    onClose();
  };

  // --- Image Zoom & Pan State for in-stage lens ---
  const [isZoomHovered, setIsZoomHovered] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zoomMultiplier, setZoomMultiplier] = useState(2.2);

  // --- Fullscreen Deep Inspection Lightbox State ---
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxPos, setLightboxPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  // --- Price Drop Alert Modal State ---
  const [isPriceDropModalOpen, setIsPriceDropModalOpen] = useState(false);
  const [contactType, setContactType] = useState<'phone' | 'email'>('phone');
  const [contactValue, setContactValue] = useState('');
  const [targetPriceChoice, setTargetPriceChoice] = useState<'any' | '10pct'>('any');
  const [priceDropSuccess, setPriceDropSuccess] = useState(false);
  const [priceDropError, setPriceDropError] = useState('');

  const handleClosePriceDropModal = () => {
    setIsPriceDropModalOpen(false);
    setTimeout(() => {
      setPriceDropSuccess(false);
      setContactValue('');
      setPriceDropError('');
      setTargetPriceChoice('any');
    }, 200);
  };

  const handlePriceDropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPriceDropError('');

    if (!contactValue.trim()) {
      setPriceDropError(contactType === 'phone' ? 'অনুগ্রহ করে সচল মোবাইল নম্বর লিখুন' : 'অনুগ্রহ করে সঠিক ইমেইল এড্রেস লিখুন');
      return;
    }

    if (contactType === 'phone') {
      const cleanPhone = contactValue.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 11) {
        setPriceDropError('১১ ডিজিটের সঠিক মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)');
        return;
      }
    } else {
      if (!contactValue.includes('@') || !contactValue.includes('.')) {
        setPriceDropError('অনুগ্রহ করে সঠিক ইমেইল এড্রেস লিখুন');
        return;
      }
    }

    // Save alert to localStorage
    try {
      const existingAlerts = JSON.parse(localStorage.getItem('gpe_price_drop_alerts') || '[]');
      const newAlert = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        currentPrice: product.price,
        contactType,
        contactValue: contactValue.trim(),
        targetPriceChoice,
        createdAt: new Date().toISOString()
      };
      existingAlerts.push(newAlert);
      localStorage.setItem('gpe_price_drop_alerts', JSON.stringify(existingAlerts));
    } catch {
      // storage handling
    }

    setPriceDropSuccess(true);
  };

  // Prevent background body scroll when full screen page is open, and restore cleanly on exit
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow && originalOverflow !== 'hidden' ? originalOverflow : '';
      document.body.style.removeProperty('overflow');
    };
  }, []);

  // Reset scroll and selections when product changes
  useEffect(() => {
    if (!product) return;
    setActiveImageIndex(0);
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    setQuantity(1);
    setIsZoomHovered(false);
    setIsLightboxOpen(false);
    setLightboxScale(1);
    setLightboxPos({ x: 0, y: 0 });
    setIsPriceDropModalOpen(false);
    setPriceDropSuccess(false);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [product?.id]);

  // Handle keyboard events (ESC, Arrow keys, Zoom shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPriceDropModalOpen) {
          handleClosePriceDropModal();
        } else if (isLightboxOpen) {
          setIsLightboxOpen(false);
          setLightboxScale(1);
          setLightboxPos({ x: 0, y: 0 });
        } else {
          handleSafeClose();
        }
      } else if (e.key === 'ArrowRight') {
        if (product && product.images && product.images.length > 1) {
          setActiveImageIndex((prev) => (prev + 1) % product.images.length);
          setLightboxPos({ x: 0, y: 0 });
        }
      } else if (e.key === 'ArrowLeft') {
        if (product && product.images && product.images.length > 1) {
          setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
          setLightboxPos({ x: 0, y: 0 });
        }
      } else if (isLightboxOpen) {
        if (e.key === '+' || e.key === '=') {
          setLightboxScale((s) => Math.min(4, +(s + 0.5).toFixed(1)));
        } else if (e.key === '-') {
          setLightboxScale((s) => {
            const next = Math.max(1, +(s - 0.5).toFixed(1));
            if (next === 1) setLightboxPos({ x: 0, y: 0 });
            return next;
          });
        } else if (e.key === '0') {
          setLightboxScale(1);
          setLightboxPos({ x: 0, y: 0 });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isLightboxOpen, isPriceDropModalOpen, product?.images?.length]);

  // In-stage mouse coordinate tracker for magnifying lens
  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  if (!product) return null;

  // Lightbox Zoom Controls
  const handleZoomIn = () => {
    setLightboxScale((s) => Math.min(4, +(s + 0.5).toFixed(1)));
  };

  const handleZoomOut = () => {
    setLightboxScale((s) => {
      const next = Math.max(1, +(s - 0.5).toFixed(1));
      if (next === 1) setLightboxPos({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setLightboxScale(1);
    setLightboxPos({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setLightboxScale((s) => Math.min(4, +(s + 0.25).toFixed(2)));
    } else {
      setLightboxScale((s) => {
        const next = Math.max(1, +(s - 0.25).toFixed(2));
        if (next === 1) setLightboxPos({ x: 0, y: 0 });
        return next;
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (lightboxScale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - lightboxPos.x, y: e.clientY - lightboxPos.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && lightboxScale > 1) {
      setLightboxPos({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (lightboxScale > 1) {
      handleResetZoom();
    } else {
      setLightboxScale(2.5);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && lightboxScale > 1) {
      setTouchStart({
        x: e.touches[0].clientX - lightboxPos.x,
        y: e.touches[0].clientY - lightboxPos.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart && e.touches.length === 1 && lightboxScale > 1) {
      setLightboxPos({
        x: e.touches[0].clientX - touchStart.x,
        y: e.touches[0].clientY - touchStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const savings = Math.max(0, product.originalPrice - product.price);

  // Related products from same category, with intelligent fallback to guarantee products
  const relatedProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    const sameCategory = allProducts.filter((p) => p.category === product.category && p.id !== product.id);
    if (sameCategory.length >= 4) {
      return sameCategory.slice(0, 4);
    }
    const others = allProducts.filter((p) => p.id !== product.id && !sameCategory.some((sc) => sc.id === p.id));
    return [...sameCategory, ...others].slice(0, 4);
  }, [allProducts, product.category, product.id]);

  return (
    <div
      ref={containerRef}
      id="fullscreen-product-page"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#f8fafc] text-slate-900 flex flex-col font-sans select-text animate-in fade-in duration-200"
    >
      {/* 1. STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Back to Store Button & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="product-back-btn"
              type="button"
              onClick={handleSafeClose}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer group border border-slate-200/80"
              title="শপিংয়ে ফিরে যান (Go back to store)"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 transition-transform group-hover:-translate-x-1" />
              <span>পেছনে যান (Back)</span>
            </button>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <div className="hidden sm:block">
              <GpeLogo variant="default" />
            </div>
          </div>

          {/* Middle: Breadcrumbs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium truncate max-w-md" aria-label="Breadcrumb">
            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                handleSafeClose();
              }}
              className="hover:text-emerald-600 cursor-pointer"
            >
              Home
            </button>
            <span className="text-slate-300">/</span>
            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory(product.category);
                handleSafeClose();
              }}
              className="hover:text-emerald-600 cursor-pointer text-slate-700 font-semibold"
            >
              {product.category}
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          {/* Right: Quick Utility Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist toggle */}
            <button
              id="product-wishlist-btn"
              type="button"
              onClick={() => onToggleWishlist(product)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isWishlisted
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
              }`}
              title={isWishlisted ? 'উইশলিস্ট থেকে সরান' : 'উইশলিস্টে যুক্ত করুন'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-emerald-600 text-emerald-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{isWishlisted ? 'সংরক্ষিত' : 'উইশলিস্ট'}</span>
            </button>

            {/* Share */}
            <button
              id="product-share-btn"
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="প্রোডাক্ট লিংক শেয়ার করুন"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">{copiedLink ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
            </button>

            {/* Compare option instead of Cart (কার্টের পরিবর্তে এখানে তুলনা অপশন) */}
            {onToggleCompare && (
              <button
                id="product-compare-btn"
                type="button"
                onClick={() => onToggleCompare(product)}
                className={`p-2 sm:px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                  isCompared
                    ? 'border-rose-400 bg-rose-50 text-rose-700 hover:bg-rose-100 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-rose-600'
                }`}
                title={
                  isCompared
                    ? 'তুলনা তালিকায় যুক্ত আছে (ক্লিক করে বাদ দিন)'
                    : 'পণ্যটি তুলনা তালিকায় যুক্ত করুন'
                }
              >
                <Scale className={`w-4 h-4 ${isCompared ? 'text-rose-600' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">
                  {isCompared ? 'তুলনায় যুক্ত' : 'তুলনা'}
                </span>
                {compareCount > 0 && (
                  <span
                    className={`w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center -ml-0.5 ${
                      isCompared ? 'bg-rose-600' : 'bg-slate-800'
                    }`}
                  >
                    {compareCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Open Compare Modal Button if items are selected */}
            {compareCount > 0 && onOpenCompare && (
              <button
                id="product-open-compare-btn"
                type="button"
                onClick={onOpenCompare}
                className="hidden md:flex p-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="তুলনা পেজ খুলুন"
              >
                <Scale className="w-3.5 h-3.5 text-rose-400" />
                <span>তুলনা দেখুন ({compareCount})</span>
              </button>
            )}

            {/* Close (X) button */}
            <button
              id="product-close-btn"
              type="button"
              onClick={handleSafeClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer ml-1"
              aria-label="Close Product Page"
              title="বন্ধ করুন (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN FULL SCREEN PRODUCT CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Mobile/Tablet Breadcrumb */}
        <div className="flex lg:hidden items-center justify-between gap-2 text-xs text-slate-500 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-1.5 truncate">
            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                handleSafeClose();
              }}
              className="hover:underline text-emerald-600 font-medium"
            >
              Home
            </button>
            <span>›</span>
            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory(product.category);
                handleSafeClose();
              }}
              className="hover:underline text-emerald-600 font-semibold"
            >
              {product.category}
            </button>
          </div>
          {product.sku && (
            <span className="font-mono text-[11px] text-slate-400 shrink-0">
              SKU: {product.sku}
            </span>
          )}
        </div>

        {/* HERO SECTION: IMAGES & PURCHASE BOX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: PRODUCT IMAGES & INTERACTIVE ZOOM (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main Stage Image with Interactive Pan Zoom */}
            <div
              id="product-image-zoom-stage"
              className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group aspect-square flex items-center justify-center p-4 cursor-crosshair select-none"
              onMouseEnter={() => setIsZoomHovered(true)}
              onMouseLeave={() => setIsZoomHovered(false)}
              onMouseMove={handleStageMouseMove}
              onClick={() => setIsLightboxOpen(true)}
              title="বিস্তারিত দেখতে মাউস হোভার করুন বা ফুলস্ক্রিন দেখতে ক্লিক করুন"
            >
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomHovered ? `scale(${zoomMultiplier})` : 'scale(1)',
                  transition: isZoomHovered ? 'transform 0.08s ease-out' : 'transform 0.25s ease-out'
                }}
                className="w-full h-full object-contain pointer-events-none select-none will-change-transform"
              />

              {/* Discount Tag */}
              {product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-md flex items-center gap-1 pointer-events-none">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>-{product.discountPercent}% OFF</span>
                </div>
              )}

              {/* Quick Fullscreen Zoom Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute top-4 right-4 z-10 px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-xs font-bold shadow-md border border-slate-200 backdrop-blur-xs flex items-center gap-1.5 transition-all opacity-90 group-hover:opacity-100 hover:scale-105 cursor-pointer"
                title="ফুলস্ক্রিন জুম মোড খুলুন"
              >
                <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">ফুলস্ক্রিন জুম</span>
              </button>

              {/* Zoom multiplier toggle pill on hover */}
              {isZoomHovered && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-4 left-4 z-10 flex items-center gap-1 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-[11px] font-bold shadow-lg animate-in fade-in duration-150"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>জুম:</span>
                  <button
                    type="button"
                    onClick={() => setZoomMultiplier(2)}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      zoomMultiplier === 2 ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    2x
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomMultiplier(3)}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      zoomMultiplier === 3 ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    3x
                  </button>
                </div>
              )}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900/75 text-white backdrop-blur-sm pointer-events-none">
                  {activeImageIndex + 1} / {product.images.length}
                </div>
              )}

              {/* Helpful inspection hint banner */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-slate-900/80 text-white text-[10px] font-medium px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                <ZoomIn className="w-3 h-3 text-emerald-400" />
                <span>মাউস নাড়িয়ে পণ্যের সূক্ষ্ম অংশ পরীক্ষা করুন • ক্লিকে ফুলস্ক্রিন</span>
              </div>
            </div>

            {/* Thumbnails Strip */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all p-1 bg-white cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-200 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain rounded-lg" />
                  </button>
                ))}
              </div>
            )}

            {/* Official Delivery & Service Trust Badges */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ডেলিভারি ও কাস্টমার সার্ভিস নিশ্চয়তা</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">এক্সপ্রেস ডেলিভারি</p>
                    <p className="text-[11px] text-slate-500">ঢাকা: ৬০৳ | ঢাকার বাইরে: ১২০৳</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <RotateCcw className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">৭ দিনের রিপ্লেসমেন্ট</p>
                    <p className="text-[11px] text-slate-500">ত্রুটি থাকলে সহজে রিটার্ন বা বদল</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <BadgeCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">১০০% আসল পণ্য</p>
                    <p className="text-[11px] text-slate-500">ওয়ারেন্টি: {product.warranty || 'অফিসিয়াল'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Package className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">ক্যাশ অন ডেলিভারি</p>
                    <p className="text-[11px] text-slate-500">অরিজিনাল সকল প্রোডাক্ট ডেলিভারির সময় চেক করে দেখে মূল্য পরিশোধ করুন।</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: PRODUCT INFO & ORDER FORM (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & Metadata */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {product.category}
                </span>

                {product.sku && (
                  <span className="font-mono text-xs text-slate-400">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                {product.name}
              </h1>

              {product.banglaName && (
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  {product.banglaName}
                </p>
              )}

              {/* Rating & Stock Status Row */}
              <div className="flex items-center gap-3 pt-2 pb-3 border-b border-slate-200 flex-wrap">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-800 ml-1.5">
                    {product.rating} ({product.reviewCount || 128} কাস্টমার রিভিউ)
                  </span>
                </div>

                <div className="h-4 w-px bg-slate-200" />

                <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  স্টকে আছে ({product.stockCount} টি)
                </span>
              </div>
            </div>

            {/* PRICING CARD (STITCH EMERALD THEME) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-white border border-emerald-200/80 shadow-xs space-y-3">
              <div className="flex items-baseline gap-3 sm:gap-4 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono tracking-tight">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base sm:text-lg text-slate-400 line-through font-mono">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-emerald-600 text-white shadow-xs">
                    -{product.discountPercent}% ছাড়
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full ml-auto">
                    আপনার সাশ্রয় ৳{savings.toLocaleString()}!
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-emerald-100/80 flex-wrap">
                <p className="text-xs text-slate-500">
                  ভ্যাট ও ট্যাক্স অন্তর্ভুক্ত। কোনো লুকানো চার্জ নেই।
                </p>

                {/* Notify me when price drops button */}
                <button
                  id="notify-price-drop-btn"
                  type="button"
                  onClick={() => setIsPriceDropModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
                  title="এই পণ্যের দাম কমলে সাথে সাথে নোটিফিকেশন পেতে ক্লিক করুন"
                >
                  <BellRing className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
                  <span>মূল্য কমলে নোটিফিকেশন চান? (Notify Me)</span>
                </button>
              </div>
            </div>

            {/* COLOR VARIANT SELECTOR */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  কালার সিলেক্ট করুন (Color):{' '}
                  <span className="text-emerald-700 font-black">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SIZE SELECTOR IF AVAILABLE */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  সাইজ নির্বাচন করুন: <span className="text-emerald-700 font-black">{selectedSize}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY SELECTOR & TOTAL CALCULATION */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 block">পরিমাণ (Quantity):</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-base font-black text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-black text-slate-900 min-w-12 text-center bg-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="px-3.5 py-1.5 text-base font-black text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">সর্বমোট মূল্য:</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">
                  ৳{(product.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* PRIMARY PURCHASE ACTIONS */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Direct Buy Now / Fast Checkout */}
                <button
                  id="fullscreen-order-now-btn"
                  type="button"
                  onClick={() => {
                    onFastBuyNow(product, quantity, selectedColor, selectedSize);
                    handleSafeClose();
                  }}
                  className="flex-1 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm sm:text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-white text-white" />
                  <span>সরাসরি অর্ডার করুন (ক্যাশ অন ডেলিভারি)</span>
                </button>

                {/* Add to Cart */}
                <button
                  id="fullscreen-add-to-cart-btn"
                  type="button"
                  onClick={() => {
                    onAddToCart(product, quantity, selectedColor, selectedSize);
                  }}
                  className="py-4 px-6 rounded-xl border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 active:scale-[0.99] text-sm sm:text-base font-black flex items-center justify-center gap-2 transition-all cursor-pointer bg-white"
                >
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <span>কার্টে যোগ করুন</span>
                </button>
              </div>

              {/* Compare Button on Product Details Area */}
              {onToggleCompare && (
                <button
                  id="product-body-compare-btn"
                  type="button"
                  onClick={() => onToggleCompare(product)}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCompared
                      ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Scale className="w-4 h-4 text-rose-500" />
                  <span>
                    {isCompared
                      ? '✓ এই পণ্যটি তুলনা তালিকায় যুক্ত আছে (বাদ দিতে ক্লিক করুন)'
                      : '+ অন্য পণ্যের সাথে স্পেসিফিকেশন তুলনা করুন'}
                  </span>
                  {compareCount > 0 && (
                    <span className="text-xs text-slate-500 font-normal ml-1">
                      ({compareCount}/৪টি পণ্য)
                    </span>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-medium text-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>অরিজিনাল সকল প্রোডাক্ট ডেলিভারির সময় চেক করে দেখে মূল্য পরিশোধ করুন।</span>
              </div>
            </div>

            {/* HOTLINE CALLOUT CARD */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <p className="text-xs text-slate-300 font-medium">ফোনে বা WhatsApp এ সরাসরি অর্ডার করতে চান?</p>
                <div className="flex items-center gap-2 text-sm sm:text-base font-black text-emerald-400">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${STORE_SETTINGS.phone}`} className="hover:underline">
                    {STORE_SETTINGS.phone}
                  </a>
                </div>
              </div>

              {STORE_SETTINGS.whatsapp && (
                <a
                  href={`https://wa.me/${STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `হ্যালো, আমি "${product.name}" প্রোডাক্টটি অর্ডার করতে চাই।`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp এ অর্ডার</span>
                </a>
              )}
            </div>

          </div>

        </div>

        {/* 3. TABS SECTION: SPECIFICATIONS, DESCRIPTION, WARRANTY, REVIEWS */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mt-10">
          
          {/* Tab Header Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 sm:px-6 pt-2 overflow-x-auto scrollbar-none bg-slate-50/50">
            <button
              id="tab-specs"
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>স্পেসিফিকেশন (Specifications)</span>
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-mono">
                  {Object.keys(product.specifications).length}
                </span>
              )}
            </button>

            <button
              id="tab-desc"
              type="button"
              onClick={() => setActiveTab('desc')}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'desc'
                  ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>বিস্তারিত বিবরণ ও ফিচার্স</span>
            </button>

            <button
              id="tab-warranty"
              type="button"
              onClick={() => setActiveTab('warranty')}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'warranty'
                  ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ওয়ারেন্টি ও পলিসি</span>
            </button>

            <button
              id="tab-reviews"
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>কাস্টমার রিভিউ ({product.reviewCount || 128})</span>
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-6 sm:p-8">
            
            {/* 1. SPECIFICATIONS TAB */}
            {activeTab === 'specs' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-600" />
                  <span>প্রোডাক্ট স্পেসিফিকেশন ও টেকনিক্যাল তথ্য</span>
                </h3>

                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <tbody className="divide-y divide-slate-100">
                        {Object.entries(product.specifications).map(([key, val], idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                            <td className="py-3 px-4 sm:px-6 font-bold text-slate-900 w-1/3 border-r border-slate-100">
                              {key}
                            </td>
                            <td className="py-3 px-4 sm:px-6 text-slate-700 font-medium">
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-sm">এই পণ্যের জন্য আলাদা কোনো টেকনিক্যাল টেবিল দেওয়া নেই। মূল ফিচার্স নিচের বিবরণে দেখুন।</p>
                  </div>
                )}
              </div>
            )}

            {/* 2. DESCRIPTION & FEATURES TAB */}
            {activeTab === 'desc' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-2">প্রোডাক্ট পরিচিতি ও বর্ণনা:</h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {product.description || product.banglaDescription || product.shortDescription}
                  </p>
                </div>

                {/* Features Highlights */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900">মূল আকর্ষণীয় ফিচার ও সুবিধাসমূহ:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-500">সম্পর্কিত ট্যাগসমূহ:</span>
                    {product.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. WARRANTY & POLICIES TAB */}
            {activeTab === 'warranty' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>ওয়ারেন্টি কভারেজ</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 font-semibold">
                      {product.warranty || '৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি'}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      পণ্যের কোনো টেকনিক্যাল সমস্যা হলে আমাদের হটলাইনে যোগাযোগ করুন। দ্রুততম সময়ে সার্ভিসিং বা রিপ্লেসমেন্ট সুবিধা দেওয়া হবে।
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-cyan-200 bg-cyan-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
                      <RotateCcw className="w-5 h-5 text-cyan-600" />
                      <span>৭ দিনের সহজ রিটার্ন</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 font-semibold">
                      ইনস্ট্যান্ট রিপ্লেসমেন্ট ও এক্সচেঞ্জ
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      পণ্য হাতে পাওয়ার পর আনবক্সিং ভিডিও করে রাখবেন। কোনো ত্রুটি বা অমিল থাকলে বিনা খরচে পরিবর্তন করে দেওয়া হবে।
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                      <Truck className="w-5 h-5 text-amber-600" />
                      <span>ক্যাশ অন ডেলিভারি</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 font-semibold">
                      ঢাকা: ৬০৳ | ঢাকার বাইরে: ১২০৳
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      ডেলিভারি ম্যানের উপস্থিতিতে পণ্য দেখে মূল্য পরিশোধ করার সুবিধা। নিরাপদ এবং নির্ভরযোগ্য কেনাকাটা।
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* 4. REVIEWS & RATINGS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-center sm:text-left space-y-1">
                    <div className="text-4xl sm:text-5xl font-black text-slate-900 font-mono">
                      {product.rating}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {product.reviewCount || 128} জন যাচাইকৃত কাস্টমারের মতামত
                    </p>
                  </div>

                  <div className="h-16 w-px bg-slate-200 hidden sm:block" />

                  <div className="flex-1 space-y-1.5 w-full text-xs">
                    {[
                      { star: 5, pct: '88%' },
                      { star: 4, pct: '9%' },
                      { star: 3, pct: '2%' },
                      { star: 2, pct: '1%' },
                      { star: 1, pct: '0%' }
                    ].map((row) => (
                      <div key={row.star} className="flex items-center gap-2">
                        <span className="w-12 text-slate-600 font-semibold">{row.star} স্টার</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: row.pct }} />
                        </div>
                        <span className="w-10 text-right text-slate-400 font-mono">{row.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Verified Reviews */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">সাম্প্রতিক কাস্টমার মতামত:</h4>
                  
                  {[
                    {
                      name: 'রাশেদুল করিম',
                      rating: 5,
                      date: '২ দিন আগে',
                      comment: 'অসাধারণ পণ্য! ছবিতে যেমন দেখেছি হুবহু তেমনই পেয়েছি। ডেলিভারি মাত্র ২৪ ঘণ্টার মধ্যে পেয়েছি।'
                    },
                    {
                      name: 'তানভীর আহমেদ',
                      rating: 5,
                      date: '১ সপ্তাহ আগে',
                      comment: 'খুব ভালো কোয়ালিটি এবং প্যাকিং অত্যন্ত মজবুত ছিল। সেলারের ব্যবহার ও সার্ভিস দারুণ।'
                    }
                  ].map((rev, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                            <span className="ml-2 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                              যাচাইকৃত ক্রেতা
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </section>

        {/* 4. RELATED PRODUCTS IN FULL SCREEN VIEW */}
        {relatedProducts.length > 0 && onSelectProduct && (
          <section className="mt-12 space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                সম্পর্কিত অন্যান্য পণ্যসমূহ (Related Products)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                এই ক্যাটাগরির আরও কিছু জনপ্রিয় ও ট্রেন্ডিং পণ্য
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectProduct(rel);
                    if (containerRef.current) {
                      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all p-3 sm:p-4 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 p-3 relative flex items-center justify-center">
                      <img
                        src={rel.images[0]}
                        alt={rel.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      {rel.discountPercent > 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-black bg-rose-600 text-white shadow-xs">
                          -{rel.discountPercent}%
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                      {rel.name}
                    </h4>

                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-black text-rose-600 font-mono">
                        ৳{rel.price.toLocaleString()}
                      </span>
                      {rel.originalPrice > rel.price && (
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ৳{rel.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-1">
                    <button
                      type="button"
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-700 text-slate-800 font-bold text-xs sm:text-sm transition-colors text-center cursor-pointer"
                    >
                      বিস্তারিত দেখুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* 5. STICKY MOBILE BOTTOM ORDER BAR */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block">মোট মূল্য:</span>
          <span className="text-base font-black text-emerald-600 font-mono">
            ৳{(product.price * quantity).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            type="button"
            onClick={() => onAddToCart(product, quantity, selectedColor, selectedSize)}
            className="py-2.5 px-3 rounded-xl border border-emerald-600 text-emerald-700 font-bold text-xs flex items-center gap-1.5 bg-emerald-50 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>কার্ট</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onFastBuyNow(product, quantity, selectedColor, selectedSize);
              handleSafeClose();
            }}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>অর্ডার করুন</span>
          </button>
        </div>
      </div>

      {/* 6. FULLSCREEN HIGH-RESOLUTION INSPECTION LIGHTBOX */}
      {isLightboxOpen && (
        <div
          id="product-lightbox-modal"
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200 select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Lightbox Header Bar */}
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/10 text-white bg-black/40 shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setLightboxScale(1);
                  setLightboxPos({ x: 0, y: 0 });
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">ফিরে যান (Esc)</span>
              </button>
              <div className="h-5 w-px bg-white/20 hidden sm:block" />
              <div>
                <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {product.name}
                </h3>
                <p className="text-[11px] text-slate-400">
                  ছবি {activeImageIndex + 1} / {product.images.length} • গ্যাজেট ইন্সপেকশন মোড
                </p>
              </div>
            </div>

            {/* Center / Right: Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={lightboxScale <= 1}
                  className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors cursor-pointer"
                  title="জুম আউট (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-mono font-bold text-emerald-400 min-w-12 text-center">
                  {Math.round(lightboxScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={lightboxScale >= 4}
                  className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors cursor-pointer"
                  title="জুম ইন (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-1 ml-1 rounded-lg hover:bg-white/20 text-[11px] font-bold text-slate-300 transition-colors cursor-pointer"
                  title="রিসেট (0)"
                >
                  রিসেট
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setLightboxScale(1);
                  setLightboxPos({ x: 0, y: 0 });
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer ml-2"
                title="বন্ধ করুন (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Stage Canvas */}
          <div
            className="flex-1 relative overflow-hidden flex items-center justify-center p-4"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onDoubleClick={handleDoubleClick}
            style={{
              cursor: lightboxScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
            }}
          >
            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
                    handleResetZoom();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-emerald-600 text-white transition-all shadow-xl cursor-pointer"
                  title="আগের ছবি (←)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
                    handleResetZoom();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-emerald-600 text-white transition-all shadow-xl cursor-pointer"
                  title="পরের ছবি (→)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* The High-Resolution Zoomable Image */}
            <div
              className="w-full h-full flex items-center justify-center will-change-transform"
              style={{
                transform: `translate(${lightboxPos.x}px, ${lightboxPos.y}px) scale(${lightboxScale})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
              }}
            >
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="max-h-[80vh] max-w-[86vw] object-contain pointer-events-none select-none rounded-lg shadow-2xl"
                draggable={false}
              />
            </div>

            {/* Helper text at bottom */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/75 text-slate-300 text-xs px-4 py-1.5 rounded-full pointer-events-none backdrop-blur-xs flex items-center gap-2 border border-white/10 shadow-lg">
              <Move className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {lightboxScale > 1
                  ? 'মাউস চেপে ধরে ড্র্যাগ করে প্যান করুন • রিসেট করতে ডাবল ক্লিক করুন'
                  : 'মাউস হুইল ঘুরিয়ে বা ডাবল ক্লিক করে জুম ইন করুন'}
              </span>
            </div>
          </div>

          {/* Lightbox Bottom Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="h-20 bg-black/60 border-t border-white/10 px-4 flex items-center justify-center gap-3 overflow-x-auto shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(idx);
                    handleResetZoom();
                  }}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 p-1 bg-white/10 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105'
                      : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. PRICE DROP ALERT MODAL */}
      {isPriceDropModalOpen && (
        <div
          id="price-drop-modal-overlay"
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={handleClosePriceDropModal}
        >
          <div
            id="price-drop-modal"
            className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClosePriceDropModal}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>

            {!priceDropSuccess ? (
              <form onSubmit={handlePriceDropSubmit} className="space-y-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      মূল্য কমার নোটিফিকেশন অ্যালার্ট
                    </h3>
                    <p className="text-xs text-slate-500">
                      Notify me when price drops
                    </p>
                  </div>
                </div>

                {/* Product Summary Mini Card */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <img
                    src={product.images[0]}
                    alt=""
                    className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200 shrink-0 p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs font-bold text-emerald-600 font-mono">
                      বর্তমান মূল্য: ৳{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Contact Method Selector (Phone vs Email) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    কোথায় নোটিফিকেশন পেতে চান?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setContactType('phone');
                        setPriceDropError('');
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        contactType === 'phone'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>মোবাইল নম্বর (SMS)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setContactType('email');
                        setPriceDropError('');
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        contactType === 'email'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>ইমেইল এড্রেস</span>
                    </button>
                  </div>
                </div>

                {/* Contact Input Field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {contactType === 'phone' ? 'আপনার সচল মোবাইল নম্বর:' : 'আপনার ইমেইল এড্রেস:'}
                  </label>
                  <div className="relative">
                    <input
                      type={contactType === 'phone' ? 'tel' : 'email'}
                      value={contactValue}
                      onChange={(e) => {
                        setContactValue(e.target.value);
                        if (priceDropError) setPriceDropError('');
                      }}
                      placeholder={contactType === 'phone' ? '017XXXXXXXX' : 'example@gmail.com'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm text-slate-900 outline-none transition-all"
                      autoFocus
                    />
                    {contactType === 'phone' ? (
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                    ) : (
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                    )}
                  </div>
                  {priceDropError && (
                    <p className="text-xs text-rose-600 font-medium pt-0.5">
                      {priceDropError}
                    </p>
                  )}
                </div>

                {/* Price condition radio options */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    কখন অ্যালার্ট পেতে চান?
                  </label>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 border border-slate-200 cursor-pointer">
                      <input
                        type="radio"
                        name="targetChoice"
                        checked={targetPriceChoice === 'any'}
                        onChange={() => setTargetPriceChoice('any')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium">যেকোনো পরিমাণ মূল্য কমলেই জানান</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 border border-slate-200 cursor-pointer">
                      <input
                        type="radio"
                        name="targetChoice"
                        checked={targetPriceChoice === '10pct'}
                        onChange={() => setTargetPriceChoice('10pct')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium">১০% বা তার বেশি মূল্য ছাড় হলে জানান</span>
                    </label>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                  >
                    <BellRing className="w-4 h-4" />
                    <span>নোটিফিকেশন অ্যালার্ট সেট করুন</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  আমরা কোনো স্প্যাম পাঠাই না। কেবল এই প্রোডাক্টের দাম কমলে মেসেজ পাবেন।
                </p>
              </form>
            ) : (
              /* Success Confirmation */
              <div className="text-center py-4 space-y-4 animate-in fade-in duration-150">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-slate-900">
                    অ্যালার্ট সফলভাবে সেট করা হয়েছে!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                    ধন্যবাদ! <span className="font-bold text-slate-800">"{product.name}"</span> এর দাম কমার সাথে সাথে <span className="font-bold text-emerald-700">{contactValue}</span> এ নোটিফিকেশন পাঠিয়ে দেওয়া হবে।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClosePriceDropModal}
                  className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  ঠিক আছে (Done)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
