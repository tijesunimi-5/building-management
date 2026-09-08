declare module '*.css';

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { BRAND_CONFIG } from '../utils/brandConfig';

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.companyName} — Professional Property Care Platform`,
  description: `${BRAND_CONFIG.tagline} ${BRAND_CONFIG.subTagline}`,
  keywords: ['property maintenance', 'home repair', 'property management', 'toronto property care', 'technician portal'],
  authors: [{ name: BRAND_CONFIG.companyName }],
  icons: { icon: '/favicon.ico' }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen relative">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
