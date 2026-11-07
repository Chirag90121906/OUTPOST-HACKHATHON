import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  outputFileTracingRoot: path.join(__dirname),
  experimental: {},
};

export default nextConfig;
