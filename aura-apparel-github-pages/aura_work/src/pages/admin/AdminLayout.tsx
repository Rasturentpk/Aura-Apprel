import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Boxes,
  Ticket,
  MessageSquare,
  Image,
  Store,
  Truck,
  CreditCard,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  CheckCircle2,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  onNavigateToStore: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onNavigateToStore }) => {
  const { adminUser, logout, currentTab, setCurrentTab, orders } = useAdmin();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Pending').length;

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'cms', label: 'Homepage CMS', icon: Image },
    { id: 'store-settings', label: 'Store Information', icon: Store },
    { id: 'delivery-settings', label: 'Delivery Settings', icon: Truck },
    { id: 'payment-settings', label: 'Payment Settings', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      
      {/* Top Bar for Admin */}
      <header className="sticky top-0 z-30 bg-neutral-900 text-white h-16 px-4 sm:px-6 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white"
            aria-label="Toggle admin sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-display font-bold tracking-tight text-base uppercase text-white">
              Aura Apparel Admin
            </span>
            <span className="hidden sm:inline text-[11px] font-mono bg-neutral-800 px-2 py-0.5 rounded text-neutral-300 border border-neutral-700">
              I-8 Markaz Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={onNavigateToStore}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 text-neutral-200 hover:text-white rounded border border-neutral-700 hover:bg-neutral-700 transition-colors"
          >
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
            <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-neutral-200 text-xs">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <span className="hidden md:inline font-medium text-neutral-200">{adminUser?.name || 'Store Owner'}</span>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-neutral-200 flex-col justify-between p-4 shrink-0">
          <nav className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Store Operations
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isActive ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-200 text-neutral-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-neutral-200 text-[11px] text-neutral-500 space-y-1 px-3">
            <p className="font-semibold text-neutral-800">Aura Apparel Management</p>
            <p>Database connected & active</p>
          </div>
        </aside>

        {/* Mobile Slide-out Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <div className="relative w-64 bg-white h-full flex flex-col justify-between p-4 z-50 shadow-2xl">
              <nav className="space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Menu
                </div>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-neutral-950">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    onNavigateToStore();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 bg-neutral-100 text-neutral-800 rounded text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Public Store</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
};
