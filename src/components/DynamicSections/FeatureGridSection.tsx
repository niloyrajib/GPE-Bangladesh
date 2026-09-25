import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Zap, Award, Headphones, Gift, Star } from 'lucide-react';

interface FeatureGridProps {
  customData?: {
    badge?: string;
    subtitle?: string;
    description?: string;
    features?: Array<{
      id: string;
      title: string;
      desc: string;
      icon: string;
    }>;
  };
}

const ICON_MAP: Record<string, any> = {
  truck: Truck,
  shield: ShieldCheck,
  refresh: RefreshCw,
  zap: Zap,
  award: Award,
  headphones: Headphones,
  gift: Gift,
  star: Star
};

export const FeatureGridSection: React.FC<FeatureGridProps> = ({ customData }) => {
  const badge = customData?.badge || '✨ প্রিমিয়াম সেবা';
  const title = customData?.subtitle || 'কেন আমাদের থেকে শপিং করবেন?';
  const description = customData?.description || 'আমরা দিচ্ছি শতভাগ নির্ভরযোগ্য ও দ্রুততম ই-কমার্স অভিজ্ঞতা';

  const features = customData?.features && customData.features.length > 0
    ? customData.features
    : [
        {
          id: 'f1',
          title: 'সরাসরি অফিসিয়াল গ্যাজেট',
          desc: 'সকল গ্যাজেট শতভাগ আসল এবং ব্র্যান্ড ওয়ারেন্টি সহ সরবরাহ করা হয়।',
          icon: 'award'
        },
        {
          id: 'f2',
          title: 'সবচেয়ে দ্রুত ডেলিভারি',
          desc: 'ঢাকার মধ্যে ২৪ ঘণ্টার মধ্যে এবং বাইরে ৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি।',
          icon: 'truck'
        },
        {
          id: 'f3',
          title: '৭ দিনের সহজ এক্সচেঞ্জ',
          desc: 'পণ্য পছন্দ না হলে বা ডিফেক্ট থাকলে সহজেই পরিবর্তন করে নিন।',
          icon: 'refresh'
        },
        {
          id: 'f4',
          title: '২৪/৭ হটলাইন সাপোর্ট',
          desc: 'যেকোনো জিজ্ঞাসায় কল বা হোয়াটসঅ্যাপে রয়েছে ডেডিকেটেড এজেন্ট।',
          icon: 'headphones'
        }
      ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-2">
          {badge}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feat) => {
          const IconComp = ICON_MAP[feat.icon] || Award;
          return (
            <div
              key={feat.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-rose-200 transition-all group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs">
                <IconComp className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{feat.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
