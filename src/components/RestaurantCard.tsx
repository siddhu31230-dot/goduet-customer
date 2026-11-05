'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Restaurant } from '@/types';
import { Star, Clock, MapPin, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { RESTAURANTS_DATA } from '@/data/mockData';

interface RestaurantCardProps {
  restaurant: Restaurant;
  priority?: boolean;
}

export default function RestaurantCard({ restaurant, priority = false }: RestaurantCardProps) {
  // Find names of paired partners
  const partnerNames = restaurant.duetPartners
    .map(pId => RESTAURANTS_DATA.find(r => r.id === pId)?.name?.split(' ')[0])
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div className="group bg-white rounded-3xl border border-gray-200/80 hover:border-[#1f757a]/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Top Banner / Image Area */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Badges on Top */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {restaurant.isDuetEligible && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f757a] text-white text-[11px] font-bold shadow-md shadow-black/20">
              <Sparkles className="w-3 h-3 text-[#c0d4d0]" />
              Duet Ready
            </span>
          )}

          {restaurant.isPureVeg && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
              Pure Veg
            </span>
          )}
        </div>

        {/* Bottom image metadata */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-white/90 text-gray-900 px-2 py-0.5 rounded-lg text-xs font-bold shadow-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {restaurant.rating}
              <span className="text-[10px] text-gray-500 font-normal">({restaurant.ratingCount.toLocaleString()})</span>
            </span>

            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs text-white px-2 py-0.5 rounded-lg text-xs font-medium">
              <Clock className="w-3 h-3 text-white/80" />
              {restaurant.deliveryTimeMins} mins
            </span>
          </div>

          <span className="text-xs font-semibold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-lg">
            {restaurant.distanceKm} km
          </span>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#1f757a] transition-colors line-clamp-1">
                {restaurant.name}
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="truncate">{restaurant.locality}</span>
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              ₹{restaurant.costForTwo} for two
            </span>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-gray-600 mt-2 font-medium line-clamp-1">
            {restaurant.cuisines.join(' • ')}
          </p>

          {/* Duet Partner Preview Pill */}
          {restaurant.isDuetEligible && partnerNames.length > 0 && (
            <div className="mt-3 p-2 rounded-xl bg-[#e6f1f0] border border-[#c0d4d0]/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[11px] text-[#1f757a] font-medium truncate">
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-[#1f757a]" />
                <span className="truncate">Pairs with: <strong>{partnerNames.join(', ')}</strong></span>
              </div>
              <span className="text-[10px] uppercase font-extrabold text-[#1f757a] flex-shrink-0 bg-white px-1.5 py-0.5 rounded-md shadow-2xs">
                Sync
              </span>
            </div>
          )}

          {/* Offer Banner */}
          {restaurant.featuredOffer && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#e06d53] font-semibold bg-rose-50 px-2.5 py-1 rounded-lg">
              <Tag className="w-3 h-3" />
              <span className="truncate">{restaurant.featuredOffer}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
          <Link
            href={`/restaurant/${restaurant.id}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#fafcfb] hover:bg-[#e6f1f0] text-[#1f757a] border border-gray-200 hover:border-[#1f757a] text-xs font-bold transition-all text-center"
          >
            Explore Menu
          </Link>
          <Link
            href={`/duet-builder?restA=${restaurant.id}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#1f757a] hover:bg-[#15575b] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
          >
            <span>Start Duet</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
