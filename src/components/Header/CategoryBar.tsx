import React, { useState } from 'react';
import { LayoutGrid, Flame, Sparkles, Tag, ChevronDown, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Category } from '../../types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onScrollToFlashSale: () => void;
  onOpenTracking: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onScrollToFlashSale,
  onOpenTracking
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 hidden md:block relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* All Categories Dropdown Menu */}
        <div className="relative">
          <button
            id="all-categories-dropdown-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>সকল ক্যাটাগরি</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mega Dropdown Menu */}
          {dropdownOpen && (
            <div
              onMouseLeave={() => setDropdownOpen(false)}
              className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-b-xl z-50 py-2 divide-y divide-gray-100 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <button
                onClick={() => {
                  onSelectCategory('all');
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${
                  selectedCategory === 'all' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-700'
                }`}
              >
                <span>সব প্রোডাক্ট (All Products)</span>
                <span className="text-[11px] text-gray-400">View all</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.name);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${
                    selectedCategory === cat.name ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-700'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-400">{cat.banglaName}</span>
                  </div>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                    {cat.itemCount}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center Quick Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-4 lg:gap-6 text-xs font-medium text-gray-700">
          <button
            onClick={() => onSelectCategory('all')}
            className={`py-3 hover:text-emerald-600 transition-colors flex items-center gap-1 ${
              selectedCategory === 'all' ? 'text-emerald-600 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            <span>Home</span>
          </button>

          <button
            onClick={onScrollToFlashSale}
            className="py-3 text-amber-600 hover:text-amber-700 font-bold transition-colors flex items-center gap-1.5 animate-pulse shrink-0"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>ফ্ল্যাশ সেল (Flash Deals)</span>
          </button>

          {/* Dynamic Category/Collection Quick Links */}
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`py-3 hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.name ? 'text-emerald-600 font-bold border-b-2 border-emerald-600' : ''
              }`}
              title={cat.name}
            >
              {cat.banglaName || cat.name}
            </button>
          ))}

          <button
            onClick={onOpenTracking}
            className="py-3 text-sky-600 hover:text-sky-700 font-medium transition-colors flex items-center gap-1 shrink-0"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>অর্ডার ট্র্যাকিং</span>
          </button>
        </div>

        {/* Right Badges */}
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-semibold">১০০% ক্যাশ অন ডেলিভারি</span>
          </div>
        </div>

      </div>
    </nav>
  );
};
