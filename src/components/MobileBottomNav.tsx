'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, Sparkles, ShoppingBag, User as UserIcon, Apple } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { items, isDuetOrder } = useCart();
  const { isLoggedIn } = useAuth();

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Restaurants', href: '/restaurants', icon: Utensils },
    {
      label: 'Duet',
      href: '/duet-builder',
      icon: Sparkles,
      isSpecial: true
    },
    { label: 'Fresh', href: '/fresh', icon: Apple, isFresh: true },
    {
      label: 'Cart',
      href: '/cart',
      icon: ShoppingBag,
      badge: totalItemsCount
    },
    {
      label: isLoggedIn ? 'Account' : 'Sign In',
      href: isLoggedIn ? '/dashboard' : '/login',
      icon: UserIcon
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#101918]/95 backdrop-blur-xl border-t border-[#C3DCD7]/60 dark:border-[#244644]/70 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-4 flex flex-col items-center group focus:outline-hidden"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#197F83] to-[#22a2a7] text-white flex items-center justify-center shadow-lg shadow-[#197F83]/40 border-4 border-white dark:border-[#101918] group-hover:scale-105 active:scale-95 transition-all">
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-extrabold tracking-wider text-[#197F83] dark:text-[#22a2a7] mt-0.5">
                  DUET
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#197F83] dark:text-[#22a2a7] font-bold'
                  : 'text-[#555653] dark:text-[#a8b2b0] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-[#197F83] dark:text-[#22a2a7]' : ''} transition-transform`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#e06d53] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
                {item.isFresh && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#2D8A4E]" />
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium truncate max-w-[56px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
