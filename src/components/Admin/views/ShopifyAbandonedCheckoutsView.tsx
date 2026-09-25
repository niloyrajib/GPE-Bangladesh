import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Mail,
  Send,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Tag,
  Eye,
  Trash2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  User,
  Sparkles,
  X
} from 'lucide-react';
import { AbandonedCart, Coupon } from '../../../types';
import {
  getStoredAbandonedCarts,
  recordRecoveryEmailSent,
  ABANDONED_CARTS_STORAGE_KEY
} from '../../../utils/abandonedCartManager';
import { EmailTemplateModal } from './EmailTemplateModal';

interface ShopifyAbandonedCheckoutsViewProps {
  onAddCoupon?: (coupon: Coupon) => void;
  showToast: (msg: string) => void;
}

export const ShopifyAbandonedCheckoutsView: React.FC<ShopifyAbandonedCheckoutsViewProps> = ({
  onAddCoupon,
  showToast
}) => {
  const [carts, setCarts] = useState<AbandonedCart[]>(() => getStoredAbandonedCarts());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unrecovered' | 'email_sent' | 'recovered'>('all');
  const [selectedCartForEmail, setSelectedCartForEmail] = useState<AbandonedCart | null>(null);
  const [inspectingCart, setInspectingCart] = useState<AbandonedCart | null>(null);

  // Sync with storage changes and events
  useEffect(() => {
    const handleUpdate = () => {
      setCarts(getStoredAbandonedCarts());
    };
    window.addEventListener('abandoned_carts_updated', handleUpdate);
    return () => window.removeEventListener('abandoned_carts_updated', handleUpdate);
  }, []);

  const totalAbandonedValue = carts.reduce((acc, c) => acc + c.subtotal, 0);
  const unrecoveredCount = carts.filter((c) => c.recoveryStatus === 'unrecovered').length;
  const emailsSentCount = carts.filter((c) => c.recoveryStatus === 'email_sent').length;
  const recoveredCount = carts.filter((c) => c.recoveryStatus === 'recovered').length;
  const recoveredValue = carts
    .filter((c) => c.recoveryStatus === 'recovered')
    .reduce((acc, c) => acc + c.subtotal, 0);

  const filteredCarts = carts.filter((cart) => {
    if (statusFilter !== 'all' && cart.recoveryStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEmail = cart.email.toLowerCase().includes(q);
      const matchName = cart.customerName?.toLowerCase().includes(q);
      const matchPhone = cart.phone?.includes(q);
      const matchId = cart.id.toLowerCase().includes(q);
      return matchEmail || matchName || matchPhone || matchId;
    }
    return true;
  });

  const handleSendRecoveryEmail = (
    cartId: string,
    emailContent: { subject: string; body: string; couponCode: string; discountPct: number }
  ) => {
    const updated = recordRecoveryEmailSent(cartId, emailContent.couponCode, emailContent.discountPct);
    if (updated) {
      setCarts(getStoredAbandonedCarts());
      showToast(`Recovery email dispatched to ${updated.email}!`);

      // Also ensure this recovery coupon code is active in the store so checkout succeeds
      if (onAddCoupon) {
        onAddCoupon({
          code: emailContent.couponCode,
          title: `Abandoned Recovery (${emailContent.discountPct}% OFF)`,
          discountType: 'percentage',
          amount: emailContent.discountPct,
          minSpend: 500,
          status: 'active',
          usageLimit: 100,
          usageCount: 0,
          createdAt: new Date().toISOString()
        });
      }
    }
  };

  const handleDeleteRecord = (cartId: string) => {
    if (confirm('Are you sure you want to remove this abandoned checkout record?')) {
      const remaining = carts.filter((c) => c.id !== cartId);
      setCarts(remaining);
      try {
        localStorage.setItem(ABANDONED_CARTS_STORAGE_KEY, JSON.stringify(remaining));
      } catch (e) {
        console.error(e);
      }
      showToast('Record deleted.');
    }
  };

  const formatTimeAgo = (isoString: string) => {
    const ms = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(ms / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">Abandoned Checkouts</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {carts.length} Leads Logged
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Automatically logs customer email addresses during checkout so you can re-engage buyers who left without finishing their purchase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCarts(getStoredAbandonedCarts());
              showToast('Refreshed abandoned carts list.');
            }}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-gray-500">Unrecovered Carts</span>
            <div className="text-xl font-bold text-gray-900">{unrecoveredCount}</div>
            <span className="text-[10px] text-rose-600 font-medium">Awaiting action</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-gray-500">At Risk Revenue</span>
            <div className="text-xl font-bold text-gray-900">৳{totalAbandonedValue.toLocaleString()}</div>
            <span className="text-[10px] text-gray-400">Total pipeline potential</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-gray-500">Emails Sent</span>
            <div className="text-xl font-bold text-gray-900">{emailsSentCount}</div>
            <span className="text-[10px] text-blue-600 font-medium">Recovery templates dispatched</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-gray-500">Recovered Revenue</span>
            <div className="text-xl font-bold text-emerald-600">৳{recoveredValue.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-700 font-bold">{recoveredCount} Orders Completed</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer email, name, ID..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-gray-900"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs overflow-x-auto pb-1 max-w-full">
          <span className="text-gray-500 font-medium mr-1">Status:</span>
          {(['all', 'unrecovered', 'email_sent', 'recovered'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st === 'email_sent' ? 'Email Dispatched' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Abandoned Checkouts Table */}
      <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-xs bg-white">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200 uppercase text-[10.5px]">
            <tr>
              <th className="p-3.5">Checkout ID & Time</th>
              <th className="p-3.5">Customer & Email</th>
              <th className="p-3.5">Items in Cart</th>
              <th className="p-3.5">Cart Total</th>
              <th className="p-3.5">Recovery Status</th>
              <th className="p-3.5 text-right">Recovery Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {filteredCarts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  <ShoppingCart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p>No abandoned checkouts found matching your criteria</p>
                </td>
              </tr>
            ) : (
              filteredCarts.map((cart) => (
                <tr key={cart.id} className="hover:bg-gray-50/70 transition-colors">
                  {/* ID & Time */}
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-gray-900 block">{cart.id}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {formatTimeAgo(cart.lastActiveAt)}
                    </span>
                  </td>

                  {/* Customer details */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>{cart.customerName || 'Anonymous Customer'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-600 font-mono text-[11px] mt-0.5">
                      <Mail className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>{cart.email}</span>
                    </div>
                    {cart.phone && (
                      <span className="text-[10px] text-gray-400 block font-mono">
                        Phone: {cart.phone}
                      </span>
                    )}
                  </td>

                  {/* Items Preview */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-2 overflow-hidden">
                        {cart.items.slice(0, 3).map((it, idx) => (
                          <img
                            key={idx}
                            src={it.image}
                            alt={it.name}
                            className="inline-block h-7 w-7 rounded-md ring-2 ring-white object-cover bg-gray-100"
                            title={it.name}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-gray-700 font-semibold ml-1">
                        {cart.items.reduce((s, it) => s + it.quantity, 0)} item(s)
                      </span>
                      <button
                        type="button"
                        onClick={() => setInspectingCart(cart)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition-colors"
                        title="View item breakdown"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Cart Total */}
                  <td className="p-3.5">
                    <span className="font-bold text-rose-600 font-mono text-xs">
                      ৳{cart.subtotal.toLocaleString()}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="p-3.5">
                    {cart.recoveryStatus === 'recovered' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Recovered
                      </span>
                    ) : cart.recoveryStatus === 'email_sent' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          <Mail className="w-3 h-3 text-blue-600" />
                          Email Dispatched ({cart.recoveryEmailCount || 1})
                        </span>
                        {cart.recoveryCouponCode && (
                          <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                            Code: {cart.recoveryCouponCode}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        Not Recovered
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedCartForEmail(cart)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all ${
                          cart.recoveryStatus === 'recovered'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white cursor-pointer hover:shadow-md'
                        }`}
                        title="Open recovery email composer with discount incentives"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Recovery Email</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(cart.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cart Items Details Inspector Modal */}
      {inspectingCart && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 border border-gray-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  Cart Items: {inspectingCart.id}
                </h3>
                <p className="text-xs text-rose-600 font-mono">{inspectingCart.email}</p>
              </div>
              <button
                onClick={() => setInspectingCart(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
              {inspectingCart.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-500">
                      Qty: {item.quantity} {item.color ? `• Color: ${item.color}` : ''}
                    </p>
                    <p className="text-xs font-bold text-rose-600 font-mono mt-0.5">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Subtotal:</span>
              <span className="text-sm font-black text-rose-600 font-mono">
                ৳{inspectingCart.subtotal.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInspectingCart(null)}
                className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = inspectingCart;
                  setInspectingCart(null);
                  setSelectedCartForEmail(target);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Compose Recovery Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Email Modal */}
      <EmailTemplateModal
        isOpen={Boolean(selectedCartForEmail)}
        onClose={() => setSelectedCartForEmail(null)}
        cart={selectedCartForEmail}
        onSendEmail={handleSendRecoveryEmail}
      />
    </div>
  );
};
