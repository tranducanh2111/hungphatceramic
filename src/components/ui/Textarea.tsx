import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	helperText?: string;
	hasError?: boolean;
	wrapperClassName?: string;
	className?: string;
}

/** Textarea (Styled multiline input aligned with `Input` styling). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ label, helperText, hasError = false, wrapperClassName, className, id, ...rest }, ref) => {
		const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
				{label && (
					<label
						htmlFor={textareaId}
						className="text-label text-brand-text-muted font-sans tracking-wide uppercase"
					>
						{label}
					</label>
				)}

				<textarea
					ref={ref}
					id={textareaId}
					className={cn(
						"bg-sapphire-ocean/50 min-h-[8rem] w-full resize-y rounded-lg border px-4 py-3",
						"text-body text-linen placeholder:text-brand-text-muted/50 font-sans",
						"ease-luxury transition-colors duration-300",
						"focus:ring-2 focus:outline-none",
						hasError
							? "border-red-400 focus:ring-red-400/30"
							: "border-sapphire-mist focus:border-champagne focus:ring-champagne/20",
						className,
					)}
					{...rest}
				/>

				{helperText && (
					<span
						className={cn(
							"text-footnote font-sans",
							hasError ? "text-red-400" : "text-brand-text-muted",
						)}
					>
						{helperText}
					</span>
				)}
			</div>
		);
	},
);

Textarea.displayName = "Textarea";
