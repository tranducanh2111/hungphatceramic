import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },

  /**
   * Required for Three.js / @react-three/* ESM packages to transpile
   * correctly through the webpack bundler.
   */
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  poweredByHeader: false,
};

export default nextConfig;