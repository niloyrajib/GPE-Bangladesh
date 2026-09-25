export interface Product {
  id: string;
  name: string;
  banglaName?: string;
  slug: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  images: string[];
  inStock: boolean;
  stockCount: number;
  soldCount: number;
  isFlashDeal?: boolean;
  flashDealEnd?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  badge?: string;
  brand: string;
  sku: string;
  shortDescription: string;
  description: string;
  banglaDescription?: string;
  features: string[];
  specifications: Record<string, string>;
  warranty: string;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  tags: string[];

  // Full Shopify Admin Product Fields (1:1 with Shopify PDF specifications)
  status?: 'active' | 'draft' | 'archived';
  publishing?: string[];
  productType?: string;
  vendor?: string;
  allowedPaymentMethods?: string[];
  vendorPaymentNote?: string;
  requireAdvancePayment?: boolean;
  advanceAmount?: number;
  dropship?: DropshipSourceInfo;
  collections?: string[];
  themeTemplate?: string;
  costPerItem?: number;
  chargeTax?: boolean;
  inventoryTracked?: boolean;
  continueSellingWhenOutOfStock?: boolean;
  barcode?: string;
  isPhysicalProduct?: boolean;
  packageType?: string;
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  countryOfOrigin?: string;
  hsCode?: string;
  categoryMetafields?: {
    color?: string[];
    material?: string;
    anglesSupported?: string;
    compatibleDevice?: string[];
    features?: string[];
    powerSource?: string;
    connectorGender?: string;
    wirelessChargingStandard?: string;
    vesaMountingPattern?: string;
    [key: string]: any;
  };
  productMetafields?: {
    specification?: string;
    warranty?: string;
    disclosures?: string;
    [key: string]: any;
  };
  variantMetafields?: {
    googleAgeGroup?: string;
    googleCondition?: string;
    googleGender?: string;
    googleMpn?: string;
    [key: string]: any;
  };
  seo?: {
    title?: string;
    description?: string;
    handle?: string;
  };
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | string;

export interface CustomPaymentGateway {
  id: string;
  name: string;
  category: 'mfs' | 'card' | 'net_banking' | 'international' | 'custom';
  provider: string;
  description?: string;
  enabled: boolean;
  mode: 'sandbox' | 'live';
  iconBg: string;
  iconText: string;
  merchantId: string;
  apiKey: string;
  apiSecret?: string;
  endpointUrl: string;
  webhookUrl: string;
  currency: string;
  checkoutInstructions?: string;
  testStatus?: string;
  createdAt: string;
}

export interface VendorPaymentConfig {
  vendor: string; // e.g. "Merrono", "Baseus", "GPE Bangladesh", "Default"
  allowedPaymentMethods: ('cod' | 'bkash' | 'nagad' | 'custom' | string)[];
  defaultPaymentMethod?: string; // 'cod' | 'bkash' | 'nagad'
  requireAdvancePayment?: boolean;
  advanceAmount?: number; // e.g. 100 or 150 BDT
  customBkashNumber?: string;
  customNagadNumber?: string;
  checkoutNote?: string;
  advanceNote?: string;
  badgeText?: string;
  isActive: boolean;
}

export type DropshipPlatform = 'aliexpress' | '1688' | 'alibaba' | 'cjdropshipping' | 'taobao';

export interface DropshipSourceInfo {
  platform: DropshipPlatform;
  sourceUrl: string;
  sourceId?: string;
  supplierName?: string;
  sourceCurrency: 'USD' | 'CNY';
  sourcePrice: number;
  originalPrice?: number;
  shippingCost?: number;
  shippingDays?: string;
  supplierRating?: number | string;
  ordersCount?: number | string;
  importedAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string; // e.g. BX-89312
  createdAt: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  address: string;
  cityDivision: string; // 'Inside Dhaka' | 'Outside Dhaka'
  district: string;
  thanaZone?: string;
  deliveryCharge: number;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid' | 'partial';
  trxId?: string;
  status: OrderStatus;
  courierName?: string;
  trackingNumber?: string;
  timeline: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
  customerNotes?: string;
  vendor?: string;
}

export interface Category {
  id: string;
  name: string;
  banglaName: string;
  slug: string;
  iconName: string;
  image: string;
  itemCount: number;
  subcategories?: string[];
  link?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  verified: boolean;
  location: string;
  comment: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  amount: number;
  minSpend: number;
  description: string;
  title?: string;
  expiryDate?: string;
  status?: 'active' | 'scheduled' | 'expired';
  usageLimit?: number;
  usageCount?: number;
  createdAt?: string;
}

export interface StoreNotice {
  id: string;
  text: string;
  linkText?: string;
  linkUrl?: string;
}

// ----------------------------------------------------
// SHOPIFY NO-CODE VISUAL THEME CUSTOMIZER INTERFACES
// ----------------------------------------------------
export interface HeroSlideConfig {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  priceText: string;
  regularPrice: string;
  discount: string;
  category: string;
  image: string;
  bgGradient: string;
  buttonText?: string;
}

export interface TrustBadgeConfig {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'truck' | 'shield' | 'refresh' | 'phone' | 'zap' | 'check';
}

export interface ThemeConfig {
  themeName: string;
  lastSaved?: string;
  
  // Announcement Bar
  announcementBar: {
    enabled: boolean;
    text: string;
    phoneText: string;
    phone: string;
    whatsappText: string;
    whatsapp: string;
    bgColor: string;
    textColor: string;
  };

  // Header / Branding
  header: {
    storeName: string;
    storeTagline: string;
    logoUrl?: string;
    sticky: boolean;
  };

  // Hero Section
  hero: {
    enabled: boolean;
    autoplay: boolean;
    autoplaySpeed: number; // in seconds
    slides: HeroSlideConfig[];
  };

  // Trust Badges
  trustBadges: {
    enabled: boolean;
    badges: TrustBadgeConfig[];
  };

  // Flash Deals
  flashDeals: {
    enabled: boolean;
    title: string;
    badgeText: string;
    dealHours: number;
  };

  // Categories Grid
  categoriesSection: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items?: Category[];
  };

  // Main Catalog
  catalogSection: {
    title: string;
    subtitle: string;
    columns: 2 | 3 | 4;
  };

  // Promo Banner / Callout
  promoBanner: {
    enabled: boolean;
    badge: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    bgGradient: string;
  };

  // Reviews & FAQ
  reviewsSection: {
    enabled: boolean;
    title: string;
    subtitle: string;
  };

  // Footer
  footer: {
    aboutText: string;
    helpline: string;
    whatsapp?: string;
    email: string;
    address: string;
    copyrightText: string;
    // Column 1 Brand Logo & Slogan
    brandName?: string;
    brandSuffix?: string;
    // Column 2: Popular Categories Title & Items
    categoriesTitle?: string;
    categoriesList?: Array<{ label: string; categoryName: string }>;
    // Column 3: Customer Care Title & Items
    customerCareTitle?: string;
    customerCareItems?: Array<{ label: string; iconType: 'truck' | 'refresh' | 'shield' | 'clock' | 'link' | 'phone'; actionType?: 'track' | 'admin' | 'none'; url?: string }>;
    // Column 4: Payment Methods Title & Badges
    paymentTitle?: string;
    paymentMethods?: Array<{ name: string; colorScheme: string }>;
    // Couriers / Delivery Partners
    courierTitle?: string;
    couriersList?: string[];
    // Bottom Legal Links
    legalLinks?: Array<{ label: string; url?: string }>;
  };

  // Global Theme Styles
  styling: {
    primaryColor: string; // e.g. '#e11d48'
    accentColor: string;
    borderRadius: 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
  };

  // Dynamic CMS Block / Section Builder Order (FilamentPHP / Statamic inspired)
  sectionsOrder?: DynamicSectionItem[];

  // SEO & Social OpenGraph Meta Tags Configuration
  seo?: SEOConfig;
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  author?: string;
  canonicalUrl?: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: 'website' | 'article' | 'product';
  twitterCard: 'summary' | 'summary_large_image';
  twitterCreator?: string;
  enableStructuredData?: boolean;
  structuredDataType?: 'OnlineStore' | 'Store' | 'Organization';
  customHeadCode?: string;
  lastUpdated?: string;
}

export type DynamicSectionType =
  | 'hero'
  | 'trustBadges'
  | 'flashDeals'
  | 'categoriesSection'
  | 'catalogSection'
  | 'promoBanner'
  | 'reviewsSection'
  | 'featureGrid'
  | 'faqAccordion'
  | 'videoBanner'
  | 'newsletter';

export interface DynamicSectionItem {
  id: string;
  type: DynamicSectionType;
  title: string;
  enabled: boolean;
  customData?: {
    badge?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    image?: string;
    videoUrl?: string;
    videoTitle?: string;
    bgGradient?: string;
    bgColor?: string;
    textColor?: string;
    features?: Array<{
      id: string;
      title: string;
      desc: string;
      icon: string;
    }>;
    faqs?: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
    [key: string]: any;
  };
}

export interface AbandonedCartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface AbandonedCart {
  id: string; // e.g. AB-10023
  email: string;
  customerName?: string;
  phone?: string;
  cityDivision?: string;
  items: AbandonedCartItem[];
  subtotal: number;
  createdAt: string;
  lastActiveAt: string;
  recoveryStatus: 'unrecovered' | 'email_sent' | 'recovered';
  emailSentAt?: string;
  recoveryEmailCount?: number;
  recoveryCouponCode?: string;
  recoveryDiscountPercent?: number;
}

