import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Printer,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Tag,
  Plus,
  X,
  Send,
  FileText,
  DollarSign,
  Barcode,
  Navigation,
  Share2
} from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { STORE_SETTINGS } from '../../../data/mockData';
import { GpeLogo } from '../../GpeLogo';

interface ShopifyOrderDetailViewProps {
  order: Order;
  orders: Order[];
  onBack: () => void;
  onSelectOrder: (order: Order) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  onOpenReceipt: (order: Order) => void;
  showToast: (msg: string) => void;
}

export const ShopifyOrderDetailView: React.FC<ShopifyOrderDetailViewProps> = ({
  order,
  orders,
  onBack,
  onSelectOrder,
  onUpdateOrder,
  onOpenReceipt,
  showToast
}) => {
  // Navigation between orders
  const currentIndex = orders.findIndex((o) => o.id === order.id);
  const prevOrder = currentIndex > 0 ? orders[currentIndex - 1] : null;
  const nextOrder = currentIndex < orders.length - 1 ? orders[currentIndex + 1] : null;

  // Notes state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(order.customerNotes || '');

  // Tags state
  const [tags, setTags] = useState<string[]>(() => {
    const defaultTags = ['Online Store', order.paymentMethod.toUpperCase()];
    if (order.cityDivision) defaultTags.push(order.cityDivision);
    if (order.courierName) defaultTags.push(order.courierName);
    return defaultTags;
  });
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Timeline comments state
  const [commentText, setCommentText] = useState('');
  const [isPrivateComment, setIsPrivateComment] = useState(true);

  // Packing slip modal state
  const [showPackingSlip, setShowPackingSlip] = useState(false);

  // Tracking edit state
  const [isEditingTracking, setIsEditingTracking] = useState(false);
  const [courierName, setCourierName] = useState(order.courierName || 'Steadfast Courier');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');

  // Copied feedback states
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Handle Save Notes
  const handleSaveNotes = () => {
    const updated = {
      ...order,
      customerNotes: notesText.trim()
    };
    onUpdateOrder(updated);
    setIsEditingNotes(false);
    showToast('Customer notes updated');
  };

  // Handle Add Tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setNewTagInput('');
    setIsAddingTag(false);
    showToast(`Tag "${tag}" added`);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Handle Post Comment to Timeline
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newTimelineItem = {
      status: order.status,
      title: isPrivateComment ? 'Staff Note Added' : 'Customer Note Recorded',
      description: commentText.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', Today',
      completed: true
    };

    const updated = {
      ...order,
      timeline: [newTimelineItem, ...(order.timeline || [])]
    };

    onUpdateOrder(updated);
    setCommentText('');
    showToast('Comment posted to timeline');
  };

  // Handle Status Update
  const handleStatusChange = (newStatus: OrderStatus) => {
    const updatedTimeline = (order.timeline || []).map((step) => {
      if (step.status === newStatus) {
        return { ...step, completed: true, timestamp: 'Just now' };
      }
      return step;
    });

    const statusTitleMap: Record<OrderStatus, string> = {
      pending: 'Order set to Pending',
      confirmed: 'Order Confirmed by Admin',
      processing: 'Order in Packaging & QC',
      shipped: `Shipped via ${order.courierName || 'Courier'}`,
      delivered: 'Marked as Delivered & Fulfilled',
      cancelled: 'Order Cancelled'
    };

    const newStep = {
      status: newStatus,
      title: statusTitleMap[newStatus],
      description: `Status changed to ${newStatus.toUpperCase()} by admin`,
      timestamp: 'Just now',
      completed: true
    };

    const updated = {
      ...order,
      status: newStatus,
      timeline: [newStep, ...updatedTimeline]
    };

    onUpdateOrder(updated);
    showToast(`Order marked as ${newStatus}`);
  };

  // Handle Payment Status Update
  const handleMarkAsPaid = () => {
    const newStep = {
      status: order.status,
      title: 'Payment Marked as Collected (Paid)',
      description: `Total ৳${order.total.toLocaleString()} collected via ${order.paymentMethod.toUpperCase()}`,
      timestamp: 'Just now',
      completed: true
    };

    const updated = {
      ...order,
      paymentStatus: 'paid' as const,
      timeline: [newStep, ...(order.timeline || [])]
    };

    onUpdateOrder(updated);
    showToast('Payment marked as Paid');
  };

  // Handle Save Tracking
  const handleSaveTracking = () => {
    const updated = {
      ...order,
      courierName,
      trackingNumber
    };
    onUpdateOrder(updated);
    setIsEditingTracking(false);
    showToast('Courier & Tracking updated');
  };

  // Copy helper
  const copyToClipboard = (text: string, type: 'id' | 'phone' | 'address') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
    showToast('Copied to clipboard!');
  };

  // Formatted order number e.g. #1005 or #GPE-14584
  const displayOrderNum = order.id.startsWith('GPE-')
    ? `#${order.id.replace('GPE-', '')}`
    : order.id.startsWith('BX-')
    ? `#${order.id.replace('BX-', '')}`
    : `#${order.id}`;

  const isPaid = order.paymentStatus === 'paid';
  const isFulfilled = order.status === 'delivered' || order.status === 'shipped';

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Top Header Navigation */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>

          {/* Previous / Next Order controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:inline">
              {currentIndex + 1} of {orders.length} orders
            </span>
            <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-2xs overflow-hidden">
              <button
                type="button"
                disabled={!prevOrder}
                onClick={() => prevOrder && onSelectOrder(prevOrder)}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous order"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-gray-200" />
              <button
                type="button"
                disabled={!nextOrder}
                onClick={() => nextOrder && onSelectOrder(nextOrder)}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next order"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Order Main Title & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-gray-900 tracking-tight flex items-center gap-2">
                <span>{displayOrderNum}</span>
                <span className="text-xs font-mono font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  {order.id}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(order.id, 'id')}
                  className="text-gray-400 hover:text-gray-700 p-1"
                  title="Copy Order ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </h1>

              {/* Status Badges (Shopify Style) */}
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Payment Badge */}
                {isPaid ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Payment pending (COD)
                  </span>
                )}

                {/* Fulfillment Badge */}
                {order.status === 'delivered' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Fulfilled
                  </span>
                ) : order.status === 'shipped' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    In transit
                  </span>
                ) : order.status === 'processing' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    Processing
                  </span>
                ) : order.status === 'confirmed' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Confirmed
                  </span>
                ) : order.status === 'cancelled' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    Cancelled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Unfulfilled
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
              <span>{order.createdAt} from Online Store</span>
              <span>•</span>
              <span className="font-semibold text-gray-700">GPE Bangladesh Express</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            {/* View / Print GPE Money Receipt */}
            <button
              type="button"
              onClick={() => onOpenReceipt(order)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Official GPE Money Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>মানি রিসিট (Receipt)</span>
            </button>

            {/* Print Packing Slip */}
            <button
              type="button"
              onClick={() => setShowPackingSlip(true)}
              className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-gray-500" />
              <span>Packing Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Shopify Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT COLUMN: Main Cards (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-5">
          {/* CARD 1: FULFILLMENT CARD */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            {/* Fulfillment Card Header */}
            <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isFulfilled
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">
                      {isFulfilled ? 'Fulfilled' : 'Unfulfilled'} ({order.items.length})
                    </span>
                    <span className="text-[10px] bg-gray-200/80 text-gray-700 px-2 py-0.5 rounded font-mono font-medium">
                      #Hub-01
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Location: Dhaka Central Warehouse (Steadfast Courier Dispatch)
                  </p>
                </div>
              </div>

              {/* Status Switcher Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-medium">Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white shadow-2xs outline-none focus:border-gray-900 cursor-pointer"
                >
                  <option value="pending">Pending (অপেক্ষমান)</option>
                  <option value="confirmed">Confirmed (নিশ্চিত)</option>
                  <option value="processing">Processing (প্যাকিং)</option>
                  <option value="shipped">Shipped (কুরিয়ারে)</option>
                  <option value="delivered">Delivered (ডেলিভার্ড)</option>
                  <option value="cancelled">Cancelled (বাতিল)</option>
                </select>
              </div>
            </div>

            {/* Items Table */}
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={`${item.productId}-${idx}`} className="p-4 sm:p-5 flex items-start gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {item.name}
                    </h3>

                    {item.color && (
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        <span className="font-medium text-gray-600">Color/Variant:</span> {item.color}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 font-mono">
                      <span>SKU: GPE-{item.productId.slice(-5).toUpperCase()}</span>
                      <span>•</span>
                      <span>৳{item.price.toLocaleString()} × {item.quantity}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold font-mono text-gray-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Courier & Tracking Bar */}
            <div className="p-4 sm:p-5 bg-gray-50/70 border-t border-gray-200">
              {isEditingTracking ? (
                <div className="space-y-3 bg-white p-3.5 rounded-lg border border-gray-200 shadow-2xs">
                  <div className="text-xs font-bold text-gray-900">Edit Courier & Tracking</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Courier Partner
                      </label>
                      <select
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none"
                      >
                        <option value="Steadfast Courier">Steadfast Courier</option>
                        <option value="Pathao Courier">Pathao Courier</option>
                        <option value="RedX Logistics">RedX Logistics</option>
                        <option value="Sundarban Courier">Sundarban Courier</option>
                        <option value="SA Paribahan">SA Paribahan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Tracking / Consignment ID
                      </label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g. ST-1005-DH89"
                        className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingTracking(false)}
                      className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveTracking}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-gray-900 hover:bg-black rounded-lg"
                    >
                      Save Tracking
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">
                          {order.courierName || 'Steadfast Courier'}
                        </span>
                        {order.trackingNumber && (
                          <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">
                            {order.trackingNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Shipping: {order.cityDivision || 'Standard Delivery'} (৳{order.deliveryCharge})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingTracking(true)}
                      className="text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-300 transition-colors shadow-2xs"
                    >
                      {order.trackingNumber ? 'Edit tracking' : 'Add tracking'}
                    </button>

                    {order.status !== 'delivered' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange('delivered')}
                        className="text-xs font-bold text-white bg-gray-900 hover:bg-black px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors"
                      >
                        Fulfill items
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARD 2: PAYMENT CARD */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <h2 className="text-xs sm:text-sm font-bold text-gray-900">
                  Payment Details
                </h2>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isPaid
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>

            {/* Breakdown Table */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})</span>
                <span className="font-mono text-gray-900">৳{order.subtotal.toLocaleString()}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1.5">
                    <span>Discount</span>
                    {order.couponCode && (
                      <span className="text-[10px] bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-mono font-bold">
                        {order.couponCode}
                      </span>
                    )}
                  </span>
                  <span className="font-mono font-semibold">-৳{order.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping ({order.cityDivision || 'Inside Dhaka'})</span>
                <span className="font-mono text-gray-900">৳{order.deliveryCharge.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Estimated taxes (0% VAT)</span>
                <span className="font-mono">৳0.00</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="font-mono text-rose-600 text-base">৳{order.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Paid / Balance Due Summary */}
            <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Paid by customer</span>
                <span className="font-mono font-semibold text-gray-900">
                  ৳{isPaid ? order.total.toLocaleString() : '0.00'}
                </span>
              </div>

              <div className="flex justify-between font-bold">
                <span className="text-gray-700">Balance due</span>
                <span className="font-mono text-gray-900">
                  ৳{isPaid ? '0.00' : order.total.toLocaleString()}
                </span>
              </div>

              {!isPaid && (
                <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-[11px] text-amber-800">
                    Cash on delivery: <strong>৳{order.total.toLocaleString()}</strong> will be collected by courier upon delivery.
                  </p>
                  <button
                    type="button"
                    onClick={handleMarkAsPaid}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0 shadow-2xs cursor-pointer"
                  >
                    Mark as paid
                  </button>
                </div>
              )}

              {isPaid && (
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] text-emerald-800">
                  <span>
                    Payment Method: <strong>{order.paymentMethod.toUpperCase()}</strong>
                    {order.trxId && ` (TrxID: ${order.trxId})`}
                  </span>
                  <span className="font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Fully Paid
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CARD 3: TIMELINE CARD (SHOPIFY STYLE) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <h2 className="text-xs sm:text-sm font-bold text-gray-900">Timeline</h2>
              </div>
              <span className="text-xs text-gray-400">Order Activity & Staff Notes</span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave a comment... (e.g. Verified customer address by phone call, delivery confirmed for tomorrow)"
                rows={2}
                className="w-full text-xs p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 resize-none"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[11px] text-gray-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPrivateComment}
                    onChange={(e) => setIsPrivateComment(e.target.checked)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-0"
                  />
                  <span>Internal note (only staff can view)</span>
                </label>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-black disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Post</span>
                </button>
              </div>
            </form>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 pt-2">
              {(order.timeline || []).map((step, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      step.completed
                        ? 'border-emerald-600'
                        : 'border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        step.completed ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    />
                  </div>

                  <div className="text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-gray-900">{step.title}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{step.timestamp}</span>
                    </div>
                    <p className="text-gray-600 mt-0.5 text-[11.5px] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Cards (1 Col wide) */}
        <div className="space-y-5">
          {/* CARD 1: NOTES */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                Notes
              </h3>
              {!isEditingNotes && (
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Special instructions or customer remarks..."
                  rows={3}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg outline-none focus:border-gray-900"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNotesText(order.customerNotes || '');
                      setIsEditingNotes(false);
                    }}
                    className="px-2.5 py-1 text-xs text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-3 py-1 bg-gray-900 hover:bg-black text-white rounded text-xs font-bold"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-600 leading-relaxed italic">
                {order.customerNotes || 'No notes provided by customer.'}
              </p>
            )}
          </div>

          {/* CARD 2: CUSTOMER */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-5 space-y-4">
            <div className="border-b border-gray-100 pb-2.5 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                Customer
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-sm shrink-0">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{order.customerName}</h4>
                  <p className="text-gray-500 text-[11px]">1 order in GPE Bangladesh</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Contact Information
                </span>

                <div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <a
                      href={`tel:${order.phone}`}
                      className="font-mono text-blue-600 hover:underline"
                    >
                      {order.phone}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(order.phone, 'phone')}
                    className="text-gray-400 hover:text-gray-700 p-1"
                    title="Copy phone"
                  >
                    {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                {order.altPhone && (
                  <div className="flex items-center justify-between text-gray-700">
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-mono text-gray-600">{order.altPhone} (Alt)</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate text-gray-600">
                      {order.customerName.toLowerCase().replace(/\s+/g, '')}@example.com
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Shipping Address
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(order.address, 'address')}
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {copiedAddress ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>

                <div className="text-gray-800 leading-snug">
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-gray-600">{order.address}</p>
                  {order.thanaZone && <p className="text-gray-600">{order.thanaZone}</p>}
                  <p className="text-gray-600">
                    {order.district || order.cityDivision}, Bangladesh
                  </p>
                  <p className="font-mono text-gray-500 mt-1">{order.phone}</p>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${order.address}, ${order.district || order.cityDivision}, Bangladesh`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 hover:underline pt-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>View on Google Maps</span>
                </a>
              </div>

              {/* Billing Address */}
              <div className="pt-2 border-t border-gray-100">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Billing Address
                </span>
                <p className="text-gray-500 italic">Same as shipping address</p>
              </div>
            </div>
          </div>

          {/* CARD 3: FRAUD ANALYSIS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-5 space-y-3">
            <div className="border-b border-gray-100 pb-2.5 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                Fraud Analysis
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Low Risk</span>
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Shipping address and recipient name match Bangladeshi phone records.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Local IP located in {order.district || 'Dhaka'}, Bangladesh.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Verified via Fast Express Single-Step Checkout.</span>
              </div>
            </div>
          </div>

          {/* CARD 4: TAGS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-5 space-y-3">
            <div className="border-b border-gray-100 pb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-gray-500" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                  Tags
                </h3>
              </div>
              {!isAddingTag && (
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              )}
            </div>

            {isAddingTag && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="New tag..."
                  className="w-full text-xs p-1.5 border border-gray-300 rounded outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-2.5 py-1.5 bg-gray-900 text-white rounded text-xs font-bold"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingTag(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 group hover:bg-gray-200 transition-colors"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-400 hover:text-rose-600 opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PACKING SLIP MODAL */}
      {showPackingSlip && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <GpeLogo variant="full" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Packing Slip
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPackingSlip(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs">
              <div>
                <p className="font-bold text-gray-900 text-sm">Order {displayOrderNum}</p>
                <p className="text-gray-500">{order.createdAt}</p>
                <p className="font-mono text-gray-700 mt-1">ID: {order.id}</p>
              </div>

              <div className="sm:text-right">
                <p className="font-bold text-gray-900">{STORE_SETTINGS.name}</p>
                <p className="text-gray-500">{STORE_SETTINGS.address}</p>
                <p className="text-gray-500">{STORE_SETTINGS.phone}</p>
              </div>
            </div>

            {/* Ship To Box */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Ship To
              </span>
              <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
              <p className="text-gray-700">{order.address}</p>
              <p className="text-gray-700">{order.district || order.cityDivision}, Bangladesh</p>
              <p className="font-mono text-gray-800 font-semibold mt-1">Phone: {order.phone}</p>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Items</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((it, i) => (
                  <tr key={i}>
                    <td className="p-3">
                      <p className="font-bold text-gray-900">{it.name}</p>
                      {it.color && <p className="text-gray-500 text-[11px]">{it.color}</p>}
                    </td>
                    <td className="p-3 text-center font-bold font-mono">{it.quantity}</td>
                    <td className="p-3 text-right font-mono">৳{it.price.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono font-bold">
                      ৳{(it.price * it.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Slip Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Courier: <strong>{order.courierName || 'Steadfast Courier'}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
