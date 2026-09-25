import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  Clock,
  TrendingUp,
  Package,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users,
  Eye,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Order, Product } from '../../../types';
import { ShopifyNavTab } from '../ShopifySidebar';

interface ShopifyHomeViewProps {
  orders: Order[];
  products: Product[];
  onNavigate: (tab: ShopifyNavTab) => void;
  onOpenNewProduct: () => void;
}

export const ShopifyHomeView: React.FC<ShopifyHomeViewProps> = ({
  orders,
  products,
  onNavigate,
  onOpenNewProduct
}) => {
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const lowStockProducts = products.filter((p) => p.stockCount < 10);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Good day, GPE Bangladesh
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Store Active
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Here is your live store overview and fulfillment checklist for today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewProduct}
            className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Add product</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition-colors"
          >
            Manage orders
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">Total Sales</span>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-gray-900">
            ৳{totalRevenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.2% from last week</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-gray-900">
            {orders.length}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            {deliveredOrders.length} delivered successfully
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">To Fulfill</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-amber-600">
            {pendingOrders.length}
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            Needs verification & packing
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-medium">Store Visitors Today</span>
            <Eye className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-gray-900">
            1,248
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            3.4% conversion rate
          </p>
        </div>
      </div>

      {/* Orders To Fulfill Action Banner */}
      {pendingOrders.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-950">
                You have {pendingOrders.length} unfulfilled orders waiting for courier
              </h3>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Dispatch via Steadfast Courier or Pathao to maintain fast delivery badge.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            <span>Fulfill orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Grid: Setup Checklist & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Setup Checklist (Shopify standard) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Setup guide
              </h3>
              <p className="text-xs text-gray-500">
                4 of 5 tasks completed
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
              80% Ready
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Add your first product</p>
                  <p className="text-[11px] text-gray-500">{products.length} products listed in store</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                View products
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Set up payment methods</p>
                  <p className="text-[11px] text-gray-500">Cash on Delivery, bKash & Nagad active</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                Settings
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Configure shipping rates</p>
                  <p className="text-[11px] text-gray-500">Dhaka: ৳60 • Outside Dhaka: ৳120</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('markets')}
                className="text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                Manage
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Create promotional discount</p>
                  <p className="text-[11px] text-gray-500">WELCOME50 active for new visitors</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('discounts')}
                className="text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                Discounts
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/60 border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-amber-600 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-950">Recover abandoned checkouts</p>
                  <p className="text-[11px] text-amber-700">Re-engage shoppers who left cart with template emails</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('abandoned_checkouts')}
                className="px-2.5 py-1 bg-amber-700 text-white rounded text-xs font-semibold hover:bg-amber-800"
              >
                View Leads
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-emerald-600 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950">Connect Google Merchant Center</p>
                  <p className="text-[11px] text-emerald-700">Sync products with Google Shopping feed</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('sidekick_google')}
                className="px-2.5 py-1 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800"
              >
                Ask Sidekick
              </button>
            </div>
          </div>
        </div>

        {/* Right Card: Quick Insights & Low Stock */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-[11px]">
              Low Inventory Alerts
            </h3>
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-gray-500">All products have healthy inventory.</p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 3).map((prod) => (
                  <div key={prod.id} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100 last:border-0">
                    <div className="truncate pr-2">
                      <p className="font-semibold text-gray-800 truncate">{prod.name}</p>
                      <span className="text-[10px] text-gray-400 font-mono">{prod.sku}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                      {prod.stockCount} left
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-semibold pt-1 block"
            >
              Manage all inventory →
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-[11px]">
              Active Sales Channels
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-gray-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Online Store
                </span>
                <span className="font-mono font-bold text-gray-900">৳{Math.round(totalRevenue * 0.75).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Facebook & Instagram
                </span>
                <span className="font-mono font-bold text-gray-900">৳{Math.round(totalRevenue * 0.2).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Point of Sale (POS)
                </span>
                <span className="font-mono font-bold text-gray-900">৳{Math.round(totalRevenue * 0.05).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
