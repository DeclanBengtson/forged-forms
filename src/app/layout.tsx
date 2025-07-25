import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ForgedForms - Handle Form Submissions Without Backend Code",
  description: "A lightweight, developer-friendly service that handles form submissions from any static or client-rendered website. No server setup required.",
  keywords: ["forms", "form handling", "no backend", "static sites", "form submissions", "developer tools", "API", "webhook", "contact forms", "serverless", "JAMstack"],
  authors: [{ name: "ForgedForms Team" }],
  creator: "ForgedForms Team",
  publisher: "ForgedForms",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/ForgedForms.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/ForgedForms.png', // For iOS devices  
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: "ForgedForms - Handle Form Submissions Without Backend Code",
    description: "A lightweight, developer-friendly service that handles form submissions from any static or client-rendered website. No server setup required.",
    type: "website",
    siteName: "ForgedForms",
    locale: "en_US",
    images: [
      {
        url: '/ForgedForms.png',
        width: 1200,
        height: 630,
        alt: 'ForgedForms - Form handling service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "ForgedForms - Handle Form Submissions Without Backend Code",
    description: "A lightweight, developer-friendly service that handles form submissions from any static or client-rendered website. No server setup required.",
    images: ['/ForgedForms.png'],
    creator: '@ForgedForms',
    site: '@ForgedForms',
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: '/',
  },
  category: 'Technology',
  classification: 'Developer Tools',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'ForgedForms',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ForgedForms",
    "description": "A lightweight, developer-friendly service that handles form submissions from any static or client-rendered website. No server setup required.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ForgedForms Team"
    }
  };

  // Get Google Analytics measurement ID from environment
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
