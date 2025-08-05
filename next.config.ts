import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React Strict Mode in development to prevent double execution
  reactStrictMode: false,
  
  // Enable experimental features for better error handling
  experimental: {
    // Enable better error overlay
    forceSwcTransforms: true,
  },
  
  // Custom webpack config for better error handling
  webpack: (config, { dev }) => {
    if (dev) {
      // In development, don't fail on warnings
      config.stats = 'errors-only';
    }
    return config;
  },
};

export default nextConfig;
