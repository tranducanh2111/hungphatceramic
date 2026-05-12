"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Text } from "@/components/ui";

const BRAND_STATS = [
  { value: "12+", label: "Years of Craftsmanship" },
  { value: "200+", label: "Projects Completed" },
  { value: "35+", label: "Material Collections" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const, delay },
  }),
};

/**
 * LandingBrandStatement — Identity declaration with manifesto copy and key stats.
 */
export function LandingBrandStatement() {
  return (
    <section className="relative overflow-hidden bg-[#071A2B] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* ── Left: Text ─────────────────────────────────────────────── */}
          <div>
            <motion.span
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="font-sans text-label uppercase tracking-widest text-[#D4B886]"
            >
              Our Philosophy
            </motion.span>

            <motion.div
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Text variant="display-lg" className="mt-4 text-[#F4F4F6]">
                Craftsmanship
                <br />
                <em className="font-light italic text-[#D4B886]">Over Everything</em>
              </Text>
            </motion.div>

            {/* Champagne divider */}
            <motion.div
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="my-8 h-px w-16 bg-[#D4B886]"
            />

            <motion.div
              custom={0.3}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Text variant="body-lg" className="text-[#F4F4F6]/65">
                For over a decade, Hưng Phát Ceramic has transformed empty spaces into living
                narratives. We source, design, and install premium ceramic surfaces — not as a
                finish, but as a foundation for how a space{" "}
                <em className="text-[#F4F4F6]/90 not-italic">feels</em>.
              </Text>
            </motion.div>

            {/* Stats row */}
            <motion.div
              custom={0.45}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-12 grid grid-cols-3 gap-6 border-t border-[#1A3D5C] pt-10"
            >
              {BRAND_STATS.map(({ value, label }) => (
                <div key={label}>
                  <Text variant="display-lg" className="font-serif text-[#D4B886]">
                    {value}
                  </Text>
                  <Text variant="body-sm" className="mt-1 text-[#F4F4F6]/50">
                    {label}
                  </Text>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Image ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative h-[520px] overflow-hidden rounded-2xl lg:h-[640px]"
          >
            <Image
              src="/images/brand-statement.jpg"
              alt="Artisan craftsman placing a large-format polished ceramic tile"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle champagne overlay on image edges */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-[#D4B886]/10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
