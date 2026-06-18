import { useTranslations } from "next-intl";

import { Text, Button } from "@/components/ui";

export default function NotFoundPage() {
	const t = useTranslations("pages.notFound");

	return (
		<main className="flex min-h-[70vh] flex-col items-center justify-center bg-sapphire-deep px-6 text-center text-linen">
			<Text as="h1" variant="display-2xl" className="mb-4 text-champagne">
				{t("title")}
			</Text>
			<Text as="h2" variant="h2" className="mb-6">
				{t("heading")}
			</Text>
			<Text as="p" variant="body-lg" className="mb-10 max-w-md text-linen-warm">
				{t("description")}
			</Text>
			<Button href="/" variant="primary">
				{t("backHome")}
			</Button>
		</main>
	);
}
