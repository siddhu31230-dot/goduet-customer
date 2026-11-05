'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import BrandLogo from '@/components/BrandLogo';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

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

function ResetPasswordContent() {
  const router = useRouter();
  const toast = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const strength = calculatePasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsDone(true);
      toast.success('Your password has been reset successfully!');
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafcfb] dark:bg-[#0d1413] px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-[#141e1d] rounded-3xl p-8 sm:p-10 shadow-xl border border-[#C3DCD7]/60 dark:border-[#244644] space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-[#e8f4f3] dark:bg-[#182c2b] text-[#197F83] dark:text-[#22a2a7] mb-1">
            <Lock className="w-8 h-8" />
          </div>
          <BrandLogo size="sm" className="justify-center" />
          <h1 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Create New Password
          </h1>
          <p className="text-xs sm:text-sm text-[#555653] dark:text-[#a8b2b0]">
            Set a strong, unique password to keep your GoDuet account safe.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isDone ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-[#ebf7ef] dark:bg-[#14281c] border border-[#2D8A4E]/30 text-xs text-[#2D8A4E] space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-[#2D8A4E]" />
              <p className="font-bold text-sm">Password Updated!</p>
              <p className="text-[#555653] dark:text-[#a8b2b0]">
                You can now sign in to GoDuet with your new credentials.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-2xl bg-[#197F83] text-white text-sm font-bold shadow-md shadow-[#197F83]/20"
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="reset-pass" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="reset-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white dark:bg-[#0d1413] border border-gray-300 dark:border-[#244644] text-sm font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#197F83] transition-all"
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
                    <span>Strength: <strong>{strength.label}</strong></span>
                    <span>Use symbols, numbers & caps</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="reset-confirm" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="reset-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
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
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafcfb]"><div className="w-8 h-8 border-3 border-[#197F83] border-t-transparent rounded-full animate-spin" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
