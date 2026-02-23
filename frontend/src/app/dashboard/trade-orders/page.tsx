'use client';

import { useEffect, useState, useCallback } from 'react';
import { tradeOrdersApi, shipmentsApi, tradeOffersApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface TradeOrder {
  id: string;
  tradeRequestId?: string;
  acceptedOfferId?: string;
  buyerCompanyId?: number;
  buyerCompanyName?: string;
  sellerCompanyId?: number;
  sellerCompanyName?: string;
  finalPrice?: number;
  finalQuantity?: number;
  currency?: string;
  incoterm?: string;
  tradeStatus?: string;
  productName?: string;
  productCategory?: string;
  createdAt?: string;
}

interface TradeOffer {
  id: string;
  tradeRequestTitle?: string;
  offeredByCompanyName?: string;
  offeredPrice?: number;
  offeredQuantity?: number;
  currency?: string;
  unitType?: string;
}

type Tab = 'all' | 'purchases' | 'sales';

// Backend statuses: CONTRACTED, IN_PROGRESS, COMPLETED, CANCELLED
const ORDER_STATUSES = ['CONTRACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function TradeOrdersPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('all');
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TradeOrder | null>(null);
  const [offerId, setOfferId] = useState('');
  const [acceptedOffers, setAcceptedOffers] = useState<TradeOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [currentUserCompanyId, setCurrentUserCompanyId] = useState<number | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    load(); 
    loadCurrentUser();
    
    // Auto-refresh orders every 10 seconds
    const interval = setInterval(() => {
      loadSilently();
    }, 10000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [tab]);

  const loadCurrentUser = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.companyRoles && user.companyRoles.length > 0) {
          const primaryRole = user.companyRoles.find((r: any) => r.isPrimary) || user.companyRoles[0];
          setCurrentUserCompanyId(primaryRole.companyId);
        }
      }
    } catch { }
  };

  const load = async () => {
    setLoading(true);
    try {
      let r;
      if (tab === 'purchases') r = await tradeOrdersApi.getPurchases();
      else if (tab === 'sales') r = await tradeOrdersApi.getSales();
      else r = await tradeOrdersApi.getMyCompany();
      setOrders(Array.isArray(r.data) ? r.data : []);
      setLastRefresh(new Date());
    } catch { setOrders([]); }
    finally { setLoading(false); }
  };

  const loadSilently = async () => {
    try {
      let r;
      if (tab === 'purchases') r = await tradeOrdersApi.getPurchases();
      else if (tab === 'sales') r = await tradeOrdersApi.getSales();
      else r = await tradeOrdersApi.getMyCompany();
      setOrders(Array.isArray(r.data) ? r.data : []);
      setLastRefresh(new Date());
    } catch { /* Silent fail */ }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      let r;
      if (tab === 'purchases') r = await tradeOrdersApi.getPurchases();
      else if (tab === 'sales') r = await tradeOrdersApi.getSales();
      else r = await tradeOrdersApi.getMyCompany();
      setOrders(Array.isArray(r.data) ? r.data : []);
      setLastRefresh(new Date());
    } catch { setOrders([]); }
    finally { 
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const loadAcceptedOffers = async () => {
    setLoadingOffers(true);
    try {
      const r = await tradeOffersApi.getAccepted();
      setAcceptedOffers(Array.isArray(r.data) ? r.data : []);
    } catch { setAcceptedOffers([]); }
    finally { setLoadingOffers(false); }
  };

  const handleCreateFromOffer = async () => {
    if (!offerId.trim()) return;
    setError(''); setCreating(true);
    try {
      await tradeOrdersApi.createFromOffer(offerId.trim());
      setShowOfferForm(false); setOfferId(''); load();
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to create order'); }
    finally { setCreating(false); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try { 
      await tradeOrdersApi.updateStatus(id, status); 
      await load(); 
    } catch (e: any) {
      alert('Failed to update status: ' + (e.response?.data?.message || 'Unknown error'));
    }
  };

  const handlePayment = (order: TradeOrder) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleCompletePayment = async () => {
    if (!selectedOrder) return;
    setCreating(true);
    setError('');
    try {
      await tradeOrdersApi.updateStatus(selectedOrder.id, 'IN_PROGRESS');
      setShowPaymentModal(false);
      setSelectedOrder(null);
      alert('Payment completed! Order is now in progress.');
      load();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Payment failed');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateShipment = (order: TradeOrder) => {
    setSelectedOrder(order);
    setShowShipmentModal(true);
  };

  const handleConfirmShipment = async () => {
    if (!selectedOrder) return;
    setCreating(true);
    setError('');
    try {
      await shipmentsApi.createForOrder(selectedOrder.id, {
        carrier: 'DHL',
        originAddress: 'Origin warehouse',
        destinationAddress: 'Destination address'
      });
      setShowShipmentModal(false);
      setSelectedOrder(null);
      alert('Shipment created successfully!');
      router.push('/dashboard/shipments');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to create shipment');
    } finally {
      setCreating(false);
    }
  };

  const statusBadge = (s?: string) => {
    if (s === 'COMPLETED') return 'bg-emerald-100 text-emerald-700';
    if (s === 'IN_PROGRESS') return 'bg-blue-100 text-blue-700';
    if (s === 'CANCELLED') return 'bg-red-100 text-red-600';
    if (s === 'CONTRACTED') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Trade Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track all your purchase and sales orders</p>
          {mounted && lastRefresh && (
            <p className="text-xs text-slate-400 mt-1">Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refreshes every 10s</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Refresh orders"
          >
            <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={() => { setOfferId(''); setError(''); setShowOfferForm(true); loadAcceptedOffers(); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
            + Order from Offer
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(['all', 'purchases', 'sales'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'all' ? 'All Orders' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-slate-100" />)}</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <div className="text-4xl mb-3">🛒</div>
          <h3 className="font-semibold text-slate-700">No orders found</h3>
          <p className="text-slate-400 text-sm mt-1">Convert accepted trade offers into orders</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Buyer/Seller</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Quantity</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((o) => {
                const isBuyer = currentUserCompanyId === o.buyerCompanyId;
                const isSeller = currentUserCompanyId === o.sellerCompanyId;
                const canPay = isBuyer && o.tradeStatus === 'CONTRACTED';
                const canShip = isSeller && o.tradeStatus === 'IN_PROGRESS';
                
                return (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-800 font-mono text-xs">{o.id.slice(0, 8)}…</div>
                      <div className="text-xs text-slate-400">Offer: {o.acceptedOfferId?.slice(0, 8)}…</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-800">{o.productName || 'N/A'}</div>
                      <div className="text-xs text-slate-400">{o.productCategory || ''}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs">
                        <div><span className="text-slate-500">Buyer:</span> <span className="font-medium text-slate-700">{o.buyerCompanyName}</span></div>
                        <div><span className="text-slate-500">Seller:</span> <span className="font-medium text-slate-700">{o.sellerCompanyName}</span></div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {o.finalPrice != null ? `${o.currency ?? 'USD'} ${Number(o.finalPrice).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {o.finalQuantity != null ? Number(o.finalQuantity).toLocaleString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusBadge(o.tradeStatus)}`}>{o.tradeStatus ?? 'CONTRACTED'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-end items-center">
                        {canPay && (
                          <button 
                            onClick={() => handlePayment(o)}
                            className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                            💳 Pay Now
                          </button>
                        )}
                        {canShip && (
                          <button 
                            onClick={() => handleCreateShipment(o)}
                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                            🚢 Create Shipment
                          </button>
                        )}
                        <select
                          value={o.tradeStatus ?? ''}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                          className="text-xs px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-600"
                        >
                          <option value="" disabled>Update status</option>
                          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showOfferForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">Create Order from Offer</h2>
              <button onClick={() => setShowOfferForm(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Select Accepted Offer *</label>
                {loadingOffers ? (
                  <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                ) : acceptedOffers.length === 0 ? (
                  <div className="p-4 bg-amber-50 text-amber-600 text-sm rounded-xl border border-amber-100">
                    No accepted offers available. Accept an offer first.
                  </div>
                ) : (
                  <select 
                    value={offerId} 
                    onChange={(e) => setOfferId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Choose an accepted offer --</option>
                    {acceptedOffers.map((offer) => (
                      <option key={offer.id} value={offer.id}>
                        {offer.tradeRequestTitle} - {offer.offeredByCompanyName} ({offer.currency} {offer.offeredPrice?.toLocaleString()} for {offer.offeredQuantity} {offer.unitType})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowOfferForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleCreateFromOffer} disabled={creating || !offerId}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-60">
                {creating ? 'Creating…' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">💳 Payment Confirmation</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
              
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-slate-700">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Product:</span>
                    <span className="font-medium text-slate-800">{selectedOrder.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantity:</span>
                    <span className="font-medium text-slate-800">{selectedOrder.finalQuantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Seller:</span>
                    <span className="font-medium text-slate-800">{selectedOrder.sellerCompanyName}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <div className="flex justify-between text-base">
                      <span className="font-semibold text-slate-700">Total Amount:</span>
                      <span className="font-bold text-green-600">{selectedOrder.currency} {Number(selectedOrder.finalPrice).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">ℹ️</div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Payment Process</p>
                    <p className="text-blue-700">Clicking "Complete Payment" will mark this order as IN_PROGRESS and notify the seller to prepare the shipment.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleCompletePayment} disabled={creating}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium disabled:opacity-60">
                {creating ? 'Processing…' : '💳 Complete Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Shipment Modal */}
      {showShipmentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">🚢 Create Shipment</h2>
              <button onClick={() => setShowShipmentModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
              
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-slate-700">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order ID:</span>
                    <span className="font-mono font-medium text-slate-800 text-xs">{selectedOrder.id.slice(0, 8)}…</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Product:</span>
                    <span className="font-medium text-slate-800">{selectedOrder.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantity:</span>
                    <span className="font-medium text-slate-800">{selectedOrder.finalQuantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Buyer:</span>
                    <span className="font-medium text-slate-800">{selectedOrder.buyerCompanyName}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📦</div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Next Steps</p>
                    <p className="text-blue-700">A shipment will be created for this order. You'll be redirected to the shipments page to add tracking details and route stages.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowShipmentModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleConfirmShipment} disabled={creating}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-60">
                {creating ? 'Creating…' : '🚢 Create Shipment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
