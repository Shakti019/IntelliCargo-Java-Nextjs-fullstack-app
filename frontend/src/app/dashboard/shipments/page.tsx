'use client';

import { useEffect, useState } from 'react';
import { shipmentsApi, tradeOrdersApi } from '@/lib/api';

interface Shipment {
  id: string;
  orderId?: string;
  status?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  originAddress?: string;
  destinationAddress?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TradeOrder {
  id: string;
  productName?: string;
  productCategory?: string;
  buyerCompanyName?: string;
  sellerCompanyName?: string;
  finalPrice?: number;
  finalQuantity?: number;
  currency?: string;
  tradeStatus?: string;
  createdAt?: string;
}

const STATUSES = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED'];

export default function ShipmentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [allShipments, setAllShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [formOrderId, setFormOrderId] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<TradeOrder[]>([]);

  useEffect(() => { load(); loadOrders(); }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setShipments(allShipments);
    } else {
      setShipments(allShipments.filter(s => s.status === statusFilter));
    }
  }, [statusFilter, allShipments]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await shipmentsApi.getMyCompany();
      setAllShipments(Array.isArray(r.data) ? r.data : []);
      setShipments(Array.isArray(r.data) ? r.data : []);
    } catch { setAllShipments([]); setShipments([]); }
    finally { setLoading(false); }
  };

  const loadOrders = async () => {
    try {
      const r = await tradeOrdersApi.getMyCompany();
      setOrders(Array.isArray(r.data) ? r.data : []);
    } catch { setOrders([]); }
  };

  const handleCreate = async () => {
    if (!formOrderId.trim()) return;
    setError(''); setCreating(true);
    try {
      await shipmentsApi.createForOrder(formOrderId.trim(), {});
      setShowCreateForm(false); setFormOrderId(''); load();
    } catch (e: any) { 
      setError(e?.response?.data?.message ?? 'Failed to create shipment. Check if shipment already exists for this order.');
    }
    finally { setCreating(false); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try { 
      await shipmentsApi.updateStatus(id, status); 
      load(); 
      if (selectedShipment?.id === id) {
        const updated = await shipmentsApi.getById(id);
        setSelectedShipment(updated.data);
      }
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to update status');
    }
  };

  const viewDetails = async (shipment: Shipment) => {
    try {
      const r = await shipmentsApi.getById(shipment.id);
      setSelectedShipment(r.data);
      setShowDetailsModal(true);
    } catch {
      setSelectedShipment(shipment);
      setShowDetailsModal(true);
    }
  };

  const statusBadge = (s?: string) => {
    if (s === 'DELIVERED') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s === 'IN_TRANSIT') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s === 'OUT_FOR_DELIVERY') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (s === 'PICKED_UP') return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (s === 'FAILED' || s === 'CANCELLED') return 'bg-red-100 text-red-600 border-red-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  const statusDot = (s?: string) => {
    if (s === 'DELIVERED') return 'bg-emerald-500';
    if (s === 'IN_TRANSIT') return 'bg-blue-500';
    if (s === 'OUT_FOR_DELIVERY') return 'bg-purple-500';
    if (s === 'PICKED_UP') return 'bg-indigo-500';
    if (s === 'FAILED' || s === 'CANCELLED') return 'bg-red-500';
    return 'bg-amber-400';
  };

  const statusIcon = (s?: string) => {
    if (s === 'DELIVERED') return '✓';
    if (s === 'IN_TRANSIT') return '🚚';
    if (s === 'OUT_FOR_DELIVERY') return '📦';
    if (s === 'PICKED_UP') return '📤';
    if (s === 'FAILED' || s === 'CANCELLED') return '⚠';
    return '⏳';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Shipments</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track and manage all shipments</p>
        </div>
        <button 
          onClick={() => { setFormOrderId(''); setError(''); setShowCreateForm(true); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
          + Create Shipment
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', count: allShipments.length, color: 'bg-slate-100 text-slate-700' },
          { label: 'In Transit', count: allShipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY').length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Delivered', count: allShipments.filter(s => s.status === 'DELIVERED').length, color: 'bg-emerald-100 text-emerald-700' },
          { label: 'Pending', count: allShipments.filter(s => s.status === 'PENDING').length, color: 'bg-amber-100 text-amber-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color.split(' ')[1]}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Status Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        <button 
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${statusFilter === 'ALL' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
          ALL ({allShipments.length})
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${statusFilter === s ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
            {s.replace(/_/g, ' ')} ({allShipments.filter(sh => sh.status === s).length})
          </button>
        ))}
      </div>

      {/* Shipments List */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-slate-100" />)}</div>
      ) : shipments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="font-semibold text-slate-700 text-lg">No {statusFilter !== 'ALL' ? statusFilter.replace(/_/g, ' ').toLowerCase() : ''} shipments</h3>
          <p className="text-slate-400 text-sm mt-2">
            {statusFilter === 'ALL' 
              ? 'Create a shipment from a trade order to get started' 
              : 'Shipments with this status will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {shipments.map((s) => (
            <div key={s.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => viewDetails(s)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{statusIcon(s.status)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusBadge(s.status)}`}>
                          {s.status?.replace(/_/g, ' ') ?? 'PENDING'}
                        </span>
                        {s.trackingNumber && (
                          <span className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700">
                            {s.trackingNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-mono">ID: {s.id.slice(0, 13)}...</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wide">Order ID</span>
                      <p className="text-sm font-medium text-slate-700 font-mono mt-0.5">{s.orderId?.slice(0, 12)}...</p>
                    </div>
                    {s.carrier && (
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wide">Carrier</span>
                        <p className="text-sm font-medium text-slate-700 mt-0.5">{s.carrier}</p>
                      </div>
                    )}
                    {s.estimatedDelivery && (
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wide">Est. Delivery</span>
                        <p className="text-sm text-slate-600 mt-0.5">{new Date(s.estimatedDelivery).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wide">Created</span>
                      <p className="text-sm text-slate-600 mt-0.5">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <select
                    value={s.status ?? ''}
                    onChange={(e) => { e.stopPropagation(); handleUpdateStatus(s.id, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-600 min-w-[180px]"
                  >
                    <option value="" disabled>Update status…</option>
                    {STATUSES.map((st) => <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Shipment Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">Create Shipment</h2>
              <button onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
              
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-sm text-slate-600 font-medium mb-1">No Trade Orders Available</p>
                  <p className="text-xs text-slate-500">Create a trade order first to generate shipments</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-600">Select a trade order to create a shipment for it.</p>
                  
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-2 block">Select Trade Order *</label>
                    <select
                      value={formOrderId}
                      onChange={(e) => setFormOrderId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">-- Select a trade order --</option>
                      {orders.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.productName || 'Product N/A'} • {order.buyerCompanyName || 'Buyer'} ← {order.sellerCompanyName || 'Seller'} • {order.finalQuantity || '0'} units • {order.currency || ''} {order.finalPrice || '0'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Order Details Preview */}
                  {formOrderId && orders.find(o => o.id === formOrderId) && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-xs font-medium text-slate-600 mb-2">Order Details</p>
                      {(() => {
                        const selected = orders.find(o => o.id === formOrderId);
                        return (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-slate-400">Product:</span>
                              <span className="ml-1 font-medium text-slate-700">{selected?.productName || '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Category:</span>
                              <span className="ml-1 font-medium text-slate-700">{selected?.productCategory || '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Buyer:</span>
                              <span className="ml-1 font-medium text-slate-700">{selected?.buyerCompanyName || '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Seller:</span>
                              <span className="ml-1 font-medium text-slate-700">{selected?.sellerCompanyName || '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Quantity:</span>
                              <span className="ml-1 font-medium text-slate-700">{selected?.finalQuantity || '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Amount:</span>
                              <span className="ml-1 font-medium text-slate-700">{selected?.currency} {selected?.finalPrice || '—'}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-400">Order ID:</span>
                              <span className="ml-1 font-mono text-[10px] text-slate-600">{selected?.id}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowCreateForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={creating || !formOrderId || orders.length === 0}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-60 transition-colors shadow-sm">
                {creating ? 'Creating…' : 'Create Shipment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipment Details Modal */}
      {showDetailsModal && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="font-semibold text-slate-800">Shipment Details</h2>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{selectedShipment.id}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">Current Status</label>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-4 py-2 rounded-full border ${statusBadge(selectedShipment.status)}`}>
                    {selectedShipment.status?.replace(/_/g, ' ') ?? 'PENDING'}
                  </span>
                  <select
                    value={selectedShipment.status ?? ''}
                    onChange={(e) => handleUpdateStatus(selectedShipment.id, e.target.value)}
                    className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-600"
                  >
                    <option value="" disabled>Update status…</option>
                    {STATUSES.map((st) => <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Tracking Number</label>
                  <p className="text-sm font-mono bg-slate-50 px-3 py-2 rounded-lg text-slate-700">
                    {selectedShipment.trackingNumber || '—'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Carrier</label>
                  <p className="text-sm bg-slate-50 px-3 py-2 rounded-lg text-slate-700">
                    {selectedShipment.carrier || '—'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Order ID</label>
                  <p className="text-sm font-mono bg-slate-50 px-3 py-2 rounded-lg text-slate-700">
                    {selectedShipment.orderId?.slice(0, 20)}...
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Created At</label>
                  <p className="text-sm bg-slate-50 px-3 py-2 rounded-lg text-slate-700">
                    {selectedShipment.createdAt ? new Date(selectedShipment.createdAt).toLocaleString() : '—'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Estimated Delivery</label>
                  <p className="text-sm bg-slate-50 px-3 py-2 rounded-lg text-slate-700">
                    {selectedShipment.estimatedDelivery ? new Date(selectedShipment.estimatedDelivery).toLocaleString() : '—'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Actual Delivery</label>
                  <p className="text-sm bg-slate-50 px-3 py-2 rounded-lg text-slate-700">
                    {selectedShipment.actualDelivery ? new Date(selectedShipment.actualDelivery).toLocaleString() : '—'}
                  </p>
                </div>
              </div>

              {/* Addresses */}
              {(selectedShipment.originAddress || selectedShipment.destinationAddress) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Origin Address</label>
                    <p className="text-sm bg-slate-50 px-3 py-2 rounded-lg text-slate-700">
                      {selectedShipment.originAddress || '—'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Destination Address</label>
                    <p className="text-sm bg-slate-50 px-3 py-2 rounded-lg text-slate-700">
                      {selectedShipment.destinationAddress || '—'}
                    </p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedShipment.notes && (
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Notes</label>
                  <p className="text-sm bg-slate-50 px-3 py-3 rounded-lg text-slate-700 whitespace-pre-wrap">
                    {selectedShipment.notes}
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-3 block">Timeline</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${statusDot(selectedShipment.status)}`} />
                    <span className="text-sm text-slate-600">Current: {selectedShipment.status?.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-sm text-slate-600">Updated: {selectedShipment.updatedAt ? new Date(selectedShipment.updatedAt).toLocaleString() : '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-5 border-t border-slate-100 pt-4">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
