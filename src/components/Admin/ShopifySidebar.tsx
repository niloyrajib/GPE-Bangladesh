import React, { useState } from 'react';
import {
  Home,
  Inbox,
  Tag,
  User,
  Gauge,
  Percent,
  FileText,
  Globe,
  BarChart2,
  Store,
  Bot,
  CreditCard,
  Share2,
  ChevronRight,
  Settings,
  Sparkles,
  MessageSquare,
  Search,
  CornerDownRight,
  Layers,
  Sliders,
  DownloadCloud,
  ShoppingCart,
  Mail,
  ChevronDown
} from 'lucide-react';

export type ShopifyNavTab =
  | 'home'
  | 'orders'
  | 'abandoned_checkouts'
  | 'products'
  | 'collections'
  | 'inventory'
  | 'purchase_orders'
  | 'transfers'
  | 'gift_cards'
  | 'customers'
  | 'growth'
  | 'discounts'
  | 'content'
  | 'markets'
  | 'analytics'
  | 'sales_online_store'
  | 'theme_customizer'
  | 'footer_settings'
  | 'seo_generator'
  | 'sales_agentic'
  | 'sales_pos'
  | 'sales_facebook'
  | 'apps'
  | 'sidekick_payments'
  | 'sidekick_collection'
  | 'sidekick_google'
  | 'vendor_payments'
  | 'dropship_import'
  | 'settings';

interface ShopifySidebarProps {
  activeTab: ShopifyNavTab;
  onSelectTab: (tab: ShopifyNavTab) => void;
  ordersCount?: number;
  productsCount?: number;
  abandonedCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const ShopifySidebar: React.FC<ShopifySidebarProps> = ({
  activeTab,
  onSelectTab,
  ordersCount = 0,
  productsCount = 0,
  abandonedCount = 0,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const [ordersGroupOpen, setOrdersGroupOpen] = useState(true);
  const handleNavClick = (tab: ShopifyNavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const navItemClass = (tab: ShopifyNavTab) => {
    const isActive = activeTab === tab;
    return `w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors select-none text-left ${
      isActive
        ? 'bg-white text-[#202223] font-semibold shadow-xs'
        : 'text-[#4a4a4a] hover:bg-[#e4e5e7] hover:text-[#202223] font-medium'
    }`;
  };

  const subNavItemClass = (tab: ShopifyNavTab) => {
    const isActive = activeTab === tab;
    return `w-full flex items-center gap-2 pl-5 pr-3 py-1.5 rounded-lg text-xs transition-colors select-none text-left ${
      isActive
        ? 'bg-white text-[#202223] font-semibold shadow-xs'
        : 'text-[#5c5f62] hover:bg-[#e4e5e7] hover:text-[#202223] font-normal'
    }`;
  };

  return (
    <aside
      className={`w-60 shrink-0 bg-[#ebebeb] border-r border-[#d2d5d8] flex flex-col justify-between h-full select-none text-xs transition-transform duration-200 z-30 ${
        isMobileOpen
          ? 'fixed inset-y-0 left-0 shadow-2xl translate-x-0'
          : 'hidden md:flex'
      }`}
    >
      {/* Scrollable Nav Area */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-4 scrollbar-thin">
        {/* Core Menu */}
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={navItemClass('home')}
          >
            <Home className="w-4 h-4 text-[#5c5f62]" />
            <span className="truncate">Home</span>
          </button>

          {/* Orders Group with Sub-tabs (All Orders, Abandoned checkouts) */}
          <div className="space-y-0.5">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleNavClick('orders')}
                className={`flex-1 flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors select-none text-left ${
                  activeTab === 'orders'
                    ? 'bg-white text-[#202223] font-semibold shadow-xs'
                    : 'text-[#4a4a4a] hover:bg-[#e4e5e7] hover:text-[#202223] font-medium'
                }`}
              >
                <Inbox className="w-4 h-4 text-[#5c5f62]" />
                <span className="flex-1 truncate">Orders</span>
                {ordersCount > 0 && (
                  <span className="text-[10px] font-mono font-bold bg-[#d4d6d8] px-1.5 py-0.2 rounded-full text-[#202223]">
                    {ordersCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setOrdersGroupOpen(!ordersGroupOpen)}
                className="p-1 hover:bg-[#e4e5e7] rounded text-gray-500 transition-colors ml-0.5"
                title="Toggle Orders submenu"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    ordersGroupOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Orders Sub-navigation: Abandoned checkouts */}
            {ordersGroupOpen && (
              <div className="pl-2 space-y-0.5 border-l border-gray-300 ml-3.5 my-1">
                <button
                  type="button"
                  onClick={() => handleNavClick('abandoned_checkouts')}
                  className={subNavItemClass('abandoned_checkouts')}
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-[#5c5f62]" />
                  <span className="flex-1 truncate">Abandoned checkouts</span>
                  {abandonedCount > 0 && (
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full border border-amber-200">
                      {abandonedCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Products Group with Sub-tabs (Collections, Inventory, Purchase orders, Transfers, Gift cards) */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handleNavClick('products')}
              className={navItemClass('products')}
            >
              <Tag className="w-4 h-4 text-[#5c5f62]" />
              <span className="flex-1 truncate">Products</span>
              {productsCount > 0 && (
                <span className="text-[10px] font-mono font-bold bg-[#d4d6d8] px-1.5 py-0.2 rounded-full text-[#202223]">
                  {productsCount}
                </span>
              )}
            </button>

            {/* Sub-tabs matching image */}
            <div className="space-y-0.5 pt-0.5">
              <button
                type="button"
                onClick={() => handleNavClick('collections')}
                className={subNavItemClass('collections')}
              >
                <CornerDownRight className={`w-3.5 h-3.5 ${activeTab === 'collections' ? 'text-gray-600' : 'text-transparent'}`} />
                <span className="truncate">Collections</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('inventory')}
                className={subNavItemClass('inventory')}
              >
                <CornerDownRight className={`w-3.5 h-3.5 ${activeTab === 'inventory' ? 'text-gray-600' : 'text-transparent'}`} />
                <span className="truncate">Inventory</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('purchase_orders')}
                className={subNavItemClass('purchase_orders')}
              >
                <CornerDownRight className={`w-3.5 h-3.5 ${activeTab === 'purchase_orders' ? 'text-gray-600' : 'text-transparent'}`} />
                <span className="truncate">Purchase orders</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('transfers')}
                className={subNavItemClass('transfers')}
              >
                <CornerDownRight className={`w-3.5 h-3.5 ${activeTab === 'transfers' ? 'text-gray-600' : 'text-transparent'}`} />
                <span className="truncate">Transfers</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('gift_cards')}
                className={subNavItemClass('gift_cards')}
              >
                <CornerDownRight className={`w-3.5 h-3.5 ${activeTab === 'gift_cards' ? 'text-gray-600' : 'text-transparent'}`} />
                <span className="truncate">Gift cards</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('dropship_import')}
                className={`${subNavItemClass('dropship_import')} text-rose-700 font-semibold`}
              >
                <DownloadCloud className="w-3.5 h-3.5 text-rose-600" />
                <span className="truncate">Dropship Import</span>
                <span className="ml-auto text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded">
                  Ali/1688
                </span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNavClick('customers')}
            className={navItemClass('customers')}
          >
            <User className="w-4 h-4 text-[#5c5f62]" />
            <span className="truncate">Customers</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('growth')}
            className={navItemClass('growth')}
          >
            <Gauge className="w-4 h-4 text-[#5c5f62]" />
            <span className="truncate">Growth</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('discounts')}
            className={navItemClass('discounts')}
          >
            <Percent className="w-4 h-4 text-[#5c5f62]" />
            <span className="truncate">Discounts</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('content')}
            className={navItemClass('content')}
          >
            <FileText className="w-4 h-4 text-[#5c5f62]" />
            <span className="truncate">Content</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('markets')}
            className={navItemClass('markets')}
          >
            <Globe className="w-4 h-4 text-[#5c5f62]" />
            <span className="truncate">Markets</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('analytics')}
            className={navItemClass('analytics')}
          >
            <BarChart2 className="w-4 h-4 text-[#5c5f62]" />
            <span className="truncate">Analytics</span>
          </button>
        </div>

        {/* Section: Sales channels > */}
        <div className="space-y-0.5 pt-1">
          <div className="px-3 py-1 flex items-center justify-between text-[#616161] font-semibold text-[11px]">
            <span>Sales channels</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </div>

          <button
            type="button"
            onClick={() => handleNavClick('sales_online_store')}
            className={navItemClass('sales_online_store')}
          >
            <Store className="w-4 h-4 text-[#5c5f62]" />
            <span className="truncate">Online Store</span>
          </button>

          {/* Sub-item: Themes (Visual Customizer) */}
          <button
            type="button"
            onClick={() => handleNavClick('theme_customizer')}
            className={`w-full flex items-center gap-2 pl-7 pr-3 py-1 rounded-lg text-[11px] transition-colors select-none text-left ${
              activeTab === 'theme_customizer'
                ? 'bg-white text-emerald-700 font-bold shadow-xs'
                : 'text-[#5c5f62] hover:bg-[#e4e5e7] hover:text-[#202223] font-medium'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="truncate">Themes (Customize)</span>
          </button>

          {/* Sub-item: Footer Editor */}
          <button
            type="button"
            onClick={() => handleNavClick('footer_settings')}
            className={`w-full flex items-center gap-2 pl-7 pr-3 py-1 rounded-lg text-[11px] transition-colors select-none text-left ${
              activeTab === 'footer_settings'
                ? 'bg-white text-emerald-700 font-bold shadow-xs'
                : 'text-[#5c5f62] hover:bg-[#e4e5e7] hover:text-[#202223] font-medium'
            }`}
          >
            <Layers className="w-3 h-3 text-blue-500" />
            <span className="truncate">Footer Editor (ফুটার এডিট)</span>
          </button>

          {/* Sub-item: Meta Tag & SEO Generator */}
          <button
            type="button"
            onClick={() => handleNavClick('seo_generator')}
            className={`w-full flex items-center gap-2 pl-7 pr-3 py-1 rounded-lg text-[11px] transition-colors select-none text-left ${
              activeTab === 'seo_generator'
                ? 'bg-white text-rose-700 font-bold shadow-xs'
                : 'text-[#5c5f62] hover:bg-[#e4e5e7] hover:text-[#202223] font-medium'
            }`}
          >
            <Globe className="w-3 h-3 text-rose-500" />
            <span className="truncate">Meta Tag Generator (SEO)</span>
            <span className="ml-auto text-[8.5px] bg-rose-100 text-rose-700 font-bold px-1 rounded">
              OG
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('sales_agentic')}
            className={navItemClass('sales_agentic')}
          >
            <Bot className="w-4 h-4 text-[#5c5f62]" />
            <span className="truncate">Agentic</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('sales_pos')}
            className={navItemClass('sales_pos')}
          >
            <CreditCard className="w-4 h-4 text-[#5c5f62]" />
            <span className="truncate">Point of Sale</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('sales_facebook')}
            className={navItemClass('sales_facebook')}
          >
            <Share2 className="w-4 h-4 text-[#5c5f62]" />
            <span className="flex-1 truncate">Facebook & Instagram</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5c5f62] ml-auto shrink-0" />
          </button>
        </div>

        {/* Section: Apps > */}
        <div className="space-y-0.5 pt-1">
          <button
            type="button"
            onClick={() => handleNavClick('apps')}
            className="w-full px-3 py-1 flex items-center justify-between text-[#616161] font-semibold text-[11px] hover:text-[#202223]"
          >
            <span>Apps</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* Section: Sidekick conversations > */}
        <div className="space-y-0.5 pt-1">
          <div className="px-3 py-1 flex items-center justify-between text-[#616161] font-semibold text-[11px]">
            <span>Sidekick conversations</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </div>

          <button
            type="button"
            onClick={() => handleNavClick('sidekick_payments')}
            className={navItemClass('sidekick_payments')}
            title="Product-specific payment methods"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#5c5f62] shrink-0" />
            <span className="truncate">Product-specific payment met...</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('sidekick_collection')}
            className={navItemClass('sidekick_collection')}
            title="Creating a new collection for accessories"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#5c5f62] shrink-0" />
            <span className="truncate">Creating a new collection for a...</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('sidekick_google')}
            className={navItemClass('sidekick_google')}
            title="Get your products on Google"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#5c5f62] shrink-0" />
            <span className="truncate">Get your products on Google</span>
          </button>
        </div>
      </div>

      {/* Bottom Pinned Item: Settings & Vendor Rules */}
      <div className="p-2.5 border-t border-[#d2d5d8] bg-[#ebebeb] space-y-1">
        <button
          type="button"
          onClick={() => handleNavClick('vendor_payments')}
          className={navItemClass('vendor_payments')}
        >
          <Sliders className="w-4 h-4 text-[#5c5f62]" />
          <span className="truncate font-semibold">Vendor Payments</span>
          <span className="ml-auto text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
            Rules
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('settings')}
          className={navItemClass('settings')}
        >
          <Settings className="w-4 h-4 text-[#5c5f62]" />
          <span className="truncate font-semibold">Settings</span>
        </button>
      </div>
    </aside>
  );
};
