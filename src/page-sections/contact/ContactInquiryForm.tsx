"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button, Input, Select, Text, Textarea } from "@/components/ui";
import { RevealOnView } from "@/components/common";
import { INQUIRY_TYPE_IDS, type InquiryTypeId } from "@/constants/contact";
import { buildMailtoInquiryUrl } from "@/lib/contact/buildMailtoInquiry";
import { cn } from "@/lib/cn";

const MESSAGE_MIN_LENGTH = 20;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormFieldErrors {
	fullName?: string;
	phone?: string;
	email?: string;
	inquiryType?: string;
	message?: string;
}

interface ContactInquiryFormProps {
	className?: string;
}

export function ContactInquiryForm({ className }: ContactInquiryFormProps) {
	const t = useTranslations("pages.contact.inquiry");
	const tTypes = useTranslations("pages.contact.inquiry.inquiryTypes");

	const [fullName, setFullName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [inquiryType, setInquiryType] = useState<InquiryTypeId>("consultation");
	const [message, setMessage] = useState("");
	const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});
	const [isSubmitted, setIsSubmitted] = useState(false);

	const validateForm = (): boolean => {
		const errors: FormFieldErrors = {};

		if (!fullName.trim()) {
			errors.fullName = t("form.errors.required");
		}
		if (!phone.trim()) {
			errors.phone = t("form.errors.required");
		}
		if (!email.trim()) {
			errors.email = t("form.errors.required");
		} else if (!EMAIL_PATTERN.test(email.trim())) {
			errors.email = t("form.errors.emailInvalid");
		}
		if (!message.trim()) {
			errors.message = t("form.errors.required");
		} else if (message.trim().length < MESSAGE_MIN_LENGTH) {
			errors.message = t("form.errors.messageMinLength", { min: MESSAGE_MIN_LENGTH });
		}

		setFieldErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitted(false);

		if (!validateForm()) {
			return;
		}

		const mailtoUrl = buildMailtoInquiryUrl({
			fullName,
			phone,
			email,
			inquiryTypeLabel: tTypes(inquiryType),
			message,
		});

		window.location.assign(mailtoUrl);
		setIsSubmitted(true);
	};

	return (
		<form onSubmit={handleSubmit} className={cn("flex flex-col gap-5", className)} noValidate>
			<RevealOnView>
				<Input
					label={t("form.fullName")}
					name="fullName"
					autoComplete="name"
					placeholder={t("form.fullNamePlaceholder")}
					value={fullName}
					onChange={(event) => setFullName(event.target.value)}
					hasError={Boolean(fieldErrors.fullName)}
					helperText={fieldErrors.fullName}
					required
				/>
			</RevealOnView>

			<RevealOnView delay={0.06}>
				<div className="grid gap-5 sm:grid-cols-2">
					<Input
						label={t("form.phone")}
						name="phone"
						type="tel"
						autoComplete="tel"
						placeholder={t("form.phonePlaceholder")}
						value={phone}
						onChange={(event) => setPhone(event.target.value)}
						hasError={Boolean(fieldErrors.phone)}
						helperText={fieldErrors.phone}
						required
					/>
					<Input
						label={t("form.email")}
						name="email"
						type="email"
						autoComplete="email"
						placeholder={t("form.emailPlaceholder")}
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						hasError={Boolean(fieldErrors.email)}
						helperText={fieldErrors.email}
						required
					/>
				</div>
			</RevealOnView>

			<RevealOnView delay={0.12}>
				<Select
					id="inquiry-type"
					label={t("form.inquiryType")}
					name="inquiryType"
					value={inquiryType}
					onChange={(event) => setInquiryType(event.target.value as InquiryTypeId)}
				>
					{INQUIRY_TYPE_IDS.map((typeId) => (
						<option key={typeId} value={typeId}>
							{tTypes(typeId)}
						</option>
					))}
				</Select>
			</RevealOnView>

			<RevealOnView delay={0.18}>
				<Textarea
					label={t("form.message")}
					name="message"
					placeholder={t("form.messagePlaceholder")}
					value={message}
					onChange={(event) => setMessage(event.target.value)}
					hasError={Boolean(fieldErrors.message)}
					helperText={fieldErrors.message}
					required
					minLength={MESSAGE_MIN_LENGTH}
				/>
			</RevealOnView>

			<RevealOnView delay={0.24}>
				<motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
					<Button type="submit" size="lg" className="w-full sm:w-auto">
						{t("form.submit")}
					</Button>
				</motion.div>
			</RevealOnView>

			<div aria-live="polite" className="min-h-[1.25rem]">
				<AnimatePresence mode="wait">
					{isSubmitted && (
						<motion.div
							key="success"
							initial={{ opacity: 0, y: 6, scale: 0.98 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -4 }}
							transition={{ duration: 0.35, ease: "easeOut" }}
						>
							<Text variant="body-sm" className="text-champagne/90">
								{t("form.success")}
							</Text>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</form>
	);
}
