'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function BrandSplash() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if splash has already played this session
    const played = sessionStorage.getItem('goduet_splash_shown');
    if (!played) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setIsVisible(false);
          sessionStorage.setItem('goduet_splash_shown', 'true');
        }, 600);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#c0d4d0] transition-opacity duration-600 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        {/* Official Brand Logo */}
        <div className="relative w-40 h-40 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60 mb-6 bg-[#c0d4d0] p-2">
          <Image
            src="/goduet-logo.png"
            alt="GoDuet Logo"
            fill
            sizes="160px"
            className="object-cover"
            priority
          />
        </div>

        <h1 className="text-2xl font-bold tracking-[0.2em] text-[#1f757a] uppercase mb-1">
          GODUET
        </h1>
        <p className="text-sm font-semibold tracking-wide text-[#4f504c] mb-6">
          Two Cravings. One Delivery.
        </p>

        {/* Coordinated Duet Loader indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1f757a] animate-ping" />
          <span className="text-xs font-medium text-[#4f504c]">
            Synchronizing Hyderabad’s Best Kitchens...
          </span>
        </div>

        <div className="w-48 h-1 bg-white/40 rounded-full overflow-hidden mt-3">
          <div className="h-full bg-[#1f757a] rounded-full animate-[progress_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
