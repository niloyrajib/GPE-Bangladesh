import React, { useState } from 'react';
import { CheckCircle, Copy, Check, Printer, ArrowRight, Truck, Phone, Package } from 'lucide-react';
import { Order } from '../types';
import { STORE_SETTINGS } from '../data/mockData';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onTrackOrder
}) => {
  if (!order) return null;

  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:p-0 print:bg-white">
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-h-none print:max-w-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Success Header */}
        <div className="p-6 text-center bg-gradient-to-b from-emerald-50 to-white border-b border-emerald-100">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            ধন্যবাদ! আপনার অর্ডার সফল হয়েছে
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            আমাদের কাস্টমার কেয়ার প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
          </p>

          {/* Order ID Badge with copy */}
          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-300 px-4 py-2 rounded-xl">
            <span className="text-xs text-emerald-800 font-semibold">অর্ডার আইডি:</span>
            <span className="text-sm sm:text-base font-black font-mono text-emerald-950">
              {order.id}
            </span>
            <button
              onClick={handleCopyId}
              className="ml-1 p-1 hover:bg-emerald-200 text-emerald-800 rounded-md transition-colors"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Customer & Delivery Details */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">গ্রাহকের নাম:</span>
              <span className="font-bold text-gray-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">মোবাইল নাম্বার:</span>
              <span className="font-bold font-mono text-gray-900">{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">ডেলিভারি ঠিকানা:</span>
              <span className="font-medium text-gray-900 text-right max-w-xs">{order.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">পেমেন্ট মেথড:</span>
              <span className="font-bold uppercase text-rose-600">
                {order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি (COD)' : order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">ডেলিভারি এরিয়া:</span>
              <span className="font-semibold text-gray-800">{order.cityDivision}</span>
            </div>
          </div>

          {/* Items Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-rose-600" />
              <span>পণ্যের বিবরণ</span>
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {order.items.map((it, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={it.image} alt="" className="w-9 h-9 rounded object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-xs">{it.name}</p>
                      <p className="text-[11px] text-gray-500">{it.color ? `কালার: ${it.color} | ` : ''}পরিমাণ: {it.quantity} টি</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 font-mono">৳{(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Calculation */}
          <div className="border-t border-gray-200 pt-3 space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>সাবটোটাল</span>
              <span className="font-medium text-gray-900">৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>ডিসকাউন্ট</span>
                <span>-৳{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>ডেলিভারি চার্জ</span>
              <span className="font-medium text-gray-900">৳{order.deliveryCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
              <span>সর্বমোট প্রদেয় বিল:</span>
              <span className="text-rose-600 font-mono">৳{order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Call helpline note */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              অর্ডার সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের হটলাইনে ({STORE_SETTINGS.phone}) কল করতে পারেন।
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 print:hidden">
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.id);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Truck className="w-4 h-4 text-rose-400" />
              <span>অর্ডার ট্র্যাক করুন (Live Tracking)</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট রিসিট</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              শপিং চালিয়ে যান
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
