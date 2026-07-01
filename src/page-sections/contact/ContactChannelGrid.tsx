"use client";

import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { PublicIcon } from "@/components/icons";
import {
	CONTACT_CHANNELS,
	CONTACT_EMAIL,
	GOOGLE_MAPS_URL,
	contactMailtoHref,
} from "@/constants/contact";
import { ICON_PATHS } from "@/constants/media";
import { cn } from "@/lib/cn";

interface ContactChannelGridProps {
	className?: string;
}

const MESSAGING_CHANNELS = [
	{
		id: "whatsapp" as const,
		href: CONTACT_CHANNELS.whatsapp.href,
		display: CONTACT_CHANNELS.whatsapp.display,
		iconSrc: ICON_PATHS.contact.whatsapp,
	},
	{
		id: "zalo" as const,
		href: CONTACT_CHANNELS.zalo.href,
		display: CONTACT_CHANNELS.zalo.display,
		iconSrc: ICON_PATHS.contact.zalo,
	},
] as const;

const SECONDARY_CHANNELS = [
	{
		id: "phone" as const,
		href: CONTACT_CHANNELS.phone.href,
		display: CONTACT_CHANNELS.phone.display,
		iconSrc: ICON_PATHS.contact.phone,
		isExternal: false,
	},
	{
		id: "email" as const,
		href: contactMailtoHref(),
		display: CONTACT_EMAIL,
		iconSrc: ICON_PATHS.contact.mail,
		isExternal: false,
	},
	{
		id: "address" as const,
		href: GOOGLE_MAPS_URL,
		display: null,
		iconSrc: ICON_PATHS.contact.mapPin,
		isExternal: true,
	},
] as const;

export function ContactChannelGrid({ className }: ContactChannelGridProps) {
	const t = useTranslations("pages.contact.channels");
	const tFooter = useTranslations("footer.contact");
	const commonT = useTranslations("common");
	const opensInNewWindowLabel = commonT("opensInNewWindow");

	return (
		<div className={cn("flex flex-col gap-8", className)}>
			<div>
				<Text variant="label" className="text-champagne tracking-[0.2em] uppercase">
					{t("primaryHeading")}
				</Text>
				<div className="mt-4 grid gap-3 sm:grid-cols-2">
					{MESSAGING_CHANNELS.map((channel) => (
						<a
							key={channel.id}
							href={channel.href}
							target="_blank"
							rel="noopener noreferrer"
							className="border-sapphire-mist bg-sapphire-ocean/40 hover:border-champagne/40 flex items-center gap-4 rounded-xl border px-5 py-4 transition-colors duration-300"
							aria-label={`${t(`${channel.id}Aria`, { number: channel.display })}, ${opensInNewWindowLabel}`}
						>
							<PublicIcon
								src={channel.iconSrc}
								alt=""
								size={28}
								className="shrink-0"
							/>
							<div>
								<Text variant="label" className="text-champagne uppercase">
									{t(channel.id)}
								</Text>
								<Text variant="body" className="text-linen mt-1 font-sans">
									{channel.display}
								</Text>
							</div>
						</a>
					))}
				</div>
			</div>

			<div>
				<Text variant="label" className="text-champagne tracking-[0.2em] uppercase">
					{t("secondaryHeading")}
				</Text>
				<ul className="mt-4 space-y-3">
					{SECONDARY_CHANNELS.map((channel) => {
						const label =
							channel.id === "address" ? tFooter("address") : (channel.display ?? "");
						const ariaLabel =
							channel.id === "phone"
								? t("phoneAria", { number: channel.display ?? "" })
								: channel.id === "email"
									? t("emailAria", { address: CONTACT_EMAIL })
									: `${t("addressAria")}, ${opensInNewWindowLabel}`;

						return (
							<li key={channel.id}>
								<a
									href={channel.href}
									{...(channel.isExternal
										? { target: "_blank", rel: "noopener noreferrer" }
										: {})}
									className="group flex items-start gap-3 rounded-lg py-1 transition-colors duration-300"
									aria-label={ariaLabel}
								>
									<PublicIcon
										src={channel.iconSrc}
										alt=""
										size={20}
										className="text-champagne mt-0.5 shrink-0"
									/>
									<div>
										<Text
											variant="label"
											className="text-champagne/80 uppercase"
										>
											{t(channel.id)}
										</Text>
										<Text
											variant="body-sm"
											className="text-linen/55 group-hover:text-champagne mt-1 font-sans transition-colors"
										>
											{label}
										</Text>
									</div>
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
