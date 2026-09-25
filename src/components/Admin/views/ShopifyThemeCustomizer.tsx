import React, { useState } from 'react';
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  Maximize2,
  Save,
  Check,
  Undo,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles,
  Sliders,
  Palette,
  Layers,
  Image as ImageIcon,
  Type,
  Layout,
  ExternalLink,
  Flame,
  Truck,
  ShieldCheck,
  RefreshCw,
  Phone,
  MessageCircle,
  Clock,
  Zap,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Video,
  Grid,
  Mail,
  Edit3,
  Play,
  Upload
} from 'lucide-react';
import { ThemeConfig, HeroSlideConfig, Product, Category, DynamicSectionItem, DynamicSectionType } from '../../../types';
import { DEFAULT_THEME_CONFIG, DEFAULT_DYNAMIC_SECTIONS } from '../../../data/defaultThemeConfig';
import { CATEGORIES } from '../../../data/mockData';
import { CategorySectionEditor, FALLBACK_CATEGORY_IMAGE } from './CategorySectionEditor';
import {
  AddSectionModal,
  VideoBannerEditor,
  FaqAccordionEditor,
  FeatureGridEditor,
  NewsletterEditor
} from './DynamicBlockEditors';
import { FeatureGridSection } from '../../DynamicSections/FeatureGridSection';
import { FaqAccordionSection } from '../../DynamicSections/FaqAccordionSection';
import { VideoBannerSection } from '../../DynamicSections/VideoBannerSection';
import { NewsletterSection } from '../../DynamicSections/NewsletterSection';
import { CustomPromoSection } from '../../DynamicSections/CustomPromoSection';
import { FooterSettingsEditor } from './FooterSettingsEditor';
import { Footer } from '../../Footer';

interface ShopifyThemeCustomizerProps {
  initialTheme: ThemeConfig;
  products: Product[];
  onSaveTheme: (updatedTheme: ThemeConfig) => void;
  onExit: () => void;
  onOpenLiveStore: () => void;
}

type EditorSection =
  | 'overview'
  | 'announcement'
  | 'header'
  | 'hero'
  | 'trust'
  | 'flash'
  | 'categories'
  | 'catalog'
  | 'promo'
  | 'footer'
  | 'theme_settings'
  | string;

export const ShopifyThemeCustomizer: React.FC<ShopifyThemeCustomizerProps> = ({
  initialTheme,
  products,
  onSaveTheme,
  onExit,
  onOpenLiveStore
}) => {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);
  const [activeSection, setActiveSection] = useState<EditorSection>('overview');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile' | 'fullscreen'>('desktop');
  const [sidebarTab, setSidebarTab] = useState<'sections' | 'settings'>('sections');
  const [isSaved, setIsSaved] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<'home' | 'about' | 'faq' | 'contact'>('home');

  // Active slide in hero editor
  const [editingSlideIndex, setEditingSlideIndex] = useState<number>(0);

  const activeSections: DynamicSectionItem[] =
    theme.sectionsOrder && theme.sectionsOrder.length > 0
      ? theme.sectionsOrder
      : DEFAULT_DYNAMIC_SECTIONS;

  const currentEditingSection = activeSections.find(
    (s) => s.id === activeSection || s.type === activeSection
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const updateTheme = (updater: (prev: ThemeConfig) => ThemeConfig) => {
    setTheme((prev) => {
      const next = updater(prev);
      return next;
    });
    setIsSaved(false);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const current = [...activeSections];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= current.length) return;
    const temp = current[index];
    current[index] = current[target];
    current[target] = temp;
    updateTheme((prev) => ({ ...prev, sectionsOrder: current }));
    showToast(direction === 'up' ? '⬆️ সেকশন উপরে তোলা হয়েছে' : '⬇️ সেকশন নিচে নামানো হয়েছে');
  };

  const toggleSectionEnabled = (id: string) => {
    const updated = activeSections.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    updateTheme((prev) => ({ ...prev, sectionsOrder: updated }));
  };

  const deleteSection = (id: string, title: string) => {
    if (confirm(`আপনি কি "${title}" সেকশনটি মুছে ফেলতে চান?`)) {
      const updated = activeSections.filter((s) => s.id !== id);
      updateTheme((prev) => ({ ...prev, sectionsOrder: updated }));
      if (activeSection === id) {
        setActiveSection('overview');
      }
      showToast(`"${title}" সেকশন মুছে ফেলা হয়েছে`);
    }
  };

  const updateDynamicSectionData = (secId: string, customData: any) => {
    const updated = activeSections.map((s) =>
      s.id === secId ? { ...s, customData } : s
    );
    updateTheme((prev) => ({ ...prev, sectionsOrder: updated }));
  };

  const handleAddSection = (type: DynamicSectionType) => {
    const id = `sec-${type}-${Date.now().toString().slice(-4)}`;
    let newSec: DynamicSectionItem = {
      id,
      type,
      title: type,
      enabled: true
    };

    if (type === 'videoBanner') {
      newSec.title = 'লাইভ আনবক্সিং ভিডিও ব্যানার';
      newSec.customData = {
        badge: '🎬 লাইভ ভিডিও আনবক্সিং',
        subtitle: 'গ্যাজেট কেনার আগে আসল আনবক্সিং ভিডিও দেখে নিন',
        description: 'আমাদের নিজস্ব টেক স্টুডিও থেকে পণ্যের বিল্ড কোয়ালিটি এবং আসল ফিচার রিভিউ দেখুন।',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
        image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&auto=format&fit=crop&q=80',
        buttonText: 'ভিডিও দেখে অর্ডার করুন'
      };
    } else if (type === 'faqAccordion') {
      newSec.title = 'সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)';
      newSec.customData = {
        badge: '❓ সাধারণ জিজ্ঞাসা',
        subtitle: 'সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর',
        description: 'আপনার যেকোনো প্রশ্নের দ্রুত সমাধান পেতে নিচে দেখুন',
        faqs: [
          { id: 'f1', question: 'অর্ডার ডেলিভারি কত দ্রুত সম্পন্ন হয়?', answer: 'ঢাকার ভেতর ২৪ ঘণ্টা এবং ঢাকার বাইরে ৪৮-৭২ ঘণ্টার মধ্যে।' },
          { id: 'f2', question: 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা) দেওয়া যাবে কি?', answer: 'হ্যাঁ, ১০০% ক্যাশ অন ডেলিভারি সুবিধা আছে।' },
          { id: 'f3', question: 'ডিফেক্ট থাকলে পরিবর্তন করব কীভাবে?', answer: 'পণ্য পাওয়ার ৭ দিনের মধ্যে আমাদের হটলাইনে কল করলেই দ্রুত রিপ্লেসমেন্ট দেওয়া হবে।' }
        ]
      };
    } else if (type === 'featureGrid') {
      newSec.title = 'সার্ভিস ও ফিচার হাইলাইটস গ্রিড';
      newSec.customData = {
        badge: '✨ প্রিমিয়াম সেবা',
        subtitle: 'কেন আমাদের থেকে শপিং করবেন?',
        description: 'আমরা দিচ্ছি শতভাগ নির্ভরযোগ্য ও দ্রুততম ই-কমার্স অভিজ্ঞতা',
        features: [
          { id: 'f1', title: 'অফিসিয়াল গ্যাজেট', desc: '১০০% আসল ও ব্র্যান্ড ওয়ারেন্টি', icon: 'award' },
          { id: 'f2', title: 'দ্রুততম ডেলিভারি', desc: '২৪-৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি', icon: 'truck' },
          { id: 'f3', title: '৭ দিনের রিটার্ন', desc: 'সহজ ও দ্রুত এক্সচেঞ্জ সুবিধা', icon: 'refresh' },
          { id: 'f4', title: '২৪/৭ সাপোর্ট', desc: 'হটলাইন ও হোয়াটসঅ্যাপ সেবা', icon: 'headphones' }
        ]
      };
    } else if (type === 'newsletter') {
      newSec.title = 'VIP ক্লাব ও ১০০৳ ডিসকাউন্ট কুপন';
      newSec.customData = {
        badge: '🎁 স্পেশাল অফার',
        subtitle: 'VIP ক্লাবে যোগ দিন ও পান ১০০৳ ছাড়ের কুপন!',
        description: 'আমাদের সাপ্তাহিক সিক্রেট ডিসকাউন্ট ও নতুন প্রোডাক্ট সবার আগে পেতে সাইনআপ করুন।',
        buttonText: 'কুপন কোড সংগ্রহ করুন'
      };
    } else if (type === 'promoBanner') {
      newSec.title = 'বিশেষ অফার ব্যানার';
      newSec.customData = {
        badge: '⚡ বিশেষ মেগা ধামাকা',
        subtitle: 'অরিজিনাল গ্যাজেট কিনুন নিশ্চিন্তে',
        description: 'ঢাকা সিটিতে ২৪ ঘণ্টায় এক্সপ্রেস ডেলিভারি এবং ফ্রি রিটার্ন গ্যারান্টি!',
        buttonText: 'অর্ডার করুন',
        bgGradient: 'from-slate-900 via-rose-950 to-slate-900'
      };
    } else if (type === 'flashDeals') {
      newSec.title = 'Flash Deals & Countdown Timer';
    } else if (type === 'hero') {
      newSec.title = 'Hero Slider & Banners';
    } else if (type === 'trustBadges') {
      newSec.title = 'Trust Badges (৪টি সুবিধা ও গ্যারান্টি)';
    } else if (type === 'categoriesSection') {
      newSec.title = 'Category Icons Navigation Grid';
    } else if (type === 'catalogSection') {
      newSec.title = 'Main Product Catalog & Filter';
    } else if (type === 'reviewsSection') {
      newSec.title = 'Customer Reviews & Feedback';
    }

    const updated = [...activeSections, newSec];
    updateTheme((prev) => ({ ...prev, sectionsOrder: updated }));
    setIsAddSectionOpen(false);
    setActiveSection(newSec.id);
    showToast(`"${newSec.title}" ব্লক পেজে যুক্ত করা হয়েছে!`);
  };

  const applyPresetLayout = (presetKey: 'default' | 'flashSale' | 'minimal') => {
    let preset: DynamicSectionItem[] = [];
    if (presetKey === 'default') {
      preset = DEFAULT_DYNAMIC_SECTIONS;
    } else if (presetKey === 'flashSale') {
      preset = [
        { id: 'sec-hero', type: 'hero', title: 'Hero Slider & Banners', enabled: true },
        { id: 'sec-flash', type: 'flashDeals', title: 'Flash Deals & Countdown Timer', enabled: true },
        {
          id: 'sec-video',
          type: 'videoBanner',
          title: 'লাইভ ভিডিও আনবক্সিং ব্যানার',
          enabled: true,
          customData: {
            badge: '🎬 লাইভ ভিডিও আনবক্সিং',
            subtitle: 'গ্যাজেট কেনার আগে আসল আনবক্সিং ভিডিও দেখে নিন',
            description: 'আমাদের নিজস্ব টেক স্টুডিও থেকে পণ্যের বিল্ড কোয়ালিটি এবং আসল ফিচার রিভিউ দেখুন।',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
            image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&auto=format&fit=crop&q=80',
            buttonText: 'ভিডিও দেখে অর্ডার করুন'
          }
        },
        { id: 'sec-catalog', type: 'catalogSection', title: 'Main Product Catalog & Filter', enabled: true },
        {
          id: 'sec-faq',
          type: 'faqAccordion',
          title: 'সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)',
          enabled: true,
          customData: {
            badge: '❓ সাধারণ জিজ্ঞাসা',
            subtitle: 'সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর',
            description: 'আপনার যেকোনো প্রশ্নের দ্রুত সমাধান পেতে নিচে দেখুন',
            faqs: [
              { id: 'f1', question: 'ডেলিভারি চার্জ কত টাকা?', answer: 'ঢাকার ভেতর ৬০ টাকা, বাইরে ১২০ টাকা।' },
              { id: 'f2', question: 'পণ্য দেখে টাকা দেওয়া যাবে?', answer: 'হ্যাঁ, ১০০% ক্যাশ অন ডেলিভারি।' }
            ]
          }
        },
        { id: 'sec-promo', type: 'promoBanner', title: 'Express Delivery Banner', enabled: true },
        {
          id: 'sec-newsletter',
          type: 'newsletter',
          title: 'VIP কুপন ও ডিসকাউন্ট',
          enabled: true,
          customData: {
            badge: '🎁 স্পেশাল অফার',
            subtitle: 'VIP ক্লাবে যোগ দিন ও পান ১০০৳ ছাড়ের কুপন!',
            description: 'আমাদের সাপ্তাহিক সিক্রেট ডিসকাউন্ট ও নতুন প্রোডাক্ট লঞ্চ সবার আগে জানার জন্য সাবস্ক্রাইব করুন।',
            buttonText: 'কুপন কোড সংগ্রহ করুন'
          }
        }
      ];
    } else if (presetKey === 'minimal') {
      preset = [
        { id: 'sec-hero', type: 'hero', title: 'Hero Slider & Banners', enabled: true },
        { id: 'sec-categories', type: 'categoriesSection', title: 'Category Icons Navigation Grid', enabled: true },
        {
          id: 'sec-features',
          type: 'featureGrid',
          title: 'সার্ভিস ও ফিচার হাইলাইটস গ্রিড',
          enabled: true,
          customData: {
            badge: '✨ প্রিমিয়াম সেবা',
            subtitle: 'কেন আমাদের থেকে শপিং করবেন?',
            description: 'আমরা দিচ্ছি শতভাগ নির্ভরযোগ্য ও দ্রুততম ই-কমার্স অভিজ্ঞতা',
            features: [
              { id: 'f1', title: 'অফিসিয়াল গ্যাজেট', desc: '১০০% আসল ও ব্র্যান্ড ওয়ারেন্টি', icon: 'award' },
              { id: 'f2', title: 'দ্রুততম ডেলিভারি', desc: '২৪-৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি', icon: 'truck' },
              { id: 'f3', title: '৭ দিনের রিটার্ন', desc: 'সহজ ও দ্রুত এক্সচেঞ্জ সুবিধা', icon: 'refresh' },
              { id: 'f4', title: '২৪/৭ সাপোর্ট', desc: 'হটলাইন ও হোয়াটসঅ্যাপ সেবা', icon: 'headphones' }
            ]
          }
        },
        { id: 'sec-catalog', type: 'catalogSection', title: 'Main Product Catalog & Filter', enabled: true },
        { id: 'sec-reviews', type: 'reviewsSection', title: 'Customer Reviews & Feedback', enabled: true },
        {
          id: 'sec-newsletter',
          type: 'newsletter',
          title: 'VIP কুপন ও ডিসকাউন্ট',
          enabled: true,
          customData: {
            badge: '🎁 স্পেশাল অফার',
            subtitle: 'VIP ক্লাবে যোগ দিন ও পান ১০০৳ ছাড়ের কুপন!',
            description: 'আমাদের সাপ্তাহিক সিক্রেট ডিসকাউন্ট ও নতুন প্রোডাক্ট লঞ্চ সবার আগে জানার জন্য সাবস্ক্রাইব করুন।',
            buttonText: 'কুপন কোড সংগ্রহ করুন'
          }
        }
      ];
    }
    updateTheme((prev) => ({ ...prev, sectionsOrder: preset }));
    showToast('লেআউট প্রিসেট সফলভাবে প্রয়োগ করা হয়েছে!');
  };

  const handleSave = () => {
    const updatedWithTimestamp = {
      ...theme,
      lastSaved: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setTheme(updatedWithTimestamp);
    onSaveTheme(updatedWithTimestamp);
    setIsSaved(true);
    showToast('🎉 থিম সফলভাবে সেভ ও লাইভ পাবলিশ করা হয়েছে!');
  };

  const handleResetToDefault = () => {
    if (confirm('আপনি কি থিমের ডিফল্ট ডিজাইন ও কালার ফেরত আনতে চান?')) {
      setTheme(DEFAULT_THEME_CONFIG);
      setIsSaved(false);
      showToast('ডিফল্ট থিম কনফিগারেশন লোড হয়েছে!');
    }
  };

  // Image presets for quick hero slide image selection
  const HERO_IMAGE_PRESETS = [
    {
      label: 'Smart Watch',
      url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&auto=format&fit=crop&q=80'
    },
    {
      label: 'Earbuds TWS',
      url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop&q=80'
    },
    {
      label: 'Baseball Cap',
      url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&auto=format&fit=crop&q=80'
    },
    {
      label: 'Fast Charger',
      url: 'https://images.unsplash.com/photo-1609592424368-23f261905ea5?w=900&auto=format&fit=crop&q=80'
    },
    {
      label: 'Gaming Setup',
      url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop&q=80'
    },
    {
      label: 'Premium Watch 2',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80'
    }
  ];

  // Primary color preset palettes
  const COLOR_PALETTES = [
    { name: 'GPE Stitch Emerald (ডিফল্ট)', hex: '#059669' },
    { name: 'Cyan / Teal Accent', hex: '#06b6d4' },
    { name: 'Amber Glow', hex: '#f59e0b' },
    { name: 'Royal Blue', hex: '#2563eb' },
    { name: 'Midnight Slate', hex: '#0f172a' },
    { name: 'Rose Red', hex: '#e11d48' }
  ];

  const currentSlide = theme.hero.slides[editingSlideIndex] || theme.hero.slides[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a1a] flex flex-col font-sans select-none overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-emerald-400 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP SHOPIFY CUSTOMIZER HEADER BAR */}
      <header className="h-12 bg-[#1a1a1a] text-white px-3 flex items-center justify-between border-b border-[#303030] shrink-0 z-20">
        {/* Left: Exit & Page Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Return to Admin"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <div className="h-4 w-px bg-gray-700" />

          <div className="flex items-center gap-1.5 bg-[#2b2b2b] px-2.5 py-1 rounded-lg border border-gray-700 text-xs">
            <span className="text-gray-400 font-medium">Page:</span>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value as any)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
            >
              <option value="home" className="bg-gray-900 text-white">Home page (হোমপেজ)</option>
              <option value="about" className="bg-gray-900 text-white">About Us (আমাদের সম্পর্কে)</option>
              <option value="faq" className="bg-gray-900 text-white">FAQ (সাধারণ জিজ্ঞাসা)</option>
              <option value="contact" className="bg-gray-900 text-white">Contact Us (যোগাযোগ)</option>
            </select>
          </div>

          <span className="text-[11px] text-gray-400 hidden lg:inline">
            Theme: <strong className="text-gray-200">{theme.themeName}</strong>
          </span>
        </div>

        {/* Center: Device View Switcher */}
        <div className="flex items-center bg-[#2b2b2b] p-0.5 rounded-lg border border-gray-700">
          <button
            type="button"
            onClick={() => setDeviceView('desktop')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              deviceView === 'desktop' ? 'bg-gray-800 text-white shadow-xs' : 'text-gray-400 hover:text-white'
            }`}
            title="Desktop View (100% Width)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceView('mobile')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              deviceView === 'mobile' ? 'bg-gray-800 text-white shadow-xs' : 'text-gray-400 hover:text-white'
            }`}
            title="Mobile Smartphone View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceView(deviceView === 'fullscreen' ? 'desktop' : 'fullscreen')}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
              deviceView === 'fullscreen' ? 'bg-gray-800 text-white shadow-xs' : 'text-gray-400 hover:text-white'
            }`}
            title="Fullscreen Preview"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Save & Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg text-xs font-medium transition-colors hidden sm:flex items-center gap-1"
            title="Reset theme to original factory default"
          >
            <Undo className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onOpenLiveStore}
            className="px-2.5 py-1 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            title="Open real storefront in new view"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">View Store</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
              isSaved
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/40 animate-pulse'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved' : 'Save & Publish'}</span>
          </button>
        </div>
      </header>

      {/* MAIN BODY: LEFT SIDEBAR CONTROLS + RIGHT LIVE PREVIEW CANVAS */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT CUSTOMIZER SIDEBAR (Hidden in fullscreen mode) */}
        {deviceView !== 'fullscreen' && (
          <aside className="w-80 md:w-96 bg-white border-r border-gray-200 flex flex-col h-full shrink-0 z-10 shadow-lg overflow-hidden">
            {/* Sidebar Tabs (Sections vs Theme Settings) */}
            <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setSidebarTab('sections');
                  setActiveSection('overview');
                }}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  sidebarTab === 'sections'
                    ? 'border-gray-900 text-gray-900 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sections</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSidebarTab('settings');
                  setActiveSection('theme_settings');
                }}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  sidebarTab === 'settings'
                    ? 'border-gray-900 text-gray-900 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Theme settings</span>
              </button>
            </div>

            {/* Sub-header navigation (Back button if drilled into section) */}
            {activeSection !== 'overview' && activeSection !== 'theme_settings' && (
              <div className="px-4 py-2.5 bg-gray-100/70 border-b border-gray-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSection('overview')}
                  className="text-xs font-bold text-gray-700 hover:text-gray-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Sections</span>
                </button>
                <span className="text-gray-300">/</span>
                <span className="text-xs font-bold text-gray-900 capitalize">
                  {activeSection.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* Scrollable Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* TAB 1: SECTIONS TREE OVERVIEW */}
              {sidebarTab === 'sections' && activeSection === 'overview' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>নো-কোড থিম এডিটর</span>
                    </p>
                    যেকোনো সেকশনে ক্লিক করে টেক্সট, ছবি ও কালার পরিবর্তন করুন। ডানপাশে সাথে সাথে লাইভ প্রিভিউ দেখতে পাবেন।
                  </div>

                  {/* Header Group */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1">
                      Header Group
                    </span>

                    {/* Announcement Bar */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-gray-100/70 transition-colors">
                      <button
                        type="button"
                        onClick={() => setActiveSection('announcement')}
                        className="flex items-center gap-2.5 flex-1 text-left"
                      >
                        <Zap className="w-4 h-4 text-rose-500" />
                        <div>
                          <p className="font-bold text-gray-900">Announcement Bar</p>
                          <p className="text-[10px] text-gray-500 truncate max-w-[180px]">
                            {theme.announcementBar.text}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateTheme((prev) => ({
                            ...prev,
                            announcementBar: { ...prev.announcementBar, enabled: !prev.announcementBar.enabled }
                          }))
                        }
                        className="p-1 text-gray-400 hover:text-gray-700"
                        title={theme.announcementBar.enabled ? 'Hide section' : 'Show section'}
                      >
                        {theme.announcementBar.enabled ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>

                    {/* Header / Logo */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-gray-100/70 transition-colors">
                      <button
                        type="button"
                        onClick={() => setActiveSection('header')}
                        className="flex items-center gap-2.5 flex-1 text-left"
                      >
                        <ShoppingBag className="w-4 h-4 text-gray-700" />
                        <div>
                          <p className="font-bold text-gray-900">Header & Logo</p>
                          <p className="text-[10px] text-gray-500">{theme.header.storeName}</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Template Sections (Dynamic Reorderable & Addable Blocks) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Template Sections ({activeSections.length} টি ব্লক)
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddSectionOpen(true)}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Section</span>
                      </button>
                    </div>

                    {/* Quick Preset Bar */}
                    <div className="bg-gray-100/80 p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-semibold text-gray-600">
                      <span className="px-1 text-gray-400">প্রিসেট:</span>
                      <button
                        type="button"
                        onClick={() => applyPresetLayout('default')}
                        className="px-2 py-0.5 rounded bg-white hover:bg-gray-200 text-gray-800 shadow-2xs cursor-pointer"
                        title="স্ট্যান্ডার্ড স্টোরফ্রন্ট লেআউট"
                      >
                        স্ট্যান্ডার্ড
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetLayout('flashSale')}
                        className="px-2 py-0.5 rounded bg-white hover:bg-gray-200 text-rose-600 shadow-2xs cursor-pointer"
                        title="হাই-কনভার্সন ফ্ল্যাশ সেল ল্যান্ডিং পেজ"
                      >
                        ফ্ল্যাশ সেল
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetLayout('minimal')}
                        className="px-2 py-0.5 rounded bg-white hover:bg-gray-200 text-indigo-600 shadow-2xs cursor-pointer"
                        title="মিনিমালিস্ট মডার্ন ডিজাইন"
                      >
                        মিনিমাল
                      </button>
                    </div>

                    {/* Dynamic Sections List */}
                    <div className="space-y-1.5">
                      {activeSections.map((sec, index) => {
                        const getIcon = () => {
                          switch (sec.type) {
                            case 'videoBanner':
                              return <Video className="w-4 h-4 text-red-500" />;
                            case 'faqAccordion':
                              return <HelpCircle className="w-4 h-4 text-amber-500" />;
                            case 'featureGrid':
                              return <Grid className="w-4 h-4 text-emerald-500" />;
                            case 'newsletter':
                              return <Mail className="w-4 h-4 text-purple-500" />;
                            case 'promoBanner':
                              return <Sparkles className="w-4 h-4 text-rose-500" />;
                            case 'flashDeals':
                              return <Flame className="w-4 h-4 text-rose-600" />;
                            case 'hero':
                              return <ImageIcon className="w-4 h-4 text-indigo-500" />;
                            case 'trustBadges':
                              return <Truck className="w-4 h-4 text-emerald-500" />;
                            case 'categoriesSection':
                              return <Layout className="w-4 h-4 text-blue-500" />;
                            case 'catalogSection':
                              return <ShoppingBag className="w-4 h-4 text-purple-500" />;
                            case 'reviewsSection':
                              return <Sparkles className="w-4 h-4 text-amber-500" />;
                            default:
                              return <Layers className="w-4 h-4 text-gray-500" />;
                          }
                        };

                        const handleRowClick = () => {
                          if (['hero', 'trustBadges', 'flashDeals', 'categoriesSection', 'catalogSection', 'promoBanner', 'footer'].includes(sec.type)) {
                            if (sec.type === 'trustBadges') setActiveSection('trust');
                            else if (sec.type === 'flashDeals') setActiveSection('flash');
                            else if (sec.type === 'categoriesSection') setActiveSection('categories');
                            else if (sec.type === 'catalogSection') setActiveSection('catalog');
                            else if (sec.type === 'promoBanner') setActiveSection('promo');
                            else setActiveSection(sec.type as EditorSection);
                          } else {
                            setActiveSection(sec.id);
                          }
                        };

                        return (
                          <div
                            key={sec.id}
                            className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                              sec.enabled
                                ? 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-2xs'
                                : 'border-dashed border-gray-300 bg-gray-50/70 opacity-60'
                            }`}
                          >
                            {/* Reorder Up/Down arrows */}
                            <div className="flex flex-col items-center mr-1.5 shrink-0">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveSection(index, 'up');
                                }}
                                className="p-0.5 text-gray-400 hover:text-gray-900 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title="উপরে তুলুন"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={index === activeSections.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveSection(index, 'down');
                                }}
                                className="p-0.5 text-gray-400 hover:text-gray-900 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title="নিচে নামান"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Clickable section title */}
                            <button
                              type="button"
                              onClick={handleRowClick}
                              className="flex items-center gap-2 flex-1 text-left min-w-0 mr-2 cursor-pointer"
                            >
                              <div className="shrink-0">{getIcon()}</div>
                              <div className="truncate">
                                <p className="font-bold text-gray-900 truncate text-[11.5px]">{sec.title}</p>
                                <p className="text-[9.5px] text-gray-400 truncate">{sec.type}</p>
                              </div>
                            </button>

                            {/* Actions: Enable Toggle & Delete */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => toggleSectionEnabled(sec.id)}
                                className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                                title={sec.enabled ? 'হাইড করুন' : 'শো করুন'}
                              >
                                {sec.enabled ? (
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteSection(sec.id, sec.title)}
                                className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                                title="সেকশন ডিলিট করুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Section Button */}
                    <button
                      type="button"
                      onClick={() => setIsAddSectionOpen(true)}
                      className="w-full py-2.5 bg-gray-50 hover:bg-rose-50 border border-dashed border-gray-300 hover:border-rose-400 rounded-xl text-xs font-bold text-gray-700 hover:text-rose-600 flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer mt-2"
                    >
                      <Plus className="w-4 h-4 text-rose-600" />
                      <span>+ Add Section (নতুন ব্লক যোগ করুন)</span>
                    </button>
                  </div>

                  {/* Footer Group */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1">
                      Footer Group
                    </span>

                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-gray-100/70 transition-colors">
                      <button
                        type="button"
                        onClick={() => setActiveSection('footer')}
                        className="flex items-center gap-2.5 flex-1 text-left"
                      >
                        <Phone className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="font-bold text-gray-900">Footer Details</p>
                          <p className="text-[10px] text-gray-500">Helpline, address & bio</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* DETAIL 1: ANNOUNCEMENT BAR EDITOR */}
              {activeSection === 'announcement' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-gray-900">Show Announcement Bar</span>
                    <input
                      type="checkbox"
                      checked={theme.announcementBar.enabled}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          announcementBar: { ...prev.announcementBar, enabled: e.target.checked }
                        }))
                      }
                      className="w-4 h-4 accent-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Announcement Message (অফার নোটিশ)
                    </label>
                    <textarea
                      rows={2}
                      value={theme.announcementBar.text}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          announcementBar: { ...prev.announcementBar, text: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">হটলাইন নম্বর</label>
                      <input
                        type="text"
                        value={theme.announcementBar.phone}
                        onChange={(e) =>
                          updateTheme((prev) => ({
                            ...prev,
                            announcementBar: { ...prev.announcementBar, phone: e.target.value }
                          }))
                        }
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">WhatsApp নম্বর</label>
                      <input
                        type="text"
                        value={theme.announcementBar.whatsapp}
                        onChange={(e) =>
                          updateTheme((prev) => ({
                            ...prev,
                            announcementBar: { ...prev.announcementBar, whatsapp: e.target.value }
                          }))
                        }
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">ব্যাকগ্রাউন্ড কালার</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.announcementBar.bgColor}
                        onChange={(e) =>
                          updateTheme((prev) => ({
                            ...prev,
                            announcementBar: { ...prev.announcementBar, bgColor: e.target.value }
                          }))
                        }
                        className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.announcementBar.bgColor}
                        onChange={(e) =>
                          updateTheme((prev) => ({
                            ...prev,
                            announcementBar: { ...prev.announcementBar, bgColor: e.target.value }
                          }))
                        }
                        className="flex-1 font-mono uppercase px-2.5 py-1.5 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DETAIL 2: HEADER & LOGO EDITOR */}
              {activeSection === 'header' && (
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Store Name (স্টোরের নাম)</label>
                    <input
                      type="text"
                      value={theme.header.storeName}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          header: { ...prev.header, storeName: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Tagline (ট্যাগলাইন)</label>
                    <input
                      type="text"
                      value={theme.header.storeTagline}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          header: { ...prev.header, storeTagline: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Logo Image URL (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={theme.header.logoUrl || ''}
                      placeholder="https://example.com/logo.png"
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          header: { ...prev.header, logoUrl: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg outline-none"
                    />
                    <span className="text-[10.5px] text-gray-400 mt-1 block">
                      লোগো ইমেজ না দিলে স্বয়ংক্রিয়ভাবে স্টোরের নাম প্রদর্শিত হবে।
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="font-semibold text-gray-700">Sticky Header on Scroll</span>
                    <input
                      type="checkbox"
                      checked={theme.header.sticky}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          header: { ...prev.header, sticky: e.target.checked }
                        }))
                      }
                      className="w-4 h-4 accent-gray-900"
                    />
                  </div>
                </div>
              )}

              {/* DETAIL 3: HERO SLIDER & BANNERS EDITOR */}
              {activeSection === 'hero' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-gray-900">Enable Hero Section</span>
                    <input
                      type="checkbox"
                      checked={theme.hero.enabled}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, enabled: e.target.checked }
                        }))
                      }
                      className="w-4 h-4 accent-gray-900"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-700 block">Autoplay Slides</span>
                      <span className="text-[10px] text-gray-400">স্বয়ংক্রিয়ভাবে স্লাইড পরিবর্তন</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={theme.hero.autoplay}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, autoplay: e.target.checked }
                        }))
                      }
                      className="w-4 h-4 accent-gray-900"
                    />
                  </div>

                  {/* Slide Selector Buttons */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">Slides ({theme.hero.slides.length})</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newSlide: HeroSlideConfig = {
                            id: `slide-${Date.now()}`,
                            badge: '⚡ নতুন অফার',
                            title: 'নতুন গ্যাজেট কালেকশন',
                            subtitle: 'অফিসিয়াল ওয়ারেন্টি সহ আকর্ষণীয় মূল্যে',
                            priceText: 'মাত্র ৯৯০৳',
                            regularPrice: '১৫০০৳',
                            discount: '৩৫% ছাড়',
                            category: 'Smart Watches',
                            image: HERO_IMAGE_PRESETS[0].url,
                            bgGradient: 'from-slate-900 via-rose-950 to-slate-900',
                            buttonText: 'এখনই কিনুন'
                          };
                          updateTheme((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, slides: [...prev.hero.slides, newSlide] }
                          }));
                          setEditingSlideIndex(theme.hero.slides.length);
                        }}
                        className="px-2 py-1 bg-gray-900 text-white rounded text-[11px] font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add slide</span>
                      </button>
                    </div>

                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {theme.hero.slides.map((s, idx) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setEditingSlideIndex(idx)}
                          className={`px-3 py-1.5 rounded-lg border font-semibold text-xs whitespace-nowrap flex items-center gap-1.5 ${
                            editingSlideIndex === idx
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span>Slide {idx + 1}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slide Form Editor */}
                  {currentSlide && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="font-bold text-gray-800">Editing Slide {editingSlideIndex + 1}</span>
                        {theme.hero.slides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              updateTheme((prev) => ({
                                ...prev,
                                hero: {
                                  ...prev.hero,
                                  slides: prev.hero.slides.filter((_, i) => i !== editingSlideIndex)
                                }
                              }));
                              setEditingSlideIndex(0);
                            }}
                            className="text-rose-600 hover:underline text-[11px] flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete slide</span>
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">অফার ব্যাজ (Badge)</label>
                        <input
                          type="text"
                          value={currentSlide.badge}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateTheme((prev) => {
                              const copy = [...prev.hero.slides];
                              copy[editingSlideIndex] = { ...copy[editingSlideIndex], badge: val };
                              return { ...prev, hero: { ...prev.hero, slides: copy } };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">প্রধান শিরোনাম (Title)</label>
                        <input
                          type="text"
                          value={currentSlide.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateTheme((prev) => {
                              const copy = [...prev.hero.slides];
                              copy[editingSlideIndex] = { ...copy[editingSlideIndex], title: val };
                              return { ...prev, hero: { ...prev.hero, slides: copy } };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg outline-none font-bold text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">সাব-টাইটেল (Subtitle)</label>
                        <textarea
                          rows={2}
                          value={currentSlide.subtitle}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateTheme((prev) => {
                              const copy = [...prev.hero.slides];
                              copy[editingSlideIndex] = { ...copy[editingSlideIndex], subtitle: val };
                              return { ...prev, hero: { ...prev.hero, slides: copy } };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-gray-700 block mb-1">অফার প্রাইজ</label>
                          <input
                            type="text"
                            value={currentSlide.priceText}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateTheme((prev) => {
                                const copy = [...prev.hero.slides];
                                copy[editingSlideIndex] = { ...copy[editingSlideIndex], priceText: val };
                                return { ...prev, hero: { ...prev.hero, slides: copy } };
                              });
                            }}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-gray-700 block mb-1">ডিসকাউন্ট %</label>
                          <input
                            type="text"
                            value={currentSlide.discount}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateTheme((prev) => {
                                const copy = [...prev.hero.slides];
                                copy[editingSlideIndex] = { ...copy[editingSlideIndex], discount: val };
                                return { ...prev, hero: { ...prev.hero, slides: copy } };
                              });
                            }}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">বাটন টেক্সট</label>
                        <input
                          type="text"
                          value={currentSlide.buttonText || 'এখনই অর্ডার করুন'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateTheme((prev) => {
                              const copy = [...prev.hero.slides];
                              copy[editingSlideIndex] = { ...copy[editingSlideIndex], buttonText: val };
                              return { ...prev, hero: { ...prev.hero, slides: copy } };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                        />
                      </div>

                      {/* Image selector */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-semibold text-gray-700 block text-xs">ব্যানার ছবি (Banner Image)</label>
                          <label className="cursor-pointer px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[11px] font-bold flex items-center gap-1 transition-colors border border-indigo-200">
                            <Upload className="w-3 h-3 text-indigo-600" />
                            <span>ডিভাইস আপলোড</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const dataUrl = ev.target?.result as string;
                                    updateTheme((prev) => {
                                      const copy = [...prev.hero.slides];
                                      copy[editingSlideIndex] = { ...copy[editingSlideIndex], image: dataUrl };
                                      return { ...prev, hero: { ...prev.hero, slides: copy } };
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        <input
                          type="text"
                          value={currentSlide.image}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateTheme((prev) => {
                              const copy = [...prev.hero.slides];
                              copy[editingSlideIndex] = { ...copy[editingSlideIndex], image: val };
                              return { ...prev, hero: { ...prev.hero, slides: copy } };
                            });
                          }}
                          placeholder="https://... বা উপরের বাটনে ক্লিক করে ডিভাইস থেকে আপলোড করুন"
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-[11px]"
                        />

                        {/* Quick Presets */}
                        <div className="mt-2 space-y-1">
                          <span className="text-[10px] text-gray-400 block font-medium">অথবা দ্রুত ছবি নির্বাচন করুন:</span>
                          <div className="flex gap-1.5 flex-wrap">
                            {HERO_IMAGE_PRESETS.map((p) => (
                              <button
                                key={p.label}
                                type="button"
                                onClick={() => {
                                  updateTheme((prev) => {
                                    const copy = [...prev.hero.slides];
                                    copy[editingSlideIndex] = { ...copy[editingSlideIndex], image: p.url };
                                    return { ...prev, hero: { ...prev.hero, slides: copy } };
                                  });
                                }}
                                className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-[10px] font-medium"
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DETAIL 4: TRUST BADGES */}
              {activeSection === 'trust' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-gray-900">Show Trust Guarantees</span>
                    <input
                      type="checkbox"
                      checked={theme.trustBadges.enabled}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          trustBadges: { ...prev.trustBadges, enabled: e.target.checked }
                        }))
                      }
                      className="w-4 h-4 accent-gray-900"
                    />
                  </div>

                  <p className="text-[11px] text-gray-500">
                    কাস্টমারদের আস্থা অর্জনের জন্য হোমপেজে প্রদর্শিত ৪টি ট্রাস্ট ব্যাজ এডিট করুন:
                  </p>

                  <div className="space-y-3">
                    {theme.trustBadges.badges.map((badge, idx) => (
                      <div key={badge.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                        <span className="font-bold text-gray-800 text-[11px]">Badge {idx + 1}</span>
                        <input
                          type="text"
                          value={badge.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateTheme((prev) => {
                              const copy = [...prev.trustBadges.badges];
                              copy[idx] = { ...copy[idx], title: val };
                              return { ...prev, trustBadges: { ...prev.trustBadges, badges: copy } };
                            });
                          }}
                          className="w-full px-2.5 py-1 text-xs border border-gray-300 rounded font-bold"
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={badge.subtitle}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateTheme((prev) => {
                              const copy = [...prev.trustBadges.badges];
                              copy[idx] = { ...copy[idx], subtitle: val };
                              return { ...prev, trustBadges: { ...prev.trustBadges, badges: copy } };
                            });
                          }}
                          className="w-full px-2.5 py-1 text-xs border border-gray-300 rounded"
                          placeholder="Subtitle"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DETAIL 5: FLASH DEALS */}
              {activeSection === 'flash' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-gray-900">Show Flash Deals Section</span>
                    <input
                      type="checkbox"
                      checked={theme.flashDeals.enabled}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          flashDeals: { ...prev.flashDeals, enabled: e.target.checked }
                        }))
                      }
                      className="w-4 h-4 accent-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Section Title (শিরোনাম)</label>
                    <input
                      type="text"
                      value={theme.flashDeals.title}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          flashDeals: { ...prev.flashDeals, title: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Badge Text (অফার ব্যাজ)</label>
                    <input
                      type="text"
                      value={theme.flashDeals.badgeText}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          flashDeals: { ...prev.flashDeals, badgeText: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">কাউন্টডাউন ঘণ্টার সময় (Hours)</label>
                    <select
                      value={theme.flashDeals.dealHours}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          flashDeals: { ...prev.flashDeals, dealHours: Number(e.target.value) }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white font-medium"
                    >
                      <option value={6}>6 Hours Flash Deal</option>
                      <option value={12}>12 Hours Mega Deal</option>
                      <option value={24}>24 Hours 1-Day Deal</option>
                      <option value={48}>48 Hours Weekend Deal</option>
                    </select>
                  </div>
                </div>
              )}

              {/* DETAIL 6: CATEGORIES GRID (Add category, edit image & link) */}
              {activeSection === 'categories' && (
                <CategorySectionEditor
                  theme={theme}
                  updateTheme={updateTheme}
                  showToast={showToast}
                />
              )}

              {/* DETAIL 7: CATALOG SECTION */}
              {activeSection === 'catalog' && (
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">ক্যাটালগ টাইটেল</label>
                    <input
                      type="text"
                      value={theme.catalogSection.title}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          catalogSection: { ...prev.catalogSection, title: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">সাব-টাইটেল</label>
                    <input
                      type="text"
                      value={theme.catalogSection.subtitle}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          catalogSection: { ...prev.catalogSection, subtitle: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      ডেস্কটপে প্রতি সারিতে প্রোডাক্টের সংখ্যা
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[2, 3, 4].map((cols) => (
                        <button
                          key={cols}
                          type="button"
                          onClick={() =>
                            updateTheme((prev) => ({
                              ...prev,
                              catalogSection: { ...prev.catalogSection, columns: cols as 2 | 3 | 4 }
                            }))
                          }
                          className={`py-2 rounded-lg border font-bold text-xs ${
                            theme.catalogSection.columns === cols
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-gray-50 border-gray-300 text-gray-700'
                          }`}
                        >
                          {cols} Columns
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* DETAIL 8: PROMO BANNER */}
              {activeSection === 'promo' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-gray-900">Show Promo Callout Banner</span>
                    <input
                      type="checkbox"
                      checked={theme.promoBanner.enabled}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          promoBanner: { ...prev.promoBanner, enabled: e.target.checked }
                        }))
                      }
                      className="w-4 h-4 accent-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">অফার ব্যাজ</label>
                    <input
                      type="text"
                      value={theme.promoBanner.badge}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          promoBanner: { ...prev.promoBanner, badge: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">প্রধান শিরোনাম</label>
                    <input
                      type="text"
                      value={theme.promoBanner.title}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          promoBanner: { ...prev.promoBanner, title: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">বিবরণ (Subtitle)</label>
                    <textarea
                      rows={2}
                      value={theme.promoBanner.subtitle}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          promoBanner: { ...prev.promoBanner, subtitle: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">বাটন টেক্সট</label>
                    <input
                      type="text"
                      value={theme.promoBanner.buttonText}
                      onChange={(e) =>
                        updateTheme((prev) => ({
                          ...prev,
                          promoBanner: { ...prev.promoBanner, buttonText: e.target.value }
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* DETAIL 9: FOOTER */}
              {activeSection === 'footer' && (
                <FooterSettingsEditor
                  footerConfig={theme.footer}
                  onUpdateFooter={(updatedFooter) => {
                    updateTheme((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        ...updatedFooter
                      }
                    }));
                  }}
                />
              )}

              {/* DETAIL: DYNAMIC SECTION EDITORS (VIDEO BANNER, FAQ, FEATURE GRID, NEWSLETTER) */}
              {activeSection !== 'overview' &&
                activeSection !== 'announcement' &&
                activeSection !== 'header' &&
                activeSection !== 'hero' &&
                activeSection !== 'trust' &&
                activeSection !== 'flash' &&
                activeSection !== 'categories' &&
                activeSection !== 'catalog' &&
                activeSection !== 'promo' &&
                activeSection !== 'footer' &&
                activeSection !== 'theme_settings' &&
                currentEditingSection && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900">
                          {currentEditingSection.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono">
                          ব্লক আইডি: {currentEditingSection.id}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteSection(currentEditingSection.id, currentEditingSection.title)}
                        className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1 border border-red-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ডিলিট</span>
                      </button>
                    </div>

                    {/* Section Title Input */}
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1 text-xs">
                        সেকশনের নাম (Admin Label)
                      </label>
                      <input
                        type="text"
                        value={currentEditingSection.title}
                        onChange={(e) => {
                          const updated = activeSections.map((s) =>
                            s.id === currentEditingSection.id ? { ...s, title: e.target.value } : s
                          );
                          updateTheme((prev) => ({ ...prev, sectionsOrder: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>

                    {/* Specific editors based on dynamic section type */}
                    {currentEditingSection.type === 'videoBanner' && (
                      <VideoBannerEditor
                        section={currentEditingSection}
                        onUpdate={(data) => updateDynamicSectionData(currentEditingSection.id, data)}
                      />
                    )}

                    {currentEditingSection.type === 'faqAccordion' && (
                      <FaqAccordionEditor
                        section={currentEditingSection}
                        onUpdate={(data) => updateDynamicSectionData(currentEditingSection.id, data)}
                      />
                    )}

                    {currentEditingSection.type === 'featureGrid' && (
                      <FeatureGridEditor
                        section={currentEditingSection}
                        onUpdate={(data) => updateDynamicSectionData(currentEditingSection.id, data)}
                      />
                    )}

                    {currentEditingSection.type === 'newsletter' && (
                      <NewsletterEditor
                        section={currentEditingSection}
                        onUpdate={(data) => updateDynamicSectionData(currentEditingSection.id, data)}
                      />
                    )}
                  </div>
                )}

              {/* TAB 2: GLOBAL THEME SETTINGS (COLORS & SHAPES) */}
              {sidebarTab === 'settings' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
                      Primary Brand Color (ব্র্যান্ড কালার)
                    </h3>
                    <p className="text-[11px] text-gray-500 mb-3">
                      ওয়েবসাইটের সকল বাটন, ব্যাজ ও অ্যাকসেন্ট এক ক্লিকে পরিবর্তন করুন:
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {COLOR_PALETTES.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() =>
                            updateTheme((prev) => ({
                              ...prev,
                              styling: { ...prev.styling, primaryColor: c.hex }
                            }))
                          }
                          className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                            theme.styling.primaryColor === c.hex
                              ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[11px] font-semibold text-gray-800 truncate">
                            {c.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.styling.primaryColor}
                        onChange={(e) =>
                          updateTheme((prev) => ({
                            ...prev,
                            styling: { ...prev.styling, primaryColor: e.target.value }
                          }))
                        }
                        className="w-8 h-8 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.styling.primaryColor}
                        onChange={(e) =>
                          updateTheme((prev) => ({
                            ...prev,
                            styling: { ...prev.styling, primaryColor: e.target.value }
                          }))
                        }
                        className="flex-1 font-mono uppercase px-2 py-1 text-xs border border-gray-300 rounded"
                        placeholder="#059669"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
                      Button Corner Rounding (বাটনের আকৃতি)
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Pill Round', val: 'rounded-full' },
                        { label: 'Soft Curve', val: 'rounded-xl' },
                        { label: 'Classic', val: 'rounded-md' }
                      ].map((shape) => (
                        <button
                          key={shape.val}
                          type="button"
                          onClick={() =>
                            updateTheme((prev) => ({
                              ...prev,
                              styling: {
                                ...prev.styling,
                                borderRadius: shape.val as any
                              }
                            }))
                          }
                          className={`py-2 text-center text-xs font-semibold border ${shape.val} ${
                            theme.styling.borderRadius === shape.val
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {shape.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* RIGHT CANVAS: REAL-TIME INTERACTIVE LIVE PREVIEW */}
        <main className="flex-1 bg-[#262626] overflow-y-auto flex items-start justify-center p-3 sm:p-6 select-text">
          {/* DESKTOP VIEW CONTAINER */}
          {deviceView === 'desktop' && (
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-700 min-h-[90vh]">
              {renderLiveStoreContent()}
            </div>
          )}

          {/* FULLSCREEN VIEW CONTAINER */}
          {deviceView === 'fullscreen' && (
            <div className="w-full bg-white shadow-2xl overflow-hidden min-h-screen">
              {renderLiveStoreContent()}
            </div>
          )}

          {/* MOBILE PHONE FRAME VIEW CONTAINER */}
          {deviceView === 'mobile' && (
            <div className="w-[390px] h-[820px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col relative shrink-0">
              {/* Phone Speaker & Dynamic Island */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] mr-3" />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-950" />
              </div>

              {/* Phone Internal Screen Viewport */}
              <div className="w-full h-full bg-white rounded-[38px] overflow-y-auto overflow-x-hidden pt-7 relative scrollbar-none">
                {renderLiveStoreContent(true)}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ADD SECTION MODAL */}
      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onAdd={handleAddSection}
      />
    </div>
  );

  // Helper renderer that renders live components reflecting the theme state in real-time
  function renderLiveStoreContent(isMobile = false) {
    const slide = theme.hero.slides[editingSlideIndex] || theme.hero.slides[0];

    const handleSectionClick = (sec: any) => {
      if (['hero', 'trustBadges', 'flashDeals', 'categoriesSection', 'catalogSection', 'promoBanner', 'footer'].includes(sec.type)) {
        if (sec.type === 'trustBadges') setActiveSection('trust');
        else if (sec.type === 'flashDeals') setActiveSection('flash');
        else if (sec.type === 'categoriesSection') setActiveSection('categories');
        else if (sec.type === 'catalogSection') setActiveSection('catalog');
        else if (sec.type === 'promoBanner') setActiveSection('promo');
        else setActiveSection(sec.type as EditorSection);
      } else {
        setActiveSection(sec.id);
      }
    };

    return (
      <div className="min-h-full flex flex-col font-sans bg-gray-50/70 text-gray-800">
        {/* 1. Top Announcement Bar */}
        {theme.announcementBar.enabled && (
          <div
            onClick={() => setActiveSection('announcement')}
            style={{
              backgroundColor: theme.announcementBar.bgColor,
              color: theme.announcementBar.textColor
            }}
            className="text-[11px] py-1.5 px-3 border-b border-white/10 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
            title="Click to edit Announcement Bar"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 flex-wrap text-center sm:text-left">
              <span className="truncate flex-1 font-medium">{theme.announcementBar.text}</span>
              <div className="flex items-center gap-3 text-[10.5px]">
                <span>হটলাইন: {theme.announcementBar.phone}</span>
                <span className="hidden sm:inline">|</span>
                <span className="text-emerald-400 hidden sm:inline">WhatsApp: {theme.announcementBar.whatsapp}</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Header & Brand Navbar */}
        <div
          onClick={() => setActiveSection('header')}
          className="bg-white border-b border-gray-200 px-4 py-3 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all flex items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2">
            {theme.header.logoUrl ? (
              <img src={theme.header.logoUrl} alt="Logo" className="h-8 object-contain" />
            ) : (
              <div
                className="w-8 h-8 rounded-lg text-white font-black flex items-center justify-center text-sm shadow-xs"
                style={{ backgroundColor: theme.styling.primaryColor }}
              >
                {theme.header.storeName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="font-extrabold text-gray-900 tracking-tight text-sm sm:text-base leading-tight">
                {theme.header.storeName}
              </h1>
              <p className="text-[10px] text-gray-400">{theme.header.storeTagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 text-white text-xs font-bold shadow-xs ${theme.styling.borderRadius}`}
              style={{ backgroundColor: theme.styling.primaryColor }}
            >
              অর্ডার করুন (Live)
            </span>
          </div>
        </div>

        {/* PAGE CONTENT: SELECTED PAGE SWITCHER PREVIEW */}
        {selectedPage === 'about' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 flex-1">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-gray-900">আমাদের সম্পর্কে (About Us)</h2>
              <p className="text-xs text-gray-500 max-w-lg mx-auto">
                {theme.header.storeName} - বাংলাদেশের সবচেয়ে বিশ্বস্ত ও নির্ভরযোগ্য অনলাইন শপিং অভিজ্ঞতা।
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 text-xs leading-relaxed text-gray-700">
              <p>
                {theme.footer.aboutText ||
                  'আমরা নিশ্চিত করি শতভাগ অরিজিনাল পণ্য, দ্রুততম হোম ডেলিভারি এবং ক্যাশ অন ডেলিভারি সুবিধা। গ্রাহকের সন্তুষ্টিই আমাদের প্রধান অগ্রাধিকার।'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-center">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 text-sm">১০০% আসল পণ্য</h4>
                  <p className="text-[11px] text-gray-500">সরাসরি অথরাইজড সোর্স থেকে আমদানিকৃত</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 text-sm">সারা দেশে ডেলিভারি</h4>
                  <p className="text-[11px] text-gray-500">২৪ থেকে ৭২ ঘণ্টার মধ্যে ডেলিভারি</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 text-sm">ক্যাশ অন ডেলিভারি</h4>
                  <p className="text-[11px] text-gray-500">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedPage === 'faq' && (
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 flex-1">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-gray-900">সাধারণ জিজ্ঞাসা (FAQ)</h2>
              <p className="text-xs text-gray-500">
                অর্ডার ও ডেলিভারি সংক্রান্ত যেকোনো প্রশ্নের উত্তর জেনে নিন।
              </p>
            </div>
            <div className="space-y-3">
              {[
                { q: 'কীভাবে অর্ডার কনফার্ম করব?', a: 'পণ্য পছন্দ করে "অর্ডার করুন" বাটনে ক্লিক করুন, আপনার নাম, ঠিকানা ও মোবাইল নম্বর দিয়ে সাবমিট করলেই অর্ডার নিশ্চিত হবে।' },
                { q: 'ডেলিভারি চার্জ কত এবং কতদিন সময় লাগে?', a: 'ঢাকার ভেতর ডেলিভারি ৬০ টাকা (২৪-৪৮ ঘণ্টা), ঢাকার বাইরে ১২০ টাকা (৪৮-৭২ ঘণ্টা)।' },
                { q: 'পণ্য হাতে পেয়ে চেক করে নেওয়ার সুবিধা আছে কি?', a: 'হ্যাঁ, ডেলিভারি ম্যানের সামনে পণ্য দেখে চেক করে মূল্য পরিশোধের ১০০% সুবিধা রয়েছে।' },
                { q: 'পণ্য পছন্দ না হলে কীভাবে রিটার্ন করব?', a: 'ডেলিভারি পাওয়ার ৩ দিনের মধ্যে আমাদের হটলাইনে কল দিয়ে খুব সহজেই এক্সচেঞ্জ বা রিটার্ন করতে পারবেন।' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-1.5">
                  <h4 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 font-black flex items-center justify-center text-[10px]">?</span>
                    {item.q}
                  </h4>
                  <p className="text-gray-600 text-[11px] pl-7">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedPage === 'contact' && (
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 flex-1">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-gray-900">যোগাযোগ করুন (Contact Us)</h2>
              <p className="text-xs text-gray-500">যেকোনো তথ্য ও সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করুন।</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3 text-xs">
                <h3 className="font-bold text-gray-900 text-sm border-b pb-2">আমাদের তথ্য</h3>
                <p><strong>হটলাইন:</strong> {theme.footer.helpline}</p>
                <p><strong>ইমেইল:</strong> {theme.footer.email}</p>
                <p><strong>ঠিকানা:</strong> {theme.footer.address}</p>
                <p><strong>সাপ্তাহিক সেবা:</strong> সকাল ৯টা থেকে রাত ১০টা (প্রতিদিন)</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2.5 text-xs">
                <h3 className="font-bold text-gray-900 text-sm border-b pb-2">মেসেজ পাঠান</h3>
                <input type="text" placeholder="আপনার নাম" className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs" />
                <input type="text" placeholder="মোবাইল নম্বর" className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs" />
                <textarea rows={2} placeholder="আপনার প্রশ্ন বা মতামত..." className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs resize-none" />
                <button
                  type="button"
                  className={`w-full py-2 text-white font-bold text-xs shadow-xs ${theme.styling.borderRadius}`}
                  style={{ backgroundColor: theme.styling.primaryColor }}
                >
                  মেসেজ পাঠান
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HOME PAGE: DYNAMIC RENDER OF REORDERABLE ACTIVE SECTIONS */}
        {selectedPage === 'home' && (
          <div className="flex-1 space-y-2">
            {activeSections.map((sec) => {
              if (!sec.enabled) return null;

              // 1. HERO BANNER BLOCK
              if (sec.type === 'hero' && theme.hero.enabled && slide) {
                return (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSection('hero')}
                    className="p-3 sm:p-5 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all relative group"
                    title="Click to edit Hero Banner"
                  >
                    <div className={`rounded-2xl bg-gradient-to-r ${slide.bgGradient} text-white p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg`}>
                      <div className="space-y-3 z-10 max-w-md">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md uppercase tracking-wide border border-white/20">
                          {slide.badge}
                        </span>

                        <h2 className="text-xl sm:text-3xl font-black leading-tight tracking-tight">
                          {slide.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                          {slide.subtitle}
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                          <span className="text-lg sm:text-2xl font-black font-mono text-amber-300">
                            {slide.priceText}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-300 line-through">
                            {slide.regularPrice}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10.5px] font-bold">
                            {slide.discount}
                          </span>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            className={`px-5 py-2.5 text-white font-bold text-xs shadow-md transition-all ${theme.styling.borderRadius}`}
                            style={{ backgroundColor: theme.styling.primaryColor }}
                          >
                            {slide.buttonText || 'এখনই অর্ডার করুন'} →
                          </button>
                        </div>
                      </div>

                      <div className="w-48 sm:w-64 h-48 sm:h-64 rounded-xl overflow-hidden bg-white/10 p-2 shrink-0 border border-white/20">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              // 2. TRUST BADGES BLOCK
              if (sec.type === 'trustBadges' && theme.trustBadges.enabled) {
                return (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSection('trust')}
                    className="px-3 sm:px-5 py-2 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                    title="Click to edit Trust Guarantees"
                  >
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-3">
                      {theme.trustBadges.badges.map((b, i) => (
                        <div key={b.id} className="flex items-center gap-2.5 p-1.5">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold"
                            style={{ backgroundColor: `${theme.styling.primaryColor}15`, color: theme.styling.primaryColor }}
                          >
                            {i === 0 ? <Truck className="w-4 h-4" /> : i === 1 ? <ShieldCheck className="w-4 h-4" /> : i === 2 ? <RefreshCw className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 leading-tight">{b.title}</h4>
                            <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{b.subtitle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 3. FLASH DEALS BLOCK
              if (sec.type === 'flashDeals' && theme.flashDeals.enabled) {
                return (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSection('flash')}
                    className="px-3 sm:px-5 py-3 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                    title="Click to edit Flash Deals"
                  >
                    <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center gap-2.5">
                        <Flame className="w-5 h-5 fill-white" />
                        <div>
                          <h3 className="font-black text-sm">{theme.flashDeals.title}</h3>
                          <span className="text-[10px] text-amber-300 font-bold">{theme.flashDeals.badgeText}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                        <span className="bg-black/30 px-2 py-1 rounded">08h</span>
                        <span>:</span>
                        <span className="bg-black/30 px-2 py-1 rounded">42m</span>
                        <span>:</span>
                        <span className="bg-black/30 px-2 py-1 rounded">15s</span>
                      </div>
                    </div>
                  </div>
                );
              }

              // 4. CATEGORIES GRID BLOCK
              if (sec.type === 'categoriesSection' && theme.categoriesSection.enabled) {
                const categoriesList =
                  theme.categoriesSection.items && theme.categoriesSection.items.length > 0
                    ? theme.categoriesSection.items
                    : CATEGORIES;

                return (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSection('categories')}
                    className="px-3 sm:px-5 py-3 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all rounded-xl relative group/catsec"
                    title="Click to edit Categories, Images & Links"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{theme.categoriesSection.title}</h3>
                        <p className="text-[11px] text-gray-500">{theme.categoriesSection.subtitle}</p>
                      </div>
                      <span className="opacity-0 group-hover/catsec:opacity-100 transition-opacity text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded shadow-2xs">
                        ক্যাটাগরি, ইমেজ ও লিংক এডিট
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {categoriesList.slice(0, 8).map((c) => (
                        <div
                          key={c.id}
                          className="p-2.5 rounded-xl border border-gray-200 bg-white text-center shadow-xs hover:border-indigo-300 transition-all group/item"
                        >
                          <div className="w-10 h-10 mx-auto rounded-lg overflow-hidden bg-gray-100 mb-1 border border-gray-100 relative">
                            <img
                              src={c.image || FALLBACK_CATEGORY_IMAGE}
                              alt={c.name}
                              className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = FALLBACK_CATEGORY_IMAGE;
                              }}
                            />
                          </div>
                          <p className="text-[11px] font-bold text-gray-800 truncate">{c.name}</p>
                          {c.link && (
                            <p className="text-[9px] text-rose-600 font-mono truncate">{c.link}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 5. CATALOG PRODUCTS BLOCK
              if (sec.type === 'catalogSection') {
                return (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSection('catalog')}
                    className="px-3 sm:px-5 py-3 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                    title="Click to edit Catalog layout"
                  >
                    <div className="mb-2">
                      <h3 className="text-sm font-bold text-gray-900">{theme.catalogSection.title}</h3>
                      <p className="text-[11px] text-gray-500">{theme.catalogSection.subtitle}</p>
                    </div>

                    <div
                      className={`grid gap-3 ${
                        theme.catalogSection.columns === 4
                          ? 'grid-cols-2 md:grid-cols-4'
                          : theme.catalogSection.columns === 2
                          ? 'grid-cols-1 sm:grid-cols-2'
                          : 'grid-cols-2 sm:grid-cols-3'
                      }`}
                    >
                      {products.slice(0, 6).map((p) => (
                        <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-2.5 shadow-xs space-y-2">
                          <div className="w-full h-32 rounded-lg bg-gray-100 overflow-hidden relative">
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                            {p.discountPercent > 0 && (
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-600 text-white">
                                -{p.discountPercent}%
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 truncate">{p.name}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold font-mono text-gray-900">৳{p.price}</span>
                            <button
                              type="button"
                              className={`px-2 py-1 text-white text-[10px] font-bold shadow-xs ${theme.styling.borderRadius}`}
                              style={{ backgroundColor: theme.styling.primaryColor }}
                            >
                              কিনুন
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 6. PROMOTIONAL CALLOUT BANNER
              if (sec.type === 'promoBanner' && theme.promoBanner.enabled) {
                return (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSection('promo')}
                    className="px-3 sm:px-5 py-3 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                    title="Click to edit Promo Banner"
                  >
                    <div className={`rounded-xl bg-gradient-to-r ${theme.promoBanner.bgGradient} text-white p-4 sm:p-6 text-center space-y-2`}>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wide">
                        {theme.promoBanner.badge}
                      </span>
                      <h3 className="text-base sm:text-xl font-black">{theme.promoBanner.title}</h3>
                      <p className="text-xs text-gray-100 max-w-md mx-auto">{theme.promoBanner.subtitle}</p>
                      <button
                        type="button"
                        className={`mt-2 px-4 py-1.5 bg-white text-gray-900 text-xs font-bold shadow-md ${theme.styling.borderRadius}`}
                      >
                        {theme.promoBanner.buttonText}
                      </button>
                    </div>
                  </div>
                );
              }

              // 7. DYNAMIC BLOCK: VIDEO BANNER
              if (sec.type === 'videoBanner') {
                const data = sec.customData || {};
                return (
                  <div
                    key={sec.id}
                    onClick={() => handleSectionClick(sec)}
                    className="px-3 sm:px-5 py-3 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                    title="Click to edit Video Banner"
                  >
                    <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative">
                      <div className="relative aspect-video max-h-[340px] w-full bg-black overflow-hidden flex items-center justify-center">
                        {data.videoUrl ? (
                          <iframe
                            src={data.videoUrl}
                            title={data.title || 'Product Video'}
                            className="w-full h-full object-cover pointer-events-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        ) : (
                          <img
                            src={data.coverImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000'}
                            alt=""
                            className="w-full h-full object-cover opacity-60"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-xs mb-3 group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-white ml-1" />
                          </div>
                          <h3 className="text-lg sm:text-2xl font-black">{data.title || 'আমাদের প্রোডাক্টের রিভিউ ভিডিও দেখুন'}</h3>
                          <p className="text-xs sm:text-sm text-gray-200 max-w-md mt-1">{data.subtitle || 'সরাসরি দেখে অর্ডার করুন'}</p>
                          {data.buttonText && (
                            <button
                              type="button"
                              className={`mt-4 px-5 py-2 text-white font-bold text-xs shadow-lg ${theme.styling.borderRadius}`}
                              style={{ backgroundColor: theme.styling.primaryColor }}
                            >
                              {data.buttonText}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // 8. DYNAMIC BLOCK: FAQ ACCORDION
              if (sec.type === 'faqAccordion') {
                const data = sec.customData || {};
                const items = data.items || [
                  { q: 'ডেলিভারি কীভাবে পাব?', a: 'আমরা সারা বাংলাদেশে ক্যাশ অন হোম ডেলিভারি প্রদান করি।' },
                  { q: 'পণ্য কীভাবে চেক করব?', a: 'ডেলিভারি ম্যানের সামনে পণ্য চেক করে মূল্য পরিশোধ করতে পারবেন।' }
                ];

                return (
                  <div
                    key={sec.id}
                    onClick={() => handleSectionClick(sec)}
                    className="px-3 sm:px-5 py-3 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                    title="Click to edit FAQ Accordion"
                  >
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                      <div className="text-center space-y-1 mb-4">
                        <h3 className="text-base sm:text-lg font-black text-gray-900">{data.title || 'সাধারণ জিজ্ঞাসা'}</h3>
                        <p className="text-xs text-gray-500">{data.subtitle || 'পণ্য ও ডেলিভারি সংক্রান্ত যেকোনো তথ্য'}</p>
                      </div>

                      <div className="space-y-2">
                        {items.map((it: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1">
                            <h4 className="text-xs font-bold text-gray-900 flex items-center justify-between">
                              <span>{it.q}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                            </h4>
                            <p className="text-[11px] text-gray-600 leading-relaxed">{it.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // 9. DYNAMIC BLOCK: FEATURE GRID
              if (sec.type === 'featureGrid') {
                const data = sec.customData || {};
                const items = data.items || [
                  { title: '১০০% অরিজিনাল', desc: 'সরাসরি অফিসিয়াল সোর্স' },
                  { title: 'সুপার ফাস্ট ডেলিভারি', desc: '২৪ ঘণ্টার মধ্যে ঢাকার ভেতর' },
                  { title: 'সহজ রিটার্ন পলিসি', desc: 'পছন্দ না হলে ৩ দিনে রিটার্ন' }
                ];

                return (
                  <div
                    key={sec.id}
                    onClick={() => handleSectionClick(sec)}
                    className="px-3 sm:px-5 py-3 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                    title="Click to edit Feature Grid"
                  >
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                      <div className="text-center mb-3">
                        <h3 className="text-base sm:text-lg font-black text-gray-900">{data.title || 'আমাদের বিশেষত্ব'}</h3>
                        <p className="text-xs text-gray-500">{data.subtitle || 'কেন আমাদের কাছ থেকেই অর্ডার করবেন?'}</p>
                      </div>

                      <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(items.length, 3)} gap-3`}>
                        {items.map((it: any, idx: number) => (
                          <div key={idx} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 text-center space-y-1.5">
                            <div
                              className="w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold"
                              style={{ backgroundColor: `${theme.styling.primaryColor}18`, color: theme.styling.primaryColor }}
                            >
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <h4 className="text-xs font-bold text-gray-900">{it.title}</h4>
                            <p className="text-[11px] text-gray-500 leading-normal">{it.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // 10. DYNAMIC BLOCK: NEWSLETTER / DISCOUNT SUBSCRIPTION
              if (sec.type === 'newsletter') {
                const data = sec.customData || {};
                return (
                  <div
                    key={sec.id}
                    onClick={() => handleSectionClick(sec)}
                    className="px-3 sm:px-5 py-3 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                    title="Click to edit Newsletter"
                  >
                    <div
                      className="p-6 rounded-2xl text-white text-center space-y-3 shadow-lg"
                      style={{ backgroundColor: data.bgColor || theme.styling.primaryColor }}
                    >
                      <h3 className="text-lg sm:text-xl font-black">{data.title || '১০% ডিসকাউন্ট ভাউচার জিতুন!'}</h3>
                      <p className="text-xs text-white/85 max-w-md mx-auto">{data.subtitle || 'আমাদের নিউজলেটারে সাবস্ক্রাইব করে পরবর্তী অর্ডারে বিশেষ ছাড় উপভোগ করুন।'}</p>
                      <div className="max-w-md mx-auto flex items-center gap-2 pt-2">
                        <input
                          type="email"
                          placeholder={data.placeholder || 'আপনার ইমেইল বা মোবাইল নম্বর দিন'}
                          className="flex-1 px-3 py-2 rounded-xl text-xs text-gray-900 bg-white outline-none"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs shrink-0"
                        >
                          {data.buttonText || 'সাবস্ক্রাইব'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}

        {/* 9. Footer (Always rendered at the bottom) */}
        <div
          onClick={() => setActiveSection('footer')}
          className="cursor-pointer relative group transition-all"
          title="Click to edit Footer details"
        >
          <div className="absolute top-2 right-4 z-20 opacity-0 group-hover:opacity-100 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 transition-opacity">
            <Edit3 className="w-3 h-3" />
            <span>ফুটার এডিট করুন (Click to edit)</span>
          </div>
          <div className="pointer-events-none">
            <Footer
              footerConfig={theme.footer}
              onOpenTracking={() => {}}
              onSelectCategory={() => {}}
              onOpenAdmin={() => {}}
            />
          </div>
        </div>
      </div>
    );
  }
};

