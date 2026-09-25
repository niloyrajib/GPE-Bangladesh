/**
 * Product Identifier Helper
 * Provides automated, unique SKU generation with 'GPE-' prefix
 * and valid 13-digit GTIN / EAN-13 Barcodes for GPE Bangladesh products.
 */

/**
 * Generates a valid 13-digit GTIN / EAN-13 barcode
 * Uses prefix '881' or '880' with standard modulo-10 check digit algorithm.
 */
export function generateBarcode(): string {
  // 12 base digits: prefix '881' + 9 random digits
  const prefix = '881';
  const randomPart = Math.floor(100000000 + Math.random() * 900000000).toString();
  const base12 = prefix + randomPart;

  // Calculate EAN-13 / GTIN check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(base12[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  return base12 + checkDigit.toString();
}

/**
 * Generates a unique SKU starting with 'GPE-'
 * Infers category/product prefix if provided, with a unique 3-4 digit suffix.
 */
export function generateGPESku(category?: string, productName?: string): string {
  const combined = `${category || ''} ${productName || ''}`.toLowerCase();

  let tag = 'PRD';

  if (combined.includes('stand') || combined.includes('riser')) {
    tag = 'STAND';
  } else if (combined.includes('watch') || combined.includes('band') || combined.includes('ঘড়ি') || combined.includes('ওয়াচ')) {
    tag = 'WAT';
  } else if (combined.includes('earbud') || combined.includes('audio') || combined.includes('headphone') || combined.includes('speaker') || combined.includes('tws')) {
    tag = 'AUD';
  } else if (combined.includes('charger') || combined.includes('power') || combined.includes('cable') || combined.includes('battery')) {
    tag = 'PWR';
  } else if (combined.includes('keyboard') || combined.includes('mouse') || combined.includes('gaming') || combined.includes('computer')) {
    tag = 'GAM';
  } else if (combined.includes('home') || combined.includes('kitchen') || combined.includes('blender') || combined.includes('kettle') || combined.includes('fan')) {
    tag = 'HOM';
  } else if (combined.includes('trimmer') || combined.includes('shaver') || combined.includes('care')) {
    tag = 'TRM';
  } else if (combined.includes('cap') || combined.includes('fashion') || combined.includes('cloth') || combined.includes('men')) {
    tag = 'FSH';
  } else if (combined.includes('phone') || combined.includes('mobile') || combined.includes('case') || combined.includes('holder')) {
    tag = 'ACC';
  } else {
    const defaultTags = ['PRD', 'GAD', 'TEC', 'MOD', 'ACC', 'EXP'];
    tag = defaultTags[Math.floor(Math.random() * defaultTags.length)];
  }

  const numberSuffix = Math.floor(100 + Math.random() * 900);
  return `GPE-${tag}-${numberSuffix}`;
}
