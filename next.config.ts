import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config, { dev, isServer }) => {
    // Optimize webpack cache
    if (!isServer) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: '.next/cache',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        compression: 'gzip',
        // Use buffer for large strings to improve deserialization performance
        serialize: (data: unknown): unknown => {
          if (typeof data === 'string' && data.length > 50 * 1024) { // 50KB threshold
            return Buffer.from(data).toString('base64');
          }
          return data;
        },
        deserialize: (data: unknown): unknown => {
          if (typeof data === 'string' && data.startsWith('data:')) {
            return Buffer.from(data.split(',')[1], 'base64').toString();
          }
          return data;
        },
      };
    }
    return config;
  },
  // Additional recommended optimizations
  compress: true,
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
