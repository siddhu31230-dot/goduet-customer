'use client';

import React, { Suspense } from 'react';
import InteractiveDuetStudio from '@/components/InteractiveDuetStudio';
import { Sparkles, ShieldCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function DuetBuilderContent() {
  return (
    <div className="min-h-screen bg-[#fafcfb] py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f757a]/10 text-[#1f757a] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Duet Builder</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
            Design Your 2-Kitchen Order
          </h1>
          <p className="text-xs sm:text-sm text-[#4f504c]">
            Combine your savory meal and sweet dessert or beverage into a single, coordinated delivery with zero duplicate fees.
          </p>
        </div>

        {/* The Studio */}
        <InteractiveDuetStudio />

        {/* Coordinated Tech Explainer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-2">
            <span className="text-2xl">🔥 + ❄️</span>
            <h4 className="font-bold text-sm text-gray-900">Dual-Thermal Isolation</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our riders use custom-engineered multi-chamber insulated bags. Hot biryanis and chilled shakes travel side-by-side without temperature transfer.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-2">
            <span className="text-2xl">⏱️</span>
            <h4 className="font-bold text-sm text-gray-900">Dynamic Kitchen Stagger</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              If Restaurant A takes 20 mins to cook and Restaurant B takes 8 mins, GoDuet automatically staggers order firing so both finish together.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-2">
            <span className="text-2xl">💰</span>
            <h4 className="font-bold text-sm text-gray-900">Single Delivery Pricing</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Instead of paying ₹80–₹100 on two separate delivery apps, you pay one transparent single fee starting at just ₹39 (or free on offers).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DuetBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center text-xs text-gray-500">Loading Duet Studio...</div>}>
      <DuetBuilderContent />
    </Suspense>
  );
}
