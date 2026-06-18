"use client";

import { useTranslations } from "next-intl";
import { Text, Button } from "@/components/ui";
import { RevealOnView } from "@/components/common";
import { GOOGLE_MAPS_URL } from "@/constants/contact";
import { ContactShowroomMap } from "./ContactShowroomMap";

export function ContactShowroom() {
	const t = useTranslations("pages.contact.showroom");
	const tFooter = useTranslations("footer.contact");

	return (
		<section
			className="bg-sapphire-deep py-24 lg:py-32"
			aria-labelledby="contact-showroom-heading"
		>
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
					<RevealOnView>
						<Text variant="label" className="text-champagne tracking-[0.2em] uppercase">
							{t("label")}
						</Text>
						<Text
							variant="display-lg"
							as="h2"
							id="contact-showroom-heading"
							className="text-linen mt-4 font-serif font-light"
						>
							{t("heading")}
						</Text>
						<Text variant="body-lg" className="text-linen/55 mt-5">
							{t("description")}
						</Text>
						<address className="text-body text-linen/70 mt-8 font-sans not-italic">
							{tFooter("address")}
						</address>
						<Text variant="body-sm" className="text-linen/45 mt-3 font-sans">
							{t("hours")}
						</Text>
						<div className="mt-8">
							<Button
								href={GOOGLE_MAPS_URL}
								variant="outline"
								size="lg"
								className="rounded-full"
							>
								{t("mapCta")}
							</Button>
						</div>
					</RevealOnView>

					<RevealOnView delay={0.15} className="min-h-[18rem] lg:min-h-[22rem]">
						<ContactShowroomMap />
					</RevealOnView>
				</div>
			</div>
		</section>
	);
}
