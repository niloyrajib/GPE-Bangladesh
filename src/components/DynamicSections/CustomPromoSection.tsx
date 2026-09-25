import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Truck } from 'lucide-react';

interface CustomPromoProps {
  customData?: {
    badge?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    bgGradient?: string;
    image?: string;
  };
  onAction?: () => void;
}

export const CustomPromoSection: React.FC<CustomPromoProps> = ({ customData, onAction }) => {
  const badge = customData?.badge || '⚡ বিশেষ মেগা ধামাকা';
  const title = customData?.subtitle || 'অরিজিনাল গ্যাজেট কিনুন নিশ্চিন্তে';
  const description = customData?.description || 'ঢাকা সিটিতে ২৪ ঘণ্টায় এক্সপ্রেস ডেলিভারি এবং ফ্রি রিটার্ন গ্যারান্টি!';
  const buttonText = customData?.buttonText || 'অর্ডার করুন';
  const bgGradient = customData?.bgGradient || 'from-slate-900 via-rose-950 to-slate-900';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className={`bg-gradient-to-r ${bgGradient} rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800`}>
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white uppercase tracking-wider mb-3 inline-block">
            {badge}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {description}
          </p>
          <div className="mt-5 flex flex-wrap gap-4 justify-center md:justify-start text-xs font-semibold text-rose-200">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              ঢাকা মাত্র ৬০৳
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              ৭ দিনের সহজ রিটার্ন
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-rose-400" />
              ১০০% অরিজিনাল গ্যাজেট
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3">
          {onAction && (
            <button
              onClick={onAction}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-rose-600/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
