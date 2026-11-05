'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FreshProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import { Star, ShieldCheck, Plus, Check, Clock, Leaf } from 'lucide-react';

interface FreshProductCardProps {
  product: FreshProduct;
}

export default function FreshProductCard({ product }: FreshProductCardProps) {
  const { addFreshItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addFreshItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-3xl border border-[#c0d4d0]/60 hover:border-[#1f757a] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full bg-radial-to-b from-white to-[#fafcfb]">
      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden bg-[#e3edea]/40">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Fresh Category & Bestseller Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#2d8a4e] text-[10px] font-extrabold uppercase shadow-2xs">
            <Leaf className="w-3 h-3" />
            {product.category}
          </span>

          {product.seller.certifiedOrganic && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
              Organic
            </span>
          )}
        </div>

        {/* Batch Harvest Timestamp */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-medium">
            <Clock className="w-3 h-3 text-[#c0d4d0]" />
            <span>{product.harvestOrPressTime}</span>
          </div>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-semibold text-gray-500">{product.quantity}</span>
            <span className="flex items-center gap-1 text-xs font-bold text-gray-900">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {product.rating} <span className="text-[10px] text-gray-400 font-normal">({product.reviewsCount})</span>
            </span>
          </div>

          <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#1f757a] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {product.tagline}
          </p>

          {/* Key Health Benefits */}
          <div className="mt-3 flex flex-wrap gap-1">
            {product.benefits.slice(0, 2).map((benefit, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#e3edea]/60 text-[#1f757a]"
              >
                ✓ {benefit}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gray-500">
            <ShieldCheck className="w-3 h-3 text-[#2d8a4e]" />
            <span className="truncate">{product.seller.name} • {product.seller.location}</span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-[#1f757a]">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block">Fresh Guarantee</span>
          </div>

          <button
            onClick={handleAdd}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#1f757a] hover:bg-[#15575b] text-white active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
