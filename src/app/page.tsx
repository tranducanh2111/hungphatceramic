"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 sm:p-12 md:p-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl w-full flex flex-col items-center text-center gap-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Next.js App Router Ready</span>
            </div>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight"
          >
            Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Next-Gen</span>
            <br className="hidden sm:block" /> Web Experiences
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed"
          >
            Enterprise-grade foundation powered by Next.js, Tailwind CSS, and Framer Motion. Engineered for speed, designed to wow.
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-4">
            <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-50 text-slate-950 font-semibold hover:bg-slate-200 transition-colors">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-900 border border-slate-800 text-slate-50 font-semibold hover:bg-slate-800 transition-colors">
              View Documentation
            </button>
          </motion.div>

          {/* Feature Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mt-16 text-left">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
              <Zap className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-slate-400">Optimized performance out of the box with the new Next.js App Router and React Server Components.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
              <Code2 className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Clean Architecture</h3>
              <p className="text-slate-400">Structured for enterprise-grade scalability, embracing SOLID principles and DRY patterns.</p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}