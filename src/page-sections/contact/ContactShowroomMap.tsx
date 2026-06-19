"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { GOOGLE_MAPS_EMBED_URL } from "@/constants/contact";
import { observeSharedViewportIntersection } from "@/lib/sharedViewportObserver";
import { cn } from "@/lib/cn";

interface ContactShowroomMapProps {
	className?: string;
}

/** ContactShowroomMap (Google Maps embed loads only when the map nears the viewport). */
export function ContactShowroomMap({ className }: ContactShowroomMapProps) {
	const t = useTranslations("pages.contact.showroom");
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const [shouldLoadMapEmbed, setShouldLoadMapEmbed] = useState(false);

	useEffect(() => {
		const mapContainer = mapContainerRef.current;
		if (!mapContainer) {
			return;
		}

		return observeSharedViewportIntersection(mapContainer, "320px 0px", (isIntersecting) => {
			if (isIntersecting) {
				setShouldLoadMapEmbed(true);
			}
		});
	}, []);

	return (
		<div
			ref={mapContainerRef}
			className={cn(
				"border-sapphire-mist/60 min-h-[18rem] overflow-hidden rounded-2xl border lg:min-h-[22rem]",
				className,
			)}
		>
			{shouldLoadMapEmbed ? (
				<iframe
					title={t("mapEmbedTitle")}
					src={GOOGLE_MAPS_EMBED_URL}
					className="h-full min-h-[18rem] w-full lg:min-h-[22rem]"
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					allowFullScreen
				/>
			) : (
				<div
					className="bg-sapphire-mist/15 h-full min-h-[18rem] w-full lg:min-h-[22rem]"
					aria-hidden="true"
				/>
			)}
		</div>
	);
}
