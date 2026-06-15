"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
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
import { useMediaQuery } from "@/hooks/useMediaQuery";

// ─── Navbar constants ─────────────────────────────────────────────────────────

/** CSS aspect-ratio for `LOGO_PATHS.small` (177×96 px PNG). Width auto-computes from height. */
const LOGO_ASPECT_RATIO = "177 / 96";
const LOGO_HEIGHT_EXPANDED = 56;
const LOGO_HEIGHT_SHRUNK = 44;

const NAV_SCROLL_THRESHOLD = 40; //   scroll depth (px) that triggers the shrink state
const NAV_SCROLL_ENTER_THRESHOLD = 56; // hysteresis — avoids flicker near page top
const NAV_SCROLL_EXIT_THRESHOLD = 12;
const DESKTOP_NAV_QUERY = "(min-width: 1024px)"; // Tailwind `lg`
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

const NAV_PILL_BASE_CLASS =
	"overflow-visible rounded-full border border-[#D4B886]/15 bg-[#071A2B]/95 shadow-[0_8px_32px_rgba(7,26,43,0.5)] py-3 pointer-events-auto mx-auto lg:bg-[#071A2B]/70 lg:backdrop-blur-xl";

interface LogoMarkProps {
	isScrolled: boolean;
}

function LogoMark({ isScrolled }: LogoMarkProps) {
	const t = useTranslations("common");
	const isDesktopNav = useMediaQuery(DESKTOP_NAV_QUERY);
	const logoHeight = isScrolled ? LOGO_HEIGHT_SHRUNK : LOGO_HEIGHT_EXPANDED;

	return (
		<Link
			href={ROUTES.home}
			aria-label={t("logoAriaLabel")}
			className="group flex shrink-0 items-center"
		>
			{isDesktopNav ? (
				<motion.div
					style={{ aspectRatio: LOGO_ASPECT_RATIO }}
					animate={{ height: logoHeight }}
					transition={NAVBAR_MOTION_TRANSITION}
					className="relative shrink-0"
				>
					<LogoImage />
				</motion.div>
			) : (
				<div
					style={{ aspectRatio: LOGO_ASPECT_RATIO, height: LOGO_HEIGHT_EXPANDED }}
					className="relative shrink-0"
				>
					<LogoImage />
				</div>
			)}
		</Link>
	);
}

function LogoImage() {
	const t = useTranslations("common");

	return (
		<Image
			src={LOGO_PATHS.small}
			alt={t("logoAlt")}
			fill
			priority
			sizes="(max-width: 768px) 200px, 260px"
			className="object-contain object-left transition-opacity duration-300 group-hover:opacity-90"
		/>
	);
}

interface NavbarDesktopScrollListenerProps {
	onScrolledChange: (isScrolled: boolean) => void;
}

/** Desktop-only scroll subscription — avoids Framer scroll work on mobile. */
function NavbarDesktopScrollListener({ onScrolledChange }: NavbarDesktopScrollListenerProps) {
	const { scrollY } = useAppScroll();
	const isScrolledRef = useRef(false);

	useMotionValueEvent(scrollY, "change", (latest) => {
		const prev = isScrolledRef.current;
		let next = prev;

		if (!prev && latest > NAV_SCROLL_ENTER_THRESHOLD) {
			next = true;
		} else if (prev && latest < NAV_SCROLL_EXIT_THRESHOLD) {
			next = false;
		}

		if (next !== prev) {
			isScrolledRef.current = next;
			onScrolledChange(next);
		}
	});

	useEffect(() => {
		const initial = scrollY.get() > NAV_SCROLL_THRESHOLD;
		isScrolledRef.current = initial;
		onScrolledChange(initial);
	}, [onScrolledChange, scrollY]);

	return null;
}

interface NavbarDesktopPillProps {
	ariaLabel: string;
	navIsCompact: boolean;
	pathname: string;
	children: React.ReactNode;
}

/** Desktop pill with measured width animation — effects only mount at lg+. */
function NavbarDesktopPill({
	ariaLabel,
	navIsCompact,
	pathname,
	children,
}: NavbarDesktopPillProps) {
	const navRef = useRef<HTMLElement>(null);
	const navContentRef = useRef<HTMLDivElement>(null);
	const recalcFrameRef = useRef<number | null>(null);
	const [expandedWidthPx, setExpandedWidthPx] = useState(NAV_MAX_WIDTH);
	const [shrinkWidthPx, setShrinkWidthPx] = useState(800);

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

		if (navEl && navEl.scrollWidth > navEl.clientWidth + 1) {
			nextShrinkWidth = Math.max(nextShrinkWidth, navEl.scrollWidth + NAV_SHRINK_BUFFER);
		}

		setShrinkWidthPx(nextShrinkWidth);
	}, []);

	const scheduleRecalcWidths = useCallback(() => {
		if (recalcFrameRef.current !== null) {
			cancelAnimationFrame(recalcFrameRef.current);
		}

		recalcFrameRef.current = requestAnimationFrame(() => {
			recalcFrameRef.current = null;
			recalcWidths();
		});
	}, [recalcWidths]);

	useLayoutEffect(() => {
		scheduleRecalcWidths();
	}, [scheduleRecalcWidths, navIsCompact, pathname]);

	useLayoutEffect(() => {
		const contentEl = navContentRef.current;
		if (!contentEl) return;

		scheduleRecalcWidths();

		const resizeObserver = new ResizeObserver(scheduleRecalcWidths);
		const observeTarget = (target: Element) => resizeObserver.observe(target);

		observeTarget(contentEl);
		Array.from(contentEl.children).forEach(observeTarget);

		void document.fonts.ready.then(scheduleRecalcWidths);
		window.addEventListener("resize", scheduleRecalcWidths);

		return () => {
			if (recalcFrameRef.current !== null) {
				cancelAnimationFrame(recalcFrameRef.current);
			}
			resizeObserver.disconnect();
			window.removeEventListener("resize", scheduleRecalcWidths);
		};
	}, [scheduleRecalcWidths]);

	return (
		<motion.nav
			ref={navRef}
			aria-label={ariaLabel}
			className={NAV_PILL_BASE_CLASS}
			animate={{
				width: navIsCompact ? shrinkWidthPx : expandedWidthPx,
				paddingLeft: navIsCompact ? NAV_PADDING_X_SHRUNK : NAV_PADDING_X_EXPANDED,
				paddingRight: navIsCompact ? NAV_PADDING_X_SHRUNK : NAV_PADDING_X_EXPANDED,
			}}
			transition={NAVBAR_MOTION_TRANSITION}
		>
			<div
				ref={navContentRef}
				className="flex min-w-0 flex-nowrap items-center justify-between gap-8 whitespace-nowrap"
			>
				{children}
			</div>
		</motion.nav>
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
	const isDesktopNav = useMediaQuery(DESKTOP_NAV_QUERY);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const navIsCompact = isDesktopNav && isScrolled;

	const handleDesktopScrolledChange = useCallback((nextScrolled: boolean) => {
		setIsScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
	}, []);
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

	const navPillContent: ReactNode = (
		<>
			<LogoMark isScrolled={navIsCompact} />

			{/* ── Desktop links ──────────────────────────────────────────── */}
			<ul className="hidden shrink-0 items-center gap-8 lg:flex" role="list">
				{navItems.map(({ label, href }) => {
					const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
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

				<button
					type="button"
					onClick={() => setIsMobileMenuOpen((prev) => !prev)}
					aria-label={isMobileMenuOpen ? t("aria.closeMenu") : t("aria.openMenu")}
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
		</>
	);

	return (
		<>
			{isDesktopNav && (
				<NavbarDesktopScrollListener onScrolledChange={handleDesktopScrolledChange} />
			)}

			{/* ── Fixed pill container ─────────────────────────────────────────── */}
			<div className="pointer-events-none fixed top-5 right-0 left-0 z-50 flex justify-center px-4">
				{isDesktopNav ? (
					<NavbarDesktopPill
						ariaLabel={t("aria.mainNavigation")}
						navIsCompact={navIsCompact}
						pathname={pathname}
					>
						{navPillContent}
					</NavbarDesktopPill>
				) : (
					<nav
						aria-label={t("aria.mainNavigation")}
						className={cn(NAV_PILL_BASE_CLASS, "w-full px-6")}
					>
						<div className="flex min-w-0 flex-nowrap items-center justify-between gap-8 whitespace-nowrap">
							{navPillContent}
						</div>
					</nav>
				)}
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