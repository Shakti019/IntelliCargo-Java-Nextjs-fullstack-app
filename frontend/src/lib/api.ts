import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-handle stale / expired tokens: clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== 'undefined' &&
      error?.response?.status === 401
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Avoid redirect loop if we're already on the auth page
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ────────────────────────────────────────────────────────────
// AUTH
// ────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; fullName: string; role: string; companyName?: string }) =>
    api.post('/auth/register', data),
};

// ────────────────────────────────────────────────────────────
// USERS
// ────────────────────────────────────────────────────────────
export const usersApi = {
  getMe: () => api.get('/users/me'),
  getMyRoles: () => api.get('/users/me/roles'),
  getAllUsers: () => api.get('/users/admin/all'),
};

// ────────────────────────────────────────────────────────────
// COMPANIES
// ────────────────────────────────────────────────────────────
export const companiesApi = {
  getMyCompany: () => api.get('/companies/my-company'),
  getAllCompanies: () => api.get('/companies/all'),
  updateMyCompany: (data: Record<string, unknown>) => api.put('/companies/my-company', data),
  updateCompany: (id: string, data: Record<string, unknown>) => api.put(`/companies/${id}`, data),
};

// ────────────────────────────────────────────────────────────
// PRODUCTS
// ────────────────────────────────────────────────────────────
export const productsApi = {
  create: (data: Record<string, unknown>) => api.post('/products', data),
  getById: (id: string) => api.get(`/products/${id}`),
  getMyCompanyProducts: () => api.get('/products/my-company'),
  getActive: () => api.get('/products/active'),
  getByCategory: (category: string) => api.get(`/products/category/${category}`),
  search: (query: string) => api.get('/products/search', { params: { q: query } }),
  update: (id: string, data: Record<string, unknown>) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// ────────────────────────────────────────────────────────────
// PRODUCT LISTINGS
// ────────────────────────────────────────────────────────────
export const listingsApi = {
  create: (data: Record<string, unknown>) => api.post('/product-listings', data),
  getById: (id: string) => api.get(`/product-listings/${id}`),
  getMyCompany: () => api.get('/product-listings/my-company'),
  getMarketplace: () => api.get('/product-listings/marketplace'),
  getByProduct: (productId: string) => api.get(`/product-listings/product/${productId}`),
  search: (query: string) => api.get('/product-listings/search', { params: { q: query } }),
  update: (id: string, data: Record<string, unknown>) => api.put(`/product-listings/${id}`, data),
  close: (id: string) => api.patch(`/product-listings/${id}/close`),
  delete: (id: string) => api.delete(`/product-listings/${id}`),
};

// ────────────────────────────────────────────────────────────
// TRADE REQUESTS
// ────────────────────────────────────────────────────────────
export const tradeRequestsApi = {
  create: (data: Record<string, unknown>) => api.post('/trade-requests', data),
  getById: (id: string) => api.get(`/trade-requests/${id}`),
  getMyCompany: () => api.get('/trade-requests/my-company'),
  getMarketplace: () => api.get('/trade-requests/marketplace'),
  getByType: (type: string) => api.get(`/trade-requests/type/${type}`),
  search: (query: string) => api.get('/trade-requests/search', { params: { q: query } }),
  update: (id: string, data: Record<string, unknown>) => api.put(`/trade-requests/${id}`, data),
  cancel: (id: string) => api.patch(`/trade-requests/${id}/cancel`),
  delete: (id: string) => api.delete(`/trade-requests/${id}`),
};

// ────────────────────────────────────────────────────────────
// TRADE OFFERS
// ────────────────────────────────────────────────────────────
export const tradeOffersApi = {
  create: (data: Record<string, unknown>) => api.post('/trade-offers', data),
  getById: (id: string) => api.get(`/trade-offers/${id}`),
  getByTradeRequest: (requestId: string) => api.get(`/trade-offers/trade-request/${requestId}`),
  getMyCompany: () => api.get('/trade-offers/my-company'),
  getReceived: () => api.get('/trade-offers/received'),
  getAccepted: () => api.get('/trade-offers/accepted'),
  updateStatus: (id: string, status: string) => api.patch(`/trade-offers/${id}/status?status=${status}`),
  delete: (id: string) => api.delete(`/trade-offers/${id}`),
};

// ────────────────────────────────────────────────────────────
// TRADE ORDERS
// ────────────────────────────────────────────────────────────
export const tradeOrdersApi = {
  createFromOffer: (offerId: string) => api.post(`/trade-orders/from-offer/${offerId}`),
  getById: (id: string) => api.get(`/trade-orders/${id}`),
  getMyCompany: () => api.get('/trade-orders/my-company'),
  getPurchases: () => api.get('/trade-orders/purchases'),
  getSales: () => api.get('/trade-orders/sales'),
  updateStatus: (id: string, status: string) => api.patch(`/trade-orders/${id}/status?status=${status}`),
};

// ────────────────────────────────────────────────────────────
// SHIPMENTS
// ────────────────────────────────────────────────────────────
export const shipmentsApi = {
  createForOrder: (orderId: string, data: Record<string, unknown>) =>
    api.post(`/shipments/order/${orderId}`, data),
  getById: (id: string) => api.get(`/shipments/${id}`),
  getByOrder: (orderId: string) => api.get(`/shipments/order/${orderId}`),
  getByStatus: (status: string) => api.get(`/shipments/status/${status}`),
  getMyCompany: () => api.get('/shipments/my-company'),
  updateStatus: (id: string, status: string) => api.patch(`/shipments/${id}/status?status=${status}`),
};
