'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { RESTAURANTS_DATA } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import {
  Star,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  Flame,
  Info
} from 'lucide-react';

function RestaurantDetailContent() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  const restaurant = RESTAURANTS_DATA.find((r) => r.id === restaurantId);
  const { addMenuItem, items, restaurantA, restaurantB, isDuetOrder } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<string | null>(null);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#fafcfb] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Restaurant Not Found</h2>
        <p className="text-xs text-gray-500 mb-4">The requested restaurant profile could not be found.</p>
        <Link href="/restaurants" className="px-4 py-2 bg-[#1f757a] text-white rounded-xl text-xs font-bold">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  // Compatible Duet Partners
  const pairedPartners = RESTAURANTS_DATA.filter((r) => restaurant.duetPartners.includes(r.id));

  // Filter menu items by active category
  const displayedMenu = activeCategory === 'All'
    ? restaurant.menu
    : restaurant.menu.filter((item) => item.category === activeCategory);

  const handleAddItem = (item: any) => {
    const res = addMenuItem(item, restaurant);
    if (res.success) {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
      }, 1500);
      if (res.message) {
        setNotification(res.message);
        setTimeout(() => setNotification(null), 4000);
      }
    } else if (res.message) {
      setNotification(res.message);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const totalCartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fafcfb] pb-24">
      {/* 1. Hero Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-900">
        <Image
          src={restaurant.bannerImage}
          alt={restaurant.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1f757a] text-white text-[11px] font-extrabold uppercase tracking-wider">
              Hyderabad Verified Kitchen
            </span>
            {restaurant.isDuetEligible && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[#c0d4d0] text-[11px] font-bold">
                <Sparkles className="w-3 h-3" />
                Duet Partner Ready
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {restaurant.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
            {restaurant.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1 font-bold bg-white text-gray-950 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {restaurant.rating} ({restaurant.ratingCount.toLocaleString()} ratings)
            </span>
            <span className="flex items-center gap-1 text-gray-300">
              <Clock className="w-3.5 h-3.5 text-white/80" />
              {restaurant.deliveryTimeMins} mins
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-300">₹{restaurant.costForTwo} for two</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1 text-gray-300">
              <MapPin className="w-3.5 h-3.5" />
              {restaurant.locality}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/restaurants" className="hover:text-gray-900">Restaurants</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1f757a] font-semibold">{restaurant.name}</span>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div className="mb-6 p-4 rounded-2xl bg-[#e6f1f0] border border-[#1f757a]/30 text-[#1f757a] text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* 2. Interactive Duet Pairing Banner */}
        {restaurant.isDuetEligible && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#e3edea] via-white to-[#e3edea] border border-[#c0d4d0] shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1f757a] text-white flex items-center justify-center text-xs font-bold">
                    ∞
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#1f757a]">
                    Pair with a Synchronized Duet Partner!
                  </h3>
                </div>
                <p className="text-xs text-[#4f504c]">
                  Order from {restaurant.name} and combine a second craving from any of these nearby kitchens in ONE delivery:
                </p>
              </div>

              <Link
                href={`/duet-builder?restA=${restaurant.id}`}
                className="px-5 py-2.5 rounded-xl bg-[#1f757a] hover:bg-[#15575b] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <span>Launch Duet Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Partner Cards */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pairedPartners.map((partner) => (
                <Link
                  key={partner.id}
                  href={`/duet-builder?restA=${restaurant.id}&restB=${partner.id}`}
                  className="p-3 rounded-2xl bg-white border border-gray-200/80 hover:border-[#1f757a] flex items-center gap-3 transition-all group shadow-2xs"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#1f757a] truncate">
                      {partner.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 truncate">{partner.cuisines.join(', ')}</p>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                      + Pair in 1 Delivery
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 3. Menu Categories Tabs */}
        <div className="sticky top-20 z-30 bg-[#fafcfb]/95 backdrop-blur-sm py-3 border-b border-gray-200 mb-6 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === 'All'
                ? 'bg-[#1f757a] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Items ({restaurant.menu.length})
          </button>
          {restaurant.menuCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#1f757a] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4. Menu Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedMenu.map((item) => {
            const isAdded = addedItemIds[item.id];
            return (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 hover:border-[#c0d4d0] shadow-xs flex items-start justify-between gap-4 transition-all"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    {/* Veg / Non-Veg badge */}
                    <span
                      className={`inline-block w-4 h-4 rounded-sm border p-0.5 flex-shrink-0 ${
                        item.type === 'veg'
                          ? 'border-emerald-600'
                          : item.type === 'egg'
                          ? 'border-amber-600'
                          : 'border-red-600'
                      }`}
                    >
                      <span
                        className={`block w-full h-full rounded-full ${
                          item.type === 'veg'
                            ? 'bg-emerald-600'
                            : item.type === 'egg'
                            ? 'bg-amber-600'
                            : 'bg-red-600'
                        }`}
                      />
                    </span>

                    {item.isBestseller && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        Bestseller
                      </span>
                    )}

                    {item.isDuetFavorite && (
                      <span className="text-[10px] font-bold text-[#1f757a] bg-[#e6f1f0] px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> Duet Star
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-gray-950">{item.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-extrabold text-[#1f757a]">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-1 flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {item.rating} ({item.votes})
                    </span>
                    <span>•</span>
                    <span>Prep: ~{item.prepTimeMinutes} mins</span>
                  </div>
                </div>

                {/* Right: Item Image + Add to Cart Button */}
                <div className="relative flex flex-col items-center flex-shrink-0">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 shadow-2xs">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>

                  <button
                    onClick={() => handleAddItem(item)}
                    className={`-mt-4 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1 ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white hover:bg-[#e6f1f0] text-[#1f757a] border border-[#1f757a] active:scale-95'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Sticky Floating Cart Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-2xl mx-auto">
          <div className="bg-[#1f757a] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-extrabold text-sm">
                {totalCartCount}
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">
                  {isDuetOrder ? 'Duet Cart Active (2 Restaurants)' : `${totalCartCount} Item(s) in Cart`}
                </p>
                <p className="text-[11px] text-[#c0d4d0]">
                  {isDuetOrder ? 'Coordinated delivery ready!' : 'Add from a second kitchen or proceed'}
                </p>
              </div>
            </div>

            <Link
              href="/cart"
              className="px-5 py-2.5 rounded-xl bg-white text-[#1f757a] text-xs font-bold hover:bg-[#c0d4d0] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RestaurantDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-12 text-center text-xs text-gray-400">Loading restaurant details...</div>}>
      <RestaurantDetailContent />
    </Suspense>
  );
}
