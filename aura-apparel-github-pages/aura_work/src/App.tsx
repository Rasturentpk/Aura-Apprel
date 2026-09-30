import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext.tsx';
import { AdminProvider } from './context/AdminContext.tsx';
import { AnnouncementBar } from './components/layout/AnnouncementBar.tsx';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { CartDrawer } from './components/ui/CartDrawer.tsx';
import { QuickViewModal } from './components/ui/QuickViewModal.tsx';
import { SizeGuideModal } from './components/ui/SizeGuideModal.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.tsx';
import { AccountPage } from './pages/AccountPage.tsx';
import { WishlistPage } from './pages/WishlistPage.tsx';
import { StoreLocationsPage } from './pages/StoreLocationsPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { FAQPage } from './pages/FAQPage.tsx';
import { PoliciesPage } from './pages/PoliciesPage.tsx';
import { AdminPage } from './pages/admin/AdminPage.tsx';

import { Order } from './types/index.ts';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentParam, setCurrentParam] = useState<string>('');
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Parse path on initial mount
  useEffect(() => {
    const handleUrl = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      if (!path || path === '') {
        setCurrentPage('home');
      } else if (path === 'admin') {
        setCurrentPage('admin');
      } else if (path.startsWith('product/')) {
        const slug = path.replace('product/', '');
        setCurrentPage('product');
        setCurrentParam(slug);
      } else if (path === 'cart') {
        setCurrentPage('cart');
      } else if (path === 'checkout') {
        setCurrentPage('checkout');
      } else if (path === 'order-confirmation') {
        setCurrentPage('order-confirmation');
      } else if (path === 'shop') {
        setCurrentPage('shop');
      } else if (path === 'men') {
        setCurrentPage('men');
      } else if (path === 'women') {
        setCurrentPage('women');
      } else if (path === 'new-arrivals') {
        setCurrentPage('new-arrivals');
      } else if (path === 'limited-stock') {
        setCurrentPage('limited-stock');
      } else if (path === 'sale') {
        setCurrentPage('sale');
      } else if (path === 'about') {
        setCurrentPage('about');
      } else if (path === 'contact') {
        setCurrentPage('contact');
      } else if (path === 'stores') {
        setCurrentPage('stores');
      } else if (path === 'faq') {
        setCurrentPage('faq');
      } else if (path === 'policies') {
        setCurrentPage('policies');
      } else if (path === 'account') {
        setCurrentPage('account');
      } else if (path === 'wishlist') {
        setCurrentPage('wishlist');
      }
    };

    handleUrl();
    window.addEventListener('popstate', handleUrl);
    return () => window.removeEventListener('popstate', handleUrl);
  }, []);

  const navigateTo = (page: string, param = '') => {
    setCurrentPage(page);
    setCurrentParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let url = '/';
    if (page === 'admin') url = '/admin';
    else if (page === 'product' && param) url = `/product/${param}`;
    else if (page !== 'home') url = `/${page}`;

    window.history.pushState(null, '', url);
  };

  const handleOrderPlaced = (order: Order) => {
    setLatestOrder(order);
    navigateTo('order-confirmation');
  };

  const isAdminView = currentPage === 'admin';

  return (
    <StoreProvider>
      <AdminProvider>
        <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
          
          {/* Public Store Shell (Hidden in Admin) */}
          {!isAdminView && (
            <>
              <AnnouncementBar />
              <Header onNavigate={navigateTo} currentPage={currentPage} />
            </>
          )}

          {/* Main Body Router */}
          <main className="flex-1">
            {currentPage === 'home' && (
              <HomePage
                onNavigate={navigateTo}
                onSelectProduct={(slugOrId) => navigateTo('product', slugOrId)}
              />
            )}

            {currentPage === 'shop' && (
              <ShopPage
                onSelectProduct={(slugOrId) => navigateTo('product', slugOrId)}
              />
            )}

            {currentPage === 'men' && (
              <ShopPage
                initialGender="Men"
                onSelectProduct={(slugOrId) => navigateTo('product', slugOrId)}
              />
            )}

            {currentPage === 'women' && (
              <ShopPage
                initialGender="Women"
                onSelectProduct={(slugOrId) => navigateTo('product', slugOrId)}
              />
            )}

            {currentPage === 'new-arrivals' && (
              <ShopPage
                initialOnlyNew={true}
                onSelectProduct={(slugOrId) => navigateTo('product', slugOrId)}
              />
            )}

            {currentPage === 'limited-stock' && (
              <ShopPage
                initialOnlyLimited={true}
                onSelectProduct={(slugOrId) => navigateTo('product', slugOrId)}
              />
            )}

            {currentPage === 'sale' && (
              <ShopPage
                initialOnlySale={true}
                onSelectProduct={(slugOrId) => navigateTo('product', slugOrId)}
              />
            )}

            {currentPage === 'product' && (
              <ProductDetailPage
                slugOrId={currentParam}
                onNavigateToShop={() => navigateTo('shop')}
                onNavigateToProduct={(slugOrId) => navigateTo('product', slugOrId)}
                onNavigateToCheckout={() => navigateTo('checkout')}
              />
            )}

            {currentPage === 'cart' && (
              <CartPage
                onNavigateToShop={() => navigateTo('shop')}
                onNavigateToCheckout={() => navigateTo('checkout')}
              />
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage
                onNavigateToCart={() => navigateTo('cart')}
                onOrderPlaced={handleOrderPlaced}
              />
            )}

            {currentPage === 'order-confirmation' && (
              <OrderConfirmationPage
                order={latestOrder}
                onNavigateToShop={() => navigateTo('shop')}
                onNavigateToAccount={() => navigateTo('account')}
              />
            )}

            {currentPage === 'account' && (
              <AccountPage onNavigateToShop={() => navigateTo('shop')} />
            )}

            {currentPage === 'wishlist' && (
              <WishlistPage
                onNavigateToShop={() => navigateTo('shop')}
                onSelectProduct={(slugOrId) => navigateTo('product', slugOrId)}
              />
            )}

            {currentPage === 'stores' && <StoreLocationsPage />}

            {currentPage === 'about' && (
              <AboutPage
                onNavigateToShop={() => navigateTo('shop')}
                onNavigateToStores={() => navigateTo('stores')}
              />
            )}

            {currentPage === 'contact' && <ContactPage />}

            {currentPage === 'faq' && <FAQPage />}

            {currentPage === 'policies' && <PoliciesPage />}

            {/* Admin Management Panel */}
            {currentPage === 'admin' && (
              <AdminPage onNavigateToStore={() => navigateTo('home')} />
            )}
          </main>

          {/* Public Store Footer */}
          {!isAdminView && <Footer onNavigate={navigateTo} />}

          {/* Floating WhatsApp Contact Button (All Public Pages) */}
          {!isAdminView && (
            <a
              href="https://wa.me/923140855651"
              target="_blank"
              rel="noreferrer"
              className="fixed bottom-6 left-6 z-40 p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl transition-transform hover:scale-105 flex items-center justify-center cursor-pointer border border-emerald-500"
              title="Chat with Aura Apparel on WhatsApp (+92 314 0855 651)"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
          )}

          {/* Global Modals & Drawers */}
          <CartDrawer
            onNavigateToCheckout={() => navigateTo('checkout')}
            onNavigateToShop={() => navigateTo('shop')}
          />
          <QuickViewModal
            onNavigateToProduct={(slugOrId) => navigateTo('product', slugOrId)}
          />
          <SizeGuideModal />

        </div>
      </AdminProvider>
    </StoreProvider>
  );
}
