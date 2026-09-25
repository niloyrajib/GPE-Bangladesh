import React, { useState } from 'react';
import { Play, X, Star, Sparkles } from 'lucide-react';

interface VideoBannerProps {
  customData?: {
    badge?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    image?: string;
    videoUrl?: string;
    videoTitle?: string;
  };
  onShopNow?: () => void;
}

export const VideoBannerSection: React.FC<VideoBannerProps> = ({ customData, onShopNow }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const badge = customData?.badge || '🎬 লাইভ ভিডিও আনবক্সিং';
  const title = customData?.subtitle || 'গ্যাজেট কেনার আগে আসল আনবক্সিং ভিডিও দেখে নিন';
  const description = customData?.description || 'আমাদের নিজস্ব টেক স্টুডিও থেকে পণ্যের বিল্ড কোয়ালিটি এবং আসল ফিচার রিভিউ দেখুন।';
  const thumbnail = customData?.image || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&auto=format&fit=crop&q=80';
  const videoUrl = customData?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
  const buttonText = customData?.buttonText || 'ভিডিও দেখে অর্ডার করুন';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 text-white min-h-[360px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={thumbnail}
            alt="Video Showcase"
            className="w-full h-full object-cover opacity-35 scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-12 max-w-2xl">
          <span className="px-3 py-1 bg-rose-600/90 text-white rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{badge}</span>
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl hover:bg-rose-50 hover:text-rose-600 transition-all group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <span>ভিডিও প্লে করুন</span>
            </button>

            {onShopNow && (
              <button
                type="button"
                onClick={onShopNow}
                className="px-5 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>

        {/* Play Floating Badge on Desktop Right */}
        <div className="hidden lg:flex absolute right-12 z-10 items-center justify-center">
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="w-24 h-24 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:scale-110 hover:bg-rose-600 transition-all shadow-2xl group cursor-pointer"
            title="ভিডিও দেখুন"
          >
            <Play className="w-10 h-10 fill-current ml-1 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Video Modal Player */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video border border-gray-800">
            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 text-white hover:bg-rose-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={videoUrl}
              title="Product Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
};
