import React, { useState } from 'react';
import {
  Gauge,
  TrendingUp,
  Mail,
  Share2,
  Zap,
  Target,
  Users,
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  X,
  Play,
  Pause,
  Send
} from 'lucide-react';

interface ShopifyGrowthViewProps {
  showToast?: (message: string) => void;
}

interface Campaign {
  id: string;
  name: string;
  channel: 'Facebook & Instagram' | 'Google Shopping' | 'SMS Blast' | 'TikTok Ads';
  budget: string;
  status: 'Running' | 'Paused';
  roas: string;
  clicks: number;
}

export const ShopifyGrowthView: React.FC<ShopifyGrowthViewProps> = ({
  showToast = (_msg: string) => {}
}) => {
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isPixelModalOpen, setIsPixelModalOpen] = useState(false);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'cmp-1',
      name: 'Eid Tech Mega Sale (Dhaka & Chittagong)',
      channel: 'Facebook & Instagram',
      budget: '৳15,000 / week',
      status: 'Running',
      roas: '5.2x',
      clicks: 4210
    },
    {
      id: 'cmp-2',
      name: 'Smartwatch Dynamic Retargeting',
      channel: 'Google Shopping',
      budget: '৳8,000 / week',
      status: 'Running',
      roas: '4.4x',
      clicks: 1850
    }
  ]);

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    channel: 'Facebook & Instagram' as Campaign['channel'],
    budget: '৳5,000'
  });

  const [abandonedSmsTemplate, setAbandonedSmsTemplate] = useState(
    'আপনার কার্টে আইটেমগুলো রাখা আছে! এখনই অর্ডার কনফার্ম করলে ফ্রি ডেলিভারি: https://banglaxpress.store/cart'
  );
  const [abandonedSmsActive, setAbandonedSmsActive] = useState(true);

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.name) return;

    const newCmp: Campaign = {
      id: `cmp-${Date.now()}`,
      name: campaignForm.name,
      channel: campaignForm.channel,
      budget: campaignForm.budget,
      status: 'Running',
      roas: '3.8x (Estimated)',
      clicks: 0
    };

    setCampaigns([newCmp, ...campaigns]);
    setIsCampaignModalOpen(false);
    setCampaignForm({ name: '', channel: 'Facebook & Instagram', budget: '৳5,000' });
    showToast('নতুন মার্কেটিং ক্যাম্পেইন সফলভাবে চালু করা হয়েছে!');
  };

  const handleToggleCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Running' ? 'Paused' : 'Running' } : c
      )
    );
    showToast('ক্যাম্পেইনের স্ট্যাটাস পরিবর্তন করা হয়েছে');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">Growth & Marketing Hub</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Shopify Scale
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Optimize your conversion funnel, recover abandoned checkouts, and scale advertising across Bangladesh.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCampaignModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Launch campaign</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Checkout Recovery</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-1">24.6%</p>
          <span className="text-[10.5px] text-gray-400 mt-0.5 block">+5.2% vs last month</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Recovered Revenue</span>
          <p className="text-xl font-bold font-mono text-gray-900 mt-1">৳48,500</p>
          <span className="text-[10.5px] text-emerald-600 mt-0.5 block">32 carts recovered</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">ROAS (Meta Ads)</span>
          <p className="text-xl font-bold font-mono text-purple-700 mt-1">4.8x</p>
          <span className="text-[10.5px] text-gray-400 mt-0.5 block">High efficiency</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Repeat Purchase Rate</span>
          <p className="text-xl font-bold font-mono text-gray-900 mt-1">31.2%</p>
          <span className="text-[10.5px] text-blue-600 mt-0.5 block">Strong loyalty</span>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Active Ad Campaigns</h3>
          <span className="text-xs text-gray-500 font-mono">{campaigns.length} total</span>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {campaigns.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <h4 className="font-bold text-gray-900">{c.name}</h4>
                <span className="text-gray-400 text-[11px]">{c.channel} • Budget: {c.budget} • ROAS: {c.roas}</span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    c.status === 'Running'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {c.status}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleCampaign(c.id)}
                  className="px-2.5 py-1 border border-gray-300 rounded-md hover:bg-white text-gray-700 font-semibold flex items-center gap-1"
                >
                  {c.status === 'Running' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{c.status === 'Running' ? 'Pause' : 'Resume'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel Section */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Conversion Funnel (Last 30 Days)</h3>
            <p className="text-xs text-gray-500">Live user path from landing to confirmed order</p>
          </div>
          <span className="text-xs font-mono font-bold text-gray-500">Total Visits: 18,450</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
              <span>1. Store Visits</span>
              <span className="font-mono font-bold">18,450 (100%)</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gray-800 h-full rounded-full w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
              <span>2. Product Views (Catalog & Quick View)</span>
              <span className="font-mono font-bold">11,200 (60.7%)</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full w-[60.7%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
              <span>3. Added to Cart / Fast Order</span>
              <span className="font-mono font-bold">3,650 (19.8%)</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full w-[19.8%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
              <span>4. Order Completed (COD / bKash / Nagad)</span>
              <span className="font-mono font-bold text-emerald-600">624 (3.38% Overall Conversion)</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full w-[3.38%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Growth Automations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Abandoned Cart SMS & WhatsApp</h4>
              <p className="text-[11px] text-gray-500">Sends reminder 1 hour after exit</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Automated template: "{abandonedSmsTemplate.substring(0, 75)}..."
          </p>
          <div className="flex items-center justify-between pt-1">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                abandonedSmsActive
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              {abandonedSmsActive ? 'Active Automation' : 'Disabled'}
            </span>
            <button
              type="button"
              onClick={() => setIsSmsModalOpen(true)}
              className="text-xs font-semibold text-gray-700 hover:text-gray-900"
            >
              Configure →
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Meta Pixel & Conversion API</h4>
              <p className="text-[11px] text-gray-500">Server-side purchase event tracking</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Tracks Purchase, InitiateCheckout, and ViewContent events with 9.4/10 Event Match Quality on Meta Ads Manager.
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Connected
            </span>
            <button
              type="button"
              onClick={() => setIsPixelModalOpen(true)}
              className="text-xs font-semibold text-gray-700 hover:text-gray-900"
            >
              Test Events →
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Launch Campaign */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleLaunchCampaign}
            className="bg-white rounded-xl max-w-md w-full p-5 border border-gray-200 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Launch Marketing Campaign</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Campaign Name</label>
              <input
                type="text"
                required
                value={campaignForm.name}
                onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                placeholder="e.g. Flash Ramadan Special Deals"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Advertising Channel</label>
              <select
                value={campaignForm.channel}
                onChange={(e) => setCampaignForm({ ...campaignForm, channel: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
              >
                <option value="Facebook & Instagram">Facebook & Instagram (Meta Ads)</option>
                <option value="Google Shopping">Google Shopping & Performance Max</option>
                <option value="TikTok Ads">TikTok Shopping Ads</option>
                <option value="SMS Blast">Targeted SMS Blast</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Weekly Budget</label>
              <input
                type="text"
                required
                value={campaignForm.budget}
                onChange={(e) => setCampaignForm({ ...campaignForm, budget: e.target.value })}
                placeholder="৳10,000 / week"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(false)}
                className="px-3.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg font-semibold"
              >
                Launch Now
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Configure Abandoned Cart SMS */}
      {isSmsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-gray-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm">Abandoned Checkout SMS Settings</h3>
              <button
                type="button"
                onClick={() => setIsSmsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">SMS Message Template</label>
              <textarea
                rows={4}
                value={abandonedSmsTemplate}
                onChange={(e) => setAbandonedSmsTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-bold text-gray-800">Auto-send to uncompleted carts</span>
              <input
                type="checkbox"
                checked={abandonedSmsActive}
                onChange={(e) => setAbandonedSmsActive(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsSmsModalOpen(false);
                  showToast('এসএমএস অটোমেশন সেটিংস সেভ হয়েছে!');
                }}
                className="px-4 py-1.5 bg-gray-900 text-white rounded-lg font-semibold"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Meta Pixel Test Events */}
      {isPixelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-gray-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm">Meta Pixel Test Events</h3>
              <button
                type="button"
                onClick={() => setIsPixelModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pixel ID 48920194829104 Active</span>
              </div>
              <p className="text-[11px] text-emerald-700">Events receiving server-side payload with 98% match.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between p-2 rounded bg-gray-50 border border-gray-100 font-mono text-[11px]">
                <span>PageView</span>
                <span className="text-emerald-600 font-bold">200 OK • 12s ago</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-gray-50 border border-gray-100 font-mono text-[11px]">
                <span>AddToCart</span>
                <span className="text-emerald-600 font-bold">200 OK • 1m ago</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-gray-50 border border-gray-100 font-mono text-[11px]">
                <span>Purchase (৳2,450)</span>
                <span className="text-emerald-600 font-bold">200 OK • 4m ago</span>
              </div>
            </div>

            <div className="flex justify-end border-t pt-3">
              <button
                type="button"
                onClick={() => {
                  showToast('টেস্ট ইভেন্ট Meta Ads Manager এ পাঠানো হয়েছে!');
                  setIsPixelModalOpen(false);
                }}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-semibold"
              >
                Send Test Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
