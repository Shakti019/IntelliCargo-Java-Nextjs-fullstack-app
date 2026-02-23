'use client';

import { useEffect, useState } from 'react';
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

const OFFER_STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];

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

  useEffect(() => { 
    load(); 
    loadMarketplaceRequests(); 
    loadCurrentUser(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const r = await tradeOffersApi.getReceived();
      setOffers(Array.isArray(r.data) ? r.data : []);
    } catch { setOffers([]); }
    finally { setLoading(false); }
  };

  const loadCurrentUser = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Get primary company role
        if (user.companyRoles && user.companyRoles.length > 0) {
          const primaryRole = user.companyRoles.find((r: any) => r.isPrimary) || user.companyRoles[0];
          setCurrentUserCompanyId(primaryRole.companyId);
        }
      }
    } catch { }
  };

  const loadMarketplaceRequests = async () => {
    setLoadingRequests(true);
    try {
      const r = await tradeRequestsApi.getMarketplace();
      setMarketplaceRequests(Array.isArray(r.data) ? r.data : []);
    } catch { setMarketplaceRequests([]); }
    finally { setLoadingRequests(false); }
  };

  const handleRequestChange = (requestId: string) => {
    const req = marketplaceRequests.find(r => r.id === requestId);
    setSelectedRequest(req || null);
    setForm({ 
      ...form, 
      tradeRequestId: requestId,
      currency: req?.currency || 'USD',
      offeredQuantity: req?.quantity || 1
    });
  };

  const handleSave = async () => {
    setError(''); setSaving(true);
    try {
      await tradeOffersApi.create(form);
      setShowForm(false); 
      setSelectedRequest(null);
      load();
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try { await tradeOffersApi.updateStatus(id, status); load(); } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer?')) return;
    try { await tradeOffersApi.delete(id); load(); } catch {}
  };

  const statusBadge = (s?: string) => {
    if (s === 'ACCEPTED') return 'bg-emerald-100 text-emerald-700';
    if (s === 'REJECTED') return 'bg-red-100 text-red-600';
    if (s === 'WITHDRAWN') return 'bg-slate-100 text-slate-600';
    if (s === 'COUNTERED') return 'bg-purple-100 text-purple-600';
    return 'bg-amber-100 text-amber-700';
  };

  const openForm = () => {
    setForm({ 
      tradeRequestId: '', 
      offeredPrice: 0, 
      currency: 'USD', 
      offeredQuantity: 1, 
      estimatedDeliveryDays: 7,
      additionalTerms: '' 
    });
    setSelectedRequest(null);
    setError('');
    setShowForm(true);
    loadMarketplaceRequests();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Trade Offers</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage offers made & received</p>
        </div>
        <button onClick={openForm}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          + New Offer
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-slate-100" />)}</div>
      ) : offers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <div className="text-4xl mb-3">🤝</div>
          <h3 className="font-semibold text-slate-700">No trade offers yet</h3>
          <p className="text-slate-400 text-sm mt-1">Submit an offer on a trade request to start</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Offer ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Trade Request</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Request By / Offer By</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Quantity</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {offers.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">{o.id.slice(0, 8)}…</td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-slate-800">{o.tradeRequestTitle || 'Untitled'}</div>
                    <div className="font-mono text-xs text-slate-400">{o.tradeRequestId?.slice(0, 8)}…</div>
                  </td>
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
                      {/* Only show Accept/Reject if current user's company is the one that created the trade request */}
                      {o.offerStatus === 'PENDING' && currentUserCompanyId === o.tradeRequestCompanyId && (
                        <>
                          <button onClick={() => handleUpdateStatus(o.id, 'ACCEPTED')} className="text-xs px-3 py-1 border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50">Accept</button>
                          <button onClick={() => handleUpdateStatus(o.id, 'REJECTED')} className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Reject</button>
                        </>
                      )}
                      {/* Show withdraw button if current user's company made the offer and it's still pending */}
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

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-semibold text-slate-800">Submit Trade Offer</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select a trade request from another company</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
              
              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">Select Trade Request from Other Companies *</label>
                {loadingRequests ? (
                  <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                ) : marketplaceRequests.length === 0 ? (
                  <div className="p-4 bg-amber-50 text-amber-600 text-sm rounded-xl border border-amber-100">
                    ⚠️ No trade requests from other companies available
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {marketplaceRequests.map((req) => {
                      const isSelected = form.tradeRequestId === req.id;
                      return (
                        <div
                          key={req.id}
                          onClick={() => handleRequestChange(req.id)}
                          className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  req.tradeType === 'BUY_PRODUCT' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {req.tradeType === 'BUY_PRODUCT' ? '🛒 BUY' : '🏷️ SELL'}
                                </span>
                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  🏢 {req.companyName}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-slate-800 mb-1">
                                {req.title || req.productName || 'Untitled Request'}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span>📦 {req.quantity} {req.unitType}</span>
                                {req.budgetMin && req.budgetMax && (
                                  <span>💰 {req.currency} {Number(req.budgetMin).toLocaleString()} - {Number(req.budgetMax).toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="text-blue-600 text-lg">✓</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedRequest && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-blue-900">📋 Selected Request Details</h3>
                  </div>
                  <div className="bg-white rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-600 text-white flex items-center gap-1">
                        🏢 {selectedRequest.companyName}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        selectedRequest.tradeType === 'BUY_PRODUCT' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {selectedRequest.tradeType === 'BUY_PRODUCT' ? '🛒 BUYING' : '🏷️ SELLING'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                      {selectedRequest.productName && (
                        <div className="col-span-2">
                          <span className="text-slate-500 block mb-1">Product:</span>
                          <p className="font-semibold text-slate-800 text-sm">{selectedRequest.productName}</p>
                        </div>
                      )}
                      {selectedRequest.productCategory && (
                        <div>
                          <span className="text-slate-500 block mb-1">Category:</span>
                          <p className="font-medium text-slate-800">{selectedRequest.productCategory}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-500 block mb-1">Quantity:</span>
                        <p className="font-medium text-slate-800">{selectedRequest.quantity} {selectedRequest.unitType}</p>
                      </div>
                      {selectedRequest.budgetMin && selectedRequest.budgetMax && (
                        <div className="col-span-2">
                          <span className="text-slate-500 block mb-1">Budget Range:</span>
                          <p className="font-semibold text-green-600">
                            {selectedRequest.currency} {Number(selectedRequest.budgetMin).toLocaleString()} - {Number(selectedRequest.budgetMax).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Price *</label>
                  <input type="number" min={0} value={form.offeredPrice} onChange={(e) => setForm({ ...form, offeredPrice: Number(e.target.value) })}
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
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Quantity *</label>
                  <input type="number" min={1} value={form.offeredQuantity} onChange={(e) => setForm({ ...form, offeredQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Delivery Days</label>
                  <input type="number" min={1} value={form.estimatedDeliveryDays} onChange={(e) => setForm({ ...form, estimatedDeliveryDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Additional Terms</label>
                <textarea value={form.additionalTerms} onChange={(e) => setForm({ ...form, additionalTerms: e.target.value })}
                  rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Any specific terms or conditions..." />
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.tradeRequestId}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-60">
                {saving ? 'Submitting…' : 'Submit Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
