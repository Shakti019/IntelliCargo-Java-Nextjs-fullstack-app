'use client';

import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface CompanyRole {
  id: number;
  companyId: number;
  companyName: string;
  roleId: number;
  roleName: string;
  isPrimary: boolean;
}

interface User {
  userId?: number;
  email?: string;
  fullName?: string;
  country?: string;
  provider?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  companyRoles?: CompanyRole[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<CompanyRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [meRes, rolesRes] = await Promise.allSettled([
        usersApi.getMe(),
        usersApi.getMyRoles(),
      ]);
      if (meRes.status === 'fulfilled') {
        setUser(meRes.value.data);
        // cache username
        if (meRes.value.data?.fullName) {
          localStorage.setItem('username', meRes.value.data.fullName);
        }
      }
      if (rolesRes.status === 'fulfilled') {
        const r = rolesRes.value.data;
        setRoles(Array.isArray(r) ? r : []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth');
  };

  const roleColor = (roleName: string) => {
    if (roleName?.includes('ADMIN')) return 'bg-violet-100 text-violet-700';
    if (roleName?.includes('CARRIER')) return 'bg-blue-100 text-blue-700';
    if (roleName?.includes('SHIPPER')) return 'bg-emerald-100 text-emerald-700';
    return 'bg-slate-100 text-slate-600';
  };

  const initial = (user?.fullName ?? user?.email ?? 'U').charAt(0).toUpperCase();
  
  // Get primary role and company
  const primaryRole = roles.find(r => r.isPrimary);
  const primaryCompany = primaryRole?.companyName ?? '—';
  const primaryRoleName = primaryRole?.roleName ?? '—';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your account details and roles</p>
      </div>

      {loading ? (
        <div className="h-64 bg-white rounded-2xl animate-pulse border border-slate-100" />
      ) : (
        <>
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white rounded-full blur-2xl" />
              </div>
              <div className="relative flex items-center gap-5">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-600 shadow-lg">
                  {initial}
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-bold">{user?.fullName ?? '—'}</h2>
                  <p className="text-blue-200 text-sm mt-0.5">{user?.email ?? '—'}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', value: user?.fullName },
                  { label: 'Email Address', value: user?.email },
                  { label: 'Role', value: primaryRoleName?.replace(/_/g, ' ') },
                  { label: 'Company', value: primaryCompany },
                  { label: 'User ID', value: user?.userId?.toString() },
                  { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : null },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{f.label}</p>
                    <p className="text-sm font-medium text-slate-800 break-all">{f.value ?? '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roles Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Assigned Roles</h3>
            {roles.length === 0 ? (
              <p className="text-sm text-slate-400">No roles assigned yet, or roles endpoint unavailable.</p>
            ) : (
              <div className="space-y-2">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${roleColor(role.roleName)}`}>
                        {role.roleName?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-slate-600">{role.companyName}</span>
                    </div>
                    {role.isPrimary && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Account Actions</h3>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard/companies')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Manage Company
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-xl transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
