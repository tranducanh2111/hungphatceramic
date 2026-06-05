/** Sticky shell — grows on small screens when hero copy wraps past one viewport. */
export const CINEMATIC_HERO_STICKY_CLASS =
	"sticky top-0 min-h-[100dvh] w-full overflow-hidden lg:h-screen";

/** Content stack — vertical padding keeps CTAs inside the media frame on narrow viewports. */
export const CINEMATIC_HERO_CONTENT_CLASS =
	"relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 py-20 text-center sm:px-8 sm:py-16 lg:h-full lg:min-h-0 lg:py-0";

/** Readability scrim over hero video — stronger at the bottom on phones. */
export const CINEMATIC_HERO_SCRIM_CLASS =
	"absolute inset-0 bg-gradient-to-t from-[#071A2B]/88 via-[#071A2B]/20 to-[#071A2B]/35 max-sm:from-[#071A2B]/92";
