'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { RESTAURANTS_DATA, FRESH_PRODUCTS_DATA } from '@/data/mockData';
import {
  User as UserIcon,
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  GraduationCap,
  HelpCircle,
  LogOut,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  Bike,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Flame,
  Snowflake,
  FileText,
  Search,
  MessageSquare
} from 'lucide-react';

type DashboardTab = 'overview' | 'orders' | 'tracking' | 'addresses' | 'favorites' | 'student' | 'profile' | 'support';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as DashboardTab) || 'overview';

  const {
    user,
    isLoggedIn,
    logout,
    orders,
    activeOrder,
    favorites,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
    toggleFavoriteRestaurant,
    toggleFavoriteProduct,
    updateProfile,
    verifyStudent
  } = useAuth();

  const { addItem } = useCart();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  // Address modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrType, setAddrType] = useState<'Home' | 'Work' | 'Hostel' | 'Other'>('Home');
  const [flatNo, setFlatNo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [locality, setLocality] = useState('Gachibowli');
  const [pincode, setPincode] = useState('500032');

  // Profile edit states
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Student verification form
  const [university, setUniversity] = useState('IIIT Hyderabad');
  const [studentId, setStudentId] = useState('');
  const [idSubmitted, setIdSubmitted] = useState(false);

  // If not logged in, show prompt
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-[#fafcfb] dark:bg-[#0d1413] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] dark:text-[#22a2a7] flex items-center justify-center shadow-lg">
          <UserIcon className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="text-2xl font-black text-gray-950 dark:text-white">Customer Account Required</h2>
          <p className="text-xs sm:text-sm text-[#555653] dark:text-[#a8b2b0]">
            Please sign in to access your GoDuet order history, dual-kitchen live tracking, and saved Hyderabad addresses.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login?redirect=/dashboard"
            className="px-6 py-3 rounded-2xl bg-[#197F83] text-white text-xs font-bold shadow-md shadow-[#197F83]/20 hover:bg-[#125e61] transition-all"
          >
            Sign In Now
          </Link>
          <Link
            href="/register?redirect=/dashboard"
            className="px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  // Handle address submit
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNo || !locality) {
      toast.error('Please enter flat/room number and locality');
      return;
    }
    saveAddress({
      type: addrType,
      flatNo,
      landmark,
      locality,
      city: 'Hyderabad',
      pincode,
      isDefault: user.addresses.length === 0
    });
    toast.success('Address saved successfully!');
    setShowAddressModal(false);
    setFlatNo('');
    setLandmark('');
  };

  // Handle profile save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      email: editEmail,
      phone: editPhone
    });
    setIsEditingProfile(false);
    toast.success('Profile details updated');
  };

  // Handle student verification submit
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      toast.error('Please enter your university roll/ID number');
      return;
    }
    verifyStudent(university, studentId);
    setIdSubmitted(true);
    toast.success('Student pass verified! 15% discount activated.');
  };

  // Reorder helper
  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => addItem(item));
    toast.success(`Added ${order.items.length} items to your cart`);
    router.push('/cart');
  };

  // Favorite restaurants objects
  const favoriteRestaurantsList = RESTAURANTS_DATA.filter((r) =>
    favorites.restaurants.includes(r.id)
  );

  // Favorite products objects
  const favoriteProductsList = FRESH_PRODUCTS_DATA.filter((p) =>
    favorites.products.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-[#fafcfb] dark:bg-[#0d1413] py-6 sm:py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* TOP PROFILE HERO BANNER */}
        <div className="bg-white dark:bg-[#141e1d] rounded-3xl p-6 sm:p-8 border border-[#C3DCD7]/60 dark:border-[#244644] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#197F83] to-[#22a2a7] text-white flex items-center justify-center text-2xl sm:text-3xl font-black shadow-lg shadow-[#197F83]/20">
                {user.name[0]}
              </div>
              {user.student.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center shadow-xs" title="Verified Student">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
                  {user.name}
                </h1>
                {user.student.isVerified && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] dark:text-[#22a2a7] text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-1 border border-[#C3DCD7]/50">
                    <GraduationCap className="w-3 h-3" />
                    Student Pass
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  Hyderabad Prime Foodie
                </span>
              </div>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0] mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => {
                setActiveTab('profile');
                setIsEditingProfile(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#244644] text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#1c2e2c] transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => {
                logout();
                toast.info('Signed out of GoDuet');
                router.push('/');
              }}
              className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DASHBOARD NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200 dark:border-gray-800">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Order History', icon: ShoppingBag, count: orders.length },
            { id: 'tracking', label: 'Live Tracking', icon: Bike, isLive: Boolean(activeOrder) },
            { id: 'addresses', label: 'Addresses', icon: MapPin, count: user.addresses.length },
            { id: 'favorites', label: 'Favorites', icon: Heart },
            { id: 'student', label: 'Student Perks', icon: GraduationCap },
            { id: 'profile', label: 'Settings', icon: UserIcon },
            { id: 'support', label: 'Help & Concierge', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#197F83] text-white shadow-md shadow-[#197F83]/20'
                    : 'text-[#555653] dark:text-[#a8b2b0] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#141e1d]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? 'bg-white text-[#197F83]' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.isLive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Active Order Alert Card */}
            {activeOrder ? (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#197F83] to-[#125e61] text-white shadow-xl shadow-[#197F83]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-[#C3DCD7]">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span>Order In Transit • ETA: {activeOrder.deliveryEtaTime}</span>
                  </div>
                  <h3 className="text-xl font-black">
                    {activeOrder.isDuetOrder ? 'Two-Restaurant Synchronized Order' : 'Single Restaurant Order'}
                  </h3>
                  <p className="text-xs text-teal-100 max-w-lg">
                    {activeOrder.restaurantA?.name} {activeOrder.restaurantB ? `& ${activeOrder.restaurantB.name}` : ''} • Delivering to {activeOrder.deliveryAddress.locality}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('tracking')}
                  className="px-5 py-3 rounded-2xl bg-white text-[#197F83] text-xs font-black shadow-lg hover:bg-[#C3DCD7] transition-all flex items-center gap-2"
                >
                  <Bike className="w-4 h-4" />
                  <span>View Live Dual-Sync Tracking</span>
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-[#e8f4f3] dark:bg-[#182c2b] border border-[#C3DCD7] dark:border-[#244644] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#197F83] text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white">Ready for your next craving?</h3>
                    <p className="text-xs text-[#555653] dark:text-[#a8b2b0]">Pair two restaurants into one single insulated delivery in Hyderabad.</p>
                  </div>
                </div>
                <Link
                  href="/duet-builder"
                  className="px-5 py-2.5 rounded-xl bg-[#197F83] hover:bg-[#125e61] text-white text-xs font-bold shadow-md shadow-[#197F83]/20"
                >
                  Start Duet Order
                </Link>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#555653] dark:text-[#a8b2b0]">
                  Duet Orders Completed
                </span>
                <p className="text-2xl font-black text-[#197F83] dark:text-[#22a2a7]">
                  {orders.filter(o => o.isDuetOrder).length + 3}
                </p>
                <span className="text-[11px] text-gray-500">Synchronized deliveries</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#555653] dark:text-[#a8b2b0]">
                  Delivery Fees Saved
                </span>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{orders.reduce((sum, o) => sum + (o.bill.savingsOnDelivery || 60), 180)}
                </p>
                <span className="text-[11px] text-gray-500">Zero double delivery fees</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#555653] dark:text-[#a8b2b0]">
                  Hyderabad Locality
                </span>
                <p className="text-base font-bold text-gray-900 dark:text-white truncate">
                  {user.addresses[0]?.locality || 'Gachibowli'}
                </p>
                <span className="text-[11px] text-gray-500">Pincode: {user.addresses[0]?.pincode || '500032'}</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#555653] dark:text-[#a8b2b0]">
                  Student Benefit
                </span>
                <p className="text-2xl font-black text-[#197F83] dark:text-[#22a2a7]">
                  {user.student.isVerified ? '15% OFF' : 'Not Verified'}
                </p>
                <span className="text-[11px] text-gray-500">
                  {user.student.isVerified ? 'Active on all campus deliveries' : 'Verify ID to unlock'}
                </span>
              </div>
            </div>

            {/* Quick Reorder Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-gray-950 dark:text-white">
                  Popular Duet Pairings in Hyderabad
                </h3>
                <Link href="/restaurants" className="text-xs font-bold text-[#197F83] dark:text-[#22a2a7] hover:underline">
                  Browse All
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#197F83] tracking-wider">Top Hyderabad Craving</span>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      Bawarchi Mutton Dum Biryani + ThickShake Belgian Chocolate
                    </h4>
                    <p className="text-xs text-gray-500">Estimated prep & sync: 32 mins • ₹620</p>
                  </div>
                  <Link
                    href="/duet-builder?restA=rest-1&restB=rest-4"
                    className="px-4 py-2 rounded-xl bg-[#197F83] text-white text-xs font-bold hover:bg-[#125e61] shrink-0"
                  >
                    Build Pair
                  </Link>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#2D8A4E] tracking-wider">Fresh & Healthy Morning</span>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      Chutneys Guntur Idli + GoDuet Cold-Pressed ABC Glow Juice
                    </h4>
                    <p className="text-xs text-gray-500">Estimated delivery: 25 mins • ₹295</p>
                  </div>
                  <Link
                    href="/duet-builder?restA=rest-2"
                    className="px-4 py-2 rounded-xl bg-[#197F83] text-white text-xs font-bold hover:bg-[#125e61] shrink-0"
                  >
                    Build Pair
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-950 dark:text-white">Order History</h3>
                <p className="text-xs text-[#555653] dark:text-[#a8b2b0]">
                  View all your single and two-restaurant orders with receipts.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] text-center space-y-4">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700" />
                <h4 className="text-base font-bold text-gray-900 dark:text-white">No orders placed yet</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  When you order your favorite Hyderabad biryani, shakes, or GoDuet Fresh juices, they will show up here.
                </p>
                <Link
                  href="/restaurants"
                  className="inline-block px-5 py-2.5 rounded-xl bg-[#197F83] text-white text-xs font-bold"
                >
                  Explore Restaurants
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-4 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-950 dark:text-white">
                            Order #{order.id}
                          </span>
                          {order.isDuetOrder && (
                            <span className="px-2 py-0.5 rounded-md bg-[#197F83] text-white text-[9px] font-black uppercase">
                              Duet 2 Kitchens
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{order.createdAt}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-gray-950 dark:text-white">
                          ₹{order.bill.finalTotal}
                        </span>
                        <p className="text-[11px] text-emerald-600 font-semibold">
                          Saved ₹{order.bill.savingsOnDelivery} delivery fee
                        </p>
                      </div>
                    </div>

                    {/* Items breakdown */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Items Ordered:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-[#0d1413]">
                            <span className="text-gray-800 dark:text-gray-200">
                              {it.quantity}x {it.name}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              ₹{it.price * it.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-gray-500">
                        Delivered to: <strong>{order.deliveryAddress.locality}</strong>
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-4 py-2 rounded-xl bg-[#197F83] text-white text-xs font-bold hover:bg-[#125e61] transition-colors"
                        >
                          Reorder All
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE TRACKING */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-950 dark:text-white">Live Synchronized Tracking</h3>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0]">
                Watch how GoDuet’s dual-kitchen coordinator brings two restaurant orders into one insulated thermal bag.
              </p>
            </div>

            {/* Visual Tracking Map Mock */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-8 shadow-xs">
              {/* ETA Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#e8f4f3] dark:bg-[#182c2b] border border-[#C3DCD7]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#197F83] text-white flex items-center justify-center">
                    <Bike className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#197F83] dark:text-[#22a2a7] tracking-wider">
                      Delivery Partner On The Way
                    </span>
                    <h4 className="text-base font-black text-gray-950 dark:text-white">
                      Arriving in 18 minutes • 2:45 PM
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Ramesh Naidu</p>
                    <p className="text-[10px] text-gray-500">TS 09 AB 4912 • Rating 4.9 ★</p>
                  </div>
                  <a
                    href="tel:+919849000000"
                    className="p-2.5 rounded-xl bg-[#197F83] text-white hover:bg-[#125e61]"
                    title="Call Rider"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Dual Kitchen Sync Status Visual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kitchen A */}
                <div className="p-5 rounded-2xl border-2 border-[#197F83]/30 bg-teal-50/30 dark:bg-teal-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#e06d53]" />
                      <span className="text-xs font-extrabold text-gray-900 dark:text-white">
                        Kitchen 1: Bawarchi Biryani (RTC X Roads)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Packed & Picked
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#197F83] h-full w-full" />
                  </div>
                  <p className="text-[11px] text-[#555653] dark:text-[#a8b2b0]">
                    ✓ Mutton Dum Biryani stored in thermal zone 1 (Kept steaming hot at 68°C)
                  </p>
                </div>

                {/* Kitchen B */}
                <div className="p-5 rounded-2xl border-2 border-[#197F83]/30 bg-teal-50/30 dark:bg-teal-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Snowflake className="w-4 h-4 text-sky-500" />
                      <span className="text-xs font-extrabold text-gray-900 dark:text-white">
                        Kitchen 2: The ThickShake Factory (Himayatnagar)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Packed & Picked
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#197F83] h-full w-full" />
                  </div>
                  <p className="text-[11px] text-[#555653] dark:text-[#a8b2b0]">
                    ✓ Belgian Dark Chocolate Shake stored in cold chill pack zone (Chilled at 4°C)
                  </p>
                </div>
              </div>

              {/* Step Timeline */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#555653] dark:text-[#a8b2b0]">
                  Consolidated Delivery Route
                </h4>

                <div className="space-y-4 border-l-2 border-[#197F83] ml-3 pl-5">
                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-[#197F83] ring-4 ring-[#e8f4f3]" />
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white">Kitchen 1 Pickup Completed</h5>
                    <p className="text-[11px] text-gray-500">Bawarchi Biryani handoff confirmed • 2:20 PM</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-[#197F83] ring-4 ring-[#e8f4f3]" />
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white">Kitchen 2 Pickup Completed</h5>
                    <p className="text-[11px] text-gray-500">The ThickShake Factory handoff confirmed • 2:32 PM</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse" />
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white">Rider In Transit to Your Location</h5>
                    <p className="text-[11px] text-gray-500">En route to Bakul Nivas, IIIT Hyderabad Campus • ETA 18 mins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-950 dark:text-white">Saved Addresses</h3>
                <p className="text-xs text-[#555653] dark:text-[#a8b2b0]">
                  Manage delivery locations across Hyderabad.
                </p>
              </div>

              <button
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#197F83] text-white text-xs font-bold hover:bg-[#125e61] transition-all flex items-center gap-1.5 shadow-md shadow-[#197F83]/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-6 rounded-3xl bg-white dark:bg-[#141e1d] border transition-all ${
                    addr.isDefault
                      ? 'border-[#197F83] shadow-md shadow-[#197F83]/10'
                      : 'border-gray-200 dark:border-[#244644]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] dark:text-[#22a2a7] text-xs font-bold">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {!addr.isDefault && (
                        <button
                          onClick={() => {
                            setDefaultAddress(addr.id);
                            toast.success('Set as default delivery address');
                          }}
                          className="text-[10px] font-bold text-[#197F83] hover:underline p-1"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => {
                          deleteAddress(addr.id);
                          toast.info('Address removed');
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{addr.flatNo}</p>
                    {addr.landmark && <p className="text-xs text-gray-500">Landmark: {addr.landmark}</p>}
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {addr.locality}, {addr.city} — {addr.pincode}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                <div className="bg-white dark:bg-[#141e1d] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#C3DCD7] shadow-2xl space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-gray-950 dark:text-white">Add Delivery Address</h4>
                    <button
                      onClick={() => setShowAddressModal(false)}
                      className="p-1 text-gray-400 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                        Address Type
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['Home', 'Work', 'Hostel', 'Other'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setAddrType(t)}
                            className={`py-2 rounded-xl text-xs font-bold border ${
                              addrType === t
                                ? 'bg-[#197F83] text-white border-[#197F83]'
                                : 'bg-gray-50 dark:bg-[#0d1413] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                        House / Flat / Hostel Room No.
                      </label>
                      <input
                        type="text"
                        value={flatNo}
                        onChange={(e) => setFlatNo(e.target.value)}
                        placeholder="e.g. Flat 402, Lotus Heights / Room 304, Bakul Nivas"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#244644] text-xs font-medium bg-white dark:bg-[#0d1413] text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                        Landmark / Campus
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near DLF Cybercity / Main Gate"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#244644] text-xs font-medium bg-white dark:bg-[#0d1413] text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                          Locality (Hyderabad)
                        </label>
                        <select
                          value={locality}
                          onChange={(e) => setLocality(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-[#244644] text-xs font-bold bg-white dark:bg-[#0d1413] text-gray-900 dark:text-white"
                        >
                          <option>Gachibowli</option>
                          <option>Madhapur</option>
                          <option>Hitec City</option>
                          <option>Jubilee Hills</option>
                          <option>Banjara Hills</option>
                          <option>Kondapur</option>
                          <option>Kukatpally</option>
                          <option>Secunderabad</option>
                          <option>Begumpet</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          maxLength={6}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#244644] text-xs font-medium bg-white dark:bg-[#0d1413] text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-[#197F83] text-white text-xs font-bold"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-black text-gray-950 dark:text-white">Your Favorites</h3>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0]">
                Quick access to your preferred Hyderabad restaurants and fresh wellness products.
              </p>
            </div>

            {/* Favorite Restaurants */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>Saved Restaurants ({favoriteRestaurantsList.length})</span>
              </h4>

              {favoriteRestaurantsList.length === 0 ? (
                <p className="text-xs text-gray-400">No favorite restaurants saved yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteRestaurantsList.map((rest) => (
                    <div
                      key={rest.id}
                      className="p-4 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-3"
                    >
                      <div className="relative h-32 rounded-2xl overflow-hidden">
                        <Image src={rest.image} alt={rest.name} fill className="object-cover" />
                        <button
                          onClick={() => toggleFavoriteRestaurant(rest.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-500 hover:scale-110 transition-transform"
                          title="Remove from favorites"
                        >
                          <Heart className="w-4 h-4 fill-red-500" />
                        </button>
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-gray-900 dark:text-white">{rest.name}</h5>
                        <p className="text-xs text-gray-500">{rest.cuisines.join(', ')} • {rest.locality}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-emerald-600">★ {rest.rating}</span>
                        <Link
                          href={`/restaurant/${rest.id}`}
                          className="px-3 py-1.5 rounded-xl bg-[#197F83] text-white text-xs font-bold hover:bg-[#125e61]"
                        >
                          View Menu
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite Fresh Products */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2D8A4E]" />
                <span>Saved GoDuet Fresh Items ({favoriteProductsList.length})</span>
              </h4>

              {favoriteProductsList.length === 0 ? (
                <p className="text-xs text-gray-400">No fresh items saved yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteProductsList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-3"
                    >
                      <div className="relative h-32 rounded-2xl overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <button
                          onClick={() => toggleFavoriteProduct(item.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-500 hover:scale-110 transition-transform"
                          title="Remove from favorites"
                        >
                          <Heart className="w-4 h-4 fill-red-500" />
                        </button>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#2D8A4E] uppercase tracking-wider">{item.category}</span>
                        <h5 className="font-bold text-sm text-gray-900 dark:text-white">{item.name}</h5>
                        <p className="text-xs font-black text-gray-950 dark:text-white mt-0.5">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => {
                          addItem({
                            menuItemId: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: 1,
                            type: 'veg',
                            isFreshItem: true,
                            freshProductId: item.id,
                            image: item.image
                          });
                          toast.success(`Added ${item.name} to cart`);
                        }}
                        className="w-full py-2 rounded-xl bg-[#2D8A4E] text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: STUDENT PERKS */}
        {activeTab === 'student' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-lg font-black text-gray-950 dark:text-white">GoDuet Student Pass</h3>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0]">
                Exclusive 15% discount and zero delivery fee for verified students across Hyderabad colleges.
              </p>
            </div>

            {user.student.isVerified ? (
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#197F83] to-[#125e61] text-white space-y-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#C3DCD7] tracking-widest">
                        Official Verified Student
                      </span>
                      <h4 className="text-xl font-black">{user.student.universityName}</h4>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-[#197F83] text-xs font-extrabold shadow-xs">
                    ACTIVE PASS
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/20 text-xs">
                  <div>
                    <span className="text-teal-200 block text-[10px] uppercase font-semibold">Student ID / Roll No</span>
                    <strong className="text-white text-sm">{user.student.studentId || 'IIITH-2023-CS-89'}</strong>
                  </div>
                  <div>
                    <span className="text-teal-200 block text-[10px] uppercase font-semibold">Discount Tier</span>
                    <strong className="text-white text-sm">15% Auto-Applied</strong>
                  </div>
                  <div>
                    <span className="text-teal-200 block text-[10px] uppercase font-semibold">Valid Through</span>
                    <strong className="text-white text-sm">December 2026</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-xs text-teal-50 space-y-1">
                  <p className="font-bold text-[#C3DCD7]">Partnered Campuses in Hyderabad:</p>
                  <p>IIIT Hyderabad (Gachibowli), ISB Hyderabad, University of Hyderabad (HCU), BITS Pilani Hyderabad, Osmania University, JNTU Hyderabad, Mahindra University.</p>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-6 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">Verify Your Hyderabad College ID</h4>
                    <p className="text-xs text-gray-500">Instant 15% discount on all duet food orders + zero late-night delivery fees.</p>
                  </div>
                </div>

                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Select University / College
                    </label>
                    <select
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#244644] text-xs font-bold bg-white dark:bg-[#0d1413] text-gray-900 dark:text-white"
                    >
                      <option>IIIT Hyderabad (Gachibowli)</option>
                      <option>Indian School of Business (ISB)</option>
                      <option>University of Hyderabad (HCU)</option>
                      <option>BITS Pilani Hyderabad Campus</option>
                      <option>Osmania University (OU)</option>
                      <option>JNTU Hyderabad (Kukatpally)</option>
                      <option>Mahindra University (Bahadurpally)</option>
                      <option>NIFT Hyderabad</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Student Roll / ID Number
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. 2024-CS-042"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#244644] text-xs font-medium bg-white dark:bg-[#0d1413] text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#197F83] hover:bg-[#125e61] text-white text-xs font-bold shadow-md shadow-[#197F83]/20"
                  >
                    Verify Student Pass Instantly
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-lg font-black text-gray-950 dark:text-white">Account Settings</h3>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0]">
                Update your personal information and contact preferences.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-6 shadow-xs">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#244644] text-xs font-medium bg-white dark:bg-[#0d1413] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#244644] text-xs font-medium bg-white dark:bg-[#0d1413] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#244644] text-xs font-medium bg-white dark:bg-[#0d1413] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#197F83] hover:bg-[#125e61] text-white text-xs font-bold shadow-md shadow-[#197F83]/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Security</h4>
                <Link
                  href="/reset-password"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#197F83] dark:text-[#22a2a7] hover:underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: HELP & SUPPORT */}
        {activeTab === 'support' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-lg font-black text-gray-950 dark:text-white">Customer Support & Gemma Concierge</h3>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0]">
                We’re here 24/7 to help you with dual-order tracking, fresh items, and delivery coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Hyderabad Helpline</h4>
                <p className="text-xs text-gray-500">Direct phone support for orders in transit.</p>
                <a
                  href="tel:+914049008888"
                  className="inline-block text-xs font-bold text-[#197F83] hover:underline"
                >
                  +91 (040) 4900 8888
                </a>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#141e1d] border border-gray-200 dark:border-[#244644] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#ebf7ef] dark:bg-[#14281c] text-[#2D8A4E] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">WhatsApp Fast Support</h4>
                <p className="text-xs text-gray-500">Live chat updates on WhatsApp.</p>
                <a
                  href="https://wa.me/919849012345"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs font-bold text-[#2D8A4E] hover:underline"
                >
                  Chat on WhatsApp &rarr;
                </a>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#e8f4f3] dark:bg-[#182c2b] border border-[#C3DCD7] space-y-2">
              <h4 className="text-sm font-bold text-[#197F83] dark:text-[#22a2a7] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Need Personalized Food Recommendations?</span>
              </h4>
              <p className="text-xs text-[#555653] dark:text-[#a8b2b0]">
                Click the Gemma AI Concierge pill at the bottom right of the screen at any time to ask for pairing ideas, calorie counts, or spice levels!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafcfb]"><div className="w-8 h-8 border-3 border-[#197F83] border-t-transparent rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
