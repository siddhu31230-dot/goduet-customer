'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { X, ShieldCheck, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, verifyStudent } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup' | 'student'>(authModalMode);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [name, setName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  // Student verification inputs
  const [university, setUniversity] = useState('IIIT Hyderabad');
  const [studentId, setStudentId] = useState('');
  const [studentSubmitted, setStudentSubmitted] = useState(false);

  // Sync modal mode from auth context when opened
  React.useEffect(() => {
    setTab(authModalMode);
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    login(phoneOrEmail, name);
    setOtpSent(false);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyStudent(university, studentId || 'HYD-STU-2024');
    setStudentSubmitted(true);
    setTimeout(() => {
      closeAuthModal();
      setStudentSubmitted(false);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#c0d4d0]/60 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-500 flex items-center justify-center transition-colors shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Branding Section with Official Logo */}
        <div className="bg-[#c0d4d0] px-6 pt-7 pb-5 text-center flex flex-col items-center relative overflow-hidden border-b border-[#9ec5c2]/40">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white mb-2 bg-[#c0d4d0]">
            <Image
              src="/goduet-logo.png"
              alt="Official GoDuet Logo"
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </div>
          <h3 className="text-xl font-bold tracking-[0.14em] text-[#1f757a] uppercase">
            GODUET
          </h3>
          <p className="text-xs font-semibold text-[#4f504c]">
            Two Cravings. One Delivery.
          </p>

          {/* Quick Tabs */}
          <div className="mt-4 flex bg-white/60 p-1 rounded-2xl w-full border border-white/80">
            <button
              onClick={() => { setTab('login'); setOtpSent(false); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                tab === 'login' ? 'bg-[#1f757a] text-white shadow-xs' : 'text-[#4f504c] hover:text-[#1f757a]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setOtpSent(false); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                tab === 'signup' ? 'bg-[#1f757a] text-white shadow-xs' : 'text-[#4f504c] hover:text-[#1f757a]'
              }`}
            >
              New Account
            </button>
            <button
              onClick={() => setTab('student')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
                tab === 'student' ? 'bg-[#1f757a] text-white shadow-xs' : 'text-[#4f504c] hover:text-[#1f757a]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Student
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {tab === 'student' ? (
            <div>
              {studentSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">Student Pass Verified!</h4>
                  <p className="text-xs text-gray-600">
                    Your 15% student perk has been activated across all Hyderabad restaurants and GoDuet Fresh!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <div className="bg-[#e6f1f0] p-3 rounded-2xl flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-[#1f757a] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#1f757a]">Hyderabad Student Benefit</p>
                      <p className="text-[11px] text-[#4f504c]">
                        Get flat 15% off and zero delivery charge to college hostels.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Select Institution</label>
                    <select
                      value={university}
                      onChange={e => setUniversity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a] bg-gray-50"
                    >
                      <option value="IIIT Hyderabad (Gachibowli)">IIIT Hyderabad (Gachibowli)</option>
                      <option value="University of Hyderabad (HCU)">University of Hyderabad (HCU)</option>
                      <option value="BITS Pilani Hyderabad Campus">BITS Pilani Hyderabad Campus</option>
                      <option value="Indian School of Business (ISB)">ISB Hyderabad</option>
                      <option value="Osmania University">Osmania University</option>
                      <option value="Mahindra University">Mahindra University</option>
                      <option value="JNTU Hyderabad">JNTU Hyderabad</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Student Roll / ID Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 2023CSB104"
                      value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1f757a] text-white font-bold text-xs hover:bg-[#15575b] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1f757a]/20"
                  >
                    Activate Student Pass
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {tab === 'signup' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Siddharth Rao"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number or Email
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98490 XXXXX or name@email.com"
                      value={phoneOrEmail}
                      onChange={e => setPhoneOrEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1f757a] text-white font-bold text-xs hover:bg-[#15575b] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1f757a]/20"
                  >
                    Continue with OTP
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        login('aditya.v@students.iiit.ac.in', 'Aditya Varma');
                      }}
                      className="text-xs font-semibold text-[#1f757a] hover:underline"
                    >
                      Quick Demo: Login as Verified Student
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      Enter the 4-digit verification code sent to <span className="font-semibold text-gray-900">{phoneOrEmail}</span>
                    </p>
                    <p className="text-[11px] text-[#1f757a] font-medium mt-0.5">(Demo OTP: 4321)</p>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="• • • •"
                      maxLength={4}
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full py-3 text-center text-lg font-bold tracking-[0.5em] rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1f757a] text-white font-bold text-xs hover:bg-[#15575b] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1f757a]/20"
                  >
                    Verify & Enter GoDuet
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                    <button type="button" onClick={() => setOtpSent(false)} className="hover:underline">
                      Change number
                    </button>
                    <button type="button" onClick={() => alert('New OTP sent!')} className="text-[#1f757a] font-medium hover:underline">
                      Resend OTP
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1f757a]" />
            <span>Encrypted customer authentication • GoDuet Hyderabad</span>
          </div>
        </div>
      </div>
    </div>
  );
}
