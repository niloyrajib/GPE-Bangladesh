import React from 'react';
import { X, Trash2, Heart, ShoppingCart, Zap } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onFastBuyNow: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onFastBuyNow
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-rose-600 text-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white" />
            <h2 className="text-sm font-bold tracking-wide">
              পছন্দের তালিকা / উইশলিস্ট ({wishlist.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mb-3">
                <Heart className="w-8 h-8" />
              </div>
              <p className="text-base font-bold text-gray-800">উইশলিস্ট খালি রয়েছে</p>
              <p className="text-xs text-gray-500 mt-1">
                যেকোনো পণ্যের হৃদপিণ্ড (Heart) আইকনে চাপ দিলে তা এখানে জমা থাকবে।
              </p>
            </div>
          ) : (
            wishlist.map((prod) => (
              <div key={prod.id} className="py-3 flex gap-3 items-center group">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-gray-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{prod.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-rose-600">
                      ৳{prod.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-gray-400 line-through">
                      ৳{prod.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>কার্ট</span>
                    </button>
                    <button
                      onClick={() => {
                        onFastBuyNow(prod);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 fill-white" />
                      <span>অর্ডার</span>
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(prod.id)}
                      className="text-gray-400 hover:text-rose-600 p-1 ml-auto"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
