import React from 'react';
import { Truck, ShieldCheck, Banknote, Headphones, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import { STORE_SETTINGS } from '../data/mockData';
import { ThemeConfig } from '../types';

interface TrustBadgesProps {
  trustConfig?: ThemeConfig['trustBadges'];
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ trustConfig }) => {
  if (trustConfig && !trustConfig.enabled) {
    return null;
  }

  const renderIcon = (iconName: string, index: number) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-6 h-6" />;
      case 'shield':
        return <Banknote className="w-6 h-6" />;
      case 'refresh':
        return <RefreshCw className="w-6 h-6" />;
      case 'phone':
        return <Headphones className="w-6 h-6" />;
      case 'zap':
        return <Zap className="w-6 h-6" />;
      default:
        return index === 0 ? <Truck className="w-6 h-6" /> : index === 1 ? <ShieldCheck className="w-6 h-6" /> : index === 2 ? <RefreshCw className="w-6 h-6" /> : <Headphones className="w-6 h-6" />;
    }
  };

  const badgeColors = [
    { bg: 'bg-rose-50', text: 'text-rose-600' },
    { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { bg: 'bg-sky-50', text: 'text-sky-600' },
    { bg: 'bg-amber-50', text: 'text-amber-600' }
  ];

  const badges = trustConfig?.badges || [
    { id: '1', title: 'এক্সপ্রেস ডেলিভারি', subtitle: 'ঢাকা ৬০৳ (২৪-৪৮ ঘণ্টা), বাইরে ১২০৳', iconName: 'truck' as const },
    { id: '2', title: 'ক্যাশ অন ডেলিভারি', subtitle: 'পণ্য দেখে টাকা দেওয়ার নিশ্চিন্ত সুবিধা', iconName: 'shield' as const },
    { id: '3', title: '৭ দিনের গ্যারান্টি', subtitle: 'ত্রুটিযুক্ত পণ্যে সহজ এক্সচেঞ্জ সুবিধা', iconName: 'refresh' as const },
    { id: '4', title: '২৪/৭ কাস্টমার সাপোর্ট', subtitle: `হটলাইন: ${STORE_SETTINGS.phone}`, iconName: 'phone' as const }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((b, idx) => {
          const color = badgeColors[idx % badgeColors.length];
          return (
            <div key={b.id || idx} className="flex items-center gap-3.5 p-2">
              <div className={`w-12 h-12 rounded-xl ${color.bg} ${color.text} flex items-center justify-center flex-shrink-0 shadow-xs`}>
                {renderIcon(b.iconName, idx)}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">{b.title}</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {b.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
