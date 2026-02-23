'use client';

import { useEffect, useState, useCallback } from 'react';
import { companiesApi } from '@/lib/api';

interface Company {
  id?: string;
  name?: string;
  description?: string;
  industry?: string;
  country?: string;
  city?: string;
  website?: string;
  email?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
}

type Tab = 'mine' | 'all';

export default function CompaniesPage() {
  const [tab, setTab] = useState<Tab>('mine');
  const [myCompany, setMyCompany] = useState<Company | null>(null);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Company>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (tab === 'mine') loadMyCompany();
    else loadAll();
    
    // Auto-refresh every 15 seconds for All Companies tab
    const interval = setInterval(() => {
      if (tab === 'all') loadAllSilently();
    }, 15000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const loadMyCompany = async () => {
    setLoading(true);
    setError('');
    try {
      const r = await companiesApi.getMyCompany();
      setMyCompany(r.data);
      setForm(r.data);
      setLastRefresh(new Date());
    } catch (e: any) {
      setMyCompany(null);
      if (e?.response?.status !== 404) {
        setError('Failed to load company details');
      }
    }
    finally { setLoading(false); }
  };

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const r = await companiesApi.getAllCompanies();
      setAllCompanies(Array.isArray(r.data) ? r.data : []);
      setLastRefresh(new Date());
    } catch (e: any) {
      setAllCompanies([]);
      setError('Failed to load companies. Please check your connection.');
    }
    finally { setLoading(false); }
  };

  const loadAllSilently = async () => {
    try {
      const r = await companiesApi.getAllCompanies();
      setAllCompanies(Array.isArray(r.data) ? r.data : []);
      setLastRefresh(new Date());
    } catch { /* Silent fail */ }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (tab === 'mine') {
      await loadMyCompany();
    } else {
      await loadAll();
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSave = async () => {
    setError(''); setSuccess(''); setSaving(true);
    try {
      await companiesApi.updateMyCompany(form as Record<string, unknown>);
      setSuccess('Company details updated successfully');
      setEditing(false);
      loadMyCompany();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const INDUSTRIES = ['LOGISTICS', 'MANUFACTURING', 'RETAIL', 'CHEMICAL', 'AUTOMOTIVE', 'TEXTILE', 'FOOD', 'TECHNOLOGY', 'OTHER'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Companies</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your company profile & browse partners</p>
          {mounted && lastRefresh && tab === 'all' && (
            <p className="text-xs text-slate-400 mt-1">Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refreshes every 15s</p>
          )}
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Refresh companies"
        >
          <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(['mine', 'all'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'mine' ? 'My Company' : 'All Companies'}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-64 bg-white rounded-2xl animate-pulse border border-slate-100" />
      ) : tab === 'mine' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Company Header Banner */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-400 rounded-full blur-2xl" />
            </div>
            <div className="relative flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {(myCompany?.name ?? 'C').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{myCompany?.name ?? 'Your Company'}</h2>
                <p className="text-slate-300 text-sm mt-0.5">{myCompany?.industry ?? '—'} · {myCompany?.country ?? '—'}</p>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)} className="ml-auto px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl transition-colors backdrop-blur-sm border border-white/20">
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {success && <div className="mx-6 mt-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100">{success}</div>}
          {error && <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}

          <div className="p-8">
            {!editing ? (
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Company Name', value: myCompany?.name },
                  { label: 'Industry', value: myCompany?.industry },
                  { label: 'Country', value: myCompany?.country },
                  { label: 'City', value: myCompany?.city },
                  { label: 'Email', value: myCompany?.email },
                  { label: 'Phone', value: myCompany?.phone },
                  { label: 'Website', value: myCompany?.website },
                  { label: 'Status', value: myCompany?.status },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{f.label}</p>
                    <p className="text-sm font-medium text-slate-800">{f.value ?? '—'}</p>
                  </div>
                ))}
                {myCompany?.description && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Description</p>
                    <p className="text-sm text-slate-700">{myCompany.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Company Name', type: 'text' },
                    { key: 'email', label: 'Email', type: 'email' },
                    { key: 'phone', label: 'Phone', type: 'text' },
                    { key: 'website', label: 'Website', type: 'url' },
                    { key: 'country', label: 'Country', type: 'text' },
                    { key: 'city', label: 'City', type: 'text' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">{f.label}</label>
                      <input type={f.type} value={(form as any)[f.key] ?? ''}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Industry</label>
                  <select value={form.industry ?? ''} onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Description</label>
                  <textarea value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditing(false)} className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button onClick={handleSave} disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-60">
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* All Companies */
        allCompanies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
            <div className="text-4xl mb-3">🏢</div>
            <h3 className="font-semibold text-slate-700">No companies found</h3>
            <p className="text-slate-400 text-sm mt-2">There are no registered companies yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {allCompanies.map((c) => (
              <div key={c.id} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {(c.name ?? 'C').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{c.name ?? '—'}</h3>
                    <p className="text-xs text-slate-400">{c.industry ?? '—'}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {c.country && <div className="flex items-center gap-2 text-xs text-slate-500"><span>📍</span> {c.city ? `${c.city}, ` : ''}{c.country}</div>}
                  {c.email && <div className="flex items-center gap-2 text-xs text-slate-500"><span>✉</span> {c.email}</div>}
                  {c.website && <div className="flex items-center gap-2 text-xs text-blue-500"><span>🌐</span><a href={c.website} target="_blank" rel="noreferrer" className="hover:underline truncate">{c.website}</a></div>}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
