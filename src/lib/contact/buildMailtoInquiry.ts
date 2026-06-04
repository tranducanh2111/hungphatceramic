import { CONTACT_EMAIL } from "@/constants/contact";

const MAX_BODY_LENGTH = 2000;

export interface MailtoInquiryFields {
	fullName: string;
	phone: string;
	email: string;
	inquiryTypeLabel: string;
	message: string;
}

/** Strip control chars and trim — reduces mailto injection noise. */
function sanitizeField(value: string): string {
	return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

export function buildMailtoInquiryUrl(
	fields: MailtoInquiryFields,
	recipient: string = CONTACT_EMAIL,
): string {
	const fullName = sanitizeField(fields.fullName);
	const phone = sanitizeField(fields.phone);
	const email = sanitizeField(fields.email);
	const inquiryTypeLabel = sanitizeField(fields.inquiryTypeLabel);
	const message = sanitizeField(fields.message).slice(0, MAX_BODY_LENGTH);

	const subject = encodeURIComponent(`[Perla Inquiry] ${inquiryTypeLabel} — ${fullName}`);
	const body = encodeURIComponent(
		[
			`Name: ${fullName}`,
			`Phone: ${phone}`,
			`Email: ${email}`,
			`Inquiry: ${inquiryTypeLabel}`,
			"",
			message,
		].join("\n"),
	);

	return `mailto:${recipient}?subject=${subject}&body=${body}`;
}
