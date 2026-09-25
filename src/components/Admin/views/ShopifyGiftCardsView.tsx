import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
  Gift,
  User,
  ShieldAlert,
  Send,
  Sparkles,
  X
} from 'lucide-react';

interface ShopifyGiftCardsViewProps {
  showToast?: (message: string) => void;
}

export interface GiftCardRecord {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  initialValueBDT: number;
  currentBalanceBDT: number;
  status: 'Active' | 'Partially Used' | 'Depleted' | 'Disabled';
  issuedDate: string;
  expiryDate: string;
  notes?: string;
}

const INITIAL_GIFT_CARDS: GiftCardRecord[] = [
  {
    id: 'gc-1',
    code: 'GPE-GIFT-8821-XP90',
    customerName: 'Tanvir Hossain',
    customerPhone: '01712-445566',
    initialValueBDT: 2500,
    currentBalanceBDT: 2500,
    status: 'Active',
    issuedDate: '2026-09-08',
    expiryDate: 'Never expires',
    notes: 'Eid Festive Gift Voucher'
  },
  {
    id: 'gc-2',
    code: 'GPE-GIFT-4109-LM32',
    customerName: 'Farhana Akter',
    customerPhone: '01819-223344',
    initialValueBDT: 1500,
    currentBalanceBDT: 650,
    status: 'Partially Used',
    issuedDate: '2026-08-25',
    expiryDate: '2026-12-31',
    notes: 'Loyalty Reward Customer voucher'
  },
  {
    id: 'gc-3',
    code: 'GPE-GIFT-1190-KL77',
    customerName: 'Shakil Ahmed',
    customerPhone: '01911-889900',
    initialValueBDT: 1000,
    currentBalanceBDT: 0,
    status: 'Depleted',
    issuedDate: '2026-08-15',
    expiryDate: '2026-11-15',
    notes: 'Fully redeemed on T900 Smartwatch order'
  },
  {
    id: 'gc-4',
    code: 'GPE-GIFT-7732-PQ14',
    customerName: 'Nusrat Jahan',
    customerPhone: '01623-112233',
    initialValueBDT: 5000,
    currentBalanceBDT: 5000,
    status: 'Active',
    issuedDate: '2026-09-12',
    expiryDate: 'Never expires',
    notes: 'Corporate giveaway gift card'
  }
];

export const ShopifyGiftCardsView: React.FC<ShopifyGiftCardsViewProps> = ({
  showToast = (_msg: string) => {}
}) => {
  const [giftCards, setGiftCards] = useState<GiftCardRecord[]>(INITIAL_GIFT_CARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Partially Used' | 'Depleted' | 'Disabled'>('All');
  const [revealedCodes, setRevealedCodes] = useState<Record<string, boolean>>({});
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // New gift card state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedDenomination, setSelectedDenomination] = useState<number>(1000);
  const [customValue, setCustomValue] = useState<string>('');
  const [expiryOption, setExpiryOption] = useState<'never' | 'date'>('never');
  const [customExpiryDate, setCustomExpiryDate] = useState('2026-12-31');
  const [cardNotes, setCardNotes] = useState('');

  const filteredGiftCards = giftCards.filter((gc) => {
    const matchesSearch =
      gc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gc.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gc.customerPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || gc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Aggregated KPIs
  const totalIssuedBDT = giftCards.reduce((acc, gc) => acc + gc.initialValueBDT, 0);
  const totalOutstandingBDT = giftCards.reduce((acc, gc) => acc + gc.currentBalanceBDT, 0);
  const activeCount = giftCards.filter((gc) => gc.status === 'Active' || gc.status === 'Partially Used').length;

  const toggleReveal = (id: string) => {
    setRevealedCodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`গিফট কার্ড কোড ${code} ক্লিপবোর্ডে কপি করা হয়েছে!`);
  };

  const handleToggleStatus = (card: GiftCardRecord) => {
    const newStatus = card.status === 'Disabled' ? 'Active' : 'Disabled';
    setGiftCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, status: newStatus } : c))
    );
    showToast(newStatus === 'Disabled' ? 'গিফট কার্ড সাময়িকভাবে নিষ্ক্রিয় করা হয়েছে' : 'গিফট কার্ড পুনরায় সক্রিয় করা হয়েছে');
  };

  const handleIssueGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const value = customValue ? parseInt(customValue) || 1000 : selectedDenomination;
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    const newCard: GiftCardRecord = {
      id: `gc-${Date.now()}`,
      code: `GPE-GIFT-${randomDigits}-${randomSuffix}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || '01700-000000',
      initialValueBDT: value,
      currentBalanceBDT: value,
      status: 'Active',
      issuedDate: new Date().toISOString().split('T')[0],
      expiryDate: expiryOption === 'never' ? 'Never expires' : customExpiryDate,
      notes: cardNotes.trim() || 'Issued by merchant'
    };

    setGiftCards((prev) => [newCard, ...prev]);
    setIsIssueModalOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomValue('');
    setCardNotes('');
    showToast(`৳${value.toLocaleString()} মূল্যের গিফট কার্ড সফলভাবে ইস্যু করা হয়েছে!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Gift cards</h1>
            <span className="text-xs px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full font-bold">
              {giftCards.length} issued
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Issue digital gift cards and store credit vouchers for customer incentives, corporate gifting, or rewards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsIssueModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Issue gift card</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500">Active Gift Cards</div>
            <div className="text-xl font-bold text-gray-900 mt-0.5">{activeCount}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Ready for checkout use</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500">Outstanding Balance</div>
            <div className="text-xl font-mono font-bold text-gray-900 mt-0.5">
              ৳{totalOutstandingBDT.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">Total unredeemed credit</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500">Total Value Issued</div>
            <div className="text-xl font-mono font-bold text-gray-900 mt-0.5">
              ৳{totalIssuedBDT.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">Lifetime gift card volume</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['All', 'Active', 'Partially Used', 'Depleted', 'Disabled'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === status
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, customer name or phone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Gift Cards Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Gift Card Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Initial Value</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Expiry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredGiftCards.map((card) => {
                const isRevealed = !!revealedCodes[card.id];
                const displayCode = isRevealed
                  ? card.code
                  : `•••• •••• •••• ${card.code.slice(-4)}`;

                return (
                  <tr key={card.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Code */}
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200 text-xs">
                          {displayCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleReveal(card.id)}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                          title={isRevealed ? 'Hide code' : 'Show full code'}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(card.code)}
                          className="text-gray-400 hover:text-emerald-600 transition-colors"
                          title="Copy code"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {card.notes && (
                        <div className="text-[10.5px] text-gray-400 font-sans mt-0.5">{card.notes}</div>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{card.customerName}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{card.customerPhone}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {card.status === 'Active' ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10.5px]">
                          Active
                        </span>
                      ) : card.status === 'Partially Used' ? (
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-[10.5px]">
                          Partially Used
                        </span>
                      ) : card.status === 'Depleted' ? (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-bold text-[10.5px]">
                          Depleted (৳0)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10.5px]">
                          Disabled
                        </span>
                      )}
                    </td>

                    {/* Initial Value */}
                    <td className="py-3 px-4 font-mono text-gray-600">
                      ৳{card.initialValueBDT.toLocaleString()}
                    </td>

                    {/* Current Balance */}
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      ৳{card.currentBalanceBDT.toLocaleString()}
                    </td>

                    {/* Expiry */}
                    <td className="py-3 px-4 text-gray-500 text-[11px]">
                      {card.expiryDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(card)}
                          className={`px-2.5 py-1 border rounded-md font-semibold text-xs transition-colors shadow-2xs ${
                            card.status === 'Disabled'
                              ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {card.status === 'Disabled' ? 'Enable' : 'Deactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Gift Card Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleIssueGiftCard}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-600" />
                <span>Issue Gift Card</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Denominations */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Initial Value (BDT)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[500, 1000, 2500, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setSelectedDenomination(val);
                      setCustomValue('');
                    }}
                    className={`py-2 px-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                      selectedDenomination === val && !customValue
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ৳{val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Or enter custom amount in ৳..."
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Tanvir Hossain"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Customer Phone / Mobile</label>
              <input
                type="tel"
                placeholder="01712-345678"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Expiration</label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <input
                    type="radio"
                    name="expiry"
                    checked={expiryOption === 'never'}
                    onChange={() => setExpiryOption('never')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Never expires</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <input
                    type="radio"
                    name="expiry"
                    checked={expiryOption === 'date'}
                    onChange={() => setExpiryOption('date')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Set expiration date</span>
                </label>
                {expiryOption === 'date' && (
                  <input
                    type="date"
                    value={customExpiryDate}
                    onChange={(e) => setCustomExpiryDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden mt-1"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Internal Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. VIP Promo or Influencer gift"
                value={cardNotes}
                onChange={(e) => setCardNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800"
              >
                Activate & Issue Card
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
