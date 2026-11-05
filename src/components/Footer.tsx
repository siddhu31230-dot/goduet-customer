'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Heart,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { HYDERABAD_LOCATIONS, CUISINES_LIST } from '@/data/mockData';

export default function Footer() {
  return (
    <footer className="bg-[#1f757a] text-white pt-16 pb-12 border-t border-[#15575b] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0d4d0]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#15575b]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/15">
          {/* Column 1: Brand & Official Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#c0d4d0] border border-white/30 flex-shrink-0">
                <Image
                  src="/goduet-logo.png"
                  alt="Official GoDuet Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-[0.16em] uppercase text-white font-sans">
                  GODUET
                </h3>
                <p className="text-xs font-semibold text-[#c0d4d0] tracking-wide">
                  Two Cravings. One Delivery.
                </p>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              Hyderabad’s premier food-tech and fresh-commerce network. Combining two of your favorite restaurants into a single, synchronized delivery with temperature-controlled thermal isolation and zero duplicate delivery charges.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-semibold text-[#c0d4d0]">Connect with us:</span>
              <div className="flex items-center gap-2">
                {/* Instagram SVG */}
                <a href="#instagram" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* X / Twitter SVG */}
                <a href="#twitter" aria-label="X Twitter" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* LinkedIn SVG */}
                <a href="#linkedin" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#c0d4d0]">
              Explore GoDuet
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/restaurants" className="hover:text-white transition-colors">
                  Discover Restaurants
                </Link>
              </li>
              <li>
                <Link href="/duet-builder" className="hover:text-white font-semibold text-white flex items-center gap-1.5 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-[#c0d4d0]" />
                  Two-Restaurant Duet Builder
                </Link>
              </li>
              <li>
                <Link href="/fresh" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  GoDuet Fresh Marketplace
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#c0d4d0]" />
                  Student Pass & Campus Deals
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How Kitchen-Sync Works
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-white transition-colors">
                  Offers & Coupon Codes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Hyderabad Cuisines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#c0d4d0]">
              Food Categories
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              {CUISINES_LIST.slice(0, 6).map((c) => (
                <li key={c.name}>
                  <Link href={`/restaurants?cuisine=${encodeURIComponent(c.name)}`} className="hover:text-white transition-colors">
                    {c.icon} {c.name} ({c.count}+)
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Hyderabad Hub */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#c0d4d0]">
              Hyderabad Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c0d4d0] flex-shrink-0 mt-0.5" />
                <span>GoDuet Technologies Pvt Ltd, 4th Floor, Cyber Gateway, Hitec City, Hyderabad 500081</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c0d4d0] flex-shrink-0" />
                <span>+91 40 4892 2026 (Hyd Support)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c0d4d0] flex-shrink-0" />
                <span>support@goduet.in</span>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-semibold text-[#c0d4d0]">
                  <ShieldCheck className="w-3.5 h-3.5" /> FSSAI Lic. 13624011000492
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hyderabad Locations Served Bar */}
        <div className="py-6 border-b border-white/10 text-xs text-white/70">
          <p className="font-bold text-white mb-2 text-[11px] uppercase tracking-wider">
            Delivering across Hyderabad:
          </p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {HYDERABAD_LOCATIONS.map((loc, idx) => (
              <span key={loc.id} className="hover:text-white transition-colors cursor-pointer">
                {loc.name} {idx < HYDERABAD_LOCATIONS.length - 1 ? '•' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>© 2026 GODUET Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-white transition-colors">Restaurant Partner Sign Up</Link>
          </div>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-[#e06d53] fill-current" /> for food lovers in Hyderabad
          </p>
        </div>
      </div>
    </footer>
  );
}
