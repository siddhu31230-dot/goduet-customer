'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FreshProductCard from '@/components/FreshProductCard';
import { FRESH_PRODUCTS_DATA } from '@/data/mockData';
import { Leaf, Sparkles, ShieldCheck, Heart, Search, CheckCircle2, Clock } from 'lucide-react';

export default function FreshPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    'All',
    'Fresh Juices',
    'Herbal Juices',
    'Sprouts',
    'Seeds',
    'Healthy Snacks',
    'Homemade Products'
  ];

  const filteredProducts = FRESH_PRODUCTS_DATA.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.benefits.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#f3f8f6] pb-24">
      {/* 1. Fresh Marketplace Hero */}
      <div className="relative bg-gradient-to-br from-[#1f757a] via-[#1a666b] to-[#124d51] text-white py-14 sm:py-20 overflow-hidden border-b border-[#9ec5c2]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0d4d0]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[#c0d4d0] text-xs font-bold">
              <Leaf className="w-3.5 h-3.5 text-emerald-300" />
              <span>GoDuet Fresh Certified Marketplace</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Pure Juices, Live Sprouts & <br />
              <span className="text-[#c0d4d0]">Local Telangana Goodness</span>
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
              Harvested and cold-pressed daily. Directly from organic farms around Hyderabad with zero additives, zero refined sugars, and 100% cold-chain temperature delivery.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#c0d4d0]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Pressed Daily at 6 AM
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Certified Organic Farms
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Eco Glass & Kraft Packs
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Search & Categories Bar */}
        <div className="bg-white p-6 rounded-3xl border border-[#c0d4d0]/70 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search juices, sprouts, seeds, or benefits (e.g. immunity, detox, protein)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-gray-200 focus:outline-none focus:border-[#1f757a] focus:ring-2 focus:ring-[#1f757a]/20"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1f757a] text-white shadow-xs'
                    : 'bg-[#fafcfb] border border-gray-200 text-gray-700 hover:bg-[#e6f1f0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Fresh Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Fresh Products' : selectedCategory} ({filteredProducts.length})
            </h2>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Chilled Dispatch Available
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <FreshProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
              <p className="text-4xl">🌱</p>
              <h3 className="font-bold text-gray-900 text-base">No fresh products matched your search</h3>
              <p className="text-xs text-gray-500">Try searching for juices, sprouts, or seeds.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="px-4 py-2 rounded-xl bg-[#1f757a] text-white text-xs font-bold"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* Quality Commitment Section */}
        <div className="bg-[#e3edea] rounded-3xl p-8 border border-[#c0d4d0] mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#1f757a] text-white flex items-center justify-center mx-auto md:mx-0">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-950">Under 6 Hours Old</h3>
            <p className="text-xs text-[#4f504c]">
              Every juice bottle and living sprout pack is batched the morning of your delivery.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#1f757a] text-white flex items-center justify-center mx-auto md:mx-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-950">Zero Chemical Preservatives</h3>
            <p className="text-xs text-[#4f504c]">
              No synthetic colors, zero high-fructose corn syrups, pure unadulterated nature.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#1f757a] text-white flex items-center justify-center mx-auto md:mx-0">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-950">Telangana Organic Farmers</h3>
            <p className="text-xs text-[#4f504c]">
              We source directly from farmer producer groups across Shamshabad, Medchal and Kompally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
