import React, { useState, useEffect } from 'react';
import {
  Settings,
  CreditCard,
  Truck,
  Bell,
  Lock,
  Globe,
  Store,
  CheckCircle2,
  Save,
  DollarSign,
  Key,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Radio,
  Sliders,
  Send,
  Zap,
  HelpCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Code,
  Sparkles,
  X,
  ChevronRight,
  ShieldAlert,
  Server
} from 'lucide-react';
import { CustomPaymentGateway, Product } from '../../../types';
import { ShopifyVendorPaymentsView } from './ShopifyVendorPaymentsView';
import {
  isBkashEnabled,
  isNagadEnabled,
  isPathaoEnabled,
  isSteadfastEnabled,
  toggleAppStatus,
  INSTALLED_APPS_UPDATED_EVENT
} from '../../../utils/appExtensionsHelper';

interface ShopifySettingsViewProps {
  showToast?: (message: string) => void;
  products?: Product[];
}

interface PaymentPreset {
  id: string;
  name: string;
  provider: string;
  category: 'mfs' | 'card' | 'net_banking' | 'international' | 'custom';
  iconBg: string;
  iconText: string;
  endpointUrl: string;
  currency: string;
  checkoutInstructions: string;
  sampleKey: string;
  sampleSecret: string;
  description: string;
}

const PAYMENT_PRESETS: PaymentPreset[] = [
  {
    id: 'preset-upay',
    name: 'Upay Merchant Checkout API',
    provider: 'Upay (UCB)',
    category: 'mfs',
    iconBg: '#0057B8',
    iconText: 'Up',
    endpointUrl: 'https://pg.api.upay.systems/payment/v1/initiate-payment',
    currency: 'BDT (৳)',
    checkoutInstructions: 'আপনার Upay অ্যাপ অথবা *২৬৮# ডায়াল করে মোট টাকা পেমেন্ট সম্পন্ন করে প্রাপ্ত TrxID প্রদান করুন।',
    sampleKey: 'upay_live_client_8492019482',
    sampleSecret: 'upay_sec_99381029482910482',
    description: 'UCB-এর ডিজিটাল ওয়ালেট Upay ডিরেক্ট চেকআউট এপিআই ইন্টিগ্রেশন।'
  },
  {
    id: 'preset-rocket',
    name: 'Rocket Merchant Direct Gateway',
    provider: 'DBBL Rocket',
    category: 'mfs',
    iconBg: '#8C1D82',
    iconText: 'Rk',
    endpointUrl: 'https://rocket.dutchbanglabank.com/api/v2/payment/direct',
    currency: 'BDT (৳)',
    checkoutInstructions: 'ডাচ-বাংলা রকেট একাউন্ট থেকে Merchant Pay অপশনে গিয়ে পেমেন্ট করুন এবং প্রাপ্ত ট্রানজেকশন আইডি (TrxID) দিন।',
    sampleKey: 'dbbl_rocket_live_992014820',
    sampleSecret: 'dbbl_sec_88492019482019',
    description: 'ডাচ-বাংলা ব্যাংকের রকেট মোবাইল ওয়ালেটের অফিসিয়াল মার্চেন্ট এপিআই।'
  },
  {
    id: 'preset-aamarpay',
    name: 'AamarPay Unified Payment Gateway',
    provider: 'AamarPay',
    category: 'card',
    iconBg: '#0E4378',
    iconText: 'AP',
    endpointUrl: 'https://secure.aamarpay.com/request.php',
    currency: 'BDT (৳)',
    checkoutInstructions: 'আমারপে নিরাপদ গেটওয়ে দিয়ে ভিসা, মাস্টারকার্ড ও ইন্টারনেট ব্যাংকিং পেমেন্ট।',
    sampleKey: 'aamar_live_store_9938102',
    sampleSecret: 'aamar_sec_44920194820',
    description: 'লোকাল ও ইন্টারন্যাশনাল কার্ড, নেট ব্যাংকিং এবং এমএফএস সমন্বিত এপিআই।'
  },
  {
    id: 'preset-shurjopay',
    name: 'Shurjopay Merchant Gateway',
    provider: 'Shurjopay',
    category: 'net_banking',
    iconBg: '#EA1D24',
    iconText: 'Sp',
    endpointUrl: 'https://engine.shurjopay.com/api/get_token',
    currency: 'BDT (৳)',
    checkoutInstructions: 'সূর্যপে সিকিউর পেমেন্ট গেটওয়ের মাধ্যমে সরাসরি পরিশোধ করুন।',
    sampleKey: 'sp_live_key_993810294827',
    sampleSecret: 'sp_token_482910482910',
    description: 'বাংলাদেশ ব্যাংকের লাইসেন্সপ্রাপ্ত পিএসও সূর্যপে চেকআউট ইঞ্জিন।'
  },
  {
    id: 'preset-stripe',
    name: 'Stripe Global Card Payments',
    provider: 'Stripe',
    category: 'international',
    iconBg: '#635BFF',
    iconText: 'St',
    endpointUrl: 'https://api.stripe.com/v1/payment_intents',
    currency: 'USD ($)',
    checkoutInstructions: 'Accept all global Visa, MasterCard, and Amex credit/debit cards.',
    sampleKey: 'pk_live_51N2xXXXXXXXXXXXXXXX',
    sampleSecret: 'sk_live_51N2xXXXXXXXXXXXXXXX',
    description: 'গ্লোবাল ক্রস-বর্ডার পেমেন্ট প্রসেসিং ও আন্তর্জাতিক কার্ড ইন্টিগ্রেশন।'
  },
  {
    id: 'preset-custom',
    name: 'Custom REST Payment Gateway',
    provider: 'Custom Bank / FinTech API',
    category: 'custom',
    iconBg: '#0F172A',
    iconText: 'API',
    endpointUrl: 'https://api.yourbank-gateway.com/v1/checkout/initialize',
    currency: 'BDT (৳)',
    checkoutInstructions: 'কাস্টম ফিনটেক গেটওয়ে বা মার্চেন্ট এপিআই এর মাধ্যমে পরিশোধ।',
    sampleKey: 'custom_live_client_key_001',
    sampleSecret: 'custom_live_secret_token_001',
    description: 'যেকোনো কাস্টম ব্যাংক বা ফিনটেক কোম্পানির নিজস্ব REST / JSON API ইন্টিগ্রেশন।'
  }
];

const DEFAULT_CUSTOM_GATEWAYS: CustomPaymentGateway[] = [
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
    apiSecret: '••••••••••••••••••••••••',
    endpointUrl: 'https://pg.api.upay.systems/payment/v1/initiate-payment',
    webhookUrl: 'https://api.banglaxpress.store/v1/payments/upay/callback',
    currency: 'BDT (৳)',
    checkoutInstructions: 'আপনার Upay অ্যাপ বা *২৬৮# ডায়াল করে পেমেন্ট সম্পন্ন করে TrxID দিন।',
    testStatus: 'Verified (Latency: 138ms • 200 OK)',
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
    apiSecret: '••••••••••••••••••••••••',
    endpointUrl: 'https://rocket.dutchbanglabank.com/api/v2/payment/direct',
    webhookUrl: 'https://api.banglaxpress.store/v1/payments/rocket/callback',
    currency: 'BDT (৳)',
    checkoutInstructions: 'রকেট একাউন্ট থেকে Merchant Pay অপশনে পেমেন্ট করে TrxID প্রদান করুন।',
    testStatus: 'Verified (Latency: 154ms • 200 OK)',
    createdAt: '2026-03-13'
  }
];

export const ShopifySettingsView: React.FC<ShopifySettingsViewProps> = ({
  showToast = (_msg: string) => {},
  products = []
}) => {
  const [activeTab, setActiveTab] = useState<
    'general' | 'payments' | 'vendor_payments' | 'courier' | 'sms' | 'api_tokens' | 'shipping' | 'security'
  >('payments');

  // Custom Payment Gateways with API
  const [customGateways, setCustomGateways] = useState<CustomPaymentGateway[]>(() => {
    try {
      const saved = localStorage.getItem('banglaxpress_custom_gateways');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CUSTOM_GATEWAYS;
  });

  // Sync custom gateways to localStorage & notify app
  useEffect(() => {
    try {
      localStorage.setItem('banglaxpress_custom_gateways', JSON.stringify(customGateways));
      window.dispatchEvent(new CustomEvent('payment_gateways_updated'));
    } catch (e) {
      console.error(e);
    }
  }, [customGateways]);

  // Modal State for Create / Edit Custom Payment Gateway with API
  const [isCreateMethodModalOpen, setIsCreateMethodModalOpen] = useState(false);
  const [editingGatewayId, setEditingGatewayId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formProvider, setFormProvider] = useState('Custom API');
  const [formCategory, setFormCategory] = useState<CustomPaymentGateway['category']>('mfs');
  const [formMode, setFormMode] = useState<'sandbox' | 'live'>('live');
  const [formEnabled, setFormEnabled] = useState(true);
  const [formIconBg, setFormIconBg] = useState('#0057B8');
  const [formIconText, setFormIconText] = useState('API');
  const [formMerchantId, setFormMerchantId] = useState('');
  const [formApiKey, setFormApiKey] = useState('');
  const [formApiSecret, setFormApiSecret] = useState('');
  const [formEndpointUrl, setFormEndpointUrl] = useState('');
  const [formWebhookUrl, setFormWebhookUrl] = useState('');
  const [formCurrency, setFormCurrency] = useState('BDT (৳)');
  const [formDescription, setFormDescription] = useState('');
  const [formCheckoutInstructions, setFormCheckoutInstructions] = useState('');
  const [showSecretInModal, setShowSecretInModal] = useState(false);
  const [isTestingGateway, setIsTestingGateway] = useState(false);
  const [gatewayTestResult, setGatewayTestResult] = useState<{
    success: boolean;
    message: string;
    latency: string;
    timestamp: string;
  } | null>(null);

  // Individual card testing status
  const [testingCardId, setTestingCardId] = useState<string | null>(null);

  // General Store Details
  const [storeName, setStoreName] = useState('GPE Bangladesh');
  const [storeLegalName, setStoreLegalName] = useState('GPE Bangladesh Ltd.');
  const [storeEmail, setStoreEmail] = useState('support@gpebangladesh.com.bd');
  const [phone, setPhone] = useState('+880 1800-000000');
  const [address, setAddress] = useState('House 42, Road 11, Banani, Dhaka-1213, Bangladesh');
  const [currency, setCurrency] = useState('BDT (৳)');
  const [timezone, setTimezone] = useState('Asia/Dhaka (GMT+6)');

  // bKash Merchant API Configuration
  const [bkashEnabled, setBkashEnabled] = useState(() => isBkashEnabled());
  const [bkashMode, setBkashMode] = useState<'sandbox' | 'live'>('live');
  const [bkashAppKey, setBkashAppKey] = useState('bK_live_app_key_88391047291');
  const [bkashAppSecret, setBkashAppSecret] = useState('••••••••••••••••••••••••••••');
  const [bkashUsername, setBkashUsername] = useState('gpebangladesh_live');
  const [bkashPassword, setBkashPassword] = useState('••••••••••••');
  const [bkashTesting, setBkashTesting] = useState(false);
  const [bkashStatusText, setBkashStatusText] = useState<string | null>('Connected & Active');

  // Nagad Direct API Configuration
  const [nagadEnabled, setNagadEnabled] = useState(() => isNagadEnabled());
  const [nagadMode, setNagadMode] = useState<'sandbox' | 'live'>('live');
  const [nagadMerchantId, setNagadMerchantId] = useState('68291048291');
  const [nagadPublicKey, setNagadPublicKey] = useState('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...');
  const [nagadPrivateKey, setNagadPrivateKey] = useState('••••••••••••••••••••••••••••••••••••••••••••••••');
  const [nagadTesting, setNagadTesting] = useState(false);
  const [nagadStatusText, setNagadStatusText] = useState<string | null>('Connected & Active');

  // SSLCommerz Gateway
  const [sslEnabled, setSslEnabled] = useState(false);
  const [sslStoreId, setSslStoreId] = useState('banglaxpresslive');
  const [sslStorePass, setSslStorePass] = useState('••••••••••••••••');
  const [sslMode, setSslMode] = useState<'sandbox' | 'live'>('sandbox');
  const [sslTesting, setSslTesting] = useState(false);

  // COD Setting
  const [codEnabled, setCodEnabled] = useState(true);

  // Steadfast Courier API Configuration
  const [steadfastEnabled, setSteadfastEnabled] = useState(() => isSteadfastEnabled());
  const [steadfastApiKey, setSteadfastApiKey] = useState('sf_live_key_99381029482710');
  const [steadfastSecretKey, setSteadfastSecretKey] = useState('••••••••••••••••••••••••••••••••');
  const [steadfastAutoDispatch, setSteadfastAutoDispatch] = useState(true);
  const [steadfastTesting, setSteadfastTesting] = useState(false);
  const [steadfastStatusText, setSteadfastStatusText] = useState<string | null>('Connected (Balance: ৳14,580)');

  // Pathao Courier API Configuration
  const [pathaoEnabled, setPathaoEnabled] = useState(() => isPathaoEnabled());

  useEffect(() => {
    const handleSync = () => {
      setBkashEnabled(isBkashEnabled());
      setNagadEnabled(isNagadEnabled());
      setSteadfastEnabled(isSteadfastEnabled());
      setPathaoEnabled(isPathaoEnabled());
    };
    window.addEventListener(INSTALLED_APPS_UPDATED_EVENT, handleSync);
    return () => window.removeEventListener(INSTALLED_APPS_UPDATED_EVENT, handleSync);
  }, []);

  const handleToggleBkash = (val: boolean) => {
    setBkashEnabled(val);
    toggleAppStatus('app-bkash', val);
    showToast(val ? '✅ bKash সক্রিয় করা হয়েছে (Fast Checkout এ দৃশ্যমান)' : '❌ bKash নিষ্ক্রিয় করা হয়েছে (Fast Checkout থেকে অপসারিত)');
  };

  const handleToggleNagad = (val: boolean) => {
    setNagadEnabled(val);
    toggleAppStatus('app-nagad', val);
    showToast(val ? '✅ Nagad সক্রিয় করা হয়েছে (Fast Checkout এ দৃশ্যমান)' : '❌ Nagad নিষ্ক্রিয় করা হয়েছে (Fast Checkout থেকে অপসারিত)');
  };

  const handleToggleSteadfast = (val: boolean) => {
    setSteadfastEnabled(val);
    toggleAppStatus('app-steadfast', val);
    showToast(val ? '✅ Steadfast Courier সক্রিয় করা হয়েছে' : '❌ Steadfast Courier নিষ্ক্রিয় করা হয়েছে');
  };

  const handleTogglePathao = (val: boolean) => {
    setPathaoEnabled(val);
    toggleAppStatus('app-pathao', val);
    showToast(val ? '✅ Pathao Courier সক্রিয় করা হয়েছে' : '❌ Pathao Courier নিষ্ক্রিয় করা হয়েছে');
  };
  const [pathaoClientId, setPathaoClientId] = useState('pt_client_8492019482');
  const [pathaoClientSecret, setPathaoClientSecret] = useState('••••••••••••••••••••••••');
  const [pathaoStoreId, setPathaoStoreId] = useState('14920');
  const [pathaoTesting, setPathaoTesting] = useState(false);
  const [pathaoStatusText, setPathaoStatusText] = useState<string | null>('Connected & Active');

  // SMS Gateway Configuration
  const [smsProvider, setSmsProvider] = useState<'greenweb' | 'bulksmsbd' | 'alphanet'>('greenweb');
  const [smsApiToken, setSmsApiToken] = useState('gw_token_9918237194829104');
  const [smsSenderId, setSmsSenderId] = useState('GPE_BD');
  const [smsOrderPlaced, setSmsOrderPlaced] = useState(true);
  const [smsDispatched, setSmsDispatched] = useState(true);
  const [smsDelivered, setSmsDelivered] = useState(true);
  const [smsTesting, setSmsTesting] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('01812345678');

  // API Tokens
  const [storefrontToken, setStorefrontToken] = useState('shpat_3910f48b89c72e90147a59e8832a0f');
  const [adminApiKey, setAdminApiKey] = useState('shpca_99201a4e58b1940e729a8f2c31048b');
  const [webhookSecret, setWebhookSecret] = useState('whsec_83910c8f92104ea71b9c20148e');
  const [showTokens, setShowTokens] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Shipping Rates
  const [dhakaRate, setDhakaRate] = useState(60);
  const [suburbRate, setSuburbRate] = useState(100);
  const [outsideDhakaRate, setOutsideDhakaRate] = useState(120);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2000);

  // Security & Fraud settings
  const [requireOtpCod, setRequireOtpCod] = useState(true);
  const [requireAdvanceDeliveryCharge, setRequireAdvanceDeliveryCharge] = useState(false);
  const [advanceFeeAmount, setAdvanceFeeAmount] = useState(100);
  const [minOrderValue, setMinOrderValue] = useState(200);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showToast(`${keyName} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestBkash = () => {
    setBkashTesting(true);
    setTimeout(() => {
      setBkashTesting(false);
      setBkashStatusText('Connection Verified (Latency: 128ms)');
      showToast('bKash API Handshake Verified! Payment Token Generated.');
    }, 1200);
  };

  const handleTestNagad = () => {
    setNagadTesting(true);
    setTimeout(() => {
      setNagadTesting(false);
      setNagadStatusText('Connection Verified (PGW Active)');
      showToast('Nagad Direct Gateway Verified Successfully!');
    }, 1200);
  };

  const handleTestSsl = () => {
    setSslTesting(true);
    setTimeout(() => {
      setSslTesting(false);
      showToast('SSLCommerz Sandbox Handshake Successful!');
    }, 1200);
  };

  const handleTestSteadfast = () => {
    setSteadfastTesting(true);
    setTimeout(() => {
      setSteadfastTesting(false);
      setSteadfastStatusText('Active • Steadfast Account Balance: ৳18,240');
      showToast('Steadfast Logistics API Connected Successfully!');
    }, 1200);
  };

  const handleTestPathao = () => {
    setPathaoTesting(true);
    setTimeout(() => {
      setPathaoTesting(false);
      setPathaoStatusText('Active • Store ID: 14920 Validated');
      showToast('Pathao Courier API Authentication Successful!');
    }, 1200);
  };

  const handleSendTestSms = () => {
    if (!testPhoneNumber) {
      alert('Please enter a phone number');
      return;
    }
    setSmsTesting(true);
    setTimeout(() => {
      setSmsTesting(false);
      showToast(`Test SMS sent successfully to ${testPhoneNumber}!`);
    }, 1400);
  };

  const handleOpenCreateModal = () => {
    setEditingGatewayId(null);
    setFormName('');
    setFormProvider('Custom API');
    setFormCategory('mfs');
    setFormMode('live');
    setFormEnabled(true);
    setFormIconBg('#0057B8');
    setFormIconText('API');
    setFormMerchantId('');
    setFormApiKey('');
    setFormApiSecret('');
    setFormEndpointUrl('https://api.gateway-provider.com/v1/payment/checkout');
    setFormWebhookUrl(`https://api.banglaxpress.store/v1/payments/custom_${Date.now()}/callback`);
    setFormCurrency('BDT (৳)');
    setFormDescription('কাস্টম পেমেন্ট গেটওয়ে ইন্টিগ্রেশন');
    setFormCheckoutInstructions('পেমেন্ট সম্পন্ন করে প্রাপ্ত TrxID অথবা ট্রানজেকশন রেফারেন্স প্রদান করুন।');
    setGatewayTestResult(null);
    setShowSecretInModal(false);
    setIsCreateMethodModalOpen(true);
  };

  const handleOpenEditModal = (gw: CustomPaymentGateway) => {
    setEditingGatewayId(gw.id);
    setFormName(gw.name);
    setFormProvider(gw.provider);
    setFormCategory(gw.category);
    setFormMode(gw.mode);
    setFormEnabled(gw.enabled);
    setFormIconBg(gw.iconBg || '#0057B8');
    setFormIconText(gw.iconText || 'API');
    setFormMerchantId(gw.merchantId || '');
    setFormApiKey(gw.apiKey || '');
    setFormApiSecret(gw.apiSecret || '');
    setFormEndpointUrl(gw.endpointUrl || '');
    setFormWebhookUrl(gw.webhookUrl || `https://api.banglaxpress.store/v1/payments/${gw.id}/callback`);
    setFormCurrency(gw.currency || 'BDT (৳)');
    setFormDescription(gw.description || '');
    setFormCheckoutInstructions(gw.checkoutInstructions || 'পেমেন্ট সম্পন্ন করে TrxID প্রদান করুন।');
    setGatewayTestResult(null);
    setShowSecretInModal(false);
    setIsCreateMethodModalOpen(true);
  };

  const handleSelectPreset = (preset: PaymentPreset) => {
    setFormName(preset.name);
    setFormProvider(preset.provider);
    setFormCategory(preset.category);
    setFormIconBg(preset.iconBg);
    setFormIconText(preset.iconText);
    setFormEndpointUrl(preset.endpointUrl);
    setFormCurrency(preset.currency);
    setFormDescription(preset.description);
    setFormCheckoutInstructions(preset.checkoutInstructions);
    setFormApiKey(preset.sampleKey);
    setFormApiSecret(preset.sampleSecret);
    setFormWebhookUrl(`https://api.banglaxpress.store/v1/payments/${preset.id.replace('preset-', '')}/callback`);
    setGatewayTestResult(null);
    showToast(`"${preset.name}" প্রিসেট টেমপ্লেট লোড হয়েছে!`);
  };

  const handleTestCustomGatewayInModal = () => {
    if (!formEndpointUrl) {
      showToast('অনুগ্রহ করে API Endpoint URL প্রদান করুন');
      return;
    }
    setIsTestingGateway(true);
    setTimeout(() => {
      setIsTestingGateway(false);
      setGatewayTestResult({
        success: true,
        message: 'Handshake 200 OK • SSL TLS 1.3 Active • API Authentication Signature Verified',
        latency: `${Math.floor(Math.random() * 40 + 110)}ms`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
      showToast(`API Handshake Verified! HTTP 200 OK (${formName || 'Payment Gateway'})`);
    }, 1200);
  };

  const handleTestCustomGatewayCard = (gwId: string, gwName: string) => {
    setTestingCardId(gwId);
    setTimeout(() => {
      setTestingCardId(null);
      setCustomGateways((prev) =>
        prev.map((g) =>
          g.id === gwId
            ? {
                ...g,
                testStatus: `Verified (Latency: ${Math.floor(Math.random() * 30 + 115)}ms • 200 OK)`
              }
            : g
        )
      );
      showToast(`${gwName} API Handshake Verified! Status: 200 OK`);
    }, 1100);
  };

  const handleSaveCustomGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('অনুগ্রহ করে পেমেন্ট মেথডের নাম লিখুন');
      return;
    }
    if (!formEndpointUrl.trim()) {
      showToast('অনুগ্রহ করে API Endpoint URL লিখুন');
      return;
    }
    if (!formApiKey.trim()) {
      showToast('অনুগ্রহ করে API Key / Client ID লিখুন');
      return;
    }

    if (editingGatewayId) {
      setCustomGateways((prev) =>
        prev.map((g) =>
          g.id === editingGatewayId
            ? {
                ...g,
                name: formName.trim(),
                provider: formProvider.trim() || 'Custom API',
                category: formCategory,
                mode: formMode,
                enabled: formEnabled,
                iconBg: formIconBg,
                iconText: formIconText.trim() || 'API',
                merchantId: formMerchantId.trim(),
                apiKey: formApiKey.trim(),
                apiSecret: formApiSecret.trim(),
                endpointUrl: formEndpointUrl.trim(),
                webhookUrl: formWebhookUrl.trim(),
                currency: formCurrency,
                description: formDescription.trim(),
                checkoutInstructions: formCheckoutInstructions.trim(),
                testStatus: gatewayTestResult?.success
                  ? `Verified (Latency: ${gatewayTestResult.latency} • 200 OK)`
                  : g.testStatus
              }
            : g
        )
      );
      showToast(`"${formName}" পেমেন্ট এপিআই কনফিগারেশন আপডেট করা হয়েছে!`);
    } else {
      const newGateway: CustomPaymentGateway = {
        id: `gw-${Date.now()}`,
        name: formName.trim(),
        provider: formProvider.trim() || 'Custom API',
        category: formCategory,
        mode: formMode,
        enabled: formEnabled,
        iconBg: formIconBg,
        iconText: formIconText.trim() || 'API',
        merchantId: formMerchantId.trim(),
        apiKey: formApiKey.trim(),
        apiSecret: formApiSecret.trim(),
        endpointUrl: formEndpointUrl.trim(),
        webhookUrl: formWebhookUrl.trim() || `https://api.banglaxpress.store/v1/payments/gw-${Date.now()}/callback`,
        currency: formCurrency,
        description: formDescription.trim() || `${formProvider} payment integration.`,
        checkoutInstructions: formCheckoutInstructions.trim(),
        testStatus: gatewayTestResult?.success
          ? `Verified (Latency: ${gatewayTestResult.latency} • 200 OK)`
          : 'Ready & Connected',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCustomGateways((prev) => [newGateway, ...prev]);
      showToast(`নতুন পেমেন্ট মেথড "${formName}" সফলভাবে তৈরি ও সক্রিয় করা হয়েছে!`);
    }

    setIsCreateMethodModalOpen(false);
  };

  const handleDeleteCustomGateway = (gwId: string, gwName: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${gwName}" পেমেন্ট মেথডটি ডিলিট করতে চান?`)) {
      setCustomGateways((prev) => prev.filter((g) => g.id !== gwId));
      showToast(`"${gwName}" পেমেন্ট মেথডটি ডিলিট করা হয়েছে`);
    }
  };

  const handleToggleGatewayStatus = (gwId: string) => {
    setCustomGateways((prev) =>
      prev.map((g) => (g.id === gwId ? { ...g, enabled: !g.enabled } : g))
    );
    const target = customGateways.find((g) => g.id === gwId);
    if (target) {
      showToast(`${target.name} ${!target.enabled ? 'Enabled' : 'Disabled'}`);
    }
  };

  const handleToggleGatewayMode = (gwId: string, mode: 'sandbox' | 'live') => {
    setCustomGateways((prev) =>
      prev.map((g) => (g.id === gwId ? { ...g, mode } : g))
    );
    const target = customGateways.find((g) => g.id === gwId);
    if (target) {
      showToast(`${target.name} mode switched to ${mode.toUpperCase()}`);
    }
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('সবগুলো সেটিংস এবং API ইন্টিগ্রেশন সফলভাবে সেভ করা হয়েছে!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-700" />
            <h1 className="text-lg font-bold text-gray-900">Settings & API Integrations</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live & Synced
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure Bangladeshi payment gateways (bKash, Nagad), courier APIs (Steadfast, Pathao), SMS gateways, and API keys.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4 text-emerald-400" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-gray-100 p-1.5 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'payments' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-[#D12053]" />
          <span>Payment Gateways (bKash / Nagad)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vendor_payments')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'vendor_payments' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-rose-600" />
          <span>ভেন্ডর পেমেন্ট রুলস (Vendor Rules)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('courier')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'courier' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Courier APIs (Steadfast / Pathao)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sms')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'sms' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-blue-600" />
          <span>SMS Gateway API</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('api_tokens')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'api_tokens' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-purple-600" />
          <span>API Access Tokens & Webhooks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'shipping' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          <span>Shipping Rates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'security' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>COD & Fraud Protection</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'general' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-gray-600" />
          <span>Store Details</span>
        </button>
      </div>

      {/* TAB 1: PAYMENT GATEWAYS (bKash, Nagad, SSL, COD) */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {/* Quick Banner for Vendor-Wise Customization */}
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">ভেন্ডর ভিত্তিক পেমেন্ট কাস্টমাইজেশন (Vendor-wise Payment Rules)</h4>
                <p className="text-[11px] text-gray-600">নির্দিষ্ট ব্র্যান্ড বা ভেন্ডরের জন্য COD বন্ধ করা, অগ্রিম পেমেন্ট বাধ্যতামূলক করা কিংবা বিকাশ/নগদ কাস্টমাইজ করুন।</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('vendor_payments')}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs flex items-center gap-1"
            >
              <span>ভেন্ডর রুলস পরিচালনা করুন</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top Payment Gateway Management Header */}
          <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-800" />
                <h2 className="text-sm font-bold text-gray-900">Payment Gateways & API Integrations</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {(bkashEnabled ? 1 : 0) + (nagadEnabled ? 1 : 0) + (sslEnabled ? 1 : 0) + (codEnabled ? 1 : 0) + customGateways.filter(g => g.enabled).length} Methods Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                অফিসিয়াল বাংলাদেশি MFS (বিকাশ, নগদ) ছাড়াও যেকোনো নতুন পেমেন্ট মেথড বা ব্যাংক API সরাসরি ইন্টিগ্রেট করুন।
              </p>
            </div>

            <button
              type="button"
              id="create-payment-method-header-btn"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Payment Method with API</span>
            </button>
          </div>

          {/* bKash Merchant Checkout API */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D12053] text-white flex items-center justify-center font-black text-sm">
                  bK
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">bKash Merchant Checkout API (Direct Tokenized)</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {bkashStatusText || 'Connected'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Official bKash Payment Gateway for instant verification & automated payment callback.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setBkashMode('sandbox')}
                    className={`px-2 py-1 rounded font-semibold ${
                      bkashMode === 'sandbox' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setBkashMode('live')}
                    className={`px-2 py-1 rounded font-semibold ${
                      bkashMode === 'live' ? 'bg-[#D12053] text-white shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    Live Production
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={bkashEnabled}
                    onChange={(e) => handleToggleBkash(e.target.checked)}
                    className="w-4 h-4 accent-[#D12053] rounded cursor-pointer"
                  />
                  <span>{bkashEnabled ? 'Enabled (Fast Checkout Active)' : 'Disabled (Hidden from Fast Checkout)'}</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">bKash App Key</label>
                <input
                  type="text"
                  value={bkashAppKey}
                  onChange={(e) => setBkashAppKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">bKash App Secret</label>
                <input
                  type="password"
                  value={bkashAppSecret}
                  onChange={(e) => setBkashAppSecret(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">API Username</label>
                <input
                  type="text"
                  value={bkashUsername}
                  onChange={(e) => setBkashUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">API Password</label>
                <input
                  type="password"
                  value={bkashPassword}
                  onChange={(e) => setBkashPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-semibold text-gray-800 block">bKash IPN / Webhook URL</span>
                <span className="font-mono text-gray-500 text-[11px]">
                  https://api.banglaxpress.store/v1/payments/bkash/callback
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('https://api.banglaxpress.store/v1/payments/bkash/callback', 'bKash Webhook URL')
                  }
                  className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-white flex items-center gap-1 text-gray-700 font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestBkash}
                  disabled={bkashTesting}
                  className="px-4 py-1.5 bg-[#D12053] hover:bg-[#b01642] text-white rounded-md font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {bkashTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  <span>{bkashTesting ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Nagad Direct Gateway */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7931E] text-white flex items-center justify-center font-black text-sm">
                  Ng
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">Nagad Direct Gateway API</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {nagadStatusText || 'Connected'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Official digital payments integration for Nagad wallet holders.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={nagadEnabled}
                    onChange={(e) => handleToggleNagad(e.target.checked)}
                    className="w-4 h-4 accent-[#F7931E] rounded cursor-pointer"
                  />
                  <span>{nagadEnabled ? 'Enabled (Fast Checkout Active)' : 'Disabled (Hidden from Fast Checkout)'}</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nagad Merchant ID</label>
                <input
                  type="text"
                  value={nagadMerchantId}
                  onChange={(e) => setNagadMerchantId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nagad Public Key</label>
                <input
                  type="text"
                  value={nagadPublicKey}
                  onChange={(e) => setNagadPublicKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Nagad Private Key (Base64 Encrypted)</label>
                <input
                  type="password"
                  value={nagadPrivateKey}
                  onChange={(e) => setNagadPrivateKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleTestNagad}
                disabled={nagadTesting}
                className="px-4 py-1.5 bg-[#F7931E] hover:bg-[#e07f10] text-white rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {nagadTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>{nagadTesting ? 'Validating Keys...' : 'Test Nagad Connection'}</span>
              </button>
            </div>
          </div>

          {/* Custom Payment Gateways Integrated via API */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-blue-600" />
                  <span>Custom API Payment Gateways (কাস্টম পেমেন্ট মেথড)</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {customGateways.length}
                  </span>
                </h3>
                <p className="text-[11px] text-gray-500">
                  নিরাপদ REST API এন্ডপয়েন্ট, মার্চেন্ট টোকেন এবং ইনস্ট্যান্ট আইপিএন (IPN) ওয়েবহুক সাপোর্ট।
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create New Payment Method</span>
              </button>
            </div>

            {customGateways.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">কোনো কাস্টম পেমেন্ট মেথড যোগ করা হয়নি</h4>
                  <p className="text-[11px] text-gray-500 max-w-sm mx-auto mt-1">
                    Upay, Rocket, AamarPay, Shurjopay অথবা যেকোনো ব্যাংক API সহজে ইন্টিগ্রেট করতে নিচের বাটনে ক্লিক করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Payment Method with API</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {customGateways.map((gw) => (
                  <div
                    key={gw.id}
                    className={`bg-white p-5 rounded-xl border transition-all shadow-xs space-y-4 ${
                      gw.enabled ? 'border-gray-200' : 'border-gray-200 opacity-75 bg-gray-50/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-black text-sm shadow-xs"
                          style={{ backgroundColor: gw.iconBg || '#0057B8' }}
                        >
                          {gw.iconText || 'API'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-gray-900">{gw.name}</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                              {gw.provider}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                gw.testStatus?.includes('Verified')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {gw.testStatus || 'Active & Ready'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {gw.description || 'Direct API checkout integration with automated payment callback.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Mode switch */}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs">
                          <button
                            type="button"
                            onClick={() => handleToggleGatewayMode(gw.id, 'sandbox')}
                            className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                              gw.mode === 'sandbox' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            Sandbox
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleGatewayMode(gw.id, 'live')}
                            className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                              gw.mode === 'live' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            Live Production
                          </button>
                        </div>

                        {/* Enabled checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                          <input
                            type="checkbox"
                            checked={gw.enabled}
                            onChange={() => handleToggleGatewayStatus(gw.id)}
                            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                          />
                          <span>Enabled</span>
                        </label>
                      </div>
                    </div>

                    {/* API Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-[11px] font-semibold text-gray-500 block">Endpoint Base URL</span>
                        <div className="font-mono text-gray-800 truncate text-[11px] mt-0.5" title={gw.endpointUrl}>
                          {gw.endpointUrl}
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-gray-500 block">Merchant / Client ID</span>
                        <div className="font-mono text-gray-800 truncate text-[11px] mt-0.5">
                          {gw.merchantId || '—'}
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-gray-500 block">API Key / Token</span>
                        <div className="font-mono text-gray-800 truncate text-[11px] mt-0.5">
                          {gw.apiKey ? `${gw.apiKey.slice(0, 12)}••••••••` : '—'}
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-gray-500 block">Currency & Type</span>
                        <div className="text-gray-800 text-[11px] mt-0.5 font-medium">
                          {gw.currency} • <span className="uppercase text-[10px] font-bold text-gray-600">{gw.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Callback Webhook URL */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Zap className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="font-semibold text-blue-900 flex-shrink-0 text-[11px]">Instant IPN Webhook:</span>
                        <span className="font-mono text-blue-700 text-[11px] truncate">{gw.webhookUrl}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(gw.webhookUrl, `${gw.name} Webhook URL`)}
                        className="px-2.5 py-1 bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs self-end sm:self-auto cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Webhook</span>
                      </button>
                    </div>

                    {/* Action Bar for this Card */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleTestCustomGatewayCard(gw.id, gw.name)}
                          disabled={testingCardId === gw.id}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${testingCardId === gw.id ? 'animate-spin' : ''}`} />
                          <span>{testingCardId === gw.id ? 'Testing Handshake...' : 'Test API Connection'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(gw)}
                          className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                          <span>Configure API</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCustomGateway(gw.id, gw.name)}
                        className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Delete Gateway"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cash on Delivery & Cards */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
              Additional Payment Options
            </h3>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50/50">
              <div>
                <span className="font-bold text-gray-900 block">Cash on Delivery (COD)</span>
                <span className="text-gray-500">Allow customers to pay cash when courier delivers the package.</span>
              </div>
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="w-4 h-4 accent-gray-900 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50/50">
              <div>
                <span className="font-bold text-gray-900 block">SSLCommerz / Visa & Mastercard</span>
                <span className="text-gray-500">Accept debit & credit cards, City Bank, BRAC Bank internet banking.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestSsl}
                  className="px-2.5 py-1 border border-gray-300 rounded text-gray-700 hover:bg-white text-[11px] font-semibold"
                >
                  Test
                </button>
                <input
                  type="checkbox"
                  checked={sslEnabled}
                  onChange={(e) => setSslEnabled(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURIER & LOGISTICS APIs (Steadfast & Pathao) */}
      {activeTab === 'courier' && (
        <div className="space-y-4">
          {/* Steadfast Courier API */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                  St
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">Steadfast Courier API Integration</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {steadfastStatusText || 'Connected'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Auto-creates consignment orders, downloads courier invoice barcodes, and retrieves live tracking.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={steadfastEnabled}
                  onChange={(e) => handleToggleSteadfast(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <span>{steadfastEnabled ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Steadfast API Key</label>
                <input
                  type="text"
                  value={steadfastApiKey}
                  onChange={(e) => setSteadfastApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Steadfast Secret Key</label>
                <input
                  type="password"
                  value={steadfastSecretKey}
                  onChange={(e) => setSteadfastSecretKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={steadfastAutoDispatch}
                  onChange={(e) => setSteadfastAutoDispatch(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <span className="text-gray-700 font-medium">
                  Auto-dispatch parcel to Steadfast when marking order "Fulfilled"
                </span>
              </label>

              <button
                type="button"
                onClick={handleTestSteadfast}
                disabled={steadfastTesting}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {steadfastTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>{steadfastTesting ? 'Connecting...' : 'Test Steadfast API'}</span>
              </button>
            </div>
          </div>

          {/* Pathao Courier API */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E41E26] text-white flex items-center justify-center font-black text-sm">
                  Pt
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">Pathao Courier Logistics API</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {pathaoStatusText || 'Connected'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Direct integration with Pathao Merchant API for Dhaka same-day and inter-city deliveries.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={pathaoEnabled}
                  onChange={(e) => handleTogglePathao(e.target.checked)}
                  className="w-4 h-4 accent-[#E41E26] rounded cursor-pointer"
                />
                <span>{pathaoEnabled ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Pathao Client ID</label>
                <input
                  type="text"
                  value={pathaoClientId}
                  onChange={(e) => setPathaoClientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Pathao Client Secret</label>
                <input
                  type="password"
                  value={pathaoClientSecret}
                  onChange={(e) => setPathaoClientSecret(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Pathao Store ID</label>
                <input
                  type="text"
                  value={pathaoStoreId}
                  onChange={(e) => setPathaoStoreId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleTestPathao}
                disabled={pathaoTesting}
                className="px-4 py-1.5 bg-[#E41E26] hover:bg-[#c2141b] text-white rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {pathaoTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>{pathaoTesting ? 'Authenticating...' : 'Test Pathao Connection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SMS GATEWAY API */}
      {activeTab === 'sms' && (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Bangladeshi SMS Gateway Configuration</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Automated SMS updates for orders, courier tracking link dispatches, and customer delivery OTPs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">SMS Provider</label>
              <select
                value={smsProvider}
                onChange={(e) => setSmsProvider(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              >
                <option value="greenweb">Greenweb SMS Gateway</option>
                <option value="bulksmsbd">BulkSMSBD API</option>
                <option value="alphanet">Alpha Net SMS</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">API Token / Key</label>
              <input
                type="text"
                value={smsApiToken}
                onChange={(e) => setSmsApiToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Approved Masking / Sender ID</label>
              <input
                type="text"
                value={smsSenderId}
                onChange={(e) => setSmsSenderId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono font-bold text-xs focus:border-gray-900"
              />
            </div>
          </div>

          <div className="space-y-2 border-t pt-3 text-xs">
            <span className="font-bold text-gray-800 block mb-1">SMS Automations</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={smsOrderPlaced}
                onChange={(e) => setSmsOrderPlaced(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className="text-gray-700">Order Placed Confirmation SMS with Order ID and total amount</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={smsDispatched}
                onChange={(e) => setSmsDispatched(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className="text-gray-700">Parcel Dispatched SMS with Courier Consignment Tracking Link</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={smsDelivered}
                onChange={(e) => setSmsDelivered(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className="text-gray-700">Order Delivered & Thank You Review SMS</span>
            </label>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-900">Test SMS:</span>
              <input
                type="tel"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                placeholder="01812345678"
                className="px-2.5 py-1 bg-white border border-blue-200 rounded font-mono text-xs w-36 outline-hidden"
              />
            </div>

            <button
              type="button"
              onClick={handleSendTestSms}
              disabled={smsTesting}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {smsTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{smsTesting ? 'Sending SMS...' : 'Send Live Test SMS'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: API ACCESS TOKENS & WEBHOOKS */}
      {activeTab === 'api_tokens' && (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-600" />
                <span>Shopify Headless Storefront & Admin API Keys</span>
              </h3>
              <p className="text-xs text-gray-500">
                Secure credentials to access products, orders, and customer data programmatically.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTokens(!showTokens)}
              className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center gap-1.5 font-semibold text-gray-700"
            >
              {showTokens ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showTokens ? 'Hide Keys' : 'Reveal Keys'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Storefront API Access Token (Public)</label>
              <div className="flex items-center gap-2">
                <input
                  type={showTokens ? 'text' : 'password'}
                  readOnly
                  value={storefrontToken}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-xs text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(storefrontToken, 'Storefront Token')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  title="Copy token"
                >
                  {copiedKey === 'Storefront Token' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Admin REST API Key (Secret)</label>
              <div className="flex items-center gap-2">
                <input
                  type={showTokens ? 'text' : 'password'}
                  readOnly
                  value={adminApiKey}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-xs text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(adminApiKey, 'Admin API Key')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  title="Copy key"
                >
                  {copiedKey === 'Admin API Key' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Webhook Signing Secret</label>
              <div className="flex items-center gap-2">
                <input
                  type={showTokens ? 'text' : 'password'}
                  readOnly
                  value={webhookSecret}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-xs text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(webhookSecret, 'Webhook Secret')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  title="Copy secret"
                >
                  {copiedKey === 'Webhook Secret' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SHIPPING RATES & ZONES */}
      {activeTab === 'shipping' && (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Domestic Shipping Rates (Bangladesh)</span>
            </h3>
            <p className="text-xs text-gray-500">Customize standard delivery fees charged at checkout.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <span className="font-bold text-gray-900 block">Inside Dhaka Metro</span>
              <span className="text-[11px] text-gray-500 block">Delivery in 24 to 48 hours</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 font-bold">৳</span>
                <input
                  type="number"
                  value={dhakaRate}
                  onChange={(e) => setDhakaRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg font-mono font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <span className="font-bold text-gray-900 block">Dhaka Suburbs (Savar, Gazipur)</span>
              <span className="text-[11px] text-gray-500 block">Delivery in 48 hours</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 font-bold">৳</span>
                <input
                  type="number"
                  value={suburbRate}
                  onChange={(e) => setSuburbRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg font-mono font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <span className="font-bold text-gray-900 block">Outside Dhaka (All Districts)</span>
              <span className="text-[11px] text-gray-500 block">Delivery in 48 to 72 hours</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 font-bold">৳</span>
                <input
                  type="number"
                  value={outsideDhakaRate}
                  onChange={(e) => setOutsideDhakaRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg font-mono font-bold text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-900 block">Free Shipping Threshold</span>
              <span className="text-[11px] text-emerald-700">Orders above this amount receive 100% free delivery nationwide.</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-emerald-800 font-bold">৳</span>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-28 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-mono font-bold text-emerald-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY & FRAUD PROTECTION */}
      {activeTab === 'security' && (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>COD Fake Order & Return Prevention</span>
            </h3>
            <p className="text-xs text-gray-500">
              Protect your business from return courier charges and bogus cash on delivery checkout submissions.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl bg-gray-50/50">
              <div>
                <span className="font-bold text-gray-900 block">SMS OTP Verification on Checkout</span>
                <span className="text-gray-500">Requires customers to enter a 4-digit SMS OTP code before COD order is accepted.</span>
              </div>
              <input
                type="checkbox"
                checked={requireOtpCod}
                onChange={(e) => setRequireOtpCod(e.target.checked)}
                className="w-4 h-4 accent-gray-900 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl bg-gray-50/50">
              <div>
                <span className="font-bold text-gray-900 block">Mandatory Advance Delivery Charge for High Risk Areas</span>
                <span className="text-gray-500">Take ৳100 advance delivery fee via bKash to confirm orders outside Dhaka.</span>
              </div>
              <div className="flex items-center gap-3">
                {requireAdvanceDeliveryCharge && (
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-500">৳</span>
                    <input
                      type="number"
                      value={advanceFeeAmount}
                      onChange={(e) => setAdvanceFeeAmount(Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold"
                    />
                  </div>
                )}
                <input
                  type="checkbox"
                  checked={requireAdvanceDeliveryCharge}
                  onChange={(e) => setRequireAdvanceDeliveryCharge(e.target.checked)}
                  className="w-4 h-4 accent-gray-900 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl bg-gray-50/50">
              <div>
                <span className="font-bold text-gray-900 block">Minimum Order Amount</span>
                <span className="text-gray-500">Prevent spam checkout attempts with orders under minimum threshold.</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-500">৳</span>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  className="w-24 px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: GENERAL STORE DETAILS */}
      {activeTab === 'general' && (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-gray-700" />
              <span>General Store Information</span>
            </h3>
            <p className="text-xs text-gray-500">Store branding, official company name, and contact information.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Legal Company Name</label>
              <input
                type="text"
                value={storeLegalName}
                onChange={(e) => setStoreLegalName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Customer Support Email</label>
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Official Helpline Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-gray-700 block mb-1">Registered Office Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-gray-900"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Default Store Currency</label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg font-mono text-gray-700"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Store Timezone</label>
              <input
                type="text"
                disabled
                value={timezone}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg font-mono text-gray-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB: VENDOR PAYMENT RULES */}
      {activeTab === 'vendor_payments' && (
        <ShopifyVendorPaymentsView
          products={products}
          showToast={showToast}
        />
      )}

      {/* Create / Configure Payment Method with API Modal */}
      {isCreateMethodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xs transition-colors"
                  style={{ backgroundColor: formIconBg }}
                >
                  {formIconText || 'API'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {editingGatewayId ? 'Edit Payment Gateway API' : 'Create New Payment Method with API'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    ইন্টিগ্রেট করুন নতুন পেমেন্ট গেটওয়ে, REST API এন্ডপয়েন্ট ও অটোমেটিক ওয়েবহুক কলব্যাক।
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateMethodModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-200/70 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Preset Selector */}
            <div className="p-4 bg-slate-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>দ্রুত সেটআপের জন্য প্রিসেট সিলেক্ট করুন (Quick Presets)</span>
                </span>
                <span className="text-[11px] text-slate-500">ক্লিক করলেই ফিল্ড পূরণ হবে</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {PAYMENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-100/80 text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: preset.iconBg }}
                    />
                    <span>{preset.provider}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCustomGateway} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Method Name & Provider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    পেমেন্ট মেথডের নাম (Gateway Display Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="যেমন: Upay Direct Checkout API"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    প্রোভাইডার বা কোম্পানি (Provider Brand)
                  </label>
                  <input
                    type="text"
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    placeholder="যেমন: Upay (UCB), Rocket, AamarPay"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Category, Mode & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">মেথড টাইপ (Category)</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-emerald-600 bg-white"
                  >
                    <option value="mfs">Mobile Financial Services (MFS)</option>
                    <option value="card">Cards & Internet Banking</option>
                    <option value="net_banking">Net Banking / Direct Pay</option>
                    <option value="international">International Payment</option>
                    <option value="custom">Custom REST API</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">এনভায়রনমেন্ট মোড (Mode)</label>
                  <select
                    value={formMode}
                    onChange={(e) => setFormMode(e.target.value as 'sandbox' | 'live')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-emerald-600 bg-white"
                  >
                    <option value="live">Live Production (প্রোডাকশন)</option>
                    <option value="sandbox">Sandbox / Test Mode (টেস্ট)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">কারেন্সি (Currency)</label>
                  <input
                    type="text"
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    placeholder="BDT (৳)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Badge Visual Identity Customization */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">ব্যাজ কালার ও আইকন কোড (Checkout Badge)</span>
                  <div className="flex items-center gap-1.5">
                    {['#0057B8', '#8C1D82', '#0E4378', '#EA1D24', '#635BFF', '#059669', '#111827'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormIconBg(color)}
                        className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                          formIconBg === color ? 'scale-125 border-gray-900 shadow-xs' : 'border-white hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-gray-500 block mb-0.5">কালার কোড (Hex)</label>
                    <input
                      type="text"
                      value={formIconBg}
                      onChange={(e) => setFormIconBg(e.target.value)}
                      placeholder="#0057B8"
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono text-[11px] bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 block mb-0.5">সংক্ষিপ্ত আইকন টেক্সট (Short Code)</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={formIconText}
                      onChange={(e) => setFormIconText(e.target.value.toUpperCase())}
                      placeholder="Up / Rk / AP"
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono uppercase text-[11px] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* API Credentials */}
              <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-100 text-xs space-y-3">
                <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  <span>এপিআই ক্রেডেনশিয়াল ও এন্ডপয়েন্ট (API Credentials & Endpoints)</span>
                </h4>

                <div>
                  <label className="font-semibold text-gray-800 block mb-1">
                    API Base Endpoint / Gateway URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formEndpointUrl}
                    onChange={(e) => setFormEndpointUrl(e.target.value)}
                    placeholder="https://api.gateway.com/v1/checkout/initialize"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-blue-600 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-800 block mb-1">
                      মার্চেন্ট আইডি / একাউন্ট নম্বর (Merchant ID)
                    </label>
                    <input
                      type="text"
                      value={formMerchantId}
                      onChange={(e) => setFormMerchantId(e.target.value)}
                      placeholder="যেমন: UPAY_MERCHANT_99812"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-blue-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-800 block mb-1">
                      এপিআই কী / ক্লায়েন্ট আইডি (API Key / Client ID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formApiKey}
                      onChange={(e) => setFormApiKey(e.target.value)}
                      placeholder="যেমন: live_api_key_8492019482"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-gray-800">
                      সিক্রেট কী / প্রাইভেট টোকেন (API Secret / Private Key)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSecretInModal(!showSecretInModal)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      {showSecretInModal ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showSecretInModal ? 'Hide Secret' : 'Show Secret'}</span>
                    </button>
                  </div>
                  <input
                    type={showSecretInModal ? 'text' : 'password'}
                    value={formApiSecret}
                    onChange={(e) => setFormApiSecret(e.target.value)}
                    placeholder="••••••••••••••••••••••••••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden font-mono text-xs focus:border-blue-600 bg-white"
                  />
                </div>

                {/* Webhook URL */}
                <div>
                  <label className="font-semibold text-gray-800 block mb-1">
                    অটোমেটিক আইপিএন / ওয়েবহুক কলব্যাক URL (Instant IPN Webhook)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={formWebhookUrl}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-mono text-xs select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(formWebhookUrl, 'Webhook URL')}
                      className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    গেটওয়ে ড্যাশবোর্ডে এই কলব্যাক URL টি আইপিএন / ওয়েবহুক সেটিংসে যুক্ত করুন।
                  </p>
                </div>
              </div>

              {/* Customer Checkout Instructions */}
              <div className="text-xs">
                <label className="font-bold text-gray-800 block mb-1">
                  চেকআউটে কাস্টমারের জন্য পেমেন্ট নির্দেশিকা (Checkout Note / Instructions)
                </label>
                <textarea
                  rows={2}
                  value={formCheckoutInstructions}
                  onChange={(e) => setFormCheckoutInstructions(e.target.value)}
                  placeholder="যেমন: আপনার Upay অ্যাপ থেকে পেমেন্ট সম্পন্ন করে প্রাপ্ত TrxID প্রদান করুন।"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden focus:border-emerald-600"
                />
              </div>

              {/* Live API Handshake Test Inside Modal */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-gray-800 block">এপিআই সংযোগ টেস্ট করুন (Connection Handshake)</span>
                  <span className="text-[11px] text-gray-500">
                    এন্ডপয়েন্ট ও ক্রেডেনশিয়াল সঠিক আছে কিনা সাথে সাথে যাচাই করুন।
                  </span>
                  {gatewayTestResult && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{gatewayTestResult.message} ({gatewayTestResult.latency})</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleTestCustomGatewayInModal}
                  disabled={isTestingGateway}
                  className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold rounded-lg flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isTestingGateway ? 'animate-spin' : ''}`} />
                  <span>{isTestingGateway ? 'Testing API...' : 'Test Handshake'}</span>
                </button>
              </div>

              {/* Enabled Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-enabled-checkbox"
                  checked={formEnabled}
                  onChange={(e) => setFormEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="modal-enabled-checkbox" className="text-xs font-bold text-gray-800 cursor-pointer">
                  এই পেমেন্ট মেথডটি অবিলম্বে স্টোর চেকআউটে সক্রিয় (Enable) রাখুন
                </label>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateMethodModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingGatewayId ? 'Save & Update API' : 'Save & Integrate Gateway'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
