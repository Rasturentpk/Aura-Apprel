import React from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  Package,
  AlertTriangle,
  Boxes,
  ArrowRight,
  Plus,
  ArrowUpRight,
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { analytics, orders, setCurrentTab } = useAdmin();
  const { formatPKR } = useStore();

  const totalSales = analytics?.totalSales || 0;
  const totalOrders = analytics?.totalOrders || orders.length;
  const pendingOrders = analytics?.pendingOrders || orders.filter((o) => o.orderStatus === 'Pending').length;
  const completedOrders = analytics?.completedOrders || orders.filter((o) => o.orderStatus === 'Delivered').length;
  const totalCustomers = analytics?.totalCustomers || 0;
  const totalProducts = analytics?.totalProducts || 0;
  const lowStock = analytics?.lowStockProducts || 0;
  const todaySales = analytics?.todaySales || 0;
  const monthlySales = analytics?.monthlySales || 0;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 uppercase">
            Store Performance Overview
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time sales, order fulfillment, and inventory analytics for I-8 Markaz Islamabad.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('products')}
            className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => setCurrentTab('orders')}
            className="px-4 py-2 bg-white border border-neutral-300 text-neutral-800 rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-100 transition-colors"
          >
            Manage Orders
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Total Sales */}
        <div className="bg-white p-5 rounded border border-neutral-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {formatPKR(totalSales)}
          </p>
          <div className="text-[10px] text-neutral-500">
            Today: <strong className="text-neutral-800 tabular-nums">{formatPKR(todaySales)}</strong>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded border border-neutral-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-neutral-800" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {totalOrders}
          </p>
          <div className="text-[10px] text-neutral-500">
            Completed: <strong className="text-emerald-700">{completedOrders}</strong>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded border border-neutral-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-700 font-mono tabular-nums">
            {pendingOrders}
          </p>
          <div className="text-[10px] text-neutral-500">
            Requires verification / dispatch
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-5 rounded border border-neutral-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-neutral-800" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {totalCustomers}
          </p>
          <div className="text-[10px] text-neutral-500">
            Unique profiles in database
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-5 rounded border border-neutral-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-700 font-mono tabular-nums">
            {lowStock}
          </p>
          <div className="text-[10px] text-neutral-500">
            Total styles: <strong className="text-neutral-800">{totalProducts}</strong>
          </div>
        </div>

      </div>

      {/* Secondary Metrics: Monthly & Daily Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sales Trend Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded border border-neutral-200 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900">
                Weekly Revenue Velocity
              </h2>
              <p className="text-xs text-neutral-500">Daily sales performance over the past 7 days</p>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-900">
              Month: {formatPKR(monthlySales)}
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="pt-6">
            <div className="h-44 flex items-end justify-between gap-3 border-b border-neutral-200 pb-2">
              {analytics?.salesByDay?.map((day) => {
                const maxVal = Math.max(...(analytics.salesByDay.map((d) => d.sales) || [10000]), 10000);
                const heightPct = Math.max(8, Math.round((day.sales / maxVal) * 100));
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                      {formatPKR(day.sales)}
                    </div>
                    <div
                      className="w-full bg-neutral-900 hover:bg-neutral-700 transition-all rounded-t"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] font-mono text-neutral-500">
                      {day.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Selling Products (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded border border-neutral-200 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900">
              Top Selling Articles
            </h2>
            <button
              onClick={() => setCurrentTab('analytics')}
              className="text-xs font-semibold text-neutral-500 hover:text-black flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100">
            {analytics?.topProducts && analytics.topProducts.length > 0 ? (
              analytics.topProducts.map((p, idx) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-mono text-neutral-400 font-bold w-4">{idx + 1}</span>
                    <div className="w-9 h-11 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-semibold text-neutral-900 truncate max-w-[150px] sm:max-w-[200px]">
                      {p.name}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-neutral-950 tabular-nums">{formatPKR(p.revenue)}</p>
                    <p className="text-[10px] text-neutral-500 font-mono">{p.salesCount} sold</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 py-4">No top articles yet</p>
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-neutral-500">Live incoming orders from store and web</p>
          </div>
          <button
            onClick={() => setCurrentTab('orders')}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-black flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Articles</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800 font-mono">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-neutral-950">#{ord.id}</td>
                  <td className="py-3 px-4 font-sans font-medium">{ord.customerName}</td>
                  <td className="py-3 px-4 font-sans text-neutral-600">{ord.shippingAddress.city}</td>
                  <td className="py-3 px-4">{ord.items.reduce((s, i) => s + i.quantity, 0)} pcs</td>
                  <td className="py-3 px-4 font-bold text-neutral-950 tabular-nums">
                    {formatPKR(ord.grandTotal)}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="uppercase text-[10px] font-semibold text-neutral-600">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => setCurrentTab('orders')}
                      className="text-neutral-900 font-semibold underline hover:text-black cursor-pointer"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
