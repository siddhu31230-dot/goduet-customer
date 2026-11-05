'use client';

import React, { useState, useEffect } from 'react';
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
  GraduationCap,
  Sun,
  Moon,
  Search,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentLocation, openLocationModal } = useLocation();
  const { items, isDuetOrder } = useCart();
  const { user, isLoggedIn, theme, toggleTheme } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Restaurants', href: '/restaurants' },
    { label: 'GoDuet Fresh', href: '/fresh', isFresh: true },
    { label: 'Duet Builder', href: '/duet-builder', isHighlight: true },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Offers', href: '/offers' },
    { label: 'Student Perks', href: '/student', isStudent: true },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled ? 'glass-nav shadow-xs' : 'bg-white/80 dark:bg-[#0d1413]/85 backdrop-blur-md border-b border-[#C3DCD7]/40 dark:border-[#244644]/40'
    }`}>
      {/* Top micro banner for Hyderabad announcement */}
      <div className="bg-[#197F83] text-white text-[11px] font-medium py-1 px-4 text-center flex items-center justify-center gap-2">
        <span className="flex items-center gap-1 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#C3DCD7]" />
          HYDERABAD LAUNCH:
        </span>
        <span>Order from two restaurants in 1 delivery! Use code <strong className="underline underline-offset-2 font-bold">DUETFIRST</strong> for ₹100 OFF</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Hyderabad Location Selector */}
          <div className="flex items-center gap-5">
            <BrandLogo size="md" />

            {/* Location selector pill */}
            <button
              onClick={openLocationModal}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#d9ebe7]/60 dark:bg-[#162422] hover:bg-[#d9ebe7] dark:hover:bg-[#1c2e2c] text-xs font-semibold text-[#197F83] dark:text-[#22a2a7] border border-[#C3DCD7]/60 dark:border-[#244644] transition-all group cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#197F83] dark:text-[#22a2a7] group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="text-[10px] text-[#555653] dark:text-[#a8b2b0] block uppercase font-bold leading-none">
                  Hyderabad
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block truncate max-w-[120px]">
                  {currentLocation.name}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#197F83] transition-colors" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'text-[#197F83] dark:text-[#22a2a7] bg-[#e8f4f3] dark:bg-[#182c2b]'
                      : 'text-gray-700 dark:text-gray-300 hover:text-[#197F83] dark:hover:text-[#22a2a7] hover:bg-[#d9ebe7]/40 dark:hover:bg-[#162422]'
                  } ${link.isHighlight ? 'text-[#197F83] dark:text-[#22a2a7] font-bold' : ''}`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.isStudent && <GraduationCap className="w-3.5 h-3.5 text-[#197F83]" />}
                    {link.isFresh && <span className="w-1.5 h-1.5 rounded-full bg-[#2D8A4E]" />}
                    {link.label}
                  </span>
                  {link.isHighlight && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#197F83] text-white text-[9px] font-extrabold rounded-full tracking-wide">
                      DUET
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search link */}
            <Link
              href="/restaurants"
              aria-label="Search restaurants and dishes"
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-[#197F83] dark:hover:text-[#22a2a7] hover:bg-gray-100 dark:hover:bg-[#141e1d] transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-[#197F83] dark:hover:text-[#22a2a7] hover:bg-gray-100 dark:hover:bg-[#141e1d] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Order Now button */}
            <Link
              href="/duet-builder"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#197F83] hover:bg-[#125e61] shadow-sm shadow-[#197F83]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Order Now
            </Link>

            {/* Shopping Cart Pill */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-[#e8f4f3] dark:bg-[#182c2b] hover:bg-[#d9ebe7] dark:hover:bg-[#203938] text-xs font-bold text-[#197F83] dark:text-[#22a2a7] border border-[#C3DCD7]/60 dark:border-[#244644] transition-all group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#197F83] dark:text-[#22a2a7] group-hover:scale-110 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#e06d53] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </div>

              <span className="hidden sm:inline">Cart</span>

              {isDuetOrder && (
                <span className="px-1.5 py-0.5 rounded-md bg-[#197F83] text-white text-[9px] font-extrabold tracking-wide uppercase">
                  2 Kitchens
                </span>
              )}
            </Link>

            {/* User Account / Login */}
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] hover:border-[#197F83] transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-[#197F83]/10 dark:bg-[#22a2a7]/20 text-[#197F83] dark:text-[#22a2a7] flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <span className="font-bold text-gray-900 dark:text-gray-100 block truncate max-w-[85px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#197F83] dark:text-[#22a2a7] font-semibold flex items-center gap-0.5">
                    <LayoutDashboard className="w-2.5 h-2.5" />
                    Dashboard
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-xl text-xs font-bold text-[#555653] dark:text-[#a8b2b0] hover:text-[#197F83] dark:hover:text-white transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#197F83] dark:text-[#22a2a7] bg-white dark:bg-[#141e1d] border border-[#197F83] dark:border-[#22a2a7] hover:bg-[#e8f4f3] dark:hover:bg-[#182c2b] transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#141e1d] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-gray-200 dark:border-[#244644] bg-white/95 dark:bg-[#0d1413]/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {/* Location button for mobile */}
          <button
            onClick={() => {
              openLocationModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#d9ebe7] dark:bg-[#162422] text-[#197F83] dark:text-[#22a2a7] text-xs font-semibold"
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
                    ? 'bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] dark:text-[#22a2a7] font-bold'
                    : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#141e1d]'
                }`}
              >
                <span>{link.label}</span>
                {link.isHighlight && (
                  <span className="text-[9px] bg-[#197F83] text-white px-1.5 py-0.5 rounded font-bold">
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
              className="flex-1 text-center py-3 rounded-xl bg-[#197F83] text-white text-xs font-bold shadow-md shadow-[#197F83]/20"
            >
              Build a Duet Order
            </Link>
            <Link
              href="/fresh"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-3 rounded-xl bg-[#C3DCD7] dark:bg-[#1c2b29] text-[#197F83] dark:text-[#22a2a7] text-xs font-bold"
            >
              Explore Fresh
            </Link>
          </div>

          {!isLoggedIn && (
            <div className="pt-2 flex gap-2 border-t border-gray-100 dark:border-gray-800">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl border border-[#197F83] text-[#197F83] dark:text-[#22a2a7] text-xs font-bold"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl bg-[#197F83] text-white text-xs font-bold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
