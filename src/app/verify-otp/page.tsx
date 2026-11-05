'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import BrandLogo from '@/components/BrandLogo';
import { ShieldCheck, ArrowRight, RotateCcw, Edit2, AlertCircle } from 'lucide-react';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '+91 98490 12345';
  const mode = searchParams.get('mode') || 'login'; // 'login' | 'reset'
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const { verifyOtp, sendOtp } = useAuth();
  const toast = useToast();

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    setErrorMsg(null);
    const sanitized = value.replace(/[^0-9]/g, '');

    if (!sanitized) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    // Single digit input
    const char = sanitized.slice(-1);
    const updated = [...otpDigits];
    updated[index] = char;
    setOtpDigits(updated);

    // Auto advance
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;

    const updated = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setOtpDigits(updated);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of the verification code');
      return;
    }

    setIsLoading(true);
    const res = await verifyOtp(phone, fullOtp);
    setIsLoading(false);

    if (res.success) {
      toast.success('Mobile verification successful!');
      if (mode === 'reset') {
        router.push('/reset-password');
      } else {
        router.push(redirectUrl);
      }
    } else {
      setErrorMsg(res.message || 'Invalid or expired OTP code');
      toast.error(res.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setErrorMsg(null);
    setIsLoading(true);

    const res = await sendOtp(phone);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.otp ? `New OTP: ${res.otp}` : 'New OTP dispatched to your phone');
      setTimer(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      setErrorMsg(res.message || 'Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafcfb] dark:bg-[#0d1413] px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-[#141e1d] rounded-3xl p-8 sm:p-10 shadow-xl border border-[#C3DCD7]/60 dark:border-[#244644] space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] dark:text-[#22a2a7] mb-1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <BrandLogo size="sm" className="justify-center" />
          <h1 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Verify Mobile Number
          </h1>
          <p className="text-xs sm:text-sm text-[#555653] dark:text-[#a8b2b0]">
            Enter the 6-digit verification code sent via SMS to
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-[#162422] text-xs font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-[#244644]">
            <span>{phone}</span>
            <Link
              href="/login"
              className="text-[#197F83] dark:text-[#22a2a7] hover:underline flex items-center gap-1"
              title="Change phone number"
            >
              <Edit2 className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          {/* 6 Digit Input Group */}
          <div className="flex justify-between gap-2 sm:gap-2.5">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                aria-label={`OTP digit ${idx + 1}`}
                className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl bg-gray-50 dark:bg-[#0d1413] border-2 border-gray-300 dark:border-[#244644] text-gray-950 dark:text-white focus:bg-white dark:focus:bg-[#141e1d] focus:border-[#197F83] focus:ring-2 focus:ring-[#197F83]/20 focus:outline-hidden transition-all shadow-xs"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#555653] dark:text-[#a8b2b0]">
              {canResend ? (
                "Didn't receive code?"
              ) : (
                <>Resend code in <strong className="text-gray-900 dark:text-white">0:{timer < 10 ? `0${timer}` : timer}</strong></>
              )}
            </span>

            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className="font-bold text-[#197F83] dark:text-[#22a2a7] hover:underline disabled:opacity-40 disabled:hover:no-underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resend OTP</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || otpDigits.join('').length < 6}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#197F83] hover:bg-[#125e61] text-white text-sm font-bold shadow-lg shadow-[#197F83]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafcfb]"><div className="w-8 h-8 border-3 border-[#197F83] border-t-transparent rounded-full animate-spin" /></div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
