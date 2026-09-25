import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Search,
  Plus,
  Truck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  ExternalLink,
  Package,
  X
} from 'lucide-react';
import { Product } from '../../../types';

interface ShopifyTransfersViewProps {
  products: Product[];
  showToast?: (message: string) => void;
}

export interface InventoryTransferRecord {
  id: string;
  transferNumber: string;
  origin: string;
  destination: string;
  status: 'Draft' | 'Pending' | 'In Transit' | 'Received';
  carrier: string;
  trackingNumber: string;
  createdDate: string;
  expectedDate: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
}

const INITIAL_TRANSFERS: InventoryTransferRecord[] = [
  {
    id: 'tr-1',
    transferNumber: 'TR-501',
    origin: 'Chattogram Port Depot (Agrabad)',
    destination: 'Dhaka Central Warehouse (Mirpur Hub)',
    status: 'In Transit',
    carrier: 'Steadfast Courier Logistics',
    trackingNumber: 'SF-BD-891024',
    createdDate: '2026-09-11',
    expectedDate: '2026-09-14',
    items: [
      {
        productId: 'watch-t900',
        productName: 'T900 Ultra Smartwatch 2.09" Display',
        quantity: 35
      },
      {
        productId: 'earbuds-m10',
        productName: 'M10 TWS Wireless Earbuds with Powerbank Case',
        quantity: 50
      }
    ]
  },
  {
    id: 'tr-2',
    transferNumber: 'TR-500',
    origin: 'Dhaka Central Warehouse (Mirpur Hub)',
    destination: 'Sylhet Regional Fulfillment Center',
    status: 'Received',
    carrier: 'Pathao Parcel Express',
    trackingNumber: 'PTH-772910',
    createdDate: '2026-09-04',
    expectedDate: '2026-09-06',
    items: [
      {
        productId: 'acc-powerbank',
        productName: 'Magnetic 10,000mAh Wireless Power Bank',
        quantity: 20
      }
    ]
  },
  {
    id: 'tr-3',
    transferNumber: 'TR-499',
    origin: 'Chattogram Port Depot (Agrabad)',
    destination: 'Dhaka Central Warehouse (Mirpur Hub)',
    status: 'Pending',
    carrier: 'RedX Cargo Delivery',
    trackingNumber: 'RDX-994103',
    createdDate: '2026-09-12',
    expectedDate: '2026-09-16',
    items: [
      {
        productId: 'trimmer-vgr',
        productName: 'Vintage T9 Professional Hair & Beard Trimmer',
        quantity: 40
      }
    ]
  }
];

export const ShopifyTransfersView: React.FC<ShopifyTransfersViewProps> = ({
  products,
  showToast = (_msg: string) => {}
}) => {
  const [transfers, setTransfers] = useState<InventoryTransferRecord[]>(INITIAL_TRANSFERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Transit' | 'Received' | 'Draft'>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<InventoryTransferRecord | null>(null);

  // New transfer form state
  const [origin, setOrigin] = useState('Chattogram Port Depot (Agrabad)');
  const [destination, setDestination] = useState('Dhaka Central Warehouse (Mirpur Hub)');
  const [carrier, setCarrier] = useState('Steadfast Courier Logistics');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [expectedDate, setExpectedDate] = useState('2026-09-18');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [transferQuantity, setTransferQuantity] = useState(20);

  const filteredTransfers = transfers.filter((t) => {
    const matchesSearch =
      t.transferNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.carrier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId) || products[0];

    const newTransfer: InventoryTransferRecord = {
      id: `tr-${Date.now()}`,
      transferNumber: `TR-${Math.floor(500 + Math.random() * 500)}`,
      origin,
      destination,
      status: 'Pending',
      carrier,
      trackingNumber: trackingNumber.trim() || `SF-${Math.floor(100000 + Math.random() * 900000)}`,
      createdDate: new Date().toISOString().split('T')[0],
      expectedDate,
      items: [
        {
          productId: prod ? prod.id : 'item',
          productName: prod ? prod.name : 'Stock Batch',
          quantity: transferQuantity
        }
      ]
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    setIsCreateModalOpen(false);
    setTrackingNumber('');
    showToast(`Transfer #${newTransfer.transferNumber} সফলভাবে তৈরি হয়েছে`);
  };

  const handleReceiveTransfer = (tr: InventoryTransferRecord) => {
    setTransfers((prev) =>
      prev.map((item) => (item.id === tr.id ? { ...item, status: 'Received' } : item))
    );
    if (selectedTransfer?.id === tr.id) {
      setSelectedTransfer({ ...tr, status: 'Received' });
    }
    showToast(`Transfer #${tr.transferNumber} এর পণ্য গন্তব্যে রিসিভ করা হয়েছে!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Transfers</h1>
            <span className="text-xs px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full font-bold">
              {transfers.length} transfers
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Track and move incoming stock between warehouses, port logistics depots, and regional fulfillment centers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create transfer</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        {/* Status Filters & Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['All', 'Pending', 'In Transit', 'Received', 'Draft'] as const).map((status) => (
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
              placeholder="Search transfer #, carrier, or tracking..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Transfers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Transfer ID</th>
                <th className="py-3 px-4">Origin Hub</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Carrier & Tracking</th>
                <th className="py-3 px-4">Expected Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredTransfers.map((tr) => {
                const totalUnits = tr.items.reduce((acc, i) => acc + i.quantity, 0);

                return (
                  <tr key={tr.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      <button
                        type="button"
                        onClick={() => setSelectedTransfer(tr)}
                        className="hover:underline hover:text-emerald-700 text-left"
                      >
                        #{tr.transferNumber}
                      </button>
                      <div className="text-[11px] text-gray-400 font-sans">{totalUnits} units total</div>
                    </td>

                    <td className="py-3 px-4 text-gray-700 font-medium">
                      <div className="truncate max-w-xs">{tr.origin}</div>
                    </td>

                    <td className="py-3 px-4 text-gray-700 font-medium">
                      <div className="truncate max-w-xs">{tr.destination}</div>
                    </td>

                    <td className="py-3 px-4">
                      {tr.status === 'Received' ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10.5px]">
                          Received
                        </span>
                      ) : tr.status === 'In Transit' ? (
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-[10.5px]">
                          In Transit
                        </span>
                      ) : tr.status === 'Pending' ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10.5px]">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-bold text-[10.5px]">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{tr.carrier}</div>
                      <div className="font-mono text-[10.5px] text-gray-500">{tr.trackingNumber}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-gray-600">
                      {tr.expectedDate}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {tr.status !== 'Received' && (
                          <button
                            type="button"
                            onClick={() => handleReceiveTransfer(tr)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold text-xs shadow-2xs transition-colors"
                          >
                            Mark received
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedTransfer(tr)}
                          className="px-2.5 py-1 border border-gray-300 hover:bg-white text-gray-700 rounded-md font-semibold text-xs shadow-2xs"
                        >
                          Details
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

      {/* Transfer Detail Modal */}
      {selectedTransfer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
                  <span>Transfer #{selectedTransfer.transferNumber}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Courier: {selectedTransfer.carrier} (Tracking: {selectedTransfer.trackingNumber})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTransfer(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-3 rounded-xl">
              <div>
                <span className="text-gray-500">From (Origin):</span>
                <p className="font-semibold text-gray-800 mt-0.5">{selectedTransfer.origin}</p>
              </div>
              <div>
                <span className="text-gray-500">To (Destination):</span>
                <p className="font-semibold text-gray-800 mt-0.5">{selectedTransfer.destination}</p>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-700 mb-2">Transferred Items:</div>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-600 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Item Name</th>
                      <th className="py-2 px-3 text-right">Transfer Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedTransfer.items.map((line, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{line.productName}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-gray-800 text-right">
                          {line.quantity} units
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Created: {selectedTransfer.createdDate} • Expected: {selectedTransfer.expectedDate}
              </span>
              <div className="flex items-center gap-2">
                {selectedTransfer.status !== 'Received' && (
                  <button
                    type="button"
                    onClick={() => handleReceiveTransfer(selectedTransfer)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                  >
                    Accept transfer items
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedTransfer(null)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Transfer Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTransfer}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>Create stock transfer</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Origin Location (From)</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Chattogram Port Depot (Agrabad)">Chattogram Port Depot (Agrabad)</option>
                <option value="Dhaka Central Warehouse (Mirpur Hub)">Dhaka Central Warehouse (Mirpur Hub)</option>
                <option value="Sylhet Regional Fulfillment Center">Sylhet Regional Fulfillment Center</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Destination Location (To)</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Dhaka Central Warehouse (Mirpur Hub)">Dhaka Central Warehouse (Mirpur Hub)</option>
                <option value="Chattogram Port Depot (Agrabad)">Chattogram Port Depot (Agrabad)</option>
                <option value="Sylhet Regional Fulfillment Center">Sylhet Regional Fulfillment Center</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Shipping Courier</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Steadfast Courier Logistics">Steadfast Logistics</option>
                  <option value="Pathao Parcel Express">Pathao Parcel</option>
                  <option value="RedX Cargo Delivery">RedX Cargo</option>
                  <option value="Paperfly Logistics">Paperfly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tracking Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SF-921840"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Product to Transfer</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.stockCount})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Transfer Quantity (Units)</label>
                <input
                  type="number"
                  min="1"
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800"
              >
                Save Transfer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
