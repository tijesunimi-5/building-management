import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { BRAND_CONFIG } from '../utils/brandConfig';

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.companyName} — Professional Property Care Platform`,
  description: `${BRAND_CONFIG.tagline} ${BRAND_CONFIG.subTagline}`,
  keywords: ['property maintenance', 'home repair', 'property management', 'toronto property care', 'technician portal'],
  authors: [{ name: BRAND_CONFIG.companyName }],
  icons: { icon: '/favicon.ico', apple: '/favicon.ico' },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: BRAND_CONFIG.shortName
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
