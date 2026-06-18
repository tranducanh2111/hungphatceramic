import { useTranslations } from "next-intl";

import { Text, Button } from "@/components/ui";

export default function NotFoundPage() {
	const t = useTranslations("pages.notFound");

	return (
		<main className="bg-sapphire-deep text-linen flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
			<Text as="h1" variant="display-2xl" className="text-champagne mb-4">
				{t("title")}
			</Text>
			<Text as="h2" variant="h2" className="mb-6">
				{t("heading")}
			</Text>
			<Text as="p" variant="body-lg" className="text-linen-warm mb-10 max-w-md">
				{t("description")}
			</Text>
			<Button href="/" variant="primary">
				{t("backHome")}
			</Button>
		</main>
	);
}
