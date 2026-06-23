export interface StatItem {
	/** Message key under `landing.brandStatement.stats` when shown in brand statement. */
	brandStatementKey?: string;
	numericValue: number;
	suffix: string;
}

export const STATS: StatItem[] = [
	{ brandStatementKey: "craftsmanshipYears", numericValue: 12, suffix: "+" },
	{ brandStatementKey: "projectsCompleted", numericValue: 200, suffix: "+" },
	{ numericValue: 50000, suffix: "+" },
	{ brandStatementKey: "materialCollections", numericValue: 35, suffix: "+" },
];

/** Stats surfaced in the brand statement row (subset of STATS). */
export const BRAND_STATEMENT_STATS = STATS.filter(
	(stat): stat is StatItem & { brandStatementKey: string } =>
		stat.brandStatementKey !== undefined,
);
