import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@types/three'],
};

export default nextConfig;
