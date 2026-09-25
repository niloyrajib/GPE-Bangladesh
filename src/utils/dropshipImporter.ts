import { Product, DropshipPlatform, DropshipSourceInfo } from '../types';

export interface PlatformConfig {
  id: DropshipPlatform;
  name: string;
  tagline: string;
  domain: string;
  currency: 'USD' | 'CNY';
  currencySymbol: string;
  defaultExchangeRate: number;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  defaultShippingDays: string;
  placeholderUrl: string;
  sampleUrls: { label: string; url: string }[];
}

export const DROPSHIP_PLATFORMS: Record<DropshipPlatform, PlatformConfig> = {
  aliexpress: {
    id: 'aliexpress',
    name: 'AliExpress',
    tagline: 'Global Retail & Trending Dropship',
    domain: 'aliexpress.com',
    currency: 'USD',
    currencySymbol: '$',
    defaultExchangeRate: 122,
    badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
    badgeText: 'AliExpress',
    accentColor: '#e62e04',
    defaultShippingDays: '10-18 Days Express Air',
    placeholderUrl: 'https://www.aliexpress.com/item/10050064291823.html',
    sampleUrls: [
      {
        label: 'Lenovo LP40 Pro Wireless TWS',
        url: 'https://www.aliexpress.com/item/1005005829103948.html'
      },
      {
        label: 'ZD8 Ultra Max Smart Watch 49mm',
        url: 'https://www.aliexpress.com/item/1005004921092817.html'
      },
      {
        label: 'Baseus 65W GaN5 Desktop Fast Charger',
        url: 'https://www.aliexpress.com/item/1005005291029411.html'
      }
    ]
  },
  '1688': {
    id: '1688',
    name: '1688.com',
    tagline: 'Direct China Wholesale Factory Prices',
    domain: '1688.com',
    currency: 'CNY',
    currencySymbol: '¥',
    defaultExchangeRate: 17.5,
    badgeBg: 'bg-orange-50 border-orange-200 text-orange-700',
    badgeText: '1688 Factory',
    accentColor: '#ff6000',
    defaultShippingDays: '12-20 Days China to BD Cargo',
    placeholderUrl: 'https://detail.1688.com/offer/749201948291.html',
    sampleUrls: [
      {
        label: 'Mini Bluetooth Pocket Photo Printer',
        url: 'https://detail.1688.com/offer/684920194821.html'
      },
      {
        label: '6-Blade Portable USB Smoothie Juicer',
        url: 'https://detail.1688.com/offer/712948102934.html'
      },
      {
        label: 'Electric 24-in-1 Precision Screwdriver',
        url: 'https://detail.1688.com/offer/694820194820.html'
      }
    ]
  },
  alibaba: {
    id: 'alibaba',
    name: 'Alibaba.com',
    tagline: 'Verified B2B Global Manufacturers',
    domain: 'alibaba.com',
    currency: 'USD',
    currencySymbol: '$',
    defaultExchangeRate: 122,
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
    badgeText: 'Alibaba Verified',
    accentColor: '#ff6a00',
    defaultShippingDays: '14-25 Days Air Freight Cargo',
    placeholderUrl: 'https://www.alibaba.com/product-detail/GaN-100W-Super-Fast-Power-Bank_160089201948.html',
    sampleUrls: [
      {
        label: 'GaN 100W PD 20000mAh Power Bank',
        url: 'https://www.alibaba.com/product-detail/GaN-100W-Fast-Charge-Powerbank_160089201948.html'
      },
      {
        label: 'RGB Hot-Swap Mechanical Keyboard',
        url: 'https://www.alibaba.com/product-detail/RGB-Mechanical-Keyboard-Hot-Swap_160098210492.html'
      },
      {
        label: 'IPX7 Waterproof Bone Conduction Headset',
        url: 'https://www.alibaba.com/product-detail/Bone-Conduction-Sports-Headset_160074920194.html'
      }
    ]
  },
  cjdropshipping: {
    id: 'cjdropshipping',
    name: 'CJ Dropshipping',
    tagline: 'Fast Shipping & White Label Fulfillment',
    domain: 'cjdropshipping.com',
    currency: 'USD',
    currencySymbol: '$',
    defaultExchangeRate: 122,
    badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
    badgeText: 'CJ Dropship',
    accentColor: '#0089ff',
    defaultShippingDays: '7-14 Days CJ Packet VIP Express',
    placeholderUrl: 'https://cjdropshipping.com/product/anti-gravity-air-humidifier-p-162948102948.html',
    sampleUrls: [
      {
        label: 'Anti-Gravity Water Drop Humidifier',
        url: 'https://cjdropshipping.com/product/anti-gravity-water-drop-air-humidifier-p-162948102948.html'
      },
      {
        label: 'MagSafe Wireless 10000mAh Power Bank',
        url: 'https://cjdropshipping.com/product/magsafe-magnetic-wireless-powerbank-p-174820194821.html'
      },
      {
        label: 'Heated Neck & Shoulder Shiatsu Massager',
        url: 'https://cjdropshipping.com/product/electric-heated-shiatsu-neck-massager-p-158291048291.html'
      }
    ]
  },
  taobao: {
    id: 'taobao',
    name: 'Taobao / Tmall',
    tagline: 'Trendy Lifestyle, Tech & Aesthetic Goods',
    domain: 'taobao.com',
    currency: 'CNY',
    currencySymbol: '¥',
    defaultExchangeRate: 17.5,
    badgeBg: 'bg-red-50 border-red-200 text-red-700',
    badgeText: 'Taobao Trend',
    accentColor: '#ff5000',
    defaultShippingDays: '10-18 Days Air Freight',
    placeholderUrl: 'https://item.taobao.com/item.htm?id=729481029481',
    sampleUrls: [
      {
        label: 'Folding Aluminum Ergonomic Laptop Stand',
        url: 'https://item.taobao.com/item.htm?id=729481029481'
      },
      {
        label: 'Magnetic Wood Smart Motion Wall Lamp',
        url: 'https://item.taobao.com/item.htm?id=694820194829'
      },
      {
        label: 'Turbo High-Speed Portable Jet Fan 100k RPM',
        url: 'https://item.taobao.com/item.htm?id=712948102948'
      }
    ]
  }
};

export interface DropshipPricingRule {
  usdRate: number; // e.g. 122 BDT
  cnyRate: number; // e.g. 17.5 BDT
  markupMultiplier: number; // e.g. 2.0x (100% markup)
  fixedMarkupBDT: number; // e.g. 0
  shippingAllowanceBDT: number; // e.g. 150
  roundPriceTo: number; // e.g. 50 (e.g. 1750, 1800) or 90
  compareAtMultiplier: number; // e.g. 1.35 (+35% strikethrough price)
}

export const DEFAULT_PRICING_RULE: DropshipPricingRule = {
  usdRate: 122,
  cnyRate: 17.5,
  markupMultiplier: 2.1,
  fixedMarkupBDT: 150,
  shippingAllowanceBDT: 100,
  roundPriceTo: 50,
  compareAtMultiplier: 1.4
};

const PRICING_STORAGE_KEY = 'banglaxpress_dropship_pricing_rule';

export function getStoredPricingRule(): DropshipPricingRule {
  try {
    const raw = localStorage.getItem(PRICING_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_PRICING_RULE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load dropship pricing rule', e);
  }
  return DEFAULT_PRICING_RULE;
}

export function saveStoredPricingRule(rule: DropshipPricingRule): void {
  try {
    localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(rule));
  } catch (e) {
    console.error('Failed to save dropship pricing rule', e);
  }
}

export function detectPlatformFromUrl(url: string): DropshipPlatform | null {
  const clean = url.toLowerCase().trim();
  if (clean.includes('aliexpress.com') || clean.includes('aliexpress.ru')) return 'aliexpress';
  if (clean.includes('1688.com')) return '1688';
  if (clean.includes('alibaba.com')) return 'alibaba';
  if (clean.includes('cjdropshipping.com') || clean.includes('cjdropship.com')) return 'cjdropshipping';
  if (clean.includes('taobao.com') || clean.includes('tmall.com')) return 'taobao';
  return null;
}

// Calculate target selling price and compare-at price in BDT
export function calculateDropshipPricing(
  sourcePrice: number,
  currency: 'USD' | 'CNY',
  rule: DropshipPricingRule = DEFAULT_PRICING_RULE
) {
  const rate = currency === 'USD' ? rule.usdRate : rule.cnyRate;
  const landedCostBDT = Math.round(sourcePrice * rate + rule.shippingAllowanceBDT);
  const rawPrice = landedCostBDT * rule.markupMultiplier + rule.fixedMarkupBDT;
  
  // Round to friendly price (e.g. nearest 50 or 90)
  let sellingPrice = Math.round(rawPrice);
  if (rule.roundPriceTo === 50) {
    sellingPrice = Math.round(rawPrice / 50) * 50;
  } else if (rule.roundPriceTo === 90) {
    sellingPrice = Math.floor(rawPrice / 100) * 100 + 90;
  } else if (rule.roundPriceTo === 10) {
    sellingPrice = Math.round(rawPrice / 10) * 10;
  }

  // Minimum safety floor
  if (sellingPrice < landedCostBDT) {
    sellingPrice = landedCostBDT + 300;
  }

  const compareAtPrice = Math.round((sellingPrice * rule.compareAtMultiplier) / 50) * 50;
  const estimatedProfitBDT = sellingPrice - landedCostBDT;
  const profitMarginPercent = Math.round((estimatedProfitBDT / sellingPrice) * 100);

  return {
    exchangeRate: rate,
    landedCostBDT,
    sellingPrice,
    compareAtPrice,
    estimatedProfitBDT,
    profitMarginPercent
  };
}

// Curated winning & trending dropshipping catalog
export const CURATED_DROPSHIP_CATALOG: Product[] = [
  // 1. AliExpress Winners
  {
    id: 'ds-ali-01',
    name: 'Lenovo LP40 Pro Wireless TWS Bluetooth 5.1 Earbuds',
    banglaName: 'লেনোভো এলপি৪০ প্রো ট্রু ওয়্যারলেস ইয়ারবাডস',
    slug: 'lenovo-lp40-pro-tws-earbuds',
    category: 'Earbuds & Audio',
    price: 1350,
    originalPrice: 1950,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 342,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
    ],
    inStock: true,
    stockCount: 80,
    soldCount: 1240,
    brand: 'Lenovo',
    sku: 'ALI-LP40P-BLK',
    shortDescription: '13mm dynamic driver, low latency gaming mode, 250mAh charging case, IPX5 sweatproof.',
    description: 'The Lenovo LP40 Pro features upgraded Bluetooth 5.1 with ENC noise reduction for crystal clear calls and rich acoustic stereo bass. Ultra lightweight with ergonomic half in-ear fit.',
    banglaDescription: 'লেনোভো এলপি৪০ প্রো ইয়ারবাডসে রয়েছে আপগ্রেডেড ব্লুটুথ ৫.১, ১৩মিমি ডাইনামিক ড্রাইভার, ডিপ বাস এবং ইএনসি কলিং সুবিধা। ২৫০ এমএএইচ ব্যাটারিতে টানা ৫ ঘণ্টার প্লেটাইম।',
    features: [
      '13mm Large Dynamic Bass Driver',
      'Bluetooth 5.1 Ultra Low Latency',
      'Dual HD ENC Microphones for Clear Calls',
      'Type-C Fast Charging in 1.5 Hours',
      'IPX5 Sweat & Water Resistant'
    ],
    specifications: {
      'Bluetooth Version': 'v5.1',
      'Driver Size': '13mm Graphene Diaphragm',
      'Battery Life': 'Up to 24 Hours with Case',
      'Charging Port': 'Type-C',
      'Waterproof Rating': 'IPX5'
    },
    warranty: '৬ মাসের রিপ্লেসমেন্ট ওয়ারেন্টি',
    tags: ['earbuds', 'lenovo', 'aliexpress', 'tws', 'dropship'],
    vendor: 'AliExpress Direct',
    status: 'active',
    dropship: {
      platform: 'aliexpress',
      sourceUrl: 'https://www.aliexpress.com/item/1005005829103948.html',
      sourceId: '1005005829103948',
      supplierName: 'Lenovo Official Global Store',
      sourceCurrency: 'USD',
      sourcePrice: 4.85,
      shippingDays: '10-15 Days Express',
      supplierRating: '4.9/5 (98% Positive)',
      ordersCount: '45,000+ sold',
      importedAt: new Date().toISOString()
    }
  },
  {
    id: 'ds-ali-02',
    name: 'ZD8 Ultra Max 49mm Titanium Smart Watch with AMOLED Display',
    banglaName: 'জেডডি৮ আল্ট্রা ম্যাক্স ৪৯মিমি টাইটেনিয়াম স্মার্ট ওয়াচ',
    slug: 'zd8-ultra-max-smartwatch-titanium',
    category: 'Smart Watches',
    price: 2450,
    originalPrice: 3800,
    discountPercent: 35,
    rating: 4.9,
    reviewCount: 188,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'
    ],
    inStock: true,
    stockCount: 45,
    soldCount: 890,
    brand: 'ZD Ultra',
    sku: 'ALI-ZD8-ULT',
    shortDescription: '2.08 inch bezel-less HD screen, titanium alloy case, Bluetooth calling, real screws and strap lock.',
    description: 'Premium rugged smartwatch featuring real screws, titanium body, IP68 water resistance, heart rate & SpO2 tracking, multiple sports modes, and wireless charging.',
    banglaDescription: '২.০৮ ইঞ্চি ফুল এইচডি ডিসপ্লে, টাইটেনিয়াম মেটাল বডি, রিয়েল স্ক্রু এবং স্ট্র্যাপ লক ডিজাইন। ব্লুটুথ কলিং, হার্ট রেট ও ব্লাড অক্সিজেন মনিটরিং এবং ওয়্যারলেস চার্জিং সাপোর্টেড।',
    features: [
      '2.08 inch Bezel-less HD Display',
      'Full Titanium Alloy Rugged Case',
      'Bluetooth 5.2 Calling with Speaker & Mic',
      'NFC Access & AI Voice Assistant',
      'Magnetic Wireless Fast Charging'
    ],
    specifications: {
      'Screen Size': '2.08 inch (420x485)',
      'Case Material': 'Titanium Alloy',
      'Battery': '380mAh (4-7 Days standby)',
      'Waterproof': 'IP68 Certified',
      'App': 'ZORDAI'
    },
    warranty: '১ বছরের সার্ভিস ওয়ারেন্টি',
    tags: ['smartwatch', 'ultra', 'titanium', 'aliexpress', 'dropship'],
    vendor: 'AliExpress Direct',
    status: 'active',
    dropship: {
      platform: 'aliexpress',
      sourceUrl: 'https://www.aliexpress.com/item/1005004921092817.html',
      sourceId: '1005004921092817',
      supplierName: 'ZD Smart Watch Factory Store',
      sourceCurrency: 'USD',
      sourcePrice: 9.90,
      shippingDays: '10-18 Days Air',
      supplierRating: '4.8/5',
      ordersCount: '12,500+ orders',
      importedAt: new Date().toISOString()
    }
  },

  // 2. 1688 Wholesale Factory Winners
  {
    id: 'ds-1688-01',
    name: '1688 Factory Mini Bluetooth Pocket Thermal Photo & Note Printer',
    banglaName: '১৬৮৮ পকেট সাইজ ব্লুটুথ থার্মাল ফটো ও নোট প্রিন্টার',
    slug: '1688-mini-bluetooth-pocket-thermal-printer',
    category: 'Computer & Gaming',
    price: 1650,
    originalPrice: 2400,
    discountPercent: 31,
    rating: 4.7,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'
    ],
    inStock: true,
    stockCount: 60,
    soldCount: 520,
    brand: 'OEM 1688',
    sku: '1688-PRN-TH01',
    shortDescription: 'Zero ink thermal technology, 200 DPI resolution, prints study notes, photos, receipts & labels.',
    description: 'Wholesale factory direct pocket printer. Connects seamlessly via Bluetooth to Android & iOS via app. Built-in 1000mAh rechargeable lithium battery requires zero ink or toner.',
    banglaDescription: 'কোনো কালির ঝামেলা ছাড়া থার্মাল পেপারে ইনস্ট্যান্ট ছবি, হ্যান্ড নোট, বারকোড কিংবা স্লিপ প্রিন্ট করার পোর্টেবল মিনি ব্লুটুথ প্রিন্টার। ১০০০ এমএএইচ রিচার্জেবল ব্যাটারি।',
    features: [
      'Zero Ink Thermal Technology',
      'Instant Bluetooth Wireless Pairing',
      'High Density 200 DPI Japanese Printhead',
      'Built-in 1000mAh USB Rechargeable Battery',
      'Compact & Lightweight Pocket Size'
    ],
    specifications: {
      'Print Method': 'Direct Thermal Printing',
      'Paper Size': '57mm x 30mm Roll',
      'Battery': '1000mAh Lithium Ion',
      'Charging': 'Type-C 5V/1A',
      'Weight': '160 grams'
    },
    warranty: '৬ মাসের রিপ্লেসমেন্ট ওয়ারেন্টি',
    tags: ['printer', '1688', 'pocket-printer', 'thermal', 'wholesale'],
    vendor: '1688 Wholesale China',
    status: 'active',
    dropship: {
      platform: '1688',
      sourceUrl: 'https://detail.1688.com/offer/684920194821.html',
      sourceId: '684920194821',
      supplierName: 'Shenzhen Electronic Printing Tech Factory',
      sourceCurrency: 'CNY',
      sourcePrice: 38.0,
      shippingDays: '12-18 Days Air Cargo',
      supplierRating: '5.0 Stars (Factory Direct Verified)',
      ordersCount: '80,000+ units',
      importedAt: new Date().toISOString()
    }
  },
  {
    id: 'ds-1688-02',
    name: '1688 6-Blade Portable Wireless Smoothie Blender Cup (USB Rechargeable)',
    banglaName: '১৬৮৮ ৬-ব্লেড রিচার্জেবল পোর্টেবল জুসার ও স্মুদি ব্লেন্ডার',
    slug: '1688-portable-smoothie-blender-cup',
    category: 'Home & Kitchen',
    price: 1250,
    originalPrice: 1800,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 220,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800',
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=800'
    ],
    inStock: true,
    stockCount: 75,
    soldCount: 940,
    brand: '1688 Pro Kitchen',
    sku: '1688-BLD-6BLD',
    shortDescription: '380ml food grade PCTG bottle, 6 SUS304 stainless steel blades, 18,000 RPM high speed motor.',
    description: 'Make fresh fruit juices, smoothies, shakes, and baby food anywhere on the go. Powerful 6-leaf stainless steel blade crushes fruit and ice cubes smoothly in 30 seconds.',
    banglaDescription: 'অফিস, জিম কিংবা ট্রাভেলের জন্য পারফেক্ট পোর্টেবল রিচার্জেবল ব্লেন্ডার। ৬টি স্টেইনলেস স্টিল ব্লেডের সাহায্যে মাত্র ৩০ সেকেন্ডে তৈরি করুন ফ্রেশ জুস বা মিল্কশেক।',
    features: [
      '6 Leaf SUS304 Food Grade Stainless Steel Blades',
      '18000 RPM Powerful High Torque Motor',
      '2000mAh Battery makes 15+ Cups per Charge',
      'Magnetic Induction Safety Auto-Shutoff',
      'BPA-Free Eco Friendly PCTG Cup'
    ],
    specifications: {
      'Capacity': '380ml',
      'Motor Speed': '18,000 RPM',
      'Battery': '2000mAh Lithium-ion',
      'Blade Material': '304 Stainless Steel',
      'Bottle Material': 'Food-Grade PCTG'
    },
    warranty: '৬ মাসের রিপ্লেসমেন্ট গ্যারান্টি',
    tags: ['blender', '1688', 'juicer', 'kitchen', 'dropship'],
    vendor: '1688 Wholesale China',
    status: 'active',
    dropship: {
      platform: '1688',
      sourceUrl: 'https://detail.1688.com/offer/712948102934.html',
      sourceId: '712948102934',
      supplierName: 'Zhejiang Home Appliance Co., Ltd',
      sourceCurrency: 'CNY',
      sourcePrice: 24.5,
      shippingDays: '12-20 Days Air Cargo',
      supplierRating: '4.9/5',
      ordersCount: '55,000+ pcs sold',
      importedAt: new Date().toISOString()
    }
  },

  // 3. Alibaba B2B Bulk Direct Winners
  {
    id: 'ds-ali-b2b-01',
    name: 'Alibaba OEM GaN 100W PD 4-Port Super Fast Power Bank 20000mAh',
    banglaName: 'আলিবাবা জিএএন ১০০ ওয়াট পিডি ফোর-পোর্ট পাওয়ার ব্যাংক ২০০০০ এমএএইচ',
    slug: 'alibaba-gan-100w-fast-charge-power-bank-20000mah',
    category: 'Power & Charging',
    price: 3450,
    originalPrice: 4800,
    discountPercent: 28,
    rating: 4.9,
    reviewCount: 310,
    images: [
      'https://images.unsplash.com/photo-1609592424368-23f261905ea5?w=800',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800'
    ],
    inStock: true,
    stockCount: 30,
    soldCount: 420,
    brand: 'Alibaba Verified OEM',
    sku: 'B2B-POW-100W',
    shortDescription: '100W Power Delivery charges laptops (MacBook Pro) and phones at max speed with smart LED display.',
    description: 'High performance GaN technology power bank with dual Type-C and dual USB-A ports. Capable of charging laptops, tablets, and smartphones simultaneously with comprehensive safety protections.',
    banglaDescription: '১০০ ওয়াট আল্ট্রা ফাস্ট চার্জিং সুবিধার পাওয়ার ব্যাংক যা দিয়ে ম্যাকবুক, ল্যাপটপ এবং ৪টি স্মার্টফোন একসাথে দ্রুত চার্জ করা যায়। ডিজিটাল এলইডি ডিসপ্লেতে ব্যাটারি শতাংশ শো করে।',
    features: [
      '100W Ultra High Output Power Delivery',
      'Can Charge Laptops (MacBook Pro/Air, Dell, HP)',
      'Smart Real-Time LED Voltage & Battery Display',
      'GaN Technology for Cooler & Safer Charging',
      'Over-Current, Over-Voltage & Heat Protection'
    ],
    specifications: {
      'Capacity': '20,000mAh / 74Wh',
      'Type-C1 Output': '5V/3A, 9V/3A, 12V/3A, 15V/3A, 20V/5A (100W Max)',
      'Total Output': '100W Max Shared',
      'Input': 'Type-C 65W Fast Recharging',
      'Weight': '395g'
    },
    warranty: '১ বছরের অফিশিয়াল ওয়ারেন্টি',
    tags: ['powerbank', 'alibaba', 'gan', 'fastcharge', 'laptop'],
    vendor: 'Alibaba B2B Direct',
    status: 'active',
    dropship: {
      platform: 'alibaba',
      sourceUrl: 'https://www.alibaba.com/product-detail/GaN-100W-Fast-Charge-Powerbank_160089201948.html',
      sourceId: '160089201948',
      supplierName: 'Dongguan Powertech Intelligent Technology',
      sourceCurrency: 'USD',
      sourcePrice: 15.8,
      shippingDays: '14-22 Days Air Freight',
      supplierRating: '4.9/5 (Verified Supplier Gold)',
      ordersCount: '20,000+ ordered',
      importedAt: new Date().toISOString()
    }
  },

  // 4. CJ Dropshipping Winners
  {
    id: 'ds-cj-01',
    name: 'CJ Anti-Gravity Levitating Water Drops Air Humidifier with Clock',
    banglaName: 'সিজে অ্যান্টি-গ্র্যাভিটি ভাসমান পানির ফোঁটা হিউমিডিফায়ার ও ঘড়ি',
    slug: 'cj-anti-gravity-water-drop-air-humidifier',
    category: 'Home & Kitchen',
    price: 2650,
    originalPrice: 3800,
    discountPercent: 30,
    rating: 4.9,
    reviewCount: 420,
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800'
    ],
    inStock: true,
    stockCount: 40,
    soldCount: 880,
    brand: 'CJ Home Trend',
    sku: 'CJ-HUM-ANTIG',
    shortDescription: 'Optical illusion floating water droplets, 800ml tank, ultrasonic mist, intelligent LED digital clock.',
    description: 'Mesmerizing anti-gravity visual effect creates the illusion of water droplets flowing upwards while moistening dry room air. Perfect aesthetic bedside lamp and desk ornament.',
    banglaDescription: 'অপটিক্যাল ইলুশনের মাধ্যমে পানির ফোঁটা উল্টোদিকে ভেসে ওঠার অদ্ভুত সুন্দর অ্যান্টি-গ্র্যাভিটি হিউমিডিফায়ার। সাথে রয়েছে ডিজিটাল এলইডি ক্লক এবং ৮০০ মিলি পানির ট্যাংক।',
    features: [
      'Anti-Gravity Optical Illusion Effect',
      'Ultrasonic Fine Mist Air Moisturization',
      'LED Digital Time & Ambient Glow Display',
      'Automatic Shut-Off when Water Runs Out',
      'Ultra Quiet Operation (<36dB)'
    ],
    specifications: {
      'Water Tank Capacity': '800ml',
      'Spray Volume': '100-150 ml/h',
      'Power': 'USB Type-C 5V/2A',
      'Dimensions': '120 x 120 x 231 mm',
      'Working Hours': '8 Hours Continuous'
    },
    warranty: '১ বছরের সার্ভিস ওয়ারেন্টি',
    tags: ['humidifier', 'cjdropshipping', 'antigravity', 'aesthetic', 'home'],
    vendor: 'CJ Dropshipping Express',
    status: 'active',
    dropship: {
      platform: 'cjdropshipping',
      sourceUrl: 'https://cjdropshipping.com/product/anti-gravity-water-drop-air-humidifier-p-162948102948.html',
      sourceId: '162948102948',
      supplierName: 'CJ Prime Gadgets Hub',
      sourceCurrency: 'USD',
      sourcePrice: 11.2,
      shippingDays: '7-14 Days CJ Packet VIP Express',
      supplierRating: '4.9/5 (CJ Verified Warehouse)',
      ordersCount: '34,000+ shipped',
      importedAt: new Date().toISOString()
    }
  },
  {
    id: 'ds-cj-02',
    name: 'CJ MagSafe Magnetic Wireless Fast Charging Power Bank 10000mAh with Stand',
    banglaName: 'সিজে ম্যাগসেফ ম্যাগনেটিক ওয়্যারলেস পাওয়ার ব্যাংক ১০০০০ এমএএইচ',
    slug: 'cj-magsafe-magnetic-wireless-power-bank-10000mah',
    category: 'Power & Charging',
    price: 2150,
    originalPrice: 3200,
    discountPercent: 32,
    rating: 4.8,
    reviewCount: 275,
    images: [
      'https://images.unsplash.com/photo-1609592424368-23f261905ea5?w=800',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800'
    ],
    inStock: true,
    stockCount: 50,
    soldCount: 610,
    brand: 'CJ Tech',
    sku: 'CJ-MAG-10K',
    shortDescription: 'Snaps strongly to iPhone 12/13/14/15/16 series, 15W wireless + 20W PD Type-C wire charge with kickstand.',
    description: 'Ultra slim magnetic power bank with integrated folding leather kickstand. Strong N52 neodymium magnets hold your phone securely in portrait or landscape while charging.',
    banglaDescription: 'শক্তিশালী ম্যাগনেটের সাহায্যে আইফোন ও কিউআই সাপোর্টেড ফোনে সহজে আটকে থাকে। ১৫ ওয়াট ওয়্যারলেস ও ২০ ওয়াট ফাস্ট চার্জিং সাথে ফোল্ডিং স্ট্যান্ড সুবিধা।',
    features: [
      'Super Strong N52 Neodymium Magnetic Lock',
      '15W Fast Wireless + 20W PD Wired Output',
      'Foldable Multi-Angle Kickstand Design',
      'Smart LED Battery Indicator Lights',
      'Airline Approved Safe Travel Size'
    ],
    specifications: {
      'Capacity': '10,000mAh / 38.5Wh',
      'Wireless Output': '5W / 7.5W / 10W / 15W Max',
      'Type-C Output': '5V/3A, 9V/2.22A, 12V/1.67A (20W PD)',
      'Magnet Strength': 'N52 Ultra Magnet',
      'Weight': '195g'
    },
    warranty: '১ বছরের রিপ্লেসমেন্ট ওয়ারেন্টি',
    tags: ['magsafe', 'cjdropshipping', 'powerbank', 'wireless', 'iphone'],
    vendor: 'CJ Dropshipping Express',
    status: 'active',
    dropship: {
      platform: 'cjdropshipping',
      sourceUrl: 'https://cjdropshipping.com/product/magsafe-magnetic-wireless-powerbank-p-174820194821.html',
      sourceId: '174820194821',
      supplierName: 'CJ Fast Electronics Hub',
      sourceCurrency: 'USD',
      sourcePrice: 8.95,
      shippingDays: '8-14 Days CJ VIP Air',
      supplierRating: '4.8/5',
      ordersCount: '18,500+ delivered',
      importedAt: new Date().toISOString()
    }
  },

  // 5. Taobao / Tmall Lifestyle Winners
  {
    id: 'ds-tb-01',
    name: 'Taobao Ergonomic Folding Aluminum Alloy Laptop Stand Holder',
    banglaName: 'তাওবাও এরগনোমিক অ্যালুমিনিয়াম অ্যালয় ফোল্ডিং ল্যাপটপ স্ট্যান্ড',
    slug: 'taobao-ergonomic-folding-aluminum-laptop-stand',
    category: 'Computer & Gaming',
    price: 1150,
    originalPrice: 1700,
    discountPercent: 32,
    rating: 4.9,
    reviewCount: 510,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'
    ],
    inStock: true,
    stockCount: 90,
    soldCount: 1450,
    brand: 'Taobao Lifestyle',
    sku: 'TB-STN-ALUM',
    shortDescription: '6-level adjustable height, aircraft-grade aluminum alloy, non-slip silicone pads, foldable with pouch.',
    description: 'Relieve neck and back pain with 6 ergonomic viewing angle adjustments. Hollow bottom design maximizes airflow and heat dissipation to keep laptops cool.',
    banglaDescription: '৬টি লেভেলে হাইট এডজাস্ট করার সুবিধা সম্পন্ন প্রিমিয়াম অ্যালুমিনিয়াম ল্যাপটপ স্ট্যান্ড। ল্যাপটপ ঠান্ডা রাখতে নিখুঁত এয়ারফ্লো ডিজাইন এবং সাথে ক্যারি পাউচ।',
    features: [
      'Heavy Duty Aircraft-Grade Aluminum Alloy',
      '6 Height Levels Adjustable for Posture',
      'Anti-Slip Silicone Protective Pads',
      'Open Hollow Frame for Instant Cooling',
      'Folds Completely Flat for Travel'
    ],
    specifications: {
      'Compatibility': '10 to 17.3 inch Laptops & Tablets',
      'Material': 'Anodized Aluminum Alloy + Silicone',
      'Adjustable Angle': '15 to 45 Degrees',
      'Folded Size': '240 x 45 x 15 mm',
      'Weight': '260g'
    },
    warranty: 'লাইফটাইম মেটাল ডিউরেবিলিটি গ্যারান্টি',
    tags: ['laptop-stand', 'taobao', 'aluminum', 'desk-setup', 'ergonomic'],
    vendor: 'Taobao Direct',
    status: 'active',
    dropship: {
      platform: 'taobao',
      sourceUrl: 'https://item.taobao.com/item.htm?id=729481029481',
      sourceId: '729481029481',
      supplierName: 'Shenzhen Ergonomic Hardware Store',
      sourceCurrency: 'CNY',
      sourcePrice: 22.0,
      shippingDays: '10-18 Days Air Freight',
      supplierRating: '4.9 Gold Crown Supplier',
      ordersCount: '62,000+ sold',
      importedAt: new Date().toISOString()
    }
  },
  {
    id: 'ds-tb-02',
    name: 'Taobao Handheld Turbo High-Speed Mini Jet Fan (100,000 RPM)',
    banglaName: 'তাওবাও হ্যান্ডহেল্ড টার্বো হাই-স্পিড মিনি জেট ফ্যান ও ব্লোয়ার',
    slug: 'taobao-handheld-turbo-high-speed-jet-fan',
    category: 'Home & Kitchen',
    price: 2150,
    originalPrice: 3200,
    discountPercent: 32,
    rating: 4.8,
    reviewCount: 380,
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800'
    ],
    inStock: true,
    stockCount: 40,
    soldCount: 780,
    brand: 'Taobao Tech',
    sku: 'TB-JET-100K',
    shortDescription: '100,000 RPM brushless motor, 45m/s wind speed, cleans dust, inflates mattresses, dries hair.',
    description: 'Pocket-sized storm power with extreme 100,000 RPM brushless motor. Incredible multi-purpose tool for PC dust cleaning, car drying, camping fire blowing, and rapid cooling.',
    banglaDescription: '১ লক্ষ আরপিএম শক্তিশালী ব্রাশলেস মোটরের সুপার ফাস্ট মিনি জেট ফ্যান। কম্পিউটার ডাস্ট ক্লিনিং, গাড়ি শুকানো কিংবা তীব্র গরম থেকে আরাম পেতে এক কথায় অসাধারণ পোর্টেবল গ্যাজেট।',
    features: [
      '100,000 RPM Ultra High-Speed Brushless Motor',
      'Wind Speed Exceeds 45 meters per second',
      'Type-C Fast Charge with 4000mAh Dual Batteries',
      'Stepless Speed Slide Regulator Control',
      'Full CNC Metal Shell for Drop Protection'
    ],
    specifications: {
      'Motor RPM': '100,000 RPM Max',
      'Wind Speed': 'Up to 45 m/s',
      'Battery': '4000mAh Lithium Rechargeable',
      'Charging Port': 'Type-C 10W',
      'Weight': '290g'
    },
    warranty: '১ বছরের সার্ভিস ওয়ারেন্টি',
    tags: ['jetfan', 'taobao', 'turbo', 'gadget', 'cleaner'],
    vendor: 'Taobao Direct',
    status: 'active',
    dropship: {
      platform: 'taobao',
      sourceUrl: 'https://item.taobao.com/item.htm?id=712948102948',
      sourceId: '712948102948',
      supplierName: 'Hangzhou Smart Aero Tech Store',
      sourceCurrency: 'CNY',
      sourcePrice: 48.0,
      shippingDays: '10-18 Days Air Freight',
      supplierRating: '4.9/5',
      ordersCount: '29,000+ orders',
      importedAt: new Date().toISOString()
    }
  }
];

// Smart Mock Scraper / Direct Parser for Any URL from the 5 Platforms
export function parseDropshipUrl(
  inputUrl: string,
  platformOverride?: DropshipPlatform,
  pricingRule: DropshipPricingRule = DEFAULT_PRICING_RULE
): {
  product: Product;
  detectedPlatform: DropshipPlatform;
  sourcePriceFormatted: string;
  profitCalculation: ReturnType<typeof calculateDropshipPricing>;
} {
  const cleanUrl = inputUrl.trim();
  const detected = platformOverride || detectPlatformFromUrl(cleanUrl) || 'aliexpress';
  const platformConfig = DROPSHIP_PLATFORMS[detected];

  // 1. Check if matches any existing curated catalog item
  const foundCurated = CURATED_DROPSHIP_CATALOG.find((item) => {
    if (item.dropship?.sourceUrl && cleanUrl.includes(item.dropship.sourceUrl)) return true;
    if (item.dropship?.sourceId && cleanUrl.includes(item.dropship.sourceId)) return true;
    return false;
  });

  if (foundCurated) {
    const calc = calculateDropshipPricing(
      foundCurated.dropship!.sourcePrice,
      foundCurated.dropship!.sourceCurrency,
      pricingRule
    );

    const updatedProd: Product = {
      ...foundCurated,
      id: `ds-${detected}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      price: calc.sellingPrice,
      originalPrice: calc.compareAtPrice,
      discountPercent: Math.round(((calc.compareAtPrice - calc.sellingPrice) / calc.compareAtPrice) * 100),
      dropship: {
        ...foundCurated.dropship!,
        sourceUrl: cleanUrl,
        importedAt: new Date().toISOString()
      }
    };

    return {
      product: updatedProd,
      detectedPlatform: detected,
      sourcePriceFormatted: `${platformConfig.currencySymbol}${foundCurated.dropship!.sourcePrice.toFixed(2)} ${platformConfig.currency}`,
      profitCalculation: calc
    };
  }

  // 2. Intelligent URL Analysis and Auto-Extraction for arbitrary links
  const urlLower = cleanUrl.toLowerCase();
  let estimatedSourcePrice = 8.5; // default fallback
  let currency: 'USD' | 'CNY' = platformConfig.currency;
  let category = 'Smart Watches';
  let title = 'Smart Wireless Portable Device Pro Edition';
  let banglaTitle = 'স্মার্ট ওয়্যারলেস পোর্টেবল ডিভাইস প্রো এডিশন';
  let brand = platformConfig.name;
  let skuPrefix = detected.toUpperCase().slice(0, 3);
  let sampleImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';

  if (currency === 'CNY') {
    estimatedSourcePrice = 35.0; // default for CNY platforms
  }

  // Keyword extraction for realistic titles and categories
  if (urlLower.includes('watch') || urlLower.includes('smartwatch')) {
    category = 'Smart Watches';
    title = `${platformConfig.name} Ultra HD AMOLED Bluetooth Calling Smart Watch`;
    banglaTitle = 'আল্ট্রা এইচডি অ্যামোলেড ব্লুটুথ কলিং স্মার্ট ওয়াচ';
    sampleImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';
    estimatedSourcePrice = currency === 'USD' ? 9.8 : 42.0;
  } else if (urlLower.includes('earbud') || urlLower.includes('headphone') || urlLower.includes('tws') || urlLower.includes('audio')) {
    category = 'Earbuds & Audio';
    title = `${platformConfig.name} Hi-Fi Stereo Bass Wireless Noise-Cancelling Earbuds`;
    banglaTitle = 'হাই-ফাই স্টেরিও ডিপ বাস নয়েজ ক্যান্সেলিং ওয়্যারলেস ইয়ারবাডস';
    sampleImage = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800';
    estimatedSourcePrice = currency === 'USD' ? 5.6 : 28.0;
  } else if (urlLower.includes('power') || urlLower.includes('charger') || urlLower.includes('battery') || urlLower.includes('cable') || urlLower.includes('gan')) {
    category = 'Power & Charging';
    title = `${platformConfig.name} GaN Super Fast Charger Multi-Port Power Delivery`;
    banglaTitle = 'জিএএন সুপার ফাস্ট চার্জার মাল্টি-পোর্ট পাওয়ার ডেলিভারি';
    sampleImage = 'https://images.unsplash.com/photo-1609592424368-23f261905ea5?w=800';
    estimatedSourcePrice = currency === 'USD' ? 7.4 : 32.0;
  } else if (urlLower.includes('keyboard') || urlLower.includes('mouse') || urlLower.includes('stand') || urlLower.includes('gaming') || urlLower.includes('fan')) {
    category = 'Computer & Gaming';
    title = `${platformConfig.name} Ergonomic RGB Pro Gaming & Productivity Accessory`;
    banglaTitle = 'এরগনোমিক আরজিবি প্রো গেমিং ও প্রোডাক্টিভিটি এক্সেসরি';
    sampleImage = 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800';
    estimatedSourcePrice = currency === 'USD' ? 12.0 : 45.0;
  } else if (urlLower.includes('blender') || urlLower.includes('humidifier') || urlLower.includes('lamp') || urlLower.includes('kitchen') || urlLower.includes('home')) {
    category = 'Home & Kitchen';
    title = `${platformConfig.name} Modern Aesthetic Smart Home & Kitchen Device`;
    banglaTitle = 'মডার্ন এসথেটিক স্মার্ট হোম ও কিচেন ডিভাইস';
    sampleImage = 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800';
    estimatedSourcePrice = currency === 'USD' ? 8.9 : 36.0;
  }

  // Extract ID from URL if any
  let extractedId = Math.floor(100000000 + Math.random() * 900000000).toString();
  const idMatch = cleanUrl.match(/\d{6,16}/);
  if (idMatch) {
    extractedId = idMatch[0];
  }

  const pricing = calculateDropshipPricing(estimatedSourcePrice, currency, pricingRule);
  const now = new Date().toISOString();

  const generatedProduct: Product = {
    id: `ds-${detected}-${Date.now()}`,
    name: title,
    banglaName: banglaTitle,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category,
    price: pricing.sellingPrice,
    originalPrice: pricing.compareAtPrice,
    discountPercent: Math.round(((pricing.compareAtPrice - pricing.sellingPrice) / pricing.compareAtPrice) * 100),
    rating: 4.8,
    reviewCount: Math.floor(60 + Math.random() * 300),
    images: [
      sampleImage,
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800'
    ],
    inStock: true,
    stockCount: 50,
    soldCount: Math.floor(120 + Math.random() * 800),
    brand: `${platformConfig.name} Direct`,
    sku: `${skuPrefix}-${extractedId.slice(-6)}`,
    shortDescription: `Direct imported high-quality dropshipping product sourced from verified ${platformConfig.name} suppliers with warranty.`,
    description: `Authentic factory-grade product sourced directly via ${platformConfig.name}. Tested for premium quality, electrical safety, durability, and high performance.`,
    banglaDescription: `${platformConfig.name} থেকে সরাসরি ইমপোর্টকৃত প্রিমিয়াম কোয়ালিটি পণ্য। ডেলিভারির সময় পণ্য চেক করে মূল্য পরিশোধের সুযোগ এবং ওয়ারেন্টি সুবিধা।`,
    features: [
      `100% Genuine Direct Import from ${platformConfig.name}`,
      'Factory Tested for Quality & Safety Assurance',
      'High-grade Durable Materials & Premium Finish',
      'Energy Efficient with Smart Fast Response',
      'Dedicated Bangladesh Support & Replacement Guarantee'
    ],
    specifications: {
      'Source Platform': platformConfig.name,
      'Supplier Origin': detected === 'aliexpress' || detected === 'cjdropshipping' ? 'International / China Global' : 'Guangdong, China',
      'Estimated Shipping': platformConfig.defaultShippingDays,
      'Quality Check': 'Grade A+ QC Passed',
      'Warranty Period': '৬ মাসের রিপ্লেসমেন্ট ওয়ারেন্টি'
    },
    warranty: '৬ মাসের রিপ্লেসমেন্ট ওয়ারেন্টি',
    tags: ['dropship', detected, category.toLowerCase()],
    vendor: `${platformConfig.name} Direct`,
    status: 'active',
    dropship: {
      platform: detected,
      sourceUrl: cleanUrl,
      sourceId: extractedId,
      supplierName: `${platformConfig.name} Verified Supplier`,
      sourceCurrency: currency,
      sourcePrice: estimatedSourcePrice,
      shippingDays: platformConfig.defaultShippingDays,
      supplierRating: '4.8/5 (Verified Manufacturer)',
      ordersCount: '5,000+ orders',
      importedAt: now
    }
  };

  return {
    product: generatedProduct,
    detectedPlatform: detected,
    sourcePriceFormatted: `${platformConfig.currencySymbol}${estimatedSourcePrice.toFixed(2)} ${currency}`,
    profitCalculation: pricing
  };
}
