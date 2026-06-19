/** Nominated mobile for footer chat, tel:, WhatsApp, and Zalo. */
export const WHATSAPP_MOBILE_LOCAL = "0965976599";
export const ZALO_MOBILE_LOCAL = "0985300246";

export const CONTACT_EMAIL = "congtyhungphat583@gmail.com";

/** Digits only, Vietnam E.164 without plus (e.g. 84965976599). */
function toVietnamE164Digits(localNumber: string): string {
	const digits = localNumber.replace(/\D/g, "");
	if (digits.startsWith("84")) {
		return digits;
	}
	if (digits.startsWith("0")) {
		return `84${digits.slice(1)}`;
	}
	return `84${digits}`;
}

const whatsappE164Digits = toVietnamE164Digits(WHATSAPP_MOBILE_LOCAL);
const zaloE164Digits = toVietnamE164Digits(ZALO_MOBILE_LOCAL);

export const CONTACT_CHANNELS = {
	phone: {
		display: WHATSAPP_MOBILE_LOCAL,
		href: `tel:+${whatsappE164Digits}`,
	},
	whatsapp: {
		display: WHATSAPP_MOBILE_LOCAL,
		href: `https://wa.me/${whatsappE164Digits}`,
	},
	zalo: {
		display: ZALO_MOBILE_LOCAL,
		href: `https://zalo.me/${zaloE164Digits}`,
	},
} as const;

export function contactMailtoHref(): string {
	return `mailto:${CONTACT_EMAIL}`;
}
