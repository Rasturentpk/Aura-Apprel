export type Gender = 'Men' | 'Women' | 'Unisex';

export interface ProductVariantColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  gender: Gender;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  sizes: string[];
  colors: ProductVariantColor[];
  images: string[];
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedStock: boolean;
  isSale: boolean;
  details?: {
    fabric?: string;
    fit?: string;
    care?: string;
    origin?: string;
    exportBatchInfo?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  displayOrder: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  size: string;
  color: ProductVariantColor;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  notes?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentMethod = 'cod' | 'bank_transfer' | 'manual';
export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  image: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string; // e.g. AURA-1001
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  customerNotes?: string;
  adminNotes?: string;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  isRegistered: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  customerEmail: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapsUrl: string;
  isMain?: boolean;
}

export interface StoreSettings {
  brandName: string;
  businessType: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  mapsUrl: string;
  locations: StoreLocation[];
  hours: {
    weekdays: string;
    friday: string;
    weekends: string;
    notes: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  announcementBar: {
    enabled: boolean;
    text: string;
    link?: string;
  };
}

export interface DeliveryZone {
  id: string;
  name: string;
  rate: number;
  estimatedDays: string;
}

export interface DeliverySettings {
  standardFee: number;
  freeShippingThreshold: number;
  estimatedDaysLocal: string;
  estimatedDaysNational: string;
  zones: DeliveryZone[];
}

export interface PaymentSettings {
  codEnabled: boolean;
  codInstructions: string;
  bankTransferEnabled: boolean;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branch: string;
    instructions: string;
  };
  manualPaymentEnabled: boolean;
  manualPaymentInstructions: string;
}

export interface HomepageCMS {
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  promoBanner: {
    active: boolean;
    title: string;
    subtitle: string;
    buttonText: string;
    link: string;
  };
  featureCards: Array<{
    title: string;
    description: string;
  }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'store_manager';
  createdAt: string;
}

export interface AnalyticsSummary {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  todaySales: number;
  monthlySales: number;
  averageOrderValue: number;
  salesByDay: Array<{ date: string; sales: number; orders: number }>;
  topProducts: Array<{ id: string; name: string; salesCount: number; revenue: number; image: string }>;
  categoryDistribution: Array<{ name: string; count: number; revenue: number }>;
}
