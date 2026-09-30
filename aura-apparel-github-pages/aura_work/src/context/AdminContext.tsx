import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Order,
  Customer,
  Product,
  Category,
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
import { api } from '../services/api.ts';

interface AdminUserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminContextType {
  adminUser: AdminUserSession | null;
  adminToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Active view tab
  currentTab: string;
  setCurrentTab: (tab: string) => void;

  // Orders
  orders: Order[];
  ordersLoading: boolean;
  loadOrders: (params?: { status?: string; paymentStatus?: string; search?: string }) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus, note?: string, tracking?: string) => Promise<void>;
  updateOrderPayment: (id: string, paymentStatus: PaymentStatus) => Promise<void>;
  updateOrderNotes: (id: string, adminNotes?: string, trackingNumber?: string) => Promise<void>;

  // Customers
  customers: Customer[];
  customersLoading: boolean;
  loadCustomers: (search?: string) => Promise<void>;
  updateCustomerNotes: (id: string, notes: string) => Promise<void>;

  // Products
  products: Product[];
  loadProducts: () => Promise<void>;
  createProduct: (data: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  duplicateProduct: (id: string) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;

  // Categories
  categories: Category[];
  loadCategories: () => Promise<void>;
  createCategory: (data: Partial<Category>) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;

  // Inventory
  inventory: Array<{
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
  }>;
  loadInventory: () => Promise<void>;
  updateStock: (id: string, stock?: number, lowStockThreshold?: number) => Promise<void>;

  // Coupons
  coupons: Coupon[];
  loadCoupons: () => Promise<void>;
  createCoupon: (data: Partial<Coupon>) => Promise<void>;
  updateCoupon: (id: string, data: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;

  // Reviews
  reviews: Review[];
  loadReviews: () => Promise<void>;
  updateReview: (id: string, data: { isApproved?: boolean; isFeatured?: boolean }) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  // Settings & CMS
  storeSettings: StoreSettings | null;
  deliverySettings: DeliverySettings | null;
  paymentSettings: PaymentSettings | null;
  homepageCms: HomepageCMS | null;
  saveStoreSettings: (data: Partial<StoreSettings>) => Promise<void>;
  saveDeliverySettings: (data: Partial<DeliverySettings>) => Promise<void>;
  savePaymentSettings: (data: Partial<PaymentSettings>) => Promise<void>;
  saveHomepageCMS: (data: Partial<HomepageCMS>) => Promise<void>;

  // Analytics
  analytics: AnalyticsSummary | null;
  loadAnalytics: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('aura_admin_token') || null;
  });

  const [adminUser, setAdminUser] = useState<AdminUserSession | null>(() => {
    try {
      const saved = localStorage.getItem('aura_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Datasets
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [homepageCms, setHomepageCms] = useState<HomepageCMS | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  const isAuthenticated = Boolean(adminToken && adminUser);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.adminLogin(email, password);
      setAdminToken(res.token);
      setAdminUser(res.user);
      localStorage.setItem('aura_admin_token', res.token);
      localStorage.setItem('aura_admin_user', JSON.stringify(res.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const logout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('aura_admin_token');
    localStorage.removeItem('aura_admin_user');
  };

  // Loaders
  const loadOrders = useCallback(async (params?: { status?: string; paymentStatus?: string; search?: string }) => {
    setOrdersLoading(true);
    try {
      const res = await api.getOrders(params);
      setOrders(res.orders);
    } catch (err) {
      console.error('Error loading admin orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const loadCustomers = useCallback(async (search?: string) => {
    setCustomersLoading(true);
    try {
      const res = await api.getCustomers(search ? { search } : undefined);
      setCustomers(res.customers);
    } catch (err) {
      console.error('Error loading admin customers:', err);
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const res = await api.getProducts();
      setProducts(res.products);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const res = await api.getCategories();
      setCategories(res);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }, []);

  const loadInventory = useCallback(async () => {
    try {
      const res = await api.getInventory();
      setInventory(res);
    } catch (err) {
      console.error('Error loading inventory:', err);
    }
  }, []);

  const loadCoupons = useCallback(async () => {
    try {
      const res = await api.getCoupons();
      setCoupons(res);
    } catch (err) {
      console.error('Error loading coupons:', err);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      const res = await api.getReviews(true);
      setReviews(res);
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    try {
      const res = await api.getAnalytics();
      setAnalytics(res);
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const [store, deliv, pay, cms] = await Promise.all([
        api.getStoreSettings(),
        api.getDeliverySettings(),
        api.getPaymentSettings(),
        api.getHomepageCMS(),
      ]);
      setStoreSettings(store);
      setDeliverySettings(deliv);
      setPaymentSettings(pay);
      setHomepageCms(cms);
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  }, []);

  // Sync all data when admin is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      loadCustomers();
      loadProducts();
      loadCategories();
      loadInventory();
      loadCoupons();
      loadReviews();
      loadAnalytics();
      loadSettings();
    }
  }, [
    isAuthenticated,
    loadOrders,
    loadCustomers,
    loadProducts,
    loadCategories,
    loadInventory,
    loadCoupons,
    loadReviews,
    loadAnalytics,
    loadSettings,
  ]);

  // Actions
  const updateOrderStatus = async (id: string, status: OrderStatus, note?: string, tracking?: string) => {
    const updated = await api.updateOrderStatus(id, status, note, tracking);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    loadAnalytics();
  };

  const updateOrderPayment = async (id: string, paymentStatus: PaymentStatus) => {
    const updated = await api.updatePaymentStatus(id, paymentStatus);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    loadAnalytics();
  };

  const updateOrderNotes = async (id: string, adminNotes?: string, trackingNumber?: string) => {
    const updated = await api.updateOrderNotes(id, adminNotes, trackingNumber);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  };

  const updateCustomerNotes = async (id: string, notes: string) => {
    const updated = await api.updateCustomerNotes(id, notes);
    setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const createProduct = async (data: Partial<Product>) => {
    const created = await api.createProduct(data);
    await loadProducts();
    await loadInventory();
    await loadAnalytics();
    return created;
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const updated = await api.updateProduct(id, data);
    await loadProducts();
    await loadInventory();
    return updated;
  };

  const duplicateProduct = async (id: string) => {
    const dup = await api.duplicateProduct(id);
    await loadProducts();
    await loadInventory();
    return dup;
  };

  const deleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    await loadProducts();
    await loadInventory();
    await loadAnalytics();
  };

  const createCategory = async (data: Partial<Category>) => {
    const created = await api.createCategory(data);
    await loadCategories();
    return created;
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    const updated = await api.updateCategory(id, data);
    await loadCategories();
    return updated;
  };

  const deleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    await loadCategories();
  };

  const updateStock = async (id: string, stock?: number, lowStockThreshold?: number) => {
    await api.updateInventoryItem(id, stock, lowStockThreshold);
    await loadInventory();
    await loadProducts();
    await loadAnalytics();
  };

  const createCoupon = async (data: Partial<Coupon>) => {
    await api.createCoupon(data);
    await loadCoupons();
  };

  const updateCoupon = async (id: string, data: Partial<Coupon>) => {
    await api.updateCoupon(id, data);
    await loadCoupons();
  };

  const deleteCoupon = async (id: string) => {
    await api.deleteCoupon(id);
    await loadCoupons();
  };

  const updateReview = async (id: string, data: { isApproved?: boolean; isFeatured?: boolean }) => {
    await api.updateReview(id, data);
    await loadReviews();
  };

  const deleteReview = async (id: string) => {
    await api.deleteReview(id);
    await loadReviews();
  };

  const saveStoreSettings = async (data: Partial<StoreSettings>) => {
    const updated = await api.updateStoreSettings(data);
    setStoreSettings(updated);
  };

  const saveDeliverySettings = async (data: Partial<DeliverySettings>) => {
    const updated = await api.updateDeliverySettings(data);
    setDeliverySettings(updated);
  };

  const savePaymentSettings = async (data: Partial<PaymentSettings>) => {
    const updated = await api.updatePaymentSettings(data);
    setPaymentSettings(updated);
  };

  const saveHomepageCMS = async (data: Partial<HomepageCMS>) => {
    const updated = await api.updateHomepageCMS(data);
    setHomepageCms(updated);
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        adminToken,
        isAuthenticated,
        login,
        logout,
        currentTab,
        setCurrentTab,
        orders,
        ordersLoading,
        loadOrders,
        updateOrderStatus,
        updateOrderPayment,
        updateOrderNotes,
        customers,
        customersLoading,
        loadCustomers,
        updateCustomerNotes,
        products,
        loadProducts,
        createProduct,
        updateProduct,
        duplicateProduct,
        deleteProduct,
        categories,
        loadCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        inventory,
        loadInventory,
        updateStock,
        coupons,
        loadCoupons,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        reviews,
        loadReviews,
        updateReview,
        deleteReview,
        storeSettings,
        deliverySettings,
        paymentSettings,
        homepageCms,
        saveStoreSettings,
        saveDeliverySettings,
        savePaymentSettings,
        saveHomepageCMS,
        analytics,
        loadAnalytics,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
