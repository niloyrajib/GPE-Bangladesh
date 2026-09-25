import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Truck,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
  X
} from 'lucide-react';
import { Product } from '../../../types';

interface ShopifyPurchaseOrdersViewProps {
  products: Product[];
  onUpdateProductStock?: (productId: string, newStock: number) => void;
  showToast?: (message: string) => void;
}

export interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  vendorName: string;
  vendorCountry: string;
  destination: string;
  status: 'Draft' | 'Ordered' | 'In Transit' | 'Received';
  orderDate: string;
  expectedDate: string;
  totalCostBDT: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitCostBDT: number;
  }[];
}

const INITIAL_POS: PurchaseOrderRecord[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2041',
    vendorName: 'Shenzhen Tech Imports Ltd.',
    vendorCountry: 'China (Shenzhen)',
    destination: 'Dhaka Central Warehouse (Mirpur Hub)',
    status: 'In Transit',
    orderDate: '2026-09-02',
    expectedDate: '2026-09-18',
    totalCostBDT: 145000,
    items: [
      {
        productId: 'watch-t900',
        productName: 'T900 Ultra Smartwatch 2.09" Display',
        quantity: 50,
        unitCostBDT: 950
      },
      {
        productId: 'earbuds-m10',
        productName: 'M10 TWS Wireless Earbuds with Powerbank Case',
        quantity: 100,
        unitCostBDT: 480
      }
    ]
  },
  {
    id: 'po-2',
    poNumber: 'PO-2040',
    vendorName: 'Anker Bangladesh Wholesale Distributor',
    vendorCountry: 'Bangladesh (Dhaka)',
    destination: 'Dhaka Central Warehouse (Mirpur Hub)',
    status: 'Received',
    orderDate: '2026-08-20',
    expectedDate: '2026-08-28',
    totalCostBDT: 98000,
    items: [
      {
        productId: 'acc-powerbank',
        productName: 'Magnetic 10,000mAh Wireless Power Bank',
        quantity: 40,
        unitCostBDT: 1250
      }
    ]
  },
  {
    id: 'po-3',
    poNumber: 'PO-2039',
    vendorName: 'Guangzhou Vintage Grooming Co.',
    vendorCountry: 'China (Guangzhou)',
    destination: 'Chattogram Port Depot (Agrabad)',
    status: 'Draft',
    orderDate: '2026-09-10',
    expectedDate: '2026-09-25',
    totalCostBDT: 62000,
    items: [
      {
        productId: 'trimmer-vgr',
        productName: 'Vintage T9 Professional Hair & Beard Trimmer',
        quantity: 60,
        unitCostBDT: 650
      }
    ]
  }
];

export const ShopifyPurchaseOrdersView: React.FC<ShopifyPurchaseOrdersViewProps> = ({
  products,
  onUpdateProductStock,
  showToast = (_msg: string) => {}
}) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(INITIAL_POS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Ordered' | 'In Transit' | 'Received'>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderRecord | null>(null);

  // New PO form state
  const [vendorName, setVendorName] = useState('');
  const [vendorCountry, setVendorCountry] = useState('China (Shenzhen)');
  const [destination, setDestination] = useState('Dhaka Central Warehouse (Mirpur Hub)');
  const [expectedDate, setExpectedDate] = useState('2026-09-28');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [orderQuantity, setOrderQuantity] = useState(50);
  const [unitCost, setUnitCost] = useState(800);

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    const prod = products.find((p) => p.id === selectedProductId) || products[0];
    const totalCost = orderQuantity * unitCost;

    const newPO: PurchaseOrderRecord = {
      id: `po-${Date.now()}`,
      poNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      vendorName: vendorName.trim(),
      vendorCountry,
      destination,
      status: 'Ordered',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate,
      totalCostBDT: totalCost,
      items: [
        {
          productId: prod ? prod.id : 'custom-item',
          productName: prod ? prod.name : 'Custom Stock Shipment',
          quantity: orderQuantity,
          unitCostBDT: unitCost
        }
      ]
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    setIsCreateModalOpen(false);
    setVendorName('');
    showToast(`Purchase Order ${newPO.poNumber} সফলভাবে তৈরি করা হয়েছে`);
  };

  const handleReceiveInventory = (po: PurchaseOrderRecord) => {
    // Mark as received
    setPurchaseOrders((prev) =>
      prev.map((item) => (item.id === po.id ? { ...item, status: 'Received' } : item))
    );

    // Increment actual product stocks
    if (onUpdateProductStock) {
      po.items.forEach((line) => {
        const prod = products.find((p) => p.id === line.productId || p.name === line.productName);
        if (prod) {
          const newTotal = (prod.stockCount || 0) + line.quantity;
          onUpdateProductStock(prod.id, newTotal);
        }
      });
    }

    if (selectedPO?.id === po.id) {
      setSelectedPO({ ...po, status: 'Received' });
    }

    showToast(`Purchase Order ${po.poNumber} এর ইনভেন্টরি রিসিভ ও স্টক ইনক্রিজ সম্পন্ন!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Purchase orders</h1>
            <span className="text-xs px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full font-bold">
              {purchaseOrders.length} orders
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage purchase orders from international and local suppliers, track shipment arrivals, and receive incoming inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create purchase order</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        {/* Status Filters & Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['All', 'Ordered', 'In Transit', 'Received', 'Draft'] as const).map((status) => (
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
              placeholder="Search PO #, supplier, or hub..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* PO Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Supplier / Vendor</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Expected Date</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredPOs.map((po) => {
                const totalUnits = po.items.reduce((acc, i) => acc + i.quantity, 0);

                return (
                  <tr key={po.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      <button
                        type="button"
                        onClick={() => setSelectedPO(po)}
                        className="hover:underline hover:text-emerald-700 text-left"
                      >
                        #{po.poNumber}
                      </button>
                      <div className="text-[11px] text-gray-400 font-sans">{totalUnits} units total</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{po.vendorName}</div>
                      <div className="text-[11px] text-gray-500">{po.vendorCountry}</div>
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      <div className="truncate max-w-xs">{po.destination}</div>
                    </td>

                    <td className="py-3 px-4">
                      {po.status === 'Received' ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10.5px]">
                          Received
                        </span>
                      ) : po.status === 'In Transit' ? (
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-[10.5px]">
                          In Transit
                        </span>
                      ) : po.status === 'Ordered' ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10.5px]">
                          Ordered
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-bold text-[10.5px]">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-gray-600">
                      {po.expectedDate}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      ৳{po.totalCostBDT.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {po.status !== 'Received' && (
                          <button
                            type="button"
                            onClick={() => handleReceiveInventory(po)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold text-xs shadow-2xs transition-colors"
                          >
                            Receive items
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedPO(po)}
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

      {/* PO Detail View Modal */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  <span>Purchase Order #{selectedPO.poNumber}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Supplier: {selectedPO.vendorName} ({selectedPO.vendorCountry})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPO(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-3 rounded-xl">
              <div>
                <span className="text-gray-500">Destination:</span>
                <p className="font-semibold text-gray-800 mt-0.5">{selectedPO.destination}</p>
              </div>
              <div>
                <span className="text-gray-500">Expected Arrival:</span>
                <p className="font-semibold text-gray-800 mt-0.5">{selectedPO.expectedDate}</p>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-700 mb-2">Items in Order:</div>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-600 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Item Name</th>
                      <th className="py-2 px-3">Ordered Qty</th>
                      <th className="py-2 px-3">Unit Cost</th>
                      <th className="py-2 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedPO.items.map((line, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{line.productName}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-gray-700">{line.quantity} units</td>
                        <td className="py-2.5 px-3 font-mono text-gray-600">৳{line.unitCostBDT}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-gray-900 text-right">
                          ৳{(line.quantity * line.unitCostBDT).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-xs font-bold text-gray-700">
                Total Value: <span className="font-mono text-emerald-600">৳{selectedPO.totalCostBDT.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedPO.status !== 'Received' && (
                  <button
                    type="button"
                    onClick={() => handleReceiveInventory(selectedPO)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                  >
                    Receive inventory to stock
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedPO(null)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePO}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>Create Purchase Order</span>
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Supplier / Vendor Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Shenzhen Tech Imports Ltd."
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Origin Country / Region</label>
                <input
                  type="text"
                  value={vendorCountry}
                  onChange={(e) => setVendorCountry(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
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

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Destination Warehouse</label>
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

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Product to Reorder</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Current stock: {p.stockCount})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Order Quantity (Units)</label>
                <input
                  type="number"
                  min="1"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Unit Purchase Cost (BDT)</label>
                <input
                  type="number"
                  min="1"
                  value={unitCost}
                  onChange={(e) => setUnitCost(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between text-emerald-800">
              <span className="font-medium">Total estimated cost:</span>
              <span className="font-mono font-bold text-sm">৳{(orderQuantity * unitCost).toLocaleString()} BDT</span>
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
                Send Purchase Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
