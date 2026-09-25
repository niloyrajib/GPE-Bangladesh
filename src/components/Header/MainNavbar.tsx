import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Zap, PhoneCall, X, ArrowRight, Menu, Scale } from 'lucide-react';
import { Product, Category } from '../../types';
import { STORE_SETTINGS } from '../../data/mockData';
import { GpeLogo } from '../GpeLogo';

interface MainNavbarProps {
  categories: Category[];
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  compareCount?: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCompare?: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleMobileMenu: () => void;
  onGoHome: () => void;
}

export const MainNavbar: React.FC<MainNavbarProps> = ({
  categories,
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  cartCount,
  cartTotal,
  wishlistCount,
  compareCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenCompare,
  onSelectProduct,
  onToggleMobileMenu,
  onGoHome
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter products based on search query
  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter(p => {
        const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.banglaName && p.banglaName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        
        if (selectedCategory && selectedCategory !== 'all') {
          return matchesQuery && p.category === selectedCategory;
        }
        return matchesQuery;
      }).slice(0, 5);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Mobile Menu Button + Logo */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo - GPE Bangladesh */}
            <div id="brand-logo">
              <GpeLogo variant="nav" onClick={onGoHome} />
            </div>
          </div>

          {/* Search Bar with Category Selector & Live Dropdown */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <div className="flex w-full rounded-xl border-2 border-emerald-500 overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
              
              {/* Category Dropdown inside Search */}
              <select
                id="search-category-select"
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="bg-gray-50 border-r border-gray-200 text-xs font-semibold text-gray-700 px-3 py-2.5 outline-none cursor-pointer hover:bg-gray-100"
              >
                <option value="all">সকল ক্যাটাগরি (All)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.itemCount})
                  </option>
                ))}
              </select>

              {/* Input */}
              <div className="flex-1 relative flex items-center">
                <input
                  id="main-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder="পণ্য বা মডেল সার্চ করুন (যেমন: T900 Smartwatch, Earbuds, Trimmer...)"
                  className="w-full px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 mr-1 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Button */}
              <button
                id="search-submit-btn"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 flex items-center justify-center font-medium transition-colors"
              >
                <Search className="w-4 h-4 mr-1" />
                <span className="text-xs font-bold">সার্চ</span>
              </button>
            </div>

            {/* Instant Search Results Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden divide-y divide-gray-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 bg-gray-50 text-xs font-semibold text-gray-500 flex justify-between">
                  <span>অনুসন্ধানের ফলাফল ({searchResults.length})</span>
                  <span>সরাসরি দেখতে ক্লিক করুন</span>
                </div>
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="p-2.5 flex items-center gap-3 hover:bg-emerald-50/50 cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate group-hover:text-emerald-600">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {product.banglaName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-emerald-600">
                          ৳{product.price.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-gray-400 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] px-1 py-0.2 bg-emerald-100 text-emerald-700 font-semibold rounded">
                          -{product.discountPercent}%
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 transform group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Hotline Badge */}
            <a
              id="header-phone-box"
              href={`tel:${STORE_SETTINGS.phone}`}
              className="hidden xl:flex items-center gap-2.5 p-2 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="text-[10px] text-gray-500 font-medium">অর্ডার হটলাইন</p>
                <p className="font-bold text-gray-900">{STORE_SETTINGS.phone}</p>
              </div>
            </a>

            {/* Compare Button */}
            {onOpenCompare && (
              <button
                id="header-compare-btn"
                onClick={onOpenCompare}
                className="relative p-2.5 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-gray-50 text-gray-700 hover:text-emerald-600 transition-all cursor-pointer"
                title="পণ্য তুলনা (Product Compare)"
              >
                <Scale className="w-5 h-5" />
                {compareCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {compareCount}
                  </span>
                )}
              </button>
            )}

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-gray-50 text-gray-700 hover:text-emerald-600 transition-all cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4.5 h-4.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] text-slate-400 font-medium">মাই কার্ট</p>
                <p className="text-xs font-bold text-white">৳{cartTotal.toLocaleString()}</p>
              </div>
            </button>
          </div>

        </div>

        {/* Mobile Search Row */}
        <div className="mt-3 md:hidden">
          <div className="flex w-full rounded-lg border border-emerald-500 overflow-hidden bg-white shadow-xs">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য বা মডেল সার্চ করুন..."
              className="flex-1 px-3 py-2 text-xs text-gray-900 outline-none"
            />
            <button className="bg-emerald-600 text-white px-3 py-2 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
