'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Check,
  AlertCircle,
  MapPin,
  Utensils
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    restaurantA,
    restaurantB,
    isDuetOrder,
    bill,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    tip,
    setTip,
    needCutlery,
    setNeedCutlery,
    deliveryNotes,
    setDeliveryNotes
  } = useCart();

  const { currentLocation, openLocationModal } = useLocation();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    setTimeout(() => setCouponFeedback(null), 4000);
  };

  const handleApplyPreset = (code: string) => {
    setCouponInput(code);
    const res = applyCoupon(code);
    setCouponFeedback(res);
    setTimeout(() => setCouponFeedback(null), 4000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafcfb] py-20">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-[#e3edea] text-[#1f757a] flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-950">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Discover delicious meals in Hyderabad or build a two-restaurant Duet order with synchronized delivery!
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/duet-builder"
              className="px-6 py-3 rounded-2xl bg-[#1f757a] text-white font-bold text-xs hover:bg-[#15575b] transition-all shadow-xs"
            >
              Build a Duet Order
            </Link>
            <Link
              href="/restaurants"
              className="px-6 py-3 rounded-2xl bg-white border border-[#c0d4d0] text-[#1f757a] font-bold text-xs hover:bg-gray-50 transition-all"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Items split by restaurant
  const itemsA = items.filter(i => !i.isFreshItem && i.restaurantId === restaurantA?.id);
  const itemsB = items.filter(i => !i.isFreshItem && i.restaurantId === restaurantB?.id);
  const freshItems = items.filter(i => i.isFreshItem);

  return (
    <div className="min-h-screen bg-[#fafcfb] py-8 sm:py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
                Shopping Cart
              </span>
              {isDuetOrder && (
                <span className="flex items-center gap-1 text-[11px] font-extrabold text-white bg-[#1f757a] px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-[#c0d4d0]" />
                  2 Kitchens Synchronized
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
              Review Your Order
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Left Column: Items Breakdown */}
          <div className="lg:col-span-7 space-y-6">
            {/* Duet Coordinated Delivery Notification Banner */}
            {isDuetOrder ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#e3edea] to-[#e6f1f0] border border-[#c0d4d0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#1f757a] text-white flex items-center justify-center font-bold text-sm">
                    ∞
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-[#1f757a]">Duet Pairing Active</h4>
                    <p className="text-[11px] text-[#4f504c]">
                      {restaurantA?.name} + {restaurantB?.name} arriving together in 1 thermal bag.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-white px-2.5 py-1 rounded-xl shadow-2xs">
                  Saved ₹{bill.savingsOnDelivery} Delivery
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-amber-900">Ordering from 1 restaurant so far</p>
                  <p className="text-amber-700 text-[11px]">
                    You can pair items from a compatible sweet/beverage kitchen with NO extra delivery cost!
                  </p>
                </div>
                <Link
                  href="/duet-builder"
                  className="px-3 py-1.5 rounded-xl bg-[#1f757a] text-white font-bold text-xs hover:bg-[#15575b] whitespace-nowrap"
                >
                  + Add Duet Partner
                </Link>
              </div>
            )}

            {/* RESTAURANT A ITEMS */}
            {restaurantA && itemsA.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#1f757a] text-white flex items-center justify-center text-xs font-bold">
                      A
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-gray-950">{restaurantA.name}</h3>
                      <p className="text-[10px] text-gray-400">{restaurantA.locality}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Subtotal: ₹{bill.subtotalA}</span>
                </div>

                <div className="space-y-3">
                  {itemsA.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className={`w-3.5 h-3.5 rounded-xs border p-0.5 flex-shrink-0 ${item.type === 'veg' ? 'border-emerald-600' : 'border-red-600'}`}>
                          <span className={`block w-full h-full rounded-full ${item.type === 'veg' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                          <span className="text-[11px] text-gray-500">₹{item.price} each</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-2 py-1 gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-gray-900">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs min-w-[14px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#1f757a] hover:text-[#15575b]">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-extrabold text-gray-900 min-w-[45px] text-right">
                          ₹{item.price * item.quantity}
                        </span>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESTAURANT B ITEMS */}
            {restaurantB && itemsB.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#4f504c] text-white flex items-center justify-center text-xs font-bold">
                      B
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-gray-950">{restaurantB.name}</h3>
                      <p className="text-[10px] text-gray-400">{restaurantB.locality}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Subtotal: ₹{bill.subtotalB}</span>
                </div>

                <div className="space-y-3">
                  {itemsB.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className={`w-3.5 h-3.5 rounded-xs border p-0.5 flex-shrink-0 ${item.type === 'veg' ? 'border-emerald-600' : 'border-red-600'}`}>
                          <span className={`block w-full h-full rounded-full ${item.type === 'veg' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                          <span className="text-[11px] text-gray-500">₹{item.price} each</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-2 py-1 gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-gray-900">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs min-w-[14px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#1f757a] hover:text-[#15575b]">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-extrabold text-gray-900 min-w-[45px] text-right">
                          ₹{item.price * item.quantity}
                        </span>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GODUET FRESH ITEMS */}
            {freshItems.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-[#c0d4d0] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      🌱
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-gray-950">GoDuet Fresh Goodness</h3>
                      <p className="text-[10px] text-emerald-700">Cold-chain delivered</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Subtotal: ₹{bill.freshSubtotal}</span>
                </div>

                <div className="space-y-3">
                  {freshItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                          <span className="text-[11px] text-gray-500">₹{item.price} each</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-2 py-1 gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-gray-900">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs min-w-[14px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#1f757a] hover:text-[#15575b]">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-extrabold text-gray-900 min-w-[45px] text-right">
                          ₹{item.price * item.quantity}
                        </span>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cutlery & Delivery Instructions Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#1f757a]" />
                  <span className="font-bold text-gray-900">Include Biodegradable Cutlery</span>
                </div>
                <input
                  type="checkbox"
                  checked={needCutlery}
                  onChange={(e) => setNeedCutlery(e.target.checked)}
                  className="w-4 h-4 accent-[#1f757a] rounded"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Special Delivery Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Leave with gate security / Do not ring bell / Call when outside"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Checkout */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Location Pill */}
            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#1f757a]" />
                <div>
                  <span className="font-bold text-gray-900 block truncate max-w-[190px]">
                    {currentLocation.name}
                  </span>
                  <span className="text-[11px] text-gray-500">{currentLocation.area}</span>
                </div>
              </div>
              <button
                onClick={openLocationModal}
                className="text-xs font-bold text-[#1f757a] hover:underline"
              >
                Change
              </button>
            </div>

            {/* Coupon Code Section */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                  <Tag className="w-4 h-4 text-[#1f757a]" />
                  <span>Offers & Coupons</span>
                </div>
                {appliedCoupon && (
                  <button onClick={removeCoupon} className="text-xs text-red-600 font-semibold hover:underline">
                    Remove
                  </button>
                )}
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. DUETFIRST)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs uppercase font-mono tracking-wider rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1f757a] text-white text-xs font-bold hover:bg-[#15575b] transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponFeedback && (
                <p className={`text-xs font-medium ${couponFeedback.success ? 'text-emerald-700' : 'text-red-600'}`}>
                  {couponFeedback.message}
                </p>
              )}

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['DUETFIRST', 'STUDENT15', 'HYDDUET'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleApplyPreset(c)}
                    className="text-[11px] font-mono font-bold text-[#1f757a] bg-[#e6f1f0] hover:bg-[#d6eae8] px-2 py-0.5 rounded-md transition-colors"
                  >
                    +{c}
                  </button>
                ))}
              </div>
            </div>

            {/* Rider Tip Selector */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900">Tip Your Delivery Partner</span>
                <span className="text-[11px] text-gray-400">100% goes to rider</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 20, 30, 50].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTip(amt)}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      tip === amt
                        ? 'border-[#1f757a] bg-[#e6f1f0] text-[#1f757a]'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {amt === 0 ? 'No Tip' : `₹${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Transparent Bill Breakdown Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 text-xs">
              <h3 className="font-extrabold text-sm text-gray-950 pb-2 border-b border-gray-100">
                Transparent Bill Breakdown
              </h3>

              <div className="flex justify-between text-gray-600">
                <span>Food & Products Subtotal</span>
                <span className="font-semibold text-gray-900">₹{bill.foodSubtotal}</span>
              </div>

              {restaurantA && bill.subtotalA > 0 && (
                <div className="flex justify-between text-[11px] text-gray-400 pl-2">
                  <span>• {restaurantA.name}</span>
                  <span>₹{bill.subtotalA}</span>
                </div>
              )}

              {restaurantB && bill.subtotalB > 0 && (
                <div className="flex justify-between text-[11px] text-gray-400 pl-2">
                  <span>• {restaurantB.name}</span>
                  <span>₹{bill.subtotalB}</span>
                </div>
              )}

              {freshItems.length > 0 && (
                <div className="flex justify-between text-[11px] text-gray-400 pl-2">
                  <span>• GoDuet Fresh</span>
                  <span>₹{bill.freshSubtotal}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Single Coordinated Delivery Fee</span>
                <span className="font-semibold text-gray-900">
                  {bill.singleDeliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${bill.singleDeliveryFee}`}
                </span>
              </div>

              {isDuetOrder && bill.savingsOnDelivery > 0 && (
                <div className="flex justify-between text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl">
                  <span>Traditional 2-App Delivery Fee:</span>
                  <span><del className="text-gray-400 mr-1">₹{bill.traditionalTwoDeliveryFee}</del> Saved ₹{bill.savingsOnDelivery}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Packaging & Thermal Chamber</span>
                <span className="font-semibold text-gray-900">₹{bill.packagingFee}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Platform Fee</span>
                <span className="font-semibold text-gray-900">₹{bill.platformFee}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>GST & Restaurant Charges (5%)</span>
                <span className="font-semibold text-gray-900">₹{bill.gstAndCharges}</span>
              </div>

              {bill.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>- ₹{bill.couponDiscount}</span>
                </div>
              )}

              {bill.tip > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Partner Tip</span>
                  <span className="font-semibold text-gray-900">₹{bill.tip}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between text-sm">
                <div>
                  <span className="font-black text-base text-gray-950 block">To Pay</span>
                  <span className="text-[10px] text-gray-400">Inclusive of all taxes</span>
                </div>
                <span className="text-2xl font-black text-[#1f757a]">
                  ₹{bill.finalTotal}
                </span>
              </div>

              {/* Proceed to Checkout Button */}
              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-2xl bg-[#1f757a] hover:bg-[#15575b] text-white font-extrabold text-sm transition-all shadow-md shadow-[#1f757a]/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1f757a]" />
                <span>GoDuet Hyderabad Promise • Exact Kitchen Prices</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
