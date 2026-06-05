import type { Variants } from "framer-motion";

/** Sticky shell — grows on small screens when hero copy wraps past one viewport. */
export const CINEMATIC_HERO_STICKY_CLASS =
	"sticky top-0 min-h-[100dvh] w-full overflow-hidden lg:h-screen";

/** Content stack — vertical padding keeps CTAs inside the media frame on narrow viewports. */
export const CINEMATIC_HERO_CONTENT_CLASS =
	"relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 py-20 text-center sm:px-8 sm:py-16 lg:h-full lg:min-h-0 lg:py-0";

/** Readability scrim over hero video — stronger at the bottom on phones. */
export const CINEMATIC_HERO_SCRIM_CLASS =
	"absolute inset-0 bg-gradient-to-t from-sapphire-deep/88 via-sapphire-deep/20 to-sapphire-deep/35 max-sm:from-sapphire-deep/92";

/** Radial backdrop behind cinematic hero video. */
export const CINEMATIC_HERO_RADIAL_CLASS =
	"absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,var(--color-sapphire-mist)_0%,var(--color-sapphire-deep)_70%)]";

/** Softer radial for closing CTA sections. */
export const CTA_RADIAL_CLASS =
	"absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,var(--color-sapphire-mist)_0%,var(--color-sapphire-deep)_65%)] opacity-60";

/** Scroll indicator bounce — pairs with `animate-scroll-indicator-bounce` in globals.css. */
export const SCROLL_INDICATOR_BOUNCE_CLASS = "animate-scroll-indicator-bounce";

/** Shared entrance animation for cinematic hero content. */
export const CINEMATIC_HERO_CONTENT_VARIANTS: Variants = {
	hidden: { opacity: 0, y: 32 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.9, ease: "easeOut" as const, delay },
	}),
};

/** Shared bounce animation for hero scroll indicators. */
export const CINEMATIC_HERO_SCROLL_INDICATOR_VARIANTS: Variants = {
	animate: {
		y: [0, 10, 0],
		opacity: [0.5, 1, 0.5],
		transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
	},
};
