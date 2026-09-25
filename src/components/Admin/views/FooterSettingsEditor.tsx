import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Tag,
  ShieldCheck,
  Truck,
  CreditCard,
  Plus,
  Trash2,
  Check,
  Globe,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
  Info
} from 'lucide-react';
import { ThemeConfig } from '../../../types';
import { STORE_SETTINGS } from '../../../data/mockData';

interface FooterSettingsEditorProps {
  footerConfig: ThemeConfig['footer'];
  onUpdateFooter: (updated: Partial<ThemeConfig['footer']>) => void;
  onSave?: () => void;
  isStandalone?: boolean; // if used inside ThemeCustomizer or full Admin Tab
}

export const FooterSettingsEditor: React.FC<FooterSettingsEditorProps> = ({
  footerConfig,
  onUpdateFooter,
  onSave,
  isStandalone = false
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'categories' | 'customerCare' | 'payments' | 'legal'>('info');
  
  // Category quick-add state
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatValue, setNewCatValue] = useState('');

  // Customer care quick-add state
  const [newCareLabel, setNewCareLabel] = useState('');
  const [newCareIcon, setNewCareIcon] = useState<'truck' | 'refresh' | 'shield' | 'clock' | 'link' | 'phone'>('truck');
  const [newCareAction, setNewCareAction] = useState<'track' | 'admin' | 'none'>('none');

  // Payment method quick-add state
  const [newPaymentName, setNewPaymentName] = useState('');
  const [newPaymentColor, setNewPaymentColor] = useState('emerald');

  // Courier quick-add state
  const [newCourierName, setNewCourierName] = useState('');

  // Legal link quick-add state
  const [newLegalLabel, setNewLegalLabel] = useState('');
  const [newLegalUrl, setNewLegalUrl] = useState('#');

  // Data helpers
  const brandName = footerConfig.brandName !== undefined ? footerConfig.brandName : 'GPE Bangladesh';
  const brandSuffix = footerConfig.brandSuffix !== undefined ? footerConfig.brandSuffix : '.store';
  const helpline = footerConfig.helpline || STORE_SETTINGS.phone;
  const whatsapp = footerConfig.whatsapp !== undefined ? footerConfig.whatsapp : STORE_SETTINGS.whatsapp;
  const email = footerConfig.email || STORE_SETTINGS.email;
  const address = footerConfig.address || STORE_SETTINGS.address;
  const aboutText = footerConfig.aboutText || '';
  const copyrightText = footerConfig.copyrightText || '';

  const categoriesList = footerConfig.categoriesList || [
    { label: 'স্মার্টওয়াচ ও কলিং ওয়াচ (Smart Watches)', categoryName: 'Smart Watches' },
    { label: 'টিডব্লিউএস ও ব্লুটুথ ইয়ারবাডস (TWS Earbuds)', categoryName: 'Earbuds & Audio' },
    { label: 'ফাস্ট চার্জার ও পাওয়ার ব্যাংক (GaN Chargers)', categoryName: 'Power & Charging' },
    { label: 'প্রিমিয়াম বেসবল ক্যাপ (Men\'s Caps)', categoryName: "Men's Caps & Fashion" },
    { label: 'হোম ও কিচেন গ্যাজেট (Home Appliances)', categoryName: 'Home & Kitchen' },
    { label: 'গেমিং কিবোর্ড ও মাউস (Gaming Accessories)', categoryName: 'Computer & Gaming' }
  ];

  const customerCareItems = footerConfig.customerCareItems || [
    { label: 'লাইভ অর্ডার ট্র্যাকিং (Track Order)', iconType: 'truck' as const, actionType: 'track' as const },
    { label: '৭ দিনের রিটার্ন ও রিপ্লেসমেন্ট পলিসি', iconType: 'refresh' as const, actionType: 'none' as const },
    { label: 'ওয়ারেন্টি দাবি করার নিয়মাবলী', iconType: 'shield' as const, actionType: 'none' as const },
    { label: 'ডেলিভারি সময়সূচী (ঢাকা ২৪h, সারাদেশে ৪৮-৭২h)', iconType: 'clock' as const, actionType: 'none' as const },
    { label: 'Laravel Merchant & Admin Management Panel', iconType: 'link' as const, actionType: 'admin' as const }
  ];

  const paymentMethods = footerConfig.paymentMethods || [
    { name: 'Cash on Delivery', colorScheme: 'emerald' },
    { name: 'bKash বিকাশ', colorScheme: 'pink' },
    { name: 'Nagad নগদ', colorScheme: 'orange' },
    { name: 'Rocket রকেট', colorScheme: 'purple' },
    { name: 'Visa / Master', colorScheme: 'blue' }
  ];

  const couriersList = footerConfig.couriersList || ['Steadfast Courier', 'Pathao Courier', 'RedX Express'];

  const legalLinks = footerConfig.legalLinks || [
    { label: 'প্রাইভেসি পলিসি', url: '#' },
    { label: 'ব্যবহারের শর্তাবলী', url: '#' },
    { label: 'রিটার্ন পলিসি', url: '#' }
  ];

  // Handlers for lists
  const handleAddCategoryItem = () => {
    if (!newCatLabel.trim()) return;
    const updated = [
      ...categoriesList,
      { label: newCatLabel.trim(), categoryName: newCatValue.trim() || newCatLabel.trim() }
    ];
    onUpdateFooter({ categoriesList: updated });
    setNewCatLabel('');
    setNewCatValue('');
  };

  const handleRemoveCategoryItem = (index: number) => {
    const updated = categoriesList.filter((_, idx) => idx !== index);
    onUpdateFooter({ categoriesList: updated });
  };

  const handleAddCareItem = () => {
    if (!newCareLabel.trim()) return;
    const updated = [
      ...customerCareItems,
      { label: newCareLabel.trim(), iconType: newCareIcon, actionType: newCareAction }
    ];
    onUpdateFooter({ customerCareItems: updated });
    setNewCareLabel('');
  };

  const handleRemoveCareItem = (index: number) => {
    const updated = customerCareItems.filter((_, idx) => idx !== index);
    onUpdateFooter({ customerCareItems: updated });
  };

  const handleAddPayment = () => {
    if (!newPaymentName.trim()) return;
    const updated = [
      ...paymentMethods,
      { name: newPaymentName.trim(), colorScheme: newPaymentColor }
    ];
    onUpdateFooter({ paymentMethods: updated });
    setNewPaymentName('');
  };

  const handleRemovePayment = (index: number) => {
    const updated = paymentMethods.filter((_, idx) => idx !== index);
    onUpdateFooter({ paymentMethods: updated });
  };

  const handleAddCourier = () => {
    if (!newCourierName.trim()) return;
    const updated = [...couriersList, newCourierName.trim()];
    onUpdateFooter({ couriersList: updated });
    setNewCourierName('');
  };

  const handleRemoveCourier = (index: number) => {
    const updated = couriersList.filter((_, idx) => idx !== index);
    onUpdateFooter({ couriersList: updated });
  };

  const handleAddLegal = () => {
    if (!newLegalLabel.trim()) return;
    const updated = [...legalLinks, { label: newLegalLabel.trim(), url: newLegalUrl.trim() || '#' }];
    onUpdateFooter({ legalLinks: updated });
    setNewLegalLabel('');
    setNewLegalUrl('#');
  };

  const handleRemoveLegal = (index: number) => {
    const updated = legalLinks.filter((_, idx) => idx !== index);
    onUpdateFooter({ legalLinks: updated });
  };

  return (
    <div className={`space-y-4 ${isStandalone ? 'p-6 max-w-5xl mx-auto' : ''}`}>
      {/* Header if standalone */}
      {isStandalone && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>ওয়েবসাইট ফুটার কাস্টমাইজার (Footer Editor)</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              কোনো কোডিং ছাড়াই ফুটারের ৪টি কলামের লেখা, ফোন, WhatsApp, ঠিকানা, ক্যাটাগরি লিংক, পেমেন্ট ব্যাজ ও পলিসি পরিবর্তন করুন।
            </p>
          </div>
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="px-4 py-2 bg-[#008060] hover:bg-[#006e52] text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>সেভ ও লাইভ আপডেট করুন</span>
            </button>
          )}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl border border-gray-200 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'info'
              ? 'bg-white text-gray-900 shadow-2xs font-bold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-rose-500" />
          <span>ব্র্যান্ড ও যোগাযোগ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-white text-gray-900 shadow-2xs font-bold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-blue-500" />
          <span>জনপ্রিয় ক্যাটাগরি মেনু ({categoriesList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('customerCare')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'customerCare'
              ? 'bg-white text-gray-900 shadow-2xs font-bold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>গ্রাহক সেবা ও পলিসি ({customerCareItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-white text-gray-900 shadow-2xs font-bold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
          <span>পেমেন্ট ও কুরিয়ার</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('legal')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'legal'
              ? 'bg-white text-gray-900 shadow-2xs font-bold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-purple-500" />
          <span>কপিরাইট ও ফুটার লিংক</span>
        </button>
      </div>

      {/* TAB 1: BRAND & CONTACT INFO (COLUMN 1) */}
      {activeTab === 'info' && (
        <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-xs font-bold text-gray-800">
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px]">১</span>
            <span>কলাম ১: ব্র্যান্ড তথ্য ও যোগাযোগ নম্বর</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                ব্র্যান্ড নাম (Brand Name)
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => onUpdateFooter({ brandName: e.target.value })}
                placeholder="GPE Bangladesh"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                ডোমেইন এক্সটেনশন / সাফিক্স
              </label>
              <input
                type="text"
                value={brandSuffix}
                onChange={(e) => onUpdateFooter({ brandSuffix: e.target.value })}
                placeholder=".store বা .com"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              স্টোর পরিচিতি / বায়ো (About Bio)
            </label>
            <textarea
              rows={3}
              value={aboutText}
              onChange={(e) => onUpdateFooter({ aboutText: e.target.value })}
              placeholder="GPE Bangladesh বাংলাদেশের অন্যতম বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম..."
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1 mb-1">
                <Phone className="w-3.5 h-3.5 text-rose-500" />
                <span>হটলাইন নম্বর (Helpline Phone)</span>
              </label>
              <input
                type="text"
                value={helpline}
                onChange={(e) => onUpdateFooter({ helpline: e.target.value })}
                placeholder="09678-123456"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1 mb-1">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>WhatsApp নম্বর</span>
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => onUpdateFooter({ whatsapp: e.target.value })}
                placeholder="+8801700123456"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1 mb-1">
                <Mail className="w-3.5 h-3.5 text-sky-500" />
                <span>সাপোর্ট ইমেইল এড্রেস</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => onUpdateFooter({ email: e.target.value })}
                placeholder="support@banglaxpress.store"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>অফিস ঠিকানা (Physical Address)</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => onUpdateFooter({ address: e.target.value })}
                placeholder="Level 4, House 12, Road 7, Dhanmondi, Dhaka"
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POPULAR CATEGORIES (COLUMN 2) */}
      {activeTab === 'categories' && (
        <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs font-bold text-gray-800">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">২</span>
              <span>কলাম ২: জনপ্রিয় ক্যাটাগরি মেনু</span>
            </div>
            <span className="text-[11px] font-normal text-gray-500">
              ক্লিক করলে গ্রাহক সংশ্লিষ্ট ক্যাটাগরির প্রোডাক্টে যাবে
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              কলাম শিরোনাম (Header Title)
            </label>
            <input
              type="text"
              value={footerConfig.categoriesTitle || 'জনপ্রিয় ক্যাটাগরি'}
              onChange={(e) => onUpdateFooter({ categoriesTitle: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600"
            />
          </div>

          {/* Current Category Items */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-700 block">
              বিদ্যমান ক্যাটাগরি তালিকা ({categoriesList.length})
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {categoriesList.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 bg-gray-50 hover:bg-gray-100/80 rounded-lg border border-gray-200 text-xs"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cat.label}
                      onChange={(e) => {
                        const updated = [...categoriesList];
                        updated[idx].label = e.target.value;
                        onUpdateFooter({ categoriesList: updated });
                      }}
                      className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium"
                      placeholder="মেনু নাম"
                    />
                    <input
                      type="text"
                      value={cat.categoryName}
                      onChange={(e) => {
                        const updated = [...categoriesList];
                        updated[idx].categoryName = e.target.value;
                        onUpdateFooter({ categoriesList: updated });
                      }}
                      className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600"
                      placeholder="Category filter value"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategoryItem(idx)}
                    className="text-gray-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Category Form */}
          <div className="pt-3 border-t border-gray-100 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <span className="text-[11px] font-bold text-blue-900 block mb-2">
              + নতুন ক্যাটাগরি লিংক যুক্ত করুন
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                placeholder="লেবেল (যেমন: প্রিমিয়াম হেডফোন)"
                className="px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs outline-none"
              />
              <input
                type="text"
                value={newCatValue}
                onChange={(e) => setNewCatValue(e.target.value)}
                placeholder="প্রোডাক্ট ক্যাটাগরি নাম (e.g. Earbuds & Audio)"
                className="px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleAddCategoryItem}
              disabled={!newCatLabel.trim()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>তালিকায় যুক্ত করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER CARE & POLICIES (COLUMN 3) */}
      {activeTab === 'customerCare' && (
        <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs font-bold text-gray-800">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px]">৩</span>
              <span>কলাম ৩: গ্রাহক সেবা, পলিসি ও ট্র্যাকিং</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              কলাম শিরোনাম (Header Title)
            </label>
            <input
              type="text"
              value={footerConfig.customerCareTitle || 'গ্রাহক সেবা ও পলিসি'}
              onChange={(e) => onUpdateFooter({ customerCareTitle: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600"
            />
          </div>

          {/* Current Care Items */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-700 block">
              বিদ্যমান গ্রাহক সেবা ও পলিসি লিস্ট ({customerCareItems.length})
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {customerCareItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 bg-gray-50 hover:bg-gray-100/80 rounded-lg border border-gray-200 text-xs"
                >
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...customerCareItems];
                      updated[idx].label = e.target.value;
                      onUpdateFooter({ customerCareItems: updated });
                    }}
                    className="flex-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium"
                  />
                  <select
                    value={item.iconType}
                    onChange={(e) => {
                      const updated = [...customerCareItems];
                      updated[idx].iconType = e.target.value as any;
                      onUpdateFooter({ customerCareItems: updated });
                    }}
                    className="px-2 py-1 bg-white border border-gray-200 rounded text-[11px]"
                  >
                    <option value="truck">আইকন: Truck</option>
                    <option value="refresh">আইকন: Return</option>
                    <option value="shield">আইকন: Warranty</option>
                    <option value="clock">আইকন: Delivery Time</option>
                    <option value="link">আইকন: External Link</option>
                    <option value="phone">আইকন: Phone</option>
                  </select>
                  <select
                    value={item.actionType || 'none'}
                    onChange={(e) => {
                      const updated = [...customerCareItems];
                      updated[idx].actionType = e.target.value as any;
                      onUpdateFooter({ customerCareItems: updated });
                    }}
                    className="px-2 py-1 bg-white border border-gray-200 rounded text-[11px]"
                  >
                    <option value="none">Action: None</option>
                    <option value="track">Action: Open Tracking Modal</option>
                    <option value="admin">Action: Open Admin Login</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveCareItem(idx)}
                    className="text-gray-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Care Item */}
          <div className="pt-3 border-t border-gray-100 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
            <span className="text-[11px] font-bold text-amber-900 block mb-2">
              + নতুন পলিসি বা লিংক যুক্ত করুন
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                value={newCareLabel}
                onChange={(e) => setNewCareLabel(e.target.value)}
                placeholder="যেমন: ২৪ ঘণ্টা কাস্টমার সাপোর্ট"
                className="px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg text-xs outline-none col-span-1 sm:col-span-1"
              />
              <select
                value={newCareIcon}
                onChange={(e) => setNewCareIcon(e.target.value as any)}
                className="px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg text-xs outline-none"
              >
                <option value="truck">আইকন: Truck</option>
                <option value="refresh">আইকন: Return</option>
                <option value="shield">আইকন: Warranty</option>
                <option value="clock">আইকন: Delivery Time</option>
                <option value="link">আইকন: Link</option>
                <option value="phone">আইকন: Phone</option>
              </select>
              <select
                value={newCareAction}
                onChange={(e) => setNewCareAction(e.target.value as any)}
                className="px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg text-xs outline-none"
              >
                <option value="none">ক্লিক অ্যাকশন: সাধারণ লেখা</option>
                <option value="track">ক্লিক অ্যাকশন: লাইভ ট্র্যাকিং পপআপ</option>
                <option value="admin">ক্লিক অ্যাকশন: এডমিন প্যানেল লগইন</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddCareItem}
              disabled={!newCareLabel.trim()}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>লিস্টে যুক্ত করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENTS & COURIERS (COLUMN 4) */}
      {activeTab === 'payments' && (
        <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs font-bold text-gray-800">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">৪</span>
              <span>কলাম ৪: পেমেন্ট মাধ্যমসমূহ ও ডেলিভারি পার্টনার</span>
            </div>
          </div>

          {/* Payments Section */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  পেমেন্ট সেকশন শিরোনাম
                </label>
                <input
                  type="text"
                  value={footerConfig.paymentTitle || 'পেমেন্ট মাধ্যমসমূহ'}
                  onChange={(e) => onUpdateFooter({ paymentTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  ডেলিভারি পার্টনার শিরোনাম
                </label>
                <input
                  type="text"
                  value={footerConfig.courierTitle || 'ডেলিভারি পার্টনার'}
                  onChange={(e) => onUpdateFooter({ courierTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <label className="text-[11px] font-bold text-gray-700 block pt-1">
              পেমেন্ট মাধ্যম ব্যাজসমূহ ({paymentMethods.length})
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              {paymentMethods.map((pm, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-bold text-gray-800 flex items-center gap-2 shadow-2xs"
                >
                  <span className={`w-2 h-2 rounded-full ${
                    pm.colorScheme === 'pink' ? 'bg-pink-500' :
                    pm.colorScheme === 'orange' ? 'bg-orange-500' :
                    pm.colorScheme === 'purple' ? 'bg-purple-500' :
                    pm.colorScheme === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
                  }`} />
                  <span>{pm.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePayment(idx)}
                    className="text-gray-400 hover:text-rose-600 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Add Payment */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newPaymentName}
                onChange={(e) => setNewPaymentName(e.target.value)}
                placeholder="নতুন পেমেন্ট মাধ্যম (e.g. Upay, City Bank)"
                className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none"
              />
              <select
                value={newPaymentColor}
                onChange={(e) => setNewPaymentColor(e.target.value)}
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none"
              >
                <option value="emerald">কালার: Emerald (Green)</option>
                <option value="pink">কালার: Pink (bKash style)</option>
                <option value="orange">কালার: Orange (Nagad style)</option>
                <option value="purple">কালার: Purple (Rocket style)</option>
                <option value="blue">কালার: Blue (Card style)</option>
              </select>
              <button
                type="button"
                onClick={handleAddPayment}
                disabled={!newPaymentName.trim()}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>যুক্ত করুন</span>
              </button>
            </div>
          </div>

          {/* Couriers Section */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <label className="text-[11px] font-bold text-gray-700 block">
              ডেলিভারি পার্টনার কুরিয়ার তালিকা ({couriersList.length})
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              {couriersList.map((c, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs text-gray-800 flex items-center gap-2 shadow-2xs"
                >
                  <span>• {c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCourier(idx)}
                    className="text-gray-400 hover:text-rose-600 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Add Courier */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCourierName}
                onChange={(e) => setNewCourierName(e.target.value)}
                placeholder="নতুন কুরিয়ার (e.g. Paperfly, eCourier)"
                className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none"
              />
              <button
                type="button"
                onClick={handleAddCourier}
                disabled={!newCourierName.trim()}
                className="px-3 py-1.5 bg-gray-800 hover:bg-black text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>যুক্ত করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COPYRIGHT & LEGAL LINKS (BOTTOM BAR) */}
      {activeTab === 'legal' && (
        <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-xs font-bold text-gray-800">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px]">৫</span>
            <span>ফুটারের নিচের বার: কপিরাইট টেক্সট ও পলিসি লিংক</span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              কপিরাইট ও ট্রেড লাইসেন্স টেক্সট
            </label>
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => onUpdateFooter({ copyrightText: e.target.value })}
              placeholder="© 2026 GPE Bangladesh. All Rights Reserved."
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-600"
            />
          </div>

          {/* Legal Links */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-700 block">
              নিচের পলিসি লিংকসমূহ ({legalLinks.length})
            </label>
            <div className="space-y-1.5">
              {legalLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 text-xs"
                >
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...legalLinks];
                      updated[idx].label = e.target.value;
                      onUpdateFooter({ legalLinks: updated });
                    }}
                    placeholder="লিংক নাম (যেমন: প্রাইভেসি পলিসি)"
                    className="flex-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium"
                  />
                  <input
                    type="text"
                    value={link.url || '#'}
                    onChange={(e) => {
                      const updated = [...legalLinks];
                      updated[idx].url = e.target.value;
                      onUpdateFooter({ legalLinks: updated });
                    }}
                    placeholder="URL (e.g. /privacy)"
                    className="w-44 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLegal(idx)}
                    className="text-gray-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Legal */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newLegalLabel}
                onChange={(e) => setNewLegalLabel(e.target.value)}
                placeholder="নতুন লিংকের নাম (e.g. ডিসক্লেইমার)"
                className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none"
              />
              <input
                type="text"
                value={newLegalUrl}
                onChange={(e) => setNewLegalUrl(e.target.value)}
                placeholder="URL (optional)"
                className="w-32 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none"
              />
              <button
                type="button"
                onClick={handleAddLegal}
                disabled={!newLegalLabel.trim()}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>যুক্ত করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Helper Alert */}
      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">রিয়েল-টাইম লাইভ সিঙ্ক:</span>
          <span>
            এখানে যে পরিবর্তনই করবেন, তা সাথে সাথে মূল ওয়েবসাইটের ফুটারে লাইভ দেখাবে। উপরে ডানে "Save" বাটনে ক্লিক করলে তা স্থায়ীভাবে ব্রাউজার ও সিস্টেমে সংরক্ষিত থাকবে।
          </span>
        </div>
      </div>
    </div>
  );
};
