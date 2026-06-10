import Image from "next/image";
import { encodePublicAssetPath } from "@/lib/products/media";

interface ProductDetailHeroMediaProps {
	src: string;
	alt: string;
}

/**
 * Server-rendered LCP image for product detail — `priority` emits preload in document head.
 */
export function ProductDetailHeroMedia({ src, alt }: ProductDetailHeroMediaProps) {
	return (
		<div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden lg:h-auto lg:w-[60%]">
			<Image
				src={encodePublicAssetPath(src)}
				alt={alt}
				fill
				priority
				fetchPriority="high"
				sizes="(max-width: 1024px) 100vw, 60vw"
				className="object-cover object-center"
			/>
			<div
				className="from-sapphire-deep absolute inset-0 hidden bg-gradient-to-r via-transparent to-transparent opacity-80 lg:block"
				aria-hidden="true"
			/>
			<div
				className="from-sapphire-deep absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-80 lg:hidden"
				aria-hidden="true"
			/>
		</div>
	);
}
