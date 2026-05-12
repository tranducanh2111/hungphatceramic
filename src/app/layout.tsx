import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

/**
 * Cormorant Garamond — Elegant serif for headings and display text.
 * Conveys timeless luxury, history, and craftsmanship.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/**
 * Jost — Clean, geometric sans-serif for body copy and UI.
 * High legibility at all sizes, modern without being cold.
 */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hùng Phát Ceramic | Luxury Interior Ceramics",
  description:
    "Premium ceramic solutions for discerning interior designers and high-end residential projects. Discover timeless craftsmanship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
