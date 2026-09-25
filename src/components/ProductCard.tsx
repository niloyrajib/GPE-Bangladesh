import React from 'react';
import { ShoppingCart, Zap, Star, Heart, Eye, Check, Scale } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onFastBuyNow: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectCategory?: (category: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onFastBuyNow,
  isWishlisted,
  onToggleWishlist,
  onSelectCategory,
  isCompared = false,
  onToggleCompare
}) => {
  const savings = product.originalPrice - product.price;

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col group relative ${
      isCompared ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-md' : 'border-gray-200 hover:shadow-xl'
    }`}>
      
      {/* Top Floating Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-rose-600 text-white shadow-xs">
          -{product.discountPercent}%
        </span>
        {product.badge && (
          <span className="px-2 py-0.5 rounded-md text-[9.5px] font-extrabold bg-slate-900 text-amber-400 shadow-xs">
            {product.badge}
          </span>
        )}
        {isCompared && (
          <span className="px-2 py-0.5 rounded-md text-[9.5px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 shadow-xs">
            <Scale className="w-2.5 h-2.5" /> তুলনা যুক্ত
          </span>
        )}
      </div>

      {/* Wishlist, Compare & Quick View Buttons */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 hover:bg-white text-gray-700 hover:text-rose-600'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {onToggleCompare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
              isCompared
                ? 'bg-rose-600 text-white'
                : 'bg-white/90 hover:bg-white text-gray-700 hover:text-rose-600 opacity-90 group-hover:opacity-100'
            }`}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
          >
            <Scale className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product);
          }}
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-rose-600 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image with Enhanced Hover-Zoom */}
      <div
        onClick={() => onSelectProduct(product)}
        className="w-full h-48 bg-gray-50 overflow-hidden cursor-pointer relative"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform"
          loading="lazy"
        />
        {/* Subtle hover overlay for contrast and depth */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Breadcrumb */}
          <div className="flex items-center gap-1 text-[11px] text-sky-600 font-medium mb-1 truncate">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectCategory) onSelectCategory('all');
              }}
              className="text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
            >
              Home
            </button>
            <span className="text-gray-400 select-none">›</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectCategory) onSelectCategory(product.category);
              }}
              className="text-sky-600 hover:text-sky-800 hover:underline font-semibold uppercase tracking-wider truncate cursor-pointer"
              title={product.category}
            >
              {product.category}
            </button>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mt-1 hover:text-rose-600 cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating and Stock */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold ml-1 text-gray-800">{product.rating}</span>
            </div>
            <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
            <span className="text-[10.5px] ml-auto text-emerald-600 font-medium flex items-center gap-0.5">
              <Check className="w-3 h-3 text-emerald-600" />
              ইন স্টক
            </span>
          </div>

          {/* Color preview dots if any */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[10px] text-gray-400 mr-1">রঙ:</span>
              {product.colors.map((c, idx) => (
                <span
                  key={idx}
                  className="w-3 h-3 rounded-full border border-gray-300 shadow-xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}

          {/* Price */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-rose-600">
              ৳{product.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ৳{product.originalPrice.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-bold ml-auto">
              সাশ্রয় ৳{savings.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col gap-2">
          {onToggleCompare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product);
              }}
              className={`w-full py-1 px-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200/80'
              }`}
            >
              <Scale className="w-3 h-3 text-rose-500" />
              <span>{isCompared ? '✓ তুলনা তালিকায় যুক্ত' : '+ পণ্য তুলনা করুন'}</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-2 px-1.5 rounded-xl border border-gray-200 hover:border-gray-400 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[11px] sm:text-xs">কার্টে রাখুন</span>
            </button>

            <button
              onClick={() => onFastBuyNow(product)}
              className="w-full py-2 px-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm shadow-rose-600/30 hover:shadow-rose-600/50 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span className="text-[11px] sm:text-xs">অর্ডার করুন</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
