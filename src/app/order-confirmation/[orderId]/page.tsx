'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Bike,
  Phone,
  ShieldCheck,
  Download,
  Share2,
  Sparkles,
  Flame,
  Snowflake,
  ArrowRight
} from 'lucide-react';
import { Order } from '@/types';

function OrderConfirmationContent() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { getOrderById, activeOrder } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Fire confetti on load
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1f757a', '#c0d4d0', '#2d8a4e', '#e5a93c']
      });
    } catch {
      // ignore
    }

    const found = getOrderById(orderId) || activeOrder;
    if (found) {
      setOrder(found);
    } else {
      // Fallback demo order if visited directly
      setOrder({
        id: orderId,
        createdAt: new Date().toISOString(),
        deliveryEtaMinutes: 32,
        deliveryEtaTime: '35 mins',
        status: 'confirmed',
        isDuetOrder: true,
        restaurantA: {
          id: 'rest-bawarchi',
          name: 'Bawarchi Heritage Dum Biryani',
          locality: 'Madhapur',
          prepStatus: 'in_kitchen'
        },
        restaurantB: {
          id: 'rest-thickshake',
          name: 'The ThickShake Factory',
          locality: 'Madhapur',
          prepStatus: 'in_kitchen'
        },
        items: [
          {
            id: '1',
            menuItemId: 'bw-1',
            name: 'Hyderabadi Nizami Mutton Dum Biryani',
            price: 389,
            quantity: 1,
            type: 'non-veg',
            restaurantId: 'rest-bawarchi',
            restaurantName: 'Bawarchi Heritage'
          },
          {
            id: '2',
            menuItemId: 'ts-1',
            name: 'Belgian Chocolate Super Thick Shake',
            price: 219,
            quantity: 1,
            type: 'veg',
            restaurantId: 'rest-thickshake',
            restaurantName: 'The ThickShake Factory'
          }
        ],
        deliveryAddress: {
          id: '1',
          type: 'Home',
          flatNo: 'Room 304, Bakul Nivas',
          landmark: 'IIIT Hyderabad Campus',
          locality: 'Gachibowli',
          city: 'Hyderabad',
          pincode: '500032',
          isDefault: true
        },
        deliveryRider: {
          name: 'Kalyan Varma',
          phone: '+91 98491 55210',
          rating: 4.9,
          vehicleNumber: 'TS 09 EU 4482',
          hasDualThermalBag: true
        },
        bill: {
          subtotalA: 389,
          subtotalB: 219,
          freshSubtotal: 0,
          foodSubtotal: 608,
          singleCoordinatedDeliveryFee: 39,
          traditionalSplitDeliveryFee: 85,
          savingsOnDelivery: 46,
          packagingFee: 50,
          platformFee: 5,
          gstAndRestaurantCharges: 30,
          couponDiscount: 100,
          tip: 30,
          finalTotal: 632,
          couponApplied: 'DUETFIRST'
        },
        paymentMethod: 'UPI',
        paymentStatus: 'paid',
        timeline: [
          {
            title: 'Order Confirmed',
            subtitle: 'Orders dispatched simultaneously to both kitchens',
            timestamp: 'Just now',
            status: 'completed'
          },
          {
            title: 'Kitchen Preparation & Synchronization',
            subtitle: 'Bawarchi Heritage & ThickShake Factory timed simultaneously',
            timestamp: 'In kitchen',
            status: 'current'
          },
          {
            title: 'GoDuet Rider Assigned',
            subtitle: 'Kalyan Varma (TS 09 EU 4482) equipped with Dual-Thermal bag',
            timestamp: 'In 5 mins',
            status: 'upcoming'
          },
          {
            title: 'Pickup from Kitchen 1 & Kitchen 2',
            subtitle: 'Sequential corridor pickup (4 mins delta)',
            timestamp: 'In 18 mins',
            status: 'upcoming'
          },
          {
            title: 'One Coordinated Doorstep Delivery',
            subtitle: 'Single drop-off at your location',
            timestamp: 'In 32 mins',
            status: 'upcoming'
          }
        ]
      });
    }
  }, [orderId, getOrderById, activeOrder]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fafcfb] flex items-center justify-center p-6 text-xs text-gray-500">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafcfb] py-8 sm:py-12 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Celebratory Banner */}
        <div className="bg-gradient-to-r from-[#1f757a] via-[#1a666b] to-[#15575b] text-white p-8 sm:p-10 rounded-3xl shadow-xl text-center space-y-3 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-[#c0d4d0]" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-[#c0d4d0] text-xs font-bold uppercase tracking-wider">
            Order #{order.id} Confirmed
          </span>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Your Coordinated Duet is Underway!
          </h1>
          <p className="text-xs sm:text-sm text-white/85 max-w-lg mx-auto">
            Both kitchens have received your order tickets. One dedicated GoDuet partner will pick up both orders in our dual-thermal insulated bag.
          </p>

          <div className="pt-2 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl text-xs font-semibold">
            <Clock className="w-4 h-4 text-[#c0d4d0]" />
            <span>Estimated Delivery: <strong>{order.deliveryEtaMinutes} mins</strong> (~{order.deliveryEtaTime})</span>
          </div>
        </div>

        {/* Live Multi-Stage Tracking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Real-time Multi-Kitchen Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1f757a] text-white flex items-center justify-center text-xs font-bold">
                    ∞
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-950">Live Kitchen Synchronization</h3>
                    <p className="text-[11px] text-gray-500">Dual-restaurant dispatch status</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full animate-pulse">
                  ● Live Tracking
                </span>
              </div>

              {/* Kitchen Status Badges */}
              {order.isDuetOrder && (
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#e3edea]/60 rounded-2xl border border-[#c0d4d0]">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#1f757a] block">
                      Kitchen 1: {order.restaurantA?.name?.split(' ')[0]}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                      <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span>Cooking on Dum</span>
                    </div>
                  </div>

                  <div className="space-y-1 border-l border-[#c0d4d0] pl-3">
                    <span className="text-[10px] uppercase font-bold text-[#1f757a] block">
                      Kitchen 2: {order.restaurantB?.name?.split(' ')[0]}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                      <Snowflake className="w-3.5 h-3.5 text-sky-600" />
                      <span>Preparing & Chilling</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step by step timeline */}
              <div className="space-y-6 pl-2">
                {order.timeline.map((step, idx) => {
                  const isDone = step.status === 'completed';
                  const isCurrent = step.status === 'current';
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Vertical line connecting steps */}
                      {idx < order.timeline.length - 1 && (
                        <div
                          className={`absolute left-3.5 top-7 bottom-0 w-0.5 -ml-[1px] ${
                            isDone ? 'bg-[#1f757a]' : 'bg-gray-200'
                          }`}
                        />
                      )}

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold ${
                          isDone
                            ? 'bg-[#1f757a] text-white shadow-xs'
                            : isCurrent
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-bold text-xs ${isCurrent ? 'text-[#1f757a]' : 'text-gray-900'}`}>
                            {step.title}
                          </h4>
                          <span className="text-[10px] font-medium text-gray-400">{step.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{step.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rider Details Card */}
              {order.deliveryRider && (
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#1f757a]/10 text-[#1f757a] flex items-center justify-center font-bold text-lg">
                      <Bike className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">
                        {order.deliveryRider.name}
                        <span className="text-[10px] text-amber-600 font-bold ml-1.5">
                          ★ {order.deliveryRider.rating}
                        </span>
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        {order.deliveryRider.vehicleNumber} • Dual-Thermal Bag Verified
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${order.deliveryRider.phone}`}
                    className="p-2.5 rounded-xl bg-[#e6f1f0] text-[#1f757a] hover:bg-[#d8ecea] transition-colors"
                    title="Call Rider"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Simulated Hyderabad Map Route Preview */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900">Route Map (Hyderabad Corridor)</span>
                <span className="text-[11px] text-[#1f757a] font-semibold">Live GPS Simulation</span>
              </div>

              {/* Stylized vector map graphic */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-[#e3edea] border border-[#c0d4d0]/60 p-4 flex flex-col justify-between">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#1f757a_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="flex justify-between items-center z-10 text-xs">
                  <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs font-bold text-[10px] text-gray-800">
                    Stop 1: {order.restaurantA?.name || 'Kitchen A'}
                  </div>
                  <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs font-bold text-[10px] text-gray-800">
                    Stop 2: {order.restaurantB?.name || 'Kitchen B'}
                  </div>
                </div>

                <div className="flex justify-center z-10">
                  <div className="bg-[#1f757a] text-white px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 text-xs font-bold animate-bounce">
                    <Bike className="w-4 h-4" />
                    <span>Rider in Transit</span>
                  </div>
                </div>

                <div className="flex justify-center z-10">
                  <div className="bg-white/95 backdrop-blur-xs px-3 py-1 rounded-lg border border-gray-200 shadow-xs text-[10px] font-bold text-gray-900">
                    Your Doorstep: {order.deliveryAddress.locality} ({order.deliveryAddress.flatNo})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Tax Invoice & Order Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-extrabold text-sm text-gray-950">Order Invoice</h3>
                <button
                  onClick={() => window.print()}
                  className="text-xs text-[#1f757a] font-bold flex items-center gap-1 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
              </div>

              {/* Items in invoice */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-700 truncate max-w-[200px]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Bill charges */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Food Subtotal</span>
                  <span>₹{order.bill.foodSubtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Single Coordinated Delivery</span>
                  <span className="font-bold text-emerald-700">₹{order.bill.singleCoordinatedDeliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Packaging & Platform Fee</span>
                  <span>₹{order.bill.packagingFee + order.bill.platformFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>₹{order.bill.gstAndRestaurantCharges}</span>
                </div>
                {order.bill.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
                    <span>- ₹{order.bill.couponDiscount}</span>
                  </div>
                )}
                {order.bill.tip > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Partner Tip</span>
                    <span>₹{order.bill.tip}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-100 flex justify-between text-sm font-black text-gray-950">
                  <span>Total Paid via {order.paymentMethod}</span>
                  <span className="text-xl text-[#1f757a]">₹{order.bill.finalTotal}</span>
                </div>
              </div>

              {/* Single fee savings callout */}
              {order.bill.savingsOnDelivery > 0 && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold text-center">
                  🎉 You saved ₹{order.bill.savingsOnDelivery} by combining orders on GoDuet!
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/duet-builder"
                  className="w-full py-3 rounded-xl bg-[#1f757a] hover:bg-[#15575b] text-white text-xs font-bold text-center transition-all shadow-xs"
                >
                  Order Another Duet
                </Link>
                <Link
                  href="/"
                  className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold text-center transition-all"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-12 text-center text-xs text-gray-400">Loading order confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
