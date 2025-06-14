import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@fituno/types', '@fituno/utils', '@fituno/services', '@fituno/constants'],
    typedRoutes: true,
  },
  
  // Enable strict mode for React
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  
  // Build optimization
  poweredByHeader: false,
  compress: true,
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Transpile shared packages
  transpilePackages: ['@fituno/types', '@fituno/utils', '@fituno/services', '@fituno/constants'],
};

export default nextConfig;
