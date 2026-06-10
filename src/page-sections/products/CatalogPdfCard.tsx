"use client";

import { useTranslations } from "next-intl";
import { Download, Eye } from "lucide-react";
import { Button, Text } from "@/components/ui";
import { cn } from "@/lib/cn";

interface CatalogPdfCardProps {
	className?: string;
	pdfUrl?: string;
	title?: string;
	description?: string;
	downloadFileName?: string;
}

export function CatalogPdfCard({
	className,
	pdfUrl = "/assets/catalog.pdf",
	title,
	description,
	downloadFileName = "HungPhat_Ceramic_Catalog.pdf",
}: CatalogPdfCardProps) {
	const t = useTranslations("pages.products.catalogPdfCard");

	const displayTitle = title || t("title");
	const displayDescription = description || t("description");

	return (
		<article
			className={cn(
				"relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl sm:flex-row sm:items-center",
				"bg-sapphire-ocean border-sapphire-mist/30 shadow-luxury-sm border",
				"hover:border-champagne/40 p-6 transition-colors duration-500 sm:p-8",
				className,
			)}
		>
			<div className="relative z-10 flex flex-col gap-2">
				<Text variant="h5" className="text-linen font-serif">
					{displayTitle}
				</Text>
				<Text variant="body-sm" className="text-linen/70 max-w-md">
					{displayDescription}
				</Text>
			</div>

			<div className="relative z-10 flex shrink-0 items-center gap-4">
				<Button
					variant="outline"
					size="md"
					href={pdfUrl}
					external
					title={t("viewPdf")}
					className="!px-4 !py-4"
				>
					<Eye className="h-5 w-5" />
				</Button>
				<Button
					variant="primary"
					size="md"
					href={pdfUrl}
					download={downloadFileName}
					external
					title={t("downloadPdf")}
					className="!px-4 !py-4"
				>
					<Download className="text-sapphire-deep h-5 w-5" />
				</Button>
			</div>

			<div
				className="from-champagne/5 pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l to-transparent"
				aria-hidden="true"
			/>
		</article>
	);
}
