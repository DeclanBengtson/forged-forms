import type { NextConfig } from "next";

// Security headers configuration
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
  child-src 'none';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  media-src 'none';
  connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co;
  font-src 'self';
  frame-src https://js.stripe.com https://hooks.stripe.com;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['recharts', 'react-hot-toast'],
  },

  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          ...securityHeaders,
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
        ],
      },
    ];
  },

  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirect configuration
  async redirects() {
    return [
      // Redirect HTTP to HTTPS in production
      ...(process.env.NODE_ENV === 'production' ? [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http',
            },
          ],
          destination: 'https://yourdomain.com/:path*',
          permanent: true,
        },
      ] : []),
    ];
  },

  // Webpack configuration for better bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },

  // Image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  // Compression
  compress: true,

  // Power by header removal
  poweredByHeader: false,

  // Trailing slash configuration
  trailingSlash: false,
};

export default nextConfig;
