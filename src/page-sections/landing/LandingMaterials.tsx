"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Text, Button } from "@/components/ui";
import { MATERIAL_CATEGORIES, type MaterialCategory } from "@/constants/landing";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";

import { MaterialTilePreview } from "@/components/3d/MaterialTilePreview";

/** Subtle gradient per category to differentiate before real product images arrive */
const CATEGORY_GRADIENTS: Record<string, string> = {
  inspire: "from-[#1A3D5C] to-[#071A2B]",
  travertine: "from-[#3D2E1E] to-[#1A1208]",
  "orient-star": "from-[#2E2416] to-[#0E0A04]",
  sunshine: "from-[#1E2E38] to-[#071A2B]",
  architectural: "from-[#1C1C2E] to-[#090912]",
};

function MaterialCard({ category, index }: { category: MaterialCategory; index: number }) {
  const gradient = CATEGORY_GRADIENTS[category.id] ?? "from-[#0E2A42] to-[#071A2B]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
      viewport={{ once: true, amount: 0.2 }}
      className="group relative overflow-hidden rounded-2xl"
    >
      {/* Background gradient (replaced by product images later) */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />

      {/* 3D Tile Preview Component */}
      <MaterialTilePreview categoryId={category.id} />

      {/* Champagne shimmer on hover */}
      <div className="absolute inset-0 bg-[#D4B886]/0 transition-colors duration-500 group-hover:bg-[#D4B886]/5" />

      {/* Border */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-[#D4B886]/10 transition-all duration-500 group-hover:ring-[#D4B886]/30" />

      {/* Content */}
      <div className="relative z-10 flex h-56 flex-col justify-between p-7">
        <div>
          <Text variant="label" className="uppercase tracking-widest text-[#D4B886]">
            {category.sizes.join(" · ")}
          </Text>
          <Text variant="h4" className="mt-3 text-[#F4F4F6]">
            {category.name}
          </Text>
          <Text variant="body-sm" className="mt-2 text-[#F4F4F6]/55">
            {category.tagline}
          </Text>
        </div>

        <Link
          href={category.href}
          className="inline-flex items-center gap-2 font-sans text-body-sm text-[#D4B886] opacity-0 transition-all duration-300 group-hover:opacity-100"
        >
          Discover <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

/**
 * LandingMaterials — Showcase the 5 material collection categories.
 */
export function LandingMaterials() {
  return (
    <section className="bg-[#0E2A42] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-sans text-label uppercase tracking-widest text-[#D4B886]"
          >
            The Collection
          </motion.span>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Text variant="display-lg" className="mt-3 text-[#F4F4F6]">
              Surfaces That Define a Space
            </Text>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Text variant="body-lg" className="mx-auto mt-5 max-w-xl text-[#F4F4F6]/55">
              Five distinct collections. Each one curated for a different vision of luxury.
            </Text>
          </motion.div>
        </div>

        {/* 5-card grid: 3 top + 2 bottom */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIAL_CATEGORIES.slice(0, 3).map((cat, i) => (
            <MaterialCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {MATERIAL_CATEGORIES.slice(3).map((cat, i) => (
            <MaterialCard key={cat.id} category={cat} index={i + 3} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button href={ROUTES.products} variant="secondary" size="lg">
            Explore Full Collection
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
