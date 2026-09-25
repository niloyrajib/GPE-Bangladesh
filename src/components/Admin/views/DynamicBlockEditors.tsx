import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  HelpCircle,
  Video,
  Grid,
  Mail,
  Flame,
  Truck,
  Layout,
  ShoppingBag,
  MessageSquare,
  X,
  Play,
  Award,
  RefreshCw,
  Headphones,
  ShieldCheck,
  Zap,
  Star,
  Check
} from 'lucide-react';
import { DynamicSectionItem, DynamicSectionType, ThemeConfig } from '../../../types';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: DynamicSectionType) => void;
}

const AVAILABLE_BLOCKS: Array<{
  type: DynamicSectionType;
  name: string;
  nameEn: string;
  desc: string;
  icon: any;
  color: string;
  category: string;
}> = [
  {
    type: 'videoBanner',
    name: 'লাইভ ভিডিও আনবক্সিং ব্যানার',
    nameEn: 'Video Showcase Banner',
    desc: 'ইউটিউব বা ভিডিও প্লেয়ার দিয়ে পণ্যের আসল রিভিউ ও বিল্ড কোয়ালিটি প্রদর্শন',
    icon: Video,
    color: 'bg-red-50 text-red-600 border-red-200',
    category: 'Media & Conversion'
  },
  {
    type: 'faqAccordion',
    name: 'সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)',
    nameEn: 'Interactive FAQ Accordion',
    desc: 'গ্রাহকদের সাধারণ প্রশ্ন ও ডেলিভারি সংক্রান্ত উত্তরসমূহ সুন্দর ড্রপডাউন আকারে',
    icon: HelpCircle,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    category: 'Information & Trust'
  },
  {
    type: 'featureGrid',
    name: 'সার্ভিস ও ফিচার হাইলাইটস গ্রিড',
    nameEn: 'Features & Guarantees Grid',
    desc: '১০০% অরিজিনাল, দ্রুততম ডেলিভারি, ৭ দিনের রিটার্ন ও হটলাইন ফিচারের বক্স',
    icon: Grid,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    category: 'Features & Trust'
  },
  {
    type: 'newsletter',
    name: 'VIP ক্লাব কুপন ও সাইনআপ',
    nameEn: 'VIP Discount Club & Newsletter',
    desc: 'গ্রাহকদের ফোন বা ইমেইল সংগ্রহ করে ইনস্ট্যান্ট ১০০৳ ডিসকাউন্ট কুপন প্রদান',
    icon: Mail,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    category: 'Marketing & Leads'
  },
  {
    type: 'promoBanner',
    name: 'প্রোমোশনাল কল-টু-অ্যাকশন ব্যানার',
    nameEn: 'Promotional Callout Banner',
    desc: 'বিশেষ ছাড়, ফ্রি ডেলিভারি বা সিজনাল ক্যাম্পেইনের আকর্ষণীয় ব্যানার',
    icon: Sparkles,
    color: 'bg-rose-50 text-rose-600 border-rose-200',
    category: 'Marketing & Banners'
  },
  {
    type: 'flashDeals',
    name: 'ফ্ল্যাশ ডিলস ও কাউন্টডাউন টাইমার',
    nameEn: 'Flash Deals with Countdown',
    desc: 'সীমিত সময়ের জরুরি অফার ও লাইভ কাউন্টডাউন টাইমার ব্লক',
    icon: Flame,
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    category: 'Sales & Deals'
  },
  {
    type: 'trustBadges',
    name: 'ট্রাস্ট ব্যাজেস (৪টি গ্যারান্টি)',
    nameEn: 'Trust Badges (4 Guarantees)',
    desc: 'ক্যাশ অন ডেলিভারি, দ্রুত ডেলিভারি ও মানি ব্যাক গ্যারান্টি',
    icon: ShieldCheck,
    color: 'bg-teal-50 text-teal-600 border-teal-200',
    category: 'Features & Trust'
  },
  {
    type: 'categoriesSection',
    name: 'ক্যাটাগরি নেভিগেশন আইকন গ্রিড',
    nameEn: 'Category Navigation Grid',
    desc: 'ক্যাটাগরি ছবি ও ফিল্টার বাটন সম্বলিত দ্রুত নেভিগেশন',
    icon: Layout,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    category: 'Navigation'
  },
  {
    type: 'reviewsSection',
    name: 'কাস্টমার রিভিউ ও রেটিং',
    nameEn: 'Customer Reviews & Feedback',
    desc: 'সন্তুষ্ট ক্রেতাদের ভেরিফাইড রিভিউ এবং ৫-স্টার রেটিং সেকশন',
    icon: MessageSquare,
    color: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    category: 'Social Proof'
  },
  {
    type: 'hero',
    name: 'হিরো স্লাইডার ও ব্যানার',
    nameEn: 'Hero Slider & Top Banners',
    desc: 'স্টোরের প্রধান স্লাইডার ও বড় অফার ব্যানার',
    icon: ShoppingBag,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    category: 'Banners'
  }
];

export const AddSectionModal: React.FC<AddSectionModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = ['all', 'Marketing & Leads', 'Media & Conversion', 'Features & Trust', 'Sales & Deals', 'Navigation'];

  const filtered = AVAILABLE_BLOCKS.filter((block) => {
    const matchesCat = selectedCategory === 'all' || block.category === selectedCategory;
    const matchesSearch =
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-600" />
              <span>নতুন সেকশন / ব্লক যোগ করুন (Page Builder)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              যেকোনো ব্লক নির্বাচন করে পেজে যোগ করুন এবং ইচ্ছেমতো উপরে-নিচে সাজান
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 border-b border-gray-100 flex flex-wrap gap-1.5 bg-white">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === c
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c === 'all' ? 'সকল ব্লক' : c}
            </button>
          ))}
        </div>

        {/* Blocks Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {filtered.map((block) => {
            const IconComp = block.icon;
            return (
              <div
                key={block.type}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-rose-400 hover:bg-rose-50/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${block.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                        {block.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {block.nameEn}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                    {block.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onAdd(block.type)}
                  className="w-full py-2 bg-gray-900 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>পেজে যুক্ত করুন</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// EDITOR FOR VIDEO BANNER
export const VideoBannerEditor: React.FC<{
  section: DynamicSectionItem;
  onUpdate: (updatedData: any) => void;
}> = ({ section, onUpdate }) => {
  const data = section.customData || {};

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-900">
        <p className="font-bold flex items-center gap-1.5">
          <Video className="w-4 h-4 text-red-600" />
          <span>লাইভ ভিডিও শোকেস ব্যানার সেটিংস</span>
        </p>
        <p className="text-[11px] text-red-700 mt-1">
          ইউটিউব ভিডিও এম্বেড লিংক ও ব্যানার থাম্বনেইল পরিবর্তন করুন।
        </p>
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">ব্যাজ টেক্সট</label>
        <input
          type="text"
          value={data.badge || '🎬 লাইভ ভিডিও আনবক্সিং'}
          onChange={(e) => onUpdate({ ...data, badge: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">ব্যানার হেডিং / টাইটেল</label>
        <input
          type="text"
          value={data.subtitle || 'গ্যাজেট কেনার আগে আসল আনবক্সিং ভিডিও দেখে নিন'}
          onChange={(e) => onUpdate({ ...data, subtitle: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">সাবটাইটেল / বর্ণনা</label>
        <textarea
          rows={2}
          value={data.description || 'আমাদের নিজস্ব টেক স্টুডিও থেকে পণ্যের বিল্ড কোয়ালিটি এবং আসল ফিচার রিভিউ দেখুন।'}
          onChange={(e) => onUpdate({ ...data, description: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">ইউটিউব ভিডিও URL (Embed Link)</label>
        <input
          type="text"
          value={data.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'}
          onChange={(e) => onUpdate({ ...data, videoUrl: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-mono"
        />
        <span className="text-[10px] text-gray-400 block mt-1">
          উদাহরণ: https://www.youtube.com/embed/VIDEO_ID?autoplay=1
        </span>
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">থাম্বনেইল ব্যাকগ্রাউন্ড ইমেজ URL</label>
        <input
          type="text"
          value={data.image || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&auto=format&fit=crop&q=80'}
          onChange={(e) => onUpdate({ ...data, image: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">বাটন টেক্সট</label>
        <input
          type="text"
          value={data.buttonText || 'ভিডিও দেখে অর্ডার করুন'}
          onChange={(e) => onUpdate({ ...data, buttonText: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>
    </div>
  );
};

// EDITOR FOR FAQ ACCORDION
export const FaqAccordionEditor: React.FC<{
  section: DynamicSectionItem;
  onUpdate: (updatedData: any) => void;
}> = ({ section, onUpdate }) => {
  const data = section.customData || {};
  const faqs = data.faqs || [
    { id: 'f1', question: 'ডেলিভারি চার্জ কত?', answer: 'ঢাকার ভেতর ৬০ টাকা, ঢাকার বাইরে ১২০ টাকা।' },
    { id: 'f2', question: 'ডেলিভারির সময় দেখে নেওয়া যাবে?', answer: 'অবশ্যই! পার্সেল চেক করে টাকা দেওয়ার সুবিধা আছে।' }
  ];

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', val: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: val };
    onUpdate({ ...data, faqs: updated });
  };

  const handleAddFaq = () => {
    const updated = [
      ...faqs,
      { id: `faq-${Date.now()}`, question: 'নতুন প্রশ্ন লিখুন', answer: 'উত্তরের বিস্তারিত বিবরণ লিখুন।' }
    ];
    onUpdate({ ...data, faqs: updated });
  };

  const handleDeleteFaq = (index: number) => {
    const updated = faqs.filter((_, i) => i !== index);
    onUpdate({ ...data, faqs: updated });
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
        <p className="font-bold flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ) সেটিংস</span>
        </p>
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">হেডিং / টাইটেল</label>
        <input
          type="text"
          value={data.subtitle || 'সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর'}
          onChange={(e) => onUpdate({ ...data, subtitle: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">সাবটাইটেল</label>
        <input
          type="text"
          value={data.description || 'আপনার যেকোনো প্রশ্নের দ্রুত সমাধান পেতে নিচে দেখুন'}
          onChange={(e) => onUpdate({ ...data, description: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-gray-900">প্রশ্নাবলি ({faqs.length} টি)</span>
          <button
            type="button"
            onClick={handleAddFaq}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>প্রশ্ন যোগ করুন</span>
          </button>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.id || i} className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-600 text-[11px]">প্রশ্ন #{i + 1}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(i)}
                  className="text-gray-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={f.question}
                onChange={(e) => handleUpdateFaq(i, 'question', e.target.value)}
                placeholder="প্রশ্ন লিখুন"
                className="w-full px-2.5 py-1 border border-gray-300 rounded-md text-xs bg-white"
              />

              <textarea
                rows={2}
                value={f.answer}
                onChange={(e) => handleUpdateFaq(i, 'answer', e.target.value)}
                placeholder="উত্তর লিখুন"
                className="w-full px-2.5 py-1 border border-gray-300 rounded-md text-xs bg-white"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// EDITOR FOR FEATURE GRID
export const FeatureGridEditor: React.FC<{
  section: DynamicSectionItem;
  onUpdate: (updatedData: any) => void;
}> = ({ section, onUpdate }) => {
  const data = section.customData || {};
  const features = data.features || [
    { id: 'f1', title: 'সরাসরি অফিসিয়াল গ্যাজেট', desc: 'সকল গ্যাজেট শতভাগ আসল এবং ব্র্যান্ড ওয়ারেন্টি সহ সরবরাহ করা হয়।', icon: 'award' },
    { id: 'f2', title: 'সবচেয়ে দ্রুত ডেলিভারি', desc: 'ঢাকার মধ্যে ২৪ ঘণ্টার মধ্যে এবং বাইরে ৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি।', icon: 'truck' },
    { id: 'f3', title: '৭ দিনের সহজ এক্সচেঞ্জ', desc: 'পণ্য পছন্দ না হলে বা ডিফেক্ট থাকলে সহজেই পরিবর্তন করে নিন।', icon: 'refresh' },
    { id: 'f4', title: '২৪/৭ হটলাইন সাপোর্ট', desc: 'যেকোনো জিজ্ঞাসায় কল বা হোয়াটসঅ্যাপে রয়েছে ডেডিকেটেড এজেন্ট।', icon: 'headphones' }
  ];

  const handleUpdateItem = (index: number, field: string, val: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: val };
    onUpdate({ ...data, features: updated });
  };

  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
        <p className="font-bold flex items-center gap-1.5">
          <Grid className="w-4 h-4 text-emerald-600" />
          <span>সার্ভিস ও ফিচার হাইলাইটস গ্রিড সেটিংস</span>
        </p>
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">ব্যাজ টেক্সট</label>
        <input
          type="text"
          value={data.badge || '✨ প্রিমিয়াম সেবা'}
          onChange={(e) => onUpdate({ ...data, badge: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">হেডিং / টাইটেল</label>
        <input
          type="text"
          value={data.subtitle || 'কেন আমাদের থেকে শপিং করবেন?'}
          onChange={(e) => onUpdate({ ...data, subtitle: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>

      <div className="space-y-3 pt-2">
        <span className="font-bold text-gray-900 block">ফিচার বক্স সমূহ (৪টি আইটেম)</span>
        {features.map((feat, i) => (
          <div key={feat.id || i} className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <span className="font-bold text-gray-700 text-xs">আইটেম #{i + 1}</span>
            <input
              type="text"
              value={feat.title}
              onChange={(e) => handleUpdateItem(i, 'title', e.target.value)}
              placeholder="ফিচার টাইটেল"
              className="w-full px-2.5 py-1 border border-gray-300 rounded-md text-xs bg-white font-bold"
            />
            <textarea
              rows={2}
              value={feat.desc}
              onChange={(e) => handleUpdateItem(i, 'desc', e.target.value)}
              placeholder="সংক্ষিপ্ত বর্ণনা"
              className="w-full px-2.5 py-1 border border-gray-300 rounded-md text-xs bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// EDITOR FOR NEWSLETTER
export const NewsletterEditor: React.FC<{
  section: DynamicSectionItem;
  onUpdate: (updatedData: any) => void;
}> = ({ section, onUpdate }) => {
  const data = section.customData || {};

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-900">
        <p className="font-bold flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-purple-600" />
          <span>VIP ক্লাব কুপন ও নিউজলেটার সেটিংস</span>
        </p>
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">ব্যাজ টেক্সট</label>
        <input
          type="text"
          value={data.badge || '🎁 স্পেশাল অফার'}
          onChange={(e) => onUpdate({ ...data, badge: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">হেডিং / টাইটেল</label>
        <input
          type="text"
          value={data.subtitle || 'VIP ক্লাবে যোগ দিন ও পান ১০০৳ ছাড়ের কুপন!'}
          onChange={(e) => onUpdate({ ...data, subtitle: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">সাবটাইটেল / অফার টেক্সট</label>
        <textarea
          rows={2}
          value={data.description || 'আমাদের সাপ্তাহিক সিক্রেট ডিসকাউন্ট ও নতুন প্রোডাক্ট লঞ্চ সবার আগে জানার জন্য সাবস্ক্রাইব করুন।'}
          onChange={(e) => onUpdate({ ...data, description: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">বাটন টেক্সট</label>
        <input
          type="text"
          value={data.buttonText || 'কুপন কোড সংগ্রহ করুন'}
          onChange={(e) => onUpdate({ ...data, buttonText: e.target.value })}
          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
        />
      </div>
    </div>
  );
};
