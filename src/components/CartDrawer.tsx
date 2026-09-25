import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { STORE_SETTINGS, VALID_COUPONS } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  coupons?: Coupon[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  coupons = VALID_COUPONS
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.amount) / 100);
    } else {
      discountAmount = appliedCoupon.amount;
    }
  }

  const freeShippingThreshold = STORE_SETTINGS.freeDeliveryThreshold;
  const freeShippingNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const searchList = coupons && coupons.length > 0 ? coupons : VALID_COUPONS;
    const matched = searchList.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (!matched) {
      setCouponError('অবৈধ কুপন কোড (Invalid coupon code)');
      return;
    }

    const todayIso = new Date().toISOString().split('T')[0];
    if (matched.status === 'expired' || (matched.expiryDate && matched.expiryDate < todayIso)) {
      setCouponError(`কুপন '${matched.code}' এর মেয়াদ উত্তীর্ণ হয়ে গেছে (Coupon has expired)`);
      return;
    }

    if (subtotal < matched.minSpend) {
      setCouponError(`এই কুপনটি ব্যবহার করতে ন্যূনতম ৳${matched.minSpend.toLocaleString()} টাকার অর্ডার প্রয়োজন`);
      return;
    }

    onApplyCoupon(matched);
    setCouponSuccess(`কুপন '${matched.code}' সফলভাবে প্রয়োগ করা হয়েছে!`);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-400" />
            <h2 className="text-sm font-bold tracking-wide">
              শপিং কার্ট ({cartItems.length} টি আইটেম)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="p-3.5 bg-rose-50 border-b border-rose-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-rose-900 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-rose-600" />
              {freeShippingNeeded === 0
                ? 'অভিনন্দন! আপনি পাচ্ছেন ফ্রি হোম ডেলিভারি!'
                : `আর মাত্র ৳${freeShippingNeeded.toLocaleString()} টাকার শপিং করলেই ফ্রি ডেলিভারি!`}
            </span>
            <span className="font-bold text-rose-600 font-mono">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-rose-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-600 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-base font-bold text-gray-800">আপনার কার্ট খালি রয়েছে</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                আমাদের দারুণ সব গ্যাজেট ও লাইফস্টাইল পণ্য দেখতে শপিং শুরু করুন!
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition-colors"
              >
                শপিং চালিয়ে যান
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="py-3 flex gap-3 items-center group">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-gray-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {item.product.name}
                  </h4>
                  {item.selectedColor && (
                    <p className="text-[11px] text-gray-500">
                      কালার: <span className="font-medium text-gray-700">{item.selectedColor}</span>
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs font-black text-rose-600">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-bold text-gray-900 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete item */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-rose-600 p-1"
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

        {/* Footer & Checkout Area */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
            
            {/* Coupon Application */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>কুপন কোড: <strong>{appliedCoupon.code}</strong> (-৳{discountAmount})</span>
                  </div>
                  <button
                    onClick={() => onApplyCoupon(null)}
                    className="text-rose-600 hover:text-rose-800 font-bold"
                  >
                    মুছুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="কুপন কোড (যেমন: BANGLA10)"
                    className="flex-1 px-3 py-1.5 text-xs uppercase bg-white border border-gray-300 rounded-lg outline-none focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                  >
                    প্রয়োগ
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-600 mt-1">{couponSuccess}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span>সাবটোটাল</span>
                <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>কুপন ডিসকাউন্ট</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>ডেলিভারি চার্জ</span>
                <span>চেকআউট পেজে হিসাব হবে</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-gray-200">
                <span>মোট প্রদেয় (আনুমানিক)</span>
                <span className="text-rose-600">৳{(subtotal - discountAmount).toLocaleString()}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              id="cart-checkout-proceed-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              ১০০% নিরাপদ চেকআউট • ক্যাশ অন ডেলিভারি সুবিধা
            </p>

          </div>
        )}

      </div>
    </div>
  );
};
