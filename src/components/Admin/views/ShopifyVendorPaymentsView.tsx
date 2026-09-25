import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Sparkles,
  Info,
  CheckCircle2,
  RotateCcw,
  Store,
  Phone,
  ArrowRight,
  Sliders,
  Settings
} from 'lucide-react';
import { Product, VendorPaymentConfig } from '../../../types';
import {
  getVendorPaymentConfigs,
  saveVendorPaymentConfigs,
  upsertVendorPaymentConfig,
  deleteVendorPaymentConfig,
  extractAllVendors,
  DEFAULT_VENDOR_PAYMENT_RULES,
  VENDOR_PAYMENT_RULES_EVENT
} from '../../../utils/vendorPayments';
import { STORE_SETTINGS } from '../../../data/mockData';

interface ShopifyVendorPaymentsViewProps {
  products: Product[];
  showToast?: (message: string) => void;
}

export const ShopifyVendorPaymentsView: React.FC<ShopifyVendorPaymentsViewProps> = ({
  products,
  showToast
}) => {
  const [configs, setConfigs] = useState<VendorPaymentConfig[]>([]);
  const [allVendors, setAllVendors] = useState<string[]>([]);
  const [editingConfig, setEditingConfig] = useState<VendorPaymentConfig | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVendorForAdd, setSelectedVendorForAdd] = useState('');
  const [customVendorInput, setCustomVendorInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load configs
  const loadRules = () => {
    const loaded = getVendorPaymentConfigs();
    setConfigs(loaded);
    setAllVendors(extractAllVendors(products));
  };

  useEffect(() => {
    loadRules();
    const handleUpdate = () => loadRules();
    window.addEventListener(VENDOR_PAYMENT_RULES_EVENT, handleUpdate);
    return () => window.removeEventListener(VENDOR_PAYMENT_RULES_EVENT, handleUpdate);
  }, [products]);

  const handleToggleMethod = (method: string) => {
    if (!editingConfig) return;
    const currentMethods = editingConfig.allowedPaymentMethods || [];
    let updated: string[];
    if (currentMethods.includes(method)) {
      // Must keep at least one payment method enabled
      if (currentMethods.length <= 1) {
        if (showToast) showToast('অন্তত একটি পেমেন্ট পদ্ধতি সক্রিয় রাখতে হবে!');
        return;
      }
      updated = currentMethods.filter((m) => m !== method);
    } else {
      updated = [...currentMethods, method];
    }

    setEditingConfig({
      ...editingConfig,
      allowedPaymentMethods: updated,
      // If default method is no longer allowed, pick first allowed
      defaultPaymentMethod: updated.includes(editingConfig.defaultPaymentMethod || '')
        ? editingConfig.defaultPaymentMethod
        : updated[0]
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConfig) return;

    if (!editingConfig.allowedPaymentMethods || editingConfig.allowedPaymentMethods.length === 0) {
      if (showToast) showToast('অন্তত একটি পেমেন্ট পদ্ধতি সক্রিয় রাখুন!');
      return;
    }

    upsertVendorPaymentConfig(editingConfig);
    setEditingConfig(null);
    if (showToast) {
      showToast(`ভেন্ডর "${editingConfig.vendor}"-এর পেমেন্ট রুল সফলভাবে সংরক্ষিত হয়েছে!`);
    }
  };

  const handleCreateNewRule = (e: React.FormEvent) => {
    e.preventDefault();
    const vendorName = customVendorInput.trim() || selectedVendorForAdd.trim();
    if (!vendorName) {
      if (showToast) showToast('অনুগ্রহ করে ভেন্ডরের নাম দিন!');
      return;
    }

    const newRule: VendorPaymentConfig = {
      vendor: vendorName,
      allowedPaymentMethods: ['cod', 'bkash', 'nagad'],
      defaultPaymentMethod: 'cod',
      requireAdvancePayment: false,
      advanceAmount: 0,
      checkoutNote: `${vendorName} ভেন্ডরের অনুমোদিত পেমেন্ট পলিসি।`,
      badgeText: 'Custom Vendor Rule',
      isActive: true
    };

    upsertVendorPaymentConfig(newRule);
    setIsAddModalOpen(false);
    setSelectedVendorForAdd('');
    setCustomVendorInput('');
    setEditingConfig(newRule);
    if (showToast) {
      showToast(`নতুন ভেন্ডর "${vendorName}" পেমেন্ট রুল তৈরি হয়েছে। এখন কাস্টমাইজ করুন!`);
    }
  };

  const handleDeleteRule = (vendor: string) => {
    if (vendor.toLowerCase() === 'default') {
      if (showToast) showToast('ডিফল্ট রুল মুছে ফেলা যাবে না!');
      return;
    }
    if (confirm(`আপনি কি নিশ্চিত যে "${vendor}" ভেন্ডরের পেমেন্ট রুল মুছে ফেলতে চান?`)) {
      deleteVendorPaymentConfig(vendor);
      if (showToast) showToast(`"${vendor}" রুল মুছে ফেলা হয়েছে।`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('সকল ভেন্ডর পেমেন্ট রুল রিসেট করে ডিফল্ট সেটিংসে ফিরিয়ে নিতে চান?')) {
      saveVendorPaymentConfigs(DEFAULT_VENDOR_PAYMENT_RULES);
      if (showToast) showToast('ভেন্ডর পেমেন্ট রুল ডিফল্ট অবস্থায় রিস্টোর হয়েছে!');
    }
  };

  const filteredConfigs = configs.filter((c) =>
    c.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Top Banner & Info Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                ভেন্ডর ওয়াইজ পেমেন্ট মেথড কাস্টমাইজেশন
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ১-ক্লিক দ্রুত চেকআউটে সক্রিয়
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                প্রতিটি ভেন্ডর বা ব্র্যান্ডের জন্য আলাদাভাবে ক্যাশ অন ডেলিভারি (COD), বিকাশ, নগদ বা অগ্রিম পেমেন্ট নিয়ম নির্ধারণ করুন।
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="রিসেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>Add Vendor Rule</span>
          </button>
        </div>
      </div>

      {/* Quick Search & Summary */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ভেন্ডরের নাম দিয়ে সার্চ করুন..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg bg-white outline-none focus:border-gray-900"
          />
          <Store className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span>মোট কনফিগার করা ভেন্ডর: <strong className="text-gray-900">{configs.length}</strong></span>
          <span>•</span>
          <span>স্টোরের সক্রিয় ভেন্ডর: <strong className="text-gray-900">{allVendors.length}</strong></span>
        </div>
      </div>

      {/* Vendor Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConfigs.map((cfg) => {
          const isDefault = cfg.vendor.toLowerCase() === 'default';
          const hasCod = cfg.allowedPaymentMethods?.includes('cod');
          const hasBkash = cfg.allowedPaymentMethods?.includes('bkash');
          const hasNagad = cfg.allowedPaymentMethods?.includes('nagad');
          const hasCustom = cfg.allowedPaymentMethods?.includes('custom');

          return (
            <div
              key={cfg.vendor}
              className={`bg-white rounded-xl border p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative ${
                isDefault ? 'border-sky-300 ring-1 ring-sky-200' : 'border-gray-200'
              }`}
            >
              <div>
                {/* Header: Vendor Name & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 font-bold text-xs">
                      {cfg.vendor.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        {cfg.vendor}
                        {isDefault && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
                            Global Fallback
                          </span>
                        )}
                      </h3>
                      {cfg.badgeText && (
                        <span className="text-[10px] text-gray-500 font-medium">
                          {cfg.badgeText}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingConfig(cfg)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                      title="এডিট করুন"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!isDefault && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRule(cfg.vendor)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Allowed Payment Badges */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-gray-600 block mb-1.5">
                    অনুমোদিত পেমেন্ট অপশন:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                        hasCod
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200 line-through opacity-60'
                      }`}
                    >
                      <Banknote className="w-3 h-3" />
                      ক্যাশ অন ডেলিভারি
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                        hasBkash
                          ? 'bg-pink-50 text-pink-800 border-pink-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200 line-through opacity-60'
                      }`}
                    >
                      বিকাশ
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                        hasNagad
                          ? 'bg-orange-50 text-orange-800 border-orange-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200 line-through opacity-60'
                      }`}
                    >
                      নগদ
                    </span>

                    {hasCustom && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-blue-50 text-blue-800 border-blue-200">
                        কাস্টম গেটওয়ে
                      </span>
                    )}
                  </div>
                </div>

                {/* Advance payment notice if enabled */}
                {cfg.requireAdvancePayment && (
                  <div className="mt-2.5 p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      অগ্রিম পেমেন্ট আবশ্যক: <strong>৳{cfg.advanceAmount || 100}</strong>
                    </span>
                  </div>
                )}

                {/* Custom bKash / Nagad number if configured */}
                {(cfg.customBkashNumber || cfg.customNagadNumber) && (
                  <div className="mt-2 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100 space-y-0.5">
                    {cfg.customBkashNumber && (
                      <p className="flex items-center gap-1 truncate">
                        <span className="font-semibold text-pink-700">বিকাশ:</span>
                        <span className="font-mono text-[10.5px]">{cfg.customBkashNumber}</span>
                      </p>
                    )}
                    {cfg.customNagadNumber && (
                      <p className="flex items-center gap-1 truncate">
                        <span className="font-semibold text-orange-700">নগদ:</span>
                        <span className="font-mono text-[10.5px]">{cfg.customNagadNumber}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Checkout Note Preview */}
                {cfg.checkoutNote && (
                  <p className="mt-2 text-[11px] text-gray-500 italic bg-slate-50/70 p-2 rounded border border-gray-100">
                    "{cfg.checkoutNote}"
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">
                  ডিফল্ট মেথড: <strong className="text-gray-800 uppercase">{cfg.defaultPaymentMethod || 'COD'}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setEditingConfig(cfg)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  কনফিগার করুন
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* EDIT VENDOR PAYMENT CONFIG MODAL */}
      {/* ========================================================= */}
      {editingConfig && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    পেমেন্ট মেথড কাস্টমাইজেশন: <span className="text-rose-600">{editingConfig.vendor}</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    ১-ক্লিক দ্রুত চেকআউটে এই ভেন্ডরের প্রোডাক্টের জন্য কোন মেথডগুলো সক্রিয় থাকবে তা নির্বাচন করুন।
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingConfig(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Allowed Payment Methods Selection */}
              <div>
                <label className="block font-bold text-gray-900 mb-2">
                  অনুমোদিত পেমেন্ট পদ্ধতি (Allowed Methods) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* COD */}
                  <div
                    onClick={() => handleToggleMethod('cod')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      editingConfig.allowedPaymentMethods?.includes('cod')
                        ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-300'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 opacity-70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={editingConfig.allowedPaymentMethods?.includes('cod') || false}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                        ক্যাশ অন ডেলিভারি (COD)
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        ডেলিভারির সময় মূল্য পরিশোধ
                      </p>
                    </div>
                  </div>

                  {/* bKash */}
                  <div
                    onClick={() => handleToggleMethod('bkash')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      editingConfig.allowedPaymentMethods?.includes('bkash')
                        ? 'border-pink-500 bg-pink-50/60 ring-1 ring-pink-300'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 opacity-70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={editingConfig.allowedPaymentMethods?.includes('bkash') || false}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-pink-600 focus:ring-pink-500"
                    />
                    <div>
                      <span className="font-bold text-gray-900">বিকাশ (bKash Payment)</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        মার্চেন্ট বা পার্সোনাল পেমেন্ট
                      </p>
                    </div>
                  </div>

                  {/* Nagad */}
                  <div
                    onClick={() => handleToggleMethod('nagad')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      editingConfig.allowedPaymentMethods?.includes('nagad')
                        ? 'border-orange-500 bg-orange-50/60 ring-1 ring-orange-300'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 opacity-70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={editingConfig.allowedPaymentMethods?.includes('nagad') || false}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <span className="font-bold text-gray-900">নগদ (Nagad Payment)</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        নগদ মার্চেন্ট/ওয়ালেট
                      </p>
                    </div>
                  </div>

                  {/* Custom Gateways */}
                  <div
                    onClick={() => handleToggleMethod('custom')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      editingConfig.allowedPaymentMethods?.includes('custom')
                        ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-300'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 opacity-70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={editingConfig.allowedPaymentMethods?.includes('custom') || false}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-bold text-gray-900">কাস্টম গেটওয়েজ</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Upay, Rocket ও ব্যাংক এপিআই
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Default Method & Advance Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    ডিফল্ট সিলেক্টেড মেথড
                  </label>
                  <select
                    value={editingConfig.defaultPaymentMethod || 'cod'}
                    onChange={(e) =>
                      setEditingConfig({ ...editingConfig, defaultPaymentMethod: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:border-gray-900"
                  >
                    {editingConfig.allowedPaymentMethods?.map((m) => (
                      <option key={m} value={m}>
                        {m === 'cod'
                          ? 'ক্যাশ অন ডেলিভারি (COD)'
                          : m === 'bkash'
                          ? 'বিকাশ (bKash)'
                          : m === 'nagad'
                          ? 'নগদ (Nagad)'
                          : 'কাস্টম গেটওয়ে'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    অগ্রিম পেমেন্ট শর্ত (Advance Requirement)
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingConfig.requireAdvancePayment || false}
                      onChange={(e) =>
                        setEditingConfig({
                          ...editingConfig,
                          requireAdvancePayment: e.target.checked,
                          advanceAmount: e.target.checked ? editingConfig.advanceAmount || 100 : 0
                        })
                      }
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-semibold text-gray-800">
                      অর্ডারে অগ্রিম পেমেন্ট প্রযোজ্য
                    </span>
                  </label>
                </div>
              </div>

              {/* Advance Amount (if enabled) */}
              {editingConfig.requireAdvancePayment && (
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-44">
                      <label className="block text-[11px] font-bold text-amber-900 mb-0.5">
                        অগ্রিম টাকার পরিমাণ (৳)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editingConfig.advanceAmount || 100}
                        onChange={(e) =>
                          setEditingConfig({
                            ...editingConfig,
                            advanceAmount: Number(e.target.value)
                          })
                        }
                        className="w-full px-3 py-1.5 border border-amber-300 rounded-lg bg-white outline-none font-bold text-amber-900"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-amber-900 mb-0.5">
                        অগ্রিম পেমেন্ট নোট (চেকআউটে দেখাবে)
                      </label>
                      <input
                        type="text"
                        value={
                          editingConfig.advanceNote ||
                          'ডেলিভারি চার্জ নিশ্চিত করতে ১০০ টাকা বিকাশ বা নগদে অগ্রিম পরিশোধ করুন।'
                        }
                        onChange={(e) =>
                          setEditingConfig({ ...editingConfig, advanceNote: e.target.value })
                        }
                        className="w-full px-3 py-1.5 border border-amber-300 rounded-lg bg-white outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Vendor Custom MFS Numbers (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    ভেন্ডরের নিজস্ব বিকাশ নাম্বার (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={editingConfig.customBkashNumber || ''}
                    onChange={(e) =>
                      setEditingConfig({ ...editingConfig, customBkashNumber: e.target.value })
                    }
                    placeholder={`ডিফল্ট: ${STORE_SETTINGS.bkashNumber}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-900 font-mono"
                  />
                  <span className="text-[10px] text-gray-400">ফাঁকা রাখলে স্টোরের ডিফল্ট নাম্বার শো করবে</span>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    ভেন্ডরের নিজস্ব নগদ নাম্বার (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={editingConfig.customNagadNumber || ''}
                    onChange={(e) =>
                      setEditingConfig({ ...editingConfig, customNagadNumber: e.target.value })
                    }
                    placeholder={`ডিফল্ট: ${STORE_SETTINGS.nagadNumber}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-900 font-mono"
                  />
                  <span className="text-[10px] text-gray-400">ফাঁকা রাখলে স্টোরের ডিফল্ট নাম্বার শো করবে</span>
                </div>
              </div>

              {/* Checkout Special Note */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  চেকআউট স্পেশাল মেসেজ / নির্দেশিকা (Checkout Note)
                </label>
                <input
                  type="text"
                  value={editingConfig.checkoutNote || ''}
                  onChange={(e) =>
                    setEditingConfig({ ...editingConfig, checkoutNote: e.target.value })
                  }
                  placeholder="যেমন: এই ভেন্ডরের পণ্য ডেলিভারির সময় বক্স দেখে মূল্য পরিশোধ করতে পারবেন।"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-900 text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingConfig(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>সংরক্ষণ করুন (Save Rule)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD NEW VENDOR RULE MODAL */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-600" />
                নতুন ভেন্ডর পেমেন্ট রুল যুক্ত করুন
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewRule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  স্টোরের বিদ্যমান ভেন্ডর নির্বাচন করুন
                </label>
                <select
                  value={selectedVendorForAdd}
                  onChange={(e) => {
                    setSelectedVendorForAdd(e.target.value);
                    if (e.target.value) setCustomVendorInput('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:border-gray-900"
                >
                  <option value="">-- ভেন্ডর সিলেক্ট করুন --</option>
                  {allVendors
                    .filter((v) => !configs.some((c) => c.vendor.toLowerCase() === v.toLowerCase()))
                    .map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                </select>
              </div>

              <div className="text-center text-gray-400 text-[11px] font-semibold">
                — অথবা নতুন নাম লিখুন —
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  কাস্টম ভেন্ডর / ব্র্যান্ড নাম
                </label>
                <input
                  type="text"
                  value={customVendorInput}
                  onChange={(e) => {
                    setCustomVendorInput(e.target.value);
                    if (e.target.value) setSelectedVendorForAdd('');
                  }}
                  placeholder="যেমন: Anker Official, Xiaomi, Sony BD..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-900"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  রুল তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
