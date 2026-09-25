import React from 'react';
import {
  Zap,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Truck,
  Clock,
  RefreshCw,
  ExternalLink,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { STORE_SETTINGS } from '../data/mockData';
import { ThemeConfig } from '../types';
import { GpeLogo } from './GpeLogo';

interface FooterProps {
  onOpenTracking: () => void;
  onSelectCategory: (cat: string) => void;
  onOpenAdmin: () => void;
  footerConfig?: ThemeConfig['footer'];
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracking,
  onSelectCategory,
  onOpenAdmin,
  footerConfig
}) => {
  const brandName = footerConfig?.brandName || 'GPE Bangladesh';
  const brandSuffix = footerConfig?.brandSuffix !== undefined ? footerConfig.brandSuffix : '.com.bd';
  const helpline = footerConfig?.helpline || STORE_SETTINGS.phone;
  const whatsapp = footerConfig?.whatsapp || STORE_SETTINGS.whatsapp;
  const email = footerConfig?.email || STORE_SETTINGS.email;
  const address = footerConfig?.address || STORE_SETTINGS.address;
  const aboutText =
    footerConfig?.aboutText ||
    'GPE Bangladesh (গ্যাজেট • ফোন • ইলেকট্রনিক্স) বাংলাদেশের শীর্ষস্থানীয় বিশ্বস্ত প্রযুক্তি ও স্মার্ট এক্সেসরিজ স্টোর। আমরা শতভাগ অরিজিনাল পণ্য, দ্রুততম হোম ডেলিভারি এবং ক্যাশ অন ডেলিভারি সুবিধা নিশ্চিত করি।';
  const copyright =
    footerConfig?.copyrightText ||
    '© 2026 GPE Bangladesh (Gadget, Phone & Electronics). All Rights Reserved.';

  const categoriesTitle = footerConfig?.categoriesTitle || 'জনপ্রিয় ক্যাটাগরি';
  const categoriesList =
    footerConfig?.categoriesList && footerConfig.categoriesList.length > 0
      ? footerConfig.categoriesList
      : [
          { label: 'স্মার্টওয়াচ ও কলিং ওয়াচ (Smart Watches)', categoryName: 'Smart Watches' },
          { label: 'টিডব্লিউএস ও ব্লুটুথ ইয়ারবাডস (TWS Earbuds)', categoryName: 'Earbuds & Audio' },
          { label: 'ফাস্ট চার্জার ও পাওয়ার ব্যাংক (GaN Chargers)', categoryName: 'Power & Charging' },
          { label: 'প্রিমিয়াম বেসবল ক্যাপ (Men\'s Caps)', categoryName: "Men's Caps & Fashion" },
          { label: 'হোম ও কিচেন গ্যাজেট (Home Appliances)', categoryName: 'Home & Kitchen' },
          { label: 'গেমিং কিবোর্ড ও মাউস (Gaming Accessories)', categoryName: 'Computer & Gaming' }
        ];

  const customerCareTitle = footerConfig?.customerCareTitle || 'গ্রাহক সেবা ও পলিসি';
  const customerCareItems =
    footerConfig?.customerCareItems && footerConfig.customerCareItems.length > 0
      ? footerConfig.customerCareItems
      : [
          { label: 'লাইভ অর্ডার ট্র্যাকিং (Track Order)', iconType: 'truck' as const, actionType: 'track' as const },
          { label: '৭ দিনের রিটার্ন ও রিপ্লেসমেন্ট পলিসি', iconType: 'refresh' as const, actionType: 'none' as const },
          { label: 'ওয়ারেন্টি দাবি করার নিয়মাবলী', iconType: 'shield' as const, actionType: 'none' as const },
          { label: 'ডেলিভারি সময়সূচী (ঢাকা ২৪h, সারাদেশে ৪৮-৭২h)', iconType: 'clock' as const, actionType: 'none' as const },
          { label: 'Laravel Merchant & Admin Management Panel', iconType: 'link' as const, actionType: 'admin' as const }
        ];

  const paymentTitle = footerConfig?.paymentTitle || 'পেমেন্ট মাধ্যমসমূহ';
  const paymentMethods =
    footerConfig?.paymentMethods && footerConfig.paymentMethods.length > 0
      ? footerConfig.paymentMethods
      : [
          { name: 'Cash on Delivery', colorScheme: 'emerald' },
          { name: 'bKash বিকাশ', colorScheme: 'pink' },
          { name: 'Nagad নগদ', colorScheme: 'orange' },
          { name: 'Rocket রকেট', colorScheme: 'purple' },
          { name: 'Visa / Master', colorScheme: 'blue' }
        ];

  const courierTitle = footerConfig?.courierTitle || 'ডেলিভারি পার্টনার';
  const couriersList =
    footerConfig?.couriersList && footerConfig.couriersList.length > 0
      ? footerConfig.couriersList
      : ['Steadfast Courier', 'Pathao Courier', 'RedX Express'];

  const legalLinks =
    footerConfig?.legalLinks && footerConfig.legalLinks.length > 0
      ? footerConfig.legalLinks
      : [
          { label: 'প্রাইভেসি পলিসি', url: '#' },
          { label: 'ব্যবহারের শর্তাবলী', url: '#' },
          { label: 'রিটার্ন পলিসি', url: '#' }
        ];

  // Helper for Payment Badge Colors
  const getBadgeColorClass = (color: string) => {
    switch (color) {
      case 'pink':
        return 'bg-pink-950/60 border-pink-700/50 text-pink-300';
      case 'orange':
        return 'bg-orange-950/60 border-orange-700/50 text-orange-300';
      case 'purple':
        return 'bg-purple-950/60 border-purple-700/50 text-purple-300';
      case 'blue':
        return 'bg-blue-950/60 border-blue-700/50 text-blue-300';
      case 'emerald':
      case 'green':
        return 'bg-emerald-950/60 border-emerald-700/50 text-emerald-400';
      case 'amber':
      case 'yellow':
        return 'bg-amber-950/60 border-amber-700/50 text-amber-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  // Helper for Icon Rendering
  const renderItemIcon = (iconType: string) => {
    switch (iconType) {
      case 'truck':
        return <Truck className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'refresh':
        return <RefreshCw className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'shield':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'clock':
        return <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      default:
        return <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <GpeLogo variant="footer" isDarkBg={true} />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {aboutText}
            </p>

            <div className="space-y-2 text-xs pt-1">
              {helpline && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white">হটলাইন: {helpline}</span>
                </div>
              )}
              {whatsapp && (
                <div className="flex items-center gap-2 text-slate-300">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp: {whatsapp}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{email}</span>
                </div>
              )}
              {address && (
                <div className="flex items-start gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {categoriesTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {categoriesList.map((item, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(item.categoryName)}
                    className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400 -ml-4 group-hover:ml-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {customerCareTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {customerCareItems.map((item, idx) => {
                if (item.actionType === 'track') {
                  return (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={onOpenTracking}
                        className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                      >
                        {renderItemIcon(item.iconType)}
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                }

                if (item.actionType === 'admin') {
                  return (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={onOpenAdmin}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors text-[11px] font-semibold underline flex items-center gap-1 text-left cursor-pointer"
                      >
                        {renderItemIcon(item.iconType)}
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={idx} className="flex items-center gap-1.5">
                    {renderItemIcon(item.iconType)}
                    <span>{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 4: Payment Methods & Couriers (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {paymentTitle}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {paymentMethods.map((pm, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-1 border rounded text-[11px] font-bold ${getBadgeColorClass(
                    pm.colorScheme
                  )}`}
                >
                  {pm.name}
                </span>
              ))}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-white pt-2">
              {courierTitle}
            </h4>
            <div className="text-[11px] space-y-1 text-slate-400">
              {couriersList.map((c, idx) => (
                <p key={idx}>• {c}</p>
              ))}
            </div>
          </div>

        </div>

        {/* Copyright & Trade License */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            {copyright}
          </p>
          <div className="flex items-center gap-3 flex-wrap text-[11px]">
            {legalLinks.map((link, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>•</span>}
                <a
                  href={link.url || '#'}
                  onClick={(e) => {
                    if (!link.url || link.url === '#') e.preventDefault();
                  }}
                  className="hover:text-slate-300 transition-colors"
                >
                  {link.label}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

