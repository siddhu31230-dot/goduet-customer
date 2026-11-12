import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#197F83' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1413' },
  ],
};
import { LocationProvider } from '@/context/LocationContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LocationModal from '@/components/LocationModal';
import AuthModal from '@/components/AuthModal';
import BrandSplash from '@/components/BrandSplash';
import GemmaAIAssistant from '@/components/GemmaAIAssistant';
import MobileBottomNav from '@/components/MobileBottomNav';

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
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full min-h-[100dvh] flex flex-col bg-[#fafcfb] dark:bg-[#0d1413] text-[#2c2d2b] dark:text-[#f2f5f4] selection:bg-[#C3DCD7] selection:text-[#197F83] pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <ToastProvider>
          <LocationProvider>
            <AuthProvider>
              <CartProvider>
                {/* Official Brand Splash Intro Screen */}
                <BrandSplash />

                {/* Global Modals */}
                <LocationModal />
                <AuthModal />

                {/* Main App Layout */}
                <Suspense fallback={<div className="h-20 bg-white/80 dark:bg-black/50" />}>
                  <Navbar />
                </Suspense>

                <main className="flex-1">{children}</main>

                {/* Mobile Bottom Navigation */}
                <Suspense fallback={null}>
                  <MobileBottomNav />
                </Suspense>

                {/* Gemma 4 AI Concierge */}
                <GemmaAIAssistant />

                <Footer />
              </CartProvider>
            </AuthProvider>
          </LocationProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
