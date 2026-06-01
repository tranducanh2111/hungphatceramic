import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";
import { ScrollProgressBar } from "@/components/common/ScrollProgressBar";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { routing, type AppLocale } from "@/i18n/routing";

interface LocaleLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
	const { locale } = await params;
	if (!routing.locales.includes(locale as AppLocale)) {
		notFound();
	}

	setRequestLocale(locale);
	const messages = await getMessages();

	return (
		<NextIntlClientProvider messages={messages}>
			<SmoothScrollProvider>
				<Navbar />
				{children}
				<Footer />
				<ScrollProgressBar />
			</SmoothScrollProvider>
		</NextIntlClientProvider>
	);
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}
