'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { productsApi } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  unitType?: string; // Backend uses unitType
  minOrderQuantity?: number;
  isActive?: boolean; // Backend uses isActive
  createdAt?: string;
}

const CATEGORIES = ['ELECTRONICS', 'TEXTILES', 'FOOD', 'CHEMICALS', 'MACHINERY', 'AUTOMOTIVE', 'OTHER'];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', category: 'OTHER', unitType: 'PCS', minOrderQuantity: 1 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { 
    load(); 
  }, []);

  useEffect(() => {
    // Auto-open create form if ?create=true is in URL
    if (searchParams.get('create') === 'true') {
      setShowForm(true);
      setEditTarget(null);
      setForm({ name: '', description: '', category: 'OTHER', unitType: 'PCS', minOrderQuantity: 1 });
    }
  }, [searchParams]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await productsApi.getMyCompanyProducts();
      setProducts(Array.isArray(r.data) ? r.data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return load();
    setLoading(true);
    try {
      const r = await productsApi.search(search);
      setProducts(Array.isArray(r.data) ? r.data : []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const handleCategoryFilter = async (cat: string) => {
    setCategory(cat);
    if (!cat) return load();
    setLoading(true);
    try {
      const r = await productsApi.getByCategory(cat);
      setProducts(Array.isArray(r.data) ? r.data : []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm({ name: '', description: '', category: 'OTHER', unitType: 'PCS', minOrderQuantity: 1 });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditTarget(p);
    setForm({
      name: p.name,
      description: p.description ?? '',
      category: p.category ?? 'OTHER',
      unitType: p.unitType ?? 'PCS',
      minOrderQuantity: p.minOrderQuantity ?? 1,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      if (editTarget) {
        await productsApi.update(editTarget.id, form);
      } else {
        await productsApi.create(form);
      }
      setShowForm(false);
      load();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productsApi.delete(id);
      load();
    } catch {}
  };

  const statusColor = (isActive?: boolean) => {
    if (isActive === false) return 'bg-slate-100 text-slate-500';
    return 'bg-emerald-100 text-emerald-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your product catalogue</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-60 relative">
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={category}
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={handleSearch} className="px-4 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors">
          Search
        </button>
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <div className="text-4xl mb-3">🏷</div>
          <h3 className="font-semibold text-slate-700">No products found</h3>
          <p className="text-slate-400 text-sm mt-1">Add your first product to get started</p>
          <button onClick={openCreate} className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700">
            Add Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Product Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Unit</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Min Order</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 font-bold text-xs">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 max-w-xs truncate">{p.description ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                      {p.category ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{p.unitType ?? '—'}</td>
                  <td className="px-5 py-4 text-slate-600">{p.minOrderQuantity ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColor(p.isActive)}`}>
                      {p.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="text-xs px-3 py-1 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">{editTarget ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Steel Pipes" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Product details…" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Unit</label>
                  <select value={form.unitType} onChange={(e) => setForm({ ...form, unitType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    {['PCS', 'KG', 'TON', 'MTR', 'LTR', 'BOX'].map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Min Order Quantity</label>
                <input type="number" min={1} value={form.minOrderQuantity} onChange={(e) => setForm({ ...form, minOrderQuantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.name}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-60 transition-colors">
                {saving ? 'Saving…' : editTarget ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
