import { Category, Coupon, Order, Product, Review } from '../types';

export const STORE_SETTINGS = {
  name: 'GPE Bangladesh',
  tagline: 'Your Trusted Express E-Commerce in Bangladesh',
  phone: '09678-123456',
  whatsapp: '+8801700123456',
  email: 'support@gpebangladesh.store',
  address: 'Level 4, House 12, Road 7, Dhanmondi, Dhaka-1205, Bangladesh',
  deliveryInsideDhaka: 60,
  deliveryOutsideDhaka: 120,
  freeDeliveryThreshold: 3000,
  estimatedDeliveryDhaka: '24 - 48 Hours',
  estimatedDeliveryNationwide: '48 - 72 Hours',
  bkashNumber: '01700-123456 (Merchant)',
  nagadNumber: '01800-654321 (Merchant)',
  rocketNumber: '01900-987654 (Merchant)',
};

export const CATEGORIES: Category[] = [
  {
    id: 'cat-smartwatches',
    name: 'Smart Watches',
    banglaName: 'স্মার্টওয়াচ ও ব্যান্ড',
    slug: 'smart-watches',
    iconName: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    itemCount: 24,
    subcategories: ['Ultra Series', 'Calling Watches', 'Fitness Bands', 'Straps & Screen Protectors'],
  },
  {
    id: 'cat-audio',
    name: 'Earbuds & Audio',
    banglaName: 'টিডব্লিউএস ও ব্লুটুথ হেডফোন',
    slug: 'earbuds-audio',
    iconName: 'Headphones',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    itemCount: 38,
    subcategories: ['TWS Earbuds', 'Neckbands', 'Over-Ear Headphones', 'Bluetooth Speakers'],
  },
  {
    id: 'cat-power',
    name: 'Power & Charging',
    banglaName: 'চার্জার ও পাওয়ার ব্যাংক',
    slug: 'power-charging',
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    itemCount: 32,
    subcategories: ['Fast Chargers', 'Power Banks', 'Braided Cables', 'Wireless Chargers'],
  },
  {
    id: 'cat-gadgets',
    name: 'Computer & Gaming',
    banglaName: 'কম্পিউটার ও গেমিং গ্যাজেট',
    slug: 'computer-gaming',
    iconName: 'Laptop',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    itemCount: 29,
    subcategories: ['Keyboards & Mice', 'Gaming Headsets', 'Laptop Stands', 'USB Hubs'],
  },
  {
    id: 'cat-home',
    name: 'Home & Kitchen',
    banglaName: 'হোম ও কিচেন এপ্লায়েন্স',
    slug: 'home-kitchen',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    itemCount: 45,
    subcategories: ['Air Fryers', 'Electric Kettles', 'Smart Lamps', 'Mini Fans'],
  },
  {
    id: 'cat-caps',
    name: "Men's Caps & Fashion",
    banglaName: 'মেন্স ক্যাপ ও লাইফস্টাইল',
    slug: 'mens-caps-fashion',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80',
    itemCount: 19,
    subcategories: ['Baseball Caps', 'Snapbacks', 'Trucker Caps', 'Wallets & Belts'],
  },
  {
    id: 'cat-personal-care',
    name: 'Health & Grooming',
    banglaName: 'গ্রুমিং ও পার্সোনাল কেয়ার',
    slug: 'health-grooming',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80',
    itemCount: 21,
    subcategories: ['Electric Trimmers', 'Hair Dryers', 'Massagers', 'Dental Care'],
  },
  {
    id: 'cat-mobile-acc',
    name: 'Mobile Accessories',
    banglaName: 'মোবাইল ও ক্যামেরা এক্সেসরিজ',
    slug: 'mobile-accessories',
    iconName: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
    itemCount: 52,
    subcategories: ['Phone Holders', 'Lavalier Microphones', 'Tripods', 'Lens Protectors'],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-shopify-stand-881',
    name: 'Multi-Function Foldable Laptop & Tablet Stand – Portable Adjustable Desk Stand',
    banglaName: 'মাল্টি-ফাংশন ফোল্ডেবল ল্যাপটপ ও ট্যাবলেট স্ট্যান্ড – পোর্টেবল ডেস্ক স্ট্যান্ড',
    slug: 'multi-function-foldable-laptop-tablet-stand-portable-adjustable-desk-stand',
    category: 'Laptop Stands in Computer Risers & Stands',
    subcategory: 'Laptop & Tablet Stand',
    price: 899,
    originalPrice: 1450,
    discountPercent: 38,
    rating: 4.9,
    reviewCount: 26,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 5,
    soldCount: 42,
    isFlashDeal: true,
    flashDealEnd: '2026-10-20T23:59:59',
    isFeatured: true,
    isTrending: true,
    badge: 'SHOPIFY FEATURED',
    brand: 'Merrono',
    sku: 'GPE-STAND-881',
    shortDescription: 'Create a comfortable and organized workspace with this Multi-Function Laptop & Tablet Stand. Designed for modern users, this adjustable stand supports laptops, tablets, and smartphones.',
    description: `Create a comfortable and organized workspace with this Multi-Function Laptop & Tablet Stand. Designed for modern users, this adjustable stand supports laptops, tablets, and smartphones while providing flexible viewing angles for better comfort during work, study, meetings, and entertainment.

The foldable and lightweight design allows you to carry it easily, while its durable aluminum construction ensures stable support for everyday use.

Key Features:
🔄 Multi-Device Compatibility
Compatible with laptops, tablets, and smartphones, making it a versatile stand for different devices.

📐 Adjustable Viewing Angle
Adjust the stand according to your preferred height and angle for a more comfortable viewing experience.

🎒 Foldable & Portable Design
Easy to fold, store, and carry — ideal for office, home, classroom, and travel use.`,
    banglaDescription: 'আপনার কাজ ও পড়াশোনাকে আরও আরামদায়ক ও নিখুঁত করতে ফোল্ডেবল ও অ্যাডজাস্টেবল অ্যালুমিনিয়াম স্ট্যান্ড। ল্যাপটপ, ট্যাবলেট ও স্মার্টফোনের জন্য পারফেক্ট।',
    features: [
      'Multi-Device Compatibility (Laptops, Tablets, Smartphones)',
      'Adjustable Multi-Level Viewing Angles',
      'Foldable, Lightweight & Ultra-Portable Design',
      'Premium Aircraft-Grade Aluminum Build'
    ],
    specifications: {
      'Product Type': 'Multi-Function Device Stand',
      'Material': 'Aluminum Alloy',
      'Compatibility': 'Laptops 10-15.6 inch, Tablets & Phones',
      'Angles Supported': 'Multi-Angle Adjustable Tilt'
    },
    warranty: 'There is no warranty provided with this product.',
    colors: [
      { name: 'Orange', hex: '#ea580c' },
      { name: 'Silver', hex: '#94a3b8' },
      { name: 'Black', hex: '#1e293b' }
    ],
    tags: ['Laptop & Tablet Stand', 'Computer & IT Accessories', 'Desk Stand'],
    status: 'active',
    publishing: ['All channels', 'Online Store'],
    productType: 'Laptop & Tablet Stand',
    vendor: 'Merrono',
    collections: ['Computer & IT Accessories'],
    themeTemplate: 'Default product',
    costPerItem: 560,
    chargeTax: false,
    inventoryTracked: true,
    continueSellingWhenOutOfStock: false,
    barcode: '8811531075778',
    isPhysicalProduct: true,
    packageType: 'Store default • Sample box - 22',
    weight: 0.35,
    weightUnit: 'kg',
    countryOfOrigin: 'China',
    hsCode: '8473.30.00',
    categoryMetafields: {
      color: ['Orange', 'Silver', 'Black'],
      material: 'Aluminum',
      anglesSupported: 'Adjustable',
      compatibleDevice: ['Tablet', 'Smartphone', 'Laptop'],
      features: ['Foldable', 'Lightweight', 'Portable', 'Adjustable'],
      powerSource: 'Manual / No Power'
    },
    productMetafields: {
      specification: 'Product Type:Multi-Function Device Stand | Material:Aluminum',
      warranty: 'There is no warranty provided with this product.'
    },
    variantMetafields: {
      googleAgeGroup: 'Adult',
      googleCondition: 'New',
      googleGender: 'Unisex',
      googleMpn: 'GPE-STAND-881'
    },
    seo: {
      title: 'Multi-Function Foldable Laptop & Tablet Stand – Portable Adjustable Desk Stand',
      description: 'Create a comfortable and organized workspace with this Multi-Function Laptop & Tablet Stand. Designed for modern users, this adjustable stand supports laptops, tablets, and smartphones...',
      handle: 'multi-function-foldable-laptop-tablet-stand-portable-adjustable-desk-stand'
    }
  },
  {
    id: 'prod-1',
    name: 'T900 Ultra 2 Bluetooth Calling Smartwatch with 2.09" HD Display',
    banglaName: 'টি৯০০ আল্ট্রা ২ ব্লুটুথ কলিং স্মার্টওয়াচ ২.০৯ ইঞ্চি এইচডি ডিসপ্লে',
    slug: 't900-ultra-2-smartwatch',
    category: 'Smart Watches',
    subcategory: 'Ultra Series',
    price: 1390,
    originalPrice: 2250,
    discountPercent: 38,
    rating: 4.8,
    reviewCount: 142,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 45,
    soldCount: 310,
    isFlashDeal: true,
    flashDealEnd: '2026-10-15T23:59:59',
    isFeatured: true,
    isTrending: true,
    badge: 'FLASH DEAL',
    brand: 'Ultra Series',
    sku: 'GPE-SW-902',
    shortDescription: 'Latest 2026 Edition with full screen infinite display, Bluetooth voice calls, heart rate monitoring, sports modes, and wireless charging dock.',
    description: 'The T900 Ultra 2 is the most popular rugged smart watch in Bangladesh with an ultra-bright 2.09-inch HD infinite touch display, waterproof casing, customizable watch faces, dual straps, and high-fidelity speaker for seamless phone calling.',
    banglaDescription: 'টি৯০০ আল্ট্রা ২ সম্পূর্ণ নতুন সংস্করণে রয়েছে ২.০৯ ইঞ্চির বিশাল ডিসপ্লে, সরাসরি মোবাইল কল রিসিভ ও ডায়াল করার সুবিধা, হার্ট রেট ও স্লিপ ট্র্যাকার এবং ওয়্যারলেস চার্জিং ডক। ক্যাশ অন ডেলিভারি সুবিধা সহ ঘরে বসেই পেয়ে যান।',
    features: [
      'Crystal Clear Bluetooth Calling & Contacts Sync',
      '2.09-inch Infinite HD IPS Display with Always-On Support',
      'Accurate Heart Rate, Blood Oxygen (SpO2) & Sleep Tracker',
      'Magnetic Wireless Quick Charger Included',
      'IP68 Water Resistant for Rain and Daily Handwashing',
      'Includes 2 interchangeable premium ocean straps'
    ],
    specifications: {
      'Screen Size': '2.09 Inch IPS HD',
      'Resolution': '320 x 385 Pixels',
      'Battery Life': '3 - 5 Days Normal Usage',
      'Connectivity': 'Bluetooth 5.0 + BLE',
      'Compatibility': 'Android 5.0+ / iOS 9.0+',
      'Charging Type': 'Wireless Magnetic Dock'
    },
    warranty: '6 Months Replacement Warranty',
    colors: [
      { name: 'Orange Strap + Titanium Case', hex: '#ea580c' },
      { name: 'Midnight Black + Matte Black Case', hex: '#18181b' },
      { name: 'Silver White + Silver Case', hex: '#e2e8f0' }
    ],
    tags: ['smartwatch', 'ultra', 'calling watch', 'bangladesh deal']
  },
  {
    id: 'prod-2',
    name: 'Lenovo LP40 Pro True Wireless Stereo Bluetooth Earbuds (TWS)',
    banglaName: 'লেনোভো এলপি৪০ প্রো ট্রু ওয়্যারলেস স্টেরিও ব্লুটুথ ইয়ারবাডস',
    slug: 'lenovo-lp40-pro-tws-earbuds',
    category: 'Earbuds & Audio',
    subcategory: 'TWS Earbuds',
    price: 890,
    originalPrice: 1450,
    discountPercent: 39,
    rating: 4.9,
    reviewCount: 284,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 88,
    soldCount: 650,
    isFlashDeal: true,
    flashDealEnd: '2026-10-15T23:59:59',
    isFeatured: true,
    isTrending: true,
    badge: 'BEST SELLER',
    brand: 'Lenovo',
    sku: 'GPE-AUD-40',
    shortDescription: 'Upgraded Bluetooth 5.1 chip, low gaming latency, deep bass diaphragm, ergonomic comfortable semi-in-ear fit, and Type-C fast charging.',
    description: 'Lenovo LP40 Pro offers audiophile-grade sound quality in a compact, lightweight case. Equipped with smart touch controls, auto instant pairing upon opening the lid, and noise reduction for clear HD calls.',
    banglaDescription: '১০০% অরিজিনাল লেনোভো এলপি৪০ প্রো ইয়ারবাডস। অসাধারণ ভারী বাস ও স্বচ্ছ ক্রিস্টাল অডিও কোয়ালিটি। গেমিং এর জন্য লো ল্যাটেন্সি এবং একটানা ৪-৫ ঘন্টা ব্যাটারি ব্যাকআপ।',
    features: [
      'Dual Master Earbuds (Independent Left/Right connectivity)',
      '13mm Large Composite Dynamic Bass Driver',
      'Environmental Noise Cancellation (ENC) for Calls',
      'Total 24 Hours Playtime with 250mAh Charging Box',
      'Comfortable semi-in-ear design that fits all ears without ear fatigue'
    ],
    specifications: {
      'Bluetooth Version': 'v5.1 High Stability',
      'Driver Unit': '13mm Titanium Moving Coil',
      'Playtime': '4-5 Hours per charge (20+ Hours with Case)',
      'Charging Interface': 'USB Type-C',
      'Waterproof': 'IPX5 Sweat & Splash Proof'
    },
    warranty: '7 Days Replacement Guarantee',
    colors: [
      { name: 'Pure White', hex: '#f8fafc' },
      { name: 'Graphite Black', hex: '#1e293b' },
      { name: 'Pastel Pink', hex: '#f472b6' }
    ],
    tags: ['earbuds', 'lenovo', 'tws', 'wireless audio', 'low latency']
  },
  {
    id: 'prod-3',
    name: 'Baseus 65W GaN5 Pro 3-Port Fast Wall Charger with 100W Cable',
    banglaName: 'বেসিয়াস ৬৫ ওয়াট ফাস্ট ওয়াল চার্জার ৩ পোর্ট টাইপ-সি ও ইউএসবি',
    slug: 'baseus-65w-gan5-pro-fast-charger',
    category: 'Power & Charging',
    subcategory: 'Fast Chargers',
    price: 2350,
    originalPrice: 3200,
    discountPercent: 27,
    rating: 4.9,
    reviewCount: 95,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1609592424368-23f261905ea5?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 30,
    soldCount: 180,
    isFlashDeal: false,
    isFeatured: true,
    isTrending: false,
    brand: 'Baseus',
    sku: 'GPE-PWR-65',
    shortDescription: 'Next-Gen GaN5 technology. Charges laptops, MacBooks, iPhones, and Android smartphones at maximum turbo speeds simultaneously.',
    description: 'Upgraded GaN5 technology makes this Baseus charger 53% smaller with enhanced heat dissipation. Featuring 2x USB-C PD 65W ports and 1x USB-A QC 60W port, you can charge your laptop, tablet, and smartphone from a single wall socket safely.',
    banglaDescription: 'বেসিয়াস অরিজিনাল ৬৫ ওয়াট ফাস্ট চার্জার। একই সাথে ল্যাপটপ, আইফোন ও অ্যান্ড্রয়েড ফোন সুপার ফাস্ট গতিতে চার্জ করার সেরা সমাধান। সাথে ফ্রি পাচ্ছেন ১০০ ওয়াট টাইপ-সি ক্যাবল।',
    features: [
      'Triple Port Simultaneous Fast Charging (2x Type-C + 1x USB-A)',
      'BPS II Intelligent Power Allocation prevents overheating',
      'Full Compatibility: PD 3.0, QC 4.0+, Samsung Super Fast Charge, PPS',
      'Free 100W Type-C to Type-C 1 Meter Braided Cable included in box',
      'Over-voltage, over-current, and short circuit protection'
    ],
    specifications: {
      'Total Output': '65W Max',
      'Input': 'AC 100-240V, 50/60Hz, 1.5A Max',
      'Type-C1/C2 Output': '5V/3A, 9V/3A, 12V/3A, 15V/3A, 20V/3.25A (65W Max)',
      'USB-A Output': '5V/3A, 9V/3A, 12V/3A, 20V/3A (60W Max)',
      'Dimensions': '65 x 36 x 32 mm'
    },
    warranty: '1 Year Official Brand Warranty',
    colors: [
      { name: 'Matte Black', hex: '#0f172a' },
      { name: 'Polar White', hex: '#f1f5f9' }
    ],
    tags: ['charger', 'baseus', 'gan', 'fast charging', 'macbook']
  },
  {
    id: 'prod-4',
    name: 'Remax RPP-292 20000mAh 22.5W Fast Charging Power Bank with Digital Display',
    banglaName: 'রিমেক্স ২০০০০ এমএএইচ ২২.৫ ওয়াট ফাস্ট চার্জিং পাওয়ার ব্যাংক',
    slug: 'remax-rpp-292-20000mah-power-bank',
    category: 'Power & Charging',
    subcategory: 'Power Banks',
    price: 1850,
    originalPrice: 2600,
    discountPercent: 29,
    rating: 4.7,
    reviewCount: 167,
    images: [
      'https://images.unsplash.com/photo-1609592424368-23f261905ea5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 55,
    soldCount: 420,
    isFlashDeal: true,
    flashDealEnd: '2026-10-15T23:59:59',
    isFeatured: true,
    isTrending: true,
    badge: 'POPULAR',
    brand: 'Remax',
    sku: 'GPE-PB-292',
    shortDescription: 'Massive 20000mAh capacity with 22.5W Huawei SuperCharge and 20W PD two-way fast charging, precise smart LED battery percentage screen.',
    description: 'Never run out of power on the go. The Remax RPP-292 features airline-approved safety ratings, a scratch-resistant textured polycarbonate body, and charges typical smartphones 4 to 5 times on a single full charge.',
    banglaDescription: 'রিমেক্স ২০০০০ এমএএইচ অরিজিনাল পাওয়ার ব্যাংক। এলইডি ডিজিটাল ডিসপ্লেতে ব্যাটারির শতকরা পরিমাণ দেখা যায়। ২২.৫ ওয়াট ফাস্ট চার্জিং এর সাহায্যে মাত্র ৩০ মিনিটে ৬০% চার্জ সম্পন্ন হয়।',
    features: [
      '20000mAh High-Density Polymer Lithium Cell',
      '22.5W Super Fast Charging Output',
      'Two-Way Fast Charge Type-C port (Input & Output)',
      'Multi-protection circuit board approved for flights',
      'Simultaneous dual device charging'
    ],
    specifications: {
      'Battery Capacity': '20000mAh / 74Wh',
      'Output Ports': '1x USB-A (22.5W Max) + 1x Type-C (20W PD Max)',
      'Input Ports': '1x Type-C (18W) + 1x Micro USB (18W)',
      'Display': 'LED Smart Digital Percentage Indicator',
      'Weight': '408 grams'
    },
    warranty: '6 Months Brand Replacement Warranty',
    colors: [
      { name: 'Dark Navy', hex: '#1e3a8a' },
      { name: 'Pearl White', hex: '#f8fafc' }
    ],
    tags: ['powerbank', 'remax', '20000mah', 'fast charge']
  },
  {
    id: 'prod-5',
    name: 'Vintage T9 Professional Cordless Hair & Beard Trimmer with Dragon Carving',
    banglaName: 'ভিন্টেজ টি৯ প্রফেশনাল হেয়ার ও বিয়ার্ড ট্রিমার গোল্ডেন ড্রাগন ডিজাইন',
    slug: 'vintage-t9-cordless-hair-trimmer',
    category: 'Health & Grooming',
    subcategory: 'Electric Trimmers',
    price: 680,
    originalPrice: 1200,
    discountPercent: 43,
    rating: 4.8,
    reviewCount: 312,
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 92,
    soldCount: 890,
    isFlashDeal: true,
    flashDealEnd: '2026-10-15T23:59:59',
    isFeatured: true,
    isTrending: true,
    badge: 'TOP DEAL',
    brand: 'Vintage',
    sku: 'GPE-TRM-T9',
    shortDescription: 'Full metal vintage carved body, ultra-sharp T-blade zero-gapped cutter head, rechargeable USB lithium battery with 4 guide combs.',
    description: 'Achieve barber-quality beard lining, hair fading, and trimming at home. The Vintage T9 features a silent high-torque rotary motor, titanium carbon steel T-blade that does not pinch skin, and 120 minutes of continuous runtime.',
    banglaDescription: 'বর্তমানে বাংলাদেশের সবচেয়ে জনপ্রিয় ভিন্টেজ টি৯ ট্রিমার। সম্পূর্ণ মেটাল খোদাই করা বডি, ৪টি ভিন্ন সাইজের কাটিং ক্লিপ এবং রিচার্জেবল ব্যাটারি। দাড়ি ও চুল নিখুঁতভাবে সাইজ করার আদর্শ গ্যাজেট।',
    features: [
      'Zero-Gap Titanium Stainless Steel T-Blade',
      'Heavy-duty Bronze Dragon Embossed Metal Body',
      'High-Power 7000 RPM Motor with Quiet Sound Dampening',
      '1200mAh USB Rechargeable Battery (2 Hours Runtime)',
      'Comes with 4 Guide Combs (1.5mm, 2mm, 3mm, 4mm), cleaning brush & lube oil'
    ],
    specifications: {
      'Blade Material': 'Titanium Carbon Steel',
      'Battery': '1200mAh 18650 Li-ion',
      'Charging Time': '2 Hours via USB',
      'Usage Time': '120 Minutes Non-stop',
      'Voltage': '110-240V Worldwide'
    },
    warranty: '7 Days Checking Warranty',
    colors: [
      { name: 'Antique Gold Dragon', hex: '#d97706' },
      { name: 'Metallic Silver Buddha', hex: '#94a3b8' }
    ],
    tags: ['trimmer', 'grooming', 'beard trimmer', 'vintage t9']
  },
  {
    id: 'prod-6',
    name: 'Premium New York Yankees 3D Embroidered Structured Baseball Cap',
    banglaName: 'প্রিমিয়াম নিউ ইয়র্ক ইয়াঙ্কিস ৩ডি এমব্রয়ডারি বেসবল ক্যাপ',
    slug: 'ny-yankees-baseball-cap',
    category: "Men's Caps & Fashion",
    subcategory: 'Baseball Caps',
    price: 490,
    originalPrice: 850,
    discountPercent: 42,
    rating: 4.7,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 60,
    soldCount: 240,
    isFlashDeal: false,
    isFeatured: true,
    isTrending: false,
    brand: 'New Era Style',
    sku: 'GPE-CAP-NY',
    shortDescription: '100% breathable heavy cotton twill, high-density 3D stitched raised NY monogram, sweat-wicking inner headband, adjustable brass buckle strap.',
    description: 'Step out in timeless urban street style. This structured 6-panel cap maintains its crisp shape all day, features pre-curved visor for UV sun protection, and fits all head sizes seamlessly with the back closure buckle.',
    banglaDescription: '১০০% পিওর কটন ফেব্রিকের তৈরি ক্লাসিক এনওয়াই বেসবল ক্যাপ। প্রিমিয়াম ৩ডি স্টিচিং এবং অ্যাডজাস্টেবল সাইজ যা যেকোনো কারো মাথায় পারফেক্টভাবে ফিট হয়। রোদ ও গরমে প্রতিদিনের ব্যবহারের জন্য অত্যন্ত আরামদায়ক।',
    features: [
      '100% Premium Pure Cotton Heavyweight Twill',
      'Raised 3D Needlework Embroidery Front Logo',
      'Embroidered ventilation eyelets for breathability in hot weather',
      'Adjustable back cloth strap with antique brass buckle',
      'Reinforced front crown maintains round shape permanently'
    ],
    specifications: {
      'Material': '100% Washed Cotton Canvas',
      'Circumference': '56 - 60 cm (Adjustable)',
      'Visor Length': '7.5 cm Curved Brim',
      'Panel Count': '6-Panel Crown with Stitching'
    },
    warranty: '100% Authentic Quality Guarantee',
    colors: [
      { name: 'Deep Navy Blue', hex: '#1e3a8a' },
      { name: 'Charcoal Jet Black', hex: '#0f172a' },
      { name: 'Military Khaki', hex: '#78716c' }
    ],
    tags: ['cap', 'fashion', 'men fashion', 'baseball cap', 'banglaxpress caps']
  },
  {
    id: 'prod-7',
    name: 'K8 Wireless Lavalier Dual Clip-on Microphone for Smartphone & PC',
    banglaName: 'কে৮ ওয়্যারলেস ল্যাভালিয়ার কলার মাইক্রোফোন টাইপ-সি ও আইফোন',
    slug: 'k8-wireless-lavalier-microphone',
    category: 'Mobile Accessories',
    subcategory: 'Lavalier Microphones',
    price: 590,
    originalPrice: 1150,
    discountPercent: 48,
    rating: 4.6,
    reviewCount: 145,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 70,
    soldCount: 530,
    isFlashDeal: true,
    flashDealEnd: '2026-10-15T23:59:59',
    isFeatured: false,
    isTrending: true,
    badge: 'CREATOR PICK',
    brand: 'K8 Studio',
    sku: 'GPE-MIC-K8',
    shortDescription: 'Plug-and-play wireless collar mic for Facebook Live, YouTube videos, TikTok, vlogs, and online classes. No app or Bluetooth pairing needed.',
    description: 'Simply plug the receiver into your mobile port and clip the transmitter mic to your collar. Built-in DSP chip filters out ambient street wind and crowd noise, recording pristine 360-degree omnidirectional studio audio up to 20 meters away.',
    banglaDescription: 'ইউটিউব কনটেন্ট ক্রিয়েটর, টিকটক ও ফেসবুক লাইভের জন্য বেস্ট ওয়্যারলেস মাইক। কোনো ব্লুটুথ বা অ্যাপ লাগবে না—রিসিভার ফোনে লাগালেই সাথে সাথে কানেক্ট হয়ে যায়। আশেপাশের নয়েজ ব্লক করে স্পষ্ট ভয়েস রেকর্ড করে।',
    features: [
      'True Plug and Play (Auto connection in 1 second)',
      'Intelligent DSP Active Noise Cancellation',
      '20 Meters Barrier-Free Transmission distance',
      '360° Omnidirectional Sound Pickup sponge',
      'Includes Lightning converter adapter for iPhones'
    ],
    specifications: {
      'Frequency Range': '2.4GHz Digital RF',
      'Transmission Delay': '0.009s Ultra-low',
      'Battery Capacity': '80mAh (Up to 10 Hours usage)',
      'Port Compatibility': 'Type-C + Lightning (iPhone)',
      'Charging Time': 'About 1.5 Hours'
    },
    warranty: '7 Days Replacement Warranty',
    colors: [
      { name: 'Standard Black', hex: '#18181b' }
    ],
    tags: ['microphone', 'vlog', 'youtube', 'content creator', 'k8 wireless']
  },
  {
    id: 'prod-8',
    name: 'Stainless Steel Double-Wall Electric Hot Water Kettle 2.0L',
    banglaName: 'স্টেইনলেস স্টিল ইলেকট্রিক কেটলি ২ লিটার অটো কাট-অফ',
    slug: 'stainless-steel-electric-kettle-2l',
    category: 'Home & Kitchen',
    subcategory: 'Electric Kettles',
    price: 750,
    originalPrice: 1250,
    discountPercent: 40,
    rating: 4.8,
    reviewCount: 215,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 40,
    soldCount: 380,
    isFlashDeal: false,
    isFeatured: true,
    isTrending: false,
    brand: 'Scarlett / DSP',
    sku: 'GPE-KET-2L',
    shortDescription: '1500W rapid boiling element boils 2 liters of tea water in under 3 minutes with automatic steam shut-off and boil-dry protection.',
    description: 'Food grade 304 stainless steel interior ensures safe, chemical-free drinking water. Features 360-degree swivel cordless base, one-touch pop-up lid, and ergonomic heat-insulated stay-cool handle.',
    banglaDescription: 'দ্রুত চা, কফি বা গরম পানির জন্য ২ লিটারের শক্তিশালী ইলেকট্রিক কেটলি। পানি ফুটে গেলে নিজে নিজেই সুইচ অফ হয়ে যায়। টেকসই স্টেইনলেস স্টিল বডি যা সহজে মরিচা ধরে না।',
    features: [
      'Food-Grade 304 Anti-Rust Stainless Steel Inner Tank',
      '1500W High Speed Rapid Boiling Element',
      'Automatic Shut-Off when water boils or kettle is empty',
      '360° Rotational Base with concealed power cord storage',
      'LED power indicator light on the bottom base'
    ],
    specifications: {
      'Capacity': '2.0 Liters',
      'Power Rating': '1500W / 220V 50Hz',
      'Boiling Speed': '2 to 3 Minutes',
      'Safety': 'Auto-cutoff thermostat with thermal fuse',
      'Body': 'Brushed Stainless Steel'
    },
    warranty: '1 Month Replacement Warranty',
    colors: [
      { name: 'Silver Steel & Black Handle', hex: '#64748b' }
    ],
    tags: ['electric kettle', 'kitchen', 'water boiler', 'home appliance']
  },
  {
    id: 'prod-9',
    name: 'Astronaut Galaxy Starry Night Light Laser Projector with Remote',
    banglaName: 'অ্যাস্ট্রোনট গ্যালাক্সি স্টাররি নাইট লাইট প্রজেক্টর রিমোট সহ',
    slug: 'astronaut-galaxy-starry-projector',
    category: 'Home & Kitchen',
    subcategory: 'Smart Lamps',
    price: 1190,
    originalPrice: 1850,
    discountPercent: 35,
    rating: 4.9,
    reviewCount: 198,
    images: [
      'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 35,
    soldCount: 460,
    isFlashDeal: true,
    flashDealEnd: '2026-10-15T23:59:59',
    isFeatured: true,
    isTrending: true,
    badge: 'VIRAL',
    brand: 'SpaceCraft',
    sku: 'GPE-LGT-AST',
    shortDescription: '360° magnetic rotating astronaut head projects breathtaking nebula clouds and twinkling laser stars across your bedroom ceiling.',
    description: 'Transform any room into a magical cosmic planetarium. Comes with 8 vivid nebula color modes, adjustable brightness, starry speed controls, and a smart sleep timer remote control.',
    banglaDescription: 'ঘরের ছাদ ও দেয়ালকে তৈরি করুন রাতের মায়াবী মহাকাশ! ৩৬০ ডিগ্রি ঘুরানো যায় এমন অ্যাস্ট্রোনট প্রজেক্টর। রিমোটের সাহায্যে আলোর রঙ, গতি এবং টাইমার সেট করা যায়। বাচ্চা ও বড় সবার অত্যন্ত পছন্দের উপহার।',
    features: [
      '8 Stunning Nebula Modes with Real Green Twinkling Stars',
      '360° Magnetic Rotatable Head to project anywhere',
      'Included Wireless Remote Controller (Range up to 5 meters)',
      '45 / 90 Minute Sleep Auto-Shutoff Timer',
      'Lunar base stand with textured moon surface'
    ],
    specifications: {
      'Light Source': 'LED Nebula + 532nm Green Laser',
      'Control Mode': 'Remote Control + Astronaut Back Buttons',
      'Power Supply': 'USB 5V/1A (Plug to any phone adapter)',
      'Coverage Area': '15 - 50 Square Meters'
    },
    warranty: '7 Days Replacement Guarantee',
    colors: [
      { name: 'Cosmic White', hex: '#f8fafc' },
      { name: 'Lunar Black', hex: '#18181b' }
    ],
    tags: ['astronaut', 'projector', 'night light', 'room decor', 'galaxy']
  },
  {
    id: 'prod-10',
    name: 'Meetion MT-K9300 RGB Backlit Gaming Keyboard and Optical Mouse Combo',
    banglaName: 'মিশন আরজিবি ব্যাকলিট গেমিং কিবোর্ড ও অপটিক্যাল মাউস কম্বো',
    slug: 'meetion-rgb-gaming-keyboard-mouse-combo',
    category: 'Computer & Gaming',
    subcategory: 'Keyboards & Mice',
    price: 1550,
    originalPrice: 2200,
    discountPercent: 29,
    rating: 4.7,
    reviewCount: 76,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 28,
    soldCount: 140,
    isFlashDeal: false,
    isFeatured: true,
    isTrending: false,
    brand: 'Meetion',
    sku: 'GPE-PC-9300',
    shortDescription: 'Rainbow backlit tactile keyboard with 19-key anti-ghosting, paired with high precision 3200 DPI ergonomic RGB gaming mouse.',
    description: 'Engineered for gamers, coders, and office enthusiasts. Features quiet tactile key switches, spill-resistant braided cable, multimedia hotkeys, and breathing RGB light effects.',
    banglaDescription: 'বাজেটের মধ্যে সেরা আরজিবি ব্যাকলিট গেমিং কিবোর্ড ও মাউস সেট। রাতের বেলা চমৎকার আলো ছড়ায়, কীস্ট্রোক অত্যন্ত স্মুথ ও টেকসই। ল্যাপটপ এবং ডেক্সটপ উভয়ের সাথে সরাসরি সাপোর্ট করে।',
    features: [
      'Dynamic 7-Color Rainbow LED Backlighting',
      '19 Anti-Ghosting Conflict-Free Gaming Keys',
      '4-Level DPI Switchable Mouse (800 - 1600 - 2400 - 3200 DPI)',
      'Spill-Proof Drainage Holes & Heavy-duty Braided Cable',
      'Plug and Play USB: Compatible with Windows, Mac, Linux'
    ],
    specifications: {
      'Keyboard Keys': '104 Standard + 12 Multimedia FN Keys',
      'Mouse Sensor': 'High-Precision Optical Engine',
      'Cable Length': '1.5 Meter Durable Braided Cord',
      'Key Life': 'Over 10 Million Keystrokes'
    },
    warranty: '1 Year Replacement Warranty',
    colors: [
      { name: 'Matte Black RGB', hex: '#0f172a' }
    ],
    tags: ['keyboard', 'mouse', 'gaming', 'rgb', 'computer accessories']
  },
  {
    id: 'prod-11',
    name: 'DSP 8-in-1 Multifunction Digital Touchscreen Air Fryer 5.5L',
    banglaName: 'ডিএসপি ৮-ইন-১ মাল্টিফাংশন ডিজিটাল এয়ার ফ্রায়ার ৫.৫ লিটার',
    slug: 'dsp-8-in-1-digital-air-fryer-5l',
    category: 'Home & Kitchen',
    subcategory: 'Air Fryers',
    price: 6490,
    originalPrice: 8500,
    discountPercent: 23,
    rating: 4.9,
    reviewCount: 54,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 16,
    soldCount: 95,
    isFlashDeal: false,
    isFeatured: true,
    isTrending: false,
    badge: 'HEALTHY LIFE',
    brand: 'DSP Germany',
    sku: 'GPE-AF-55',
    shortDescription: 'Enjoy 85% less oil and guilt-free crispy fried chicken, fries, fish, and baked cakes with 360° rapid hot air vortex technology.',
    description: 'The DSP 5.5L Digital Air Fryer brings healthy gourmet cooking to Bangladeshi homes. Comes with an intuitive one-touch LED touchscreen with 8 pre-programmed food settings, non-stick dishwasher-safe basket, and automatic timer alert.',
    banglaDescription: 'তেল ছাড়া স্বাস্থ্যকর মুচমুচে চিকেন ফ্রাই, সমুচা, রোল ও ফ্রেঞ্চ ফ্রাই তৈরি করুন খুব সহজে। ৮৫% কম তেলে খাবার রান্না হয় যা পুরো পরিবারের স্বাস্থ্যের জন্য নিরাপদ। ৫.৫ লিটার ধারণক্ষমতা বড় পরিবারের জন্য আদর্শ।',
    features: [
      'Large 5.5L Family Capacity Non-Stick Basket',
      '8 Intelligent One-Touch Cooking Presets',
      '360° High Speed Superheated Air Circulation',
      'Adjustable Temperature 80°C to 200°C with 60-Minute Timer',
      'Food-grade Teflon coating basket for quick effortless cleanup'
    ],
    specifications: {
      'Capacity': '5.5 Liters',
      'Power': '1400W High Efficiency Heating',
      'Control Panel': 'Smart Digital LED Touch Screen',
      'Voltage': '220V-240V 50Hz'
    },
    warranty: '1 Year Motor Service Warranty',
    colors: [
      { name: 'Piano Glossy Black with Gold Trim', hex: '#18181b' }
    ],
    tags: ['air fryer', 'kitchen', 'oil free', 'healthy cooking']
  },
  {
    id: 'prod-12',
    name: 'Portable USB Rechargeable Bladeless Hanging Neck Fan',
    banglaName: 'পোর্টেবল রিচার্জেবল ব্লেডলেস নেক ফ্যান গরমে আরামদায়ক',
    slug: 'portable-rechargeable-neck-fan',
    category: 'Home & Kitchen',
    subcategory: 'Mini Fans',
    price: 850,
    originalPrice: 1350,
    discountPercent: 37,
    rating: 4.6,
    reviewCount: 118,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 65,
    soldCount: 390,
    isFlashDeal: true,
    flashDealEnd: '2026-10-15T23:59:59',
    isFeatured: false,
    isTrending: true,
    badge: 'SUMMER HIT',
    brand: 'CoolBreeze',
    sku: 'GPE-FAN-NK',
    shortDescription: 'Hands-free 360° twin turbine cooling around your neck. Safe bladeless design won\'t tangle long hair, 3 adjustable wind speeds.',
    description: 'Beat the Bangladeshi summer heat while commuting, walking outside, cooking, or traveling on public transport. The flexible medical silicone collar rests gently around the neck with whisper-quiet brushless motors.',
    banglaDescription: 'রাস্তায় জ্যামে বা রান্নার সময় ঘামের কষ্ট থেকে মুক্তি পান। গলায় ঝুলিয়ে রাখা যায় এই ব্লেডলেস নেক ফ্যান। চুল আটকে যাওয়ার কোনো ভয় নেই। একবার চার্জে ৬ ঘন্টা পর্যন্ত ঠান্ডা বাতাস প্রদান করে।',
    features: [
      'Twin Turbine Bladeless Design (100% hair-safe)',
      '3 Air Velocity Speed Levels (Gentle, Natural, Strong Breeze)',
      'Up to 6 Hours continuous battery runtime',
      'Ergonomic skin-friendly food-grade silicone band',
      'Universal USB Type-C charging port'
    ],
    specifications: {
      'Battery Capacity': '2400mAh Dual Cells',
      'Charging Time': '2.5 Hours',
      'Working Time': '3 - 6 Hours depending on speed',
      'Weight': '220 grams Lightweight'
    },
    warranty: '7 Days Replacement Guarantee',
    colors: [
      { name: 'Arctic White', hex: '#f8fafc' },
      { name: 'Forest Green', hex: '#15803d' },
      { name: 'Sakura Pink', hex: '#f472b6' }
    ],
    tags: ['fan', 'neck fan', 'summer', 'portable cooling']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'GPE-1005',
    createdAt: '2026-09-25 13:08',
    customerName: 'Tanvir Ahmed',
    phone: '01712-345678',
    altPhone: '01911-223344',
    address: 'House 12, Road 5, Block C, Banani, Dhaka',
    cityDivision: 'Inside Dhaka',
    district: 'Dhaka',
    thanaZone: 'Banani',
    deliveryCharge: 60,
    items: [
      {
        productId: 'prod-1',
        name: 'T900 Ultra 2 Bluetooth Calling Smartwatch with 2.09" HD Display',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
        price: 1390,
        quantity: 1,
        color: 'Midnight Black + Matte Black Case'
      },
      {
        productId: 'prod-shopify-stand-881',
        name: 'Aluminum Adjustable Laptop Stand 360° Rotating Ergonomic Desk Riser',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
        price: 1950,
        quantity: 1,
        color: 'Space Gray'
      }
    ],
    subtotal: 3340,
    discount: 150,
    couponCode: 'WELCOME50',
    total: 3250,
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    status: 'pending',
    courierName: 'Steadfast Courier',
    trackingNumber: 'ST-1005-DH89',
    customerNotes: 'দয়া করে অফিস টাইমে ৩টার পর ডেলিভারি করবেন। আসার আগে কল দিবেন।',
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed on Online Store',
        description: 'Customer placed order #1005 via GPE Fast Express Checkout.',
        timestamp: '25 Sep, 01:08 PM',
        completed: true
      },
      {
        status: 'pending',
        title: 'Confirmation SMS Sent',
        description: 'Automated order receipt & tracking link sent to 01712-345678.',
        timestamp: '25 Sep, 01:09 PM',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Order Verified by Support Executive',
        description: 'Customer address and phone number confirmed via telephone call.',
        timestamp: 'Pending Verification',
        completed: false
      },
      {
        status: 'processing',
        title: 'Packed at Sorting Hub',
        description: 'Quality inspected and safely packed for dispatch.',
        timestamp: 'Pending Packing',
        completed: false
      },
      {
        status: 'shipped',
        title: 'Handed to Courier Partner',
        description: 'Consignment created with Steadfast Courier (ST-1005-DH89).',
        timestamp: 'Pending Dispatch',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Delivered & Cash Collected',
        description: '৳3,250 collected upon doorstep handover.',
        timestamp: 'Pending Delivery',
        completed: false
      }
    ]
  },
  {
    id: 'GPE-14584',
    createdAt: '2026-09-24 16:45',
    customerName: 'Niloy Rajib',
    phone: '01789-123456',
    altPhone: '01678-901234',
    address: 'Plot 18, Road 3, Sector 7, Uttara, Dhaka',
    cityDivision: 'Inside Dhaka',
    district: 'Dhaka',
    thanaZone: 'Uttara',
    deliveryCharge: 60,
    items: [
      {
        productId: 'prod-2',
        name: 'Lenovo LP40 Pro True Wireless Stereo Bluetooth Earbuds (TWS)',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        price: 890,
        quantity: 1,
        color: 'Pure White'
      },
      {
        productId: 'prod-4',
        name: 'Remax RPP-292 20000mAh 22.5W Fast Charging Power Bank',
        image: 'https://images.unsplash.com/photo-1609592424368-23f261905ea5?w=800&auto=format&fit=crop&q=80',
        price: 1850,
        quantity: 1,
        color: 'Dark Navy'
      }
    ],
    subtotal: 2740,
    discount: 100,
    couponCode: 'EXPRESS50',
    total: 2700,
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    status: 'confirmed',
    courierName: 'Steadfast Courier',
    trackingNumber: 'ST-14584-DH01',
    customerNotes: 'Please call 30 minutes before arrival.',
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed on Online Store',
        description: 'Customer placed order GPE-14584 with Cash on Delivery.',
        timestamp: '24 Sep, 04:45 PM',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Phone Verification Completed',
        description: 'Delivery address and item variant verified with customer.',
        timestamp: '24 Sep, 05:10 PM',
        completed: true
      },
      {
        status: 'processing',
        title: 'QC Checked & Barcoded',
        description: 'Passed electrical QC inspection at Dhaka Central Hub.',
        timestamp: '24 Sep, 07:30 PM',
        completed: true
      },
      {
        status: 'shipped',
        title: 'Dispatched with Steadfast Courier',
        description: 'Consignment ST-14584-DH01 in transit to Uttara Hub.',
        timestamp: '25 Sep, 09:30 AM',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Delivered & Cash Collected',
        description: 'Cash payment of ৳2,700 collected.',
        timestamp: 'Pending Delivery',
        completed: false
      }
    ]
  },
  {
    id: 'GPE-89210',
    createdAt: '2026-09-12 14:30',
    customerName: 'Tanvir Hossain',
    phone: '01712345678',
    altPhone: '01898765432',
    address: 'Flat 4B, House 24, Road 11, Dhanmondi, Dhaka',
    cityDivision: 'Inside Dhaka',
    district: 'Dhaka',
    thanaZone: 'Dhanmondi',
    deliveryCharge: 60,
    items: [
      {
        productId: 'prod-1',
        name: 'T900 Ultra 2 Bluetooth Calling Smartwatch with 2.09" HD Display',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
        price: 1390,
        quantity: 1,
        color: 'Midnight Black + Matte Black Case'
      },
      {
        productId: 'prod-2',
        name: 'Lenovo LP40 Pro True Wireless Stereo Bluetooth Earbuds (TWS)',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        price: 890,
        quantity: 1,
        color: 'Pure White'
      }
    ],
    subtotal: 2280,
    discount: 100,
    couponCode: 'EXPRESS50',
    total: 2240,
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    status: 'shipped',
    courierName: 'Steadfast Courier',
    trackingNumber: 'ST-9021482-DH',
    customerNotes: 'Please deliver after 2 PM if possible.',
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Order received via GPE Bangladesh Cash on Delivery checkout.',
        timestamp: '12 Sep, 02:30 PM',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Order Verified & Phone Confirmed',
        description: 'Customer service executive confirmed delivery address via call.',
        timestamp: '12 Sep, 03:15 PM',
        completed: true
      },
      {
        status: 'processing',
        title: 'Packed at Dhaka Central Sorting Hub',
        description: 'QC passed, safety packed with bubble wrap & assigned barcode.',
        timestamp: '12 Sep, 06:40 PM',
        completed: true
      },
      {
        status: 'shipped',
        title: 'Handed Over to Courier (Out for Delivery)',
        description: 'Rider on the way. Courier Tracking ID: ST-9021482-DH',
        timestamp: '13 Sep, 09:10 AM',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Delivered & Payment Collected',
        description: 'Package delivered to customer successfully.',
        timestamp: 'Pending Delivery',
        completed: false
      }
    ]
  },
  {
    id: 'GPE-88145',
    createdAt: '2026-09-10 11:20',
    customerName: 'Nusrat Jahan',
    phone: '01855667788',
    address: 'GEC Circle, Nasirabad, Chattogram',
    cityDivision: 'Outside Dhaka',
    district: 'Chattogram',
    thanaZone: 'Nasirabad',
    deliveryCharge: 120,
    items: [
      {
        productId: 'prod-4',
        name: 'Remax RPP-292 20000mAh 22.5W Fast Charging Power Bank',
        image: 'https://images.unsplash.com/photo-1609592424368-23f261905ea5?w=800&auto=format&fit=crop&q=80',
        price: 1850,
        quantity: 1,
        color: 'Dark Navy'
      }
    ],
    subtotal: 1850,
    discount: 0,
    total: 1970,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    trxId: 'BK9A72619Z',
    status: 'delivered',
    courierName: 'Pathao Courier',
    trackingNumber: 'PTH-CTG-66291',
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Order placed with online bKash payment.',
        timestamp: '10 Sep, 11:20 AM',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'bKash TrxId Verified',
        description: 'Payment of ৳1,970 verified via bKash Merchant Gateway.',
        timestamp: '10 Sep, 11:45 AM',
        completed: true
      },
      {
        status: 'processing',
        title: 'Dispatched to Chattogram Hub',
        description: 'Processed at main warehouse and shipped via highway line-haul.',
        timestamp: '10 Sep, 05:00 PM',
        completed: true
      },
      {
        status: 'shipped',
        title: 'Arrived at Nasirabad Delivery Station',
        description: 'Pathao delivery hero assigned.',
        timestamp: '11 Sep, 10:30 AM',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Delivered Successfully',
        description: 'Customer received package and signed confirmation.',
        timestamp: '11 Sep, 04:15 PM',
        completed: true
      }
    ]
  }
];

export const VALID_COUPONS: Coupon[] = [
  {
    code: 'BANGLA10',
    title: '10% off for Smart Gadgets and Accessories',
    discountType: 'percentage',
    amount: 10,
    minSpend: 1000,
    description: '10% instant discount on orders above ৳1,000',
    expiryDate: '2026-12-31',
    status: 'active',
    usageCount: 89
  },
  {
    code: 'EXPRESS50',
    title: '৳50 flat discount for first order',
    discountType: 'fixed',
    amount: 50,
    minSpend: 800,
    description: 'Flat ৳50 discount on your order',
    expiryDate: '2026-12-31',
    status: 'active',
    usageCount: 142
  },
  {
    code: 'EID20',
    title: '20% off Mega Festival Voucher',
    discountType: 'percentage',
    amount: 20,
    minSpend: 1500,
    description: '20% special discount on orders above ৳1,500',
    expiryDate: '2026-06-30',
    status: 'active',
    usageCount: 57
  },
  {
    code: 'FREESHIP',
    title: '৳60 delivery subsidy on orders above ৳2,000',
    discountType: 'fixed',
    amount: 60,
    minSpend: 2000,
    description: '৳60 off on delivery fee for orders above ৳2,000',
    expiryDate: '2026-06-30',
    status: 'active',
    usageCount: 64
  }
];

export const CUSTOMER_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Rafiqul Islam (মিরপুর, ঢাকা)',
    rating: 5,
    date: '2 দিন আগে',
    verified: true,
    location: 'Mirpur, Dhaka',
    comment: 'আলহামদুলিল্লাহ ঘড়িটা হাতে পেয়ে খুব ভালো লাগল। ডিসপ্লে অনেক স্মুথ এবং সাউন্ড কোয়ালিটি বেশ ক্লিয়ার। ২৪ ঘণ্টার মধ্যেই ডেলিভারি পেয়েছি। ক্যাশ অন ডেলিভারিতে চেক করে নেওয়ার সুযোগ ছিল।'
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    userName: 'Shakil Ahmed (সিলেট)',
    rating: 5,
    date: '৪ দিন আগে',
    verified: true,
    location: 'Sylhet Sadar',
    comment: 'Lenovo LP40 Pro একদম জেনুইন প্রোডাক্ট। বাস যথেষ্ট ভালো এবং চার্জ প্রায় ৫ ঘন্টা থাকছে। বাবল র‍্যাপ দিয়ে খুব সুন্দর প্যাকেজিং ছিল। GPE Bangladesh এর সার্ভিস সত্যি প্রশংসনীয়।'
  },
  {
    id: 'rev-3',
    productId: 'prod-5',
    userName: 'Kazi Mahbub (উত্তরা, ঢাকা)',
    rating: 5,
    date: '১ সপ্তাহ আগে',
    verified: true,
    location: 'Uttara, Dhaka',
    comment: 'Vintage T9 ট্রিমারটা মেটাল বডির হওয়ায় হাতে ধরে বেশ প্রিমিয়াম ফিল হয়। কাটিং স্পিড দারুণ। দাম হিসেবে অসাধারণ ভ্যালু ফর মানি।'
  },
  {
    id: 'rev-4',
    productId: 'prod-6',
    userName: 'Farhan Kabir (চট্টগ্রাম)',
    rating: 4,
    date: '২ সপ্তাহ আগে',
    verified: true,
    location: 'Chattogram',
    comment: 'NY cap color and fitting is 10/10. Fabric quality is pure cotton, fits comfortably. Will definitely order again.'
  }
];

export const FAQ_LIST = [
  {
    question: 'কিভাবে অর্ডার করব? (How to place an order?)',
    answer: 'পণ্যটি পছন্দ হলে "অর্ডার করুন" বা "Buy Now" বাটনে ক্লিক করুন। আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা লিখে "অর্ডার কনফার্ম করুন" এ চাপ দিন। কোনো অগ্রিম পেমেন্ট ছাড়াই ক্যাশ অন ডেলিভারিতে অর্ডার কনফার্ম হয়ে যাবে।'
  },
  {
    question: 'ডেলিভারি চার্জ কত এবং কত দিনে পাব?',
    answer: 'ঢাকা সিটির ভেতরে ডেলিভারি চার্জ মাত্র ৬০ টাকা এবং ২৪ থেকে ৪৮ ঘণ্টার মধ্যে পৌঁছে যায়। ঢাকা সিটির বাইরে সারাদেশে ডেলিভারি চার্জ ১২০ টাকা এবং ২ থেকে ৩ দিনের মধ্যে আপনার নিকটবর্তী কুরিয়ার বা হোম ডেলিভারির মাধ্যমে পণ্য পাবেন।'
  },
  {
    question: 'পণ্য হাতে পেয়ে টাকা দেওয়ার সুযোগ আছে কি?',
    answer: 'হ্যাঁ! ১০০% ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা রয়েছে। পণ্য হাতে পেয়ে রাইডারের সামনে দেখে নিশ্চিত হয়ে টাকা পরিশোধ করতে পারবেন।'
  },
  {
    question: 'পণ্য কোনো ত্রুটি থাকলে কি রিটার্ন বা এক্সচেঞ্জ করা যাবে?',
    answer: 'অবশ্যই। ডেলিভারির পর পণ্যে কোনো সমস্যা থাকলে ৭ দিনের মধ্যে আমাদের হটলাইন (09678-123456) অথবা WhatsApp এ যোগাযোগ করলে আমরা কোনো অতিরিক্ত চার্জ ছাড়াই প্রোডাক্ট পরিবর্তন করে দেব।'
  }
];
