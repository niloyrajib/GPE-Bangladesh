import React, { useState } from 'react';
import { X, Check, ArrowRight, ShoppingCart, Zap, Star, AlertCircle, Sparkles, Scale, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
  onAddToCart: (product: Product) => void;
  onFastBuyNow: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  compareProducts,
  onRemoveProduct,
  onClearAll,
  onAddToCart,
  onFastBuyNow,
  onSelectProduct
}) => {
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  if (!isOpen) return null;

  // Collect all unique specification keys across all compared products
  const allSpecKeys: string[] = Array.from(
    new Set<string>(
      compareProducts.flatMap((p) => Object.keys(p.specifications || {}))
    )
  );

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="product-compare-modal-content"
        className="bg-white w-full max-w-6xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/90 text-white flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">পণ্য তুলনা (Product Comparison)</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {compareProducts.length} টি পণ্য
                </span>
              </div>
              <p className="text-xs text-slate-400">
                পারস্পরিক বৈশিষ্ট্য ও স্পেসিফিকেশন পাশাপাশি তুলনা করে সেরা পণ্যটি বেছে নিন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareProducts.length > 0 && (
              <button
                id="compare-clear-all-btn"
                onClick={onClearAll}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>সব মুছুন</span>
              </button>
            )}
            <button
              id="compare-modal-close-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Comparison Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {compareProducts.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center flex-1">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-800">তুলনা করার মতো কোনো পণ্য যোগ করা হয়নি</h3>
            <p className="text-xs text-gray-500 max-w-md mt-1 mb-6">
              যেকোনো প্রোডাক্ট কার্ডের ওপর 'তুলনা' (Compare) বাটনে ক্লিক করে ২ থেকে ৪টি পণ্য নির্বাচন করুন এবং স্পেসিফিকেশন পাশাপাশি তুলনা করুন।
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              প্রোডাক্ট দেখুন
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Control Bar: Highlights differences toggle & count reminder */}
            <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={highlightDifferences}
                    onChange={(e) => setHighlightDifferences(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300 cursor-pointer"
                  />
                  <span>শুধুমাত্র অমিলগুলো হাইলাইট করুন (Highlight Differences)</span>
                </label>
              </div>

              <div className="flex items-center gap-3 text-gray-500 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  সর্বোচ্চ ৪টি আইটেম সহজে তুলনা করুন
                </span>
                <button
                  onClick={onClearAll}
                  className="sm:hidden text-rose-600 hover:underline font-bold"
                >
                  সব মুছুন
                </button>
              </div>
            </div>

            {/* Side-by-side Table Container */}
            <div className="overflow-x-auto min-w-full">
              <table className="w-full border-collapse text-left table-fixed">
                {/* Table Colgroup for sizing */}
                <colgroup>
                  <col className="w-40 sm:w-52" />
                  {compareProducts.map((p) => (
                    <col key={p.id} className="min-w-[220px] w-64" />
                  ))}
                </colgroup>

                {/* Sticky Product Cards Header */}
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="p-4 align-top font-semibold text-xs text-gray-500 uppercase tracking-wider bg-gray-50/70 border-r border-gray-100">
                      পণ্য বিবরণী
                    </th>
                    {compareProducts.map((product) => {
                      const savings = product.originalPrice - product.price;
                      return (
                        <th
                          key={product.id}
                          className="p-4 align-top relative border-r border-gray-100 last:border-r-0 group hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Remove button */}
                          <button
                            id={`remove-compare-${product.id}`}
                            onClick={() => onRemoveProduct(product.id)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-100 hover:bg-rose-100 text-gray-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                            title="তালিকা থেকে বাদ দিন"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          {/* Product Image */}
                          <div
                            onClick={() => {
                              onSelectProduct(product);
                              onClose();
                            }}
                            className="w-full h-36 bg-gray-50 rounded-xl overflow-hidden cursor-pointer relative mb-3 border border-gray-100 flex items-center justify-center group/img"
                          >
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                            />
                            {product.discountPercent > 0 && (
                              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                                -{product.discountPercent}%
                              </span>
                            )}
                          </div>

                          {/* Category and Title */}
                          <p className="text-[10px] uppercase font-bold text-sky-600 tracking-wider mb-1 truncate">
                            {product.category}
                          </p>
                          <h4
                            onClick={() => {
                              onSelectProduct(product);
                              onClose();
                            }}
                            className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 hover:text-rose-600 cursor-pointer transition-colors"
                            title={product.name}
                          >
                            {product.name}
                          </h4>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="flex items-center text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-bold ml-1 text-gray-800">{product.rating}</span>
                            </div>
                            <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
                          </div>

                          {/* Price */}
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-base font-black text-rose-600">
                              ৳{product.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ৳{product.originalPrice.toLocaleString()}
                            </span>
                          </div>

                          {savings > 0 && (
                            <span className="inline-block mt-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                              সাশ্রয় ৳{savings.toLocaleString()}
                            </span>
                          )}

                          {/* Actions */}
                          <div className="mt-3.5 grid grid-cols-2 gap-1.5">
                            <button
                              id={`compare-cart-btn-${product.id}`}
                              onClick={() => onAddToCart(product)}
                              className="py-1.5 px-2 rounded-lg border border-gray-200 hover:border-gray-400 text-gray-700 hover:bg-gray-50 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <ShoppingCart className="w-3 h-3 text-gray-500" />
                              <span>কার্ট</span>
                            </button>
                            <button
                              id={`compare-buy-btn-${product.id}`}
                              onClick={() => {
                                onClose();
                                onFastBuyNow(product);
                              }}
                              className="py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                            >
                              <Zap className="w-3 h-3 fill-white" />
                              <span>অর্ডার</span>
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* Specification Rows */}
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {/* Brand Row */}
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/60 border-r border-gray-100">
                      ব্র্যান্ড (Brand)
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 border-r border-gray-100 last:border-r-0 font-medium">
                        {p.brand || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Stock Status Row */}
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/60 border-r border-gray-100">
                      স্টক স্ট্যাটাস (Availability)
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 border-r border-gray-100 last:border-r-0">
                        {p.inStock ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                            <Check className="w-3 h-3 text-emerald-600" /> ইন স্টক ({p.stockCount} টি)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                            <AlertCircle className="w-3 h-3 text-rose-600" /> স্টক শেষ
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Warranty Row */}
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/60 border-r border-gray-100">
                      ওয়ারেন্টি (Warranty)
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 border-r border-gray-100 last:border-r-0 text-gray-600">
                        {p.warranty || 'কোনো ওয়ারেন্টি নেই'}
                      </td>
                    ))}
                  </tr>

                  {/* Available Colors Row */}
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/60 border-r border-gray-100">
                      উপলব্ধ রঙ (Colors)
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 border-r border-gray-100 last:border-r-0">
                        {p.colors && p.colors.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {p.colors.map((c, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-md text-[10.5px]"
                                title={c.name}
                              >
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-gray-300"
                                  style={{ backgroundColor: c.hex }}
                                />
                                {c.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">স্ট্যান্ডার্ড</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Key Features Row */}
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/60 border-r border-gray-100">
                      প্রধান বৈশিষ্ট্য (Key Features)
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 border-r border-gray-100 last:border-r-0">
                        {p.features && p.features.length > 0 ? (
                          <ul className="space-y-1">
                            {p.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                                <span className="text-rose-500 font-bold leading-none mt-0.5">•</span>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">তথ্য নেই</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Section Divider: Detailed Specifications */}
                  {allSpecKeys.length > 0 && (
                    <tr className="bg-slate-100/80 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      <td
                        colSpan={compareProducts.length + 1}
                        className="py-2.5 px-4 bg-slate-100 text-slate-700 border-y border-gray-200"
                      >
                        বিস্তারিত স্পেসিফিকেশন (Detailed Specifications)
                      </td>
                    </tr>
                  )}

                  {/* Dynamic Technical Specifications Rows */}
                  {allSpecKeys.map((key) => {
                    const values = compareProducts.map((p) => p.specifications?.[key] || '—');
                    const isDifferent = new Set(values).size > 1;

                    if (highlightDifferences && !isDifferent) {
                      return null;
                    }

                    return (
                      <tr
                        key={key}
                        className={`transition-colors ${
                          isDifferent && highlightDifferences
                            ? 'bg-amber-50/60 font-medium'
                            : 'hover:bg-gray-50/50'
                        }`}
                      >
                        <td className="p-3.5 font-bold text-gray-700 bg-gray-50/60 border-r border-gray-100">
                          {key}
                        </td>
                        {compareProducts.map((p) => {
                          const val = p.specifications?.[key];
                          return (
                            <td
                              key={p.id}
                              className={`p-3.5 border-r border-gray-100 last:border-r-0 ${
                                isDifferent && highlightDifferences ? 'text-amber-950 font-semibold' : 'text-gray-600'
                              }`}
                            >
                              {val || <span className="text-gray-400">—</span>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <p>
            সর্বোচ্চ পছন্দের সাথে মিলিয়ে কেনার জন্য পণ্যগুলো সরাসরি কার্টে যোগ করতে পারেন।
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
