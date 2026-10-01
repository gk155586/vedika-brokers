// src/components/MobileBottomNav.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Key, 
  ShoppingBag, 
  Heart, 
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import dataStore from '@/services/dataStore';

export default function MobileBottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const updateFavs = async () => {
      try {
        const favs = await dataStore.getFavorites(user?.id);
        if (mounted) setFavCount(favs?.length || 0);
      } catch (_) {}
    };
    updateFavs();
    const unsub = dataStore.subscribe(updateFavs);
    return () => {
      mounted = false;
      unsub();
    };
  }, [user?.id]);

  // Don't show on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/rent', label: 'Rent', icon: Key },
    { to: '/buy', label: 'Buy', icon: ShoppingBag },
    { to: '/favorites', label: 'Saved', icon: Heart, badge: favCount },
    { to: user ? '/account' : '/login', label: user ? 'Account' : 'Login', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to === '/favorites' && location.pathname === '/account' && location.search.includes('favorites'));

          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive 
                  ? 'text-blue-950 font-bold' 
                  : 'text-slate-400 hover:text-slate-700 font-medium'
              }`}
            >
              <div className="relative">
                <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-amber-400/20 text-blue-900' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4] text-blue-900' : 'stroke-[1.8]'}`} />
                </div>
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-blue-900 font-extrabold' : 'text-slate-500 font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-amber-500 rounded-full mt-0.5" />
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
