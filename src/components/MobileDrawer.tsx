import React from 'react';
import { X, Flame, Truck, Phone, MessageCircle, UserCheck, LayoutGrid, ChevronRight, Zap, Scale } from 'lucide-react';
import { Category } from '../types';
import { STORE_SETTINGS } from '../data/mockData';
import { GpeLogo } from './GpeLogo';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSelectCategory: (cat: string) => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  onScrollToFlash: () => void;
  compareCount?: number;
  onOpenCompare?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  onSelectCategory,
  onOpenTracking,
  onOpenAdmin,
  onScrollToFlash,
  compareCount = 0,
  onOpenCompare
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-start">
      <div
        className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <GpeLogo variant="footer" isDarkBg={true} />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
          
          <div className="space-y-1">
            <button
              onClick={() => {
                onScrollToFlash();
                onClose();
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>ফ্ল্যাশ ডিলস (Flash Deals)</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onOpenTracking();
                onClose();
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-gray-100 text-slate-800 text-xs font-semibold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600" />
                <span>অর্ডার ট্র্যাক করুন (Track Order)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {onOpenCompare && (
              <button
                onClick={() => {
                  onOpenCompare();
                  onClose();
                }}
                className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 text-xs font-semibold flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>পণ্য তুলনা ({compareCount} টি)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="pt-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-3">
              সকল ক্যাটাগরি
            </h4>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onClose();
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-gray-800 hover:bg-gray-50 flex items-center justify-between"
              >
                <span>সব প্রোডাক্ট (All Products)</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCategory(c.name);
                    onClose();
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between"
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] text-gray-400">{c.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
          <a
            href={`tel:${STORE_SETTINGS.phone}`}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>কল করুন: {STORE_SETTINGS.phone}</span>
          </a>

          <button
            onClick={() => {
              onOpenAdmin();
              onClose();
            }}
            className="w-full py-2 px-3 rounded-xl border border-emerald-300 text-emerald-700 bg-emerald-50 text-[11px] font-bold flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Store Admin Panel</span>
          </button>
        </div>

      </div>
    </div>
  );
};
