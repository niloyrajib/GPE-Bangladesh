import { ThemeConfig, DynamicSectionItem } from '../types';
import { STORE_SETTINGS, CATEGORIES } from './mockData';

export const DEFAULT_DYNAMIC_SECTIONS: DynamicSectionItem[] = [
  { id: 'sec-hero', type: 'hero', title: 'Hero Slider & Banners', enabled: true },
  { id: 'sec-trust', type: 'trustBadges', title: 'Trust Badges (৪টি সুবিধা ও গ্যারান্টি)', enabled: true },
  { id: 'sec-flash', type: 'flashDeals', title: 'Flash Deals & Countdown Timer', enabled: true },
  { id: 'sec-categories', type: 'categoriesSection', title: 'Category Icons Navigation Grid', enabled: true },
  { id: 'sec-catalog', type: 'catalogSection', title: 'Main Product Catalog & Filter', enabled: true },
  { id: 'sec-promo', type: 'promoBanner', title: 'Express Delivery Banner', enabled: true },
  { id: 'sec-reviews', type: 'reviewsSection', title: 'Customer Reviews & Feedback', enabled: true },
];

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  themeName: 'GPE Bangladesh Modern Tech v2.5',
  lastSaved: 'Just now',
  
  announcementBar: {
    enabled: true,
    text: 'সারাদেশে ক্যাশ অন ডেলিভারি (ঢাকা ৬০৳, বাইরে ১২০৳) • ১০০% অথেন্টিক গ্যাজেট ও ইলেকট্রনিক্স',
    phoneText: 'হটলাইন',
    phone: STORE_SETTINGS.phone,
    whatsappText: 'WhatsApp অর্ডার',
    whatsapp: STORE_SETTINGS.whatsapp,
    bgColor: '#0b1329',
    textColor: '#cbd5e1'
  },

  header: {
    storeName: 'GPE Bangladesh',
    storeTagline: 'গ্যাজেট • ফোন • ইলেকট্রনিক্স',
    logoUrl: '/logo.svg',
    sticky: true
  },

  hero: {
    enabled: true,
    autoplay: true,
    autoplaySpeed: 5,
    slides: [
      {
        id: 'slide-1',
        badge: '🔥 মেগা গ্যাজেট অফার ২০২৬',
        title: 'T900 Ultra 2 স্মার্টওয়াচ',
        subtitle: 'বিশাল ২.০৯ ইঞ্চি এইচডি ডিসপ্লে, কলিং সুবিধা ও ওয়্যারলেস চার্জার',
        priceText: 'মাত্র ১৩৯০৳',
        regularPrice: '২২৫০৳',
        discount: '৩৮% ছাড়',
        category: 'Smart Watches',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&auto=format&fit=crop&q=80',
        bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
        buttonText: 'এখনই অর্ডার করুন'
      },
      {
        id: 'slide-2',
        badge: '⚡ হাই-ফাই অডিও মেলা',
        title: 'Lenovo LP40 Pro TWS',
        subtitle: 'ক্রিস্টাল ক্লিয়ার সাউন্ড, ডিপ বেস এবং একটানা ৫ ঘণ্টা ব্যাটারি লাইফ',
        priceText: 'মাত্র ৮৯০৳',
        regularPrice: '১৪৫০৳',
        discount: '৩৯% অফ',
        category: 'Earbuds & Audio',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop&q=80',
        bgGradient: 'from-teal-950 via-slate-900 to-emerald-950',
        buttonText: 'অফার দেখুন'
      },
      {
        id: 'slide-3',
        badge: '🧢 প্রিমিয়াম কালেকশন',
        title: 'নিউ ইয়র্ক ইয়াঙ্কিস ক্যাপ',
        subtitle: '১০০% পিওর কটন ফেব্রিক, ক্লাসিক ৩ডি এমব্রয়ডারি ডিজাইন',
        priceText: 'মাত্র ৪৯০৳',
        regularPrice: '৮৫০৳',
        discount: '৪২% ছাড়',
        category: "Men's Caps & Fashion",
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&auto=format&fit=crop&q=80',
        bgGradient: 'from-slate-950 via-emerald-950 to-stone-900',
        buttonText: 'কালেকশন দেখুন'
      }
    ]
  },

  trustBadges: {
    enabled: true,
    badges: [
      {
        id: 'b-1',
        title: 'সারা দেশে হোম ডেলিভারি',
        subtitle: 'ঢাকা ৬০৳ • অন্যান্য জেলা ১২০৳',
        iconName: 'truck'
      },
      {
        id: 'b-2',
        title: 'ক্যাশ অন ডেলিভারি',
        subtitle: 'পণ্য হাতে পেয়ে মূল্য পরিশোধ',
        iconName: 'shield'
      },
      {
        id: 'b-3',
        title: '৭ দিনের রিপ্লেসমেন্ট',
        subtitle: 'সমস্যা হলে দ্রুত পরিবর্তন সুবিধা',
        iconName: 'refresh'
      },
      {
        id: 'b-4',
        title: '২৪/৭ কাস্টমার সাপোর্ট',
        subtitle: 'হটলাইন ও হোয়াটসঅ্যাপে সার্বক্ষণিক সহায়তা',
        iconName: 'phone'
      }
    ]
  },

  flashDeals: {
    enabled: true,
    title: 'আজকের মেগা ফ্ল্যাশ ডিল',
    badgeText: 'সীমিত সময়ের অফার',
    dealHours: 12
  },

  categoriesSection: {
    enabled: true,
    title: 'পপুলার ক্যাটাগরি ব্রাউজ করুন',
    subtitle: 'আপনার পছন্দের পণ্যটি খুব সহজেই খুঁজে নিন',
    items: CATEGORIES
  },

  catalogSection: {
    title: 'সব কালেকশন ও ট্রেন্ডিং গ্যাজেট',
    subtitle: 'অরিজিনাল ব্র্যান্ড ওয়ারেন্টি সহ সেরা মূল্যে',
    columns: 3
  },

  promoBanner: {
    enabled: true,
    badge: '⚡ বিশেষ মেগা ধামাকা',
    title: 'অরিজিনাল গ্যাজেট কিনুন নিশ্চিন্তে',
    subtitle: 'ঢাকা সিটিতে ২৪ ঘণ্টায় এক্সপ্রেস ডেলিভারি এবং ফ্রি রিটার্ন গ্যারান্টি!',
    buttonText: 'অর্ডার ট্র্যাক করুন',
    buttonLink: 'tracking',
    bgGradient: 'from-emerald-700 via-teal-700 to-cyan-800'
  },

  reviewsSection: {
    enabled: true,
    title: 'গ্রাহকদের সন্তুষ্টির রিভিউ',
    subtitle: 'হাজারো সন্তুষ্ট গ্রাহকের আসল অভিজ্ঞতা'
  },

  footer: {
    aboutText: 'GPE Bangladesh (Gadget, Phone & Electronics) দেশের অন্যতম বিশ্বস্ত ও আধুনিক টেক অনলাইন শপিং প্ল্যাটফর্ম। আমরা শতভাগ অরিজিনাল পণ্য, দ্রুততম এক্সপ্রেস ডেলিভারি এবং ক্যাশ অন ডেলিভারি সুবিধা নিশ্চিত করি।',
    helpline: STORE_SETTINGS.phone,
    whatsapp: STORE_SETTINGS.whatsapp,
    email: STORE_SETTINGS.email,
    address: STORE_SETTINGS.address,
    copyrightText: '© 2026 GPE Bangladesh. All Rights Reserved. Gadget • Phone • Electronics',
    brandName: 'GPE Bangladesh',
    brandSuffix: '.com.bd',
    categoriesTitle: 'জনপ্রিয় ক্যাটাগরি',
    categoriesList: [
      { label: 'স্মার্টওয়াচ ও কলিং ওয়াচ (Smart Watches)', categoryName: 'Smart Watches' },
      { label: 'টিডব্লিউএস ও ব্লুটুথ ইয়ারবাডস (TWS Earbuds)', categoryName: 'Earbuds & Audio' },
      { label: 'ফাস্ট চার্জার ও পাওয়ার ব্যাংক (GaN Chargers)', categoryName: 'Power & Charging' },
      { label: 'প্রিমিয়াম বেসবল ক্যাপ (Men\'s Caps)', categoryName: "Men's Caps & Fashion" },
      { label: 'হোম ও কিচেন গ্যাজেট (Home Appliances)', categoryName: 'Home & Kitchen' },
      { label: 'গেমিং কিবোর্ড ও মাউস (Gaming Accessories)', categoryName: 'Computer & Gaming' }
    ],
    customerCareTitle: 'গ্রাহক সেবা ও পলিসি',
    customerCareItems: [
      { label: 'লাইভ অর্ডার ট্র্যাকিং (Track Order)', iconType: 'truck', actionType: 'track' },
      { label: '৭ দিনের রিটার্ন ও রিপ্লেসমেন্ট পলিসি', iconType: 'refresh', actionType: 'none' },
      { label: 'ওয়ারেন্টি দাবি করার নিয়মাবলী', iconType: 'shield', actionType: 'none' },
      { label: 'ডেলিভারি সময়সূচী (ঢাকা ২৪h, সারাদেশে ৪৮-৭২h)', iconType: 'clock', actionType: 'none' },
      { label: 'Laravel Merchant & Admin Management Panel', iconType: 'link', actionType: 'admin' }
    ],
    paymentTitle: 'পেমেন্ট মাধ্যমসমূহ',
    paymentMethods: [
      { name: 'Cash on Delivery', colorScheme: 'emerald' },
      { name: 'bKash বিকাশ', colorScheme: 'pink' },
      { name: 'Nagad নগদ', colorScheme: 'orange' },
      { name: 'Rocket রকেট', colorScheme: 'purple' },
      { name: 'Visa / Master', colorScheme: 'blue' }
    ],
    courierTitle: 'ডেলিভারি পার্টনার',
    couriersList: ['Steadfast Courier', 'Pathao Courier', 'RedX Express'],
    legalLinks: [
      { label: 'প্রাইভেসি পলিসি', url: '#' },
      { label: 'ব্যবহারের শর্তাবলী', url: '#' },
      { label: 'রিটার্ন পলিসি', url: '#' }
    ]
  },

  styling: {
    primaryColor: '#059669', // Electric Emerald (Stitch Design System)
    accentColor: '#06b6d4',  // Bright Cyan / Teal (Stitch Design System)
    borderRadius: 'rounded-xl'
  },

  sectionsOrder: DEFAULT_DYNAMIC_SECTIONS,

  seo: {
    metaTitle: 'GPE Bangladesh - Gadget, Phone & Electronics Hub',
    metaDescription: 'Shop genuine gadgets, smartphones, smartwatches, TWS earbuds and electronic accessories at GPE Bangladesh with fast Cash on Delivery across Bangladesh.',
    metaKeywords: 'gpe bangladesh, gadget store bd, smart watches bd, tws earbuds dhaka, online shopping bangladesh, cod dhaka, genuine tech retail',
    author: 'GPE Bangladesh Inc.',
    canonicalUrl: 'https://gpe.com.bd',
    ogTitle: 'GPE Bangladesh - Authentic Gadgets & Electronics Hub',
    ogDescription: 'Shop verified gadgets with nationwide Cash on Delivery, official warranty, bKash/Nagad instant payment, and 24-48h express delivery across Bangladesh.',
    ogImage: '/logo.svg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterCreator: '@gpebangladesh',
    enableStructuredData: true,
    structuredDataType: 'OnlineStore',
    lastUpdated: '2026-03-30'
  }
};
