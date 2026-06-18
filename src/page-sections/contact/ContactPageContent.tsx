"use client";

import dynamic from "next/dynamic";
import { useLenisResizeOnMount } from "@/hooks/useLenisResizeOnMount";
import { ContactHero } from "./ContactHero";

const ContactInquirySection = dynamic(
	() =>
		import("./ContactInquirySection").then((module) => ({
			default: module.ContactInquirySection,
		})),
);

const ContactShowroom = dynamic(
	() =>
		import("./ContactShowroom").then((module) => ({
			default: module.ContactShowroom,
		})),
);

export function ContactPageContent() {
	useLenisResizeOnMount();

	return (
		<>
			<ContactHero />
			<ContactInquirySection />
			<ContactShowroom />
		</>
	);
}
