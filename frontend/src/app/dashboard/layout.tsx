'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import SideNavbar from '@/components/SideNavbar';
import Header from '@/components/Header';

const drawerWidth = 260;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideNavbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </main>
      </div>
    </div>
  );
}
