"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { encodePublicAssetPath, resolveDetailGalleryImagePath } from "@/lib/products/media";
import { cn } from "@/lib/cn";

export interface CompositeOverviewPanelProps {
	allFacesImage: string;
	productName: string;
	compositeAlt: string;
	onOpenLightbox: () => void;
	onImageError: () => void;
	className?: string;
}

export function CompositeOverviewPanel({
	allFacesImage,
	productName,
	compositeAlt,
	onOpenLightbox,
	onImageError,
	className,
}: CompositeOverviewPanelProps) {
	const tDetail = useTranslations("pages.productDetail");

	return (
		<div
			className={cn(
				"shadow-luxury-md border-sapphire-mist/40 bg-sapphire-deep w-full overflow-hidden rounded-2xl border p-6",
				className,
			)}
		>
			<Text
				variant="label-sm"
				className="text-champagne/60 mb-4 block text-center font-sans font-medium tracking-[0.1em] uppercase"
			>
				{tDetail("facesOverviewComposite")}
			</Text>
			<div
				className="bg-sapphire-deep relative min-h-[12rem] w-full cursor-zoom-in overflow-hidden rounded-xl sm:min-h-[16rem] lg:min-h-[20rem]"
				onClick={onOpenLightbox}
			>
				<Image
					src={encodePublicAssetPath(resolveDetailGalleryImagePath(allFacesImage))}
					alt={compositeAlt}
					fill
					sizes="(max-width: 1024px) 100vw, 50vw"
					className="ease-luxury object-contain object-center transition-transform duration-700 hover:scale-[1.01]"
					onError={onImageError}
				/>
			</div>
			<p className="text-footnote text-linen/45 mt-3 text-center font-sans">{productName}</p>
		</div>
	);
}
