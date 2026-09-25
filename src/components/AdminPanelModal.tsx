import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  Package,
  Truck,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Tag,
  Edit,
  Trash2,
  Copy,
  LogOut,
  ShieldCheck,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  Check,
  ChevronRight,
  Filter,
  FileSpreadsheet,
  Menu,
  Eye,
  Bell,
  Store,
  DownloadCloud
} from 'lucide-react';
import { Order, OrderStatus, Product, ThemeConfig, Coupon } from '../types';
import { generateGPESku, generateBarcode } from '../utils/productIdentifierHelper';
import { AdminLogin } from './Admin/AdminLogin';
import { ShopifyProductEditor } from './Admin/ShopifyProductEditor';
import { BulkProductImportModal } from './Admin/BulkProductImportModal';
import { DropshipProductImportModal } from './Admin/DropshipProductImportModal';
import { ShopifySidebar, ShopifyNavTab } from './Admin/ShopifySidebar';

// Subviews
import { ShopifyHomeView } from './Admin/views/ShopifyHomeView';
import { ShopifyCollectionsView } from './Admin/views/ShopifyCollectionsView';
import { ShopifyInventoryView } from './Admin/views/ShopifyInventoryView';
import { ShopifyPurchaseOrdersView } from './Admin/views/ShopifyPurchaseOrdersView';
import { ShopifyTransfersView } from './Admin/views/ShopifyTransfersView';
import { ShopifyGiftCardsView } from './Admin/views/ShopifyGiftCardsView';
import { ShopifyCustomersView } from './Admin/views/ShopifyCustomersView';
import { ShopifyGrowthView } from './Admin/views/ShopifyGrowthView';
import { ShopifyDiscountsView } from './Admin/views/ShopifyDiscountsView';
import { ShopifyAnalyticsView } from './Admin/views/ShopifyAnalyticsView';
import { ShopifyContentView } from './Admin/views/ShopifyContentView';
import { ShopifyMarketsView } from './Admin/views/ShopifyMarketsView';
import { ShopifySalesChannelsView } from './Admin/views/ShopifySalesChannelsView';
import { ShopifyAppsView } from './Admin/views/ShopifyAppsView';
import { ShopifySidekickView } from './Admin/views/ShopifySidekickModal';
import { ShopifySettingsView } from './Admin/views/ShopifySettingsView';
import { ShopifyVendorPaymentsView } from './Admin/views/ShopifyVendorPaymentsView';
import { ShopifyDropshipImportView } from './Admin/views/ShopifyDropshipImportView';
import { ShopifyThemeCustomizer } from './Admin/views/ShopifyThemeCustomizer';
import { FooterSettingsEditor } from './Admin/views/FooterSettingsEditor';
import { ShopifySEOGeneratorView } from './Admin/views/ShopifySEOGeneratorView';
import { ShopifyAbandonedCheckoutsView } from './Admin/views/ShopifyAbandonedCheckoutsView';
import { getStoredAbandonedCarts } from '../utils/abandonedCartManager';
import { DEFAULT_THEME_CONFIG } from '../data/defaultThemeConfig';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  products: Product[];
  onAddNewProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetDefaultProducts?: () => void;
  onBulkImportProducts?: (products: Product[], replaceExisting: boolean) => void;
  themeConfig?: ThemeConfig;
  onSaveTheme?: (updatedTheme: ThemeConfig) => void;
  coupons?: Coupon[];
  onAddCoupon?: (newCoupon: Coupon) => void;
  onUpdateCoupon?: (updatedCoupon: Coupon) => void;
  onDeleteCoupon?: (code: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  products,
  onAddNewProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetDefaultProducts,
  onBulkImportProducts,
  themeConfig,
  onSaveTheme,
  coupons,
  onAddCoupon,
  onUpdateCoupon,
  onDeleteCoupon
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bx_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<string>(() => {
    try {
      return localStorage.getItem('bx_admin_user') || 'Super Admin';
    } catch {
      return 'Super Admin';
    }
  });

  // Active Shopify Tab
  const [activeTab, setActiveTab] = useState<ShopifyNavTab>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Editor mode: null when not editing, Product or 'new' when editing
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Search & Filter state
  const [globalSearch, setGlobalSearch] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isDropshipModalOpen, setIsDropshipModalOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [abandonedCartsCount, setAbandonedCartsCount] = useState<number>(() => {
    return getStoredAbandonedCarts().filter((c) => c.recoveryStatus === 'unrecovered').length;
  });

  useEffect(() => {
    const handleCartsUpdate = () => {
      setAbandonedCartsCount(
        getStoredAbandonedCarts().filter((c) => c.recoveryStatus === 'unrecovered').length
      );
    };
    window.addEventListener('abandoned_carts_updated', handleCartsUpdate);
    return () => window.removeEventListener('abandoned_carts_updated', handleCartsUpdate);
  }, []);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3000);
  };

  const handleLoginSuccess = (name: string) => {
    setIsAuthenticated(true);
    setAdminUser(name);
    showToast('অ্যাডমিন প্যানেলে সফলভাবে লগইন হয়েছে!');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('bx_admin_authenticated');
      localStorage.removeItem('bx_admin_user');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
  };

  // Open editor for new product
  const handleOpenNewProductEditor = () => {
    setEditingProduct(null);
    setIsEditorActive(true);
  };

  // Open editor for editing product
  const handleOpenEditProductEditor = (product: Product) => {
    setEditingProduct(product);
    setIsEditorActive(true);
  };

  // Duplicate product
  const handleDuplicateProduct = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      name: `${product.name} (Copy)`,
      banglaName: product.banglaName ? `${product.banglaName} (কপি)` : undefined,
      sku: generateGPESku(product.category, `${product.name} Copy`),
      barcode: generateBarcode(),
      soldCount: 0
    };
    onAddNewProduct(duplicated);
    showToast('প্রোডাক্ট সফলভাবে ডুপ্লিকেট করা হয়েছে!');
  };

  // Save from Shopify Product Editor
  const handleSaveFromEditor = (productToSave: Product) => {
    if (editingProduct) {
      onUpdateProduct(productToSave);
      showToast(`'${productToSave.name}' প্রোডাক্ট সফলভাবে আপডেট করা হয়েছে!`);
    } else {
      onAddNewProduct(productToSave);
      showToast(`নতুন প্রোডাক্ট '${productToSave.name}' স্টোরে পাবলিশ করা হয়েছে!`);
    }
    setIsEditorActive(false);
    setEditingProduct(null);
    setActiveTab('products');
  };

  const handleBulkImport = (importedProducts: Product[], replaceExisting: boolean) => {
    if (onBulkImportProducts) {
      onBulkImportProducts(importedProducts, replaceExisting);
    } else {
      importedProducts.forEach((p) => onAddNewProduct(p));
    }
    showToast(`${importedProducts.length} টি প্রোডাক্ট সফলভাবে ইমপোর্ট সম্পন্ন হয়েছে!`);
    setActiveTab('products');
  };

  const handleUpdateProductStock = (productId: string, newStock: number) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      onUpdateProduct({
        ...prod,
        stockCount: newStock,
        inStock: newStock > 0
      });
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.includes(orderSearchQuery);

    if (orderFilterStatus === 'all') return matchesSearch;
    return matchesSearch && o.status === orderFilterStatus;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      (p.banglaName && p.banglaName.toLowerCase().includes(productSearchQuery.toLowerCase())) ||
      p.sku.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearchQuery.toLowerCase());

    if (productCategoryFilter === 'all') return matchesSearch;
    return matchesSearch && p.category === productCategoryFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#f6f6f7] w-screen h-screen flex flex-col">
      <div
        className="bg-[#f6f6f7] w-full h-full flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Notification Banner */}
        {notificationToast && (
          <div className="fixed top-5 right-5 z-50 bg-[#1a1a1a] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top-3">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationToast}</span>
          </div>
        )}

        {/* IF NOT AUTHENTICATED: SHOW ID & PASSWORD LOGIN FORM */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-12 flex items-center justify-center min-h-[500px] h-full">
            <AdminLogin onLoginSuccess={handleLoginSuccess} onClose={onClose} />
          </div>
        ) : (
          /* IF AUTHENTICATED: FULL SHOPIFY POLARIS ADMIN SUITE */
          <>
            {/* Top Polaris Navigation Bar */}
            <header className="h-12 bg-[#1a1a1a] text-white px-3 sm:px-4 flex items-center justify-between gap-3 border-b border-[#303030] shrink-0 z-40">
              {/* Left: Mobile Toggle & Shopify Brand */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 md:hidden"
                  title="Toggle Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 select-none">
                  {/* Shop Admin Panel Logo & Wordmark */}
                  <div className="w-7 h-7 rounded-md bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center font-sans">
                    Shop Admin Panel
                  </span>
                </div>
              </div>

              {/* Center: Global Search Bar matching screenshot with CTRL K */}
              <div className="relative flex-1 max-w-xl mx-auto hidden sm:block">
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => {
                    setGlobalSearch(e.target.value);
                    if (e.target.value) {
                      setProductSearchQuery(e.target.value);
                      setOrderSearchQuery(e.target.value);
                    }
                  }}
                  placeholder="Search"
                  className="w-full bg-[#303030] text-gray-200 text-xs pl-8 pr-20 py-1.5 rounded-lg border border-[#404040] focus:border-gray-400 focus:bg-[#383838] outline-hidden transition-colors placeholder:text-gray-400"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-[10px] font-mono font-bold text-gray-400 bg-[#242424] px-1.5 py-0.5 rounded border border-gray-700">
                    CTRL
                  </span>
                  <span className="text-[10px] font-mono font-bold text-gray-400 bg-[#242424] px-1.5 py-0.5 rounded border border-gray-700">
                    K
                  </span>
                </div>
              </div>

              {/* Right: Quick Actions, Notification Bell, User Account pill */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('sidekick_google')}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
                  title="Shopify Sidekick AI"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>

                {/* Account Pill matching "GPE GPE Bangladesh" in screenshot */}
                <div className="flex items-center gap-2 bg-[#262626] hover:bg-[#333] px-2.5 py-1 rounded-lg text-xs cursor-pointer border border-[#383838]">
                  <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-black flex items-center justify-center text-[9px] tracking-tight">
                    GPE
                  </div>
                  <span className="text-gray-200 font-semibold text-xs tracking-tight">
                    GPE Bangladesh
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
                  title="Close Admin Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Main Body: Left Shopify Sidebar + Right Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* The Exact Shopify Left Sidebar */}
              <ShopifySidebar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  setIsEditorActive(false);
                  setActiveTab(tab);
                }}
                ordersCount={orders.length}
                productsCount={products.length}
                abandonedCount={abandonedCartsCount}
                isMobileOpen={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
              />

              {/* Main Content View Container */}
              <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-[#f6f6f7]">
                {/* VIEW A: FULL SHOPIFY PRODUCT EDITOR */}
                {isEditorActive ? (
                  <ShopifyProductEditor
                    initialProduct={editingProduct}
                    onSave={handleSaveFromEditor}
                    onCancel={() => {
                      setIsEditorActive(false);
                      setEditingProduct(null);
                      setActiveTab('products');
                    }}
                    allProducts={products}
                    themeConfig={themeConfig}
                    onSaveTheme={onSaveTheme}
                    showToast={showToast}
                  />
                ) : (
                  <>
                    {/* VIEW 1: HOME */}
                    {activeTab === 'home' && (
                      <ShopifyHomeView
                        orders={orders}
                        products={products}
                        onNavigate={(tab) => setActiveTab(tab)}
                        onOpenNewProduct={handleOpenNewProductEditor}
                      />
                    )}

                    {/* VIEW 2: ORDERS */}
                    {activeTab === 'orders' && (
                      <div className="space-y-4 max-w-6xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <h1 className="text-lg font-bold text-gray-900">Orders</h1>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">
                                {orders.length} Total
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Manage order verification, cash on delivery confirmations, and courier dispatches.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                              Total: ৳{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                          <div className="relative w-full sm:w-80">
                            <input
                              type="text"
                              value={orderSearchQuery}
                              onChange={(e) => setOrderSearchQuery(e.target.value)}
                              placeholder="Search by Order ID, customer phone or name..."
                              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-gray-900"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>

                          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs overflow-x-auto pb-1 max-w-full">
                            <span className="text-gray-500 font-medium">Status:</span>
                            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                              (st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => setOrderFilterStatus(st)}
                                  className={`px-2.5 py-1 rounded-md capitalize font-medium whitespace-nowrap transition-colors ${
                                    orderFilterStatus === st
                                      ? 'bg-gray-900 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {st}
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        {/* Orders Table */}
                        <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-xs bg-white">
                          <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200 uppercase text-[10.5px]">
                              <tr>
                                <th className="p-3.5">Order & Time</th>
                                <th className="p-3.5">Customer details</th>
                                <th className="p-3.5">Items</th>
                                <th className="p-3.5">Total bill</th>
                                <th className="p-3.5">Payment</th>
                                <th className="p-3.5">Courier</th>
                                <th className="p-3.5">Fulfillment Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium">
                              {filteredOrders.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="p-8 text-center text-gray-400">
                                    No orders found matching this filter
                                  </td>
                                </tr>
                              ) : (
                                filteredOrders.map((ord) => (
                                  <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="p-3.5">
                                      <span className="font-bold font-mono text-gray-900 block">{ord.id}</span>
                                      <span className="text-[10px] text-gray-400">{ord.createdAt}</span>
                                    </td>

                                    <td className="p-3.5">
                                      <span className="font-bold text-gray-900 block">{ord.customerName}</span>
                                      <span className="font-mono text-[11px] text-gray-500">{ord.phone}</span>
                                      <span className="text-[10.5px] text-gray-400 block truncate max-w-[150px]">
                                        {ord.address}
                                      </span>
                                    </td>

                                    <td className="p-3.5">
                                      <span className="font-semibold text-gray-800 block">
                                        {ord.items.length} items
                                      </span>
                                      <span className="text-[10px] text-gray-400 truncate block max-w-[140px]">
                                        {ord.items[0]?.name}
                                      </span>
                                    </td>

                                    <td className="p-3.5 font-bold font-mono text-rose-600">
                                      ৳{ord.total.toLocaleString()}
                                    </td>

                                    <td className="p-3.5">
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-800 block w-fit">
                                        {ord.paymentMethod}
                                      </span>
                                      <span
                                        className={`text-[10px] ${
                                          ord.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                                        }`}
                                      >
                                        {ord.paymentStatus === 'paid' ? 'Paid' : 'COD (Pending)'}
                                      </span>
                                    </td>

                                    <td className="p-3.5">
                                      <span className="text-gray-900 font-medium block">
                                        {ord.courierName || 'Steadfast Courier'}
                                      </span>
                                      {ord.trackingNumber && (
                                        <span className="text-[10px] font-mono text-slate-400">
                                          {ord.trackingNumber}
                                        </span>
                                      )}
                                    </td>

                                    <td className="p-3.5">
                                      <select
                                        value={ord.status}
                                        onChange={(e) =>
                                          onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                                        }
                                        className="text-xs font-bold px-2 py-1.5 rounded-lg border border-gray-300 bg-white shadow-xs outline-none focus:border-gray-900 cursor-pointer"
                                      >
                                        <option value="pending">Pending (অপেক্ষমান)</option>
                                        <option value="confirmed">Confirmed (নিশ্চিত)</option>
                                        <option value="processing">Processing (প্যাকিং)</option>
                                        <option value="shipped">Shipped (কুরিয়ারে)</option>
                                        <option value="delivered">Delivered (ডেলিভার্ড)</option>
                                        <option value="cancelled">Cancelled (বাতিল)</option>
                                      </select>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* VIEW: ABANDONED CHECKOUTS RECOVERY */}
                    {activeTab === 'abandoned_checkouts' && (
                      <ShopifyAbandonedCheckoutsView
                        onAddCoupon={onAddCoupon}
                        showToast={showToast}
                      />
                    )}

                    {/* VIEW 3: PRODUCTS */}
                    {activeTab === 'products' && (
                      <div className="space-y-4 max-w-6xl mx-auto">
                        {/* Header Controls */}
                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <h1 className="text-lg font-bold text-gray-900">Products Catalog</h1>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">
                                {products.length} Products
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Add, edit, manage variants, and sync inventory across sales channels.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                            {onResetDefaultProducts && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('রিসেট করে ডিফল্ট ডেটা ফেরত আনতে চান?')) {
                                    onResetDefaultProducts();
                                    showToast('ডিফল্ট ডেটা রিস্টোর হয়েছে!');
                                  }
                                }}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:text-gray-900 text-xs font-semibold"
                              >
                                Reset Demo Data
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setIsDropshipModalOpen(true)}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                              title="Import from AliExpress, 1688, Alibaba, CJ, Taobao"
                            >
                              <DownloadCloud className="w-3.5 h-3.5 text-white" />
                              <span>Dropship Import</span>
                              <span className="text-[9px] bg-black/20 text-white px-1.5 py-0.2 rounded font-bold">5 Sites</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setIsBulkImportOpen(true)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                              <span>Bulk CSV</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleOpenNewProductEditor}
                              className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5 text-amber-300" />
                              <span>Add product</span>
                            </button>
                          </div>
                        </div>

                        {/* Search and Category Filter */}
                        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                          <div className="relative w-full sm:w-80">
                            <input
                              type="text"
                              value={productSearchQuery}
                              onChange={(e) => setProductSearchQuery(e.target.value)}
                              placeholder="Search product by title, SKU or brand..."
                              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-gray-900"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>

                          <select
                            value={productCategoryFilter}
                            onChange={(e) => setProductCategoryFilter(e.target.value)}
                            className="px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white outline-none focus:border-gray-900"
                          >
                            <option value="all">All Categories</option>
                            <option value="Smart Watches">Smart Watches</option>
                            <option value="Earbuds & Audio">Earbuds & Audio</option>
                            <option value="Power & Charging">Power & Charging</option>
                            <option value="Computer & Gaming">Computer & Gaming</option>
                            <option value="Home & Kitchen">Home & Kitchen</option>
                            <option value="Men's Caps & Fashion">Men's Caps & Fashion</option>
                          </select>
                        </div>

                        {/* Products Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {filteredProducts.map((p) => {
                            const specsCount = p.specifications ? Object.keys(p.specifications).length : 0;
                            return (
                              <div
                                key={p.id}
                                className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                              >
                                <div className="flex gap-3">
                                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                                    <img
                                      src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                    {p.discountPercent > 0 && (
                                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-600 text-white">
                                        -{p.discountPercent}%
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 truncate">
                                        {p.category}
                                      </span>
                                      <span
                                        className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold ${
                                          p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                        }`}
                                      >
                                        {p.inStock ? 'Active' : 'Out of stock'}
                                      </span>
                                    </div>

                                    <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5" title={p.name}>
                                      {p.name}
                                    </h4>

                                    {p.dropship && (
                                      <div className="flex items-center gap-1 mt-0.5">
                                        <span className="text-[9.5px] px-1.5 py-0.2 rounded font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                          Dropship: {p.dropship.platform}
                                        </span>
                                        <span className="text-[9.5px] text-gray-400 font-mono">
                                          ({p.dropship.sourceCurrency} {p.dropship.sourcePrice})
                                        </span>
                                      </div>
                                    )}

                                    {p.banglaName && (
                                      <p className="text-[11px] text-gray-500 truncate">{p.banglaName}</p>
                                    )}

                                    <div className="flex items-center gap-2 mt-1.5">
                                      <span className="text-xs font-bold font-mono text-gray-900">
                                        ৳{p.price.toLocaleString()}
                                      </span>
                                      {p.originalPrice > p.price && (
                                        <span className="text-[10.5px] font-mono text-gray-400 line-through">
                                          ৳{p.originalPrice.toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-[10.5px] text-gray-600">
                                  <div className="flex items-center gap-1 truncate">
                                    <Sliders className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="truncate">{specsCount} specifications</span>
                                  </div>
                                  <div className="flex items-center gap-1 truncate">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span className="truncate">{p.warranty || 'Warranty provided'}</span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1.5">
                                  <span className="text-[11px] text-gray-500 font-mono">
                                    Stock: {p.stockCount}
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleDuplicateProduct(p)}
                                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                      title="Duplicate"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Delete '${p.name}'?`)) {
                                          onDeleteProduct(p.id);
                                          showToast('Product deleted!');
                                        }
                                      }}
                                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditProductEditor(p)}
                                      className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                                    >
                                      <Edit className="w-3 h-3 text-amber-300" />
                                      <span>Edit (Product)</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* SUB-VIEW: COLLECTIONS */}
                    {activeTab === 'collections' && (
                      <ShopifyCollectionsView products={products} showToast={showToast} />
                    )}

                    {/* SUB-VIEW: INVENTORY */}
                    {activeTab === 'inventory' && (
                      <ShopifyInventoryView
                        products={products}
                        onUpdateProductStock={handleUpdateProductStock}
                        showToast={showToast}
                      />
                    )}

                    {/* SUB-VIEW: PURCHASE ORDERS */}
                    {activeTab === 'purchase_orders' && (
                      <ShopifyPurchaseOrdersView
                        products={products}
                        onUpdateProductStock={handleUpdateProductStock}
                        showToast={showToast}
                      />
                    )}

                    {/* SUB-VIEW: TRANSFERS */}
                    {activeTab === 'transfers' && (
                      <ShopifyTransfersView
                        products={products}
                        showToast={showToast}
                      />
                    )}

                    {/* SUB-VIEW: GIFT CARDS */}
                    {activeTab === 'gift_cards' && (
                      <ShopifyGiftCardsView
                        showToast={showToast}
                      />
                    )}

                    {/* VIEW 4: CUSTOMERS */}
                    {activeTab === 'customers' && <ShopifyCustomersView orders={orders} />}

                    {/* VIEW 5: GROWTH */}
                    {activeTab === 'growth' && <ShopifyGrowthView showToast={showToast} />}

                    {/* VIEW 6: DISCOUNTS */}
                    {activeTab === 'discounts' && (
                      <ShopifyDiscountsView
                        coupons={coupons}
                        onAddCoupon={onAddCoupon}
                        onUpdateCoupon={onUpdateCoupon}
                        onDeleteCoupon={onDeleteCoupon}
                        showToast={showToast}
                      />
                    )}

                    {/* VIEW 7: CONTENT */}
                    {activeTab === 'content' && <ShopifyContentView showToast={showToast} />}

                    {/* VIEW 8: MARKETS */}
                    {activeTab === 'markets' && <ShopifyMarketsView showToast={showToast} />}

                    {/* VIEW 9: ANALYTICS */}
                    {activeTab === 'analytics' && (
                      <ShopifyAnalyticsView orders={orders} products={products} />
                    )}

                    {/* VIEW 10: SALES CHANNELS */}
                    {activeTab === 'sales_online_store' && (
                      <ShopifySalesChannelsView
                        channelType="online_store"
                        products={products}
                        onOpenStorefront={onClose}
                        onOpenThemeCustomizer={() => setActiveTab('theme_customizer')}
                        onOpenFooterEditor={() => setActiveTab('footer_settings')}
                        onOpenSEOGenerator={() => setActiveTab('seo_generator')}
                      />
                    )}
                    {activeTab === 'theme_customizer' && (
                      <div className="fixed inset-0 z-50 bg-white">
                        <ShopifyThemeCustomizer
                          initialTheme={themeConfig || DEFAULT_THEME_CONFIG}
                          products={products}
                          onSaveTheme={(updatedTheme) => {
                            if (onSaveTheme) {
                              onSaveTheme(updatedTheme);
                            }
                            showToast('থিম কনফিগারেশন সেভ ও লাইভ আপডেট সম্পন্ন হয়েছে!');
                          }}
                          onExit={() => setActiveTab('sales_online_store')}
                          onOpenLiveStore={onClose}
                        />
                      </div>
                    )}
                    {activeTab === 'footer_settings' && (
                      <div className="bg-[#f6f6f7] min-h-full pb-16">
                        <FooterSettingsEditor
                          isStandalone={true}
                          footerConfig={themeConfig?.footer || DEFAULT_THEME_CONFIG.footer}
                          onUpdateFooter={(updatedFooter) => {
                            const updated = {
                              ...(themeConfig || DEFAULT_THEME_CONFIG),
                              footer: {
                                ...(themeConfig?.footer || DEFAULT_THEME_CONFIG.footer),
                                ...updatedFooter
                              }
                            };
                            if (onSaveTheme) {
                              onSaveTheme(updated);
                            }
                          }}
                          onSave={() => {
                            showToast('ফুটারের সমস্ত তথ্য সফলভাবে সেভ ও লাইভ আপডেট হয়েছে!');
                          }}
                        />
                      </div>
                    )}
                    {activeTab === 'seo_generator' && (
                      <div className="bg-[#f6f6f7] min-h-full pb-16 pt-2">
                        <ShopifySEOGeneratorView
                          themeConfig={themeConfig || DEFAULT_THEME_CONFIG}
                          onSaveSEO={(updatedSEO) => {
                            const updated = {
                              ...(themeConfig || DEFAULT_THEME_CONFIG),
                              seo: updatedSEO
                            };
                            if (onSaveTheme) {
                              onSaveTheme(updated);
                            }
                          }}
                          showToast={showToast}
                        />
                      </div>
                    )}
                    {activeTab === 'sales_agentic' && (
                      <ShopifySalesChannelsView
                        channelType="agentic"
                        products={products}
                      />
                    )}
                    {activeTab === 'sales_pos' && (
                      <ShopifySalesChannelsView channelType="pos" products={products} />
                    )}
                    {activeTab === 'sales_facebook' && (
                      <ShopifySalesChannelsView
                        channelType="facebook"
                        products={products}
                      />
                    )}

                    {/* VIEW 11: APPS */}
                    {activeTab === 'apps' && <ShopifyAppsView showToast={showToast} />}

                    {/* VIEW 12: SIDEKICK CONVERSATIONS */}
                    {activeTab === 'sidekick_payments' && (
                      <ShopifyVendorPaymentsView products={products} showToast={showToast} />
                    )}
                    {activeTab === 'sidekick_collection' && (
                      <ShopifySidekickView conversationType="collection" />
                    )}
                    {activeTab === 'sidekick_google' && (
                      <ShopifySidekickView conversationType="google" />
                    )}

                    {/* VIEW 13: SETTINGS */}
                    {activeTab === 'settings' && (
                      <ShopifySettingsView showToast={showToast} products={products} />
                    )}

                    {/* VIEW 14: VENDOR PAYMENT RULES */}
                    {activeTab === 'vendor_payments' && (
                      <ShopifyVendorPaymentsView products={products} showToast={showToast} />
                    )}

                    {/* VIEW 15: DROPSHIP PRODUCT DIRECT IMPORTER */}
                    {activeTab === 'dropship_import' && (
                      <ShopifyDropshipImportView
                        products={products}
                        onAddNewProduct={onAddNewProduct}
                        onBulkImport={onBulkImportProducts}
                        showToast={showToast}
                      />
                    )}
                  </>
                )}
              </main>
            </div>
          </>
        )}

        {/* Bulk CSV Product Import Modal */}
        <BulkProductImportModal
          isOpen={isBulkImportOpen}
          onClose={() => setIsBulkImportOpen(false)}
          onBulkImport={handleBulkImport}
        />

        {/* Dropship Product Direct Import Modal (AliExpress, 1688, Alibaba, CJ, Taobao) */}
        <DropshipProductImportModal
          isOpen={isDropshipModalOpen}
          onClose={() => setIsDropshipModalOpen(false)}
          onImportProducts={(importedProducts) => {
            if (onBulkImportProducts) {
              onBulkImportProducts(importedProducts, false);
            } else {
              importedProducts.forEach((p) => onAddNewProduct(p));
            }
          }}
          showToast={showToast}
        />
      </div>
    </div>
  );
};
