import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShoppingCart, Eye, Zap, ArrowRight } from 'lucide-react';
import { Product, ThemeConfig } from '../types';

interface FlashDealsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onFastBuyNow: (product: Product) => void;
  flashConfig?: ThemeConfig['flashDeals'];
}

export const FlashDeals: React.FC<FlashDealsProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onFastBuyNow,
  flashConfig
}) => {
  if (flashConfig && !flashConfig.enabled) {
    return null;
  }

  const flashProducts = products.filter((p) => p.isFlashDeal);

  // Real countdown timer state
  const initialHours = flashConfig?.dealHours || 8;
  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="flash-sale-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Flash Header with Countdown Timer */}
      <div className="bg-gradient-to-r from-rose-600 to-red-600 rounded-2xl p-4 sm:p-6 text-white mb-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
            <Flame className="w-7 h-7 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {flashConfig?.title || 'ফ্ল্যাশ ডিলস (Flash Deals)'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider animate-bounce">
                {flashConfig?.badgeText || 'সীমিত স্টক!'}
              </span>
            </div>
            <p className="text-xs text-rose-100 mt-0.5">
              সেরা দামে প্রিমিয়াম গ্যাজেট ও লাইফস্টাইল পণ্য লুফে নিন
            </p>
          </div>
        </div>

        {/* Countdown Box */}
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20">
          <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="text-xs font-semibold text-rose-100 mr-1">অফার শেষ হতে বাকি:</span>
          
          <div className="flex items-center gap-1.5 font-mono font-bold text-white">
            <div className="bg-white/20 rounded px-2 py-1 text-sm">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="bg-white/20 rounded px-2 py-1 text-sm">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="bg-amber-400 text-slate-900 rounded px-2 py-1 text-sm">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>

      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {flashProducts.map((product) => {
          const savings = product.originalPrice - product.price;
          const soldPercentage = Math.min(
            100,
            Math.round((product.soldCount / (product.soldCount + product.stockCount)) * 100)
          );

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group relative"
            >
              {/* Badge & Discount */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-600 text-white shadow-xs">
                  -{product.discountPercent}% OFF
                </span>
                {product.badge && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900 text-amber-400 shadow-xs">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Quick View Floating Button */}
              <button
                onClick={() => onSelectProduct(product)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-rose-600 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Product Image */}
              <div
                onClick={() => onSelectProduct(product)}
                className="w-full h-52 bg-gray-100 overflow-hidden cursor-pointer relative"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wide">
                    {product.category}
                  </span>
                  
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mt-1 hover:text-rose-600 cursor-pointer transition-colors"
                  >
                    {product.name}
                  </h3>

                  {/* Stock progress */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-gray-500 font-medium mb-1">
                      <span>বিক্রি হয়েছে: {product.soldCount} টি</span>
                      <span className="text-rose-600 font-semibold">স্টক: {product.stockCount} টি</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-black text-rose-600">
                      ৳{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.5 rounded">
                      সাশ্রয় ৳{savings.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Direct Buy Now (Order Now) & Add to Cart */}
                <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full py-2.5 px-2 rounded-xl border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>কার্ট</span>
                  </button>

                  <button
                    onClick={() => onFastBuyNow(product)}
                    className="w-full py-2.5 px-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-rose-600/30 hover:shadow-rose-600/50 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>অর্ডার করুন</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
