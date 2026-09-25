import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, ShoppingCart, ArrowRight, Shield, Truck } from 'lucide-react';
import { STORE_SETTINGS } from '../../data/mockData';
import { ThemeConfig } from '../../types';

interface HeroBannerProps {
  onShopNow: () => void;
  onSelectCategory: (cat: string) => void;
  heroConfig?: ThemeConfig['hero'];
}

const SLIDES = [
  {
    id: 1,
    badge: '🔥 মেগা গ্যাজেট অফার ২০২৬',
    title: 'T900 Ultra 2 স্মার্টওয়াচ',
    subtitle: 'বিশাল ২.০৯ ইঞ্চি এইচডি ডিসপ্লে, কলিং সুবিধা ও ওয়্যারলেস চার্জার',
    priceText: 'মাত্র ১৩৯০৳',
    regularPrice: '২২৫০৳',
    discount: '৩৮% ছাড়',
    category: 'Smart Watches',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&auto=format&fit=crop&q=80',
    bgGradient: 'from-rose-900 via-slate-900 to-indigo-950',
    accentColor: 'bg-rose-500'
  },
  {
    id: 2,
    badge: '⚡ হাই-ফাই অডিও মেলা',
    title: 'Lenovo LP40 Pro TWS',
    subtitle: 'ক্রিস্টাল ক্লিয়ার সাউন্ড, ডিপ বেস এবং একটানা ৫ ঘণ্টা ব্যাটারি লাইফ',
    priceText: 'মাত্র ৮৯০৳',
    regularPrice: '১৪৫০৳',
    discount: '৩৯% অফ',
    category: 'Earbuds & Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop&q=80',
    bgGradient: 'from-purple-950 via-slate-900 to-blue-950',
    accentColor: 'bg-purple-500'
  },
  {
    id: 3,
    badge: '🧢 প্রিমিয়াম কালেকশন',
    title: 'নিউ ইয়র্ক ইয়াঙ্কিস ক্যাপ',
    subtitle: '১০০% পিওর কটন ফেব্রিক, ক্লাসিক ৩ডি এমব্রয়ডারি ডিজাইন',
    priceText: 'মাত্র ৪৯০৳',
    regularPrice: '৮৫০৳',
    discount: '৪২% ছাড়',
    category: "Men's Caps & Fashion",
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&auto=format&fit=crop&q=80',
    bgGradient: 'from-amber-950 via-slate-900 to-stone-900',
    accentColor: 'bg-amber-500'
  }
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopNow,
  onSelectCategory,
  heroConfig
}) => {
  if (heroConfig && !heroConfig.enabled) {
    return null;
  }

  const slides = (heroConfig?.slides && heroConfig.slides.length > 0) ? heroConfig.slides : SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroConfig && heroConfig.autoplay === false) return;
    const intervalMs = (heroConfig?.autoplaySpeed || 5.5) * 1000;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slides.length, heroConfig?.autoplay, heroConfig?.autoplaySpeed]);

  const slide = slides[currentSlide] || slides[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Main Hero Slider (8 cols) */}
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden min-h-[360px] sm:min-h-[420px] flex items-center shadow-lg">
          
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} transition-all duration-700`} />

          {/* Decorative Pattern & Glow */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl" />

          {/* Content & Product Visual */}
          <div className="relative z-10 w-full p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Text */}
            <div className="flex-1 text-white text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-rose-300 border border-white/20 mb-3">
                {slide.badge}
              </span>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {slide.title}
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md line-clamp-2">
                {slide.subtitle}
              </p>

              {/* Pricing Box */}
              <div className="mt-4 flex items-baseline gap-3 justify-center md:justify-start">
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-400">
                  {slide.priceText}
                </span>
                <span className="text-sm sm:text-base text-slate-400 line-through">
                  {slide.regularPrice}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-500 text-white">
                  {slide.discount}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <button
                  id="hero-buy-now-btn"
                  onClick={onShopNow}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/40 hover:shadow-rose-600/60 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{slide.buttonText || 'এখনই অর্ডার করুন'}</span>
                </button>
                <button
                  onClick={() => onSelectCategory(slide.category)}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-sm transition-all flex items-center gap-1.5"
                >
                  <span>কালেকশন দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="mt-4 text-[11px] text-slate-400 flex items-center justify-center md:justify-start gap-3">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  ৭ দিনের রিপ্লেসমেন্ট
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  ক্যাশ অন ডেলিভারি
                </span>
              </p>
            </div>

            {/* Right Product Image */}
            <div className="w-44 h-44 sm:w-64 sm:h-64 relative flex-shrink-0">
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800/40">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>

          {/* Slider Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors z-20"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors z-20"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-rose-500' : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* Right Promotional Feature Cards (4 cols) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
          
          {/* Card 1: Fast Charger / Power Promo */}
          <div className="flex-1 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white flex items-center justify-between shadow-md relative overflow-hidden group cursor-pointer"
            onClick={() => onSelectCategory('Power & Charging')}
          >
            <div className="relative z-10">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white uppercase">
                ফাস্ট চার্জিং
              </span>
              <h3 className="text-base sm:text-lg font-black mt-1">
                ৬৫ ওয়াট GaN চার্জার
              </h3>
              <p className="text-xs text-amber-100 mt-0.5">ল্যাপটপ ও ফোনে সুপার ফাস্ট স্পিড</p>
              <p className="mt-2 text-sm font-black text-amber-950 bg-white/90 px-2.5 py-1 rounded-lg inline-block">
                শুরু মাত্র ১৮৫০৳
              </p>
            </div>
            <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0 border-2 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1609592424368-23f261905ea5?w=400&auto=format&fit=crop&q=80"
                alt="Fast Charger"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
          </div>

          {/* Card 2: Express Delivery Guarantee */}
          <div className="flex-1 bg-slate-900 rounded-2xl p-5 text-white flex items-center justify-between shadow-md border border-slate-800 relative overflow-hidden group cursor-pointer"
            onClick={onShopNow}
          >
            <div className="relative z-10">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ⚡ সুপার এক্সপ্রেস
              </span>
              <h3 className="text-base sm:text-lg font-black mt-1">
                ২৪ ঘণ্টার মধ্যে ডেলিভারি
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">ঢাকা সিটিতে দ্রুততম হোম ডেলিভারি</p>
              <span className="mt-2 text-xs font-bold text-rose-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>সকল পণ্য দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
              <Truck className="w-8 h-8" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
