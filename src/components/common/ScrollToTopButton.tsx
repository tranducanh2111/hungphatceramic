"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useTranslations } from "next-intl";
import { useAppScroll } from "@/hooks/useAppScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

const SCROLL_VISIBILITY_THRESHOLD_PX = 480;
const DESKTOP_SCROLL_QUERY = "(min-width: 1024px)";

function ScrollToTopButtonDesktop() {
	const t = useTranslations("common");
	const lenis = useLenis();
	const prefersReducedMotion = useReducedMotion();
	const { scrollY } = useAppScroll();
	const [isVisible, setIsVisible] = useState(false);

	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsVisible(latest > SCROLL_VISIBILITY_THRESHOLD_PX);
	});

	const handleScrollToTop = useCallback(() => {
		const shouldScrollInstantly = prefersReducedMotion === true;

		if (lenis) {
			lenis.scrollTo(0, { immediate: shouldScrollInstantly });
			return;
		}

		window.scrollTo({
			top: 0,
			behavior: shouldScrollInstantly ? "auto" : "smooth",
		});
	}, [lenis, prefersReducedMotion]);

	return (
		<ScrollToTopButtonControl
			isVisible={isVisible}
			onClick={handleScrollToTop}
			label={t("scrollToTop")}
		/>
	);
}

function ScrollToTopButtonMobile() {
	const t = useTranslations("common");
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY > SCROLL_VISIBILITY_THRESHOLD_PX);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleScrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "auto" });
	}, []);

	return (
		<ScrollToTopButtonControl
			isVisible={isVisible}
			onClick={handleScrollToTop}
			label={t("scrollToTop")}
		/>
	);
}

interface ScrollToTopButtonControlProps {
	isVisible: boolean;
	onClick: () => void;
	label: string;
}

function ScrollToTopButtonControl({ isVisible, onClick, label }: ScrollToTopButtonControlProps) {
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					type="button"
					initial={{ opacity: 0, y: 10, scale: 0.92 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 10, scale: 0.92 }}
					transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
					onClick={onClick}
					aria-label={label}
					className={cn(
						"fixed right-5 bottom-6 z-50 flex h-11 w-11 items-center justify-center rounded-full",
						"border-champagne/45 bg-sapphire-deep/90 text-champagne shadow-luxury-sm border backdrop-blur-sm",
						"hover:border-champagne hover:bg-sapphire-ocean transition-colors duration-300",
						"focus-visible:ring-champagne/50 focus:outline-none focus-visible:ring-2",
						"sm:right-6 sm:bottom-8 lg:bottom-10",
					)}
				>
					<ScrollToTopIcon />
				</motion.button>
			)}
		</AnimatePresence>
	);
}

/**
 * ScrollToTopButton — Fixed corner control; appears after the user scrolls down.
 * Uses Lenis on desktop; native passive scroll on mobile.
 */
export function ScrollToTopButton() {
	const isDesktop = useMediaQuery(DESKTOP_SCROLL_QUERY);

	if (isDesktop) {
		return <ScrollToTopButtonDesktop />;
	}

	return <ScrollToTopButtonMobile />;
}

function ScrollToTopIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			className="text-champagne"
		>
			<path
				d="M9 15V4M9 4L4.5 8.5M9 4L13.5 8.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
