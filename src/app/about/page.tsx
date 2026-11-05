'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Send,
  Sparkles,
  Users
} from 'lucide-react';

export default function AboutPage() {
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setFormSent(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1f757a] via-[#1a666b] to-[#15575b] text-white py-14 sm:py-20 border-b border-[#9ec5c2]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[#c0d4d0] text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Our Story & Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Redefining Food Delivery <br />
            <span className="text-[#c0d4d0]">in Hyderabad</span>
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Born out of the everyday dinner argument: "I want biryani, but they want pizza and waffles!" GoDuet makes it possible to combine both cravings into one single coordinated delivery.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* Brand Mission & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
              The GoDuet Vision
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
              More Choice. Smarter Orders. Better Value.
            </h2>
            <p className="text-xs sm:text-sm text-[#4f504c] leading-relaxed">
              Traditional food delivery platforms force households, couples, and hostel roommates to compromise on one restaurant, or place two completely separate orders—paying double delivery charges, double platform fees, and waiting for two different drivers.
            </p>
            <p className="text-xs sm:text-sm text-[#4f504c] leading-relaxed">
              GoDuet was engineered in Cyberabad with an intelligent corridor-routing engine. We synchronize kitchen prep times, equip our delivery partners with dual-thermal insulated chambers (keeping hot food hot at 65°C+ and cold items chilled at 4°C), and pass significant savings directly back to customers.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#e3edea] text-[#1f757a]">
                <span className="block text-xl font-black">50%</span>
                <span className="text-[11px] font-semibold text-[#4f504c]">Less rider vehicle trips per paired order</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#e3edea] text-[#1f757a]">
                <span className="block text-xl font-black">₹60+</span>
                <span className="text-[11px] font-semibold text-[#4f504c]">Average customer savings per duet</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#c0d4d0] bg-white p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#c0d4d0] flex-shrink-0">
                  <Image src="/goduet-logo.png" alt="GoDuet Brand" fill sizes="64px" className="object-cover" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#1f757a]">GODUET</h3>
                  <p className="text-xs font-bold text-[#4f504c]">Two Cravings. One Delivery.</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Hyderabad, Telangana, India</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified FSSAI Food Safety License: 13624011000492</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dual-Thermal Bag certification standards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Cold-Pressed GoDuet Fresh organic farm partner network</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1f757a]">
                Get In Touch
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
                Hyderabad Customer Support
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Have a question about an order, restaurant partnership, or student campus program? Reach out to our local team.
              </p>

              <div className="space-y-3 pt-2 text-xs text-gray-600">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#1f757a] flex-shrink-0" />
                  <span>GoDuet Technologies Pvt Ltd, 4th Floor, Cyber Gateway, Hitec City, Hyderabad 500081</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#1f757a] flex-shrink-0" />
                  <span>+91 40 4892 2026 (Daily 8:00 AM – 3:00 AM)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#1f757a] flex-shrink-0" />
                  <span>support@goduet.in / partners@goduet.in</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {formSent ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-gray-900 text-base">Message Sent Successfully!</h4>
                  <p className="text-xs text-gray-600">
                    Our Hyderabad support team will reply within 30 minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Siddharth Rao"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email / Phone</label>
                      <input
                        type="text"
                        placeholder="name@email.com or +91..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      placeholder="How can our Hyderabad support team help you today?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#1f757a] hover:bg-[#15575b] text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Support</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
