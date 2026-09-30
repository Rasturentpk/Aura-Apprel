import {
  Product,
  Category,
  Order,
  Customer,
  Coupon,
  Review,
  StoreSettings,
  DeliverySettings,
  PaymentSettings,
  HomepageCMS,
  AnalyticsSummary,
  OrderStatus,
  PaymentStatus,
} from '../types/index.ts';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errMessage = 'Request failed';
    try {
      const errorData = await res.json();
      errMessage = errorData.error || errMessage;
    } catch {
      // ignore
    }
    throw new Error(errMessage);
  }

  return res.json();
}

export const api = {
  // Store bootstrap
  getInit: () =>
    fetchJson<{
      storeSettings: StoreSettings;
      deliverySettings: DeliverySettings;
      paymentSettings: PaymentSettings;
      homepageCms: HomepageCMS;
      categories: Category[];
      featuredProducts: Product[];
      newArrivals: Product[];
      limitedStock: Product[];
      deals: Product[];
      reviews: Review[];
    }>('/init'),

  // Products
  getProducts: (params?: {
    category?: string;
    gender?: string;
    search?: string;
    sort?: string;
    isLimited?: boolean;
    isSale?: boolean;
    isNew?: boolean;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.gender) query.set('gender', params.gender);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.isLimited) query.set('isLimited', 'true');
    if (params?.isSale) query.set('isSale', 'true');
    if (params?.isNew) query.set('isNew', 'true');
    return fetchJson<{ products: Product[]; total: number }>(`/products?${query.toString()}`);
  },

  getProduct: (idOrSlug: string) =>
    fetchJson<{ product: Product; related: Product[]; reviews: Review[] }>(`/products/${idOrSlug}`),

  createProduct: (data: Partial<Product>) =>
    fetchJson<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),

  updateProduct: (id: string, data: Partial<Product>) =>
    fetchJson<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  duplicateProduct: (id: string) =>
    fetchJson<Product>(`/products/${id}/duplicate`, { method: 'POST' }),

  deleteProduct: (id: string) =>
    fetchJson<{ success: boolean; removed: Product }>(`/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => fetchJson<Category[]>('/categories'),
  createCategory: (data: Partial<Category>) =>
    fetchJson<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: Partial<Category>) =>
    fetchJson<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) =>
    fetchJson<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: (params?: { status?: string; paymentStatus?: string; search?: string; customerId?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.paymentStatus) query.set('paymentStatus', params.paymentStatus);
    if (params?.search) query.set('search', params.search);
    if (params?.customerId) query.set('customerId', params.customerId);
    return fetchJson<{ orders: Order[]; total: number }>(`/orders?${query.toString()}`);
  },

  getOrder: (id: string) =>
    fetchJson<{ order: Order; customer?: Customer }>(`/orders/${id}`),

  submitOrder: (orderData: {
    customerInfo: {
      fullName: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      province: string;
      postalCode?: string;
      notes?: string;
    };
    items: Array<{
      productId: string;
      size: string;
      color: { name: string; hex: string };
      quantity: number;
    }>;
    paymentMethod: 'cod' | 'bank_transfer' | 'manual';
    couponCode?: string;
  }) => fetchJson<Order>('/orders', { method: 'POST', body: JSON.stringify(orderData) }),

  updateOrderStatus: (id: string, status: OrderStatus, note?: string, trackingNumber?: string) =>
    fetchJson<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note, trackingNumber }),
    }),

  updatePaymentStatus: (id: string, paymentStatus: PaymentStatus) =>
    fetchJson<Order>(`/orders/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus }),
    }),

  updateOrderNotes: (id: string, adminNotes?: string, trackingNumber?: string) =>
    fetchJson<Order>(`/orders/${id}/notes`, {
      method: 'PATCH',
      body: JSON.stringify({ adminNotes, trackingNumber }),
    }),

  // Customers
  getCustomers: (params?: { search?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    return fetchJson<{ customers: Customer[]; total: number }>(`/customers?${query.toString()}`);
  },

  getCustomer: (id: string) =>
    fetchJson<{ customer: Customer; orders: Order[] }>(`/customers/${id}`),

  updateCustomerNotes: (id: string, notes: string) =>
    fetchJson<Customer>(`/customers/${id}/notes`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    }),

  lookupCustomerOrders: (emailOrPhone: string) =>
    fetchJson<{ orders: Order[] }>('/auth/customer/lookup-orders', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone }),
    }),

  // Inventory
  getInventory: () =>
    fetchJson<
      Array<{
        id: string;
        name: string;
        sku: string;
        stock: number;
        lowStockThreshold: number;
        categoryName: string;
        price: number;
        salePrice?: number;
        status: string;
        image: string;
      }>
    >('/inventory'),

  updateInventoryItem: (id: string, stock?: number, lowStockThreshold?: number) =>
    fetchJson<Product>(`/inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ stock, lowStockThreshold }),
    }),

  // Coupons
  getCoupons: () => fetchJson<Coupon[]>('/coupons'),
  createCoupon: (data: Partial<Coupon>) =>
    fetchJson<Coupon>('/coupons', { method: 'POST', body: JSON.stringify(data) }),
  updateCoupon: (id: string, data: Partial<Coupon>) =>
    fetchJson<Coupon>(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCoupon: (id: string) =>
    fetchJson<{ success: boolean }>(`/coupons/${id}`, { method: 'DELETE' }),

  validateCoupon: (code: string, subtotal: number) =>
    fetchJson<{
      valid: boolean;
      code: string;
      discount: number;
      discountType: string;
      discountValue: number;
    }>('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),

  // Reviews
  getReviews: (all = false) => fetchJson<Review[]>(`/reviews${all ? '?all=true' : ''}`),
  submitReview: (data: {
    productId?: string;
    customerName: string;
    customerEmail?: string;
    rating: number;
    title?: string;
    comment: string;
  }) => fetchJson<Review>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  updateReview: (id: string, data: { isApproved?: boolean; isFeatured?: boolean }) =>
    fetchJson<Review>(`/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteReview: (id: string) =>
    fetchJson<{ success: boolean }>(`/reviews/${id}`, { method: 'DELETE' }),

  // Settings & CMS
  getStoreSettings: () => fetchJson<StoreSettings>('/store-settings'),
  updateStoreSettings: (data: Partial<StoreSettings>) =>
    fetchJson<StoreSettings>('/store-settings', { method: 'PUT', body: JSON.stringify(data) }),

  getDeliverySettings: () => fetchJson<DeliverySettings>('/delivery-settings'),
  updateDeliverySettings: (data: Partial<DeliverySettings>) =>
    fetchJson<DeliverySettings>('/delivery-settings', { method: 'PUT', body: JSON.stringify(data) }),

  getPaymentSettings: () => fetchJson<PaymentSettings>('/payment-settings'),
  updatePaymentSettings: (data: Partial<PaymentSettings>) =>
    fetchJson<PaymentSettings>('/payment-settings', { method: 'PUT', body: JSON.stringify(data) }),

  getHomepageCMS: () => fetchJson<HomepageCMS>('/cms'),
  updateHomepageCMS: (data: Partial<HomepageCMS>) =>
    fetchJson<HomepageCMS>('/cms', { method: 'PUT', body: JSON.stringify(data) }),

  // Analytics
  getAnalytics: () => fetchJson<AnalyticsSummary>('/analytics'),

  // Admin Auth
  adminLogin: (email: string, password: string) =>
    fetchJson<{ token: string; user: { id: string; name: string; email: string; role: string } }>(
      '/auth/admin/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
};
