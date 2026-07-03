import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	/** Visible label above the input. */
	label?: string;

	/** Helper or error text below the input. */
	helperText?: string;

	/** Visual error state (turns border and helper text red). */
	hasError?: boolean;

	/** Additional className for the outer wrapper. */
	wrapperClassName?: string;

	className?: string;
}

/**
 * Input (Styled text input with optional label and helper text).
 *
 * Uses forwardRef so it works seamlessly with form libraries (e.g. react-hook-form).
 *
 * @example
 * <Input label="Email" type="email" placeholder="you@example.com" />
 * <Input label="Phone" helperText="Include country code" />
 * <Input label="Name" hasError helperText="Required field" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, helperText, hasError = false, wrapperClassName, className, id, ...rest }, ref) => {
		const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
				{label && (
					<label
						htmlFor={inputId}
						className="text-label text-brand-text-muted font-sans tracking-wide uppercase"
					>
						{label}
					</label>
				)}

				<input
					ref={ref}
					id={inputId}
					className={cn(
						"bg-sapphire-ocean/50 w-full rounded-lg border px-4 py-3",
						"text-body text-linen placeholder:text-brand-text-muted/50 font-sans",
						"ease-luxury transition-[colors,box-shadow] duration-300",
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

Input.displayName = "Input";
