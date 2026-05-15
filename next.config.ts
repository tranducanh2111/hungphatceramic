import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    /** Matches `next/image` quality values used in the app (default 75 + custom 55). */
    qualities: [55, 75],
  },

  /**
   * Required for Three.js / @react-three/* ESM packages to transpile
   * correctly through the webpack bundler.
   */
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  poweredByHeader: false,
};

export default withNextIntl(nextConfig);