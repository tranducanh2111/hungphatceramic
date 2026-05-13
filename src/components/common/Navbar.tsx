"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { PRIMARY_NAV_ITEMS, COMPANY_NAME } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { IconSvg } from "@/components/icons";
import { ICON_PATHS, LOGO_PATHS } from "@/constants/media";

// ─── Logo Mark ────────────────────────────────────────────────────────────────

function LogoMark({ isScrolled }: { isScrolled: boolean }) {
	return (
		<Link
			href={ROUTES.home}
			aria-label={`${COMPANY_NAME} — Return to homepage`}
			className="group flex shrink-0 items-center"
		>
			<Image
				src={LOGO_PATHS.small}
				alt={`${COMPANY_NAME} logo`}
				width={240}
				height={67}
				priority
				sizes="(max-width: 768px) 180px, 220px"
				className={cn(
					"h-auto w-auto object-contain object-left transition-all duration-500 group-hover:opacity-90",
					isScrolled ? "max-h-10" : "max-h-12",
				)}
			/>
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
	// Prevents scroll threshold from re-triggering while the spring is still settling
	const isAnimating = useRef(false);

	// Close mobile menu on route change
	useEffect(() => {
		const frameId = requestAnimationFrame(() => {
			setIsMobileMenuOpen(false);
		});
		return () => cancelAnimationFrame(frameId);
	}, [pathname]);

	// Performant scroll listener using rAF to avoid layout thrashing
	useEffect(() => {
		const handleScroll = () => {
			if (!isTicking.current) {
				window.requestAnimationFrame(() => {
					if (!isAnimating.current) {
						setIsScrolled(window.scrollY > 40);
					}
					isTicking.current = false;
				});
				isTicking.current = true;
			}
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const pillBaseClasses = cn(
		"flex min-w-0 items-center justify-between gap-8 overflow-hidden",
		"rounded-full border border-[#D4B886]/15 bg-[#071A2B]/70 backdrop-blur-xl",
		"shadow-[0_8px_32px_rgba(7,26,43,0.5)]",
		// max-w-[60rem] is ALWAYS on — never toggled, so there is no class-swap flash
		"py-3 px-3 max-w-[60rem] pointer-events-auto mx-auto",
	);

	return (
		<>
			{/* ── Fixed pill container ─────────────────────────────────────────── */}
			<div className="pointer-events-none fixed top-5 right-0 left-0 z-50 flex justify-center px-4">
				<motion.nav
					aria-label="Main navigation"
					className={pillBaseClasses}
					// initial={false}: skip the mount animation — nav appears immediately at its target
					// width, no spring on first render. Only subsequent isScrolled changes animate.
					initial={false}
					animate={{ width: isScrolled ? "auto" : "100%" }}
					transition={{
						// Critically-damped spring: frame-rate independent, no bounce.
						// damping = 2√(stiffness × mass) = 2√380 ≈ 39, rounded up to 40.
						type: "spring",
						stiffness: 380,
						damping: 40,
						mass: 1,
					}}
					onAnimationStart={() => {
						isAnimating.current = true;
					}}
					onAnimationComplete={() => {
						isAnimating.current = false;
					}}
				>
					<LogoMark isScrolled={isScrolled} />

					{/* ── Desktop links ──────────────────────────────────────────── */}
					<ul className="hidden items-center gap-8 lg:flex" role="list">
						{PRIMARY_NAV_ITEMS.map(({ label, href }) => {
							const isActive =
								href === "/" ? pathname === "/" : pathname.startsWith(href);
							return (
								<li key={href}>
									<Link
										href={href}
										data-active={isActive}
										className={cn(
											"group text-body-sm relative font-sans font-light tracking-[0.12em] uppercase",
											"transition-colors duration-300",
											isActive
												? "text-[#D4B886]"
												: "text-[#F4F4F6]/60 hover:text-[#F4F4F6]",
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
								"hidden items-center justify-center lg:inline-flex",
								"rounded-full border border-[#D4B886]/40 bg-[#D4B886]/8",
								"text-body-sm font-sans font-light tracking-[0.12em] text-[#D4B886] uppercase",
								"px-5 py-1.5 transition-all duration-300 ease-in-out",
								"hover:border-[#D4B886] hover:bg-[#D4B886] hover:text-[#071A2B]",
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
								"flex items-center justify-center lg:hidden",
								"rounded-full border border-[#D4B886]/20 text-[#F4F4F6]/70",
								"transition-all duration-300 hover:border-[#D4B886]/50 hover:text-[#D4B886]",
								"pointer-events-auto h-8 w-8",
							)}
						>
							<IconSvg
								src={isMobileMenuOpen ? ICON_PATHS.ui.close : ICON_PATHS.ui.menu}
								alt=""
								size={16}
							/>
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
												"text-body-sm block rounded-xl px-4 py-3 font-sans tracking-[0.12em] uppercase",
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
									"text-body-sm font-sans tracking-[0.12em] text-[#D4B886] uppercase",
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
