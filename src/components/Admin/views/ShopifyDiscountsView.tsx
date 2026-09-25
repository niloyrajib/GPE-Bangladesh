import React, { useState } from 'react';
import {
  Percent,
  Plus,
  Tag,
  Copy,
  Check,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Trash2,
  Sparkles,
  Zap,
  Shuffle,
  CheckCircle2,
  Filter,
  DollarSign,
  Gift,
  ShieldCheck,
  Info
} from 'lucide-react';
import { Coupon } from '../../../types';

interface ShopifyDiscountsViewProps {
  coupons?: Coupon[];
  onAddCoupon?: (newCoupon: Coupon) => void;
  onUpdateCoupon?: (updatedCoupon: Coupon) => void;
  onDeleteCoupon?: (code: string) => void;
  showToast?: (message: string) => void;
}

export const ShopifyDiscountsView: React.FC<ShopifyDiscountsViewProps> = ({
  coupons: externalCoupons,
  onAddCoupon,
  onUpdateCoupon,
  onDeleteCoupon,
  showToast = (_msg: string) => {}
}) => {
  // Local fallback state if not driven directly by parent
  const [localCoupons, setLocalCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('bx_active_coupons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        code: 'BANGLA10',
        title: '10% instant discount on orders above ৳1,000',
        discountType: 'percentage',
        amount: 10,
        minSpend: 1000,
        description: '10% instant discount on orders above ৳1,000',
        expiryDate: '2026-12-31',
        status: 'active',
        usageCount: 89
      },
      {
        code: 'EXPRESS50',
        title: 'Flat ৳50 discount on your order',
        discountType: 'fixed',
        amount: 50,
        minSpend: 800,
        description: 'Flat ৳50 discount on your order',
        expiryDate: '2026-12-31',
        status: 'active',
        usageCount: 142
      },
      {
        code: 'EID20',
        title: '20% off Ramadan & Eid Mega Shopping Festival',
        discountType: 'percentage',
        amount: 20,
        minSpend: 1500,
        description: '20% special discount on orders above ৳1,500',
        expiryDate: '2026-06-30',
        status: 'active',
        usageCount: 57
      },
      {
        code: 'FREESHIP',
        title: '৳60 off on delivery fee for orders above ৳2,000',
        discountType: 'fixed',
        amount: 60,
        minSpend: 2000,
        description: '৳60 off on delivery fee for orders above ৳2,000',
        expiryDate: '2026-06-30',
        status: 'active',
        usageCount: 64
      }
    ];
  });

  const activeCouponList = externalCoupons && externalCoupons.length > 0 ? externalCoupons : localCoupons;

  // Filter state
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Generator Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
  const [percentageValue, setPercentageValue] = useState<number>(15);
  const [fixedValue, setFixedValue] = useState<number>(100);
  const [newMinSpend, setNewMinSpend] = useState<string>('1000');
  const [newExpiryDate, setNewExpiryDate] = useState<string>(() => {
    // Default 30 days from now
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [usageLimit, setUsageLimit] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Copy code helper
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`কুপন কোড '${code}' কপি করা হয়েছে!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Random Code Generator helper
  const generateRandomCode = (prefix = 'PROMO') => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 5; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const finalCode = `${prefix}${rand}`;
    setNewCode(finalCode);
  };

  // Quick Preset Generator helper
  const applyPreset = (preset: 'welcome10' | 'fest25' | 'mega50' | 'flash15') => {
    const today = new Date();
    if (preset === 'welcome10') {
      generateRandomCode('WELCOME');
      setNewTitle('10% off for first order');
      setNewType('percentage');
      setPercentageValue(10);
      setNewMinSpend('500');
      today.setDate(today.getDate() + 60);
      setNewExpiryDate(today.toISOString().split('T')[0]);
    } else if (preset === 'fest25') {
      generateRandomCode('FEST');
      setNewTitle('25% off Festival Mega Voucher');
      setNewType('percentage');
      setPercentageValue(25);
      setNewMinSpend('1500');
      today.setDate(today.getDate() + 15);
      setNewExpiryDate(today.toISOString().split('T')[0]);
    } else if (preset === 'mega50') {
      generateRandomCode('SAVE');
      setNewTitle('৳50 Flat Off on Mobile Accessories');
      setNewType('fixed');
      setFixedValue(50);
      setNewMinSpend('800');
      today.setDate(today.getDate() + 30);
      setNewExpiryDate(today.toISOString().split('T')[0]);
    } else if (preset === 'flash15') {
      generateRandomCode('FLASH');
      setNewTitle('15% 48-Hour Weekend Flash Deal');
      setNewType('percentage');
      setPercentageValue(15);
      setNewMinSpend('1000');
      today.setDate(today.getDate() + 2);
      setNewExpiryDate(today.toISOString().split('T')[0]);
    }
  };

  // Create Discount Handler
  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedCode = newCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!formattedCode) {
      alert('অনুগ্রহ করে একটি সঠিক কুপন কোড প্রদান করুন');
      return;
    }

    // Check duplicate
    if (activeCouponList.some((c) => c.code.toUpperCase() === formattedCode)) {
      alert(`কুপন কোড '${formattedCode}' ইতিমধ্যে বিদ্যমান! অন্য কোড লিখুন।`);
      return;
    }

    const val = newType === 'percentage' ? Number(percentageValue) : Number(fixedValue);
    if (val <= 0) {
      alert('ডিসকাউন্ট এর পরিমাণ ০ এর চেয়ে বেশি হতে হবে');
      return;
    }

    if (newType === 'percentage' && val > 95) {
      alert('শতকরা ডিসকাউন্ট ৯৫% এর বেশি হতে পারবে না');
      return;
    }

    const newCoupon: Coupon = {
      code: formattedCode,
      title: newTitle.trim() || `${formattedCode} Special Discount`,
      discountType: newType,
      amount: val,
      minSpend: Number(newMinSpend) || 0,
      description:
        newTitle.trim() ||
        `${newType === 'percentage' ? `${val}%` : `৳${val}`} discount on orders above ৳${Number(newMinSpend) || 0}`,
      expiryDate: newExpiryDate,
      status: 'active',
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (onAddCoupon) {
      onAddCoupon(newCoupon);
    } else {
      const updated = [newCoupon, ...localCoupons];
      setLocalCoupons(updated);
      try {
        localStorage.setItem('bx_active_coupons', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }

    setIsModalOpen(false);
    setNewCode('');
    setNewTitle('');
    showToast(`নতুন কুপন '${formattedCode}' সফলভাবে তৈরি হয়েছে!`);
  };

  // Toggle status (active / expired)
  const handleToggleStatus = (coupon: Coupon) => {
    const isNowActive = coupon.status === 'active';
    const nextStatus = isNowActive ? 'expired' : 'active';
    const updated: Coupon = { ...coupon, status: nextStatus };

    if (onUpdateCoupon) {
      onUpdateCoupon(updated);
    } else {
      const newList = localCoupons.map((c) => (c.code === coupon.code ? updated : c));
      setLocalCoupons(newList);
      try {
        localStorage.setItem('bx_active_coupons', JSON.stringify(newList));
      } catch (err) {
        console.error(err);
      }
    }
    showToast(`কুপন '${coupon.code}' ${nextStatus === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`);
  };

  // Delete coupon
  const handleDelete = (code: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে কুপন কোড "${code}" মুছে ফেলতে চান?`)) {
      if (onDeleteCoupon) {
        onDeleteCoupon(code);
      } else {
        const newList = localCoupons.filter((c) => c.code !== code);
        setLocalCoupons(newList);
        try {
          localStorage.setItem('bx_active_coupons', JSON.stringify(newList));
        } catch (err) {
          console.error(err);
        }
      }
      showToast(`কুপন কোড '${code}' সফলভাবে মুছে ফেলা হয়েছে`);
    }
  };

  // Filtered coupons
  const todayIso = new Date().toISOString().split('T')[0];
  const filteredCoupons = activeCouponList.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    const isExpired = c.status === 'expired' || (c.expiryDate && c.expiryDate < todayIso);

    if (filterStatus === 'active') return matchesSearch && !isExpired;
    if (filterStatus === 'expired') return matchesSearch && isExpired;
    return matchesSearch;
  });

  const activeCount = activeCouponList.filter(
    (c) => c.status !== 'expired' && (!c.expiryDate || c.expiryDate >= todayIso)
  ).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">Discount Code Generator</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {activeCount} Active Coupons
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Generate percentage (%) or fixed (৳) discount codes with custom expiration dates and minimum order limits.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            generateRandomCode('DISC');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Generate New Coupon</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Coupons</span>
            <p className="text-lg font-black text-gray-900">{activeCouponList.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Percentage Coupons</span>
            <p className="text-lg font-black text-gray-900">
              {activeCouponList.filter((c) => c.discountType === 'percentage').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Redemptions</span>
            <p className="text-lg font-black text-gray-900">
              {activeCouponList.reduce((acc, c) => acc + (c.usageCount || 0), 0)} times
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-gray-900 text-white shadow-2xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Coupons ({activeCouponList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterStatus === 'active'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('expired')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterStatus === 'expired'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Expired / Inactive ({activeCouponList.length - activeCount})
          </button>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code or description..."
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-rose-500 text-xs"
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200 uppercase text-[10.5px]">
              <tr>
                <th className="p-3.5">Coupon Code</th>
                <th className="p-3.5">Discount Rate</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Min Order Requirement</th>
                <th className="p-3.5">Expiration Date</th>
                <th className="p-3.5">Total Usage</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-gray-700">No discount coupons found</p>
                    <p className="text-[11px] text-gray-400">Click &quot;Generate New Coupon&quot; to create one.</p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((c) => {
                  const isExpired = c.status === 'expired' || (c.expiryDate && c.expiryDate < todayIso);
                  return (
                    <tr key={c.code} className="hover:bg-gray-50/80 transition-colors">
                      {/* Code & Title */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-300">
                            {c.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(c.code)}
                            className="text-gray-400 hover:text-gray-700 p-0.5 cursor-pointer"
                            title="Copy coupon code"
                          >
                            {copiedCode === c.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[11px] text-gray-500 block mt-1 line-clamp-1">
                          {c.title || c.description}
                        </span>
                      </td>

                      {/* Discount Rate */}
                      <td className="p-3.5">
                        <span
                          className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                            c.discountType === 'percentage'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {c.discountType === 'percentage' ? `${c.amount}% OFF` : `৳${c.amount} FLAT`}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isExpired
                              ? 'bg-gray-100 text-gray-600 border border-gray-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </td>

                      {/* Min Spend */}
                      <td className="p-3.5 text-gray-700">
                        {c.minSpend && c.minSpend > 0 ? (
                          <span>৳{c.minSpend.toLocaleString()}</span>
                        ) : (
                          <span className="text-gray-400">No minimum</span>
                        )}
                      </td>

                      {/* Expiry Date */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-gray-600 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{c.expiryDate || 'No expiry'}</span>
                        </div>
                      </td>

                      {/* Usage */}
                      <td className="p-3.5 font-mono text-gray-900 font-bold">
                        {c.usageCount || 0}
                        {c.usageLimit ? ` / ${c.usageLimit}` : ' used'}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                          >
                            {c.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(c.code)}
                            className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Delete coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDiscount}
            className="bg-white rounded-2xl max-w-lg w-full p-6 border border-gray-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Discount Code Generator</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Set code name, percentage or fixed discount, and expiration date.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs space-y-1.5">
              <span className="font-bold text-amber-900 block">Quick Generation Presets:</span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => applyPreset('welcome10')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[11px] font-semibold text-amber-900 cursor-pointer shadow-2xs"
                >
                  🎉 10% Welcome
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('fest25')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[11px] font-semibold text-amber-900 cursor-pointer shadow-2xs"
                >
                  🌙 25% Eid Mega
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('flash15')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[11px] font-semibold text-amber-900 cursor-pointer shadow-2xs"
                >
                  ⚡ 15% 48h Flash
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('mega50')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[11px] font-semibold text-amber-900 cursor-pointer shadow-2xs"
                >
                  ৳ ৳50 Flat Off
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Code input with Random button */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  Coupon Code <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER25"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none font-mono font-bold uppercase focus:border-rose-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => generateRandomCode('PROMO')}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
                    title="Generate Random Code"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Random</span>
                  </button>
                </div>
              </div>

              {/* Title / Description */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  Title / Promotion Note
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 20% discount on orders above ৳1,500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-rose-500"
                />
              </div>

              {/* Discount Type Toggle */}
              <div>
                <label className="font-bold text-gray-800 block mb-1.5">
                  Discount Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      newType === 'percentage'
                        ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="discountType"
                        checked={newType === 'percentage'}
                        onChange={() => setNewType('percentage')}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="font-bold text-gray-900 block">Percentage (%)</span>
                        <span className="text-[11px] text-gray-500">e.g. 10%, 20%, 30%</span>
                      </div>
                    </div>
                    <Percent className="w-4 h-4 text-rose-600" />
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      newType === 'fixed'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="discountType"
                        checked={newType === 'fixed'}
                        onChange={() => setNewType('fixed')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-gray-900 block">Fixed (৳ BDT)</span>
                        <span className="text-[11px] text-gray-500">e.g. ৳50, ৳100</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 text-sm">৳</span>
                  </label>
                </div>
              </div>

              {/* Value Input */}
              {newType === 'percentage' ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-800">
                      Percentage Discount Rate (%) <span className="text-rose-500">*</span>
                    </label>
                    <span className="font-mono font-bold text-rose-600 text-sm">
                      {percentageValue}% OFF
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={90}
                      step={1}
                      value={percentageValue}
                      onChange={(e) => setPercentageValue(Number(e.target.value))}
                      className="flex-1 accent-rose-600"
                    />
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={percentageValue}
                      onChange={(e) => setPercentageValue(Number(e.target.value))}
                      className="w-16 px-2 py-1.5 border border-gray-300 rounded text-center font-mono font-bold text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {[5, 10, 15, 20, 25, 30, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setPercentageValue(pct)}
                        className={`px-2 py-0.5 rounded text-[10.5px] font-semibold border cursor-pointer ${
                          percentageValue === pct
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Fixed Discount Amount (৳) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={fixedValue}
                    onChange={(e) => setFixedValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none font-mono font-bold focus:border-rose-500"
                  />
                  <div className="flex items-center gap-1.5 mt-2">
                    {[50, 100, 150, 200, 300, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFixedValue(amt)}
                        className={`px-2 py-0.5 rounded text-[10.5px] font-semibold border cursor-pointer ${
                          fixedValue === amt
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        ৳{amt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expiration Date & Minimum Spend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-bold text-gray-800 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span>Expiration Date (মেয়াদ শেষ)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpiryDate}
                    min={todayIso}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-rose-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Min Order Spend (৳)
                  </label>
                  <input
                    type="number"
                    value={newMinSpend}
                    onChange={(e) => setNewMinSpend(e.target.value)}
                    placeholder="0 for no minimum"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none font-mono focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Save & Activate Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
