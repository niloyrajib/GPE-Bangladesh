import React, { useState, useRef } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  UploadCloud,
  Check,
  AlertCircle,
  FileText,
  HelpCircle,
  ArrowRight,
  Eye,
  Trash2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Product } from '../../types';
import { generateBarcode, generateGPESku } from '../../utils/productIdentifierHelper';

interface BulkProductImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkImport: (products: Product[], replaceExisting: boolean) => void;
}

export const BulkProductImportModal: React.FC<BulkProductImportModalProps> = ({
  isOpen,
  onClose,
  onBulkImport
}) => {
  if (!isOpen) return null;

  const [activeStep, setActiveStep] = useState<'upload' | 'preview'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [parsedProducts, setParsedProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Record<string, boolean>>({});
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample CSV Data for download template & 1-click load
  const CSV_TEMPLATE_CONTENT = `name,banglaName,category,price,originalPrice,stockCount,brand,sku,shortDescription,warranty,imageUrl,specifications,tags
"Ultra Watch Series 9 AMOLED","আল্ট্রা ওয়াচ সিরিজ ৯ অ্যামোলেড","Smart Watches",2100,3200,45,"Haylou","GPE-WAT-901","2.04 inch AMOLED with Bluetooth calling","১ বছরের অফিশিয়াল ওয়ারেন্টি","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800","Display:2.04 inch AMOLED|Battery:450mAh|Waterproof:IP68|Calling:Bluetooth 5.3","smartwatch|amoled|calling"
"Anker Soundcore R50i TWS","অ্যাঙ্কার সাউন্ডকোর আর৫০আই ইয়ারবাডস","Earbuds & Audio",1750,2400,60,"Anker","GPE-EAR-102","Deep Bass 10mm driver with 30hr playtime","১৮ মাসের অফিসিয়াল ওয়ারেন্টি","https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800","Driver:10mm Bass|Playtime:30 Hours|Fast Charging:10 min for 2hr|ENC:Dual Mic","earbuds|anker|tws"
"Baseus 22.5W 20000mAh Power Bank","বেসাস ২০০০০ এমএএইচ পাওয়ার ব্যাংক","Power & Charging",2350,3100,35,"Baseus","GPE-POW-203","Dual USB + Type-C 22.5W Fast Charging","১ বছরের রিপ্লেসমেন্ট ওয়ারেন্টি","https://images.unsplash.com/photo-1609592424368-23f261905ea5?w=800","Capacity:20000mAh|Output:22.5W / PD 20W|Ports:3x Output|Battery:Li-Polymer","powerbank|fastcharge|baseus"
"RGB Mechanical Gaming Keyboard","আরজিবি মেকানিক্যাল গেমিং কীবোর্ড","Computer & Gaming",1950,2800,25,"Redragon","GPE-GAM-404","Blue switch tactile with customizable RGB lighting","১ বছরের ওয়ারেন্টি","https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800","Switches:Outemu Blue|Keycaps:Double Shot ABS|Backlight:18 RGB Modes|Cable:Type-C Braided","keyboard|gaming|rgb"
"Rechargeable Portable Mini Blender","রিচার্জেবল পোর্টেবল মিনি ব্লেন্ডার","Home & Kitchen",1250,1850,50,"Juicer Pro","GPE-HOM-505","6-blade stainless steel personal smoothie maker","৬ মাসের ওয়ারেন্টি","https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800","Capacity:400ml|Battery:2000mAh USB|Blade:6 Leaf 304 Steel|Power:40W","kitchen|blender|portable"`;

  // Download Sample CSV
  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'gpe_bangladesh_products_bulk_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Robust CSV Line Parser that respects quotes
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  // Process raw CSV string into Product objects
  const processCSVText = (text: string, sourceName = 'uploaded.csv') => {
    setParseError(null);
    try {
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length < 2) {
        setParseError('CSV ফাইলে কোনো তথ্য পাওয়া যায়নি অথবা হেডার অনুপস্থিত!');
        return;
      }

      // Parse header row
      const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

      // Map columns
      const getIndex = (keys: string[]) => {
        return headers.findIndex((h) => keys.some((k) => h.includes(k)));
      };

      const nameIdx = getIndex(['name', 'title', 'product']);
      const banglaIdx = getIndex(['bangla', 'bn', 'banglaname']);
      const catIdx = getIndex(['category', 'cat']);
      const priceIdx = getIndex(['price', 'saleprice']);
      const origPriceIdx = getIndex(['original', 'regular', 'mrp']);
      const stockIdx = getIndex(['stock', 'qty', 'quantity']);
      const brandIdx = getIndex(['brand', 'vendor']);
      const skuIdx = getIndex(['sku', 'code', 'barcode']);
      const descIdx = getIndex(['desc', 'description', 'shortdesc']);
      const warIdx = getIndex(['warranty', 'guarantee']);
      const imgIdx = getIndex(['image', 'img', 'photo', 'url']);
      const specIdx = getIndex(['spec', 'specifications']);
      const tagIdx = getIndex(['tag', 'tags']);

      if (nameIdx === -1) {
        setParseError('CSV ফাইলে "name" বা প্রোডাক্টের নামের কলাম খুঁজে পাওয়া যায়নি!');
        return;
      }

      const products: Product[] = [];
      const idSelection: Record<string, boolean> = {};

      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        if (!row || row.length === 0 || !row[nameIdx]) continue;

        const prodName = row[nameIdx] || `Product ${i}`;
        const pPrice = Number(row[priceIdx]?.replace(/[^0-9.]/g, '')) || 990;
        const pOrigPrice = Number(row[origPriceIdx]?.replace(/[^0-9.]/g, '')) || pPrice * 1.3;
        const discount =
          pOrigPrice > pPrice ? Math.round(((pOrigPrice - pPrice) / pOrigPrice) * 100) : 0;
        const pStock = Number(row[stockIdx]?.replace(/[^0-9]/g, '')) || 20;

        // Parse specifications string: "Display:2.04|Battery:450mAh"
        const specsRecord: Record<string, string> = {};
        if (specIdx !== -1 && row[specIdx]) {
          const pairs = row[specIdx].split('|');
          pairs.forEach((pair) => {
            const [k, v] = pair.split(':');
            if (k && v) {
              specsRecord[k.trim()] = v.trim();
            }
          });
        }
        if (Object.keys(specsRecord).length === 0) {
          specsRecord['Status'] = 'Brand Authentic Official';
        }

        // Parse tags
        let tagList = ['gadget', 'deal'];
        if (tagIdx !== -1 && row[tagIdx]) {
          tagList = row[tagIdx]
            .split(/[|,]/)
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t.length > 0);
        }

        // Image
        const imgUrl =
          (imgIdx !== -1 && row[imgIdx]?.startsWith('http'))
            ? row[imgIdx]
            : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

        const id = `bulk-${Date.now()}-${i}`;
        const newProduct: Product = {
          id,
          name: prodName,
          banglaName: (banglaIdx !== -1 ? row[banglaIdx] : undefined) || prodName,
          slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category: (catIdx !== -1 ? row[catIdx] : '') || 'Smart Watches',
          price: pPrice,
          originalPrice: pOrigPrice,
          discountPercent: discount,
          rating: 4.8 + (i % 3) * 0.1,
          reviewCount: 12 + (i % 10) * 3,
          images: [imgUrl],
          inStock: pStock > 0,
          stockCount: pStock,
          soldCount: 15 + i * 2,
          isFlashDeal: i % 2 === 0,
          isFeatured: true,
          brand: (brandIdx !== -1 ? row[brandIdx] : '') || 'GPE Bangladesh Verified',
          sku: (skuIdx !== -1 ? row[skuIdx] : '') || generateGPESku(catIdx !== -1 ? row[catIdx] : '', prodName),
          barcode: generateBarcode(),
          shortDescription:
            (descIdx !== -1 ? row[descIdx] : '') || '১০০% অরিজিনাল অথেনটিক কোয়ালিটি পণ্য।',
          description:
            (descIdx !== -1 ? row[descIdx] : '') ||
            'GPE Bangladesh থেকে দ্রুত এক্সপ্রেস ডেলিভারিতে অর্ডার করুন এবং পণ্য হাতে পেয়ে চেক করে পেমেন্ট করুন।',
          banglaDescription: (banglaIdx !== -1 ? row[banglaIdx] : '') || prodName,
          features: [
            '১০০% ক্যাশ অন ডেলিভারি সুবিধা',
            'অফিসিয়াল অথেনটিক গ্যারান্টি',
            '২৪-৪৮ ঘণ্টার মধ্যে ফাস্ট ডেলিভারি'
          ],
          specifications: specsRecord,
          warranty: (warIdx !== -1 ? row[warIdx] : '') || '৭ দিনের সহজ রিপ্লেসমেন্ট গ্যারান্টি',
          tags: tagList
        };

        products.push(newProduct);
        idSelection[id] = true;
      }

      if (products.length === 0) {
        setParseError('CSV ফাইল থেকে কোনো বৈধ প্রোডাক্ট পাওয়া যায়নি!');
        return;
      }

      setFileName(sourceName);
      setParsedProducts(products);
      setSelectedProductIds(idSelection);
      setActiveStep('preview');
    } catch (err: any) {
      console.error(err);
      setParseError('CSV ফাইল প্রসেস করার সময় সমস্যা হয়েছে: ' + (err?.message || 'Invalid format'));
    }
  };

  // Handle uploaded file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setParseError('অনুগ্রহ করে একটি .csv ফাইল নির্বাচন করুন!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        processCSVText(text, file.name);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Quick Demo Load
  const handleLoadDemoCSV = () => {
    processCSVText(CSV_TEMPLATE_CONTENT, 'demo_template.csv');
  };

  // Toggle selection
  const toggleSelectAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    parsedProducts.forEach((p) => {
      next[p.id] = checked;
    });
    setSelectedProductIds(next);
  };

  const toggleSelectOne = (id: string) => {
    setSelectedProductIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Finalize import
  const handleFinalizeImport = () => {
    const itemsToImport = parsedProducts.filter((p) => selectedProductIds[p.id]);
    if (itemsToImport.length === 0) {
      alert('অনুগ্রহ করে কমপক্ষে একটি প্রোডাক্ট নির্বাচন করুন!');
      return;
    }

    onBulkImport(itemsToImport, replaceExisting);
    onClose();
  };

  const selectedCount = Object.values(selectedProductIds).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-t-2xl flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  বাল্ক প্রোডাক্ট CSV ইমপোর্ট (Bulk Product Import)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CSV v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                একসাথে একাধিক প্রোডাক্ট এক্সেল বা CSV ফাইল থেকে স্টোরে সরাসরি যুক্ত করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: UPLOAD & TEMPLATE DOWNLOAD */}
        {activeStep === 'upload' && (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Template Download Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>রেডিমেড CSV টেমপ্লেট ডাউনলোড করুন</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-xl">
                  প্রোডাক্টের নাম, দাম, স্টক, স্পেসিফিকেশন ও ছবি সহ স্ট্যান্ডার্ড কলাম বিশিষ্ট নমুনা CSV ফাইল ডাউনলোড করে পূরণ করুন।
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>টেমপ্লেট ডাউনলোড (.CSV)</span>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {parseError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const text = event.target?.result as string;
                    if (text) processCSVText(text, file.name);
                  };
                  reader.readAsText(file, 'UTF-8');
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-emerald-500 bg-emerald-50/40 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center mx-auto mb-3 text-emerald-600">
                <UploadCloud className="w-7 h-7" />
              </div>

              <h4 className="text-sm font-bold text-slate-800">
                এখানে ক্লিক করে আপনার CSV ফাইল নির্বাচন করুন অথবা ড্রপ করুন
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto">
                কমা সেপারেটেড (.csv) ফরম্যাট সমর্থিত • এক্সেল বা গুগল শিটস থেকে সরাসরি Export as CSV করে আপলোড করতে পারেন
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-colors">
                  ফাইল ব্রাউজ করুন (Select File)
                </span>

                <span className="text-xs text-slate-400">বা</span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadDemoCSV();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ডেমো ডাটা লোড করুন</span>
                </button>
              </div>
            </div>

            {/* Column Guide Reference */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>CSV কলাম ফরম্যাট নির্দেশনা:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <strong className="text-slate-900 block">name*</strong>
                  <span className="text-slate-500">প্রোডাক্টের নাম</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <strong className="text-slate-900 block">price*</strong>
                  <span className="text-slate-500">বিক্রয় মূল্য (৳)</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <strong className="text-slate-900 block">category</strong>
                  <span className="text-slate-500">ক্যাটাগরি নাম</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <strong className="text-slate-900 block">stockCount</strong>
                  <span className="text-slate-500">ইনভেন্টরি স্টক সংখ্যা</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <strong className="text-slate-900 block">brand</strong>
                  <span className="text-slate-500">ব্র্যান্ডের নাম</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <strong className="text-slate-900 block">warranty</strong>
                  <span className="text-slate-500">ওয়ারেন্টি সময়কাল</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <strong className="text-slate-900 block">imageUrl</strong>
                  <span className="text-slate-500">ছবির সরাসরি ওয়েব লিংক</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <strong className="text-slate-900 block">specifications</strong>
                  <span className="text-slate-500">Key:Val|Key2:Val2</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW & CONFIRM IMPORT */}
        {activeStep === 'preview' && (
          <div className="p-4 sm:p-6 space-y-5 flex-1 flex flex-col">
            {/* Status overview bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{fileName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {parsedProducts.length} টি প্রোডাক্ট প্রস্তুত
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    নির্বাচিত: {selectedCount} টি প্রোডাক্ট ইমপোর্ট করা হবে
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStep('upload')}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>অন্য ফাইল আপলোড</span>
                </button>
              </div>
            </div>

            {/* Options Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 select-none">
                  <input
                    type="checkbox"
                    checked={selectedCount === parsedProducts.length && parsedProducts.length > 0}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>সবগুলো সিলেক্ট করুন ({parsedProducts.length})</span>
                </label>
              </div>

              {/* Replace vs Append switch */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setReplaceExisting(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    !replaceExisting ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  ক্যাটালগে যুক্ত করুন (Append)
                </button>
                <button
                  type="button"
                  onClick={() => setReplaceExisting(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    replaceExisting ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  বিদ্যমান মুছে রিপ্লেস করুন (Replace)
                </button>
              </div>
            </div>

            {/* Parsed Products Table */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-80 shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 text-[10.5px] uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-3 w-10 text-center">সিলেক্ট</th>
                    <th className="p-3">প্রোডাক্ট তথ্য ও ছবি</th>
                    <th className="p-3">ক্যাটাগরি ও ব্র্যান্ড</th>
                    <th className="p-3">মূল্য (৳)</th>
                    <th className="p-3">ইনভেন্টরি স্টক</th>
                    <th className="p-3">ওয়ারেন্টি ও স্পেকস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium bg-white">
                  {parsedProducts.map((p) => {
                    const isChecked = Boolean(selectedProductIds[p.id]);
                    const specsKeys = Object.keys(p.specifications || {});
                    return (
                      <tr
                        key={p.id}
                        onClick={() => toggleSelectOne(p.id)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          isChecked ? 'bg-emerald-50/20' : 'opacity-60 bg-slate-50/40'
                        }`}
                      >
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectOne(p.id)}
                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                          />
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.images[0]}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate max-w-xs">{p.name}</p>
                              {p.banglaName && (
                                <p className="text-[10.5px] text-slate-500 truncate">{p.banglaName}</p>
                              )}
                              <span className="text-[9.5px] font-mono text-slate-400">SKU: {p.sku}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 block w-fit">
                            {p.category}
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">{p.brand}</span>
                        </td>

                        <td className="p-3 font-mono">
                          <span className="font-bold text-rose-600 block">৳{p.price.toLocaleString()}</span>
                          {p.originalPrice > p.price && (
                            <span className="text-[10px] text-slate-400 line-through block">
                              ৳{p.originalPrice.toLocaleString()} (-{p.discountPercent}%)
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <span className="font-bold text-slate-800 block">{p.stockCount} পিস</span>
                          <span className="text-[10px] text-emerald-600 font-semibold">সক্রিয়</span>
                        </td>

                        <td className="p-3 text-[11px] text-slate-600 max-w-xs">
                          <p className="font-medium truncate">{p.warranty}</p>
                          <span className="text-[10px] text-slate-400 truncate block">
                            স্পেকস: {specsKeys.slice(0, 2).join(', ')}...
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveStep('upload')}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
              >
                ← পূর্ববর্তী ধাপে যান
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  বাতিল
                </button>

                <button
                  type="button"
                  onClick={handleFinalizeImport}
                  disabled={selectedCount === 0}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {selectedCount} টি প্রোডাক্ট ইমপোর্ট সম্পন্ন করুন
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
