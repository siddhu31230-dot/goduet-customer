'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Users,
  Moon,
  Bike,
  Sparkles,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { STUDENT_PERKS } from '@/data/mockData';

export default function StudentPage() {
  const { user, verifyStudent, openAuthModal } = useAuth();
  const [university, setUniversity] = useState('IIIT Hyderabad (Gachibowli)');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isStudentVerified = user?.student?.isVerified;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyStudent(university, studentId || 'HYD-STU-882');
    setSubmitted(true);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const hyderabadColleges = [
    'IIIT Hyderabad (Gachibowli)',
    'University of Hyderabad (HCU)',
    'BITS Pilani Hyderabad Campus',
    'Indian School of Business (ISB)',
    'Osmania University',
    'Mahindra University',
    'JNTU Hyderabad',
    'CBIT Hyderabad',
    'VNR VJIET'
  ];

  return (
    <div className="min-h-screen bg-[#fafcfb] pb-24">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#1f757a] via-[#1a666b] to-[#15575b] text-white py-14 sm:py-20 overflow-hidden border-b border-[#9ec5c2]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[#c0d4d0] text-xs font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>GoDuet Campus Privilege Program</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Good Food. <br />
              <span className="text-[#c0d4d0]">Better Student Deals.</span>
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
              Late night exam prep, group hostel hangouts, and hungry roommates. Unlock flat 15% student discounts, zero delivery fees on orders above ₹299, and hostel room delivery till 3:00 AM!
            </p>

            {isStudentVerified ? (
              <div className="pt-2 flex items-center gap-2 bg-emerald-950/60 p-3 rounded-2xl border border-emerald-400/40 text-xs text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>
                  <strong>Student Pass Active:</strong> {user?.student?.universityName} ({user?.student?.studentId})
                </span>
              </div>
            ) : (
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="#verify-section"
                  className="px-6 py-3 rounded-xl bg-white text-[#1f757a] font-bold text-xs hover:bg-[#c0d4d0] transition-colors shadow-md"
                >
                  Verify Student ID Instantly
                </a>
                <span className="text-xs text-[#c0d4d0]">Takes 30 seconds</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Student Perks Grid */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
              Campus Exclusives
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Engineered for College Life
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STUDENT_PERKS.map((perk, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:border-[#1f757a] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#1f757a] bg-[#e6f1f0] px-2 py-0.5 rounded-lg">
                      {perk.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(perk.code)}
                      className="text-gray-400 hover:text-gray-700 text-xs flex items-center gap-1"
                      title="Copy code"
                    >
                      {copiedCode === perk.code ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3.5 h-3.5" /> Copied
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">{perk.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{perk.desc}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#1f757a] font-semibold">
                  <span>Student Verified Only</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Form Section */}
        <div id="verify-section" className="bg-[#e3edea] p-8 sm:p-12 rounded-3xl border border-[#c0d4d0] shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#1f757a] text-white flex items-center justify-center mx-auto shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1f757a]">
                Activate Your GoDuet Student Pass
              </h2>
              <p className="text-xs sm:text-sm text-[#4f504c] mt-1">
                Enter your college details to immediately enable the 15% discount across all Hyderabad restaurants and GoDuet Fresh.
              </p>
            </div>

            {submitted || isStudentVerified ? (
              <div className="bg-white p-6 rounded-2xl border border-emerald-300 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">You're Verified!</h3>
                <p className="text-xs text-gray-600">
                  Your student pass is linked to your GoDuet account. The <strong>STUDENT15</strong> discount will be automatically applied at checkout!
                </p>
                <div className="pt-2">
                  <Link
                    href="/duet-builder"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1f757a] text-white text-xs font-bold hover:bg-[#15575b] transition-all"
                  >
                    <span>Order Your Student Duet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 text-left space-y-4 shadow-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Select University / College in Hyderabad
                  </label>
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1f757a]"
                  >
                    {hyderabadColleges.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Student Roll / ID Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2023CSB104"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      College Email or Personal Email
                    </label>
                    <input
                      type="email"
                      placeholder="name@students.iiit.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#1f757a] hover:bg-[#15575b] text-white font-bold text-xs transition-all shadow-md shadow-[#1f757a]/20 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Unlock 15% Campus Pass</span>
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                  Instant automated verification for active semester students in Hyderabad.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
