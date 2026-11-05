'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  Users,
  GraduationCap,
  Leaf,
  ChevronDown,
  Bike,
  Flame,
  Snowflake,
  HelpCircle,
  Smartphone,
  CheckCircle2,
  TrendingDown,
  Layers,
  ThermometerSnowflake,
  Compass
} from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import DuetHeroVisual from '@/components/DuetHeroVisual';
import RestaurantCard from '@/components/RestaurantCard';
import FreshProductCard from '@/components/FreshProductCard';
import InteractiveDuetStudio from '@/components/InteractiveDuetStudio';
import {
  RESTAURANTS_DATA,
  FRESH_PRODUCTS_DATA,
  CUISINES_LIST,
  STUDENT_PERKS,
  TESTIMONIALS,
  FAQS
} from '@/data/mockData';

export default function HomePage() {
  const { currentLocation, openLocationModal } = useLocation();
  const { openAuthModal } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  // Filter restaurants by cuisine if selected
  const displayedRestaurants = selectedCuisine
    ? RESTAURANTS_DATA.filter(r => r.cuisines.some(c => c.toLowerCase() === selectedCuisine.toLowerCase()))
    : RESTAURANTS_DATA;

  const hyderabadLocalities = [
    'Gachibowli',
    'Madhapur',
    'Hitec City',
    'Jubilee Hills',
    'Banjara Hills',
    'Kondapur',
    'Kukatpally',
    'Secunderabad',
    'Begumpet',
    'Charminar'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcfb] dark:bg-[#0d1413]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden hero-gradient border-b border-[#C3DCD7]/40 dark:border-[#244644]/40">
        {/* Soft background mint glow shapes */}
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#C3DCD7]/35 dark:bg-[#197F83]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#197F83]/10 dark:bg-[#22a2a7]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline, Subheading & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Hyderabad location & badge */}
              <div className="inline-flex items-center gap-2 p-1.5 pr-4 rounded-full bg-white dark:bg-[#141e1d] shadow-xs border border-[#C3DCD7]/70 dark:border-[#244644] text-xs font-semibold text-[#197F83] dark:text-[#22a2a7]">
                <button
                  onClick={openLocationModal}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#197F83] text-white text-[11px] font-bold hover:bg-[#125e61] transition-colors cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Hyderabad</span>
                </button>
                <span className="text-[#555653] dark:text-[#a8b2b0] truncate max-w-[200px]">
                  Delivering to: <strong className="text-gray-900 dark:text-white">{currentLocation.name}</strong>
                </span>
                <span className="text-[10px] bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] dark:text-[#22a2a7] px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#197F83] dark:text-[#22a2a7]">
                  Smart Multi-Craving Network
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 dark:text-white tracking-tight leading-[1.08]">
                  Two Cravings. <br />
                  <span className="text-[#197F83] dark:text-[#22a2a7] relative inline-block">
                    One Delivery.
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#C3DCD7] dark:text-[#197F83]/60" viewBox="0 0 100 12" preserveAspectRatio="none">
                      <path d="M0,7 Q50,0 100,7" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                  </span>
                </h1>
              </div>

              {/* Subheading - EXACT TEXT AS REQUIRED */}
              <p className="text-base sm:text-lg text-[#555653] dark:text-[#a8b2b0] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Your favourite food, more choices and fresh goodness — all in one place. Pair two eligible restaurants into one synchronized order.
              </p>

              {/* Main CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/restaurants"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#197F83] hover:bg-[#125e61] text-white font-bold text-sm transition-all shadow-md shadow-[#197F83]/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore Restaurants</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/fresh"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-[#141e1d] hover:bg-[#d9ebe7]/50 dark:hover:bg-[#1c2e2c] text-[#197F83] dark:text-[#22a2a7] font-bold text-sm transition-all border border-[#C3DCD7] dark:border-[#244644] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Leaf className="w-4 h-4 text-[#2D8A4E]" />
                  <span>Explore GoDuet Fresh</span>
                </Link>
              </div>

              {/* Micro proof points */}
              <div className="pt-4 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 text-left">
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#141e1d]/80 border border-gray-100 dark:border-[#244644] shadow-xs">
                  <span className="block text-base font-black text-[#197F83] dark:text-[#22a2a7]">1 Delivery Fee</span>
                  <span className="text-[11px] text-[#555653] dark:text-[#a8b2b0]">Zero double app charges</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#141e1d]/80 border border-gray-100 dark:border-[#244644] shadow-xs">
                  <span className="block text-base font-black text-[#197F83] dark:text-[#22a2a7]">Dual-Thermal</span>
                  <span className="text-[11px] text-[#555653] dark:text-[#a8b2b0]">Hot 65°C+ & Cold 4°C</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#141e1d]/80 border border-gray-100 dark:border-[#244644] shadow-xs">
                  <span className="block text-base font-black text-[#197F83] dark:text-[#22a2a7]">15% Student</span>
                  <span className="text-[11px] text-[#555653] dark:text-[#a8b2b0]">Hyderabad campus pass</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Visual Presentation */}
            <div className="lg:col-span-6">
              <DuetHeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS CARDS SECTION */}
      <section className="py-14 bg-white dark:bg-[#0d1413] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#197F83] dark:text-[#22a2a7]">
              Why GoDuet Is Better
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white mt-1">
              Engineered for the Modern Foodie
            </h2>
            <p className="text-xs sm:text-sm text-[#555653] dark:text-[#a8b2b0] mt-1.5">
              Smart logistics coordinating two favorite spots into a single thermal bag drop-off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#fafcfb] dark:bg-[#141e1d] border border-[#C3DCD7]/60 dark:border-[#244644] space-y-3 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] dark:text-[#22a2a7] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-950 dark:text-white">
                Coordinated 2-Restaurant Delivery
              </h3>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0] leading-relaxed">
                Order biryani from Bawarchi and thickshakes from The ThickShake Factory in one single checkout without juggling two separate apps.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#fafcfb] dark:bg-[#141e1d] border border-[#C3DCD7]/60 dark:border-[#244644] space-y-3 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#2D8A4E] flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-950 dark:text-white">
                Zero Double Delivery Fees
              </h3>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0] leading-relaxed">
                Save ₹50 to ₹90 every multi-craving order. We charge one flat synchronized delivery fee instead of double platform charges.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#fafcfb] dark:bg-[#141e1d] border border-[#C3DCD7]/60 dark:border-[#244644] space-y-3 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] dark:text-[#22a2a7] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-950 dark:text-white">
                Two Cravings, One Rider
              </h3>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0] leading-relaxed">
                One dedicated delivery partner picks up both orders in optimized route sequence. No two separate riders ringing your doorbell 30 minutes apart.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#fafcfb] dark:bg-[#141e1d] border border-[#C3DCD7]/60 dark:border-[#244644] space-y-3 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ThermometerSnowflake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-950 dark:text-white">
                Dual Temperature Zones
              </h3>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0] leading-relaxed">
                Our custom-engineered delivery bags have separated thermal chambers: steam heat retention for hot food and sub-zero chill packs for cold shakes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#fafcfb] dark:bg-[#141e1d] border border-[#C3DCD7]/60 dark:border-[#244644] space-y-3 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#2D8A4E] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-950 dark:text-white">
                GoDuet Fresh Vertical
              </h3>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0] leading-relaxed">
                Cold-pressed juices, organic sprouts, microgreens, and herbal wellness shots harvested same day from local Hyderabad farms.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#fafcfb] dark:bg-[#141e1d] border border-[#C3DCD7]/60 dark:border-[#244644] space-y-3 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] dark:text-[#22a2a7] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-950 dark:text-white">
                Real-Time Synchronized Dual Tracking
              </h3>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0] leading-relaxed">
                Watch Kitchen 1 and Kitchen 2 preparation in parallel with synchronized rider arrival time in your customer dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-12 bg-white dark:bg-[#0d1413] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#197F83] dark:text-[#22a2a7]">
                Hyderabad Favorites
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white mt-1">
                Explore Popular Cravings
              </h2>
            </div>
            {selectedCuisine && (
              <button
                onClick={() => setSelectedCuisine(null)}
                className="text-xs font-bold text-[#197F83] dark:text-[#22a2a7] hover:underline cursor-pointer"
              >
                Clear filter (Show All)
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {CUISINES_LIST.map((c) => {
              const isSelected = selectedCuisine === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => setSelectedCuisine(isSelected ? null : c.name)}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center group cursor-pointer ${
                    isSelected
                      ? 'border-[#197F83] bg-[#e8f4f3] dark:bg-[#182c2b] ring-2 ring-[#197F83]/20 shadow-xs'
                      : 'border-gray-200 dark:border-[#244644] bg-[#fafcfb] dark:bg-[#141e1d] hover:border-[#C3DCD7] hover:bg-white dark:hover:bg-[#1c2e2c]'
                  }`}
                >
                  <span className="text-2xl group-hover:scale-115 transition-transform duration-300">
                    {c.icon}
                  </span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white mt-2 truncate w-full">
                    {c.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {c.count}+ spots
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE TWO-RESTAURANT ORDERING (THE STAR FEATURE) */}
      <section id="duet-studio" className="py-16 bg-[#eef5f3] dark:bg-[#101a19] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveDuetStudio />
        </div>
      </section>

      {/* 4. FEATURED RESTAURANTS */}
      <section className="py-16 bg-white dark:bg-[#0d1413] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#197F83]/10 dark:bg-[#197F83]/20 text-[#197F83] dark:text-[#22a2a7] text-[11px] font-bold">
                  Curated Hyderabad Partners
                </span>
                <span className="text-xs text-gray-400">• Verified Kitchens</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white mt-2">
                Featured Restaurants Ready to Duet
              </h2>
              <p className="text-xs sm:text-sm text-[#555653] dark:text-[#a8b2b0] mt-1">
                Combine with any matching nearby partner for a single drop-off.
              </p>
            </div>

            <Link
              href="/restaurants"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#197F83] dark:text-[#22a2a7] hover:text-[#125e61] transition-colors"
            >
              <span>View All {RESTAURANTS_DATA.length} Restaurants</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRestaurants.slice(0, 6).map((restaurant, idx) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} priority={idx < 3} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. GODUET FRESH MARKETPLACE SHOWCASE */}
      <section className="py-16 bg-[#f4f8f7] dark:bg-[#121c1b] border-b border-[#C3DCD7]/50 dark:border-[#244644] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#197F83] to-[#125e61] text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[#C3DCD7] text-xs font-bold">
                <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                <span>GoDuet Fresh Vertical</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Fresh Cold-Pressed Juices, Sprouts & Local Goodness
              </h2>
              <p className="text-sm text-white/90 leading-relaxed">
                Direct from Telangana organic farms and local cold-press studios. Never pasteurized, zero added sugar, delivered in eco-friendly glass and compostable packaging.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/fresh"
                  className="px-6 py-3 rounded-xl bg-white text-[#197F83] font-bold text-xs hover:bg-[#C3DCD7] transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Explore Fresh Store</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-2 text-xs text-[#C3DCD7] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Harvested / Pressed Same Day</span>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden lg:block">
              <div className="w-full h-full bg-white rounded-full blur-3xl transform translate-x-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FRESH_PRODUCTS_DATA.slice(0, 4).map((product) => (
              <FreshProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. HYDERABAD LOCAL PRIDE SECTION */}
      <section className="py-14 bg-white dark:bg-[#0d1413] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#197F83] dark:text-[#22a2a7] flex items-center justify-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Hyderabad Born & Bred</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white mt-1">
              Active Across All Major Hyderabad Hubs
            </h2>
            <p className="text-xs sm:text-sm text-[#555653] dark:text-[#a8b2b0] mt-1">
              Delivering synchronized cravings across Cyberabad tech corridors, heritage alleys, and university campuses.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
            {hyderabadLocalities.map((loc) => (
              <button
                key={loc}
                onClick={openLocationModal}
                className="px-4 py-2 rounded-2xl bg-[#fafcfb] dark:bg-[#141e1d] border border-[#C3DCD7]/60 dark:border-[#244644] hover:border-[#197F83] dark:hover:border-[#22a2a7] text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-[#197F83] transition-all flex items-center gap-1.5 group cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#197F83] group-hover:scale-110 transition-transform" />
                <span>{loc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. STUDENT EXPERIENCE */}
      <section className="py-16 bg-[#fafcfb] dark:bg-[#101a19] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#141e1d] rounded-3xl border border-[#C3DCD7] dark:border-[#244644] p-8 sm:p-12 shadow-md relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#197F83]/10 dark:bg-[#197F83]/20 text-[#197F83] dark:text-[#22a2a7] text-xs font-bold">
                  <GraduationCap className="w-4 h-4" />
                  <span>Exclusive Campus Program</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Good Food. <span className="text-[#197F83] dark:text-[#22a2a7]">Better Student Deals.</span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  We know hostel cravings. One roommate wants spicy Bawarchi biryani, another wants thick chocolate shakes or waffles. With GoDuet, split the bill and get flat 15% off across Hyderabad campuses!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {STUDENT_PERKS.map((perk, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0d1413] border border-gray-100 dark:border-gray-800 shadow-2xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-gray-900 dark:text-white">{perk.title}</span>
                        <span className="text-[10px] font-mono font-bold text-[#197F83] dark:text-[#22a2a7] bg-[#e8f4f3] dark:bg-[#182c2b] px-1.5 py-0.5 rounded">
                          {perk.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{perk.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href="/student"
                    className="px-6 py-3 rounded-xl bg-[#197F83] text-white font-bold text-xs hover:bg-[#125e61] transition-all shadow-md shadow-[#197F83]/20 flex items-center gap-1.5"
                  >
                    <span>Activate Student Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Applicable for IIIT-H, UoH, BITS, ISB, Osmania, Mahindra & more
                  </span>
                </div>
              </div>

              {/* Student Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-[#C3DCD7] dark:border-[#244644] shadow-xl bg-white dark:bg-[#0d1413] p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-12 rounded-2xl bg-[#C3DCD7] dark:bg-[#1c2b29] flex items-center justify-center text-[#197F83] dark:text-[#22a2a7] font-bold">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">Hyderabad Student Pass</h4>
                      <p className="text-xs text-[#197F83] dark:text-[#22a2a7] font-semibold">Instant Campus Verification</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Duet Multi-Craving Orders:</span>
                      <span className="font-bold text-gray-900 dark:text-white">1 Rider Delivery</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Student Discount:</span>
                      <span className="font-bold text-emerald-600">Flat 15% OFF</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Late Night Hostel Delivery:</span>
                      <span className="font-bold text-gray-900 dark:text-white">Available till 3:00 AM</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500 dark:text-gray-400">Hostel Room Drop:</span>
                      <span className="font-bold text-gray-900 dark:text-white">Main Gate / Hostel Lobby</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#d9ebe7] dark:bg-[#162422] text-[11px] text-[#197F83] dark:text-[#22a2a7] font-semibold text-center">
                    🎉 Over 12,000 Hyderabad students ordered duets this month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section className="py-16 bg-white dark:bg-[#0d1413] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#197F83] dark:text-[#22a2a7]">
            Simple & Coordinated
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 mb-3">
            How GoDuet Works
          </h2>
          <p className="text-xs sm:text-sm text-[#555653] dark:text-[#a8b2b0] max-w-xl mx-auto mb-12">
            Eliminating the hassle of running multiple delivery apps, multiple deliveries, and double fees.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {[
              {
                step: '01',
                title: 'Select Restaurant A',
                desc: 'Pick your main meal cravings like fragrant Dum Biryani or oven-hot pizza.',
                icon: '🍲'
              },
              {
                step: '02',
                title: 'Add Duet Partner B',
                desc: 'Our engine suggests nearby matching spots for shakes, desserts, or fresh juice.',
                icon: '🥤'
              },
              {
                step: '03',
                title: 'Synchronized Cook Times',
                desc: 'Orders are timed so both kitchens finish cooking at the exact moment the rider arrives.',
                icon: '⏱️'
              },
              {
                step: '04',
                title: 'One Coordinated Drop-off',
                desc: 'One rider delivers both in a dual-thermal bag. Hot stays hot, cold stays cold!',
                icon: '🛵'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#fafcfb] dark:bg-[#141e1d] rounded-3xl p-6 border border-gray-200/80 dark:border-[#244644] shadow-xs hover:border-[#197F83] hover:shadow-lg transition-all relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-mono font-bold text-[#197F83] dark:text-[#22a2a7] bg-[#e8f4f3] dark:bg-[#182c2b] px-2 py-0.5 rounded-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-16 bg-[#fafcfb] dark:bg-[#101a19] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#197F83] dark:text-[#22a2a7]">
              Customer Love
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
              Hyderabad Foodies on GoDuet
            </h2>
            <p className="text-xs text-gray-400 mt-1">Over 12,000+ happy multi-restaurant deliveries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#141e1d] rounded-3xl p-6 border border-gray-200/80 dark:border-[#244644] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#197F83] dark:text-[#22a2a7] bg-[#e8f4f3] dark:bg-[#182c2b] px-2 py-0.5 rounded-full">
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{t.college}</p>
                    <p className="text-[10px] text-[#197F83] dark:text-[#22a2a7] font-semibold">Ordered: {t.duet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQS ACCORDION */}
      <section className="py-16 bg-white dark:bg-[#0d1413]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#197F83] dark:text-[#22a2a7]">
              Have Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#555653] dark:text-[#a8b2b0] mt-1">
              Everything you need to know about GoDuet’s multi-restaurant delivery in Hyderabad.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#fafcfb] dark:bg-[#141e1d] rounded-2xl border border-gray-200/80 dark:border-[#244644] overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:text-[#197F83] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-[#197F83]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
