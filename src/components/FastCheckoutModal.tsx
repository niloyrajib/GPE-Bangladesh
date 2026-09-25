import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Truck, CheckCircle, CreditCard, Banknote, AlertCircle, Phone, MapPin, User, FileText, Check, ArrowLeft, Info, Tag, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Coupon, Order, PaymentMethod, CustomPaymentGateway, VendorPaymentConfig } from '../types';
import { STORE_SETTINGS, VALID_COUPONS } from '../data/mockData';
import {
  getPaymentConfigForVendor,
  VENDOR_PAYMENT_RULES_EVENT
} from '../utils/vendorPayments';
import {
  recordAbandonedCheckout,
  markCartAsRecovered
} from '../utils/abandonedCartManager';
import {
  getInstalledApps,
  isBkashEnabled,
  isNagadEnabled,
  isPathaoEnabled,
  isSteadfastEnabled,
  INSTALLED_APPS_UPDATED_EVENT,
  InstalledApp
} from '../utils/appExtensionsHelper';

interface FastCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  directProduct?: {
    product: any;
    quantity: number;
    color?: string;
    size?: string;
  } | null;
  appliedCoupon: Coupon | null;
  coupons?: Coupon[];
  onOrderCompleted: (order: Order) => void;
}

export const FastCheckoutModal: React.FC<FastCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  directProduct,
  appliedCoupon: initialCoupon,
  coupons = VALID_COUPONS,
  onOrderCompleted
}) => {
  if (!isOpen) return null;

  // Coupon state in checkout
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(initialCoupon);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  useEffect(() => {
    setCurrentCoupon(initialCoupon);
  }, [initialCoupon]);

  // Checkout Items: either direct 1-click product or cart items
  const itemsToCheckout = directProduct
    ? [
        {
          id: 'direct-item',
          product: directProduct.product,
          quantity: directProduct.quantity,
          selectedColor: directProduct.color,
          selectedSize: directProduct.size
        }
      ]
    : cartItems;

  const subtotal = itemsToCheckout.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const primaryItem = itemsToCheckout[0];
  const currentVendor =
    directProduct?.product?.vendor ||
    directProduct?.product?.brand ||
    primaryItem?.product?.vendor ||
    primaryItem?.product?.brand ||
    'GPE Bangladesh';

  const productOverride = directProduct?.product
    ? {
        allowedPaymentMethods: directProduct.product.allowedPaymentMethods,
        vendorPaymentNote: directProduct.product.vendorPaymentNote,
        requireAdvancePayment: directProduct.product.requireAdvancePayment,
        advanceAmount: directProduct.product.advanceAmount
      }
    : primaryItem?.product
    ? {
        allowedPaymentMethods: primaryItem.product.allowedPaymentMethods,
        vendorPaymentNote: primaryItem.product.vendorPaymentNote,
        requireAdvancePayment: primaryItem.product.requireAdvancePayment,
        advanceAmount: primaryItem.product.advanceAmount
      }
    : undefined;

  const [vendorConfig, setVendorConfig] = useState<VendorPaymentConfig>(() =>
    getPaymentConfigForVendor(currentVendor, productOverride)
  );

  useEffect(() => {
    const updateConfig = () => {
      setVendorConfig(getPaymentConfigForVendor(currentVendor, productOverride));
    };
    updateConfig();
    window.addEventListener(VENDOR_PAYMENT_RULES_EVENT, updateConfig);
    return () => window.removeEventListener(VENDOR_PAYMENT_RULES_EVENT, updateConfig);
  }, [currentVendor, directProduct, cartItems]);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cityDivision, setCityDivision] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    (vendorConfig.defaultPaymentMethod as PaymentMethod) || 'cod'
  );
  const [trxId, setTrxId] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-log abandoned checkout when customer enters an email address
  useEffect(() => {
    const trimmed = customerEmail.trim();
    // Validate basic email format
    if (trimmed.length > 5 && trimmed.includes('@') && trimmed.includes('.')) {
      const abandonedItems = itemsToCheckout.map((it) => ({
        productId: it.product.id,
        name: it.product.name,
        image: it.product.images[0],
        price: it.product.price,
        quantity: it.quantity,
        color: it.selectedColor,
        size: it.selectedSize
      }));

      recordAbandonedCheckout({
        email: trimmed,
        customerName: customerName.trim() || undefined,
        phone: phone.trim() || undefined,
        cityDivision,
        items: abandonedItems,
        subtotal
      });
    }
  }, [customerEmail, customerName, phone, cityDivision, subtotal, itemsToCheckout]);

  // Load custom API payment gateways from storage / settings
  const [customGateways, setCustomGateways] = useState<CustomPaymentGateway[]>([]);

  // Sync payment method when vendor config or installed apps change
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>(() => getInstalledApps());

  useEffect(() => {
    const handleAppsUpdate = () => {
      setInstalledApps(getInstalledApps());
    };
    window.addEventListener(INSTALLED_APPS_UPDATED_EVENT, handleAppsUpdate);
    window.addEventListener('storage', handleAppsUpdate);
    return () => {
      window.removeEventListener(INSTALLED_APPS_UPDATED_EVENT, handleAppsUpdate);
      window.removeEventListener('storage', handleAppsUpdate);
    };
  }, []);

  const bkashAppEnabled = isBkashEnabled(installedApps);
  const nagadAppEnabled = isNagadEnabled(installedApps);
  const pathaoAppEnabled = isPathaoEnabled(installedApps);
  const steadfastAppEnabled = isSteadfastEnabled(installedApps);

  useEffect(() => {
    const allowed = vendorConfig.allowedPaymentMethods || ['cod', 'bkash', 'nagad'];
    const isCurrentMethodDisabled =
      (paymentMethod === 'bkash' && !bkashAppEnabled) ||
      (paymentMethod === 'nagad' && !nagadAppEnabled);

    if (isCurrentMethodDisabled || (!allowed.includes(paymentMethod) && !allowed.includes('custom'))) {
      let fallback: PaymentMethod = 'cod';
      if (allowed.includes('cod')) {
        fallback = 'cod';
      } else if (allowed.includes('bkash') && bkashAppEnabled) {
        fallback = 'bkash';
      } else if (allowed.includes('nagad') && nagadAppEnabled) {
        fallback = 'nagad';
      } else if (customGateways.length > 0) {
        fallback = customGateways[0].id as PaymentMethod;
      }
      setPaymentMethod(fallback);
    }
  }, [vendorConfig, bkashAppEnabled, nagadAppEnabled, paymentMethod, customGateways]);

  useEffect(() => {
    const loadGateways = () => {
      try {
        const saved = localStorage.getItem('banglaxpress_custom_gateways');
        if (saved) {
          const parsed = JSON.parse(saved);
          setCustomGateways(parsed.filter((g: any) => g.enabled));
        } else {
          // Default presets for fast out-of-the-box checkout
          const defaults: CustomPaymentGateway[] = [
            {
              id: 'gw-upay',
              name: 'Upay Merchant Payment API',
              category: 'mfs',
              provider: 'Upay (UCB)',
              description: 'Direct tokenized payment processing through UCB Upay wallet.',
              enabled: true,
              mode: 'live',
              iconBg: '#0057B8',
              iconText: 'Up',
              merchantId: 'UPAY_MERCHANT_99812',
              apiKey: 'upay_live_client_849201948271',
              endpointUrl: 'https://pg.api.upay.systems/payment/v1/initiate-payment',
              webhookUrl: 'https://api.banglaxpress.store/v1/payments/upay/callback',
              currency: 'BDT (৳)',
              checkoutInstructions: 'আপনার Upay অ্যাপ বা *২৬৮# ডায়াল করে পেমেন্ট সম্পন্ন করে TrxID দিন।',
              createdAt: '2026-03-12'
            },
            {
              id: 'gw-rocket',
              name: 'Rocket Merchant Direct Gateway',
              category: 'mfs',
              provider: 'DBBL Rocket',
              description: 'Official DBBL Rocket Merchant API integration.',
              enabled: true,
              mode: 'live',
              iconBg: '#8C1D82',
              iconText: 'Rk',
              merchantId: 'DBBL_MERCHANT_1092',
              apiKey: 'dbbl_rocket_live_992014820',
              endpointUrl: 'https://rocket.dutchbanglabank.com/api/v2/payment/direct',
              webhookUrl: 'https://api.banglaxpress.store/v1/payments/rocket/callback',
              currency: 'BDT (৳)',
              checkoutInstructions: 'রকেট একাউন্ট থেকে Merchant Pay অপশনে পেমেন্ট করে TrxID প্রদান করুন।',
              createdAt: '2026-03-13'
            }
          ];
          localStorage.setItem('banglaxpress_custom_gateways', JSON.stringify(defaults));
          setCustomGateways(defaults);
        }
      } catch (e) {
        console.error('Failed to load payment gateways in checkout:', e);
      }
    };
    loadGateways();
    window.addEventListener('payment_gateways_updated', loadGateways);
    return () => window.removeEventListener('payment_gateways_updated', loadGateways);
  }, []);

  // Delivery fee logic
  const isFreeDelivery = subtotal >= STORE_SETTINGS.freeDeliveryThreshold;
  const deliveryCharge = isFreeDelivery
    ? 0
    : cityDivision === 'Inside Dhaka'
    ? STORE_SETTINGS.deliveryInsideDhaka
    : STORE_SETTINGS.deliveryOutsideDhaka;

  // Coupon discount calculation
  let discountAmount = 0;
  if (currentCoupon) {
    if (currentCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * currentCoupon.amount) / 100);
    } else {
      discountAmount = currentCoupon.amount;
    }
  }

  const handleApplyCouponCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const searchList = coupons && coupons.length > 0 ? coupons : VALID_COUPONS;
    const matched = searchList.find((c) => c.code.toUpperCase() === couponCodeInput.trim().toUpperCase());
    if (!matched) {
      setCouponError('অবৈধ কুপন কোড (Invalid coupon code)');
      return;
    }

    const todayIso = new Date().toISOString().split('T')[0];
    if (matched.status === 'expired' || (matched.expiryDate && matched.expiryDate < todayIso)) {
      setCouponError(`কুপন '${matched.code}' এর মেয়াদ শেষ হয়ে গেছে (Expired)`);
      return;
    }

    if (subtotal < matched.minSpend) {
      setCouponError(`এই কুপনের জন্য ন্যূনতম ৳${matched.minSpend.toLocaleString()} টাকার অর্ডার আবশ্যক`);
      return;
    }

    setCurrentCoupon(matched);
    setCouponSuccess(`কুপন '${matched.code}' সফলভাবে প্রয়োগ করা হয়েছে!`);
    setCouponCodeInput('');
  };

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  const selectedCustomGateway = customGateways.find((g) => g.id === paymentMethod);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!customerName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার পুরো নাম লিখুন (Please enter your name)');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11 || (!cleanPhone.startsWith('01') && !cleanPhone.startsWith('8801'))) {
      setErrorMsg('অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMsg('অনুগ্রহ করে আপনার বিস্তারিত ডেলিভারি ঠিকানা লিখুন (বাসা/রোড/থানা/জেলা)');
      return;
    }

    const isCustomMethod = customGateways.some(g => g.id === paymentMethod);
    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket' || isCustomMethod) && !trxId.trim()) {
      setErrorMsg('অনুগ্রহ করে সফল পেমেন্টের পর TrxID বা ট্রানজেকশন আইডি প্রদান করুন');
      return;
    }

    setIsSubmitting(true);

    // Simulate fast order processing like Laravel backend
    setTimeout(() => {
      const generatedOrderId = `GPE-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const newOrder: Order = {
        id: generatedOrderId,
        createdAt: new Date().toLocaleString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customerName: customerName.trim(),
        phone: cleanPhone,
        address: address.trim(),
        cityDivision,
        district: cityDivision === 'Inside Dhaka' ? 'Dhaka' : district,
        deliveryCharge,
        items: itemsToCheckout.map((it) => ({
          productId: it.product.id,
          name: it.product.name,
          image: it.product.images[0],
          price: it.product.price,
          quantity: it.quantity,
          color: it.selectedColor,
          size: it.selectedSize
        })),
        subtotal,
        discount: discountAmount,
        couponCode: currentCoupon?.code,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
        trxId: trxId.trim() || undefined,
        status: 'pending',
        courierName: steadfastAppEnabled && pathaoAppEnabled
          ? (cityDivision === 'Inside Dhaka' ? 'Steadfast Express' : 'Pathao Courier Hub')
          : (steadfastAppEnabled ? 'Steadfast Express' : (pathaoAppEnabled ? 'Pathao Courier Hub' : 'In-House Express Logistics')),
        trackingNumber: `EXP-${Math.floor(100000 + Math.random() * 900000)}`,
        customerNotes: customerNotes.trim() || undefined,
        vendor: currentVendor,
        timeline: [
          {
            status: 'pending',
            title: 'Order Placed (অর্ডার গৃহীত হয়েছে)',
            description: `অর্ডার আইডি ${generatedOrderId} সিস্টেমে সফলভাবে সংরক্ষিত হয়েছে।`,
            timestamp: 'Just now',
            completed: true
          },
          {
            status: 'confirmed',
            title: 'Order Verification (ভেরিফিকেশন)',
            description: 'আমাদের কাস্টমার কেয়ার প্রতিনিধি ফোন কলের মাধ্যমে অর্ডার নিশ্চিত করবে।',
            timestamp: 'Upcoming (15-30 Mins)',
            completed: false
          },
          {
            status: 'processing',
            title: 'Warehouse Packing (প্যাকিং)',
            description: 'মান যাচাই ও বাবল র‍্যাপ দিয়ে প্যাকেজিং সম্পন্ন করা হবে।',
            timestamp: 'Estimated Today',
            completed: false
          },
          {
            status: 'shipped',
            title: 'Handed Over to Courier (কুরিয়ারে হস্তান্তর)',
            description: 'রাইডার পণ্য পৌঁছে দিতে আপনার ঠিকানার উদ্দেশ্যে রওনা হবে।',
            timestamp: cityDivision === 'Inside Dhaka' ? 'Within 24 Hours' : 'Within 48 Hours',
            completed: false
          },
          {
            status: 'delivered',
            title: 'Delivered (ডেলিভারি সম্পন্ন)',
            description: 'পণ্য হাতে পেয়ে মূল্য পরিশোধ করবেন।',
            timestamp: 'Pending Delivery',
            completed: false
          }
        ]
      };

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if not supported
      }

      setIsSubmitting(false);
      if (customerEmail.trim()) {
        markCartAsRecovered(customerEmail.trim());
      } else if (cleanPhone) {
        markCartAsRecovered(cleanPhone);
      }
      onOrderCompleted(newOrder);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-rose-600 to-red-600 p-4 sm:p-5 text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                ১-ক্লিক দ্রুত চেকআউট (Fast Express Checkout)
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                অর্ডার করতে নিচের তথ্যগুলো দিয়ে ফরমটি পূরণ করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-5">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Customer Form (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-rose-600" />
                  <span>আপনার পুরো নাম (Full Name) *</span>
                </label>
                <input
                  id="checkout-name-input"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="যেমন: মোঃ তানভীর হাসান"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 outline-none focus:bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>

              {/* Email Address (for order receipts & abandoned recovery) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-rose-600" />
                    <span>ইমেইল এড্রেস (Email Address)</span>
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">রশিদ ও ডিসকাউন্ট অফার পেতে</span>
                </div>
                <input
                  id="checkout-email-input"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="যেমন: customer@example.com"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 outline-none focus:bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>১১ ডিজিটের মোবাইল নম্বর (Phone Number) *</span>
                </label>
                <input
                  id="checkout-phone-input"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="যেমন: 01712345678"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 font-mono outline-none focus:bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>

              {/* Delivery Zone Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-rose-600" />
                  <span>ডেলিভারি এলাকা নির্বাচন করুন (Delivery Area) *</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCityDivision('Inside Dhaka');
                      setDistrict('Dhaka');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cityDivision === 'Inside Dhaka'
                        ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-200'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">ঢাকা সিটির ভেতরে</span>
                      <span className="text-xs font-black text-rose-600">৳{STORE_SETTINGS.deliveryInsideDhaka}</span>
                    </div>
                    <p className="text-[10.5px] text-gray-500 mt-0.5">২৪ - ৪৮ ঘণ্টায় ডেলিভারি</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCityDivision('Outside Dhaka')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cityDivision === 'Outside Dhaka'
                        ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-200'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">ঢাকা সিটির বাইরে</span>
                      <span className="text-xs font-black text-rose-600">৳{STORE_SETTINGS.deliveryOutsideDhaka}</span>
                    </div>
                    <p className="text-[10.5px] text-gray-500 mt-0.5">সারাদেশে ৪৮ - ৭২ ঘণ্টায়</p>
                  </button>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>সম্পূর্ণ ডেলিভারি ঠিকানা (Detailed Delivery Address) *</span>
                </label>
                <textarea
                  id="checkout-address-input"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="যেমন: বাসা/ফ্ল্যাট নং, রোড নং, এলাকা/থানা, জেলা..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 outline-none focus:bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                />
              </div>

              {/* Payment Methods with Vendor-Wise Customization */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-rose-600" />
                    <span>পেমেন্ট পদ্ধতি নির্বাচন করুন (Payment Method) *</span>
                  </label>
                </div>

                {/* Advance payment notice if enabled for this vendor */}
                {vendorConfig.requireAdvancePayment && (
                  <div className="mb-2.5 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        অগ্রিম পেমেন্ট শর্ত: ৳{vendorConfig.advanceAmount || 100} অগ্রিম পরিশোধ করতে হবে
                      </p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        {vendorConfig.advanceNote || 'এই ভেন্ডরের অর্ডারে ডেলিভারি চার্জ বিকাশ বা নগদে অগ্রিম পরিশোধ সাপেক্ষে কনফার্ম হবে।'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Product Inspection & Authenticity Guarantee Note */}
                <div className="mb-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>অরিজিনাল সকল প্রোডাক্ট ডেলিভারির সময় চেক করে দেখে মূল্য পরিশোধ করুন।</span>
                </div>
                
                <div className="space-y-2">
                  {/* Cash on delivery */}
                  {vendorConfig.allowedPaymentMethods?.includes('cod') ? (
                    <label
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="text-rose-600 focus:ring-rose-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                            <Banknote className="w-4 h-4 text-emerald-600" />
                            <span>ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
                          </p>
                          <p className="text-[11px] text-gray-500">
                            পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        জনপ্রিয়
                      </span>
                    </label>
                  ) : (
                    <div className="p-2.5 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-gray-400 text-xs flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-gray-400" />
                        <span className="text-[11px]">ক্যাশ অন ডেলিভারি (এই ভেন্ডরের জন্য প্রযোজ্য নয়)</span>
                      </div>
                      <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                        COD বন্ধ
                      </span>
                    </div>
                  )}

                  {/* bKash */}
                  {vendorConfig.allowedPaymentMethods?.includes('bkash') && bkashAppEnabled && (
                    <label
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'bkash'
                          ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'bkash'}
                          onChange={() => setPaymentMethod('bkash')}
                          className="text-rose-600 focus:ring-rose-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900">
                            বিকাশ (bKash Merchant Pay)
                          </p>
                          <p className="text-[11px] text-gray-500">
                            মার্চেন্ট নাম্বার: {vendorConfig.customBkashNumber || STORE_SETTINGS.bkashNumber}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded">
                        বিকাশ
                      </span>
                    </label>
                  )}

                  {/* Nagad */}
                  {vendorConfig.allowedPaymentMethods?.includes('nagad') && nagadAppEnabled && (
                    <label
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'nagad'
                          ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'nagad'}
                          onChange={() => setPaymentMethod('nagad')}
                          className="text-rose-600 focus:ring-rose-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900">
                            নগদ (Nagad Merchant Pay)
                          </p>
                          <p className="text-[11px] text-gray-500">
                            মার্চেন্ট নাম্বার: {vendorConfig.customNagadNumber || STORE_SETTINGS.nagadNumber}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                        নগদ
                      </span>
                    </label>
                  )}

                  {/* Custom API Payment Gateways (Upay, Rocket, AamarPay, etc.) */}
                  {vendorConfig.allowedPaymentMethods?.includes('custom') && customGateways.map((gw) => (
                    <label
                      key={gw.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === gw.id
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === gw.id}
                          onChange={() => setPaymentMethod(gw.id)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                            <span>{gw.name}</span>
                            {gw.mode === 'sandbox' && (
                              <span className="text-[9px] font-bold px-1 py-0.2 bg-amber-100 text-amber-800 rounded">
                                Test
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {gw.merchantId ? `মার্চেন্ট আইডি: ${gw.merchantId}` : gw.provider}
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-mono font-black text-white px-2 py-0.5 rounded shadow-2xs"
                        style={{ backgroundColor: gw.iconBg || '#0057B8' }}
                      >
                        {gw.iconText || 'PAY'}
                      </span>
                    </label>
                  ))}
                </div>

                {/* If bKash or Nagad chosen, show TrxID input */}
                {((paymentMethod === 'bkash' && bkashAppEnabled) || (paymentMethod === 'nagad' && nagadAppEnabled)) && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <p className="font-semibold text-slate-800">
                      পেমেন্ট নির্দেশিকা:
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      আপনার {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} অ্যাপ থেকে Make Payment অপশনে গিয়ে মোট{' '}
                      <strong className="text-rose-600">৳{grandTotal.toLocaleString()}</strong> টাকা পেমেন্ট করুন এবং নিচের ঘরে প্রাপ্ত TrxID লিখুন।
                    </p>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      placeholder="যেমন: BK9A72619Z"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono uppercase outline-none focus:border-rose-600"
                    />
                  </div>
                )}

                {/* If Custom API Gateway chosen, show custom instruction & TrxID input */}
                {selectedCustomGateway && (
                  <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-blue-950 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        <span>{selectedCustomGateway.name} নির্দেশিকা:</span>
                      </p>
                      <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        API Direct Checkout
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px]">
                      {selectedCustomGateway.checkoutInstructions ||
                        `আপনার ${selectedCustomGateway.provider} একাউন্ট থেকে মোট ৳${grandTotal.toLocaleString()} পেমেন্ট সম্পন্ন করে নিচের বক্সে TrxID প্রদান করুন।`}
                    </p>
                    {selectedCustomGateway.merchantId && (
                      <p className="text-[11px] text-blue-900 font-mono bg-white p-1.5 rounded border border-blue-100 inline-block">
                        Merchant Acc: <strong>{selectedCustomGateway.merchantId}</strong>
                      </p>
                    )}
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      placeholder="যেমন: UP7910294 অথবা TrxID"
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-mono uppercase outline-none focus:border-blue-600"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary & Review (5 cols) */}
            <div className="md:col-span-5 bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 pb-2 border-b border-gray-200">
                  অর্ডারকৃত পণ্যের তালিকা ({itemsToCheckout.length})
                </h3>

                {/* Items list */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {itemsToCheckout.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-gray-200">
                      <img
                        src={it.product.images[0]}
                        alt=""
                        className="w-11 h-11 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {it.product.name}
                        </p>
                        {it.selectedColor && (
                          <p className="text-[10.5px] text-gray-500 truncate">
                            রঙ: {it.selectedColor}
                          </p>
                        )}
                        <div className="flex justify-between items-center text-xs mt-0.5">
                          <span className="text-gray-500">পরিমাণ: {it.quantity}</span>
                          <span className="font-bold text-rose-600">
                            ৳{(it.product.price * it.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section in Checkout */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  {currentCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>কুপন কোড: <strong>{currentCoupon.code}</strong> (-৳{discountAmount})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentCoupon(null);
                          setCouponSuccess('');
                          setCouponError('');
                        }}
                        className="text-rose-600 hover:text-rose-800 font-bold text-xs"
                      >
                        মুছুন
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={couponCodeInput}
                          onChange={(e) => setCouponCodeInput(e.target.value)}
                          placeholder="কুপন কোড লিখুন"
                          className="flex-1 px-2.5 py-1.5 text-xs uppercase bg-white border border-gray-300 rounded-lg outline-none focus:border-rose-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCouponCheckout}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                        >
                          প্রয়োগ
                        </button>
                      </div>
                      {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
                      {couponSuccess && <p className="text-[11px] text-emerald-600 mt-1">{couponSuccess}</p>}
                    </div>
                  )}
                </div>

                {/* Calculation breakdown */}
                <div className="mt-4 pt-3 border-t border-gray-200 space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>পণ্যের মোট দাম (Subtotal)</span>
                    <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>কুপন ডিসকাউন্ট</span>
                      <span>-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="font-semibold text-gray-900">
                      {deliveryCharge === 0 ? (
                        <span className="text-emerald-600 font-bold">ফ্রি ডেলিভারি</span>
                      ) : (
                        `৳${deliveryCharge}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                    <span>সর্বমোট প্রদেয় বিল:</span>
                    <span className="text-lg text-rose-600 font-mono font-black">
                      ৳{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
                  <p className="flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    কোনো অগ্রিম পেমেন্ট ছাড়াই অর্ডার করুন
                  </p>
                  <p className="text-emerald-700">
                    পণ্য রিসিভ করে চেক করার পর ডেলিভারি ম্যানকে সম্পূর্ণ মূল্য পরিশোধ করবেন।
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-5">
                <button
                  id="fast-checkout-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-75 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>অর্ডার কনফার্ম করুন • ৳{grandTotal.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
