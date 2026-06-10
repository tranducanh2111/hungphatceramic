import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";
import { ScrollProgressBar } from "@/components/common/ScrollProgressBar";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { routing, type AppLocale } from "@/i18n/routing";
import { Cormorant_Garamond, Inter } from "next/font/google";

const cormorant = Cormorant_Garamond({
	variable: "--font-cormorant",
	subsets: ["latin", "vietnamese"],
	weight: ["300", "400", "500", "600"],
	style: ["normal", "italic"],
	display: "swap",
});

// Inter replaces Jost: next/font Jost has no vietnamese subset, so diacritics fell back to system-ui.
const jost = Inter({
	variable: "--font-jost",
	subsets: ["latin", "vietnamese"],
	weight: ["300", "400", "500", "600"],
	display: "swap",
});

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
		<html
			lang={locale}
			data-scroll-behavior="smooth"
			className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
			style={{ position: "relative" }}
			suppressHydrationWarning
		>
			<body
				className="relative flex min-h-full flex-col"
				style={{ position: "relative" }}
				suppressHydrationWarning
			>
				<NextIntlClientProvider messages={messages}>
					<SmoothScrollProvider>
						<Navbar />
						{children}
						<Footer />
						<ScrollProgressBar />
						<ScrollToTopButton />
					</SmoothScrollProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}
