"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Text } from "@/components/ui";
import { PROCESS_STEPS } from "@/constants/landing";
import { cn } from "@/lib/cn";

/**
 * LandingProcess — Scroll-driven 4-step timeline.
 * Inspired by kaatdm.com: the section is pinned while scroll drives the active step.
 */
export function LandingProcess() {
	const t = useTranslations("landing.process");
	const sectionRef = useRef<HTMLDivElement>(null);
	const [activeStepIndex, setActiveStepIndex] = useState(0);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});

	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		const index = Math.min(Math.floor(latest * PROCESS_STEPS.length), PROCESS_STEPS.length - 1);
		setActiveStepIndex(index);
	});

	const activeStep = PROCESS_STEPS[activeStepIndex];

	return (
		/* Tall section — 400vh gives 100vh per step */
		<div
			ref={sectionRef}
			className="relative bg-[#0E2A42]"
			style={{ position: "relative", height: "400vh" }}
		>
			{/* Sticky viewport */}
			<div className="sticky top-0 flex h-screen items-center overflow-hidden">
				<div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
					{/* Header */}
					<div className="mb-12 text-center">
						<span className="text-label font-sans tracking-widest text-[#D4B886] uppercase">
							{t("label")}
						</span>
						<Text variant="h2" className="mt-3 text-[#F4F4F6]">
							{t("heading")}
						</Text>
					</div>

					<div className="grid items-start gap-12 lg:grid-cols-2">
						{/* ── Left: Step list ─────────────────────────────────────── */}
						{/* ── Left: Step list with SVG Path ───────────────────────── */}
						<div className="relative flex h-[400px] flex-col justify-between py-6 lg:h-[500px]">
							{/* The SVG S-Curve */}
							<div className="absolute inset-0 z-0">
								<svg
									className="h-full w-full"
									viewBox="0 0 100 400"
									preserveAspectRatio="none"
									fill="none"
								>
									<defs>
										<linearGradient
											id="champagneGlow"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop
												offset="0%"
												stopColor="#D4B886"
												stopOpacity="0.2"
											/>
											<stop
												offset="50%"
												stopColor="#D4B886"
												stopOpacity="1"
											/>
											<stop
												offset="100%"
												stopColor="#D4B886"
												stopOpacity="0.2"
											/>
										</linearGradient>
									</defs>

									{/* Background path */}
									<path
										d="M 20 20 C 20 120, 80 140, 80 200 C 80 260, 20 280, 20 380"
										stroke="#1A3D5C"
										strokeWidth="2"
										strokeLinecap="round"
										strokeDasharray="4 8"
									/>

									{/* Animated foreground path */}
									<motion.path
										d="M 20 20 C 20 120, 80 140, 80 200 C 80 260, 20 280, 20 380"
										stroke="url(#champagneGlow)"
										strokeWidth="3"
										strokeLinecap="round"
										style={{ pathLength: scrollYProgress }}
									/>
								</svg>
							</div>

							{/* Step Nodes (Manually aligned to the S-curve) */}
							{[
								{ top: "5%", left: "20px" },
								{ top: "35%", left: "68px" },
								{ top: "65%", left: "68px" },
								{ top: "95%", left: "20px" },
							].map((pos, index) => {
								const isActive = index === activeStepIndex;
								const isPast = index < activeStepIndex;
								const step = PROCESS_STEPS[index];

								return (
									<div
										key={step.id}
										className="absolute z-10 flex items-center gap-4"
										style={{
											top: pos.top,
											left: pos.left,
											transform: "translate(-50%, -50%)",
										}}
									>
										{/* Node circle */}
										<div className="relative flex items-center justify-center">
											{/* Pulse effect */}
											{isActive && (
												<motion.div
													initial={{ scale: 0.8, opacity: 0.8 }}
													animate={{ scale: 2, opacity: 0 }}
													transition={{
														duration: 2,
														repeat: Infinity,
														ease: "easeOut",
													}}
													className="absolute h-full w-full rounded-full bg-[#D4B886]"
												/>
											)}
											<div
												className={cn(
													"text-body-sm relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-[#0E2A42] font-sans font-medium transition-colors duration-500",
													isActive
														? "border-[#D4B886] text-[#D4B886] shadow-[0_0_15px_rgba(212,184,134,0.3)]"
														: isPast
															? "border-[#D4B886]/40 text-[#D4B886]/60"
															: "border-[#1A3D5C] text-[#F4F4F6]/30",
												)}
											>
												{step.number}
											</div>
										</div>

										{/* Step Title next to node */}
										<Text
											variant="h5"
											className={cn(
												"absolute left-14 whitespace-nowrap transition-colors duration-500",
												isActive ? "text-[#F4F4F6]" : "text-[#F4F4F6]/35",
											)}
										>
											{t(`steps.${step.id}.title`)}
										</Text>
									</div>
								);
							})}
						</div>

						{/* ── Right: Active step detail ──────────────────────────── */}
						<motion.div
							key={activeStep.id}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, ease: "easeOut" }}
							className="rounded-2xl border border-[#1A3D5C] bg-[#071A2B]/50 p-8 backdrop-blur-sm lg:p-10"
						>
							<Text
								variant="display-lg"
								className="font-serif font-light text-[#D4B886]/20 select-none"
							>
								{activeStep.number}
							</Text>
							<Text variant="h3" className="mt-2 text-[#F4F4F6]">
								{t(`steps.${activeStep.id}.title`)}
							</Text>
							<div className="my-5 h-px w-12 bg-[#D4B886]" />
							<Text variant="body-lg" className="leading-relaxed text-[#F4F4F6]/65">
								{t(`steps.${activeStep.id}.description`)}
							</Text>

							{/* Progress dots */}
							<div className="mt-8 flex gap-2">
								{PROCESS_STEPS.map((_, i) => (
									<div
										key={i}
										className={cn(
											"h-1 rounded-full transition-all duration-500",
											i === activeStepIndex
												? "w-8 bg-[#D4B886]"
												: i < activeStepIndex
													? "w-4 bg-[#D4B886]/40"
													: "w-4 bg-[#1A3D5C]",
										)}
									/>
								))}
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
