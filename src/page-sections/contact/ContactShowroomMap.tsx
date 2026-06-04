"use client";

import { useTranslations } from "next-intl";
import { GOOGLE_MAPS_EMBED_URL } from "@/constants/contact";

interface ContactShowroomMapProps {
	className?: string;
}

/**
 * ContactShowroomMap — Lazy-loaded Google Maps embed for the showroom section.
 */
export function ContactShowroomMap({ className }: ContactShowroomMapProps) {
	const t = useTranslations("pages.contact.showroom");

	return (
		<div className={className}>
			<iframe
				title={t("mapEmbedTitle")}
				src={GOOGLE_MAPS_EMBED_URL}
				className="h-full min-h-[18rem] w-full rounded-2xl border border-sapphire-mist/60 lg:min-h-[22rem]"
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
				allowFullScreen
			/>
		</div>
	);
}
