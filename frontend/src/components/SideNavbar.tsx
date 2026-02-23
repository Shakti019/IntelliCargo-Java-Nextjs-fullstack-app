'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const groups = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '▣', path: '/dashboard' },
    ],
  },
  {
    label: 'CATALOGUE',
    items: [
      { id: 'products', label: 'Products', icon: '🏷', path: '/dashboard/products' },
      { id: 'product-listings', label: 'Marketplace', icon: '🛍', path: '/dashboard/product-listings' },
    ],
  },
  {
    label: 'TRADE',
    items: [
      { id: 'trade-requests', label: 'Trade Requests', icon: '📋', path: '/dashboard/trade-requests' },
      { id: 'trade-offers', label: 'Trade Offers', icon: '🤝', path: '/dashboard/trade-offers' },
      { id: 'trade-orders', label: 'Trade Orders', icon: '🛒', path: '/dashboard/trade-orders' },
    ],
  },
  {
    label: 'LOGISTICS',
    items: [
      { id: 'shipments', label: 'Shipments', icon: '🚢', path: '/dashboard/shipments' },
    ],
  },
  {
    label: 'ORGANISATION',
    items: [
      { id: 'companies', label: 'Companies', icon: '🏢', path: '/dashboard/companies' },
      { id: 'profile', label: 'Profile', icon: '👤', path: '/dashboard/profile' },
    ],
  },
];

function SideNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState('User');
  const [role, setRole] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('username');
    const r = localStorage.getItem('role');
    if (u) setUsername(u);
    if (r) setRole(r);
  }, []);

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col overflow-y-auto shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg text-white">
            IC
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-none">IntelliCargo</h1>
            <p className="text-xs text-gray-500 mt-0.5">Logistics Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 px-3 mb-2">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-base w-5 text-center">{item.icon}</span>
                    {item.label}
                    {isActive(item.path) && (
                      <span className="ml-auto w-1.5 h-1.5 bg-white/60 rounded-full" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={() => router.push('/dashboard/profile')}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0">
            {username.charAt(0)}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
            <p className="text-[11px] text-gray-500 truncate">{role || 'Member'}</p>
          </div>
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SideNavbar;