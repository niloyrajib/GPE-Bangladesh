import React from 'react';
import { Phone, MessageCircle, Truck, UserCheck, Sparkles } from 'lucide-react';
import { STORE_SETTINGS } from '../../data/mockData';
import { ThemeConfig } from '../../types';

interface TopBarProps {
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  lang: 'en' | 'bn';
  setLang: (l: 'en' | 'bn') => void;
  announcementConfig?: ThemeConfig['announcementBar'];
  onOpenThemeCustomizer?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenTracking,
  onOpenAdmin,
  lang,
  setLang,
  announcementConfig,
  onOpenThemeCustomizer
}) => {
  if (announcementConfig && !announcementConfig.enabled) {
    return null;
  }

  const phone = announcementConfig?.phone || STORE_SETTINGS.phone;
  const whatsapp = announcementConfig?.whatsapp || STORE_SETTINGS.whatsapp;
  const announcementText =
    announcementConfig?.text ||
    'সারাদেশে ক্যাশ অন ডেলিভারি (ঢাকা ৬০৳, বাইরে ১২০৳) • দ্রুত ডেলিভারি';
  const bgColor = announcementConfig?.bgColor || '#0f172a';
  const textColor = announcementConfig?.textColor || '#cbd5e1';

  return (
    <div
      id="top-announcement-bar"
      style={{ backgroundColor: bgColor, color: textColor }}
      className="text-xs py-2 border-b border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Hotline & WhatsApp */}
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
          <a
            id="topbar-phone-link"
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white tracking-wide">
              হটলাইন: {phone}
            </span>
          </a>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <a
            id="topbar-whatsapp-link"
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp অর্ডার</span>
          </a>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden lg:flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>{announcementText}</span>
          </span>
        </div>

        {/* Right: Quick actions & Theme Customizer / Admin toggle */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {onOpenThemeCustomizer && (
            <button
              id="topbar-customize-theme-btn"
              onClick={onOpenThemeCustomizer}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-all text-[11px] font-bold"
              title="শপিফাই নো-কোড থিম এডিটর ওপেন করুন"
            >
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>🎨 Customize Theme</span>
            </button>
          )}

          <button
            id="topbar-track-order-btn"
            onClick={onOpenTracking}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
          >
            <Truck className="w-3.5 h-3.5 text-sky-400" />
            <span>{lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
          </button>

          <span className="text-slate-700">|</span>

          <button
            id="topbar-admin-portal-btn"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 hover:text-white border border-emerald-500/30 transition-all text-[11px] font-medium cursor-pointer"
            title="Shop Admin Panel & Order Fulfillment Dashboard"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Shop Admin Panel</span>
          </button>

          <span className="text-slate-700">|</span>

          {/* Language Switch */}
          <div className="flex items-center bg-slate-800 rounded px-1.5 py-0.5 border border-slate-700">
            <button
              id="lang-btn-bn"
              onClick={() => setLang('bn')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                lang === 'bn' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              id="lang-btn-en"
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                lang === 'en' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
