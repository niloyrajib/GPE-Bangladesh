import React from 'react';
import {
  BarChart2,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  Calendar,
  ArrowUpRight,
  PieChart
} from 'lucide-react';
import { Order, Product } from '../../../types';

interface ShopifyAnalyticsViewProps {
  orders: Order[];
  products: Product[];
}

export const ShopifyAnalyticsView: React.FC<ShopifyAnalyticsViewProps> = ({ orders, products }) => {
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time sales breakdown, store traffic, average order values, and conversion channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>Last 30 days</span>
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Total Store Sales</span>
          <p className="text-xl font-bold font-mono text-gray-900 mt-1">৳{totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +21.4%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Average Order Value (AOV)</span>
          <p className="text-xl font-bold font-mono text-gray-900 mt-1">৳{avgOrderValue.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +8.1%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Online Store Sessions</span>
          <p className="text-xl font-bold font-mono text-gray-900 mt-1">14,820</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Bangladeshi visitors</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Total Orders Placed</span>
          <p className="text-xl font-bold font-mono text-gray-900 mt-1">{orders.length}</p>
          <span className="text-[11px] text-purple-700 font-medium mt-1 block">3.4% conversion</span>
        </div>
      </div>

      {/* Sales by Channel & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sales by channel */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-gray-500" />
            <span>Sales by Channel</span>
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1">
                <span>Online Web Store (Direct)</span>
                <span className="font-mono">72% (৳{Math.round(totalRevenue * 0.72).toLocaleString()})</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[72%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1">
                <span>Facebook & Instagram Social Commerce</span>
                <span className="font-mono">20% (৳{Math.round(totalRevenue * 0.20).toLocaleString()})</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[20%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1">
                <span>Point of Sale (In-Store Outlet)</span>
                <span className="font-mono">8% (৳{Math.round(totalRevenue * 0.08).toLocaleString()})</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full w-[8%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gray-500" />
            <span>Top Performing Products</span>
          </h3>

          <div className="divide-y divide-gray-100">
            {products.slice(0, 4).map((p, idx) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <span className="font-mono font-bold text-gray-400 w-4">0{idx + 1}</span>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-bold text-gray-900 truncate">{p.name}</p>
                    <span className="text-[10.5px] text-gray-400 font-mono">SKU: {p.sku}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-gray-900 block">৳{p.price.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-600 font-medium">{p.soldCount} sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
