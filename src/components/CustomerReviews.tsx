import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquareQuote, ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { CUSTOMER_REVIEWS, FAQ_LIST } from '../data/mockData';

export const CustomerReviews: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Customer Testimonials Grid */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Star className="w-4 h-4 fill-rose-600 text-rose-600" />
              <span>কাস্টমারদের প্রতিক্রিয়া ও অভিজ্ঞতা</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              আমাদের সম্মানিত গ্রাহকদের মতামত
            </h2>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>৯৯% কাস্টমার সন্তুষ্টি রেটিং</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] text-gray-400 ml-1 font-medium">{rev.date}</span>
                </div>

                {/* Comment quote */}
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Verification */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{rev.userName}</h4>
                  <p className="text-[10.5px] text-gray-500">{rev.location}</p>
                </div>
                {rev.verified && (
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    ভেরিফাইড
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-gray-900">
            সাধারণ কিছু প্রশ্নোত্তর (FAQ)
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            GPE Bangladesh এ অর্ডার ও ডেলিভারি সংক্রান্ত জরুরি তথ্যাবলী
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_LIST.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-gray-200 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left p-4 bg-gray-50/50 hover:bg-gray-100 flex items-center justify-between text-xs sm:text-sm font-bold text-gray-800 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isOpen ? 'rotate-180 text-rose-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 text-xs sm:text-sm text-gray-600 leading-relaxed bg-white border-t border-gray-100 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
