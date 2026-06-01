"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/constants/routes";
import { IconSvg } from "@/components/icons";
import { ICON_PATHS, LOGO_PATHS } from "@/constants/media";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";

// ─── Logo Mark ────────────────────────────────────────────────────────────────

function LogoMark() {
	const t = useTranslations("common");

	return (
		<Link
			href={ROUTES.home}
			aria-label={t("logoAriaLabel")}
			className="group flex shrink-0 items-center"
		>
			<Image
				src={LOGO_PATHS.small}
				alt={t("logoAlt")}
				width={240}
				height={67}
				priority
				sizes="(max-width: 768px) 180px, 220px"
				className="h-auto max-h-11 w-auto object-contain object-left transition-opacity duration-300 group-hover:opacity-90"
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
	const t = useTranslations("navbar");
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const navContentRef = useRef<HTMLDivElement>(null);
	const [expandedWidthPx, setExpandedWidthPx] = useState(1440);
	const [shrinkWidthPx, setShrinkWidthPx] = useState(760);
	const navItems = [
		{ href: ROUTES.home, label: t("links.home") },
		{ href: ROUTES.about, label: t("links.about") },
		{ href: ROUTES.products, label: t("links.products") },
		{ href: ROUTES.projects, label: t("links.projects") },
	];

	const NAV_MAX_EXPANDED_PX = 1440; // 64rem
	const NAV_OUTER_SIDE_GAP_PX = 32; // fixed wrapper has px-4 on both sides
	const NAV_HORIZONTAL_PADDING_PX = 24; // nav has px-3 => 12px each side
	const NAV_SHRINK_BUFFER_PX = 12; // safety buffer to prevent text wrapping at fit width

	const getCurrentScrollY = (): number => {
		if (typeof window === "undefined") return 0;
		return Math.max(
			window.scrollY,
			window.pageYOffset,
			document.documentElement.scrollTop,
			document.body.scrollTop,
			0,
		);
	};

	// Close mobile menu on route change
	useEffect(() => {
		const frameId = requestAnimationFrame(() => {
			setIsMobileMenuOpen(false);
		});
		return () => cancelAnimationFrame(frameId);
	}, [pathname]);

	// Scroll threshold: only toggles between two stable width states
	useEffect(() => {
		const updateScrolledState = () => {
			const nextScrolled = getCurrentScrollY() > 40;
			setIsScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
		};

		const handleScroll = () => {
			updateScrolledState();
		};

		// Sync immediately in case user reloads mid-page.
		updateScrolledState();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Measure both targets so animation is numeric (no `auto` width jitter).
	useEffect(() => {
		const measureIntrinsicContentWidth = (): number => {
			const contentEl = navContentRef.current;
			if (!contentEl) return 0;

			// Measure the row at max-content so "shrink" uses true intrinsic width,
			// not the stretched width inherited from the expanded container.
			const prevWidth = contentEl.style.width;
			const prevMaxWidth = contentEl.style.maxWidth;
			contentEl.style.width = "max-content";
			contentEl.style.maxWidth = "none";
			const width = Math.ceil(contentEl.getBoundingClientRect().width);
			contentEl.style.width = prevWidth;
			contentEl.style.maxWidth = prevMaxWidth;
			return width;
		};

		const recalcTargets = () => {
			const viewportWidth = window.innerWidth;
			const nextExpandedWidth = Math.min(
				NAV_MAX_EXPANDED_PX,
				Math.max(320, viewportWidth - NAV_OUTER_SIDE_GAP_PX),
			);
			setExpandedWidthPx(nextExpandedWidth);

			const contentWidth = measureIntrinsicContentWidth();
			const nextShrinkWidth = Math.min(
				nextExpandedWidth,
				Math.max(
					300,
					Math.ceil(contentWidth + NAV_HORIZONTAL_PADDING_PX + NAV_SHRINK_BUFFER_PX),
				),
			);
			setShrinkWidthPx(nextShrinkWidth);
		};

		recalcTargets();
		window.addEventListener("resize", recalcTargets);

		return () => {
			window.removeEventListener("resize", recalcTargets);
		};
	}, []);

	const pillBaseClasses = cn(
		/* Allow locale dropdown to extend below the pill (was clipped by overflow-hidden). */
		"overflow-visible",
		"rounded-full border border-[#D4B886]/15 bg-[#071A2B]/70 backdrop-blur-xl",
		"shadow-[0_8px_32px_rgba(7,26,43,0.5)]",
		"px-3 py-3 pointer-events-auto mx-auto",
	);

	return (
		<>
			{/* ── Fixed pill container ─────────────────────────────────────────── */}
			<div className="pointer-events-none fixed top-5 right-0 left-0 z-50 flex justify-center px-4">
				<motion.nav
					aria-label={t("aria.mainNavigation")}
					className={pillBaseClasses}
					initial={false}
					animate={{ width: isScrolled ? shrinkWidthPx : expandedWidthPx }}
					transition={{
						type: "tween",
						duration: 1,
						ease: [0.22, 1, 0.36, 1],
					}}
				>
					<div
						ref={navContentRef}
						className="flex min-w-0 flex-nowrap items-center justify-between gap-8 whitespace-nowrap"
					>
						<LogoMark />

						{/* ── Desktop links ──────────────────────────────────────────── */}
						<ul className="hidden items-center gap-8 lg:flex" role="list">
							{navItems.map(({ label, href }) => {
								const isActive =
									href === "/" ? pathname === "/" : pathname.startsWith(href);
								return (
									<li key={href}>
										<Link
											href={href}
											data-active={isActive}
											className={cn(
												"group text-body-sm relative font-sans font-light tracking-[0.12em] whitespace-nowrap uppercase",
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
									"text-body-sm font-sans font-light tracking-[0.12em] whitespace-nowrap text-[#D4B886] uppercase",
									"px-5 py-1.5 transition-all duration-300 ease-in-out",
									"hover:border-[#D4B886] hover:bg-[#D4B886] hover:text-[#071A2B]",
								)}
							>
								{t("cta.bookConsultation")}
							</Link>
							<LocaleSwitcher className="hidden lg:block" />

							{/* Mobile menu toggle */}
							<button
								type="button"
								onClick={() => setIsMobileMenuOpen((prev) => !prev)}
								aria-label={
									isMobileMenuOpen ? t("aria.closeMenu") : t("aria.openMenu")
								}
								aria-expanded={isMobileMenuOpen}
								className={cn(
									"flex items-center justify-center lg:hidden",
									"rounded-full border border-[#D4B886]/20 text-[#F4F4F6]/70",
									"transition-all duration-300 hover:border-[#D4B886]/50 hover:text-[#D4B886]",
									"pointer-events-auto h-8 w-8",
								)}
							>
								<IconSvg
									src={
										isMobileMenuOpen ? ICON_PATHS.ui.close : ICON_PATHS.ui.menu
									}
									alt=""
									size={16}
								/>
							</button>
						</div>
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
							{navItems.map(({ label, href }) => {
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
						<div className="mt-3">
							<LocaleSwitcher />
						</div>

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
								{t("cta.bookConsultation")}
							</Link>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
