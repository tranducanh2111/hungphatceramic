"use client";

import {
	Children,
	forwardRef,
	isValidElement,
	useEffect,
	useId,
	useRef,
	useState,
	type ReactElement,
	type ReactNode,
	type SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface ParsedOption {
	value: string;
	label: ReactNode;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
	label?: string;
	helperText?: string;
	hasError?: boolean;
	wrapperClassName?: string;
	className?: string;
	onChange?: (event: { target: { value: string; name?: string } }) => void;
}

function parseOptionChildren(children: ReactNode): ParsedOption[] {
	return Children.toArray(children).flatMap((child) => {
		if (!isValidElement(child) || child.type !== "option") {
			return [];
		}

		const optionElement = child as ReactElement<{
			value?: string;
			children?: ReactNode;
		}>;

		const value = optionElement.props.value;
		if (value === undefined) {
			return [];
		}

		return [{ value: String(value), label: optionElement.props.children }];
	});
}

/**
 * Select — Custom listbox styled to match `Input`, with champagne hover states.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	(
		{
			label,
			helperText,
			hasError = false,
			wrapperClassName,
			className,
			id,
			name,
			value,
			defaultValue,
			onChange,
			disabled,
			children,
			...rest
		},
		ref,
	) => {
		const generatedId = useId();
		const selectId = id ?? `select-${generatedId}`;
		const listboxId = `${selectId}-listbox`;
		const options = parseOptionChildren(children);

		const [isOpen, setIsOpen] = useState(false);
		const [internalValue, setInternalValue] = useState(() =>
			String(value ?? defaultValue ?? options[0]?.value ?? ""),
		);
		const rootRef = useRef<HTMLDivElement>(null);
		const hiddenSelectRef = useRef<HTMLSelectElement>(null);

		const selectedValue = value !== undefined ? String(value) : internalValue;
		const selectedOption =
			options.find((option) => option.value === selectedValue) ?? options[0];

		useEffect(() => {
			if (value !== undefined) {
				setInternalValue(String(value));
			}
		}, [value]);

		useEffect(() => {
			if (!isOpen) return;

			const handlePointerDown = (event: MouseEvent) => {
				if (!rootRef.current?.contains(event.target as Node)) {
					setIsOpen(false);
				}
			};

			const handleEscape = (event: KeyboardEvent) => {
				if (event.key === "Escape") {
					setIsOpen(false);
				}
			};

			document.addEventListener("mousedown", handlePointerDown);
			document.addEventListener("keydown", handleEscape);

			return () => {
				document.removeEventListener("mousedown", handlePointerDown);
				document.removeEventListener("keydown", handleEscape);
			};
		}, [isOpen]);

		const emitChange = (nextValue: string) => {
			if (value === undefined) {
				setInternalValue(nextValue);
			}
			onChange?.({ target: { value: nextValue, name } });
		};

		const handleSelectOption = (nextValue: string) => {
			emitChange(nextValue);
			setIsOpen(false);
		};

		const triggerClassName = cn(
			"flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left",
			"bg-sapphire-ocean/50 text-body text-linen font-sans",
			"ease-luxury shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
			"transition-[border-color,background-color,box-shadow] duration-300",
			!disabled && "hover:border-champagne/35 hover:bg-sapphire-ocean/75",
			"focus-visible:ring-2 focus-visible:outline-none",
			isOpen &&
				!hasError &&
				"border-champagne/50 bg-sapphire-ocean/75 ring-champagne/20 ring-2",
			hasError
				? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/30"
				: "border-sapphire-mist focus-visible:border-champagne focus-visible:ring-champagne/25",
			disabled && "cursor-not-allowed opacity-50",
			className,
		);

		return (
			<div ref={rootRef} className={cn("flex flex-col gap-2", wrapperClassName)}>
				{label && (
					<label
						htmlFor={selectId}
						className="text-label text-brand-text-muted font-sans tracking-wide uppercase"
					>
						{label}
					</label>
				)}

				{/* Hidden native select for autofill / progressive enhancement */}
				<select
					ref={(node) => {
						hiddenSelectRef.current = node;
						if (typeof ref === "function") {
							ref(node);
						} else if (ref) {
							ref.current = node;
						}
					}}
					id={selectId}
					name={name}
					value={selectedValue}
					onChange={(event) => emitChange(event.target.value)}
					disabled={disabled}
					className="sr-only"
					tabIndex={-1}
					aria-hidden
					{...rest}
				>
					{children}
				</select>

				<div className="relative">
					<button
						type="button"
						id={`${selectId}-trigger`}
						className={triggerClassName}
						disabled={disabled}
						aria-haspopup="listbox"
						aria-expanded={isOpen}
						aria-controls={listboxId}
						onClick={() => setIsOpen((open) => !open)}
					>
						<span className="min-w-0 flex-1 truncate">{selectedOption?.label}</span>
						<ChevronDown
							className={cn(
								"text-champagne/80 h-5 w-5 shrink-0 transition-transform duration-300",
								isOpen && "rotate-180",
							)}
							strokeWidth={1.75}
							aria-hidden
						/>
					</button>

					{isOpen && (
						<ul
							id={listboxId}
							role="listbox"
							aria-labelledby={`${selectId}-trigger`}
							className={cn(
								"border-sapphire-mist/80 absolute z-30 mt-2 w-full",
								"flex flex-col gap-1 rounded-xl border p-1.5",
								"bg-sapphire-deep/95 shadow-[0_16px_48px_rgba(4,15,26,0.55)] backdrop-blur-md",
							)}
						>
							{options.map((option) => {
								const isSelected = option.value === selectedValue;

								return (
									<li key={option.value} role="presentation">
										<button
											type="button"
											role="option"
											aria-selected={isSelected}
											className={cn(
												"w-full rounded-lg px-3.5 py-2.5 text-left font-sans text-[15px]",
												"transition-colors duration-200",
												isSelected
													? "bg-champagne/15 text-champagne"
													: "text-linen/85 hover:bg-sapphire-ocean/90 hover:text-linen",
											)}
											onClick={() => handleSelectOption(option.value)}
										>
											{option.label}
										</button>
									</li>
								);
							})}
						</ul>
					)}
				</div>

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

Select.displayName = "Select";
