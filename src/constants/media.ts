/**
 * Paths for static files under `public/`.
 *
 * Layout:
 * - `public/logo/**` — brand marks (use `LOGO_PATHS.small` in chrome)
 * - `public/icons/contact|social` — UI SVGs
 * - `public/media/images/{landing,featured-projects,panorama,misc}` — raster art
 * - `public/media/video/landing` — hero and similar clips
 * - `public/assets/**` — large product photo library (unchanged)
 */

export const ICON_PATHS = {
	ui: {
		menu: "/icons/ui/menu.svg",
		close: "/icons/ui/close.svg",
	},
	contact: {
		mapPin: "/icons/contact/map-pin.svg",
		phone: "/icons/contact/phone.svg",
		mail: "/icons/contact/mail.svg",
	},
	social: {
		instagram: "/icons/social/instagram.svg",
		facebook: "/icons/social/facebook.svg",
		youtube: "/icons/social/youtube.svg",
	},
} as const;

/** Brand raster logos under `public/logo/`. */
export const LOGO_PATHS = {
	small: "/logo/hungphat_ceramic_logo_small.png",
	big: "/logo/hungphat_ceramic_logo_big.png",
} as const;

export const MEDIA_PATHS = {
	images: {
		landing: {
			heroPoster: "/media/images/landing/hero-poster.png",
			brandStatement: "/media/images/landing/brand-statement.jpg",
		},
		featuredProjects: {
			ramadaHaLongBay: "/media/images/featured-projects/ramada-halong.png",
			hinode: "/media/images/featured-projects/hinode.jpg",
			vinhomesSymphony: "/media/images/featured-projects/vinhomes-symphony.jpg",
			grandPhuQuoc: "/media/images/featured-projects/grand-phuquoc.webp",
			saigonIntela: "/media/images/featured-projects/saigon-intela.jpg",
			empireCity: "/media/images/featured-projects/empire-city.jpg",
		},
		/** Panorama filenames may include spaces — use with `encodeURI` when building URLs. */
		panorama: {
			orientStarGp12w05j: "/media/images/panorama/Orient Star GP12W05J.png",
		},
	},
	video: {
		hero: "/media/video/landing/hero-section.mp4",
	},
	/** Raster extras (textures, alternate art) — not wired in components yet. */
	misc: {
		visualStory: "/media/images/misc/visual-story.jpg",
		tileTexturePng: "/media/images/misc/tile-texture.png",
		tileTextureJpg: "/media/images/misc/tile-texture.jpg",
		brandStatementJpg: "/media/images/misc/brand-statement.jpg",
	},
} as const;
