import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, Package, MapPin, AlertCircle, Phone, ArrowRight, Printer, FileText } from 'lucide-react';
import { Order } from '../types';
import { STORE_SETTINGS } from '../data/mockData';
import { OrderConfirmationModal } from './OrderConfirmationModal';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderId = ''
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    orders.find((o) => o.id.toLowerCase() === initialOrderId.toLowerCase()) || null
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setErrorMsg('অনুগ্রহ করে অর্ডার আইডি (যেমন: GPE-89210) অথবা ফোন নাম্বার লিখুন');
      return;
    }

    const found = orders.find(
      (o) => o.id.toLowerCase() === q || o.phone.includes(q)
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setErrorMsg(`'${searchQuery}' এর জন্য কোনো অর্ডার খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডি লিখুন।`);
      setSearchedOrder(null);
    }
  };

  const handleSelectSampleOrder = (order: Order) => {
    setSearchQuery(order.id);
    setSearchedOrder(order);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">
                লাইভ অর্ডার ট্র্যাকিং (Order Live Tracking)
              </h2>
              <p className="text-[11px] text-slate-400">
                আপনার পার্সেলের সর্বশেষ অবস্থা জানতে অর্ডার আইডি বা ফোন নম্বর দিন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Search Input Box */}
          <div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="tracking-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="অর্ডার আইডি (যেমন: GPE-89210) বা ফোন নম্বর"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 font-mono outline-none focus:bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition-all uppercase"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-md shadow-rose-600/30 cursor-pointer"
              >
                ট্র্যাক করুন
              </button>
            </form>

            {/* Quick Demo Order Chips */}
            <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[11px] text-gray-500">
              <span className="font-semibold text-gray-700">ডেমো আইডি দিয়ে টেস্ট করুন:</span>
              {orders.slice(0, 3).map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => handleSelectSampleOrder(ord)}
                  className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-rose-50 hover:text-rose-600 font-mono font-bold text-gray-800 transition-colors border border-gray-200"
                >
                  {ord.id} ({ord.status})
                </button>
              ))}
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Searched Order Result Card */}
          {searchedOrder && (
            <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-white shadow-xs space-y-5 animate-in fade-in duration-300">
              
              {/* Order Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReceipt(true)}
                      className="text-base font-black font-mono text-gray-900 hover:text-rose-600 hover:underline flex items-center gap-1.5 cursor-pointer text-left transition-colors"
                      title="ক্লিক করে মানি রিসিট দেখুন"
                    >
                      <span>{searchedOrder.id}</span>
                      <Printer className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                      {searchedOrder.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    অর্ডার তারিখ: {searchedOrder.createdAt}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-500 font-medium">কুরিয়ার সার্ভিস:</p>
                  <p className="text-xs font-bold text-gray-900">
                    {searchedOrder.courierName || 'Steadfast Express'}
                  </p>
                  {searchedOrder.trackingNumber && (
                    <p className="text-[10.5px] font-mono text-rose-600">
                      ট্র্যাকিং কোড: {searchedOrder.trackingNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Visual Shipment Timeline Stepper */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-rose-600" />
                  <span>ডেলিভারি ট্র্যাকিং হিস্ট্রি</span>
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {searchedOrder.timeline.map((step, idx) => {
                    return (
                      <div key={idx} className="relative group">
                        {/* Dot */}
                        <div
                          className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                            step.completed
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h5
                              className={`text-xs font-bold ${
                                step.completed ? 'text-gray-900' : 'text-gray-400'
                              }`}
                            >
                              {step.title}
                            </h5>
                            <span
                              className={`text-[10px] font-mono font-medium ${
                                step.completed ? 'text-emerald-700' : 'text-gray-400'
                              }`}
                            >
                              {step.timestamp}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] mt-0.5 leading-relaxed ${
                              step.completed ? 'text-gray-600' : 'text-gray-400'
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items & Customer Address Recap */}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <span className="font-bold text-gray-700 block mb-1">ডেলিভারি তথ্য:</span>
                  <p className="text-gray-900 font-semibold">{searchedOrder.customerName}</p>
                  <p className="text-gray-600">{searchedOrder.phone}</p>
                  <p className="text-gray-500 mt-1">{searchedOrder.address}, {searchedOrder.cityDivision}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-gray-700 block mb-1">পেমেন্ট ও মোট বিল:</span>
                    <p className="text-gray-600 capitalize">
                      পেমেন্ট: <strong>{searchedOrder.paymentMethod.toUpperCase()}</strong> ({searchedOrder.paymentStatus})
                    </p>
                    <p className="text-sm font-black text-rose-600 font-mono mt-1">
                      সর্বমোট: ৳{searchedOrder.total.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-gray-200 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReceipt(true)}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>মানি রিসিট দেখুন ও প্রিন্ট করুন</span>
                    </button>

                    <a
                      href={`tel:${STORE_SETTINGS.phone}`}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>প্রয়োজনে কাস্টমার কেয়ারে কল করুন</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* View / Print GPE Money Receipt Modal */}
        {showReceipt && searchedOrder && (
          <OrderConfirmationModal
            order={searchedOrder}
            onClose={() => setShowReceipt(false)}
            onTrackOrder={() => setShowReceipt(false)}
          />
        )}

      </div>
    </div>
  );
};
