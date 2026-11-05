import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LocationProvider } from '@/context/LocationContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LocationModal from '@/components/LocationModal';
import AuthModal from '@/components/AuthModal';
import BrandSplash from '@/components/BrandSplash';
import GemmaAIAssistant from '@/components/GemmaAIAssistant';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://goduet.in'),
  title: 'GODUET — Two Cravings. One Delivery. | Hyderabad Food & Fresh',
  description:
    'Hyderabad’s first smart two-restaurant coordinated delivery and fresh-commerce network. Pair biryani with gourmet desserts or shakes in one single delivery with dual-thermal insulation.',
  keywords: [
    'GoDuet',
    'GoDuet Hyderabad',
    'Two Cravings One Delivery',
    'Hyderabad Food Delivery',
    'Duet Food Delivery',
    'Bawarchi Biryani',
    'ThickShake Factory',
    'Concu Hyderabad',
    'GoDuet Fresh',
    'Student Food Delivery Hyderabad'
  ],
  icons: {
    icon: '/goduet-symbol.png',
    shortcut: '/goduet-symbol.png',
    apple: '/goduet-symbol.png'
  },
  openGraph: {
    title: 'GODUET — Two Cravings. One Delivery.',
    description:
      'Discover two eligible restaurants in Hyderabad, combine your cravings, and receive a coordinated delivery in one thermal bag with zero double fees.',
    url: 'https://goduet.in',
    siteName: 'GODUET',
    images: [
      {
        url: '/goduet-logo.png',
        width: 1024,
        height: 1024,
        alt: 'GODUET Official Brand Logo'
      }
    ],
    locale: 'en_IN',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fafcfb] text-[#2d2e2c] font-sans selection:bg-[#c0d4d0] selection:text-[#1f757a]">
        <LocationProvider>
          <AuthProvider>
            <CartProvider>
              {/* Official Brand Splash Intro Screen */}
              <BrandSplash />

              {/* Global Modals */}
              <LocationModal />
              <AuthModal />

              {/* Main App Layout */}
              <Suspense fallback={<div className="h-20 bg-white/80" />}>
                <Navbar />
              </Suspense>
              <main className="flex-1">{children}</main>
              {/* Gemma 4 AI Concierge */}
              <GemmaAIAssistant />
              <Footer />
            </CartProvider>
          </AuthProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
