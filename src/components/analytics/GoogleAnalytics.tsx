'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId: string;
}

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'consent',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: Record<string, any>[];
  }
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Only run in production or when explicitly enabled
    if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_GA_DEBUG) {
      console.log('Google Analytics disabled in development mode');
      return;
    }

    // Initialize dataLayer if it doesn't exist
    if (typeof window !== 'undefined' && !window.dataLayer) {
      window.dataLayer = [];
    }
  }, []);

  // Don't render in development unless debug is enabled
  if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_GA_DEBUG) {
    return null;
  }

  return (
    <>
      {/* Google Analytics script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}

// Analytics helper functions
export const analytics = {
  // Track page views
  pageview: (url: string, title?: string) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_title: title || document.title,
      page_location: url,
    });
  },

  // Track events
  event: (action: string, parameters?: Record<string, any>) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('event', action, {
      event_category: parameters?.category || 'general',
      event_label: parameters?.label,
      value: parameters?.value,
      ...parameters,
    });
  },

  // Track form submissions
  formSubmit: (formName: string, formId?: string) => {
    analytics.event('form_submit', {
      category: 'engagement',
      label: formName,
      form_id: formId,
    });
  },

  // Track signup events
  signup: (method: string = 'email') => {
    analytics.event('sign_up', {
      method,
      category: 'user',
    });
  },

  // Track login events
  login: (method: string = 'email') => {
    analytics.event('login', {
      method,
      category: 'user',
    });
  },

  // Track subscription events
  subscribe: (plan: string, value?: number) => {
    analytics.event('purchase', {
      category: 'ecommerce',
      currency: 'USD',
      value: value || 0,
      item_name: plan,
    });
  },

  // Track form creation
  createForm: (formName: string) => {
    analytics.event('create_form', {
      category: 'engagement',
      label: formName,
    });
  },

  // Track dashboard views
  viewDashboard: () => {
    analytics.event('view_dashboard', {
      category: 'engagement',
    });
  },

  // Track pricing page views
  viewPricing: () => {
    analytics.event('view_pricing', {
      category: 'engagement',
    });
  },

  // Track button clicks
  clickButton: (buttonName: string, location?: string) => {
    analytics.event('click', {
      category: 'engagement',
      label: buttonName,
      location: location || 'unknown',
    });
  },
};

// Hook for tracking page views in Next.js
export function usePageTracking() {
  useEffect(() => {
    // Track initial page load
    analytics.pageview(window.location.href);

    // Track navigation changes (for client-side routing)
    const handleRouteChange = () => {
      analytics.pageview(window.location.href);
    };

    // Listen for popstate events (back/forward button)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
} 