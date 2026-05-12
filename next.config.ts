import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Image optimization — allow known external image domains.
   * Add domains as the project grows (e.g., CMS, CDN).
   */
  images: {
    formats: ["image/avif", "image/webp"],
  },

  /**
   * Powered-by header removed for security — hides the tech stack.
   */
  poweredByHeader: false,
};

export default nextConfig;