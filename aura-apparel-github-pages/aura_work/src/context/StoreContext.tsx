import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Category,
  CartItem,
  StoreSettings,
  DeliverySettings,
  PaymentSettings,
  HomepageCMS,
  Review,
  ProductVariantColor,
} from '../types/index.ts';
import { api } from '../services/api.ts';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  storeSettings: StoreSettings | null;
  deliverySettings: DeliverySettings | null;
  paymentSettings: PaymentSettings | null;
  homepageCms: HomepageCMS | null;
  categories: Category[];
  allProducts: Product[];
  isLoading: boolean;
  refreshStoreData: () => Promise<void>;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, size: string, color: ProductVariantColor, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, colorName: string) => void;
  updateCartQuantity: (productId: string, size: string, colorName: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Modals & UI
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Helpers
  formatPKR: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [homepageCms, setHomepageCms] = useState<HomepageCMS | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(() => {
    try {
      const saved = localStorage.getItem('aura_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Save wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Save coupon
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('aura_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('aura_coupon');
      }
    } catch {
      // ignore
    }
  }, [appliedCoupon]);

  const refreshStoreData = useCallback(async () => {
    try {
      const [initData, productsData] = await Promise.all([
        api.getInit(),
        api.getProducts(),
      ]);

      setStoreSettings(initData.storeSettings);
      setDeliverySettings(initData.deliverySettings);
      setPaymentSettings(initData.paymentSettings);
      setHomepageCms(initData.homepageCms);
      setCategories(initData.categories);
      setAllProducts(productsData.products);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStoreData();
  }, [refreshStoreData]);

  // Cart actions
  const addToCart = (product: Product, size: string, color: ProductVariantColor, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.size === size &&
          item.color.name === color.name
      );

      const price = product.salePrice ?? product.price;

      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Only ${product.stock} pieces available in stock`, 'error');
          return prev;
        }
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: newQty,
          product, // ensure freshest data
        };
        showToast(`Updated "${product.name}" quantity (${size})`);
        return next;
      } else {
        if (quantity > product.stock) {
          showToast(`Only ${product.stock} pieces available in stock`, 'error');
          return prev;
        }
        showToast(`Added "${product.name}" (${size}) to bag`);
        return [
          ...prev,
          {
            productId: product.id,
            product,
            size,
            color,
            quantity,
            price,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string, size: string, colorName: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.size === size && item.color.name === colorName)
      )
    );
    showToast('Item removed from shopping bag', 'info');
  };

  const updateCartQuantity = (productId: string, size: string, colorName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, colorName);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.size === size && item.color.name === colorName) {
          if (quantity > item.product.stock) {
            showToast(`Maximum stock limit of ${item.product.stock} reached`, 'error');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.validateCoupon(code, cartSubtotal);
      if (res.valid) {
        setAppliedCoupon({ code: res.code, discount: res.discount });
        showToast(`Coupon "${res.code}" applied! -Rs. ${res.discount.toLocaleString()}`);
        return { success: true, message: `Discount of Rs. ${res.discount.toLocaleString()} applied` };
      }
      return { success: false, message: 'Invalid coupon' };
    } catch (err: any) {
      showToast(err.message || 'Invalid coupon', 'error');
      return { success: false, message: err.message || 'Invalid coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist actions
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist: ${product.name}`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Added to wishlist: ${product.name}`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.some((p) => p.id === productId);

  const formatPKR = (amount: number) => {
    return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
  };

  return (
    <StoreContext.Provider
      value={{
        storeSettings,
        deliverySettings,
        paymentSettings,
        homepageCms,
        categories,
        allProducts,
        isLoading,
        refreshStoreData,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        formatPKR,
      }}
    >
      {children}

      {/* Global Toast Notifications Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded text-xs font-medium tracking-wide flex items-center shadow-lg transition-all transform duration-200 border ${
              toast.type === 'error'
                ? 'bg-neutral-900 text-red-200 border-red-800'
                : toast.type === 'info'
                ? 'bg-neutral-900 text-neutral-300 border-neutral-700'
                : 'bg-neutral-900 text-neutral-100 border-neutral-800'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
