import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'buymeachai.ezee.li',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;