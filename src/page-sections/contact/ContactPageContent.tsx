"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useLenisControls } from "@/components/common";
import { CONTACT_SECTION_IDS } from "@/constants/contact";
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

const BELOW_FOLD_IDLE_TIMEOUT_MS = 1500;

function scheduleBelowFoldMount(onMount: () => void): () => void {
	if (typeof window.requestIdleCallback === "function") {
		const idleCallbackId = window.requestIdleCallback(onMount, {
			timeout: BELOW_FOLD_IDLE_TIMEOUT_MS,
		});
		return () => window.cancelIdleCallback(idleCallbackId);
	}

	const timeoutId = window.setTimeout(onMount, 200);
	return () => window.clearTimeout(timeoutId);
}

function ContactBelowFoldPlaceholder() {
	return (
		<section
			id={CONTACT_SECTION_IDS.inquiry}
			className="bg-sapphire-ocean scroll-mt-24"
			aria-hidden="true"
		>
			<div className="min-h-[50vh]" />
		</section>
	);
}

function ContactDeferredSections() {
	const [shouldMountBelowFold, setShouldMountBelowFold] = useState(false);
	const lenisControls = useLenisControls();

	useEffect(() => {
		if (window.location.hash === `#${CONTACT_SECTION_IDS.inquiry}`) {
			setShouldMountBelowFold(true);
			return;
		}

		return scheduleBelowFoldMount(() => setShouldMountBelowFold(true));
	}, []);

	useEffect(() => {
		if (!shouldMountBelowFold || !lenisControls) {
			return;
		}

		lenisControls.resize();
	}, [lenisControls, shouldMountBelowFold]);

	if (!shouldMountBelowFold) {
		return <ContactBelowFoldPlaceholder />;
	}

	return (
		<>
			<ContactInquirySection />
			<ContactShowroom />
		</>
	);
}

export function ContactPageContent() {
	return (
		<>
			<ContactHero />
			<ContactDeferredSections />
		</>
	);
}
