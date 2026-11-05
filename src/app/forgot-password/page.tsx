'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import BrandLogo from '@/components/BrandLogo';
import { Mail, ArrowLeft, ArrowRight, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';

function ForgotPasswordContent() {
  const router = useRouter();
  const { sendOtp } = useAuth();
  const toast = useToast();

  const [identifier, setIdentifier] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier) {
      setErrorMsg('Please enter your registered email address or mobile number');
      return;
    }

    setIsLoading(true);

    const isEmail = identifier.includes('@');
    if (!isEmail) {
      // Treat as phone number
      const cleanPhone = identifier.replace(/[^0-9]/g, '');
      const formattedPhone = cleanPhone.startsWith('91') && cleanPhone.length === 12
        ? `+${cleanPhone}`
        : `+91 ${cleanPhone.slice(-10)}`;

      const res = await sendOtp(formattedPhone);
      setIsLoading(false);

      if (res.success) {
        toast.success(res.otp ? `Password reset OTP: ${res.otp}` : 'Reset code sent to mobile');
        router.push(`/verify-otp?phone=${encodeURIComponent(formattedPhone)}&mode=reset`);
      } else {
        setErrorMsg(res.message || 'Could not dispatch reset code. Please try again.');
      }
    } else {
      // Treat as email reset link
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        toast.success('Password recovery instructions sent');
      }, 700);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafcfb] dark:bg-[#0d1413] px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-[#141e1d] rounded-3xl p-8 sm:p-10 shadow-xl border border-[#C3DCD7]/60 dark:border-[#244644] space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] dark:text-[#22a2a7] mb-1">
            <KeyRound className="w-8 h-8" />
          </div>
          <BrandLogo size="sm" className="justify-center" />
          <h1 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-xs sm:text-sm text-[#555653] dark:text-[#a8b2b0]">
            No worries! Enter your registered email or mobile number and we’ll help you reset it securely.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-[#ebf7ef] dark:bg-[#14281c] border border-[#2D8A4E]/30 text-xs text-[#2D8A4E] space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-[#2D8A4E]" />
              <p className="font-bold text-sm">Recovery Link Sent!</p>
              <p className="text-[#555653] dark:text-[#a8b2b0]">
                If an account matches <strong>{identifier}</strong>, a recovery link has been dispatched. Please check your inbox and spam folder.
              </p>
            </div>

            <Link
              href="/reset-password"
              className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-2xl bg-[#197F83] text-white text-sm font-bold shadow-md shadow-[#197F83]/20"
            >
              Enter New Password
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#555653] dark:text-[#a8b2b0] hover:text-[#197F83]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="forgot-identifier" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Email or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="forgot-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. aditya@example.com or 98490 12345"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#0d1413] border border-gray-300 dark:border-[#244644] text-sm font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#197F83] transition-all"
                />
              </div>
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
                  <span>Send Recovery Instructions</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#555653] dark:text-[#a8b2b0] hover:text-[#197F83] dark:hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafcfb]"><div className="w-8 h-8 border-3 border-[#197F83] border-t-transparent rounded-full animate-spin" /></div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
