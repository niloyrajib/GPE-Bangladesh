import { VendorPaymentConfig, Product } from '../types';

export const VENDOR_PAYMENT_RULES_STORAGE_KEY = 'banglaxpress_vendor_payment_rules';
export const VENDOR_PAYMENT_RULES_EVENT = 'vendor_payment_rules_updated';

export const DEFAULT_VENDOR_PAYMENT_RULES: VendorPaymentConfig[] = [
  {
    vendor: 'Default',
    allowedPaymentMethods: ['cod', 'bkash', 'nagad', 'custom'],
    defaultPaymentMethod: 'cod',
    requireAdvancePayment: false,
    advanceAmount: 0,
    checkoutNote: 'অরিজিনাল সকল প্রোডাক্ট ডেলিভারির সময় চেক করে দেখে মূল্য পরিশোধ করুন।',
    badgeText: 'Standard Store Policy',
    isActive: true
  },
  {
    vendor: 'Merrono',
    allowedPaymentMethods: ['cod', 'bkash', 'nagad'],
    defaultPaymentMethod: 'cod',
    requireAdvancePayment: false,
    advanceAmount: 0,
    checkoutNote: 'অরিজিনাল সকল প্রোডাক্ট ডেলিভারির সময় চেক করে দেখে মূল্য পরিশোধ করুন।',
    badgeText: 'Merrono Certified',
    isActive: true
  },
  {
    vendor: 'Baseus',
    allowedPaymentMethods: ['cod', 'bkash', 'nagad', 'custom'],
    defaultPaymentMethod: 'cod',
    requireAdvancePayment: false,
    advanceAmount: 0,
    customBkashNumber: '01700-123456 (Baseus Official)',
    checkoutNote: 'অরিজিনাল সকল প্রোডাক্ট ডেলিভারির সময় চেক করে দেখে মূল্য পরিশোধ করুন।',
    badgeText: 'Baseus Official',
    isActive: true
  },
  {
    vendor: 'Ultra Series',
    allowedPaymentMethods: ['cod', 'bkash', 'nagad'],
    defaultPaymentMethod: 'cod',
    requireAdvancePayment: false,
    advanceAmount: 0,
    checkoutNote: 'অরিজিনাল সকল প্রোডাক্ট ডেলিভারির সময় চেক করে দেখে মূল্য পরিশোধ করুন।',
    badgeText: 'Verified Watch Vendor',
    isActive: true
  },
  {
    vendor: 'Remax',
    allowedPaymentMethods: ['cod', 'bkash', 'nagad'],
    defaultPaymentMethod: 'cod',
    requireAdvancePayment: false,
    advanceAmount: 0,
    checkoutNote: 'অরিজিনাল সকল প্রোডাক্ট ডেলিভারির সময় চেক করে দেখে মূল্য পরিশোধ করুন।',
    badgeText: 'Remax Official',
    isActive: true
  },
  {
    vendor: 'GPE Bangladesh',
    allowedPaymentMethods: ['cod', 'bkash', 'nagad', 'custom'],
    defaultPaymentMethod: 'cod',
    requireAdvancePayment: false,
    advanceAmount: 0,
    checkoutNote: 'অরিজিনাল সকল প্রোডাক্ট ডেলিভারির সময় চেক করে দেখে মূল্য পরিশোধ করুন।',
    badgeText: 'In-House Direct',
    isActive: true
  }
];

export function getVendorPaymentConfigs(): VendorPaymentConfig[] {
  try {
    const raw = localStorage.getItem(VENDOR_PAYMENT_RULES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VENDOR_PAYMENT_RULES_STORAGE_KEY, JSON.stringify(DEFAULT_VENDOR_PAYMENT_RULES));
      return DEFAULT_VENDOR_PAYMENT_RULES;
    }
    const parsed: VendorPaymentConfig[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(VENDOR_PAYMENT_RULES_STORAGE_KEY, JSON.stringify(DEFAULT_VENDOR_PAYMENT_RULES));
      return DEFAULT_VENDOR_PAYMENT_RULES;
    }
    return parsed;
  } catch (err) {
    console.error('Error loading vendor payment configs:', err);
    return DEFAULT_VENDOR_PAYMENT_RULES;
  }
}

export function saveVendorPaymentConfigs(configs: VendorPaymentConfig[]): void {
  try {
    localStorage.setItem(VENDOR_PAYMENT_RULES_STORAGE_KEY, JSON.stringify(configs));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(VENDOR_PAYMENT_RULES_EVENT, { detail: configs }));
    }
  } catch (err) {
    console.error('Error saving vendor payment configs:', err);
  }
}

export function upsertVendorPaymentConfig(config: VendorPaymentConfig): void {
  const current = getVendorPaymentConfigs();
  const existingIdx = current.findIndex(
    (c) => c.vendor.trim().toLowerCase() === config.vendor.trim().toLowerCase()
  );

  let updated: VendorPaymentConfig[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...updated[existingIdx], ...config };
  } else {
    updated = [...current, config];
  }

  saveVendorPaymentConfigs(updated);
}

export function deleteVendorPaymentConfig(vendorName: string): void {
  if (vendorName.toLowerCase() === 'default') return; // Cannot delete default
  const current = getVendorPaymentConfigs();
  const updated = current.filter(
    (c) => c.vendor.trim().toLowerCase() !== vendorName.trim().toLowerCase()
  );
  saveVendorPaymentConfigs(updated);
}

export function getPaymentConfigForVendor(
  vendorName?: string,
  productOverride?: {
    allowedPaymentMethods?: string[];
    vendorPaymentNote?: string;
    requireAdvancePayment?: boolean;
    advanceAmount?: number;
  }
): VendorPaymentConfig {
  const configs = getVendorPaymentConfigs();
  const targetVendor = (vendorName || '').trim();

  // 1. If product explicitly specifies its own payment methods overrides
  if (productOverride?.allowedPaymentMethods && productOverride.allowedPaymentMethods.length > 0) {
    return {
      vendor: targetVendor || 'Product Override',
      allowedPaymentMethods: productOverride.allowedPaymentMethods,
      defaultPaymentMethod: productOverride.allowedPaymentMethods[0] || 'cod',
      requireAdvancePayment: productOverride.requireAdvancePayment,
      advanceAmount: productOverride.advanceAmount,
      checkoutNote: productOverride.vendorPaymentNote,
      isActive: true
    };
  }

  // 2. Find matching vendor config
  if (targetVendor) {
    const matched = configs.find(
      (c) => c.isActive && c.vendor.trim().toLowerCase() === targetVendor.toLowerCase()
    );
    if (matched) return matched;
  }

  // 3. Fallback to 'Default' vendor config
  const defaultRule = configs.find(
    (c) => c.vendor.trim().toLowerCase() === 'default'
  );
  if (defaultRule) return defaultRule;

  // 4. Absolute fallback
  return DEFAULT_VENDOR_PAYMENT_RULES[0];
}

export function extractAllVendors(products: Product[]): string[] {
  const set = new Set<string>();
  set.add('GPE Bangladesh');
  set.add('Merrono');
  set.add('Baseus');
  set.add('Remax');
  set.add('Ultra Series');
  set.add('Lenovo');
  set.add('Vintage');

  products.forEach((p) => {
    if (p.vendor?.trim()) set.add(p.vendor.trim());
    if (p.brand?.trim()) set.add(p.brand.trim());
  });

  // Custom vendors added in admin
  try {
    const saved = localStorage.getItem('banglaxpress_custom_vendors');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        parsed.forEach((v: string) => {
          if (v?.trim()) set.add(v.trim());
        });
      }
    }
  } catch (e) {}

  return Array.from(set);
}
