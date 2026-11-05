'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  GraduationCap,
  MapPin,
  Clock,
  ShieldCheck,
  Plus,
  ShoppingBag,
  ArrowRight,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoggedIn, logout, openAuthModal, orders } = useAuth();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newFlat, setNewFlat] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newLocality, setNewLocality] = useState('Hitec City');

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-[#fafcfb] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#e3edea] text-[#1f757a] flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-950">Customer Sign In Required</h2>
        <p className="text-xs text-gray-500 max-w-sm">
          Please sign in to view your profile, manage saved Hyderabad addresses, and check active student perks.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-[#1f757a] text-white text-xs font-bold hover:bg-[#15575b] transition-colors"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafcfb] py-8 sm:py-14 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1f757a] text-white flex items-center justify-center text-2xl font-black shadow-md">
              {user.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-gray-950">{user.name}</h1>
                {user.student.isVerified && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e6f1f0] text-[#1f757a] text-[10px] font-bold flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    Student Pass
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{user.phone} • {user.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Student Status Banner */}
        {user.student.isVerified ? (
          <div className="p-5 rounded-3xl bg-[#e3edea] border border-[#c0d4d0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1f757a] text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-[#1f757a]">GoDuet Student Pass Active</h3>
                <p className="text-[11px] text-[#4f504c]">
                  {user.student.universityName} • ID: {user.student.studentId}
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-800 bg-white px-3 py-1 rounded-xl shadow-2xs">
              15% Campus Discount Enabled
            </span>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-[#fafcfb] border border-[#c0d4d0] flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-xs text-gray-900">Are you a Hyderabad College Student?</h3>
              <p className="text-[11px] text-gray-500">Verify your student ID for 15% off and zero delivery charge.</p>
            </div>
            <Link
              href="/student"
              className="px-4 py-2 rounded-xl bg-[#1f757a] text-white text-xs font-bold hover:bg-[#15575b] transition-colors"
            >
              Verify Now
            </Link>
          </div>
        )}

        {/* Saved Addresses */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1f757a]" />
              <h3 className="font-bold text-sm text-gray-950">Saved Delivery Addresses</h3>
            </div>
            <span className="text-xs text-gray-400">{user.addresses.length} saved</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl border border-gray-100 bg-[#fafcfb] flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-900">{addr.type}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{addr.flatNo}, {addr.landmark}</p>
                  <p className="text-[11px] text-gray-400">{addr.locality}, Hyderabad - {addr.pincode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders History */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#1f757a]" />
              <h3 className="font-bold text-sm text-gray-950">Your Past Orders</h3>
            </div>
            <span className="text-xs text-gray-400">{orders.length} orders</span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">Order #{o.id}</span>
                      {o.isDuetOrder && (
                        <span className="text-[10px] font-extrabold text-[#1f757a] bg-[#e6f1f0] px-2 py-0.5 rounded">
                          Duet Order
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate max-w-md">
                      {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Delivered to {o.deliveryAddress.locality} • Total: ₹{o.bill.finalTotal}
                    </p>
                  </div>

                  <Link
                    href={`/order-confirmation/${o.id}`}
                    className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-[#1f757a] text-[#1f757a] text-xs font-bold transition-all text-center"
                  >
                    Track / View Invoice
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-400 space-y-2">
              <p>No past orders yet.</p>
              <Link href="/duet-builder" className="inline-block text-[#1f757a] font-bold hover:underline">
                Start your first Duet order →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
