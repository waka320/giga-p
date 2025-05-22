/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['...'],
  },
  // 本番ビルドの最適化
  experimental: {
    optimizeCss: true,
    optimizeServerComponents: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // キャッシュの最適化
  staticPageGenerationTimeout: 180,
  webpack: (config) => {
    config.optimization.runtimeChunk = 'single';
    return config;
  },
};

export default nextConfig;
