import { SEOConfig } from '../types';

export function applySEOMetaTags(seo: SEOConfig | undefined, fallbackStoreName = 'GPE Bangladesh') {
  if (typeof document === 'undefined') return;

  const title = seo?.metaTitle?.trim() || `${fallbackStoreName} - E-Commerce Store`;
  const description =
    seo?.metaDescription?.trim() ||
    'A modern Bangladeshi e-commerce platform with Shopify-style admin dashboard, 1-click fast checkout, bKash & Nagad payments, and inventory management.';
  const ogTitle = seo?.ogTitle?.trim() || title;
  const ogDesc = seo?.ogDescription?.trim() || description;
  const ogImg =
    seo?.ogImage?.trim() ||
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80';
  const ogType = seo?.ogType || 'website';
  const twitterCard = seo?.twitterCard || 'summary_large_image';
  const twitterCreator = seo?.twitterCreator || '';
  const canonicalUrl = seo?.canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const keywords = seo?.metaKeywords || '';
  const author = seo?.author || fallbackStoreName;

  // 1. Update Document Title
  document.title = title;

  // Helper to get or create meta tag
  const setMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
    let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Standard Meta Tags
  setMetaTag('name', 'description', description);
  if (keywords) setMetaTag('name', 'keywords', keywords);
  if (author) setMetaTag('name', 'author', author);

  // 3. OpenGraph Tags
  setMetaTag('property', 'og:title', ogTitle);
  setMetaTag('property', 'og:description', ogDesc);
  setMetaTag('property', 'og:type', ogType);
  setMetaTag('property', 'og:image', ogImg);
  setMetaTag('property', 'og:site_name', fallbackStoreName);
  if (canonicalUrl) {
    setMetaTag('property', 'og:url', canonicalUrl);
  }

  // 4. Twitter Card Tags
  setMetaTag('name', 'twitter:card', twitterCard);
  setMetaTag('name', 'twitter:title', ogTitle);
  setMetaTag('name', 'twitter:description', ogDesc);
  setMetaTag('name', 'twitter:image', ogImg);
  if (twitterCreator) {
    setMetaTag('name', 'twitter:creator', twitterCreator);
    setMetaTag('name', 'twitter:site', twitterCreator);
  }

  // 5. Canonical Link tag
  if (canonicalUrl) {
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);
  }

  // 6. Schema.org JSON-LD Structured Data
  if (seo?.enableStructuredData !== false) {
    const scriptId = 'bx-schema-org-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const jsonLdData = {
      '@context': 'https://schema.org',
      '@type': seo?.structuredDataType || 'OnlineStore',
      name: fallbackStoreName,
      url: canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : ''),
      description: description,
      image: ogImg,
      telephone: '+8801800000000',
      priceRange: '৳৳',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dhaka',
        addressCountry: 'BD'
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${canonicalUrl || ''}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };

    scriptTag.textContent = JSON.stringify(jsonLdData, null, 2);
  }
}
