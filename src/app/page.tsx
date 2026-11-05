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
  CheckCircle2
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

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcfb]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden hero-gradient border-b border-[#c0d4d0]/40">
        {/* Soft background mint shapes */}
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#c0d4d0]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#1f757a]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline, Subheading & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Hyderabad location & badge */}
              <div className="inline-flex items-center gap-2 p-1.5 pr-4 rounded-full bg-white shadow-xs border border-[#c0d4d0]/70 text-xs font-semibold text-[#1f757a]">
                <button
                  onClick={openLocationModal}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f757a] text-white text-[11px] font-bold hover:bg-[#15575b] transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Hyderabad</span>
                </button>
                <span className="text-[#4f504c] truncate max-w-[200px]">
                  Delivering to: <strong>{currentLocation.name}</strong>
                </span>
                <span className="text-[10px] bg-[#e6f1f0] text-[#1f757a] px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#1f757a]">
                  Smart Multi-Craving Network
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.08]">
                  Two Cravings. <br />
                  <span className="text-[#1f757a] relative">
                    One Delivery.
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#c0d4d0]" viewBox="0 0 100 12" preserveAspectRatio="none">
                      <path d="M0,7 Q50,0 100,7" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                  </span>
                </h1>
              </div>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-[#4f504c] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Your favourite food, more choices and fresh goodness — all in one place. Pair two top restaurants into a single synchronized order with temperature-controlled delivery.
              </p>

              {/* Main CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/restaurants"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#1f757a] hover:bg-[#15575b] text-white font-bold text-sm transition-all shadow-md shadow-[#1f757a]/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore Restaurants</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/fresh"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-[#e3edea]/50 text-[#1f757a] font-bold text-sm transition-all border border-[#c0d4d0] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Explore GoDuet Fresh</span>
                </Link>
              </div>

              {/* Micro proof points */}
              <div className="pt-4 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 text-left">
                <div className="p-2.5 rounded-xl bg-white/70 border border-gray-100">
                  <span className="block text-base font-extrabold text-[#1f757a]">1 Delivery Fee</span>
                  <span className="text-[11px] text-[#4f504c]">Instead of paying two apps</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-gray-100">
                  <span className="block text-base font-extrabold text-[#1f757a]">Dual-Thermal</span>
                  <span className="text-[11px] text-[#4f504c]">Hot stays 65°C+, cold stays 4°C</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-gray-100">
                  <span className="block text-base font-extrabold text-[#1f757a]">15% Student</span>
                  <span className="text-[11px] text-[#4f504c]">Campus corridor perks</span>
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

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
                Hyderabad Favorites
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                Explore Popular Cravings
              </h2>
            </div>
            {selectedCuisine && (
              <button
                onClick={() => setSelectedCuisine(null)}
                className="text-xs font-bold text-[#1f757a] hover:underline"
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
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center group ${
                    isSelected
                      ? 'border-[#1f757a] bg-[#e6f1f0] ring-2 ring-[#1f757a]/20 shadow-xs'
                      : 'border-gray-100 bg-[#fafcfb] hover:border-[#c0d4d0] hover:bg-white'
                  }`}
                >
                  <span className="text-2xl group-hover:scale-115 transition-transform duration-300">
                    {c.icon}
                  </span>
                  <span className="text-xs font-bold text-gray-900 mt-2 truncate w-full">
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
      <section id="duet-studio" className="py-16 bg-[#eef5f3] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveDuetStudio />
        </div>
      </section>

      {/* 4. FEATURED RESTAURANTS */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#1f757a]/10 text-[#1f757a] text-[11px] font-bold">
                  Curated Hyderabad Partners
                </span>
                <span className="text-xs text-gray-400">• Verified Kitchens</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                Featured Restaurants Ready to Duet
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Combine with any matching nearby partner for a single drop-off.
              </p>
            </div>

            <Link
              href="/restaurants"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1f757a] hover:text-[#15575b] transition-colors"
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
      <section className="py-16 bg-[#f4f8f7] border-b border-[#c0d4d0]/50 relative overflow-hidden">
        {/* Soft mint wave decoration */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#1f757a] to-[#15575b] text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[#c0d4d0] text-xs font-bold">
                <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                <span>GoDuet Fresh Vertical</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Fresh Cold-Pressed Juices, Sprouts & Local Goodness
              </h2>
              <p className="text-sm text-white/85 leading-relaxed">
                Direct from Telangana organic farms and local cold-press studios. Never pasteurized, zero added sugar, delivered in eco-friendly glass and compostable packaging.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/fresh"
                  className="px-6 py-3 rounded-xl bg-white text-[#1f757a] font-bold text-xs hover:bg-[#c0d4d0] transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Explore Fresh Store</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-2 text-xs text-[#c0d4d0] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Harvested / Pressed Same Day</span>
                </div>
              </div>
            </div>

            {/* Background design accents */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden lg:block">
              <div className="w-full h-full bg-white rounded-full blur-3xl transform translate-x-1/2" />
            </div>
          </div>

          {/* Fresh Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FRESH_PRODUCTS_DATA.slice(0, 4).map((product) => (
              <FreshProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. STUDENT EXPERIENCE: "Good Food. Better Student Deals." */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#fafcfb] rounded-3xl border border-[#c0d4d0] p-8 sm:p-12 shadow-md relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f757a]/10 text-[#1f757a] text-xs font-bold">
                  <GraduationCap className="w-4 h-4" />
                  <span>Exclusive Campus Program</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  Good Food. <span className="text-[#1f757a]">Better Student Deals.</span>
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We know hostel cravings. One roommate wants spicy Bawarchi biryani, another wants thick chocolate shakes or waffles. With GoDuet, split the bill and get flat 15% off across Hyderabad campuses!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {STUDENT_PERKS.map((perk, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-gray-900">{perk.title}</span>
                        <span className="text-[10px] font-mono font-bold text-[#1f757a] bg-[#e6f1f0] px-1.5 py-0.5 rounded">
                          {perk.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">{perk.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href="/student"
                    className="px-6 py-3 rounded-xl bg-[#1f757a] text-white font-bold text-xs hover:bg-[#15575b] transition-all shadow-md shadow-[#1f757a]/20 flex items-center gap-1.5"
                  >
                    <span>Activate Student Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-xs text-gray-500 font-medium">
                    Applicable for IIIT-H, UoH, BITS, ISB, Osmania, Mahindra & more
                  </span>
                </div>
              </div>

              {/* Student Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-[#c0d4d0] shadow-xl bg-white p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-[#c0d4d0] flex items-center justify-center text-[#1f757a] font-bold">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">Hyderabad Student Pass</h4>
                      <p className="text-xs text-[#1f757a] font-semibold">Instant Campus Verification</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">Duet Multi-Craving Orders:</span>
                      <span className="font-bold text-gray-900">1 Rider Delivery</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">Student Discount:</span>
                      <span className="font-bold text-emerald-600">Flat 15% OFF</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">Late Night Hostel Delivery:</span>
                      <span className="font-bold text-gray-900">Available till 3:00 AM</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Hostel Room Drop:</span>
                      <span className="font-bold text-gray-900">Main Gate / Hostel Lobby</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#e3edea] text-[11px] text-[#1f757a] font-semibold text-center">
                    🎉 Over 12,000 Hyderabad students ordered duets this month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="py-16 bg-[#fafcfb] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
            Simple & Coordinated
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1 mb-3">
            How GoDuet Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto mb-12">
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
                className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs hover:border-[#1f757a] hover:shadow-lg transition-all relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-mono font-bold text-[#1f757a] bg-[#e6f1f0] px-2 py-0.5 rounded-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE GODUET (COMPARISON) */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
              The Smart Choice
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
              Why Hyderabad Chooses GoDuet
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              See how GoDuet compares to ordering across two separate apps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* The Other Apps */}
            <div className="bg-red-50/50 rounded-3xl p-6 sm:p-8 border border-red-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-red-100">
                <h3 className="font-bold text-red-950 text-base">Traditional 2 Apps Approach</h3>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">Frustrating</span>
              </div>
              <ul className="space-y-3 text-xs text-red-900/80">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Two separate delivery fees (₹45 + ₹45 = ₹90)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Two different riders arriving 25-30 minutes apart</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Biryani gets cold while waiting for the shake to arrive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Double the vehicle emissions and city traffic</span>
                </li>
              </ul>
            </div>

            {/* GoDuet Approach */}
            <div className="bg-[#e6f1f0] rounded-3xl p-6 sm:p-8 border border-[#9ec5c2] space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-[#9ec5c2]/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1f757a]" />
                  <h3 className="font-bold text-[#1f757a] text-base">GoDuet Coordinated Order</h3>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  Seamless
                </span>
              </div>
              <ul className="space-y-3 text-xs text-[#1f757a]-dark font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>One single delivery fee:</strong> Save ₹50 to ₹65 per duet</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Synchronized arrival:</strong> Both food items arrive together</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Dual-Thermal Bag:</strong> Hot stays 65°C+, cold shake stays 4°C</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>50% Lower Carbon:</strong> Single rider vehicle trip</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-16 bg-[#fafcfb] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
              Customer Love
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
              Hyderabad Foodies on GoDuet
            </h2>
            <p className="text-xs text-gray-400 mt-1">(Demo customer reviews for concept demonstration)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#1f757a] bg-[#e6f1f0] px-2 py-0.5 rounded-full">
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{t.review}"
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-xs text-gray-900">{t.name}</h4>
                    <p className="text-[10px] text-gray-500">{t.college}</p>
                    <p className="text-[10px] text-[#1f757a] font-semibold">Ordered: {t.duet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. APP PROMOTION BANNER */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1f757a] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="space-y-3 max-w-lg text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c0d4d0]">
                GoDuet On The Move
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Order Your Duets in 30 Seconds
              </h2>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                Download the upcoming GoDuet iOS and Android apps for live multi-kitchen tracking, student pass wallet, and 1-tap reordering.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => alert('GoDuet iOS App arriving on the App Store soon! Enjoy the web version.')}
                  className="px-5 py-2.5 rounded-xl bg-white text-[#1f757a] text-xs font-bold hover:bg-[#c0d4d0] transition-colors shadow-xs"
                >
                  App Store
                </button>
                <button
                  onClick={() => alert('GoDuet Android App arriving on Google Play soon! Enjoy the web version.')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-colors"
                >
                  Google Play
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl border border-white/20">
              <Smartphone className="w-12 h-12 text-[#c0d4d0]" />
              <div className="text-left text-xs">
                <span className="font-bold text-white block">Hyderabad Fast-Track Access</span>
                <span className="text-[11px] text-[#c0d4d0]">Scan QR or use Web App on mobile browser</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQS ACCORDION */}
      <section className="py-16 bg-[#fafcfb]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
              Have Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Everything you need to know about GoDuet’s multi-restaurant delivery in Hyderabad.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:text-[#1f757a] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-[#1f757a]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
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
