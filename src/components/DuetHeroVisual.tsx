'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Clock, CheckCircle2, Flame, Snowflake } from 'lucide-react';

export default function DuetHeroVisual() {
  const [selectedPair, setSelectedPair] = useState<'biryani_shake' | 'pizza_waffle' | 'dosa_sweets'>('biryani_shake');

  const pairs = {
    biryani_shake: {
      dishA: 'Bawarchi Mutton Dum Biryani',
      restA: 'Bawarchi Heritage',
      imgA: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
      priceA: '₹389',
      tagA: 'Hot Dish (68°C)',
      dishB: 'Belgian Chocolate Super ThickShake',
      restB: 'The ThickShake Factory',
      imgB: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80',
      priceB: '₹219',
      tagB: 'Chilled (4°C)',
      eta: '32 mins',
      savings: 'Saved ₹60 delivery fee'
    },
    pizza_waffle: {
      dishA: 'Truffle & Wild Mushroom Pizza',
      restA: 'Little Italy Wood-Fired',
      imgA: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
      priceA: '₹495',
      tagA: 'Oven-Hot (70°C)',
      dishB: 'Triple Dark Chocolate Waffle',
      restB: 'The Belgian Waffle Co.',
      imgB: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80',
      priceB: '₹180',
      tagB: 'Warm Crisp',
      eta: '28 mins',
      savings: 'Saved ₹60 delivery fee'
    },
    dosa_sweets: {
      dishA: 'Babai Hotel Ghee Butter Dosa',
      restA: 'Chutneys Heritage',
      imgA: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
      priceA: '₹210',
      tagA: 'Crispy Hot',
      dishB: 'Original Almond Bisticks & Bellam Jalebi',
      restB: 'Almond House',
      imgB: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
      priceB: '₹295',
      tagB: 'Fresh Confection',
      eta: '26 mins',
      savings: 'Saved ₹55 delivery fee'
    }
  };

  const current = pairs[selectedPair];

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Decorative background glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#c0d4d0]/60 via-[#1f757a]/15 to-[#c0d4d0]/60 rounded-3xl blur-2xl -z-10" />

      {/* Main Container Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#c0d4d0]/70">
        {/* Top Header Selector */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
              Live Duet Pairing Demo
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#e6f1f0] px-2.5 py-1 rounded-xl text-xs font-bold text-[#1f757a]">
            <Clock className="w-3.5 h-3.5" />
            <span>ETA: {current.eta}</span>
          </div>
        </div>

        {/* Pair Switcher Chips */}
        <div className="grid grid-cols-3 gap-2 mt-4 mb-6">
          <button
            onClick={() => setSelectedPair('biryani_shake')}
            className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all ${
              selectedPair === 'biryani_shake'
                ? 'bg-[#1f757a] text-white shadow-md shadow-[#1f757a]/20'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Biryani + Shake
          </button>
          <button
            onClick={() => setSelectedPair('pizza_waffle')}
            className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all ${
              selectedPair === 'pizza_waffle'
                ? 'bg-[#1f757a] text-white shadow-md shadow-[#1f757a]/20'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Pizza + Waffle
          </button>
          <button
            onClick={() => setSelectedPair('dosa_sweets')}
            className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all ${
              selectedPair === 'dosa_sweets'
                ? 'bg-[#1f757a] text-white shadow-md shadow-[#1f757a]/20'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Dosa + Sweets
          </button>
        </div>

        {/* The Two Restaurant Visual Cards & Animated Flow */}
        <div className="relative">
          {/* Connecting SVG Curves */}
          <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-24 pointer-events-none z-10">
            <svg className="w-full h-full" viewBox="0 0 400 100" fill="none">
              <path
                d="M 120 20 C 180 20, 180 80, 200 80"
                stroke="#1f757a"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-[dash_20s_linear_infinite]"
              />
              <path
                d="M 280 20 C 220 20, 220 80, 200 80"
                stroke="#1f757a"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-0">
            {/* Restaurant A Card */}
            <div className="bg-[#fafcfb] rounded-2xl p-3.5 border border-gray-200/90 hover:border-[#1f757a]/40 transition-all shadow-xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#1f757a] text-white uppercase tracking-wider">
                  Restaurant A
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Flame className="w-3 h-3" />
                  {current.tagA}
                </span>
              </div>

              <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5">
                <Image
                  src={current.imgA}
                  alt={current.dishA}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>

              <h4 className="font-bold text-gray-900 text-xs truncate">{current.dishA}</h4>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-gray-500 text-[11px] truncate max-w-[130px]">{current.restA}</span>
                <span className="font-extrabold text-[#1f757a]">{current.priceA}</span>
              </div>
            </div>

            {/* Restaurant B Card */}
            <div className="bg-[#fafcfb] rounded-2xl p-3.5 border border-gray-200/90 hover:border-[#1f757a]/40 transition-all shadow-xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#4f504c] text-white uppercase tracking-wider">
                  Restaurant B
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                  <Snowflake className="w-3 h-3" />
                  {current.tagB}
                </span>
              </div>

              <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5">
                <Image
                  src={current.imgB}
                  alt={current.dishB}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>

              <h4 className="font-bold text-gray-900 text-xs truncate">{current.dishB}</h4>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-gray-500 text-[11px] truncate max-w-[130px]">{current.restB}</span>
                <span className="font-extrabold text-[#1f757a]">{current.priceB}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Central Coordinated Delivery Outcome Box */}
        <div className="mt-5 bg-gradient-to-r from-[#e3edea] via-white to-[#e3edea] rounded-2xl p-4 border border-[#c0d4d0] shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#1f757a] text-white flex items-center justify-center shadow-md flex-shrink-0">
                <Sparkles className="w-6 h-6 text-[#c0d4d0]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#1f757a] uppercase tracking-wide">
                    GoDuet Single Coordinated Delivery
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-[#4f504c] font-medium">
                  Dual-Thermal Bag • 1 Rider • {current.savings}
                </p>
              </div>
            </div>

            <Link
              href="/duet-builder"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1f757a] hover:bg-[#15575b] text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>Build This Duet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom guarantee badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1f757a]" />
          <span>Prep-sync verified: Both orders arrive steaming hot & ice cold simultaneously</span>
        </div>
      </div>
    </div>
  );
}
