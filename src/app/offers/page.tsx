'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Copy, Check, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function OffersPage() {
  const { applyCoupon } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const offers = [
    {
      code: 'DUETFIRST',
      title: 'Flat ₹100 OFF on First 2-Kitchen Order',
      description: 'Valid for new Hyderabad customers on any duet combination above ₹399.',
      minOrder: '₹399',
      tag: 'New User Special'
    },
    {
      code: 'STUDENT15',
      title: 'Flat 15% Campus Discount',
      description: 'Exclusive for college students across Hyderabad (IIIT-H, UoH, BITS, ISB, Osmania).',
      minOrder: '₹199',
      tag: 'Student Verified',
      isStudent: true
    },
    {
      code: 'HYDDUET',
      title: 'Zero Delivery Fee on Orders Above ₹499',
      description: 'Enjoy free single-rider delivery on all duet orders across Cyberabad & Central Hyderabad.',
      minOrder: '₹499',
      tag: 'Free Delivery'
    },
    {
      code: 'NIGHTDUET',
      title: 'Late Night Craving Pass (11 PM - 3 AM)',
      description: '₹50 OFF on late night biryani + shake combinations delivered to your hostel or apartment.',
      minOrder: '₹299',
      tag: 'Night Owl'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] py-8 sm:py-14 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f757a]/10 text-[#1f757a] text-xs font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>GoDuet Hyderabad Promos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Exclusive Offers & Coupon Codes
          </h1>
          <p className="text-xs sm:text-sm text-[#4f504c]">
            Apply coupons at checkout or copy directly. Save more on every paired dining order.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.code}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs hover:border-[#1f757a] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1f757a] bg-[#e6f1f0] px-2.5 py-1 rounded-full flex items-center gap-1">
                    {offer.isStudent && <GraduationCap className="w-3 h-3" />}
                    {offer.tag}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Min: {offer.minOrder}</span>
                </div>

                <h3 className="text-base font-bold text-gray-950">{offer.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{offer.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="border border-dashed border-[#1f757a] px-3 py-1.5 rounded-xl bg-[#fafcfb] font-mono font-bold text-xs text-[#1f757a] tracking-wider">
                  {offer.code}
                </div>

                <button
                  onClick={() => handleCopy(offer.code)}
                  className="px-4 py-2 rounded-xl bg-[#1f757a] hover:bg-[#15575b] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied to Cart!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy & Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#e3edea] p-6 sm:p-8 rounded-3xl border border-[#c0d4d0] text-center space-y-3">
          <h3 className="font-extrabold text-base text-[#1f757a]">Are you a Hyderabad College Student?</h3>
          <p className="text-xs text-[#4f504c] max-w-lg mx-auto">
            Get unlimited 15% discounts, late-night campus hostel delivery, and free delivery on orders above ₹299 by verifying your student email.
          </p>
          <Link
            href="/student"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1f757a] text-white text-xs font-bold hover:bg-[#15575b] transition-all"
          >
            <span>Go to Student Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
