import React, { useState } from 'react';
import { X, Send, Mail, CheckCircle, Tag, Sparkles, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { AbandonedCart } from '../../../types';

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: AbandonedCart | null;
  onSendEmail: (cartId: string, emailContent: { subject: string; body: string; couponCode: string; discountPct: number }) => void;
}

export const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({
  isOpen,
  onClose,
  cart,
  onSendEmail
}) => {
  if (!isOpen || !cart) return null;

  const [discountPct, setDiscountPct] = useState<number>(10);
  const [couponCode, setCouponCode] = useState<string>('RECOVER10');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const customerName = cart.customerName || 'Customer';
  const firstItem = cart.items[0];
  const itemsCount = cart.items.reduce((s, it) => s + it.quantity, 0);

  // Template pre-fill
  const [subject, setSubject] = useState(
    `আপনি কি কিছু ভুলে গেছেন? সম্পন্ন করুন আপনার অর্ডার ও উপভোগ করুন ${discountPct}% ডিসকাউন্ট!`
  );

  const handleDiscountChange = (pct: number) => {
    setDiscountPct(pct);
    const newCode = `RECOVER${pct}`;
    setCouponCode(newCode);
    setSubject(`আপনি কি কিছু ভুলে গেছেন? সম্পন্ন করুন আপনার অর্ডার ও উপভোগ করুন ${pct}% ডিসকাউন্ট!`);
  };

  const handleTriggerSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      onSendEmail(cart.id, {
        subject,
        body: `Dear ${customerName}, your cart with ${itemsCount} item(s) is waiting! Use code ${couponCode} for ${discountPct}% discount.`,
        couponCode,
        discountPct
      });
      setTimeout(() => {
        setIsSent(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                <span>Send Abandoned Cart Recovery Email</span>
                <span className="text-[10px] bg-rose-500/30 text-rose-300 px-2 py-0.5 rounded-full font-mono">
                  {cart.id}
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                To: <span className="text-white font-mono">{cart.email}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Recovery Email Dispatched!</h3>
            <p className="text-xs text-gray-500">
              Template email with coupon code <strong>{couponCode}</strong> ({discountPct}% OFF) was delivered to{' '}
              <span className="font-mono text-gray-700">{cart.email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleTriggerSend} className="p-4 sm:p-6 space-y-4 text-xs">
            {/* Customer & Cart Quick Summary */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-gray-900 text-xs sm:text-sm">{customerName}</p>
                <p className="text-gray-500 text-[11px]">
                  Phone: {cart.phone || 'N/A'} • Location: {cart.cityDivision || 'Dhaka'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">Total Cart Value</span>
                <span className="text-sm font-black font-mono text-rose-600">
                  ৳{cart.subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Recovery Offer Presets */}
            <div>
              <label className="block font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Recovery Discount Incentive</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleDiscountChange(pct)}
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      discountPct === pct
                        ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-xs font-black">{pct}% OFF</span>
                    <span className="text-[10px] font-mono text-gray-400">RECOVER{pct}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Subject Line */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-900 bg-white"
              />
            </div>

            {/* Rich HTML-style Email Preview Box */}
            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center justify-between">
                <span>Email Body Template Preview</span>
                <span className="text-[10px] text-gray-400 font-normal">Responsive Customer Layout</span>
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                {/* Email Header */}
                <div className="bg-[#f8f9fa] border-b border-gray-200 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-rose-600 tracking-tight text-xs">GPE Bangladesh</span>
                    <span className="text-[10px] text-gray-400">| Shopping Cart Reminder</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    Official Template
                  </span>
                </div>

                {/* Email Content Body */}
                <div className="p-4 space-y-3 bg-[#fafbfc]">
                  <p className="text-gray-800 font-semibold">
                    হ্যালো {customerName},
                  </p>
                  <p className="text-gray-600 leading-relaxed text-[11.5px]">
                    আপনি সম্প্রতি আমাদের স্টোরে কিছু দুর্দান্ত পণ্য চেকআউট শুরু করেছিলেন, কিন্তু অর্ডারটি এখনো চূড়ান্ত করা হয়নি। পণ্যগুলো সীমিত স্টকে রয়েছে এবং আপনার জন্য কার্টে সংরক্ষিত আছে!
                  </p>

                  {/* Cart Items Box in Email */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Reserved Items ({cart.items.length})
                    </p>
                    {cart.items.slice(0, 3).map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-10 h-10 object-cover rounded-md border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-[11px]">{it.name}</p>
                          <p className="text-gray-500 text-[10px]">
                            Qty: {it.quantity} {it.color ? `• Color: ${it.color}` : ''}
                          </p>
                        </div>
                        <span className="font-bold text-gray-900 font-mono text-[11px]">
                          ৳{(it.price * it.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {cart.items.length > 3 && (
                      <p className="text-[10.5px] text-gray-400 italic">
                        + {cart.items.length - 3} more items in cart
                      </p>
                    )}
                  </div>

                  {/* Exclusive Recovery Discount Box */}
                  <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-lg p-3 text-center space-y-1">
                    <span className="text-[11px] font-bold text-rose-700">
                      আপনার জন্য বিশেষ {discountPct}% এক্সক্লুসিভ ডিসকাউন্ট!
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono font-bold text-sm bg-white px-3 py-1 rounded-md border border-dashed border-rose-300 text-rose-600">
                        {couponCode}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 block">
                      চেকআউটে কুপন কোডটি ব্যবহার করে ডিসকাউন্ট উপভোগ করুন।
                    </span>
                  </div>

                  {/* Call to Action Button */}
                  <div className="text-center pt-1">
                    <div className="inline-block py-2.5 px-6 rounded-lg bg-rose-600 text-white font-bold text-xs shadow-md">
                      অর্ডার সম্পন্ন করতে ক্লিক করুন (Resume Checkout)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#303030] text-white font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Template...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    <span>Trigger Recovery Email</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
