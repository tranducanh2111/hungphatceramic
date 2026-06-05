"use client";

import { useLenisResizeOnMount } from "@/hooks/useLenisResizeOnMount";
import { ContactHero } from "./ContactHero";
import { ContactInquirySection } from "./ContactInquirySection";
import { ContactShowroom } from "./ContactShowroom";

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
