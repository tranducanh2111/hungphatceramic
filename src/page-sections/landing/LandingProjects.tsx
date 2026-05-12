"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Text, Button } from "@/components/ui";
import { FEATURED_PROJECTS, type FeaturedProject } from "@/constants/landing";

import { useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

function ProjectCard({ project, index }: { project: FeaturedProject; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse values
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  // Map mouse position to rotation degrees (max ±8 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalized coordinates (-0.5 to 0.5)
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.2 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative overflow-hidden rounded-2xl bg-[#0E2A42] [perspective:1000px]"
    >
      {/* Container for parallax interior elements */}
      <div 
        className="relative h-full w-full transition-all duration-300 group-hover:shadow-2xl"
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
      >
        {/* Image */}
        <div className="relative h-72 overflow-hidden lg:h-80" style={{ transform: "translateZ(-20px)" }}>
          <Image
            src={project.imageUrl}
            alt={`${project.title} — luxury ceramic interior project`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/90 via-[#071A2B]/20 to-transparent" />

          {/* Year badge */}
          <span 
            className="absolute right-4 top-4 rounded-full border border-[#D4B886]/30 bg-[#071A2B]/60 px-3 py-1 font-sans text-footnote text-[#D4B886] backdrop-blur-sm"
            style={{ transform: "translateZ(40px)" }}
          >
            {project.year}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 relative z-10" style={{ transform: "translateZ(40px)" }}>
          <Text variant="body-sm" className="font-sans uppercase tracking-widest text-[#D4B886]">
            {project.location}
          </Text>
          <Text variant="h4" className="mt-2 text-[#F4F4F6]">
            {project.title}
          </Text>
          <Text variant="body-sm" className="mt-2 text-[#F4F4F6]/50">
            {project.area}
          </Text>

          <Link
            href={`/projects/${project.id}`}
            className="mt-4 inline-flex items-center gap-2 font-sans text-body-sm text-[#D4B886] transition-gap duration-300 hover:gap-3"
          >
            View Project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * LandingProjects — Portfolio preview showcasing 4 featured projects.
 */
export function LandingProjects() {
  return (
    <section className="bg-[#071A2B] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-sans text-label uppercase tracking-widest text-[#D4B886]"
            >
              Selected Projects
            </motion.span>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Text variant="display-lg" className="mt-3 text-[#F4F4F6]">
                Our Finest Work
              </Text>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button href="/projects" variant="outline" size="md">
              View All Projects
            </Button>
          </motion.div>
        </div>

        {/* Project grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {FEATURED_PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
