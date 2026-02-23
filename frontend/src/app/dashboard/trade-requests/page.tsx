'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { tradeRequestsApi, productsApi, tradeOffersApi } from '@/lib/api';

interface TradeRequest {
  id: string;
  title?: string;
  tradeType?: string;
  quantity?: number;
  unitType?: string;
  budgetMax?: number;
  currency?: string;
  tradeStatus?: string;
  description?: string;
  productId?: string;
  productName?: string;
  createdAt?: string;
}

interface Product {
  id: string;
  name: string;
  unitType?: string;
}

interface ReceivedOffer {
  id: string;
  tradeRequestTitle?: string;
  tradeRequestId?: string;
  offeredByCompanyName?: string;
  offeredPrice?: number;
  offeredQuantity?: number;
  currency?: string;
  unitType?: string;
  offerStatus?: string;
  estimatedDeliveryDays?: number;
  additionalTerms?: string;
  createdAt?: string;
}

type Tab = 'mine' | 'marketplace';

const REQUEST_TYPES = ['BUY', 'SELL'];

export default function TradeRequestsPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>('mine');
  const [requests, setRequests] = useState<TradeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<TradeRequest | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ title: '', type: 'BUY', productId: '', quantity: 1, unit: 'PCS', budget: 0, currency: 'USD', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [receivedOffers, setReceivedOffers] = useState<ReceivedOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);

  useEffect(() => { 
    load();
    loadProducts();
    if (tab === 'mine') loadReceivedOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    // Auto-open create form if ?create=true is in URL
    if (searchParams.get('create') === 'true') {
      setShowForm(true);
      setEditTarget(null);
      setForm({ title: '', type: 'BUY', productId: '', quantity: 1, unit: 'PCS', budget: 0, currency: 'USD', description: '' });
    }
  }, [searchParams]);

  const load = async () => {
    setLoading(true);
    try {
      const r = tab === 'mine' ? await tradeRequestsApi.getMyCompany() : await tradeRequestsApi.getMarketplace();
      setRequests(Array.isArray(r.data) ? r.data : []);
    } catch { setRequests([]); }
    finally { setLoading(false); }
  };

  const loadProducts = async () => {
    try {
      const r = await productsApi.getMyCompanyProducts();
      setProducts(Array.isArray(r.data) ? r.data : []);
    } catch { setProducts([]); }
  };

  const loadReceivedOffers = async () => {
    setLoadingOffers(true);
    try {
      const r = await tradeOffersApi.getReceived();
      setReceivedOffers(Array.isArray(r.data) ? r.data : []);
    } catch { setReceivedOffers([]); }
    finally { setLoadingOffers(false); }
  };

  const handleAcceptOffer = async (offerId: string) => {
    try {
      await tradeOffersApi.updateStatus(offerId, 'ACCEPTED');
      await loadReceivedOffers();
      alert('Offer accepted! You can now create a trade order from this offer.');
    } catch (err: any) {
      alert('Failed to accept offer: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to reject this offer?')) return;
    try {
      await tradeOffersApi.updateStatus(offerId, 'REJECTED');
      await loadReceivedOffers();
    } catch (err: any) {
      alert('Failed to reject offer: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return load();
    setLoading(true);
    try {
      const r = await tradeRequestsApi.search(search);
      setRequests(Array.isArray(r.data) ? r.data : []);
    } catch { setRequests([]); }
    finally { setLoading(false); }
  };

  const typeToBackend = (t: string) => t === 'BUY' ? 'BUY_PRODUCT' : t === 'SELL' ? 'SELL_PRODUCT' : t;
  const typeFromBackend = (t?: string) => t === 'BUY_PRODUCT' ? 'BUY' : t === 'SELL_PRODUCT' ? 'SELL' : (t ?? 'BUY');

  const handleTypeFilter = async (type: string) => {
    setTypeFilter(type);
    if (!type) return load();
    setLoading(true);
    try {
      const r = await tradeRequestsApi.getByType(typeToBackend(type));
      setRequests(Array.isArray(r.data) ? r.data : []);
    } catch { setRequests([]); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm({ title: '', type: 'BUY', productId: '', quantity: 1, unit: 'PCS', budget: 0, currency: 'USD', description: '' });
    setError(''); setShowForm(true);
  };

  const openEdit = (r: TradeRequest) => {
    setEditTarget(r);
    setForm({
      title: r.title ?? '',
      type: typeFromBackend(r.tradeType),
      productId: r.productId ?? '',
      quantity: r.quantity ?? 1,
      unit: r.unitType ?? 'PCS',
      budget: r.budgetMax ?? 0,
      currency: r.currency ?? 'USD',
      description: r.description ?? '',
    });
    setError(''); setShowForm(true);
  };

  const handleSave = async () => {
    // Validation
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (form.quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    if (form.budget < 0) {
      setError('Budget cannot be negative');
      return;
    }

    setError(''); 
    setSaving(true);
    // Map frontend form fields → backend DTO field names/values
    const payload = {
      title: form.title,
      tradeType: typeToBackend(form.type),
      productId: form.productId || null,
      quantity: form.quantity,
      unitType: form.unit,
      budgetMax: form.budget,
      currency: form.currency,
      description: form.description,
    };
    try {
      if (editTarget) { await tradeRequestsApi.update(editTarget.id, payload); }
      else { await tradeRequestsApi.create(payload); }
      setShowForm(false); load();
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this trade request?')) return;
    try { 
      await tradeRequestsApi.cancel(id); 
      load(); 
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Failed to cancel trade request');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trade request? This action cannot be undone.')) return;
    try { 
      await tradeRequestsApi.delete(id); 
      load(); 
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Failed to delete trade request');
    }
  };

  const typeBadge = (t?: string) =>
    (t === 'BUY' || t === 'BUY_PRODUCT') ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700';

  const statusBadge = (s?: string) => {
    if (s === 'OPEN') return 'bg-emerald-100 text-emerald-700';
    if (s === 'NEGOTIATION') return 'bg-amber-100 text-amber-700';
    if (s === 'CONFIRMED') return 'bg-violet-100 text-violet-700';
    if (s === 'CANCELLED' || s === 'EXPIRED') return 'bg-red-100 text-red-600';
    return 'bg-slate-100 text-slate-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Trade Requests</h1>
          <p className="text-sm text-slate-500 mt-0.5">Post buy/sell requests & explore marketplace</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          + New Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(['mine', 'marketplace'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'mine' ? 'My Requests' : 'Marketplace'}
          </button>
        ))}
      </div>

      {/* Received Offers Section - Only shown on "My Requests" tab */}
      {tab === 'mine' && receivedOffers.filter(o => o.offerStatus === 'PENDING').length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-xl">🔔</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Offers Waiting for Your Response</h3>
                <p className="text-sm text-slate-600">Review and accept offers on your trade requests</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              {receivedOffers.filter(o => o.offerStatus === 'PENDING').length} pending
            </span>
          </div>

          <div className="space-y-3">
            {receivedOffers
              .filter(o => o.offerStatus === 'PENDING')
              .slice(0, 5)
              .map((offer) => (
                <div key={offer.id} className="bg-white rounded-xl p-4 border border-amber-100 hover:border-amber-300 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-800">{offer.tradeRequestTitle}</h4>
                        <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          🤝 {offer.offeredByCompanyName}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Offered Price</p>
                          <p className="font-bold text-green-600">
                            {offer.currency} {offer.offeredPrice?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Quantity</p>
                          <p className="font-semibold text-slate-700">
                            {offer.offeredQuantity} {offer.unitType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Delivery</p>
                          <p className="font-semibold text-slate-700">
                            {offer.estimatedDeliveryDays} days
                          </p>
                        </div>
                      </div>
                      {offer.additionalTerms && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded">
                          <strong>Terms:</strong> {offer.additionalTerms}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all"
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => handleRejectOffer(offer.id)}
                        className="px-4 py-2 border-2 border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-all"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {receivedOffers.filter(o => o.offerStatus === 'PENDING').length > 5 && (
            <p className="text-sm text-slate-600 mt-3 text-center">
              + {receivedOffers.filter(o => o.offerStatus === 'PENDING').length - 5} more offers
            </p>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-60 relative">
          <input type="text" placeholder="Search requests…" value={search}
            onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select value={typeFilter} onChange={(e) => handleTypeFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
          <option value="">All Types</option>
          <option value="BUY">Buy Requests</option>
          <option value="SELL">Sell Requests</option>
        </select>
        <button onClick={handleSearch} className="px-4 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-700">Search</button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-slate-100" />)}</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="font-semibold text-slate-700">No trade requests</h3>
          <p className="text-slate-400 text-sm mt-1">Post a buy or sell request to start trading</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase min-w-[250px]">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Budget</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  {tab === 'mine' && <th className="px-5 py-3 min-w-[200px]" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-800">{r.title ?? `Request #${r.id.slice(0, 8)}`}</div>
                      <div className="text-xs text-slate-400">
                        {r.productName && <span className="text-violet-600 font-medium">🏷 {r.productName} • </span>}
                        {r.quantity} {r.unitType}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${typeBadge(r.tradeType)}`}>
                        {typeFromBackend(r.tradeType)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {r.budgetMax != null ? `${r.currency ?? 'USD'} ${Number(r.budgetMax).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusBadge(r.tradeStatus)}`}>{r.tradeStatus ?? 'OPEN'}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                    {tab === 'mine' && (
                      <td className="px-5 py-4">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openEdit(r)} className="text-xs px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-medium">Edit</button>
                          <button onClick={() => handleCancel(r.id)} className="text-xs px-3 py-1 border border-amber-200 text-amber-600 rounded-lg hover:bg-amber-50 font-medium">Cancel</button>
                          <button onClick={() => handleDelete(r.id)} className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium">Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">{editTarget ? 'Edit Request' : 'New Trade Request'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Title *</label>
                <input 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. Need 100 tons of Steel" 
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Product (Optional)</label>
                <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">-- No Product Selected --</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {REQUEST_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Quantity *</label>
                  <input 
                    type="number" 
                    min={1} 
                    required
                    value={form.quantity} 
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Unit</label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {['PCS', 'KG', 'TON', 'MTR', 'LTR', 'BOX'].map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Budget *</label>
                  <input 
                    type="number" 
                    min={0} 
                    step="0.01"
                    required
                    value={form.budget} 
                    onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Currency</label>
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {['USD', 'EUR', 'GBP', 'INR', 'CNY'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title.trim() || form.quantity < 1 || form.budget < 0}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                {saving ? 'Saving…' : editTarget ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
