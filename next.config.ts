import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '2000mb', // 2GB 허용
    },
  },
  // skip strict mode
  reactStrictMode: false,
  env: {
    googleAnalyticsId: process.env.NODE_ENV === "production" ? process.env.GA_MEASUREMENT_ID : "",
  }
};

export default nextConfig;
