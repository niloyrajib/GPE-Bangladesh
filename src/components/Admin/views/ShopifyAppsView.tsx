import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  ExternalLink,
  Plus,
  Zap,
  ShieldCheck,
  Truck,
  CreditCard,
  Settings,
  X,
  Check,
  RefreshCw,
  Search,
  Trash2,
  Store,
  Power
} from 'lucide-react';
import {
  InstalledApp,
  DEFAULT_INSTALLED_APPS,
  getInstalledApps,
  saveInstalledApps,
  toggleAppStatus,
  isAppActive,
  INSTALLED_APPS_UPDATED_EVENT
} from '../../../utils/appExtensionsHelper';

interface ShopifyAppsViewProps {
  showToast?: (message: string) => void;
}

interface AvailableApp {
  id: string;
  name: string;
  category: string;
  rating: string;
  reviews: string;
  description: string;
  iconBg: string;
  iconText: string;
}

const AVAILABLE_STORE_APPS: AvailableApp[] = [
  {
    id: 'store-judge-me',
    name: 'Judge.me Product Reviews',
    category: 'Marketing & Social Proof',
    rating: '4.9 ★',
    reviews: '21,000+',
    description: 'Collect verified buyer photo and video reviews on your storefront to boost conversion rates.',
    iconBg: 'bg-amber-500',
    iconText: 'Jd'
  },
  {
    id: 'store-tiktok-pixel',
    name: 'TikTok Pixel & Shopping',
    category: 'Advertising',
    rating: '4.8 ★',
    reviews: '9,400+',
    description: 'Sync your product catalog with TikTok Ads and track viral video conversions with 1-click pixel.',
    iconBg: 'bg-slate-900',
    iconText: 'TT'
  },
  {
    id: 'store-whatsapp-chat',
    name: 'WhatsApp Order Chat & Support',
    category: 'Customer Support',
    rating: '5.0 ★',
    reviews: '15,200+',
    description: 'Floating WhatsApp widget on every product page so shoppers can message your sales team instantly.',
    iconBg: 'bg-emerald-500',
    iconText: 'WA'
  },
  {
    id: 'store-google-shopping',
    name: 'Google & YouTube Channel',
    category: 'Sales Channels',
    rating: '4.7 ★',
    reviews: '34,000+',
    description: 'Display products on Google Shopping search results and connect YouTube live shopping streams.',
    iconBg: 'bg-blue-500',
    iconText: 'G'
  }
];

export const ShopifyAppsView: React.FC<ShopifyAppsViewProps> = ({
  showToast = (_msg: string) => {}
}) => {
  const [apps, setApps] = useState<InstalledApp[]>(() => getInstalledApps());
  const [selectedApp, setSelectedApp] = useState<InstalledApp | null>(null);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // App Configuration Modal State
  const [configApiKey, setConfigApiKey] = useState('');
  const [configEndpoint, setConfigEndpoint] = useState('');
  const [configLive, setConfigLive] = useState(true);
  const [configEnabled, setConfigEnabled] = useState(true);

  // Sync with global updates
  useEffect(() => {
    const handleUpdate = () => {
      setApps(getInstalledApps());
    };
    window.addEventListener(INSTALLED_APPS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(INSTALLED_APPS_UPDATED_EVENT, handleUpdate);
  }, []);

  const handleToggleApp = (appId: string, forceEnabled?: boolean) => {
    const { apps: nextApps, updatedApp } = toggleAppStatus(appId, forceEnabled);
    setApps(nextApps);
    if (updatedApp) {
      const isEnabled = updatedApp.enabled !== false && updatedApp.status !== 'Disabled';
      if (!isEnabled) {
        showToast(`❌ ${updatedApp.name} নিষ্ক্রিয় করা হয়েছে (Fast Express Checkout থেকে সরানো হয়েছে)`);
      } else {
        showToast(`✅ ${updatedApp.name} সক্রিয় করা হয়েছে (Fast Express Checkout এ দৃশ্যমান)`);
      }
    }
  };

  const handleOpenConfig = (app: InstalledApp) => {
    setSelectedApp(app);
    setConfigApiKey(app.apiKey);
    setConfigEndpoint(app.endpoint);
    setConfigLive(app.live);
    setConfigEnabled(app.enabled !== false && app.status !== 'Disabled');
    setTestResult(null);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const nextApps = apps.map((a) =>
      a.id === selectedApp.id
        ? {
            ...a,
            apiKey: configApiKey,
            endpoint: configEndpoint,
            live: configLive,
            enabled: configEnabled,
            status: (configEnabled ? 'Connected' : 'Disabled') as InstalledApp['status']
          }
        : a
    );

    setApps(nextApps);
    saveInstalledApps(nextApps);

    if (configEnabled) {
      showToast(`✅ ${selectedApp.name} কনফিগারেশন আপডেট ও সক্রিয় করা হয়েছে (Fast Checkout এ যুক্ত)`);
    } else {
      showToast(`⚠️ ${selectedApp.name} নিষ্ক্রিয় করা হয়েছে (Fast Checkout থেকে অপসারিত)`);
    }
    setSelectedApp(null);
  };

  const handleTestAppApi = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('API Handshake OK • Response: 200 (Success)');
      showToast(`${selectedApp?.name} এর API কানেকশন সফলভাবে যাচাই করা হয়েছে!`);
    }, 1200);
  };

  const handleInstallApp = (app: AvailableApp) => {
    const newInstalled: InstalledApp = {
      id: app.id,
      name: app.name,
      category: app.category,
      description: app.description,
      status: 'Connected',
      iconBg: app.iconBg,
      iconText: app.iconText,
      apiKey: `key_${Date.now()}`,
      endpoint: `https://api.partner.com/v1`,
      live: true,
      enabled: true
    };
    const nextApps = [newInstalled, ...apps];
    setApps(nextApps);
    saveInstalledApps(nextApps);
    showToast(`${app.name} সফলভাবে ইনস্টল করা হয়েছে!`);
    setIsStoreModalOpen(false);
  };

  const handleUninstallApp = (appId: string, appName: string) => {
    if (confirm(`Uninstall ${appName}?`)) {
      const nextApps = apps.filter((a) => a.id !== appId);
      setApps(nextApps);
      saveInstalledApps(nextApps);
      showToast(`${appName} আনইনস্টল সম্পন্ন হয়েছে`);
      if (selectedApp?.id === appId) setSelectedApp(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">Apps & Extensions</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {apps.filter((a) => a.enabled !== false && a.status !== 'Disabled').length}/{apps.length} Active
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage connected courier APIs, Bangladeshi payment gateways, and integrations. Disabled apps will disappear from Fast Express Checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsStoreModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Browse App Store</span>
        </button>
      </div>

      {/* Installed Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => {
          const isEnabled = app.enabled !== false && app.status !== 'Disabled';

          return (
            <div
              key={app.id}
              className={`bg-white p-5 rounded-xl border shadow-xs flex flex-col justify-between space-y-4 transition-all duration-200 ${
                isEnabled
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-slate-200 bg-slate-50/70 opacity-90'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${app.iconBg} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs transition-opacity ${
                    isEnabled ? 'opacity-100 ring-2 ring-black/5' : 'opacity-60 saturate-50'
                  }`}
                >
                  {app.iconText}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-xs font-bold truncate ${isEnabled ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
                      {app.name}
                    </h3>
                    
                    {/* Status Badge + Toggle Switch */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1.5 ${
                          isEnabled
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-slate-500 bg-slate-200/70 border-slate-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        {isEnabled ? 'Connected' : 'Disabled'}
                      </span>

                      {/* Interactive On/Off Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isEnabled}
                        onClick={() => handleToggleApp(app.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                          isEnabled ? 'bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        title={
                          isEnabled
                            ? 'ক্লিক করে নিষ্ক্রিয় করুন (Fast Express Checkout থেকে বাদ পড়বে)'
                            : 'ক্লিক করে সক্রিয় করুন (Fast Express Checkout এ দৃশ্যমান হবে)'
                        }
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            isEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400 font-medium block">{app.category}</span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                        isEnabled
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                          : 'text-amber-800 bg-amber-50 border border-amber-200'
                      }`}
                    >
                      {isEnabled ? 'Fast Checkout এ সক্রিয়' : 'Fast Checkout থেকে সরানো'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                    {app.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono ${isEnabled ? 'text-gray-500' : 'text-gray-400'}`}>
                    {app.live ? '● Live Mode' : '○ Sandbox'}
                  </span>
                  {!isEnabled && (
                    <span className="text-[10px] text-rose-500 font-semibold">(Disabled)</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Enable / Disable Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleApp(app.id)}
                    className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer border ${
                      isEnabled
                        ? 'border-gray-200 bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                    title={isEnabled ? 'Disable this app' : 'Enable this app'}
                  >
                    <Power className={`w-3 h-3 ${isEnabled ? 'text-gray-400' : 'text-emerald-600'}`} />
                    <span>{isEnabled ? 'Disable' : 'Enable'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenConfig(app)}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Configure API</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: App API Configuration */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveConfig}
            className="bg-white rounded-xl max-w-lg w-full p-5 border border-gray-200 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg ${selectedApp.iconBg} text-white font-bold flex items-center justify-center text-xs`}>
                  {selectedApp.iconText}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{selectedApp.name}</h3>
                  <span className="text-[10px] text-gray-400 font-mono">API Configuration & Fast Checkout Status</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* App Enable / Disable Switch in Modal */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
              configEnabled ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
            }`}>
              <div>
                <span className="font-bold text-gray-900 block text-xs flex items-center gap-1.5">
                  <Power className={`w-3.5 h-3.5 ${configEnabled ? 'text-emerald-600' : 'text-rose-600'}`} />
                  <span>Integration Status: {configEnabled ? 'সক্রিয় (Enabled)' : 'নিষ্ক্রিয় (Disabled)'}</span>
                </span>
                <span className="text-[11px] text-gray-600 mt-0.5 block">
                  {configEnabled
                    ? 'এই ইন্টিগ্রেশনটি Fast Express Checkout এ গ্রাহকদের কাছে দৃশ্যমান থাকবে।'
                    : 'নিষ্ক্রিয় থাকলে এটি Fast Express Checkout থেকে সম্পূর্ণ অদৃশ্য হয়ে যাবে।'}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={configEnabled}
                onClick={() => setConfigEnabled(!configEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  configEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    configEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">API Key / Token</label>
              <input
                type="text"
                required
                value={configApiKey}
                onChange={(e) => setConfigApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs outline-hidden focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">API Endpoint / Gateway URL</label>
              <input
                type="url"
                required
                value={configEndpoint}
                onChange={(e) => setConfigEndpoint(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs outline-hidden focus:border-gray-900"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <span className="font-bold text-gray-800 block">Production Mode</span>
                <span className="text-[11px] text-gray-500">Toggle between Sandbox and Live production processing</span>
              </div>
              <input
                type="checkbox"
                checked={configLive}
                onChange={(e) => setConfigLive(e.target.checked)}
                className="w-4 h-4 accent-gray-900 rounded cursor-pointer"
              />
            </div>

            {testResult && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-mono font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testResult}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-3">
              <button
                type="button"
                onClick={handleTestAppApi}
                disabled={isTesting}
                className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-500" />}
                <span>{isTesting ? 'Validating...' : 'Test Connection'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUninstallApp(selectedApp.id, selectedApp.name)}
                  className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold cursor-pointer"
                >
                  Uninstall
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg font-semibold cursor-pointer"
                >
                  Save API Config
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Browse & Install New Apps from Store */}
      {isStoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 border border-gray-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>Shopify App Store for Bangladesh</span>
                </h3>
                <p className="text-xs text-gray-500">Install certified extensions to enhance customer acquisition and sales.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsStoreModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {AVAILABLE_STORE_APPS.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-2 bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg ${app.iconBg} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs`}>
                      {app.iconText}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{app.name}</h4>
                      <span className="text-[10px] text-amber-600 font-bold">{app.rating} ({app.reviews})</span>
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">{app.description}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleInstallApp(app)}
                      className="px-3 py-1 bg-gray-900 hover:bg-black text-white rounded-md text-xs font-semibold"
                    >
                      Install App
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
