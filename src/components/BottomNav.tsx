import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, ClipboardList, MessageSquare, User, ShieldCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, activeOrders, t, language, isAdminAuthenticated } = useApp();

  const tabs = [
    {
      id: 'home',
      label: t.navHome,
      icon: Home
    },
    ...(isAdminAuthenticated ? [{
      id: 'admin',
      label: language === 'ar' ? 'الأدمن ⚙️' : 'Admin',
      icon: ShieldCheck
    }] : [
      {
        id: 'radar',
        label: language === 'ar' ? 'الرادار' : 'Radar',
        icon: Compass
      }
    ]),
    {
      id: 'orders',
      label: t.navOrders,
      icon: ClipboardList,
      badgeCount: activeOrders.length
    },
    {
      id: 'chat',
      label: t.navMessages,
      icon: MessageSquare
    },
    {
      id: 'profile',
      label: t.navProfile,
      icon: User
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center min-h-[48px] py-1 relative text-center focus:outline-none transition-transform active:scale-95"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? 'text-amber-600 dark:text-amber-400 stroke-[2.4]'
                      : 'text-slate-500 dark:text-slate-400 stroke-[1.8]'
                  }`}
                />
                {(tab.badgeCount && tab.badgeCount > 0) ? (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[16px] h-4 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900 text-[9px] font-black text-white flex items-center justify-center">
                    {tab.badgeCount}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
