'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import { useLocation } from '@/context/LocationContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  ShoppingBag,
  Sparkles,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  GraduationCap
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentLocation, openLocationModal } = useLocation();
  const { items, isDuetOrder, restaurantA, restaurantB } = useCart();
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Restaurants', href: '/restaurants' },
    { label: 'GoDuet Fresh', href: '/fresh', isFresh: true },
    { label: 'Duet Builder', href: '/duet-builder', isHighlight: true },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Student Perks', href: '/student', isStudent: true },
    { label: 'Offers', href: '/offers' },
    { label: 'About Us', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all">
      {/* Top micro banner for Hyderabad announcement */}
      <div className="bg-[#1f757a] text-white text-[11px] font-medium py-1 px-4 text-center flex items-center justify-center gap-2">
        <span className="flex items-center gap-1 font-semibold">
          <Sparkles className="w-3 h-3 text-[#c0d4d0]" />
          HYDERABAD LAUNCH OFFER:
        </span>
        <span>Use code <strong className="underline underline-offset-2">DUETFIRST</strong> for ₹100 OFF on your first 2-restaurant order!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Hyderabad Location Selector */}
          <div className="flex items-center gap-6">
            <BrandLogo size="md" />

            {/* Location selector pill */}
            <button
              onClick={openLocationModal}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#e3edea]/80 hover:bg-[#e3edea] text-xs font-semibold text-[#1f757a] border border-[#c0d4d0]/60 transition-all group"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1f757a] group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="text-[10px] text-[#4f504c] block uppercase font-bold leading-none">
                  Hyderabad
                </span>
                <span className="text-xs font-bold text-gray-900 block truncate max-w-[130px]">
                  {currentLocation.name}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1f757a] transition-colors" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'text-[#1f757a] bg-[#e6f1f0]'
                      : 'text-gray-700 hover:text-[#1f757a] hover:bg-white/60'
                  } ${link.isHighlight ? 'text-[#1f757a] font-bold' : ''}`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.isStudent && <GraduationCap className="w-3.5 h-3.5 text-[#1f757a]" />}
                    {link.isFresh && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    {link.label}
                  </span>
                  {link.isHighlight && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#1f757a] text-white text-[9px] font-extrabold rounded-full tracking-wide">
                      DUET
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Quick Order Now button */}
            <Link
              href="/duet-builder"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1f757a] hover:bg-[#15575b] shadow-sm shadow-[#1f757a]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Order Now
            </Link>

            {/* Shopping Cart Pill */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#e6f1f0] hover:bg-[#d8ecea] text-xs font-bold text-[#1f757a] border border-[#c0d4d0]/60 transition-all group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#1f757a] group-hover:scale-110 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#e06d53] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </div>

              <span className="hidden sm:inline">Cart</span>

              {isDuetOrder && (
                <span className="px-1.5 py-0.5 rounded-md bg-[#1f757a] text-white text-[9px] font-extrabold tracking-wide uppercase">
                  2 Kitchens
                </span>
              )}
            </Link>

            {/* User Account / Login */}
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white border border-gray-200 hover:border-[#1f757a] transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1f757a]/10 text-[#1f757a] flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <span className="font-bold text-gray-900 block truncate max-w-[90px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                  {user?.student?.isVerified && (
                    <span className="text-[10px] text-[#1f757a] font-semibold flex items-center gap-0.5">
                      <GraduationCap className="w-2.5 h-2.5" />
                      Student
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#4f504c] hover:text-[#1f757a] hover:bg-white transition-all"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {/* Location button for mobile */}
          <button
            onClick={() => {
              openLocationModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#e3edea] text-[#1f757a] text-xs font-semibold"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Hyderabad: {currentLocation.name}</span>
            </div>
            <span className="text-[10px] underline">Change</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  pathname === link.href
                    ? 'bg-[#e6f1f0] text-[#1f757a] font-bold'
                    : 'text-gray-700 bg-gray-50'
                }`}
              >
                <span>{link.label}</span>
                {link.isHighlight && (
                  <span className="text-[9px] bg-[#1f757a] text-white px-1.5 py-0.5 rounded font-bold">
                    DUET
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex gap-2">
            <Link
              href="/duet-builder"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-3 rounded-xl bg-[#1f757a] text-white text-xs font-bold shadow-md shadow-[#1f757a]/20"
            >
              Build a Duet Order
            </Link>
            <Link
              href="/fresh"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-3 rounded-xl bg-[#c0d4d0] text-[#1f757a] text-xs font-bold"
            >
              Explore Fresh
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
