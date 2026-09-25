import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface CompareFloatingBarProps {
  compareProducts: Product[];
  onOpenCompareModal: () => void;
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({
  compareProducts,
  onOpenCompareModal,
  onRemoveProduct,
  onClearAll
}) => {
  if (compareProducts.length === 0) return null;

  return (
    <div
      id="compare-floating-dock"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[55] w-[95%] max-w-2xl bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300"
    >
      {/* Product Thumbnails */}
      <div className="flex items-center gap-2 overflow-x-auto py-0.5 max-w-[55%] sm:max-w-[65%]">
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-rose-400 pl-1 mr-1 shrink-0">
          <Scale className="w-4 h-4" />
          <span>তুলনা ({compareProducts.length}/4)</span>
        </div>

        {compareProducts.map((product) => (
          <div
            key={product.id}
            className="relative group shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center p-0.5"
            title={product.name}
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
            {/* Quick remove cross */}
            <button
              id={`dock-remove-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveProduct(product.id);
              }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-md transition-transform transform scale-90 group-hover:scale-100 cursor-pointer"
              title="বাদ দিন"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Empty slots indicator up to 4 */}
        {Array.from({ length: Math.max(0, 4 - compareProducts.length) }).map((_, idx) => (
          <div
            key={idx}
            className="hidden md:flex shrink-0 w-11 h-11 rounded-xl border border-dashed border-slate-700 items-center justify-center text-[10px] text-slate-500 font-medium"
          >
            + পণ্য
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          id="compare-dock-clear-btn"
          onClick={onClearAll}
          className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1.5 transition-colors cursor-pointer hidden sm:block"
        >
          মুছুন
        </button>

        <button
          id="compare-dock-open-btn"
          onClick={onOpenCompareModal}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/30 transition-all cursor-pointer"
        >
          <span>তুলনা দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
