import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Copy,
  Check,
  Printer,
  Truck,
  Phone,
  Package,
  ShieldCheck,
  FileText,
  X,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import { Order } from '../types';
import { STORE_SETTINGS } from '../data/mockData';
import { GpeLogo } from './GpeLogo';

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 border border-gray-200 print:shadow-none print:border-none print:max-h-none print:max-w-none print:rounded-none flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Navigation with Prominent (X) Close Button (Always visible on scroll, hidden on print) */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-2.5 sm:px-6 sm:py-3 border-b border-gray-200 flex items-center justify-between shadow-xs print:hidden">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-xs font-bold text-gray-800 truncate">
              মানি রিসিট ও ক্যাশ মেমো
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md hidden xs:inline-block">
              {order.id}
            </span>
          </div>

          {/* Explicit (X) Close Button */}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 hover:border-rose-300 font-bold text-xs transition-all shadow-xs cursor-pointer group shrink-0"
            title="রিসিট বন্ধ করুন / Exit Receipt"
            aria-label="Exit and Close Receipt"
          >
            <div className="w-4 h-4 rounded-full bg-white group-hover:bg-rose-200 flex items-center justify-center transition-colors">
              <X className="w-3 h-3 text-rose-700" strokeWidth={2.5} />
            </div>
            <span>(X) Close / বন্ধ করুন</span>
          </button>
        </div>

        {/* ========================================================
            OFFICIAL MONEY RECEIPT & INVOICE HEADER (With GPE LOGO)
            ======================================================== */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-emerald-50/80 via-white to-white border-b border-gray-200">
          {/* Top Branding Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-dashed border-gray-200 pb-4">
            {/* GPE Official Logo */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="max-w-[260px] sm:max-w-[300px]">
                <GpeLogo variant="full" />
              </div>
              <p className="text-[11px] text-gray-500 font-medium mt-1">
                {STORE_SETTINGS.address}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-0.5 text-[11px] text-gray-600 mt-0.5">
                <span>হটলাইন: <strong>{STORE_SETTINGS.phone}</strong></span>
                <span>•</span>
                <span>ইমেইল: <strong>{STORE_SETTINGS.email}</strong></span>
              </div>
            </div>

            {/* Receipt / Invoice Type Badge */}
            <div className="text-center sm:text-right shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs">
                <FileText className="w-3.5 h-3.5" />
                <span>মানি রিসিট ও ক্যাশ মেমো</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono mt-1">
                MONEY RECEIPT & INVOICE
              </p>
              <p className="text-[11px] text-gray-600 mt-1 flex items-center justify-center sm:justify-end gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span>{order.createdAt}</span>
              </p>
            </div>
          </div>

          {/* Success Banner */}
          <div className="mt-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-3 rounded-xl print:bg-transparent print:border-emerald-300">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-emerald-950">
                ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে
              </h2>
              <p className="text-xs text-emerald-800">
                অর্ডার নিশ্চিতকরণে আমাদের প্রতিনিধি কিছুক্ষণের মধ্যেই আপনার মোবাইল ফোনে কল করবেন।
              </p>
            </div>
          </div>

          {/* Order ID & Status Highlights */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Order ID with Copy */}
            <div className="bg-white border-2 border-emerald-500/40 rounded-xl p-2.5 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">অর্ডার আইডি</span>
                <span className="text-base sm:text-lg font-black font-mono text-emerald-950 tracking-tight">
                  {order.id}
                </span>
              </div>
              <button
                onClick={handleCopyId}
                className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-colors border border-emerald-200 print:hidden"
                title="অর্ডার আইডি কপি করুন"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-xl p-2.5 shadow-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">পেমেন্ট মেথড</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 block truncate">
                {order.paymentMethod === 'cod'
                  ? 'ক্যাশ অন ডেলিভারি (COD)'
                  : order.paymentMethod.toUpperCase()}
              </span>
              <span className="text-[10px] font-semibold text-rose-600">
                {order.paymentStatus === 'paid' ? '✓ পরিশোধিত (PAID)' : 'পণ্য পেয়ে মূল্য পরিশোধ'}
              </span>
            </div>

            {/* Total Payable Bill */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-2.5 shadow-xs">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">সর্বমোট প্রদেয় বিল</span>
              <span className="text-base sm:text-lg font-black font-mono text-rose-600">
                ৳{order.total.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-500 block truncate">
                {order.items.length} টি পণ্য
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            INVOICE BODY: CUSTOMER DETAILS & ITEM BREAKDOWN
            ======================================================== */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Customer & Delivery Information Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5 pb-1.5 border-b border-gray-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>গ্রাহক ও ডেলিভারি বিবরণ (Customer & Shipping Details)</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="text-gray-500 font-medium w-28 shrink-0">গ্রাহকের নাম:</span>
                <span className="font-bold text-gray-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="text-gray-500 font-medium w-28 shrink-0">মোবাইল নাম্বার:</span>
                <span className="font-bold font-mono text-gray-900">{order.phone}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4 sm:col-span-2">
                <span className="text-gray-500 font-medium w-28 shrink-0">ডেলিভারি ঠিকানা:</span>
                <span className="font-medium text-gray-900">{order.address}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="text-gray-500 font-medium w-28 shrink-0">ডেলিভারি এলাকা:</span>
                <span className="font-semibold text-gray-800">{order.cityDivision}</span>
              </div>
              {order.district && (
                <div className="flex justify-between sm:justify-start sm:gap-4">
                  <span className="text-gray-500 font-medium w-28 shrink-0">জেলা:</span>
                  <span className="font-semibold text-gray-800">{order.district}</span>
                </div>
              )}
              {order.trxId && (
                <div className="flex justify-between sm:justify-start sm:gap-4 sm:col-span-2">
                  <span className="text-gray-500 font-medium w-28 shrink-0">TrxID / ট্রানজেকশন:</span>
                  <span className="font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {order.trxId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Items Breakdown Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-gray-100/80 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>অর্ডারকৃত পণ্যের বিবরণ (Ordered Items)</span>
              </h4>
              <span className="text-[11px] font-semibold text-gray-500">
                মোট {order.items.reduce((s, it) => s + it.quantity, 0)} টি
              </span>
            </div>

            <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto">
              {order.items.map((it, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 line-clamp-1">{it.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                        {it.color && (
                          <span className="bg-gray-100 px-1.5 py-0.2 rounded text-gray-700 font-medium">
                            রঙ: {it.color}
                          </span>
                        )}
                        {it.size && (
                          <span className="bg-gray-100 px-1.5 py-0.2 rounded text-gray-700 font-medium">
                            সাইজ: {it.size}
                          </span>
                        )}
                        <span>পরিমাণ: <strong>{it.quantity} টি</strong></span>
                        <span>×</span>
                        <span className="font-mono">৳{it.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-gray-900 font-mono text-sm block">
                      ৳{(it.price * it.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>পণ্যের মোট মূল্য (Subtotal):</span>
                <span className="font-semibold text-gray-900 font-mono">৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>ডিসকাউন্ট {order.couponCode ? `(কুপন: ${order.couponCode})` : ''}:</span>
                  <span className="font-mono">-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ ({order.cityDivision}):</span>
                <span className="font-semibold text-gray-900 font-mono">৳{order.deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-300">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>সর্বমোট প্রদেয় বিল (Total Payable):</span>
                </span>
                <span className="text-rose-600 font-mono text-lg">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Genuine Trust Guarantee Seal & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">GPE Bangladesh ১০০% অরিজিনাল গ্যারান্টি</strong>
                <span>ডেলিভারি পাওয়ার পর ডেলিভারিম্যানের সামনে পার্সেল চেক করে নিশ্চিন্তে রিসিভ করুন।</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">কাস্টমার কেয়ার হেল্পলাইন</strong>
                <span>যে কোনো প্রশ্ন বা পরিবর্তনের জন্য কল করুন: <strong>{STORE_SETTINGS.phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons (Hidden when printing) */}
          <div className="pt-3 flex flex-col sm:flex-row gap-2.5 print:hidden">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-700/20 cursor-pointer flex-1"
            >
              <Printer className="w-4 h-4" />
              <span>মানি রিসিট প্রিন্ট</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.id);
              }}
              className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-1"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>লাইভ অর্ডার ট্র্যাক</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 hover:border-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs flex-1"
              title="রিসিট বন্ধ করুন / Close Receipt"
            >
              <X className="w-4 h-4 text-rose-600" strokeWidth={2.5} />
              <span>(X) Close / রিসিট বন্ধ করুন</span>
            </button>
          </div>

          <div className="pt-2 text-center print:hidden">
            <button
              onClick={onClose}
              className="text-[11px] text-gray-500 hover:text-gray-800 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
              <span>হোমপেজে ফিরে কেনাকাটা চালিয়ে যান (Continue Shopping)</span>
            </button>
          </div>

          {/* Print Footer Notice (Visible only when printed) */}
          <div className="hidden print:block pt-6 text-center text-[10px] text-gray-500 border-t border-gray-200 mt-6">
            <p className="font-bold text-gray-700">
              GPE Bangladesh • গ্যাজেট • ফোন • ইলেকট্রনিক্স
            </p>
            <p>
              হটলাইন: {STORE_SETTINGS.phone} | ইমেইল: {STORE_SETTINGS.email} | ওয়েবসাইট: gpebangladesh.store
            </p>
            <p className="mt-1">
              এটি একটি কম্পিউটার জেনারেটেড ডিজিটাল মানি রিসিট। কোনো স্বাক্ষরের প্রয়োজন নেই।
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
