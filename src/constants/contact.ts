/** Contact configuration re-exports (channel data: `src/data/contact/channels.ts`). */

export {
	CONTACT_CHANNELS,
	CONTACT_EMAIL,
	WHATSAPP_MOBILE_LOCAL,
	ZALO_MOBILE_LOCAL,
	contactMailtoHref,
} from "@/data/contact/channels";

/** Opens Google Maps in a new tab. */
export const GOOGLE_MAPS_URL =
	"https://www.google.com/maps/place/C%C3%94NG+TY+TNHH+S%E1%BA%A2N+XU%E1%BA%A4T+V%C3%80+KINH+DOANH+V%E1%BA%ACT+LI%E1%BB%86U+X%C3%82Y+D%E1%BB%B0NG+H%C3%99NG+PH%C3%81T/@21.0546308,105.7979539,17z/data=!3m1!4b1!4m6!3m5!1s0x3135ab0007eb880b:0x1233c917928f4f3a!8m2!3d21.0546308!4d105.7979539!16s%2Fg%2F11y8z0szzs";

/** Embedded map iframe `src` (no API key). */
export const GOOGLE_MAPS_EMBED_URL =
	"https://www.google.com/maps?q=21.0546308,105.7979539&z=16&hl=vi&output=embed";

/** In-page anchors on `/contact`. */
export const CONTACT_SECTION_IDS = {
	inquiry: "inquiry",
} as const;

export type ContactSectionId = (typeof CONTACT_SECTION_IDS)[keyof typeof CONTACT_SECTION_IDS];

export const INQUIRY_TYPE_IDS = ["consultation", "productQuote", "partnership", "other"] as const;

export type InquiryTypeId = (typeof INQUIRY_TYPE_IDS)[number];
