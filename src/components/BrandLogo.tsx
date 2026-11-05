'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'full' | 'symbol' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  linkToHome?: boolean;
}

export default function BrandLogo({
  variant = 'full',
  size = 'md',
  showTagline = false,
  className = '',
  linkToHome = true,
}: BrandLogoProps) {
  // Dimensions mapping
  const heightMap = {
    sm: 34,
    md: 44,
    lg: 60,
    xl: 84
  };

  const currentHeight = heightMap[size];

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {variant === 'symbol' ? (
        <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-[#c0d4d0]/25 p-1 border border-[#c0d4d0]">
          <Image
            src="/goduet-symbol.png"
            alt="GoDuet Symbol"
            width={currentHeight}
            height={currentHeight}
            className="object-contain"
            priority
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="relative flex items-center gap-2.5">
            {/* The official logo image with soft rounded container for crisp presentation */}
            <div className="relative h-11 w-11 rounded-xl overflow-hidden shadow-xs border border-[#c0d4d0]/40 flex-shrink-0 bg-[#c0d4d0]">
              <Image
                src="/goduet-logo.png"
                alt="GoDuet Official Logo"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-[0.16em] text-lg text-[#1f757a] uppercase font-sans">
                GODUET
              </span>
              <span className="text-[10px] uppercase tracking-wider font-medium text-[#4f504c]">
                Two Cravings. One Delivery.
              </span>
            </div>
          </div>

          {showTagline && (
            <p className="text-xs text-[#4f504c] mt-1 font-medium">
              Hyderabad’s First Smart Multi-Craving Food & Fresh Network
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-block transition-transform hover:scale-[1.01] active:scale-[0.99]">
        {content}
      </Link>
    );
  }

  return content;
}
