'use client';

import { useEffect, useState, useCallback } from 'react';
import { tradeOffersApi, tradeRequestsApi } from '@/lib/api';

interface TradeOffer {
  id: string;
  tradeRequestId?: string;
  tradeRequestTitle?: string;
  tradeRequestCompanyId?: number;
  tradeRequestCompanyName?: string;
  offeredByCompanyId?: number;
  offeredByCompanyName?: string;
  offeredByUserId?: number;
  offeredByUserName?: string;
  offeredPrice?: number;
  offeredQuantity?: number;
  unitType?: string;
  currency?: string;
  estimatedDeliveryDays?: number;
  additionalTerms?: string;
  offerStatus?: string;
  createdAt?: string;
}

interface TradeRequest {
  id: string;
  title?: string;
  companyName?: string;
  productName?: string;
  productCategory?: string;
  tradeType?: string;
  quantity?: number;
  unitType?: string;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  tradeStatus?: string;
}

export default function TradeOffersPage() {
  const [offers, setOffers] = useState<TradeOffer[]>([]);
  const [marketplaceRequests, setMarketplaceRequests] = useState<TradeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    tradeRequestId: '', 
    offeredPrice: 0, 
    currency: 'USD', 
    offeredQuantity: 1, 
    estimatedDeliveryDays: 7,
    additionalTerms: '' 
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<TradeRequest | null>(null);
  const [currentUserCompanyId, setCurrentUserCompanyId] = useState<number | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load functions defined before useEffect
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await tradeOffersApi.getMyCompany();
      setOffers(Array.isArray(r.data) ? r.data : []);
      setLastRefresh(new Date());
    } catch { setOffers([]); }
    finally { setLoading(false); }
  }, []);

  // Silent refresh without showing loading spinner (for auto-refresh)
  const loadSilently = useCallback(async () => {
    try {
      const r = await tradeOffersApi.getMyCompany();
      setOffers(Array.isArray(r.data) ? r.data : []);
      setLastRefresh(new Date());
    } catch { 
      // Silent fail for auto-refresh
    }
  }, []);

  // Manual refresh with visual feedback
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const r = await tradeOffersApi.getMyCompany();
      setOffers(Array.isArray(r.data) ? r.data : []);
      setLastRefresh(new Date());
    } catch { setOffers([]); }
    finally { 
      setTimeout(() => setIsRefreshing(false), 500); // Brief delay for visual feedback
    }
  }, []);

  const loadMarketplaceRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const r = await tradeRequestsApi.getMarketplace();
      setMarketplaceRequests(Array.isArray(r.data) ? r.data : []);
    } catch { setMarketplaceRequests([]); }
    finally { setLoadingRequests(false); }
  }, []);

  const loadCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('http://localhost:8080/api/companies/my-company', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUserCompanyId(data.id);
      }
    } catch (err) {
      console.error('Error loading user company:', err);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    load(); 
    loadMarketplaceRequests(); 
    loadCurrentUser(); 
    
    // Auto-refresh offers every 10 seconds to detect status changes
    const interval = setInterval(() => {
      loadSilently();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [load, loadMarketplaceRequests, loadCurrentUser, loadSilently]);

  const handleMakeOffer = (req: TradeRequest) => {
    setSelectedRequest(req);
    setForm({ 
      tradeRequestId: req.id,
      offeredPrice: req.budgetMin || 0,
      currency: req.currency || 'USD',
      offeredQuantity: req.quantity || 1,
      estimatedDeliveryDays: 7,
      additionalTerms: ''
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.tradeRequestId) {
      setError('Please select a trade request');
      return;
    }
    if (form.offeredPrice <= 0) {
      setError('Please enter a valid price');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await tradeOffersApi.create(form);
      setShowForm(false);
      setForm({ tradeRequestId: '', offeredPrice: 0, currency: 'USD', offeredQuantity: 1, estimatedDeliveryDays: 7, additionalTerms: '' });
      setSelectedRequest(null);
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit offer');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await tradeOffersApi.updateStatus(id, status);
      await load();
    } catch (err: any) {
      alert('Failed to update status: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer?')) return;
    try {
      await tradeOffersApi.delete(id);
      await load();
    } catch (err: any) {
      alert('Failed to delete: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const statusBadge = (status?: string) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      case 'WITHDRAWN': return 'bg-gray-100 text-gray-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">🛍️ Marketplace & Offers</h1>
        <p className="text-sm text-slate-500 mt-1">Browse trade opportunities from other companies and manage your offers</p>
      </div>

      {/* Marketplace Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-800">🌍 Global Marketplace</h2>
          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {marketplaceRequests.length} opportunities
          </span>
        </div>

        {loadingRequests ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : marketplaceRequests.length === 0 ? (
          <div className="p-16 bg-slate-50 rounded-2xl text-center border-2 border-dashed border-slate-200">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-slate-600 font-semibold text-lg mb-1">No opportunities available</p>
            <p className="text-slate-400 text-sm">Check back later for trade requests from other companies</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {marketplaceRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-purple-400 hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Card Header with Gradient */}
                  <div className={`p-4 border-b ${
                    req.tradeType === 'SELL_PRODUCT'
                      ? 'bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 border-purple-100'
                      : 'bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-50 border-blue-100'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm ${
                        req.tradeType === 'SELL_PRODUCT' ? 'bg-purple-600' : 'bg-blue-600'
                      }`}>
                        {req.tradeType === 'SELL_PRODUCT' ? '🏷️ FOR SALE' : '🛒 WANTED'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 line-clamp-2 min-h-[3rem] group-hover:text-purple-700 transition-colors">
                      {req.title || req.productName || 'Untitled Product'}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Company Badge */}
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                      <span className="text-xs font-medium text-slate-600">
                        {req.tradeType === 'SELL_PRODUCT' ? 'Seller:' : 'Buyer:'}
                      </span>
                      <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                        🏢 {req.companyName}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-2">
                      <div className="bg-blue-50 rounded-lg p-2.5">
                        <p className="text-xs text-blue-600 font-medium mb-0.5">
                          {req.tradeType === 'SELL_PRODUCT' ? 'Quantity Available' : 'Quantity Needed'}
                        </p>
                        <p className="font-bold text-blue-900">
                          {req.quantity?.toLocaleString()} <span className="text-sm font-normal">{req.unitType}</span>
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2.5">
                        <p className="text-xs text-green-600 font-medium mb-0.5">Budget Range</p>
                        <p className="font-bold text-green-900 text-sm">
                          {req.currency} {req.budgetMin?.toLocaleString()}-{req.budgetMax?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Make Offer Button */}
                    <button
                      onClick={() => handleMakeOffer(req)}
                      className={`w-full mt-3 py-2.5 font-semibold rounded-lg shadow-md group-hover:shadow-lg transition-all text-white ${
                        req.tradeType === 'SELL_PRODUCT'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                      }`}
                    >
                      {req.tradeType === 'SELL_PRODUCT' ? '🛒 Make Purchase Offer' : '📦 Make Supply Offer'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* My Offers Table */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">📋 My Submitted Offers</h2>
            {mounted && lastRefresh && (
              <p className="text-xs text-slate-400 mt-1">
                Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refreshes every 10s
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{offers.length} offers</span>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Refresh offers"
            >
              <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-slate-100" />)}
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-semibold text-slate-700">No offers submitted yet</h3>
            <p className="text-slate-400 text-sm mt-1">Browse the marketplace above and make an offer on items you're interested in</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Request</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Companies</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Price</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Quantity</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Date</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offers.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-800">{o.tradeRequestTitle || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500">Request:</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            🏢 {o.tradeRequestCompanyName || '—'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500">Offered:</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            🤝 {o.offeredByCompanyName || '—'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {o.offeredPrice != null ? `${o.currency ?? 'USD'} ${Number(o.offeredPrice).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{o.offeredQuantity != null ? `${Number(o.offeredQuantity).toLocaleString()} ${o.unitType ?? ''}` : '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusBadge(o.offerStatus)}`}>{o.offerStatus ?? 'PENDING'}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-end">
                        {o.offerStatus === 'PENDING' && currentUserCompanyId === o.tradeRequestCompanyId && (
                          <>
                            <button onClick={() => handleUpdateStatus(o.id, 'ACCEPTED')} className="text-xs px-3 py-1 border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50">Accept</button>
                            <button onClick={() => handleUpdateStatus(o.id, 'REJECTED')} className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Reject</button>
                          </>
                        )}
                        {o.offerStatus === 'PENDING' && currentUserCompanyId === o.offeredByCompanyId && (
                          <button onClick={() => handleUpdateStatus(o.id, 'WITHDRAWN')} className="text-xs px-3 py-1 border border-amber-200 text-amber-600 rounded-lg hover:bg-amber-50">Withdraw</button>
                        )}
                        <button onClick={() => handleDelete(o.id)} className="text-xs px-3 py-1 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Offer Form Modal */}
      {showForm && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-800">🤝 Submit Offer</h2>
                <p className="text-xs text-slate-500 mt-0.5">Make an offer on this item</p>
              </div>
              <button onClick={() => { setShowForm(false); setSelectedRequest(null); }} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="p-6 space-y-5">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
              
              {/* Selected Item Card */}
              <div className={`p-4 rounded-xl border-2 ${
                selectedRequest.tradeType === 'SELL_PRODUCT'
                  ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                  : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${
                    selectedRequest.tradeType === 'SELL_PRODUCT' ? 'bg-purple-600' : 'bg-blue-600'
                  }`}>
                    {selectedRequest.tradeType === 'SELL_PRODUCT' ? '🏷️ SELLING' : '🛒 BUYING'}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">🏢 {selectedRequest.companyName}</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-3">{selectedRequest.title || selectedRequest.productName}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-2.5">
                    <p className="text-xs text-slate-500 mb-0.5">Quantity</p>
                    <p className="font-semibold text-slate-800">{selectedRequest.quantity} {selectedRequest.unitType}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5">
                    <p className="text-xs text-slate-500 mb-0.5">Price Range</p>
                    <p className="font-semibold text-green-600 text-sm">
                      {selectedRequest.currency} {selectedRequest.budgetMin?.toLocaleString()}-{selectedRequest.budgetMax?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Offer Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Your Offer Price *</label>
                    <input 
                      type="number" 
                      min={0} 
                      value={form.offeredPrice} 
                      onChange={(e) => setForm({ ...form, offeredPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Currency</label>
                    <select 
                      value={form.currency} 
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-white"
                    >
                      {['USD', 'EUR', 'GBP', 'INR', 'CNY'].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Quantity *</label>
                    <input 
                      type="number" 
                      min={1} 
                      value={form.offeredQuantity} 
                      onChange={(e) => setForm({ ...form, offeredQuantity: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Delivery Days</label>
                    <input 
                      type="number" 
                      min={1} 
                      value={form.estimatedDeliveryDays} 
                      onChange={(e) => setForm({ ...form, estimatedDeliveryDays: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Additional Terms (Optional)</label>
                  <textarea 
                    value={form.additionalTerms} 
                    onChange={(e) => setForm({ ...form, additionalTerms: e.target.value })}
                    rows={3} 
                    className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none" 
                    placeholder="e.g., Warranty, shipping terms, payment conditions..." 
                  />
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button 
                onClick={() => { setShowForm(false); setSelectedRequest(null); }} 
                className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving || !form.tradeRequestId || form.offeredPrice <= 0}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {saving ? 'Submitting...' : '🚀 Submit Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
