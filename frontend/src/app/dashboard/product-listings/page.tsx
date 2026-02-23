'use client';

import { useEffect, useState } from 'react';
import { listingsApi, productsApi } from '@/lib/api';

interface Listing {
  id: string;
  productId?: string;
  productName?: string;
  pricePerUnit?: number; // Backend field
  currency?: string;
  availableQuantity?: number; // Backend field
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  listingStatus?: string; // Backend field
  description?: string;
  incoterm?: string;
  portOfLoading?: string;
  validUntil?: string;
  createdAt?: string;
}

interface Product { id: string; name: string; unit?: string; }

type Tab = 'mine' | 'marketplace';

export default function ProductListingsPage() {
  const [tab, setTab] = useState<Tab>('mine');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Listing | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ productId: '', pricePerUnit: 0, currency: 'USD', availableQuantity: 1, incoterm: 'FOB', portOfLoading: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); loadProducts(); }, [tab]);

  const load = async () => {
    setLoading(true);
    try {
      const r = tab === 'mine' ? await listingsApi.getMyCompany() : await listingsApi.getMarketplace();
      setListings(Array.isArray(r.data) ? r.data : []);
    } catch { setListings([]); }
    finally { setLoading(false); }
  };

  const loadProducts = async () => {
    try {
      const r = await productsApi.getMyCompanyProducts();
      setProducts(Array.isArray(r.data) ? r.data : []);
    } catch { setProducts([]); }
  };

  const handleSearch = async () => {
    if (!search.trim()) return load();
    setLoading(true);
    try {
      const r = await listingsApi.search(search);
      setListings(Array.isArray(r.data) ? r.data : []);
    } catch { setListings([]); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm({ productId: products[0]?.id ?? '', pricePerUnit: 0, currency: 'USD', availableQuantity: 1, incoterm: 'FOB', portOfLoading: '', description: '' });
    setError('');
    setShowForm(true);
  };

  const openEdit = (l: Listing) => {
    setEditTarget(l);
    setForm({ 
      productId: l.productId ?? '', 
      pricePerUnit: l.pricePerUnit ?? 0, 
      currency: l.currency ?? 'USD', 
      availableQuantity: l.availableQuantity ?? 1, 
      incoterm: l.incoterm ?? 'FOB',
      portOfLoading: l.portOfLoading ?? '',
      description: l.description ?? '' 
    });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    setError(''); setSaving(true);
    try {
      if (editTarget) {
        await listingsApi.update(editTarget.id, form);
      } else {
        await listingsApi.create(form);
      }
      setShowForm(false); load();
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleClose = async (id: string) => {
    if (!confirm('Close this listing?')) return;
    try { await listingsApi.close(id); load(); } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    try { await listingsApi.delete(id); load(); } catch {}
  };

  const statusColor = (s?: string) => {
    if (s === 'OPEN') return 'bg-emerald-100 text-emerald-700';
    if (s === 'CLOSED') return 'bg-slate-100 text-slate-500';
    if (s === 'EXPIRED') return 'bg-red-100 text-red-600';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Product Listings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Browse marketplace & manage your listings</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          + New Listing
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(['mine', 'marketplace'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'mine' ? 'My Listings' : 'Marketplace'}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input type="text" placeholder="Search listings…" value={search}
            onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={handleSearch} className="px-4 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-700">Search</button>
      </div>

      {/* Listings Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-slate-100" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <div className="text-4xl mb-3">🛍</div>
          <h3 className="font-semibold text-slate-700">No listings found</h3>
          <p className="text-slate-400 text-sm mt-1">{tab === 'mine' ? 'Create your first listing.' : 'No marketplace listings available.'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantity</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Created</th>
                {tab === 'mine' && <th className="px-5 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-800">{l.productName ?? l.productId ?? '—'}</div>
                    <div className="text-xs text-slate-400 truncate max-w-xs">{l.description ?? ''}</div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {l.pricePerUnit != null ? `${l.currency ?? 'USD'} ${Number(l.pricePerUnit).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{l.availableQuantity != null ? Number(l.availableQuantity).toLocaleString() : '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColor(l.listingStatus)}`}>
                      {l.listingStatus ?? 'OPEN'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs">
                    {l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '—'}
                  </td>
                  {tab === 'mine' && (
                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(l)} className="text-xs px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">Edit</button>
                        <button onClick={() => handleClose(l.id)} className="text-xs px-3 py-1 border border-amber-200 text-amber-600 rounded-lg hover:bg-amber-50">Close</button>
                        <button onClick={() => handleDelete(l.id)} className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">{editTarget ? 'Edit Listing' : 'New Listing'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Product *</label>
                <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Price Per Unit *</label>
                  <input type="number" min={0} step="0.01" value={form.pricePerUnit}
                    onChange={(e) => setForm({ ...form, pricePerUnit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Currency</label>
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {['USD', 'EUR', 'GBP', 'INR', 'CNY'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Available Quantity *</label>
                  <input type="number" min={1} value={form.availableQuantity}
                    onChange={(e) => setForm({ ...form, availableQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Incoterm</label>
                  <select value={form.incoterm} onChange={(e) => setForm({ ...form, incoterm: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {['FOB', 'CIF', 'EXW', 'DDP', 'DAP'].map((i) => <option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Port of Loading</label>
                <input type="text" value={form.portOfLoading}
                  onChange={(e) => setForm({ ...form, portOfLoading: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Shanghai Port" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.productId}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-60">
                {saving ? 'Saving…' : editTarget ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
