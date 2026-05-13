"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { PRIMARY_NAV_ITEMS, COMPANY_NAME } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";

// ─── Icon Components ──────────────────────────────────────────────────────────

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" x2="20" y1="8" y2="8" />
      <line x1="4" x2="20" y1="16" y2="16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// ─── Logo Mark ────────────────────────────────────────────────────────────────

function LogoMark({ isScrolled }: { isScrolled: boolean }) {
  return (
    <Link
      href={ROUTES.home}
      aria-label={`${COMPANY_NAME} — Return to homepage`}
      className="flex items-center gap-3 shrink-0 group"
    >
      {/* Monogram diamond */}
      <div
        className={cn(
          "relative flex items-center justify-center transition-all duration-500",
          isScrolled ? "h-7 w-7" : "h-8 w-8",
        )}
      >
        <div className="absolute inset-0 rotate-45 border border-[#D4B886]/60 transition-all duration-500 group-hover:border-[#D4B886]" />
        <span className="relative font-serif text-xs font-light text-[#D4B886]">HP</span>
      </div>
      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif font-light tracking-[0.12em] text-[#F4F4F6] transition-all duration-500",
            isScrolled ? "text-[13px]" : "text-sm",
          )}
        >
          Hùng Phát
        </span>
        <span
          className={cn(
            "font-sans font-light tracking-[0.25em] text-[#D4B886] uppercase transition-all duration-500",
            isScrolled ? "text-[8px]" : "text-[9px]",
          )}
        >
          Ceramic
        </span>
      </div>
    </Link>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────

/**
 * Navbar — Premium pill-shaped navigation.
 * Starts full-width and shrinks smoothly on scroll.
 * Auto-closes mobile menu on route change.
 */
export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isTicking = useRef(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Performant scroll listener using rAF to avoid layout thrashing
  useEffect(() => {
    const handleScroll = () => {
      if (!isTicking.current) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          isTicking.current = false;
        });
        isTicking.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pillBaseClasses = cn(
    "flex items-center justify-between gap-8",
    "rounded-full border border-[#D4B886]/15 bg-[#071A2B]/70 backdrop-blur-xl",
    "shadow-[0_8px_32px_rgba(7,26,43,0.5)]",
    "pointer-events-auto mx-auto overflow-hidden",
    // No CSS transition here — Framer animate drives all dimension changes
  );

  return (
    <>
      {/* ── Fixed pill container ─────────────────────────────────────────── */}
      <div className="fixed top-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <motion.nav
          aria-label="Main navigation"
          style={{ maxWidth: isScrolled ? "calc(100vw - 2rem)" : "1400px" }}
          className={pillBaseClasses}
          animate={
            isScrolled
              ? { width: "auto", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }
              : { width: "100%", paddingLeft: 24, paddingRight: 24, paddingTop: 14, paddingBottom: 14 }
          }
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        >
          <LogoMark isScrolled={isScrolled} />

          {/* ── Desktop links ──────────────────────────────────────────── */}
          <ul className="hidden lg:flex items-center gap-8" role="list">
            {PRIMARY_NAV_ITEMS.map(({ label, href }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    data-active={isActive}
                    className={cn(
                      "relative group font-sans text-body-sm font-light tracking-[0.12em] uppercase",
                      "transition-colors duration-300",
                      isActive ? "text-[#D4B886]" : "text-[#F4F4F6]/60 hover:text-[#F4F4F6]",
                    )}
                  >
                    {label}
                    {/* Animated underline */}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px bg-[#D4B886] transition-all duration-300",
                        isActive ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── CTA + Mobile toggle ────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.contact}
              className={cn(
                "hidden lg:inline-flex items-center justify-center",
                "rounded-full border border-[#D4B886]/40 bg-[#D4B886]/8",
                "font-sans text-body-sm font-light tracking-[0.12em] uppercase text-[#D4B886]",
                "px-5 transition-all duration-300 ease-in-out",
                "hover:bg-[#D4B886] hover:text-[#071A2B] hover:border-[#D4B886]",
                isScrolled ? "py-1.5" : "py-2",
              )}
            >
              Book Consultation
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className={cn(
                "lg:hidden flex items-center justify-center",
                "rounded-full border border-[#D4B886]/20 text-[#F4F4F6]/70",
                "transition-all duration-300 hover:border-[#D4B886]/50 hover:text-[#D4B886]",
                "pointer-events-auto",
                isScrolled ? "h-8 w-8" : "h-9 w-9",
              )}
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="h-4 w-4" />
              ) : (
                <MenuIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* ── Mobile dropdown ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed top-[88px] left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2",
              "rounded-3xl border border-[#D4B886]/15 bg-[#071A2B]/95 backdrop-blur-2xl",
              "p-6 shadow-[0_20px_60px_rgba(7,26,43,0.7)]",
              "pointer-events-auto lg:hidden",
            )}
          >
            <ul className="flex flex-col gap-1" role="list">
              {PRIMARY_NAV_ITEMS.map(({ label, href }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 font-sans text-body-sm tracking-[0.12em] uppercase",
                        "transition-all duration-200",
                        isActive
                          ? "bg-[#D4B886]/10 text-[#D4B886]"
                          : "text-[#F4F4F6]/60 hover:bg-[#1A3D5C]/50 hover:text-[#F4F4F6]",
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile CTA */}
            <div className="mt-4 border-t border-[#1A3D5C] pt-4">
              <Link
                href={ROUTES.contact}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex w-full items-center justify-center rounded-full",
                  "border border-[#D4B886]/40 bg-[#D4B886]/8 px-6 py-3",
                  "font-sans text-body-sm tracking-[0.12em] uppercase text-[#D4B886]",
                  "transition-all duration-300 hover:bg-[#D4B886] hover:text-[#071A2B]",
                )}
              >
                Book a Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
