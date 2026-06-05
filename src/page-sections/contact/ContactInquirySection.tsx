"use client";

import { useTranslations } from "next-intl";
import { ViewportDeferredImage } from "@/components/media";
import { Text } from "@/components/ui";
import { RevealOnView } from "@/components/common";
import { CONTACT_SECTION_IDS } from "@/constants/contact";
import { MEDIA_PATHS } from "@/constants/media";
import { cn } from "@/lib/cn";
import { ContactChannelGrid } from "./ContactChannelGrid";
import { ContactInquiryForm } from "./ContactInquiryForm";

const inquiryPanelClassName = cn(
	"rounded-2xl border border-sapphire-mist/70",
	"bg-sapphire-deep/88 backdrop-blur-md",
	"p-6 shadow-[0_24px_64px_rgba(4,15,26,0.45)] lg:p-8",
);

export function ContactInquirySection() {
	const t = useTranslations("pages.contact.inquiry");
	const tChannels = useTranslations("pages.contact.channels");

	return (
		<section
			id={CONTACT_SECTION_IDS.inquiry}
			className="relative scroll-mt-24"
			aria-labelledby="contact-inquiry-heading"
		>
			<div className="absolute inset-0" aria-hidden="true">
				<ViewportDeferredImage
					src={MEDIA_PATHS.images.contact.inquiryBackdrop}
					alt=""
					fill
					quality={72}
					sizes="100vw"
					className="object-cover object-center"
				/>
				<div className="bg-sapphire-deep/72 absolute inset-0" />
				<div className="from-sapphire-deep/90 via-sapphire-deep/55 to-sapphire-deep/92 absolute inset-0 bg-gradient-to-b" />
				<div className="from-sapphire-deep absolute inset-0 bg-gradient-to-r via-transparent to-sapphire-deep/80" />
			</div>

			<div className="relative z-10 py-24 lg:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-12">
					<RevealOnView className="mb-12 max-w-2xl">
						<Text variant="label" className="text-champagne tracking-[0.2em] uppercase">
							{t("label")}
						</Text>
						<Text
							variant="display-lg"
							as="h2"
							id="contact-inquiry-heading"
							className="text-linen mt-4 font-serif font-light"
						>
							{t("heading")}
						</Text>
						<Text variant="body-lg" className="text-linen/70 mt-5">
							{t("description")}
						</Text>
						<Text variant="body-sm" className="text-linen/50 mt-3 font-sans">
							{t("responseNote")}
						</Text>
					</RevealOnView>

					<RevealOnView delay={0.1}>
						<div className={inquiryPanelClassName}>
							<div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
								<ContactInquiryForm />
								<div className="border-sapphire-mist/50 lg:border-sapphire-mist/40 pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
									<Text variant="h4" as="h3" className="text-linen font-serif font-light">
										{tChannels("heading")}
									</Text>
									<ContactChannelGrid className="mt-6" />
								</div>
							</div>
						</div>
					</RevealOnView>
				</div>
			</div>
		</section>
	);
}
