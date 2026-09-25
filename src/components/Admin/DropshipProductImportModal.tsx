import React, { useState, useEffect } from 'react';
import {
  X,
  Globe,
  DownloadCloud,
  Check,
  AlertCircle,
  Sparkles,
  Sliders,
  ExternalLink,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  Truck,
  DollarSign,
  PackagePlus,
  Percent,
  CheckCircle2,
  Info,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { Product, DropshipPlatform } from '../../types';
import {
  DROPSHIP_PLATFORMS,
  CURATED_DROPSHIP_CATALOG,
  DropshipPricingRule,
  getStoredPricingRule,
  saveStoredPricingRule,
  detectPlatformFromUrl,
  calculateDropshipPricing,
  parseDropshipUrl
} from '../../utils/dropshipImporter';

interface DropshipProductImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProducts: (products: Product[]) => void;
  showToast?: (message: string) => void;
}

export const DropshipProductImportModal: React.FC<DropshipProductImportModalProps> = ({
  isOpen,
  onClose,
  onImportProducts,
  showToast = (_message?: string) => {}
}) => {
  if (!isOpen) return null;

  // Active view tabs
  const [activeTab, setActiveTab] = useState<'single_url' | 'batch_urls' | 'curated_catalog' | 'pricing_rules'>('single_url');
  const [selectedPlatform, setSelectedPlatform] = useState<DropshipPlatform>('aliexpress');

  // Pricing Rule state
  const [pricingRule, setPricingRule] = useState<DropshipPricingRule>(() => getStoredPricingRule());

  // Mode 1: Single URL State
  const [singleUrlInput, setSingleUrlInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionLog, setExtractionLog] = useState<string[]>([]);
  const [extractedProduct, setExtractedProduct] = useState<Product | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<ReturnType<typeof calculateDropshipPricing> | null>(null);
  const [sourcePriceText, setSourcePriceText] = useState('');

  // Mode 2: Batch URL State
  const [batchUrlsInput, setBatchUrlsInput] = useState('');
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchResults, setBatchResults] = useState<Product[]>([]);

  // Mode 3: Curated Catalog State
  const [catalogFilter, setCatalogFilter] = useState<string>('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<Record<string, boolean>>({});

  // Detect platform automatically when user types/pastes URL in single mode
  useEffect(() => {
    if (singleUrlInput.trim()) {
      const detected = detectPlatformFromUrl(singleUrlInput);
      if (detected) {
        setSelectedPlatform(detected);
      }
    }
  }, [singleUrlInput]);

  // Handle single product extraction
  const handleExtractSingleProduct = async () => {
    if (!singleUrlInput.trim()) {
      showToast('অনুগ্রহ করে পণ্যের URL বা লিঙ্ক প্রবেশ করান');
      return;
    }

    setIsExtracting(true);
    setExtractionLog([]);
    setExtractedProduct(null);
    setPriceBreakdown(null);

    const platformConfig = DROPSHIP_PLATFORMS[selectedPlatform];

    // Animated scraping simulation steps
    const logs = [
      `Connecting to ${platformConfig.name} API gateway (${platformConfig.domain})...`,
      `Extracting product title, high-res images, and SKU parameters...`,
      `Converting currency (${platformConfig.currency} to BDT at ৳${platformConfig.currency === 'USD' ? pricingRule.usdRate : pricingRule.cnyRate})...`,
      `Applying markup rule (${pricingRule.markupMultiplier}x multiplier + ৳${pricingRule.fixedMarkupBDT})...`,
      `Auto-generating Bangla title, specs & warranty...`,
      `Product parsed successfully! Ready for publishing.`
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 320));
      setExtractionLog((prev) => [...prev, logs[i]]);
    }

    try {
      const parsed = parseDropshipUrl(singleUrlInput, selectedPlatform, pricingRule);
      setExtractedProduct(parsed.product);
      setPriceBreakdown(parsed.profitCalculation);
      setSourcePriceText(parsed.sourcePriceFormatted);
      showToast(`${platformConfig.name} থেকে পণ্য তথ্য সফলভাবে লোড হয়েছে!`);
    } catch (e) {
      showToast('পণ্য এক্সট্রাক্ট করতে সমস্যা হয়েছে। লিঙ্কটি পুনরায় চেক করুন।');
    } finally {
      setIsExtracting(false);
    }
  };

  // 1-Click test with sample URL
  const handleUseSampleUrl = (url: string, platform: DropshipPlatform) => {
    setSelectedPlatform(platform);
    setSingleUrlInput(url);
    setExtractedProduct(null);
    setExtractionLog([]);
  };

  // Commit single extracted product into store
  const handlePublishSingleProduct = (status: 'active' | 'draft' = 'active') => {
    if (!extractedProduct) return;
    const finalProd: Product = {
      ...extractedProduct,
      status
    };
    onImportProducts([finalProd]);
    showToast(`'${finalProd.name}' সফলভাবে স্টোরে যুক্ত হয়েছে!`);
    onClose();
  };

  // Handle Batch Import Execution
  const handleRunBatchImport = async () => {
    const rawUrls = batchUrlsInput
      .split(/\r?\n/)
      .map((u) => u.trim())
      .filter((u) => u.length > 5);

    if (rawUrls.length === 0) {
      showToast('কমপক্ষে ১টি ভ্যালিড পণ্যের লিঙ্ক দিন');
      return;
    }

    setIsBatchRunning(true);
    setBatchProgress(0);
    setBatchResults([]);

    const importedList: Product[] = [];

    for (let i = 0; i < rawUrls.length; i++) {
      const url = rawUrls[i];
      await new Promise((resolve) => setTimeout(resolve, 400));
      const parsed = parseDropshipUrl(url, undefined, pricingRule);
      importedList.push(parsed.product);
      setBatchResults([...importedList]);
      setBatchProgress(Math.round(((i + 1) / rawUrls.length) * 100));
    }

    setIsBatchRunning(false);
    showToast(`${importedList.length} টি পণ্য সফলভাবে ব্যাচ ইমপোর্ট সম্পন্ন হয়েছে!`);
  };

  const handlePublishBatchResults = () => {
    if (batchResults.length === 0) return;
    onImportProducts(batchResults);
    showToast(`${batchResults.length} টি পণ্য স্টোরে যুক্ত হয়েছে!`);
    onClose();
  };

  // Curated Catalog handlers
  const filteredCatalog = CURATED_DROPSHIP_CATALOG.filter((item) => {
    const matchesPlatform = catalogFilter === 'all' || item.dropship?.platform === catalogFilter;
    const matchesSearch =
      !catalogSearch ||
      item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (item.banglaName && item.banglaName.toLowerCase().includes(catalogSearch.toLowerCase())) ||
      item.category.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const handleImportCuratedSingle = (item: Product) => {
    // Recalculate price according to current user rule
    const calc = calculateDropshipPricing(
      item.dropship!.sourcePrice,
      item.dropship!.sourceCurrency,
      pricingRule
    );

    const readyProduct: Product = {
      ...item,
      id: `ds-${item.dropship?.platform || 'imp'}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      price: calc.sellingPrice,
      originalPrice: calc.compareAtPrice,
      discountPercent: Math.round(((calc.compareAtPrice - calc.sellingPrice) / calc.compareAtPrice) * 100)
    };

    onImportProducts([readyProduct]);
    showToast(`'${readyProduct.name}' সরাসরি স্টোরে ইমপোর্ট হয়েছে!`);
  };

  const handleImportSelectedCatalog = () => {
    const selectedIds = Object.keys(selectedCatalogIds).filter((id) => selectedCatalogIds[id]);
    if (selectedIds.length === 0) {
      showToast('অনুগ্রহ করে কমপক্ষে ১টি পণ্য নির্বাচন করুন');
      return;
    }

    const itemsToImport = CURATED_DROPSHIP_CATALOG.filter((item) => selectedCatalogIds[item.id]).map(
      (item) => {
        const calc = calculateDropshipPricing(
          item.dropship!.sourcePrice,
          item.dropship!.sourceCurrency,
          pricingRule
        );
        return {
          ...item,
          id: `ds-${item.dropship?.platform || 'imp'}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          price: calc.sellingPrice,
          originalPrice: calc.compareAtPrice,
          discountPercent: Math.round(((calc.compareAtPrice - calc.sellingPrice) / calc.compareAtPrice) * 100)
        };
      }
    );

    onImportProducts(itemsToImport);
    showToast(`${itemsToImport.length} টি ড্রপশিপিং পণ্য স্টোরে ইমপোর্ট করা হয়েছে!`);
    onClose();
  };

  // Pricing Rule save
  const handleSavePricingRule = () => {
    saveStoredPricingRule(pricingRule);
    showToast('কারেন্সি ও প্রাইসিং রুলস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-gray-900 via-[#1b1e24] to-gray-900 text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/30 shrink-0">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white tracking-tight">
                  ড্রপশিপিং প্রোডাক্ট ডাইরেক্ট ইম্পোর্টার (Dropship Direct Import)
                </h3>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  5 Platforms Direct
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                AliExpress • 1688 • Alibaba • CJ Dropshipping • Taobao থেকে যেকোনো পণ্যের লিঙ্ক সরাসরি ইম্পোর্ট করুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supported Platforms Strip */}
        <div className="bg-gray-50/90 px-5 py-2.5 border-b border-gray-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-500 font-semibold shrink-0 text-[11px] flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            সাপোর্টেড প্ল্যাটফর্ম:
          </span>

          {(Object.keys(DROPSHIP_PLATFORMS) as DropshipPlatform[]).map((pid) => {
            const p = DROPSHIP_PLATFORMS[pid];
            const isCurrent = selectedPlatform === pid;
            return (
              <button
                key={pid}
                type="button"
                onClick={() => {
                  setSelectedPlatform(pid);
                  if (activeTab === 'single_url' && !singleUrlInput) {
                    setSingleUrlInput(p.sampleUrls[0].url);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0 border ${
                  isCurrent
                    ? `${p.badgeBg} ring-2 ring-rose-500/20 shadow-xs font-bold`
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentColor }} />
                <span>{p.name}</span>
                <span className="text-[10px] opacity-75">
                  ({p.currencySymbol} {p.currency})
                </span>
              </button>
            );
          })}

          <div className="ml-auto shrink-0 flex items-center gap-2 text-[11px] text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
            <span>লাইভ রেট:</span>
            <span className="font-mono font-bold text-gray-900">$1 = ৳{pricingRule.usdRate}</span>
            <span className="text-gray-300">|</span>
            <span className="font-mono font-bold text-gray-900">¥1 = ৳{pricingRule.cnyRate}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 bg-white border-b border-gray-200 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('single_url')}
              className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'single_url'
                  ? 'border-rose-600 text-rose-600 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <PackagePlus className="w-4 h-4" />
              <span>লিঙ্ক দিয়ে ডাইরেক্ট ইম্পোর্ট (URL Import)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('batch_urls')}
              className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'batch_urls'
                  ? 'border-rose-600 text-rose-600 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>একসাথে একাধিক লিঙ্ক (Batch Multi-URL)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('curated_catalog')}
              className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'curated_catalog'
                  ? 'border-rose-600 text-rose-600 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>টপ ট্রেন্ডিং উইনিং প্রোডাক্টস (Curated Catalog)</span>
              <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-full">
                {CURATED_DROPSHIP_CATALOG.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pricing_rules')}
              className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'pricing_rules'
                  ? 'border-rose-600 text-rose-600 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>প্রাইসিং ও কারেন্সি রুলস (Pricing Rules)</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-gray-50/50 space-y-5">
          {/* TAB 1: SINGLE URL DIRECT IMPORT */}
          {activeTab === 'single_url' && (
            <div className="space-y-4">
              {/* Input Card */}
              <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-rose-600" />
                    <span>প্রোডাক্ট URL অথবা লিঙ্ক পেস্ট করুন (Paste Product URL)</span>
                  </label>
                  <span className="text-[11px] text-gray-500">
                    বর্তমানে নির্বাচিত:{' '}
                    <strong className="text-gray-900">{DROPSHIP_PLATFORMS[selectedPlatform].name}</strong> (
                    {DROPSHIP_PLATFORMS[selectedPlatform].domain})
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={singleUrlInput}
                      onChange={(e) => setSingleUrlInput(e.target.value)}
                      placeholder={`যেমন: ${DROPSHIP_PLATFORMS[selectedPlatform].placeholderUrl}`}
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-100 font-mono"
                    />
                    {singleUrlInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setSingleUrlInput('');
                          setExtractedProduct(null);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleExtractSingleProduct}
                    disabled={isExtracting || !singleUrlInput.trim()}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    {isExtracting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>এক্সট্রাক্ট হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Fetch & Import Product</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Sample Links to Test 1-Click */}
                <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-gray-500 text-[11px] font-medium flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                    দ্রুত টেস্ট করার ডেমো লিঙ্ক:
                  </span>
                  {DROPSHIP_PLATFORMS[selectedPlatform].sampleUrls.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleUseSampleUrl(sample.url, selectedPlatform)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-rose-50 hover:text-rose-700 border border-gray-200 text-gray-700 rounded-lg text-[11px] font-medium transition-colors"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extraction Progress Logs */}
              {isExtracting && (
                <div className="bg-gray-900 text-gray-200 p-4 rounded-xl font-mono text-xs space-y-1.5 border border-gray-800 shadow-inner">
                  <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Scraping & Parsing Product Data in Realtime...</span>
                  </div>
                  {extractionLog.map((log, index) => (
                    <div key={index} className="flex items-center gap-2 text-[11.5px] text-gray-300">
                      <span className="text-emerald-400">✓</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Extracted Product Preview Card */}
              {extractedProduct && priceBreakdown && (
                <div className="bg-white rounded-2xl border-2 border-rose-500/40 p-5 shadow-md space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        সফলভাবে এক্সট্রাক্ট হয়েছে
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${DROPSHIP_PLATFORMS[extractedProduct.dropship?.platform as DropshipPlatform || 'aliexpress']?.badgeBg}`}
                      >
                        {DROPSHIP_PLATFORMS[extractedProduct.dropship?.platform as DropshipPlatform || 'aliexpress']?.name} Direct
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">মূল উৎস মূল্য:</span>
                      <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                        {sourcePriceText}
                      </span>
                    </div>
                  </div>

                  {/* Main Product Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Left: Images */}
                    <div className="md:col-span-4 space-y-2">
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={extractedProduct.images[0]}
                          alt={extractedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {extractedProduct.images.slice(0, 3).map((img, i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Editable Details */}
                    <div className="md:col-span-8 space-y-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          প্রোডাক্টের নাম (English Title):
                        </label>
                        <input
                          type="text"
                          value={extractedProduct.name}
                          onChange={(e) =>
                            setExtractedProduct({ ...extractedProduct, name: e.target.value })
                          }
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          বাংলা নাম (Bangla Title):
                        </label>
                        <input
                          type="text"
                          value={extractedProduct.banglaName || ''}
                          onChange={(e) =>
                            setExtractedProduct({ ...extractedProduct, banglaName: e.target.value })
                          }
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">ক্যাটাগরি:</label>
                          <select
                            value={extractedProduct.category}
                            onChange={(e) =>
                              setExtractedProduct({ ...extractedProduct, category: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                          >
                            <option value="Smart Watches">Smart Watches</option>
                            <option value="Earbuds & Audio">Earbuds & Audio</option>
                            <option value="Power & Charging">Power & Charging</option>
                            <option value="Computer & Gaming">Computer & Gaming</option>
                            <option value="Home & Kitchen">Home & Kitchen</option>
                            <option value="Men's Caps & Fashion">Men's Caps & Fashion</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            বিক্রয় মূল্য (Selling Price ৳):
                          </label>
                          <input
                            type="number"
                            value={extractedProduct.price}
                            onChange={(e) =>
                              setExtractedProduct({
                                ...extractedProduct,
                                price: Number(e.target.value)
                              })
                            }
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold text-emerald-700"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            পূর্বের মূল্য (Compare Price ৳):
                          </label>
                          <input
                            type="number"
                            value={extractedProduct.originalPrice}
                            onChange={(e) =>
                              setExtractedProduct({
                                ...extractedProduct,
                                originalPrice: Number(e.target.value)
                              })
                            }
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-mono text-gray-500"
                          />
                        </div>
                      </div>

                      {/* Profit Breakdown Banner */}
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-bold text-emerald-900">
                            প্রফিট হিসাব (Profit Margin Analysis):
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            আনুমানিক খরচ: ৳{priceBreakdown.landedCostBDT} | বিক্রয় মূল্য: ৳
                            {extractedProduct.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded bg-emerald-600 text-white font-mono font-bold text-xs">
                            +৳{extractedProduct.price - priceBreakdown.landedCostBDT} লাভ
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-800">
                            ({Math.round(((extractedProduct.price - priceBreakdown.landedCostBDT) / extractedProduct.price) * 100)}% মার্জিন)
                          </span>
                        </div>
                      </div>

                      {/* Source & Shipping Info */}
                      <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div>
                          <span className="text-gray-500 block">সাপ্লায়ার:</span>
                          <span className="font-semibold text-gray-800 truncate block">
                            {extractedProduct.dropship?.supplierName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">শিপিং সময়:</span>
                          <span className="font-semibold text-gray-800">
                            {extractedProduct.dropship?.shippingDays}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">রেটিং:</span>
                          <span className="font-semibold text-amber-600">
                            ★ {extractedProduct.rating} ({extractedProduct.reviewCount})
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">স্টক:</span>
                          <span className="font-semibold text-emerald-700 font-mono">
                            {extractedProduct.stockCount} Available
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <a
                      href={extractedProduct.dropship?.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>উৎস প্ল্যাটফর্মে ওপেন করুন</span>
                    </a>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handlePublishSingleProduct('draft')}
                        className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
                      >
                        ড্রাফট হিসেবে রাখুন (Save Draft)
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePublishSingleProduct('active')}
                        className="flex-1 sm:flex-none px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>স্টোরে পাবলিশ করুন (Publish to Store)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BATCH MULTI-URL IMPORTER */}
          {activeTab === 'batch_urls' && (
            <div className="space-y-4">
              <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-rose-600" />
                    <span>একাধিক লিঙ্ক পেস্ট করুন (প্রতি লাইনে ১টি লিঙ্ক)</span>
                  </label>
                  <span className="text-[11px] text-gray-500">
                    AliExpress, 1688, Alibaba, CJ, Taobao যেকোনো লিঙ্ক মিক্স করতে পারবেন
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={batchUrlsInput}
                  onChange={(e) => setBatchUrlsInput(e.target.value)}
                  placeholder={`https://www.aliexpress.com/item/1005005829103948.html\nhttps://detail.1688.com/offer/684920194821.html\nhttps://cjdropshipping.com/product/anti-gravity-water-drop-air-humidifier-p-162948102948.html\nhttps://item.taobao.com/item.htm?id=729481029481`}
                  className="w-full px-3.5 py-2.5 text-xs font-mono border border-gray-300 rounded-xl outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-100 leading-relaxed"
                />

                <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      const demoUrls = [
                        'https://www.aliexpress.com/item/1005005829103948.html',
                        'https://detail.1688.com/offer/684920194821.html',
                        'https://www.alibaba.com/product-detail/GaN-100W-Fast-Charge-Powerbank_160089201948.html',
                        'https://cjdropshipping.com/product/anti-gravity-water-drop-air-humidifier-p-162948102948.html',
                        'https://item.taobao.com/item.htm?id=729481029481'
                      ].join('\n');
                      setBatchUrlsInput(demoUrls);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    + ৫টি প্ল্যাটফর্মের ডেমো লিঙ্ক পূরণ করুন
                  </button>

                  <button
                    type="button"
                    onClick={handleRunBatchImport}
                    disabled={isBatchRunning || !batchUrlsInput.trim()}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    {isBatchRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>ইমপোর্ট হচ্ছে ({batchProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Start Batch Import</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {isBatchRunning && (
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>প্রসেসিং অগ্রগতি</span>
                    <span className="font-mono">{batchProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-rose-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${batchProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Batch Results Table */}
              {batchResults.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900">
                      ইমপোর্টকৃত প্রোডাক্ট তালিকা ({batchResults.length} টি)
                    </h4>
                    <button
                      type="button"
                      onClick={handlePublishBatchResults}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>সবগুলো স্টোরে যোগ করুন (Confirm & Publish)</span>
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                    {batchResults.map((p, idx) => (
                      <div key={idx} className="py-2.5 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                            <span className="font-bold text-rose-600 uppercase">
                              {p.dropship?.platform}
                            </span>
                            <span>•</span>
                            <span>{p.category}</span>
                            <span>•</span>
                            <span className="font-mono font-bold text-gray-900">
                              ৳{p.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Ready
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CURATED WINNING CATALOG */}
          {activeTab === 'curated_catalog' && (
            <div className="space-y-4">
              {/* Filter bar */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="পণ্য বা ক্যাটাগরি সার্চ করুন..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-gray-900"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Platform Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
                  <button
                    type="button"
                    onClick={() => setCatalogFilter('all')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      catalogFilter === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Platforms
                  </button>

                  {(Object.keys(DROPSHIP_PLATFORMS) as DropshipPlatform[]).map((pid) => (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => setCatalogFilter(pid)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                        catalogFilter === pid
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {DROPSHIP_PLATFORMS[pid].name}
                    </button>
                  ))}
                </div>

                {/* Bulk Select Button */}
                <button
                  type="button"
                  onClick={handleImportSelectedCatalog}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 shadow-xs transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>নির্বাচিত ইমপোর্ট করুন</span>
                </button>
              </div>

              {/* Grid of Curated Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredCatalog.map((item) => {
                  const pid = (item.dropship?.platform as DropshipPlatform) || 'aliexpress';
                  const platformConfig = DROPSHIP_PLATFORMS[pid];
                  const calc = calculateDropshipPricing(
                    item.dropship!.sourcePrice,
                    item.dropship!.sourceCurrency,
                    pricingRule
                  );
                  const isChecked = !!selectedCatalogIds[item.id];

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-xl border p-3.5 shadow-xs transition-all flex flex-col justify-between space-y-3 ${
                        isChecked ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Checkbox and image */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              setSelectedCatalogIds({
                                ...selectedCatalogIds,
                                [item.id]: e.target.checked
                              })
                            }
                            className="absolute top-1 left-1 rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                          />
                        </div>

                        {/* Title and details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded ${platformConfig.badgeBg}`}
                            >
                              {platformConfig.name}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">
                              Cost: {platformConfig.currencySymbol}
                              {item.dropship?.sourcePrice}
                            </span>
                          </div>

                          <h5 className="text-xs font-bold text-gray-900 truncate mt-1" title={item.name}>
                            {item.name}
                          </h5>
                          {item.banglaName && (
                            <p className="text-[10.5px] text-gray-500 truncate">{item.banglaName}</p>
                          )}

                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs font-bold font-mono text-emerald-700">
                              ৳{calc.sellingPrice.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-gray-400 line-through font-mono">
                              ৳{calc.compareAtPrice.toLocaleString()}
                            </span>
                            <span className="text-[9.5px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">
                              +৳{calc.estimatedProfitBDT} লাভ
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Info & 1-Click Import button */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 text-[10.5px]">
                        <span className="text-gray-500 truncate">
                          {item.dropship?.shippingDays || 'Express Air'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleImportCuratedSingle(item)}
                          className="px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors shadow-2xs cursor-pointer"
                        >
                          <PackagePlus className="w-3.5 h-3.5 text-amber-300" />
                          <span>1-Click Import</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: PRICING & EXCHANGE RATE RULES */}
          {activeTab === 'pricing_rules' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-rose-600" />
                    <span>স্মার্ট কারেন্সি ও প্রফিট মার্জিন কনফিগারেশন</span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    উৎস সাইটের মূল্য (USD/CNY) থেকে অটোমেটিক বিক্রয় মূল্য ও প্রফিট মার্জিন নির্ধারণ করুন।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* USD Rate */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                      <span>USD থেকে BDT বিনিময় হার ($1 = ৳):</span>
                      <span className="text-rose-600 font-mono font-bold">৳{pricingRule.usdRate}</span>
                    </label>
                    <input
                      type="number"
                      value={pricingRule.usdRate}
                      onChange={(e) =>
                        setPricingRule({ ...pricingRule, usdRate: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-900 bg-white"
                    />
                    <p className="text-[10.5px] text-gray-500">AliExpress, Alibaba, CJ Dropshipping এর জন্য</p>
                  </div>

                  {/* CNY Rate */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                      <span>CNY (Chinese Yuan) থেকে BDT (¥1 = ৳):</span>
                      <span className="text-orange-600 font-mono font-bold">৳{pricingRule.cnyRate}</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={pricingRule.cnyRate}
                      onChange={(e) =>
                        setPricingRule({ ...pricingRule, cnyRate: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-900 bg-white"
                    />
                    <p className="text-[10.5px] text-gray-500">1688.com এবং Taobao এর জন্য</p>
                  </div>

                  {/* Markup Multiplier */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                      <span>প্রাইস মাল্টিপ্লায়ার (Markup Multiplier):</span>
                      <span className="text-emerald-700 font-mono font-bold">
                        {pricingRule.markupMultiplier}x
                      </span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={pricingRule.markupMultiplier}
                      onChange={(e) =>
                        setPricingRule({ ...pricingRule, markupMultiplier: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-900 bg-white"
                    />
                    <p className="text-[10.5px] text-gray-500">
                      যেমন: 2.0x মানে পণ্য খরচের দ্বিগুণ বা ১০০% গ্রস মার্জিন
                    </p>
                  </div>

                  {/* Fixed Fee / Handling */}
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                      <span>ফিক্সড হ্যান্ডলিং ও শিপিং বরাদ্দ (৳):</span>
                      <span className="font-mono font-bold text-gray-900">
                        ৳{pricingRule.fixedMarkupBDT + pricingRule.shippingAllowanceBDT}
                      </span>
                    </label>
                    <input
                      type="number"
                      value={pricingRule.fixedMarkupBDT}
                      onChange={(e) =>
                        setPricingRule({ ...pricingRule, fixedMarkupBDT: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono text-gray-900 bg-white"
                    />
                    <p className="text-[10.5px] text-gray-500">
                      প্রতিটি অর্ডারে হ্যান্ডলিং ফি হিসেবে অতিরিক্ত যোগ হবে
                    </p>
                  </div>
                </div>

                {/* Example live preview calculation */}
                <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs space-y-2">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>উদাহরণ প্রাইসিং প্রিভিউ (Example Calculation):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-gray-300">
                    <div>
                      <span>$10 AliExpress আইটেম:</span>
                      <p className="text-emerald-400 font-bold text-xs mt-0.5">
                        ৳{calculateDropshipPricing(10, 'USD', pricingRule).sellingPrice} বিক্রয় মূল্য
                      </p>
                    </div>
                    <div>
                      <span>¥50 1688 ফ্যাক্টরি আইটেম:</span>
                      <p className="text-emerald-400 font-bold text-xs mt-0.5">
                        ৳{calculateDropshipPricing(50, 'CNY', pricingRule).sellingPrice} বিক্রয় মূল্য
                      </p>
                    </div>
                    <div>
                      <span>$15 CJ Dropship আইটেম:</span>
                      <p className="text-emerald-400 font-bold text-xs mt-0.5">
                        ৳{calculateDropshipPricing(15, 'USD', pricingRule).sellingPrice} বিক্রয় মূল্য
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSavePricingRule}
                    className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>রুলস সেভ করুন (Save Rules)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <Truck className="w-3.5 h-3.5 text-rose-600" />
              <span>সরাসরি বাংলাদেশে ড্রপশিপিং সাপোর্টেড</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
