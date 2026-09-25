import React, { useState } from 'react';
import { Mail, Check, Sparkles, Gift } from 'lucide-react';

interface NewsletterProps {
  customData?: {
    badge?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
  };
}

export const NewsletterSection: React.FC<NewsletterProps> = ({ customData }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const badge = customData?.badge || '🎁 স্পেশাল অফার';
  const title = customData?.subtitle || 'VIP ক্লাবে যোগ দিন ও পান ১০০৳ ছাড়ের কুপন!';
  const description = customData?.description || 'আমাদের সাপ্তাহিক সিক্রেট ডিসকাউন্ট ও নতুন প্রোডাক্ট লঞ্চ সবার আগে জানার জন্য সাবস্ক্রাইব করুন।';
  const buttonText = customData?.buttonText || 'কুপন কোড সংগ্রহ করুন';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    setSubscribed(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>{badge}</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-white">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-rose-100 mb-6 leading-relaxed">
            {description}
          </p>

          {subscribed ? (
            <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-5 text-center animate-in zoom-in duration-200">
              <div className="w-10 h-10 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center mx-auto mb-2 font-bold shadow-md">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">অভিনন্দন! আপনি এখন আমাদের VIP মেম্বার</h3>
              <p className="text-xs text-rose-100">
                আপনার পরবর্তী অর্ডারে কুপন কোড ব্যবহার করুন:{' '}
                <strong className="px-2 py-0.5 bg-white text-rose-600 rounded font-mono font-black text-sm ml-1 select-all">
                  VIP100
                </strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="আপনার ফোন নম্বর বা ইমেইল দিন..."
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 placeholder-gray-400 rounded-xl text-xs font-medium outline-none shadow-md focus:ring-2 focus:ring-amber-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition-colors whitespace-nowrap cursor-pointer"
              >
                {buttonText}
              </button>
            </form>
          )}

          <p className="text-[10px] text-rose-200/80 mt-3">
            🔒 আমরা কখনো স্প্যাম করি না। যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন।
          </p>
        </div>
      </div>
    </section>
  );
};
