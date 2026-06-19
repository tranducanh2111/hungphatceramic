export interface ProcessStep {
	id: string;
	number: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
	{
		id: "consultation",
		number: "01",
	},
	{
		id: "curation",
		number: "02",
	},
	{
		id: "fulfillment",
		number: "03",
	},
	{
		id: "aftercare",
		number: "04",
	},
];

/** Shared process step card shell (mobile stepper and scroll timeline). */
export const PROCESS_STEP_CARD_CLASS =
	"rounded-2xl border border-sapphire-mist bg-sapphire-deep/50 backdrop-blur-sm";
