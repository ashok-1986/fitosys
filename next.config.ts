import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@types/three'],
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
    ];
  },
};

export default nextConfig;
