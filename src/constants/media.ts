/**
 * Paths for static files under `public/`.
 *
 * Layout:
 * - `public/logo/**` (brand marks, use `LOGO_PATHS.small` in chrome)
 * - `public/icons/contact|social` (UI SVGs)
 * - `public/icons/flags` (locale flag SVGs for the language switcher)
 * - `public/media/images/{landing,featured-projects,panorama,misc}` (raster art)
 * - `public/media/video/landing` (hero and similar clips)
 * - `public/assets/**` (large product photo library, unchanged)
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
		whatsapp: "/icons/contact/whatsapp.svg",
		zalo: "/icons/contact/zalo.svg",
	},
	social: {
		instagram: "/icons/social/instagram.svg",
		facebook: "/icons/social/facebook.svg",
		youtube: "/icons/social/youtube.svg",
	},
	flags: {
		vi: "/icons/flags/vi.svg",
		en: "/icons/flags/en.svg",
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
			heroPoster: "/media/images/landing/hero-poster.webp",
			brandStatement: "/media/images/landing/brand-statement.webp",
		},
		contact: {
			/** Backdrop behind the inquiry form. */
			inquiryBackdrop: "/media/images/misc/visual-story.webp",
		},
		about: {
			/** Founding moment / origin section (replace with archival workshop photo). */
			origin: "/media/images/misc/brand-statement.webp",
			/** Heritage timeline milestone images (swap with project-specific shots). */
			milestones: {
				founding: "/media/images/misc/visual-story.webp",
				firstHotel: "/media/images/featured-projects/ramada-halong.webp",
				hospitalityExpansion: "/media/images/featured-projects/hinode.webp",
				residentialGrowth: "/media/images/featured-projects/vinhomes-symphony.webp",
				brandsAsPartner: "/media/images/featured-projects/empire-city.webp",
				present: "/media/images/featured-projects/grand-phuquoc.webp",
			},
			/** Craft story section (three sequential craft process images). */
			craft: {
				kiln: "/media/images/misc/tile-texture.webp",
				polishing: "/media/images/misc/brand-statement.webp",
				installation: "/media/images/misc/visual-story.webp",
			},
			/**
			 * Capability card images (numbered 01-04).
			 * Replace placeholders with real per-service photography.
			 */
			capabilities: {
				specification: "/media/images/featured-projects/ramada-halong.webp",
				production: "/media/images/featured-projects/hinode.webp",
				logistics: "/media/images/featured-projects/vinhomes-symphony.webp",
				aftercare: "/media/images/featured-projects/saigon-intela.webp",
			},
			/**
			 * Leadership portraits (replace with editorial head-shots).
			 * `founderEnvironmental` is the environmental shot used
			 * as the section background (the founder in a finished interior space).
			 */
			leadership: {
				founderEnvironmental: "/media/images/misc/visual-story.webp",
				founder: "/media/images/featured-projects/empire-city.webp",
				creativeDirector: "/media/images/featured-projects/hinode.webp",
				technicalLead: "/media/images/featured-projects/empire-city.webp",
				projectDirector: "/media/images/featured-projects/saigon-intela.webp",
				operationsDirector: "/media/images/featured-projects/vinhomes-symphony.webp",
				salesDirector: "/media/images/featured-projects/grand-phuquoc.webp",
			},
		},
		featuredProjects: {
			ramadaHaLongBay: "/media/images/featured-projects/ramada-halong.webp",
			hinode: "/media/images/featured-projects/hinode.webp",
			vinhomesSymphony: "/media/images/featured-projects/vinhomes-symphony.webp",
			grandPhuQuoc: "/media/images/featured-projects/grand-phuquoc.webp",
			saigonIntela: "/media/images/featured-projects/saigon-intela.webp",
			empireCity: "/media/images/featured-projects/empire-city.webp",
		},
		/** Panorama filenames may include spaces (use with `encodeURI` when building URLs). */
		panorama: {
			orientStarG12w05j: "/media/images/panorama/Orient Star G12W05J.png",
		},
	},
	video: {
		hero: "/media/video/landing/hero-section.mp4",
		aboutHero: "/media/video/landing/hero-section.mp4",
	},
	/** Raster extras (textures, alternate art) (not wired in components yet). */
	misc: {
		visualStory: "/media/images/misc/visual-story.webp",
		tileTexturePng: "/media/images/misc/tile-texture.webp",
		tileTextureJpg: "/media/images/misc/tile-texture.webp",
		brandStatementJpg: "/media/images/misc/brand-statement.webp",
	},
} as const;
