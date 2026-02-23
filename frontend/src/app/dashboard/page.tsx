'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  productsApi,
  listingsApi,
  tradeRequestsApi,
  tradeOrdersApi,
  shipmentsApi,
} from '@/lib/api';

interface StatCard {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  link: string;
}

interface ActivityItem {
  id: string;
  label: string;
  sub: string;
  status: string;
  badgeColor: string;
  iconBg: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('User');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentOrders, setRecentOrders] = useState<ActivityItem[]>([]);
  const [recentShipments, setRecentShipments] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const u = localStorage.getItem('username');
    const r = localStorage.getItem('role');
    if (u) setUsername(u);
    if (r) setRole(r);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, listings, requests, purchases, sales, pendingShipments, activeShipments] =
        await Promise.allSettled([
          productsApi.getMyCompanyProducts(),
          listingsApi.getMyCompany(),
          tradeRequestsApi.getMyCompany(),
          tradeOrdersApi.getPurchases(),
          tradeOrdersApi.getSales(),
          shipmentsApi.getByStatus('PENDING'),
          shipmentsApi.getByStatus('IN_PROGRESS'),
        ]);

      const val = (r: PromiseSettledResult<any>, fallback = 0) => {
        if (r.status === 'fulfilled') {
          const d = r.value.data;
          return Array.isArray(d) ? d.length : fallback;
        }
        return fallback;
      };

      setStats([
        {
          label: 'My Products',
          value: val(products),
          icon: '🏷️',
          color: 'from-violet-500 to-violet-600',
          link: '/dashboard/products',
        },
        {
          label: 'Active Listings',
          value: val(listings),
          icon: '🛍️',
          color: 'from-blue-500 to-blue-600',
          link: '/dashboard/product-listings',
        },
        {
          label: 'Trade Requests',
          value: val(requests),
          icon: '📋',
          color: 'from-emerald-500 to-emerald-600',
          link: '/dashboard/trade-requests',
        },
        {
          label: 'My Purchases',
          value: val(purchases),
          icon: '🛒',
          color: 'from-orange-500 to-orange-600',
          link: '/dashboard/trade-orders',
        },
        {
          label: 'My Sales',
          value: val(sales),
          icon: '💰',
          color: 'from-pink-500 to-pink-600',
          link: '/dashboard/trade-orders',
        },
        {
          label: 'Shipments Active',
          value: val(pendingShipments) + val(activeShipments),
          icon: '🚢',
          color: 'from-cyan-500 to-cyan-600',
          link: '/dashboard/shipments',
        },
      ]);

      // Recent orders
      if (purchases.status === 'fulfilled' && Array.isArray(purchases.value.data)) {
        setRecentOrders(
          purchases.value.data.slice(0, 5).map((o: any) => ({
            id: o.id,
            label: `Order #${o.id?.slice(0, 8) ?? 'â€”'}`,
            sub: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'â€”',
            status: o.status ?? 'UNKNOWN',
            badgeColor: statusBadge(o.status),
            iconBg: 'bg-orange-100 text-orange-600',
          }))
        );
      }

      // Recent shipments
      if (pendingShipments.status === 'fulfilled' && Array.isArray(pendingShipments.value.data)) {
        setRecentShipments(
          pendingShipments.value.data.slice(0, 5).map((s: any) => ({
            id: s.id,
            label: `Shipment #${s.id?.slice(0, 8) ?? 'â€”'}`,
            sub: `Order: ${s.orderId?.slice(0, 8) ?? 'â€”'}`,
            status: s.status ?? 'PENDING',
            badgeColor: statusBadge(s.status),
            iconBg: 'bg-cyan-100 text-cyan-600',
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-700';
      case 'IN_PROGRESS':
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <p className="text-blue-100 text-sm mb-1">{today}</p>
          <h1 className="text-3xl font-bold mb-1">
            Good day, <span className="text-white">{username}</span> 👋
          </h1>
          <p className="text-blue-100 text-sm">
            {role ? `Logged in as ${role.replace(/_/g, ' ')}` : "Here's your IntelliCargo overview."}
          </p>
        </div>
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => router.push('/dashboard/trade-requests?create=true')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium rounded-xl transition-colors border border-white/30"
          >
            + New Trade Request
          </button>
          <button
            onClick={() => router.push('/dashboard/products?create=true')}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 text-sm font-medium rounded-xl transition-colors"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s, i) => (
            <button
              key={i}
              onClick={() => router.push(s.link)}
              className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
            >
              <div
                className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-lg mb-3 shadow`}
              >
                {s.icon}
              </div>
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Two column: Recent Orders + Shipments */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Purchases</h2>
            <button
              onClick={() => router.push('/dashboard/trade-orders')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOrders.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">No orders yet</div>
            ) : (
              recentOrders.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div
                    className={`w-10 h-10 ${item.iconBg} rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0`}
                  >
                    {item.label.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0 ${item.badgeColor}`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Shipments */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Pending Shipments</h2>
            <button
              onClick={() => router.push('/dashboard/shipments')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentShipments.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">No pending shipments</div>
            ) : (
              recentShipments.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div
                    className={`w-10 h-10 ${item.iconBg} rounded-full flex items-center justify-center text-lg flex-shrink-0`}
                  >
                    🚢
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0 ${item.badgeColor}`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Add Product', icon: '🏷️', link: '/dashboard/products', color: 'bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200' },
            { label: 'Create Listing', icon: '🛍️', link: '/dashboard/product-listings', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' },
            { label: 'New Trade Request', icon: '📋', link: '/dashboard/trade-requests', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' },
            { label: 'Track Shipments', icon: '🚢', link: '/dashboard/shipments', color: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200' },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => router.push(a.link)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${a.color}`}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-medium text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

