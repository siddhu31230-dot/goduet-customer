'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Flame,
  Snowflake,
  Bike,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Layers
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#fafcfb] pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1f757a] via-[#1a666b] to-[#15575b] text-white py-14 sm:py-20 border-b border-[#9ec5c2]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[#c0d4d0] text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Behind The Innovation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            How GoDuet Coordinates <br />
            <span className="text-[#c0d4d0]">Two Cravings in One Delivery</span>
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Discover the smart routing, dynamic kitchen prep staggering, and dual-thermal bags that make multi-craving dining seamless and cost-effective across Hyderabad.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* The 4-Stage Lifecycle */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
              The Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
              From Your Tap to Your Table
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 'Phase 1',
                title: 'Eligible Corridor Match',
                desc: 'When you select Restaurant 1, our algorithm immediately filters partner kitchens within a strict 2.5 km synchronized corridor to ensure prompt pickup.',
                icon: '📍'
              },
              {
                step: 'Phase 2',
                title: 'Staggered Order Firing',
                desc: 'If Dum Biryani takes 20 minutes and a ThickShake takes 8 minutes, the shake ticket fires 12 minutes later. Both arrive in the pickup window simultaneously.',
                icon: '⏱️'
              },
              {
                step: 'Phase 3',
                title: 'Dual-Chamber Loading',
                desc: 'Our rider places hot containers into the active thermal insulation cavity and chilled beverages/desserts into the cold storage compartment.',
                icon: '🎒'
              },
              {
                step: 'Phase 4',
                title: 'One Coordinated Doorstep Drop',
                desc: 'One rider rings your bell. You unpack piping hot savory food and chilled dessert at the exact same moment. No waiting, no second delivery fee.',
                icon: '🛵'
              }
            ].map((p, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{p.icon}</span>
                  <span className="text-xs font-bold text-[#1f757a] bg-[#e6f1f0] px-2 py-0.5 rounded-lg">
                    {p.step}
                  </span>
                </div>
                <h3 className="font-bold text-base text-gray-900">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dual Thermal Bag Visual Breakdown */}
        <div className="bg-[#e3edea] p-8 sm:p-12 rounded-3xl border border-[#c0d4d0]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
                Proprietary Equipment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1f757a]">
                GoDuet Dual-Thermal Delivery Bags
              </h2>
              <p className="text-xs sm:text-sm text-[#4f504c] leading-relaxed">
                Conventional delivery bags only carry one temperature profile. When hot food and cold beverages are placed together, cold drinks melt and food gets lukewarm. GoDuet solved this with an engineered partition wall.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start gap-3">
                  <Flame className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">Thermal Hot Chamber (65°C - 75°C)</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Multi-ply heat-reflective foil and basalt insulation ensures freshly-dummed biryanis, crispy dosas, and wood-fired pizzas stay oven-fresh.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start gap-3">
                  <Snowflake className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">Cryo-Cold Chamber (2°C - 5°C)</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      PCM cold gel packs protect cold-pressed juices, thick shakes, french macarons and tiramisu from melting in Hyderabad heat.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md text-center space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                    <Flame className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <span className="font-black text-2xl text-amber-900 block">68°C</span>
                    <span className="text-xs text-amber-700 font-semibold">Biryani & Hot Meals</span>
                  </div>
                  <div className="bg-sky-50 p-6 rounded-2xl border border-sky-200">
                    <Snowflake className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                    <span className="font-black text-2xl text-sky-900 block">4°C</span>
                    <span className="text-xs text-sky-700 font-semibold">Shakes & Desserts</span>
                  </div>
                </div>

                <div className="p-3 bg-[#e6f1f0] rounded-xl text-xs font-semibold text-[#1f757a]">
                  Separated by a 35mm Aerospace-grade vacuum barrier
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Single Fee Savings Calculator */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
              Transparent Economics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
              Zero Hidden Charges. Maximum Value.
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              No inflated delivery fees or phantom surcharges.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Restaurant A Food Items:</span>
              <span className="font-bold text-gray-900">Exact Menu Price</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Restaurant B Food Items:</span>
              <span className="font-bold text-gray-900">Exact Menu Price</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 text-emerald-700 font-bold">
              <span>GoDuet Single Coordinated Delivery Fee:</span>
              <span>₹39 (vs ₹85+ on other apps)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Platform Convenience Fee:</span>
              <span className="font-bold text-gray-900">₹5</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Government GST & Taxes:</span>
              <span className="font-bold text-gray-900">5% Standard Food GST</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-black text-[#1f757a]">
              <span>Customer Savings Per Duet:</span>
              <span>₹50 to ₹70 Saved Every Single Time</span>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/duet-builder"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#1f757a] text-white text-xs font-bold hover:bg-[#15575b] transition-all shadow-md shadow-[#1f757a]/20"
            >
              <span>Try a Duet Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
