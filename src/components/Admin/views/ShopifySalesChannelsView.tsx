import React, { useState } from 'react';
import {
  Store,
  Bot,
  CreditCard,
  Share2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Printer,
  Plus,
  Trash2,
  Phone,
  Search
} from 'lucide-react';
import { Product } from '../../../types';

interface ShopifySalesChannelsViewProps {
  channelType: 'online_store' | 'agentic' | 'pos' | 'facebook';
  products: Product[];
  onOpenStorefront?: () => void;
  onOpenThemeCustomizer?: () => void;
  onOpenFooterEditor?: () => void;
  onOpenSEOGenerator?: () => void;
}

export const ShopifySalesChannelsView: React.FC<ShopifySalesChannelsViewProps> = ({
  channelType,
  products,
  onOpenStorefront,
  onOpenThemeCustomizer,
  onOpenFooterEditor,
  onOpenSEOGenerator
}) => {
  // POS local state
  const [posCart, setPosCart] = useState<{ product: Product; qty: number }[]>([]);
  const [posCustomerPhone, setPosCustomerPhone] = useState('');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'cash' | 'bkash'>('cash');
  const [posSearch, setPosSearch] = useState('');

  const addToPosCart = (p: Product) => {
    const existing = posCart.find((i) => i.product.id === p.id);
    if (existing) {
      setPosCart(posCart.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setPosCart([...posCart, { product: p, qty: 1 }]);
    }
  };

  const posTotal = posCart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  // VIEW 1: ONLINE STORE
  if (channelType === 'online_store') {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">Online Store</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live & Published
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Theme: <span className="font-semibold text-gray-800">GPE Bangladesh Aurora Modern v2.4</span> • Fast 1-page checkout
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenStorefront}
            className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View your store</span>
          </button>
        </div>

        {/* Current Theme Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-full sm:w-64 h-40 bg-slate-900 rounded-lg overflow-hidden border border-gray-200 relative group shrink-0">
              <div className="p-3 text-white space-y-1">
                <span className="text-[10px] font-bold text-rose-500 uppercase">Storefront Preview</span>
                <p className="text-xs font-bold truncate">GPE Bangladesh Official Store</p>
                <div className="h-16 bg-slate-800 rounded mt-2 flex items-center justify-center text-[10px] text-gray-400">
                  Responsive Web & Mobile Layout
                </div>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">GPE Bangladesh Aurora Modern</h3>
                  <p className="text-xs text-gray-500">Last saved: 12 minutes ago</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Current theme
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed pt-1">
                Optimized for high-speed conversions in Bangladesh with direct bKash, Nagad, and Cash on Delivery order forms, sticky call-to-action buttons, and flash sales timer.
              </p>

              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <button
                  type="button"
                  onClick={onOpenThemeCustomizer || onOpenStorefront}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Customize theme (ভিজ্যুয়াল এডিটর)</span>
                </button>
                {onOpenFooterEditor && (
                  <button
                    type="button"
                    onClick={onOpenFooterEditor}
                    className="px-3.5 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                  >
                    <span>ফুটার কাস্টমাইজ করুন (Footer Editor)</span>
                  </button>
                )}
                {onOpenSEOGenerator && (
                  <button
                    type="button"
                    onClick={onOpenSEOGenerator}
                    className="px-3.5 py-2 bg-rose-50 border border-rose-300 text-rose-800 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Meta Tag & SEO Generator</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenStorefront}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  <span>View live store</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: AGENTIC (AI COPILOT & SALES BOT)
  if (channelType === 'agentic') {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">Agentic Sales & AI Autopilot</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                Gemini AI Powered
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Autonomous AI sales agent that automatically replies to shoppers, confirms phone numbers, and handles support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900">Automated Order Verification Agent</h3>
                <p className="text-[11px] text-gray-500">Autonomous WhatsApp & SMS confirmation</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              When an order is placed via Cash on Delivery, the agent automatically sends a verification prompt with address confirmation to eliminate fake orders and returns.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Enabled (98.2% Accuracy)
              </span>
              <button
                type="button"
                onClick={() => alert('Agent settings updated.')}
                className="text-xs font-semibold text-gray-700 hover:text-gray-900"
              >
                Configure prompt →
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900">Smart Product Recommendation Copilot</h3>
                <p className="text-[11px] text-gray-500">Upsells accessories & bundles</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Analyzes shopper browsing history and suggests matching accessories (e.g. suggests Fast Charger when buying Smart Watch).
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
              </span>
              <button
                type="button"
                onClick={() => alert('Copilot rules opened.')}
                className="text-xs font-semibold text-gray-700 hover:text-gray-900"
              >
                View Rules →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 3: POINT OF SALE (POS TERMINAL)
  if (channelType === 'pos') {
    return (
      <div className="space-y-4 max-w-6xl mx-auto">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Point of Sale (In-Store Billing)</h1>
            <p className="text-xs text-gray-500">Shop location: GPE Bangladesh Flagship Store, Dhaka</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            Terminal 01 Connected
          </span>
        </div>

        {/* POS Grid: Products on Left, Register on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Products Selector */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="relative">
              <input
                type="text"
                value={posSearch}
                onChange={(e) => setPosSearch(e.target.value)}
                placeholder="Scan barcode or search products..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-gray-900"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
              {products
                .filter((p) => p.name.toLowerCase().includes(posSearch.toLowerCase()) || p.sku.toLowerCase().includes(posSearch.toLowerCase()))
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addToPosCart(p)}
                    className="p-2.5 rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-gray-50/50 text-left transition-all flex flex-col justify-between h-28"
                  >
                    <div>
                      <p className="font-bold text-gray-900 text-xs truncate">{p.name}</p>
                      <span className="text-[10px] text-gray-400 font-mono">{p.sku}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono font-bold text-xs text-gray-900">৳{p.price}</span>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        +{p.stockCount}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* POS Cart & Checkout */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-gray-900">Current Sale ({posCart.length} items)</span>
                {posCart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPosCart([])}
                    className="text-[11px] text-rose-600 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                {posCart.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Select products to add to cart</p>
                ) : (
                  posCart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between py-1 border-b border-gray-50">
                      <div className="truncate pr-2">
                        <p className="font-bold text-gray-800 truncate">{item.product.name}</p>
                        <span className="text-[10px] text-gray-400">৳{item.product.price} × {item.qty}</span>
                      </div>
                      <span className="font-mono font-bold text-gray-900 shrink-0">
                        ৳{item.product.price * item.qty}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Customer Phone (Optional)</label>
                <input
                  type="text"
                  value={posCustomerPhone}
                  onChange={(e) => setPosCustomerPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('cash')}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      posPaymentMethod === 'cash' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('bkash')}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      posPaymentMethod === 'bkash' ? 'bg-[#D12053] text-white border-[#D12053]' : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    bKash POS
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 font-medium">Total Amount:</span>
                <span className="text-lg font-bold font-mono text-gray-900">৳{posTotal.toLocaleString()}</span>
              </div>

              <button
                type="button"
                disabled={posCart.length === 0}
                onClick={() => {
                  alert(`Receipt Printed! Sale of ৳${posTotal} completed via ${posPaymentMethod.toUpperCase()}.`);
                  setPosCart([]);
                  setPosCustomerPhone('');
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Complete Sale & Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 4: FACEBOOK & INSTAGRAM
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">Facebook & Instagram Social Commerce</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Synced
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Sync your catalog with Meta Commerce Manager, tag products in posts, and track ads with Meta Pixel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Catalog synced with Meta Commerce Manager!')}
          className="px-3.5 py-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Sync Catalog Now</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Product Catalog Sync</h3>
          <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
            <span className="text-gray-600">Active Products Synced</span>
            <span className="font-mono font-bold text-gray-900">{products.length} Products</span>
          </div>
          <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
            <span className="text-gray-600">Last Successful Sync</span>
            <span className="text-gray-700">10 minutes ago</span>
          </div>
          <div className="flex items-center justify-between text-xs py-2">
            <span className="text-gray-600">Sync Status</span>
            <span className="text-emerald-600 font-bold">100% Approved</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Connected Accounts</h3>
          <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
            <span className="text-gray-600">Facebook Page</span>
            <span className="font-semibold text-blue-600">GPE Bangladesh Official</span>
          </div>
          <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
            <span className="text-gray-600">Instagram Business</span>
            <span className="font-semibold text-pink-600">@gpebangladesh.bd</span>
          </div>
          <div className="flex items-center justify-between text-xs py-2">
            <span className="text-gray-600">WhatsApp Business</span>
            <span className="font-semibold text-emerald-600">+880 1800-000000</span>
          </div>
        </div>
      </div>
    </div>
  );
};
