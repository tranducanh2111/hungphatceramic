"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/constants/routes";
import { IconSvg } from "@/components/icons";
import { ICON_PATHS, LOGO_PATHS } from "@/constants/media";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { useAppScroll } from "@/hooks/useAppScroll";

// ─── Navbar constants ─────────────────────────────────────────────────────────

/** CSS aspect-ratio for `LOGO_PATHS.small` (177×96 px PNG). Width auto-computes from height. */
const LOGO_ASPECT_RATIO = "177 / 96";
const LOGO_HEIGHT_EXPANDED = 56;
const LOGO_HEIGHT_SHRUNK = 44;

const NAV_SCROLL_THRESHOLD = 40; //   scroll depth (px) that triggers the shrink state
const NAV_PADDING_X_EXPANDED = 24; // wider pill at top of page
const NAV_PADDING_X_SHRUNK = 12; // compact pill when scrolled
const NAV_MAX_WIDTH = 1440;
const NAV_OUTER_GAP = 32;
const NAV_CONTENT_GAP = 32;
const NAV_SHRINK_BUFFER = 24; // extra room so CTA + locale never clip the pill edge

/** Sum visible flex children + gaps — reliable regardless of justify-between. */
function measureVisibleContentWidth(contentEl: HTMLDivElement): number {
	const visibleChildren = Array.from(contentEl.children).filter(
		(child): child is HTMLElement =>
			child instanceof HTMLElement && child.getBoundingClientRect().width > 0,
	);

	if (visibleChildren.length === 0) return 0;

	const itemsWidth = visibleChildren.reduce(
		(total, child) => total + child.getBoundingClientRect().width,
		0,
	);

	return Math.ceil(itemsWidth + NAV_CONTENT_GAP * (visibleChildren.length - 1));
}

// ─── Logo Mark ────────────────────────────────────────────────────────────────

const NAVBAR_MOTION_TRANSITION = {
	type: "tween",
	duration: 1,
	ease: [0.22, 1, 0.36, 1],
} as const;

interface LogoMarkProps {
	isScrolled: boolean;
}

function LogoMark({ isScrolled }: LogoMarkProps) {
	const t = useTranslations("common");

	return (
		<Link
			href={ROUTES.home}
			aria-label={t("logoAriaLabel")}
			className="group flex shrink-0 items-center"
		>
			<motion.div
				style={{ aspectRatio: LOGO_ASPECT_RATIO }}
				animate={{ height: isScrolled ? LOGO_HEIGHT_SHRUNK : LOGO_HEIGHT_EXPANDED }}
				transition={NAVBAR_MOTION_TRANSITION}
				className="relative shrink-0"
			>
				<Image
					src={LOGO_PATHS.small}
					alt={t("logoAlt")}
					fill
					priority
					sizes="(max-width: 768px) 200px, 260px"
					className="object-contain object-left transition-opacity duration-300 group-hover:opacity-90"
				/>
			</motion.div>
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
	const { scrollY } = useAppScroll();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const navRef = useRef<HTMLElement>(null);
	const navContentRef = useRef<HTMLDivElement>(null);
	const [expandedWidthPx, setExpandedWidthPx] = useState(NAV_MAX_WIDTH);
	const [shrinkWidthPx, setShrinkWidthPx] = useState(800);
	const navItems = [
		{ href: ROUTES.home, label: t("links.home") },
		{ href: ROUTES.about, label: t("links.about") },
		{ href: ROUTES.products, label: t("links.products") },
		{ href: ROUTES.projects, label: t("links.projects") },
	];

	// Close mobile menu on route change
	useEffect(() => {
		const frameId = requestAnimationFrame(() => {
			setIsMobileMenuOpen(false);
		});
		return () => cancelAnimationFrame(frameId);
	}, [pathname]);

	// Lenis owns scroll — use Framer's scrollY (same pattern as ScrollToTopButton).
	useMotionValueEvent(scrollY, "change", (latest) => {
		const nextScrolled = latest > NAV_SCROLL_THRESHOLD;
		setIsScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
	});

	useEffect(() => {
		setIsScrolled(scrollY.get() > NAV_SCROLL_THRESHOLD);
	}, [scrollY]);

	/**
	 * Derives both target widths from the current DOM.
	 * Uses visible-child summation (not max-content) so justify-between never skews the read.
	 */
	const recalcWidths = useCallback(() => {
		const contentEl = navContentRef.current;
		const navEl = navRef.current;
		if (!contentEl) return;

		setExpandedWidthPx(
			Math.min(NAV_MAX_WIDTH, Math.max(320, window.innerWidth - NAV_OUTER_GAP)),
		);

		const contentWidth = measureVisibleContentWidth(contentEl);
		let nextShrinkWidth = Math.max(
			320,
			contentWidth + 2 * NAV_PADDING_X_SHRUNK + NAV_SHRINK_BUFFER,
		);

		// When already shrunk, scrollWidth catches any content we still underestimated.
		if (navEl && navEl.scrollWidth > navEl.clientWidth + 1) {
			nextShrinkWidth = Math.max(nextShrinkWidth, navEl.scrollWidth + NAV_SHRINK_BUFFER);
		}

		setShrinkWidthPx(nextShrinkWidth);
	}, []);

	// Re-measure when scroll state or route changes (logo size / labels shift width).
	useLayoutEffect(() => {
		recalcWidths();
	}, [recalcWidths, isScrolled, pathname]);

	// Keep shrink width in sync with font load, viewport resize, and content reflow.
	useLayoutEffect(() => {
		const contentEl = navContentRef.current;
		if (!contentEl) return;

		const resizeObserver = new ResizeObserver(recalcWidths);
		const observeTarget = (target: Element) => resizeObserver.observe(target);

		observeTarget(contentEl);
		Array.from(contentEl.children).forEach(observeTarget);

		void document.fonts.ready.then(recalcWidths);
		window.addEventListener("resize", recalcWidths);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", recalcWidths);
		};
	}, [recalcWidths]);

	return (
		<>
			{/* ── Fixed pill container ─────────────────────────────────────────── */}
			<div className="pointer-events-none fixed top-5 right-0 left-0 z-50 flex justify-center px-4">
				<motion.nav
					ref={navRef}
					aria-label={t("aria.mainNavigation")}
					className="overflow-visible rounded-full border border-[#D4B886]/15 bg-[#071A2B]/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(7,26,43,0.5)] py-3 pointer-events-auto mx-auto"
					animate={{
						width: isScrolled ? shrinkWidthPx : expandedWidthPx,
						paddingLeft: isScrolled ? NAV_PADDING_X_SHRUNK : NAV_PADDING_X_EXPANDED,
						paddingRight: isScrolled ? NAV_PADDING_X_SHRUNK : NAV_PADDING_X_EXPANDED,
					}}
					transition={NAVBAR_MOTION_TRANSITION}
				>
					<div
						ref={navContentRef}
						className="flex min-w-0 flex-nowrap items-center justify-between gap-8 whitespace-nowrap"
					>
						<LogoMark isScrolled={isScrolled} />

						{/* ── Desktop links ──────────────────────────────────────────── */}
						<ul className="hidden shrink-0 items-center gap-8 lg:flex" role="list">
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
						<div className="flex shrink-0 items-center gap-3">
							<Link
								href={ROUTES.contact}
								className={cn(
									"hidden items-center justify-center lg:inline-flex",
									"rounded-full border border-[#D4B886]/40 bg-[#D4B886]/8",
									"text-body-sm font-sans font-light tracking-[0.12em] whitespace-nowrap text-[#D4B886] uppercase",
									"px-5 py-1.5 transition-all duration-300 ease-in-out",
									"hover:border-[#D4B886] hover:bg-[#D4B886] hover:text-[#071A2B]",
									"button-border-shimmer",
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
									"button-border-shimmer",
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