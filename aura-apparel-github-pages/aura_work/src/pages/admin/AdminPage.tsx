import React from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { AdminLogin } from './AdminLogin.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { AdminOverview } from './AdminOverview.tsx';
import { AdminOrders } from './AdminOrders.tsx';
import { AdminProducts } from './AdminProducts.tsx';
import { AdminCategories } from './AdminCategories.tsx';
import { AdminCustomers } from './AdminCustomers.tsx';
import { AdminInventory } from './AdminInventory.tsx';
import { AdminCoupons } from './AdminCoupons.tsx';
import { AdminReviews } from './AdminReviews.tsx';
import { AdminCMS } from './AdminCMS.tsx';
import { AdminStoreSettings } from './AdminStoreSettings.tsx';
import { AdminDeliverySettings } from './AdminDeliverySettings.tsx';
import { AdminPaymentSettings } from './AdminPaymentSettings.tsx';
import { AdminAnalytics } from './AdminAnalytics.tsx';

interface AdminPageProps {
  onNavigateToStore: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateToStore }) => {
  const { isAuthenticated, currentTab } = useAdmin();

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => {}}
        onNavigateToStore={onNavigateToStore}
      />
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return <AdminOverview />;
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      case 'categories':
        return <AdminCategories />;
      case 'customers':
        return <AdminCustomers />;
      case 'inventory':
        return <AdminInventory />;
      case 'coupons':
        return <AdminCoupons />;
      case 'reviews':
        return <AdminReviews />;
      case 'cms':
        return <AdminCMS />;
      case 'store-settings':
        return <AdminStoreSettings />;
      case 'delivery-settings':
        return <AdminDeliverySettings />;
      case 'payment-settings':
        return <AdminPaymentSettings />;
      case 'analytics':
        return <AdminAnalytics />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <AdminLayout onNavigateToStore={onNavigateToStore}>
      {renderTabContent()}
    </AdminLayout>
  );
};
