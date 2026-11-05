'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import BrandLogo from '@/components/BrandLogo';
import {
  Lock,
  Phone,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const { loginWithPassword, sendOtp } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'otp' | 'password'>('otp');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Phone OTP dispatch
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    const formattedPhone = cleanPhone.startsWith('91') && cleanPhone.length === 12
      ? `+${cleanPhone}`
      : `+91 ${cleanPhone.slice(-10)}`;

    const res = await sendOtp(formattedPhone);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.otp ? `OTP sent: ${res.otp}` : 'OTP sent to your mobile number');
      router.push(`/verify-otp?phone=${encodeURIComponent(formattedPhone)}&redirect=${encodeURIComponent(redirectUrl)}`);
    } else {
      setErrorMsg(res.message || 'Failed to dispatch OTP. Please retry.');
      toast.error(res.message || 'Failed to send OTP');
    }
  };

  // Password submission
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please fill in both email and password');
      return;
    }

    setIsLoading(true);
    const res = await loginWithPassword(email, password);
    setIsLoading(false);

    if (res.success) {
      toast.success('Welcome back to GoDuet!');
      router.push(redirectUrl);
    } else {
      setErrorMsg(res.message || 'Invalid email or password');
      toast.error(res.message || 'Login failed');
    }
  };

  const handleSocialMock = (provider: string) => {
    toast.info(`Connecting with ${provider}...`);
    setTimeout(() => {
      loginWithPassword(`${provider.toLowerCase()}@user.goduet.in`, 'SocialSecret123!');
      toast.success(`Signed in with ${provider}`);
      router.push(redirectUrl);
    }, 600);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#fafcfb] dark:bg-[#0d1413]">
      {/* LEFT COLUMN: Visual Brand Showcase (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-[#197F83] via-[#125e61] to-[#0c3e40] text-white p-12 flex-col justify-between overflow-hidden">
        {/* Soft decorative glow circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#C3DCD7]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top brand header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg">
              <Image
                src="/goduet-symbol.png"
                alt="GoDuet"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold tracking-widest text-lg block leading-none">GODUET</span>
              <span className="text-[10px] tracking-wider text-[#C3DCD7] uppercase font-semibold">
                Two Cravings. One Delivery.
              </span>
            </div>
          </Link>
        </div>

        {/* Mid Hero content */}
        <div className="relative z-10 my-auto py-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-[#C3DCD7] border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Hyderabad Food-Tech Innovation</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
            Order Biryani & Shakes in <br />
            <span className="text-[#C3DCD7] underline decoration-[#C3DCD7]/40 decoration-wavy">
              One Synchronized Delivery.
            </span>
          </h2>

          <p className="text-sm text-teal-50/80 leading-relaxed max-w-md">
            GoDuet pairs two eligible restaurants into a single insulated order with zero double delivery fees. Plus, discover GoDuet Fresh juices and organic wellness essentials.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-teal-100">
              <CheckCircle2 className="w-4 h-4 text-[#C3DCD7] shrink-0" />
              <span>Dual-thermal insulation: hot food stays hot, cold shakes stay icy</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-teal-100">
              <CheckCircle2 className="w-4 h-4 text-[#C3DCD7] shrink-0" />
              <span>Save up to ₹90 on delivery fees every multi-restaurant order</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-teal-100">
              <CheckCircle2 className="w-4 h-4 text-[#C3DCD7] shrink-0" />
              <span>15% flat student discount across Hyderabad college campuses</span>
            </div>
          </div>
        </div>

        {/* Bottom trust footer */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-teal-100/70">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C3DCD7]" />
            Bank-grade 256-bit AES encryption
          </span>
          <span>Hyderabad, IN</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Modern Clean Sign-In Form */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Mobile brand logo */}
          <div className="lg:hidden flex items-center justify-between">
            <BrandLogo size="md" />
            <Link href="/" className="text-xs font-semibold text-[#197F83] hover:underline">
              Back to Home
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
              Welcome back to GoDuet
            </h1>
            <p className="text-sm text-[#555653] dark:text-[#a8b2b0]">
              Sign in to manage your orders, dual-kitchen trackings, and student perks.
            </p>
          </div>

          {/* Tab selector: Phone OTP vs Email & Password */}
          <div className="flex rounded-2xl bg-gray-100 dark:bg-[#141e1d] p-1.5 border border-gray-200 dark:border-[#244644]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('otp');
                setErrorMsg(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'otp'
                  ? 'bg-white dark:bg-[#197F83] text-[#197F83] dark:text-white shadow-xs'
                  : 'text-[#555653] dark:text-[#a8b2b0] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#e8f4f3] dark:bg-white/20 text-[#197F83] dark:text-white font-extrabold uppercase">
                Fast
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('password');
                setErrorMsg(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-white dark:bg-[#197F83] text-[#197F83] dark:text-white shadow-xs'
                  : 'text-[#555653] dark:text-[#a8b2b0] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>
          </div>

          {/* Error alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* FORM 1: OTP Login */}
          {activeTab === 'otp' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="login-phone" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">🇮🇳 +91</span>
                  </div>
                  <input
                    id="login-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98490 12345"
                    maxLength={13}
                    autoComplete="tel"
                    required
                    className="w-full pl-16 pr-4 py-3 rounded-2xl bg-white dark:bg-[#141e1d] border border-gray-300 dark:border-[#244644] text-sm font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#197F83] focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#555653] dark:text-[#a8b2b0] mt-1.5">
                  We will send a 6-digit verification code to this number.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#197F83] hover:bg-[#125e61] text-white text-sm font-bold shadow-lg shadow-[#197F83]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORM 2: Password Login */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditya@example.com"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#141e1d] border border-gray-300 dark:border-[#244644] text-sm font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#197F83] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="login-password" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#197F83] dark:text-[#22a2a7] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white dark:bg-[#141e1d] border border-gray-300 dark:border-[#244644] text-sm font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#197F83] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#197F83] focus:ring-[#197F83] border-gray-300"
                  />
                  <span className="text-xs text-[#555653] dark:text-[#a8b2b0] select-none">
                    Remember me on this device
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#197F83] hover:bg-[#125e61] text-white text-sm font-bold shadow-lg shadow-[#197F83]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social Sign In Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#fafcfb] dark:bg-[#0d1413] px-3 text-[#555653] dark:text-[#a8b2b0] font-semibold">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialMock('Google')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white dark:bg-[#141e1d] border border-gray-300 dark:border-[#244644] hover:bg-gray-50 dark:hover:bg-[#1c2b29] text-xs font-bold text-gray-700 dark:text-gray-200 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialMock('Apple')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white dark:bg-[#141e1d] border border-gray-300 dark:border-[#244644] hover:bg-gray-50 dark:hover:bg-[#1c2b29] text-xs font-bold text-gray-700 dark:text-gray-200 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.92-1 .04-2.19.67-2.88 1.48-.59.69-1.12 1.79-.98 2.84 1.12.09 2.29-.57 2.92-1.4" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Sign Up Redirect */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#555653] dark:text-[#a8b2b0]">
              Don&apos;t have a GoDuet account yet?{' '}
              <Link
                href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
                className="font-bold text-[#197F83] dark:text-[#22a2a7] hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafcfb]"><div className="w-8 h-8 border-3 border-[#197F83] border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
