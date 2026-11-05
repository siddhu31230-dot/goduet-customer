'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { Order, UserAddress, OrderTimelineStep } from '@/types';
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  Lock,
  Plus
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, restaurantA, restaurantB, isDuetOrder, bill, clearCart, deliveryNotes, appliedCoupon } = useCart();
  const { currentLocation } = useLocation();
  const { user, isLoggedIn, createOrder } = useAuth();

  // Selected address state
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses[0]?.id || 'addr-default'
  );

  // Custom address fields if needed
  const [flatNo, setFlatNo] = useState(user?.addresses[0]?.flatNo || 'Flat 402, Royal Residency');
  const [landmark, setLandmark] = useState(user?.addresses[0]?.landmark || 'Near Mindspace Cyber Hub');
  const [phone, setPhone] = useState(user?.phone || '+91 98490 12345');
  const [name, setName] = useState(user?.name || 'Siddharth Rao');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit/Debit Card' | 'Netbanking' | 'Cash on Delivery'>('UPI');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafcfb] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-950 mb-2">Cart is empty</h2>
        <p className="text-xs text-gray-500 mb-4">Please add items to cart before proceeding to checkout.</p>
        <Link href="/restaurants" className="px-5 py-2.5 rounded-xl bg-[#1f757a] text-white text-xs font-bold">
          Explore Restaurants
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const now = new Date();
    const etaMinutes = isDuetOrder ? 34 : 26;
    const etaTime = new Date(now.getTime() + etaMinutes * 60000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const timeline: OrderTimelineStep[] = [
      {
        title: 'Order Confirmed',
        subtitle: isDuetOrder ? 'Orders sent simultaneously to both kitchens' : 'Order sent to restaurant kitchen',
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        restaurantSlot: 'Both'
      },
      {
        title: 'Kitchen Preparation & Staggering',
        subtitle: isDuetOrder
          ? `${restaurantA?.name} & ${restaurantB?.name} are cooking with synchronized timers`
          : `${restaurantA?.name || 'Kitchen'} is preparing your fresh meal`,
        timestamp: 'Simultaneous prep in progress',
        status: 'current',
        restaurantSlot: 'Both'
      },
      {
        title: 'GoDuet Rider Assigned',
        subtitle: 'Kalyan Varma with dual-temperature thermal delivery bag',
        timestamp: 'Estimated in 8 mins',
        status: 'upcoming'
      },
      {
        title: 'Pickup from Kitchens',
        subtitle: isDuetOrder ? 'Stop 1 -> Stop 2 (Corridor transit buffer: 4 mins)' : 'Pickup and quality thermal seal check',
        timestamp: 'Estimated in 18 mins',
        status: 'upcoming'
      },
      {
        title: 'Doorstep Delivery',
        subtitle: `Arrival at ${currentLocation.name} by ${etaTime}`,
        timestamp: etaTime,
        status: 'upcoming'
      }
    ];

    const currentAddress: UserAddress = {
      id: selectedAddressId,
      type: 'Home',
      flatNo,
      landmark,
      locality: currentLocation.name,
      city: 'Hyderabad',
      pincode: currentLocation.pincode,
      isDefault: true
    };

    const newOrder: Order = {
      id: `HYD-DUET-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: now.toISOString(),
      deliveryEtaMinutes: etaMinutes,
      deliveryEtaTime: etaTime,
      status: 'confirmed',
      isDuetOrder,
      restaurantA: restaurantA ? {
        id: restaurantA.id,
        name: restaurantA.name,
        locality: restaurantA.locality,
        prepStatus: 'in_kitchen'
      } : undefined,
      restaurantB: restaurantB ? {
        id: restaurantB.id,
        name: restaurantB.name,
        locality: restaurantB.locality,
        prepStatus: 'in_kitchen'
      } : undefined,
      items: [...items],
      deliveryAddress: currentAddress,
      deliveryRider: {
        name: 'Kalyan Varma',
        phone: '+91 98491 55210',
        rating: 4.9,
        vehicleNumber: 'TS 09 EU 4482',
        hasDualThermalBag: true
      },
      bill: {
        subtotalA: bill.subtotalA,
        subtotalB: bill.subtotalB,
        freshSubtotal: bill.freshSubtotal,
        foodSubtotal: bill.foodSubtotal,
        singleCoordinatedDeliveryFee: bill.singleDeliveryFee,
        traditionalSplitDeliveryFee: bill.traditionalTwoDeliveryFee,
        savingsOnDelivery: bill.savingsOnDelivery,
        packagingFee: bill.packagingFee,
        platformFee: bill.platformFee,
        gstAndRestaurantCharges: bill.gstAndCharges,
        couponDiscount: bill.couponDiscount,
        tip: bill.tip,
        finalTotal: bill.finalTotal,
        couponApplied: appliedCoupon || undefined
      },
      paymentMethod,
      paymentStatus: 'paid',
      timeline
    };

    // Save order
    setTimeout(() => {
      createOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      router.push(`/order-confirmation/${newOrder.id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] py-8 sm:py-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
            Secure Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
            Delivery & Payment
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Address & Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1f757a] text-white flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-950">Delivery Address</h3>
                    <p className="text-[11px] text-gray-500">{currentLocation.name}, Hyderabad</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Standard 30-35 min corridor
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Receiver Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Receiver Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  House / Flat / Hostel Room / Block
                </label>
                <input
                  type="text"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  placeholder="e.g. Room 304, Bakul Nivas Hostel or Flat 201, Green Meadows"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Street / Landmark & Hyderabad Locality
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Cyber Towers / DLF Gate 2"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                  required
                />
              </div>

              {deliveryNotes && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
                  <strong>Notes for Rider:</strong> {deliveryNotes}
                </div>
              )}
            </div>

            {/* Payment Options Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1f757a] text-white flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-950">Payment Method</h3>
                    <p className="text-[11px] text-gray-500">100% Encrypted & Instant Payment</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">UPI / CARDS / COD</span>
              </div>

              <div className="space-y-3">
                {/* Option 1: UPI */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#1f757a] bg-[#e6f1f0]/60 ring-1 ring-[#1f757a]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-[#1f757a]" />
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">UPI Instant Payment</span>
                        <span className="text-[11px] text-gray-500">Google Pay, PhonePe, Paytm, Cred</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Zero Surcharge
                    </span>
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="mt-4 pt-3 border-t border-[#c0d4d0]/60 grid grid-cols-4 gap-2">
                      {[
                        { id: 'gpay', label: 'Google Pay' },
                        { id: 'phonepe', label: 'PhonePe' },
                        { id: 'paytm', label: 'Paytm' },
                        { id: 'cred', label: 'CRED UPI' }
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setUpiApp(app.id as any)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                            upiApp === app.id
                              ? 'bg-[#1f757a] text-white shadow-2xs'
                              : 'bg-white border border-gray-200 text-gray-700'
                          }`}
                        >
                          {app.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Option 2: Cards */}
                <div
                  onClick={() => setPaymentMethod('Credit/Debit Card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Credit/Debit Card'
                      ? 'border-[#1f757a] bg-[#e6f1f0]/60 ring-1 ring-[#1f757a]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-[#1f757a]" />
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">Credit or Debit Card</span>
                        <span className="text-[11px] text-gray-500">Visa, Mastercard, RuPay, Amex</span>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'Credit/Debit Card' && (
                    <div className="mt-3 pt-3 border-t border-[#c0d4d0]/60 space-y-2">
                      <input
                        type="text"
                        placeholder="Card Number (Demo: 4532 •••• •••• 8821)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                        defaultValue="4532 8920 1144 8821"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                          defaultValue="08/28"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          maxLength={3}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                          defaultValue="782"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 3: COD */}
                <div
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#1f757a] bg-[#e6f1f0]/60 ring-1 ring-[#1f757a]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-[#1f757a]" />
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">Cash on Delivery</span>
                        <span className="text-[11px] text-gray-500">Pay cash or scan QR when rider arrives</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-extrabold text-sm text-gray-950 pb-2 border-b border-gray-100">
                Order Summary ({items.length} items)
              </h3>

              {isDuetOrder && (
                <div className="p-3 bg-[#e6f1f0] rounded-xl text-[#1f757a] font-semibold text-[11px] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Two-Kitchen Duet: Synchronized single delivery</span>
                </div>
              )}

              {/* Items List preview */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="truncate max-w-[200px] text-gray-700">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Food Subtotal</span>
                  <span>₹{bill.foodSubtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Single Coordinated Delivery</span>
                  <span>{bill.singleDeliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${bill.singleDeliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Packaging & Charges</span>
                  <span>₹{bill.packagingFee + bill.platformFee + bill.gstAndCharges}</span>
                </div>
                {bill.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
                    <span>- ₹{bill.couponDiscount}</span>
                  </div>
                )}
                {bill.tip > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Partner Tip</span>
                    <span>₹{bill.tip}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between text-base font-extrabold text-gray-950">
                  <span>Total Amount</span>
                  <span className="text-2xl font-black text-[#1f757a]">₹{bill.finalTotal}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-[#1f757a] hover:bg-[#15575b] disabled:opacity-60 text-white font-extrabold text-sm transition-all shadow-md shadow-[#1f757a]/25 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Synchronizing Kitchens & Placing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order (Pay ₹{bill.finalTotal})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1f757a]" />
                <span>GoDuet Hyderabad • Live GPS Tracking Included</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
