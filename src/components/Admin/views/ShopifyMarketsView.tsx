import React, { useState } from 'react';
import {
  Globe,
  Truck,
  DollarSign,
  Languages,
  CheckCircle2,
  Plus,
  ArrowRight,
  X,
  Edit2,
  Trash2
} from 'lucide-react';

interface ShopifyMarketsViewProps {
  showToast?: (message: string) => void;
}

interface MarketItem {
  id: string;
  country: string;
  flag: string;
  currency: string;
  languages: string;
  status: 'Active' | 'Draft';
  isPrimary?: boolean;
}

export const ShopifyMarketsView: React.FC<ShopifyMarketsViewProps> = ({
  showToast = (_msg: string) => {}
}) => {
  const [markets, setMarkets] = useState<MarketItem[]>([
    {
      id: 'm-1',
      country: 'Bangladesh (Primary Market)',
      flag: '🇧🇩',
      currency: 'BDT (৳)',
      languages: 'Bengali (বাংলা), English',
      status: 'Active',
      isPrimary: true
    },
    {
      id: 'm-2',
      country: 'United Arab Emirates & Gulf Expatriates',
      flag: '🇦🇪',
      currency: 'AED (د.إ)',
      languages: 'English, Arabic, Bengali',
      status: 'Active',
      isPrimary: false
    }
  ]);

  const [isAddMarketOpen, setIsAddMarketOpen] = useState(false);
  const [marketForm, setMarketForm] = useState({
    country: '',
    flag: '🌍',
    currency: 'USD ($)',
    languages: 'English'
  });

  const handleAddMarket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketForm.country) return;

    const newM: MarketItem = {
      id: `m-${Date.now()}`,
      country: marketForm.country,
      flag: marketForm.flag || '🌍',
      currency: marketForm.currency,
      languages: marketForm.languages,
      status: 'Active',
      isPrimary: false
    };

    setMarkets([...markets, newM]);
    setIsAddMarketOpen(false);
    setMarketForm({ country: '', flag: '🌍', currency: 'USD ($)', languages: 'English' });
    showToast('নতুন আন্তর্জাতিক মার্কেট সফলভাবে যুক্ত করা হয়েছে!');
  };

  const handleDeleteMarket = (id: string, name: string) => {
    if (confirm(`Remove market "${name}"?`)) {
      setMarkets((prev) => prev.filter((m) => m.id !== id));
      showToast('মার্কেট অপসারণ সম্পন্ন হয়েছে');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">Markets & Localization</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Global Ready
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage domestic delivery zones, primary currency (BDT ৳), and international cross-border sales.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddMarketOpen(true)}
          className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add market</span>
        </button>
      </div>

      {/* Markets List */}
      <div className="space-y-4">
        {markets.map((m) => (
          <div key={m.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl">
                  {m.flag}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{m.country}</h3>
                    {m.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Currency: {m.currency} • Languages: {m.languages}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  {m.status} & Selling
                </span>

                {!m.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleDeleteMarket(m.id, m.country)}
                    className="p-1.5 text-gray-400 hover:text-rose-600"
                    title="Delete market"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* If primary market, show domestic delivery zones */}
            {m.isPrimary && (
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gray-500" />
                  <span>Configured Domestic Delivery Zones</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/50">
                    <span className="font-bold text-gray-900 block">Dhaka City (Metro)</span>
                    <span className="font-mono font-bold text-rose-600">৳60.00 Flat</span>
                    <p className="text-[11px] text-gray-500 mt-1">24-48 Hours Express Delivery via Pathao / Steadfast</p>
                  </div>

                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/50">
                    <span className="font-bold text-gray-900 block">Dhaka Suburbs (Gazipur, Savar)</span>
                    <span className="font-mono font-bold text-rose-600">৳100.00 Flat</span>
                    <p className="text-[11px] text-gray-500 mt-1">24-72 Hours Home Delivery</p>
                  </div>

                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/50">
                    <span className="font-bold text-gray-900 block">Nationwide (Outside Dhaka)</span>
                    <span className="font-mono font-bold text-rose-600">৳120.00 Flat</span>
                    <p className="text-[11px] text-gray-500 mt-1">Chittagong, Sylhet, Khulna & all 64 districts</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Add Market */}
      {isAddMarketOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddMarket}
            className="bg-white rounded-xl max-w-md w-full p-5 border border-gray-200 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Add International Market</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddMarketOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Market Name / Region</label>
              <input
                type="text"
                required
                value={marketForm.country}
                onChange={(e) => setMarketForm({ ...marketForm, country: e.target.value })}
                placeholder="e.g. United Kingdom & Europe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Flag Emoji</label>
                <input
                  type="text"
                  value={marketForm.flag}
                  onChange={(e) => setMarketForm({ ...marketForm, flag: e.target.value })}
                  placeholder="🇬🇧"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden text-center text-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Currency</label>
                <select
                  value={marketForm.currency}
                  onChange={(e) => setMarketForm({ ...marketForm, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="AED (د.إ)">AED (د.إ)</option>
                  <option value="MYR (RM)">MYR (RM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Supported Languages</label>
              <input
                type="text"
                value={marketForm.languages}
                onChange={(e) => setMarketForm({ ...marketForm, languages: e.target.value })}
                placeholder="English, Bengali"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsAddMarketOpen(false)}
                className="px-3.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg font-semibold"
              >
                Create Market
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
