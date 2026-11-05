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
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles
} from 'lucide-react';

function calculatePasswordStrength(pass: string): { score: number; label: string; color: string } {
  if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
  let score = 0;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
  if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
  return { score: 4, label: 'Strong', color: 'bg-[#197F83]' };
}

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const { registerUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [city] = useState('Hyderabad');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!agreeTerms) {
      setErrorMsg('Please accept the Terms of Service and Privacy Policy to continue');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    const formattedPhone = cleanPhone.startsWith('91') && cleanPhone.length === 12
      ? `+${cleanPhone}`
      : `+91 ${cleanPhone.slice(-10)}`;

    const res = await registerUser(name, email, formattedPhone, password);
    setIsLoading(false);

    if (res.success) {
      toast.success('Account created successfully! Welcome to GoDuet.');
      router.push(redirectUrl);
    } else {
      setErrorMsg(res.message || 'Registration failed. Please check your details.');
      toast.error(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#fafcfb] dark:bg-[#0d1413]">
      {/* LEFT COLUMN: Brand Showcase */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-[#197F83] via-[#125e61] to-[#0c3e40] text-white p-12 flex-col justify-between overflow-hidden">
        {/* Glow shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#C3DCD7]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
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

        {/* Hero Perks */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-[#C3DCD7] border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Join 15,000+ Hyderabad Foodies</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
            Double the Taste. <br />
            <span className="text-[#C3DCD7] underline decoration-[#C3DCD7]/40 decoration-wavy">
              Zero Double Fees.
            </span>
          </h2>

          <p className="text-sm text-teal-50/80 leading-relaxed max-w-md">
            Create your account to unlock Hyderabad’s first coordinated multi-restaurant delivery, express fresh juices, and exclusive campus dining perks.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 text-xs text-teal-100">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C3DCD7]" />
              </div>
              <div>
                <strong className="block text-white">Smart Restaurant Pairing</strong>
                Combine biryani, momos, thickshakes, or cakes into 1 delivery box.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-teal-100">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C3DCD7]" />
              </div>
              <div>
                <strong className="block text-white">Direct Farm & Kitchen Fresh</strong>
                Cold-pressed juices & organic sprouts pressed and harvested on demand.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-teal-100">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C3DCD7]" />
              </div>
              <div>
                <strong className="block text-white">IIIT, ISB, HCU Student Discount</strong>
                15% off automatically applied on all campus food orders.
              </div>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-teal-100/70">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C3DCD7]" />
            PostgreSQL RLS Protected & Verified
          </span>
          <span>Hyderabad, IN</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Sign-Up Form */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-10">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center justify-between">
            <BrandLogo size="md" />
            <Link href="/" className="text-xs font-semibold text-[#197F83] hover:underline">
              Back to Home
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-[#555653] dark:text-[#a8b2b0]">
              Start ordering two cravings in one delivery across Hyderabad.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditya Varma"
                  autoComplete="name"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#141e1d] border border-gray-300 dark:border-[#244644] text-sm font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#197F83] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aditya@example.com (or student .ac.in)"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#141e1d] border border-gray-300 dark:border-[#244644] text-sm font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#197F83] transition-all"
                />
              </div>
            </div>

            {/* Mobile & City Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label htmlFor="reg-phone" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-xs font-bold text-gray-500">🇮🇳 +91</span>
                  </div>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98490 12345"
                    maxLength={13}
                    autoComplete="tel"
                    required
                    className="w-full pl-16 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#141e1d] border border-gray-300 dark:border-[#244644] text-sm font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#197F83] transition-all"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="w-3.5 h-3.5 text-[#197F83]" />
                  </div>
                  <input
                    type="text"
                    value={city}
                    readOnly
                    className="w-full pl-8 pr-3 py-2.5 rounded-2xl bg-gray-100 dark:bg-[#162422] border border-gray-300 dark:border-[#244644] text-xs font-bold text-[#197F83] dark:text-[#22a2a7] cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Password with Strength Meter */}
            <div>
              <label htmlFor="reg-pass" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="reg-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl bg-white dark:bg-[#141e1d] border border-gray-300 dark:border-[#244644] text-sm font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#197F83] transition-all"
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

              {/* Password strength visual meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          strength.score >= step ? strength.color : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#555653] dark:text-[#a8b2b0]">
                    <span>Password strength: <strong>{strength.label}</strong></span>
                    <span>Use uppercase, numbers & symbols</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="reg-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#141e1d] border border-gray-300 dark:border-[#244644] text-sm font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#197F83] transition-all"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="w-4 h-4 mt-0.5 rounded text-[#197F83] focus:ring-[#197F83] border-gray-300 shrink-0"
                />
                <span className="text-xs text-[#555653] dark:text-[#a8b2b0] leading-relaxed select-none">
                  I agree to the GoDuet{' '}
                  <Link href="/about#terms" className="text-[#197F83] dark:text-[#22a2a7] underline">Terms of Service</Link>,{' '}
                  <Link href="/about#privacy" className="text-[#197F83] dark:text-[#22a2a7] underline">Privacy Policy</Link> and agree to receive transactional updates.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#197F83] hover:bg-[#125e61] text-white text-sm font-bold shadow-lg shadow-[#197F83]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create GoDuet Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login redirect */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#555653] dark:text-[#a8b2b0]">
              Already have an account?{' '}
              <Link
                href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
                className="font-bold text-[#197F83] dark:text-[#22a2a7] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafcfb]"><div className="w-8 h-8 border-3 border-[#197F83] border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
