import React, { useState } from 'react';
import { Phone, MessageCircle, X, ChevronUp, ShoppingBag } from 'lucide-react';
import { STORE_SETTINGS } from '../data/mockData';

interface FloatingHotlineProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const FloatingHotline: React.FC<FloatingHotlineProps> = ({ cartCount, onOpenCart }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      
      {/* Mobile Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={onOpenCart}
          className="sm:hidden flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-2xl border-2 border-rose-500 animate-bounce"
        >
          <ShoppingBag className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold font-mono">{cartCount} টি পণ্য</span>
        </button>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white text-gray-700 hover:text-rose-600 shadow-lg border border-gray-200 flex items-center justify-center transition-all"
          title="Scroll to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Direct WhatsApp Floating Button */}
      <a
        id="floating-whatsapp-btn"
        href={`https://wa.me/${STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
          'আসসালামু আলাইকুম, আমি GPE Bangladesh স্টোর থেকে পণ্য অর্ডার করতে চাই।'
        )}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-full shadow-2xl transition-transform hover:scale-105 group cursor-pointer"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="text-xs font-bold hidden sm:inline">WhatsApp অর্ডার</span>
      </a>

      {/* Direct Phone Call Floating Button */}
      <a
        id="floating-phone-btn"
        href={`tel:${STORE_SETTINGS.phone}`}
        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2.5 rounded-full shadow-2xl transition-transform hover:scale-105 group cursor-pointer"
        title="Call Hotline"
      >
        <Phone className="w-5 h-5" />
        <span className="text-xs font-bold hidden sm:inline">{STORE_SETTINGS.phone}</span>
      </a>

    </div>
  );
};
