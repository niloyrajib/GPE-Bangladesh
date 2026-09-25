import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Share2,
  Code2,
  Copy,
  Check,
  RotateCcw,
  Save,
  Eye,
  Search,
  ExternalLink,
  HelpCircle,
  Smartphone,
  Laptop,
  Image as ImageIcon,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SEOConfig, ThemeConfig } from '../../../types';
import { DEFAULT_THEME_CONFIG } from '../../../data/defaultThemeConfig';

interface ShopifySEOGeneratorViewProps {
  themeConfig?: ThemeConfig;
  onSaveSEO?: (updatedSEO: SEOConfig) => void;
  showToast?: (message: string) => void;
}

export const ShopifySEOGeneratorView: React.FC<ShopifySEOGeneratorViewProps> = ({
  themeConfig,
  onSaveSEO,
  showToast = (_msg: string) => {}
}) => {
  const currentSEO: SEOConfig = themeConfig?.seo || DEFAULT_THEME_CONFIG.seo || {
    metaTitle: 'GPE Bangladesh - E-Commerce Store & Gadget Hub Bangladesh',
    metaDescription: 'A modern Bangladeshi e-commerce platform with Shopify-style admin dashboard, 1-click fast checkout, bKash & Nagad payments, and inventory management.',
    metaKeywords: 'e-commerce bangladesh, smart watches bd, tws earbuds dhaka, online shopping bangladesh',
    author: 'GPE Bangladesh Ltd.',
    canonicalUrl: 'https://gpebangladesh.store',
    ogTitle: 'GPE Bangladesh - Premium Smart Gadgets & Lifestyle in Bangladesh',
    ogDescription: 'Shop verified gadgets with nationwide Cash on Delivery, official warranty, bKash/Nagad instant payment, and 24-48h express delivery.',
    ogImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterCreator: '@gpebangladesh',
    enableStructuredData: true,
    structuredDataType: 'OnlineStore',
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState<SEOConfig>(currentSEO);
  const [activeTab, setActiveTab] = useState<'meta' | 'opengraph' | 'schema' | 'preview_code'>('meta');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaved, setIsSaved] = useState(false);

  // Field change helper
  const handleChange = <K extends keyof SEOConfig>(key: K, value: SEOConfig[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
    setIsSaved(false);
  };

  // Sync OpenGraph with Meta Tag Values
  const handleSyncFromMeta = () => {
    setFormData((prev) => ({
      ...prev,
      ogTitle: prev.metaTitle,
      ogDescription: prev.metaDescription
    }));
    showToast('OpenGraph tags synced from Meta Title & Description!');
  };

  // Preset Generator Templates
  const handleApplyPreset = (type: 'gadgets' | 'minimal' | 'mega_fest') => {
    if (type === 'gadgets') {
      setFormData((prev) => ({
        ...prev,
        metaTitle: 'GPE Bangladesh | Best Smart Gadgets, Watches & Audio in Bangladesh',
        metaDescription: 'Explore genuine smartwatches, TWS earbuds, fast GaN chargers & mobile accessories in Bangladesh. 100% authentic with official warranty & Cash on Delivery.',
        ogTitle: 'GPE Bangladesh | Authentic Gadgets & Electronics Hub BD',
        ogDescription: 'Shop genuine smartwatches, earbuds & accessories with 24-48h express delivery across Bangladesh. Pay via Cash on Delivery, bKash or Nagad.',
        metaKeywords: 'smart watches bangladesh, tws earbuds bd, fast charger dhaka, bluetooth speaker bd, online shopping'
      }));
      showToast('Applied "Smart Gadgets Store" SEO Preset!');
    } else if (type === 'mega_fest') {
      setFormData((prev) => ({
        ...prev,
        metaTitle: 'GPE Bangladesh Mega Tech Fest 2026 – Up to 50% Off & Fast COD',
        metaDescription: 'Special Mega Fest offer on authentic tech & fashion gadgets! Nationwide home delivery inside 24 hours in Dhaka. Enjoy easy return & full warranty.',
        ogTitle: 'GPE Bangladesh Mega Tech Fest 2026 – Huge Discounts & Offers',
        ogDescription: 'Massive flash deals on top smart gadgets. Order with 1-click Fast Checkout with zero advance payment required.',
        metaKeywords: 'mega tech fest bd, eid gadget discount, bangladesh ecommerce sale, cash on delivery offers'
      }));
      showToast('Applied "Mega Tech Fest" Campaign Preset!');
    } else {
      setFormData((prev) => ({
        ...prev,
        metaTitle: 'GPE Bangladesh - Modern Bangladeshi E-Commerce Platform',
        metaDescription: 'Premium lifestyle and smart tech products with nationwide express shipping and secure digital payments.',
        ogTitle: 'GPE Bangladesh - Modern Bangladeshi E-Commerce Platform',
        ogDescription: 'Premium lifestyle and smart tech products with nationwide express shipping and secure digital payments.'
      }));
      showToast('Applied "Minimalist Brand" SEO Preset!');
    }
  };

  // Reset to default
  const handleReset = () => {
    if (confirm('Are you sure you want to reset SEO tags to initial default values?')) {
      const def = DEFAULT_THEME_CONFIG.seo || currentSEO;
      setFormData(def);
      showToast('Reset to default SEO configuration');
    }
  };

  // Save changes
  const handleSave = () => {
    const updatedWithDate: SEOConfig = {
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    if (onSaveSEO) {
      onSaveSEO(updatedWithDate);
    }
    setIsSaved(true);
    showToast('Meta tags and OpenGraph configuration saved & applied live to website!');
  };

  // Generate HTML tags snippet for export or viewing
  const generatedHtmlSnippet = `<!-- Primary Meta Tags -->
<title>${formData.metaTitle}</title>
<meta name="title" content="${formData.metaTitle}">
<meta name="description" content="${formData.metaDescription}">
${formData.metaKeywords ? `<meta name="keywords" content="${formData.metaKeywords}">\n` : ''}${formData.author ? `<meta name="author" content="${formData.author}">\n` : ''}${formData.canonicalUrl ? `<link rel="canonical" href="${formData.canonicalUrl}">\n` : ''}
<!-- Open Graph / Facebook -->
<meta property="og:type" content="${formData.ogType}">
<meta property="og:url" content="${formData.canonicalUrl || 'https://gpebangladesh.store'}">
<meta property="og:title" content="${formData.ogTitle}">
<meta property="og:description" content="${formData.ogDescription}">
<meta property="og:image" content="${formData.ogImage}">
<meta property="og:site_name" content="GPE Bangladesh">

<!-- Twitter Card -->
<meta name="twitter:card" content="${formData.twitterCard}">
<meta name="twitter:url" content="${formData.canonicalUrl || 'https://gpebangladesh.store'}">
<meta name="twitter:title" content="${formData.ogTitle}">
<meta name="twitter:description" content="${formData.ogDescription}">
<meta name="twitter:image" content="${formData.ogImage}">
${formData.twitterCreator ? `<meta name="twitter:creator" content="${formData.twitterCreator}">\n` : ''}
<!-- Schema.org JSON-LD -->
<script type="application/ld+json">
${JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': formData.structuredDataType || 'OnlineStore',
    name: 'GPE Bangladesh',
    url: formData.canonicalUrl || 'https://gpebangladesh.store',
    description: formData.metaDescription,
    image: formData.ogImage,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'BD'
    }
  },
  null,
  2
)}
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHtmlSnippet);
    setCopiedSnippet(true);
    showToast('HTML Meta Tags copied to clipboard!');
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  // Title & description length stats
  const titleLen = formData.metaTitle.length;
  const descLen = formData.metaDescription.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">Meta Tag & OpenGraph Generator</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  SEO Suite
                </span>
                {isSaved && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Live Active</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize Google search engine snippets, social media share cards (Facebook, WhatsApp, LinkedIn, X), and JSON-LD structured data.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default settings"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-white" />
            <span>Save & Apply SEO</span>
          </button>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold text-amber-900">১-ক্লিক এসইও টেমপ্লেট প্রিসেট (Quick SEO Presets):</span>
            <span className="text-amber-800 ml-1.5">
              রেডিমেড প্রফেশনাল টাইটেল ও ডেসক্রিপশন তাৎক্ষণিক লোড করুন:
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleApplyPreset('gadgets')}
            className="px-3 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-semibold text-amber-900 transition-colors shadow-2xs cursor-pointer"
          >
            📱 Smart Gadgets
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('mega_fest')}
            className="px-3 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-semibold text-amber-900 transition-colors shadow-2xs cursor-pointer"
          >
            🎉 Mega Sale Fest
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('minimal')}
            className="px-3 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-semibold text-amber-900 transition-colors shadow-2xs cursor-pointer"
          >
            ✨ Clean & Minimal
          </button>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-gray-100 p-1.5 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('meta')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'meta' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-blue-600" />
          <span>Google Search Meta Tags</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('opengraph')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'opengraph' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-[#1877F2]" />
          <span>OpenGraph & Social Cards</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schema')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'schema' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-600" />
          <span>Schema.org (JSON-LD)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview_code')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'preview_code' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-purple-600" />
          <span>HTML Head Export Code</span>
        </button>
      </div>

      {/* Grid Layout: Controls (Left) + Interactive Live Previews (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields (7 Columns) */}
        <div className="lg:col-span-7 space-y-5">
          {/* TAB 1: META TAGS */}
          {activeTab === 'meta' && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Google Search Snippet Tags</h3>
                  <p className="text-[11px] text-gray-500">
                    Search engine title, meta description and search keywords.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSyncFromMeta}
                  className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                  title="Copy these to OpenGraph fields"
                >
                  <Copy className="w-3 h-3" />
                  <span>Sync to OpenGraph</span>
                </button>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span>Meta Title (ওয়েবসাইট টাইটেল)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      titleLen > 60
                        ? 'bg-amber-100 text-amber-800'
                        : titleLen < 25
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {titleLen} / 60 chars ({titleLen > 60 ? 'May truncate' : 'Optimal'})
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  placeholder="e.g. GPE Bangladesh - E-Commerce Store & Gadget Hub Bangladesh"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-rose-600 transition-colors"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Google searches typically display up to 55-60 characters before truncating.
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span>Meta Description (সার্চ ডেসক্রিপশন)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      descLen > 160
                        ? 'bg-amber-100 text-amber-800'
                        : descLen < 70
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {descLen} / 160 chars ({descLen > 160 ? 'Long' : 'Optimal'})
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  placeholder="Summarize your online store value proposition, warranty, delivery times, and payment methods..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-rose-600 transition-colors resize-y"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Keep descriptions between 120-160 characters for best click-through rate in search snippets.
                </p>
              </div>

              {/* Keywords */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  SEO Keywords (কমা দিয়ে আলাদা করুন)
                </label>
                <input
                  type="text"
                  value={formData.metaKeywords || ''}
                  onChange={(e) => handleChange('metaKeywords', e.target.value)}
                  placeholder="e.g. smart watch bd, earbuds dhaka, online shopping bangladesh, cod delivery"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-rose-600 transition-colors"
                />
              </div>

              {/* Canonical URL & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1.5">
                    Canonical URL (ক্যানোনিকাল লিংক)
                  </label>
                  <input
                    type="url"
                    value={formData.canonicalUrl || ''}
                    onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                    placeholder="https://gpebangladesh.store"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-rose-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1.5">
                    Author / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => handleChange('author', e.target.value)}
                    placeholder="GPE Bangladesh Ltd."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-rose-600 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPEN GRAPH & TWITTER */}
          {activeTab === 'opengraph' && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">OpenGraph & Social Share Cards</h3>
                  <p className="text-[11px] text-gray-500">
                    Controls thumbnail image, title and snippet when links are shared on Facebook, WhatsApp, or X.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSyncFromMeta}
                  className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Sync from Meta</span>
                </button>
              </div>

              {/* OG Title */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  OpenGraph Title (og:title)
                </label>
                <input
                  type="text"
                  value={formData.ogTitle}
                  onChange={(e) => handleChange('ogTitle', e.target.value)}
                  placeholder="e.g. GPE Bangladesh - Premium Smart Gadgets & Lifestyle in Bangladesh"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-rose-600 transition-colors"
                />
              </div>

              {/* OG Description */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  OpenGraph Description (og:description)
                </label>
                <textarea
                  rows={2}
                  value={formData.ogDescription}
                  onChange={(e) => handleChange('ogDescription', e.target.value)}
                  placeholder="Social preview caption explaining the store..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-rose-600 transition-colors resize-y"
                />
              </div>

              {/* OG Image URL */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                    <span>Social Share Image URL (og:image)</span>
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">Recommended: 1200x630 px</span>
                </div>
                <input
                  type="url"
                  value={formData.ogImage}
                  onChange={(e) => handleChange('ogImage', e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-rose-600 transition-colors"
                />

                {/* Quick Presets for OG Image */}
                <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                  <span className="text-gray-400 shrink-0">Preset banners:</span>
                  {[
                    { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80' },
                    { label: 'Audio Pro', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80' },
                    { label: 'Minimalist', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80' }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleChange('ogImage', p.url)}
                      className="px-2 py-0.5 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 whitespace-nowrap cursor-pointer text-[10.5px]"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* OG Type & Twitter Card settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1.5">
                    og:type
                  </label>
                  <select
                    value={formData.ogType}
                    onChange={(e) => handleChange('ogType', e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white outline-none focus:border-rose-600"
                  >
                    <option value="website">website</option>
                    <option value="article">article</option>
                    <option value="product">product</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1.5">
                    twitter:card
                  </label>
                  <select
                    value={formData.twitterCard}
                    onChange={(e) => handleChange('twitterCard', e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white outline-none focus:border-rose-600"
                  >
                    <option value="summary_large_image">summary_large_image (Large)</option>
                    <option value="summary">summary (Square icon)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1.5">
                    twitter:creator / handle
                  </label>
                  <input
                    type="text"
                    value={formData.twitterCreator || ''}
                    onChange={(e) => handleChange('twitterCreator', e.target.value)}
                    placeholder="@banglaxpress"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-rose-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEMA.ORG JSON-LD */}
          {activeTab === 'schema' && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-sm font-bold text-gray-900">Schema.org Structured Data (JSON-LD)</h3>
                <p className="text-[11px] text-gray-500">
                  Enables rich search snippets, Google knowledge graph info, store phone, and rating stars.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div>
                  <span className="text-xs font-bold text-gray-900 block">
                    Enable Automatic JSON-LD Injection
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Injects standard Schema.org structured metadata directly into document head.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enableStructuredData !== false}
                  onChange={(e) => handleChange('enableStructuredData', e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Schema Type (@type)
                </label>
                <select
                  value={formData.structuredDataType || 'OnlineStore'}
                  onChange={(e) => handleChange('structuredDataType', e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white outline-none focus:border-rose-600"
                >
                  <option value="OnlineStore">OnlineStore (Recommended for E-Commerce)</option>
                  <option value="Store">Store (Retail Business)</option>
                  <option value="Organization">Organization (Company / Brand)</option>
                </select>
              </div>

              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto space-y-1">
                <p className="text-slate-400 font-bold mb-1">// Generated JSON-LD Preview:</p>
                <pre className="text-emerald-400">
                  {JSON.stringify(
                    {
                      '@context': 'https://schema.org',
                      '@type': formData.structuredDataType || 'OnlineStore',
                      name: 'GPE Bangladesh',
                      url: formData.canonicalUrl || 'https://gpebangladesh.store',
                      description: formData.metaDescription,
                      telephone: '+8801800000000',
                      priceRange: '৳৳',
                      address: {
                        '@type': 'PostalAddress',
                        addressLocality: 'Dhaka',
                        addressCountry: 'BD'
                      }
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: HTML PREVIEW & EXPORT */}
          {activeTab === 'preview_code' && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Generated HTML Header Markup</h3>
                  <p className="text-[11px] text-gray-500">
                    Ready-to-use HTML code tag declarations for index.html or production deployment.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? 'Copied!' : 'Copy HTML'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
                  {generatedHtmlSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Real-Time Visual Previews (5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Top Switcher for Desktop / Mobile */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-xs text-xs font-semibold">
            <span className="text-gray-700 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-rose-600" />
              <span>লাইভ প্রিভিউ (Live Card Preview)</span>
            </span>

            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded transition-colors ${
                  previewDevice === 'desktop' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Desktop View"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded transition-colors ${
                  previewDevice === 'mobile' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 1. Google Search SERP Preview */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-gray-400 pb-2 border-b border-gray-100">
              <span className="font-bold flex items-center gap-1.5 text-gray-700">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Google SERP Preview</span>
              </span>
              <span>google.com</span>
            </div>

            <div className="space-y-1">
              {/* Site URL & Breadcrumb */}
              <div className="flex items-center gap-2 text-[11px] text-gray-700">
                <div className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-white text-[9px] font-bold">
                  G
                </div>
                <div>
                  <span className="font-semibold text-gray-900 block leading-tight">GPE Bangladesh</span>
                  <span className="text-[10px] text-gray-500 truncate block">
                    {formData.canonicalUrl || 'https://gpebangladesh.store'}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2 pt-1">
                {formData.metaTitle || 'GPE Bangladesh - E-Commerce Store'}
              </h4>

              {/* Snippet Description */}
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                {formData.metaDescription || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* 2. Facebook & Social Share Card Preview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-[11px]">
              <span className="font-bold text-gray-700 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#1877F2]" />
                <span>Facebook & WhatsApp Share Card</span>
              </span>
              <span className="text-gray-400">og:image preview</span>
            </div>

            <div className="border-b border-gray-100 relative bg-gray-100 aspect-16/9 overflow-hidden">
              {formData.ogImage ? (
                <img
                  src={formData.ogImage}
                  alt="Social Card Banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback placeholder on image load failure
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span>No image specified</span>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-gray-50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                {formData.canonicalUrl ? new URL(formData.canonicalUrl).hostname : 'banglaxpress.store'}
              </span>
              <h5 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">
                {formData.ogTitle || formData.metaTitle}
              </h5>
              <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                {formData.ogDescription || formData.metaDescription}
              </p>
            </div>
          </div>

          {/* 3. Twitter / X Large Summary Card Preview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-[11px]">
              <span className="font-bold text-gray-700 flex items-center gap-1.5">
                <span className="font-black text-xs">𝕏</span>
                <span>Twitter / X Card ({formData.twitterCard})</span>
              </span>
              <span className="text-gray-400 font-mono text-[10px]">{formData.twitterCreator || '@store'}</span>
            </div>

            <div className="p-3.5 space-y-2">
              <div className="rounded-lg overflow-hidden border border-gray-200 aspect-16/9 bg-gray-100">
                {formData.ogImage && (
                  <img
                    src={formData.ogImage}
                    alt="Twitter Card"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 line-clamp-1">
                  {formData.ogTitle || formData.metaTitle}
                </p>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                  {formData.ogDescription || formData.metaDescription}
                </p>
                <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>{formData.canonicalUrl || 'banglaxpress.store'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* SEO Health Checklist Card */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2.5 text-xs">
            <span className="font-bold text-gray-900 block border-b pb-2">
              SEO Best-Practice Audit (চেকলিস্ট)
            </span>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {titleLen >= 20 && titleLen <= 65 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span className="text-gray-700">
                  Title Length: {titleLen} chars (Ideal: 30-60)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {descLen >= 100 && descLen <= 165 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span className="text-gray-700">
                  Description Length: {descLen} chars (Ideal: 120-160)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {formData.ogImage?.startsWith('http') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <span className="text-gray-700">
                  OpenGraph Image URL configured
                </span>
              </div>

              <div className="flex items-center gap-2">
                {formData.enableStructuredData !== false ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <span className="text-gray-700">
                  Schema.org JSON-LD Structured Data enabled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
