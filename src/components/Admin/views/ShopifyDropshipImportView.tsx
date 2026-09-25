import React, { useState } from 'react';
import {
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
  Filter,
  Plus
} from 'lucide-react';
import { Product, DropshipPlatform } from '../../../types';
import {
  DROPSHIP_PLATFORMS,
  CURATED_DROPSHIP_CATALOG,
  DropshipPricingRule,
  getStoredPricingRule,
  saveStoredPricingRule,
  detectPlatformFromUrl,
  calculateDropshipPricing,
  parseDropshipUrl
} from '../../../utils/dropshipImporter';

interface ShopifyDropshipImportViewProps {
  products?: Product[];
  onAddNewProduct?: (product: Product) => void;
  onBulkImport?: (products: Product[], replaceExisting: boolean) => void;
  showToast?: (message: string) => void;
}

export const ShopifyDropshipImportView: React.FC<ShopifyDropshipImportViewProps> = ({
  products = [],
  onAddNewProduct,
  onBulkImport,
  showToast = (_message?: string) => {}
}) => {
  const [activeTab, setActiveTab] = useState<'url_import' | 'catalog' | 'batch' | 'pricing' | 'imported_history'>('url_import');
  const [selectedPlatform, setSelectedPlatform] = useState<DropshipPlatform>('aliexpress');
  const [pricingRule, setPricingRule] = useState<DropshipPricingRule>(() => getStoredPricingRule());

  // Mode 1: Single URL
  const [urlInput, setUrlInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionLog, setExtractionLog] = useState<string[]>([]);
  const [extractedProduct, setExtractedProduct] = useState<Product | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<ReturnType<typeof calculateDropshipPricing> | null>(null);

  // Mode 2: Batch URLs
  const [batchInput, setBatchInput] = useState('');
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchImportedList, setBatchImportedList] = useState<Product[]>([]);

  // Mode 3: Catalog Filter
  const [catalogFilter, setCatalogFilter] = useState<string>('all');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Detect platform automatically
  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    const detected = detectPlatformFromUrl(val);
    if (detected) {
      setSelectedPlatform(detected);
    }
  };

  const handleExtractSingle = async () => {
    if (!urlInput.trim()) {
      showToast('অনুগ্রহ করে পণ্যের URL বা লিঙ্ক প্রবেশ করান');
      return;
    }

    setIsExtracting(true);
    setExtractionLog([]);
    setExtractedProduct(null);

    const platformConfig = DROPSHIP_PLATFORMS[selectedPlatform];
    const logs = [
      `Connecting to ${platformConfig.name} API gateway (${platformConfig.domain})...`,
      `Extracting product title, high-res images, and SKU parameters...`,
      `Converting currency (${platformConfig.currency} to BDT at ৳${platformConfig.currency === 'USD' ? pricingRule.usdRate : pricingRule.cnyRate})...`,
      `Applying markup rule (${pricingRule.markupMultiplier}x multiplier + ৳${pricingRule.fixedMarkupBDT})...`,
      `Auto-generating Bangla title, specs & warranty...`,
      `Product parsed successfully! Ready for publishing.`
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setExtractionLog((prev) => [...prev, logs[i]]);
    }

    try {
      const parsed = parseDropshipUrl(urlInput, selectedPlatform, pricingRule);
      setExtractedProduct(parsed.product);
      setPriceBreakdown(parsed.profitCalculation);
      showToast(`${platformConfig.name} থেকে পণ্য সফলভাবে এক্সট্রাক্ট করা হয়েছে!`);
    } catch (e) {
      showToast('পণ্য এক্সট্রাক্ট করতে সমস্যা হয়েছে। লিঙ্কটি পুনরায় চেক করুন।');
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePublishSingle = (status: 'active' | 'draft' = 'active') => {
    if (!extractedProduct) return;
    const finalProd = { ...extractedProduct, status };
    if (onAddNewProduct) {
      onAddNewProduct(finalProd);
    }
    showToast(`'${finalProd.name}' সফলভাবে আপনার স্টোরে যুক্ত হয়েছে!`);
    setExtractedProduct(null);
    setUrlInput('');
  };

  const handleBatchImportRun = async () => {
    const rawUrls = batchInput
      .split(/\r?\n/)
      .map((u) => u.trim())
      .filter((u) => u.length > 5);

    if (rawUrls.length === 0) {
      showToast('কমপক্ষে ১টি ভ্যালিড পণ্যের লিঙ্ক দিন');
      return;
    }

    setIsBatchRunning(true);
    setBatchProgress(0);
    setBatchImportedList([]);

    const items: Product[] = [];
    for (let i = 0; i < rawUrls.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const parsed = parseDropshipUrl(rawUrls[i], undefined, pricingRule);
      items.push(parsed.product);
      setBatchImportedList([...items]);
      setBatchProgress(Math.round(((i + 1) / rawUrls.length) * 100));
    }

    setIsBatchRunning(false);
    showToast(`${items.length} টি ড্রপশিপিং পণ্য প্রস্তুত হয়েছে!`);
  };

  const handlePublishBatch = () => {
    if (batchImportedList.length === 0) return;
    if (onBulkImport) {
      onBulkImport(batchImportedList, false);
    } else if (onAddNewProduct) {
      batchImportedList.forEach((p) => onAddNewProduct(p));
    }
    showToast(`${batchImportedList.length} টি ড্রপশিপিং পণ্য স্টোরে যুক্ত হয়েছে!`);
    setBatchImportedList([]);
    setBatchInput('');
  };

  // Curated Catalog single import
  const handleImportCuratedItem = (item: Product) => {
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

    if (onAddNewProduct) {
      onAddNewProduct(readyProduct);
    }
    showToast(`'${readyProduct.name}' সরাসরি স্টোরে ইমপোর্ট হয়েছে!`);
  };

  // Filter dropshipped products already in store
  const existingDropshipProducts = products.filter((p) => !!p.dropship);

  const filteredCatalog = CURATED_DROPSHIP_CATALOG.filter((item) => {
    const matchesPlatform = catalogFilter === 'all' || item.dropship?.platform === catalogFilter;
    const matchesSearch =
      !catalogSearch ||
      item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (item.banglaName && item.banglaName.toLowerCase().includes(catalogSearch.toLowerCase()));
    return matchesPlatform && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Top Banner / Hero Card */}
      <div className="bg-gradient-to-r from-gray-900 via-[#1e2229] to-gray-900 rounded-2xl p-5 text-white shadow-sm border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/30 shrink-0">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white tracking-tight">
                  ড্রপশিপিং প্রোডাক্ট ডাইরেক্ট ইম্পোর্টার (Dropship Direct Import Hub)
                </h2>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  5 Platforms Direct
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                AliExpress, 1688, Alibaba, CJ Dropshipping এবং Taobao থেকে যেকোনো পণ্য সরাসরি ইম্পোর্ট করে অটোমেটিক কারেন্সি রূপান্তর (USD/CNY to BDT) ও প্রফিট মার্জিন সেট করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs shrink-0">
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="text-gray-300">ইমপোর্টকৃত প্রোডাক্ট:</span>
              <span className="font-mono font-bold text-amber-300">
                {existingDropshipProducts.length} টি
              </span>
            </div>
          </div>
        </div>

        {/* 5 Platforms Row */}
        <div className="mt-4 pt-4 border-t border-gray-800/80 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {(Object.keys(DROPSHIP_PLATFORMS) as DropshipPlatform[]).map((pid) => {
            const p = DROPSHIP_PLATFORMS[pid];
            const isSelected = selectedPlatform === pid;
            return (
              <button
                key={pid}
                type="button"
                onClick={() => {
                  setSelectedPlatform(pid);
                  if (activeTab === 'url_import') {
                    setUrlInput(p.sampleUrls[0].url);
                  }
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-white/15 border-rose-500 ring-2 ring-rose-500/40 text-white'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accentColor }} />
                  <span className="font-bold text-xs truncate">{p.name}</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {p.currencySymbol} {p.currency} ({p.currency === 'USD' ? `$1 = ৳${pricingRule.usdRate}` : `¥1 = ৳${pricingRule.cnyRate}`})
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-2xs flex items-center gap-1 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('url_import')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'url_import' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <PackagePlus className="w-3.5 h-3.5 text-amber-300" />
          <span>URL ডাইরেক্ট ইম্পোর্ট (Direct Link)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('batch')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'batch' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>ব্যাচ ইম্পোর্ট (Multi-URL)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'catalog' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
          <span>টপ উইনিং ক্যাটালগ (Winning Catalog)</span>
          <span className="text-[9.5px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-full">
            {CURATED_DROPSHIP_CATALOG.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'pricing' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>কারেন্সি ও প্রাইসিং রুলস</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('imported_history')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'imported_history' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
          <span>স্টোরে বিদ্যমান ড্রপশিপ আইটেম ({existingDropshipProducts.length})</span>
        </button>
      </div>

      {/* VIEW 1: URL DIRECT IMPORT */}
      {activeTab === 'url_import' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-rose-600" />
                <span>প্রোডাক্ট লিঙ্ক বা URL দিন (AliExpress, 1688, Alibaba, CJ, Taobao):</span>
              </label>
              <span className="text-xs text-gray-500">
                প্ল্যাটফর্ম: <strong className="text-gray-900">{DROPSHIP_PLATFORMS[selectedPlatform].name}</strong>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder={`যেমন: ${DROPSHIP_PLATFORMS[selectedPlatform].placeholderUrl}`}
                className="flex-1 px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-100 font-mono"
              />
              <button
                type="button"
                onClick={handleExtractSingle}
                disabled={isExtracting || !urlInput.trim()}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>এক্সট্রাক্ট হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Fetch Product Data</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo links */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500 text-[11px] font-medium flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-gray-400" />
                টেস্ট লিঙ্ক:
              </span>
              {DROPSHIP_PLATFORMS[selectedPlatform].sampleUrls.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrlInput(sample.url);
                    setExtractedProduct(null);
                  }}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-rose-50 hover:text-rose-700 border border-gray-200 text-gray-700 rounded-lg text-[11px] font-medium transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Extraction Logs */}
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

          {/* Extracted Product Card */}
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
                  <span className="text-gray-500">উৎস মূল্য:</span>
                  <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                    {DROPSHIP_PLATFORMS[extractedProduct.dropship?.platform as DropshipPlatform || 'aliexpress']?.currencySymbol}
                    {extractedProduct.dropship?.sourcePrice} {extractedProduct.dropship?.sourceCurrency}
                  </span>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
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

                <div className="md:col-span-8 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">প্রোডাক্টের নাম:</label>
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
                    <label className="block font-bold text-gray-700 mb-1">বাংলা নাম:</label>
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
                      <label className="block font-bold text-gray-700 mb-1">বিক্রয় মূল্য (৳):</label>
                      <input
                        type="number"
                        value={extractedProduct.price}
                        onChange={(e) =>
                          setExtractedProduct({ ...extractedProduct, price: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">পূর্বের মূল্য (৳):</label>
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

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold text-emerald-900">প্রফিট মার্জিন:</p>
                      <p className="text-[11px] text-emerald-700">
                        আনুমানিক খরচ: ৳{priceBreakdown.landedCostBDT} | বিক্রয় মূল্য: ৳{extractedProduct.price}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-mono font-bold text-xs">
                      +৳{extractedProduct.price - priceBreakdown.landedCostBDT} লাভ
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <a
                  href={extractedProduct.dropship?.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>উৎস পেজ দেখুন</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePublishSingle('draft')}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
                  >
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePublishSingle('active')}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
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

      {/* VIEW 2: BATCH URLS */}
      {activeTab === 'batch' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-rose-600" />
              <span>একাধিক প্রোডাক্ট লিঙ্ক পেস্ট করুন (প্রতি লাইনে একটি করে):</span>
            </label>

            <textarea
              rows={6}
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder={`https://www.aliexpress.com/item/1005005829103948.html\nhttps://detail.1688.com/offer/684920194821.html\nhttps://cjdropshipping.com/product/anti-gravity-water-drop-air-humidifier-p-162948102948.html`}
              className="w-full px-3.5 py-2.5 text-xs font-mono border border-gray-300 rounded-xl outline-none focus:border-rose-600"
            />

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setBatchInput([
                    'https://www.aliexpress.com/item/1005005829103948.html',
                    'https://detail.1688.com/offer/684920194821.html',
                    'https://www.alibaba.com/product-detail/GaN-100W-Fast-Charge-Powerbank_160089201948.html',
                    'https://cjdropshipping.com/product/anti-gravity-water-drop-air-humidifier-p-162948102948.html',
                    'https://item.taobao.com/item.htm?id=729481029481'
                  ].join('\n'));
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                + ৫টি ডেমো লিঙ্ক পূরণ করুন
              </button>

              <button
                type="button"
                onClick={handleBatchImportRun}
                disabled={isBatchRunning || !batchInput.trim()}
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

          {batchImportedList.length > 0 && (
            <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900">
                  ইমপোর্টকৃত প্রোডাক্ট ({batchImportedList.length} টি)
                </h4>
                <button
                  type="button"
                  onClick={handlePublishBatch}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>সবগুলো স্টোরে যোগ করুন (Confirm & Publish)</span>
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {batchImportedList.map((p, idx) => (
                  <div key={idx} className="py-2 flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-500 font-mono">
                        {p.dropship?.platform.toUpperCase()} • ৳{p.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Ready
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: WINNING CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="ক্যাটালগে সার্চ করুন..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-gray-900"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCatalog.map((item) => {
              const pid = (item.dropship?.platform as DropshipPlatform) || 'aliexpress';
              const platformConfig = DROPSHIP_PLATFORMS[pid];
              const calc = calculateDropshipPricing(
                item.dropship!.sourcePrice,
                item.dropship!.sourceCurrency,
                pricingRule
              );

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-xs flex flex-col justify-between space-y-3 hover:border-gray-300 transition-all"
                >
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded ${platformConfig.badgeBg}`}>
                        {platformConfig.name}
                      </span>
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

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 text-[10.5px]">
                    <span className="text-gray-500 truncate">
                      {item.dropship?.shippingDays}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleImportCuratedItem(item)}
                      className="px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
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

      {/* VIEW 4: PRICING RULES */}
      {activeTab === 'pricing' && (
        <div className="max-w-2xl bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-rose-600" />
              <span>কারেন্সি এক্সচেঞ্জ ও প্রাইসিং রুলস কনফিগারেশন</span>
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              উৎস সাইটের মূল্য থেকে বিক্রয় মূল্য ও প্রফিট মার্জিন হিসেব করার সূত্র।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1 text-xs">
              <label className="font-bold text-gray-700 block">USD রেট ($1 = ৳):</label>
              <input
                type="number"
                value={pricingRule.usdRate}
                onChange={(e) => setPricingRule({ ...pricingRule, usdRate: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-mono font-bold bg-white"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1 text-xs">
              <label className="font-bold text-gray-700 block">CNY / RMB রেট (¥1 = ৳):</label>
              <input
                type="number"
                step="0.1"
                value={pricingRule.cnyRate}
                onChange={(e) => setPricingRule({ ...pricingRule, cnyRate: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-mono font-bold bg-white"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1 text-xs">
              <label className="font-bold text-gray-700 block">মার্কআপ মাল্টিপ্লায়ার:</label>
              <input
                type="number"
                step="0.1"
                value={pricingRule.markupMultiplier}
                onChange={(e) => setPricingRule({ ...pricingRule, markupMultiplier: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-mono font-bold bg-white"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1 text-xs">
              <label className="font-bold text-gray-700 block">ফিক্সড হ্যান্ডলিং ফি (৳):</label>
              <input
                type="number"
                value={pricingRule.fixedMarkupBDT}
                onChange={(e) => setPricingRule({ ...pricingRule, fixedMarkupBDT: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-mono font-bold bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                saveStoredPricingRule(pricingRule);
                showToast('প্রাইসিং রুলস সংরক্ষিত হয়েছে!');
              }}
              className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>রুলস সেভ করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 5: IMPORTED HISTORY */}
      {activeTab === 'imported_history' && (
        <div className="space-y-4">
          {existingDropshipProducts.length === 0 ? (
            <div className="bg-white p-10 rounded-xl border border-gray-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">এখনও কোনো ড্রপশিপিং পণ্য স্টোরে যুক্ত করা হয়নি</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                URL ডাইরেক্ট ইম্পোর্ট বা টপ উইনিং ক্যাটালগ ট্যাব থেকে পণ্য পছন্দ করে স্টোরে যুক্ত করুন।
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>ক্যাটালগ ব্রাউজ করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900">
                  স্টোরে ড্রপশিপ প্রোডাক্ট তালিকা ({existingDropshipProducts.length} টি)
                </h4>
              </div>

              <div className="divide-y divide-gray-100">
                {existingDropshipProducts.map((p) => {
                  const pid = (p.dropship?.platform as DropshipPlatform) || 'aliexpress';
                  const pConfig = DROPSHIP_PLATFORMS[pid];
                  return (
                    <div key={p.id} className="p-3.5 flex items-center gap-3 hover:bg-gray-50/60">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${pConfig?.badgeBg || 'bg-gray-100'}`}>
                            {pConfig?.name || p.dropship?.platform}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">SKU: {p.sku}</span>
                        </div>
                        <h5 className="text-xs font-bold text-gray-900 truncate mt-0.5">{p.name}</h5>
                        <p className="text-[11px] text-gray-500">
                          বিক্রয়: <strong className="font-mono text-emerald-700">৳{p.price.toLocaleString()}</strong> |
                          মূল খরচ: <span className="font-mono">{p.dropship?.sourceCurrency} {p.dropship?.sourcePrice}</span> |
                          শিপিং: {p.dropship?.shippingDays}
                        </p>
                      </div>

                      {p.dropship?.sourceUrl && (
                        <a
                          href={p.dropship.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-1 shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>উৎস লিঙ্ক</span>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
