/**
 * Paths for static files under `public/`.
 *
 * Layout:
 * - `public/logo/**` — brand marks (use `LOGO_PATHS.small` in chrome)
 * - `public/icons/contact|social` — UI SVGs
 * - `public/icons/flags` — locale flag SVGs for the language switcher
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
			heroPoster: "/media/images/landing/hero-poster.png",
			brandStatement: "/media/images/landing/brand-statement.jpg",
		},
		contact: {
			/** Full-bleed backdrop behind the inquiry form. */
			inquiryBackdrop: "/media/images/misc/visual-story.jpg",
		},
		about: {
			/** Founding moment / origin section — replace with archival workshop photo. */
			origin: "/media/images/misc/brand-statement.jpg",
			/** Heritage timeline milestone images — swap with project-specific shots. */
			milestones: {
				founding: "/media/images/misc/visual-story.jpg",
				firstHotel: "/media/images/featured-projects/ramada-halong.png",
				hospitalityExpansion: "/media/images/featured-projects/hinode.jpg",
				residentialGrowth: "/media/images/featured-projects/vinhomes-symphony.jpg",
				brandsAsPartner: "/media/images/featured-projects/empire-city.jpg",
				present: "/media/images/featured-projects/grand-phuquoc.webp",
			},
			/** Craft story section — three sequential craft process images. */
			craft: {
				kiln: "/media/images/misc/tile-texture.jpg",
				polishing: "/media/images/misc/brand-statement.jpg",
				installation: "/media/images/misc/visual-story.jpg",
			},
			/**
			 * Capability card images (numbered 01-04).
			 * Replace placeholders with real per-service photography.
			 */
			capabilities: {
				specification: "/media/images/featured-projects/ramada-halong.png",
				production: "/media/images/featured-projects/hinode.jpg",
				logistics: "/media/images/featured-projects/vinhomes-symphony.jpg",
				aftercare: "/media/images/featured-projects/saigon-intela.jpg",
			},
			/**
			 * Leadership portraits — replace with editorial head-shots.
			 * `founderEnvironmental` is the full-bleed environmental shot used
			 * as the section background (the founder in a finished interior space).
			 */
			leadership: {
				founderEnvironmental: "/media/images/misc/visual-story.jpg",
				founder: "/media/images/featured-projects/empire-city.jpg",
				creativeDirector: "/media/images/featured-projects/hinode.jpg",
				technicalLead: "/media/images/featured-projects/empire-city.jpg",
				projectDirector: "/media/images/featured-projects/saigon-intela.jpg",
				operationsDirector: "/media/images/featured-projects/vinhomes-symphony.jpg",
				salesDirector: "/media/images/featured-projects/grand-phuquoc.webp",
			},
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
			orientStarG12w05j: "/media/images/panorama/Orient Star G12W05J.png",
		},
	},
	video: {
		hero: "/media/video/landing/hero-section.mp4",
		aboutHero: "/media/video/landing/hero-section.mp4",
	},
	/** Raster extras (textures, alternate art) — not wired in components yet. */
	misc: {
		visualStory: "/media/images/misc/visual-story.jpg",
		tileTexturePng: "/media/images/misc/tile-texture.png",
		tileTextureJpg: "/media/images/misc/tile-texture.jpg",
		brandStatementJpg: "/media/images/misc/brand-statement.jpg",
	},
} as const;
