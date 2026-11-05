'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RESTAURANTS_DATA } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Clock,
  AlertCircle,
  ShoppingBag,
  Flame,
  Snowflake,
  RotateCcw
} from 'lucide-react';
import { Restaurant, MenuItem } from '@/types';

export default function InteractiveDuetStudio() {
  const { addMenuItem } = useCart();

  // Selected restaurants for the duet builder
  const [slotARestaurant, setSlotARestaurant] = useState<Restaurant>(RESTAURANTS_DATA[0]); // Bawarchi
  const [slotBRestaurant, setSlotBRestaurant] = useState<Restaurant>(RESTAURANTS_DATA[2]); // ThickShake
  const [selectedItemA, setSelectedItemA] = useState<MenuItem>(slotARestaurant.menu[0]);
  const [selectedItemB, setSelectedItemB] = useState<MenuItem>(slotBRestaurant.menu[0]);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Compatible partners for slot A
  const compatibleWithA = RESTAURANTS_DATA.filter(r => slotARestaurant.duetPartners.includes(r.id));

  // Change slot A
  const handleSelectSlotA = (restaurant: Restaurant) => {
    setSlotARestaurant(restaurant);
    setSelectedItemA(restaurant.menu[0]);
    // find first compatible partner for new A
    const compatible = RESTAURANTS_DATA.find(r => restaurant.duetPartners.includes(r.id));
    if (compatible) {
      setSlotBRestaurant(compatible);
      setSelectedItemB(compatible.menu[0]);
    }
  };

  // Change slot B
  const handleSelectSlotB = (restaurant: Restaurant) => {
    if (!slotARestaurant.duetPartners.includes(restaurant.id)) {
      setFeedbackMsg(`Route mismatch: "${restaurant.name}" is beyond the synchronized 10-minute dispatch corridor for "${slotARestaurant.name}". Please pick a verified partner.`);
      setTimeout(() => setFeedbackMsg(null), 4000);
      return;
    }
    setSlotBRestaurant(restaurant);
    setSelectedItemB(restaurant.menu[0]);
  };

  const handleAddBothToCart = () => {
    addMenuItem(selectedItemA, slotARestaurant);
    addMenuItem(selectedItemB, slotBRestaurant);
    setFeedbackMsg(`Both items added! Coordinated Duet Cart created for ${slotARestaurant.name} + ${slotBRestaurant.name}`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Sync calculation
  const prepDelta = Math.abs(selectedItemA.prepTimeMinutes - selectedItemB.prepTimeMinutes);
  const combinedDeliveryMins = Math.max(slotARestaurant.deliveryTimeMins, slotBRestaurant.deliveryTimeMins) + 3;
  const foodSubtotal = selectedItemA.price + selectedItemB.price;
  const singleDelivery = 39;
  const separateAppDelivery = 85;
  const savings = separateAppDelivery - singleDelivery;

  return (
    <div className="w-full bg-[#fafcfb] rounded-3xl border border-[#c0d4d0]/70 p-6 sm:p-8 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#1f757a] text-white text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#c0d4d0]" />
              GoDuet Signature Experience
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Live Route-Sync Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1f757a] mt-2">
            Two Cravings. One Delivery.
          </h2>
          <p className="text-xs sm:text-sm text-[#4f504c] mt-1">
            Pick your main meal from Restaurant 1 and your beverage/dessert from Restaurant 2. We synchronize their kitchen prep times and assign one rider.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#e3edea] p-3 rounded-2xl border border-[#c0d4d0]/50 text-xs text-[#1f757a] font-semibold">
          <Clock className="w-4 h-4" />
          <span>Synchronized ETA: ~{combinedDeliveryMins} mins</span>
        </div>
      </div>

      {feedbackMsg && (
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* The Two Slots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* SLOT A: Primary Restaurant */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#1f757a] text-white flex items-center justify-center text-xs font-extrabold">
                  A
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Restaurant 1: Main Meal</h3>
                  <p className="text-[11px] text-gray-500">Biryani, Pizzas, Gourmet Burgers, Dosas</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                <Flame className="w-3 h-3" />
                Hot Prep
              </span>
            </div>

            {/* Restaurant Selector Chips */}
            <div className="mt-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Select Primary Restaurant:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RESTAURANTS_DATA.slice(0, 4).map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectSlotA(r)}
                    className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                      slotARestaurant.id === r.id
                        ? 'border-[#1f757a] bg-[#e6f1f0] text-[#1f757a] font-bold shadow-2xs'
                        : 'border-gray-100 hover:border-gray-200 text-gray-700 bg-gray-50'
                    }`}
                  >
                    <p className="truncate font-bold">{r.name}</p>
                    <p className="text-[10px] text-gray-500 font-normal mt-0.5">{r.locality}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dish Choices from Slot A */}
            <div className="mt-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Choose Dish from {slotARestaurant.name}:
              </label>
              <div className="space-y-2">
                {slotARestaurant.menu.slice(0, 3).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemA(item)}
                    className={`w-full p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      selectedItemA.id === item.id
                        ? 'border-[#1f757a] bg-[#fafcfb] ring-1 ring-[#1f757a]'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{item.name}</h4>
                        <span className="text-xs font-extrabold text-[#1f757a] ml-2">₹{item.price}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                      <span className="text-[10px] text-gray-400 font-medium">Prep: {item.prepTimeMinutes} mins</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Slot A Subtotal:</span>
            <span className="font-extrabold text-gray-900">₹{selectedItemA.price}</span>
          </div>
        </div>

        {/* SLOT B: Compatible Paired Restaurant */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#4f504c] text-white flex items-center justify-center text-xs font-extrabold">
                  B
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Restaurant 2: Sweet or Beverage</h3>
                  <p className="text-[11px] text-gray-500">Shakes, Pastries, Waffles, Royal Sweets</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                <Snowflake className="w-3 h-3" />
                Chilled Prep
              </span>
            </div>

            {/* Compatible Partner Chips (Dynamic filtering) */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Select Compatible Partner:
                </label>
                <span className="text-[10px] text-[#1f757a] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Synced Corridor
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {compatibleWithA.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectSlotB(r)}
                    className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                      slotBRestaurant.id === r.id
                        ? 'border-[#1f757a] bg-[#e6f1f0] text-[#1f757a] font-bold shadow-2xs'
                        : 'border-gray-100 hover:border-gray-200 text-gray-700 bg-gray-50'
                    }`}
                  >
                    <p className="truncate font-bold">{r.name}</p>
                    <p className="text-[10px] text-gray-500 font-normal mt-0.5">{r.locality}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dish Choices from Slot B */}
            <div className="mt-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Choose Dish from {slotBRestaurant.name}:
              </label>
              <div className="space-y-2">
                {slotBRestaurant.menu.slice(0, 3).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemB(item)}
                    className={`w-full p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      selectedItemB.id === item.id
                        ? 'border-[#1f757a] bg-[#fafcfb] ring-1 ring-[#1f757a]'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{item.name}</h4>
                        <span className="text-xs font-extrabold text-[#1f757a] ml-2">₹{item.price}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                      <span className="text-[10px] text-gray-400 font-medium">Prep: {item.prepTimeMinutes} mins</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Slot B Subtotal:</span>
            <span className="font-extrabold text-gray-900">₹{selectedItemB.price}</span>
          </div>
        </div>
      </div>

      {/* Live Synchronized Kitchen Pipeline Visual */}
      <div className="mt-8 bg-[#e3edea]/60 rounded-3xl p-6 border border-[#c0d4d0]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1f757a] text-white flex items-center justify-center font-bold text-xl shadow-md">
              ∞
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-[#1f757a] uppercase tracking-wider">
                  GoDuet Kitchen Synchronization Matrix
                </h4>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Prep Delta: {prepDelta}m (Ideal)
                </span>
              </div>
              <p className="text-xs text-[#4f504c] mt-0.5">
                {slotARestaurant.name} & {slotBRestaurant.name} are timed to pack within 3 minutes of rider arrival.
              </p>
            </div>
          </div>

          {/* Transparent Cost Breakdown */}
          <div className="text-right flex items-center gap-6">
            <div className="text-left md:text-right">
              <span className="text-[11px] text-gray-500 block">Single Coordinated Delivery</span>
              <span className="text-xs font-extrabold text-emerald-700">
                You save ₹{savings} vs 2 separate apps
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Combined Total</span>
              <span className="text-lg font-extrabold text-[#1f757a]">
                ₹{foodSubtotal + singleDelivery}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-[#c0d4d0]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#4f504c]">
            <ShieldCheck className="w-4 h-4 text-[#1f757a]" />
            <span>Dual-thermal bag: Hot meals stay 65°C+, cold desserts stay 4°C</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleAddBothToCart}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#1f757a] hover:bg-[#15575b] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1f757a]/25 active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Duet to Cart</span>
            </button>

            <Link
              href="/cart"
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-white hover:bg-gray-50 text-[#1f757a] border border-[#1f757a] text-xs font-bold transition-all text-center"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
