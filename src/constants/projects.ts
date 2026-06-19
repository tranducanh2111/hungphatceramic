/**
 * Unified project records for landing, projects page, and future detail routes
 * Display text lives under `pages.projects.*` and `landing.projects.items.*`.
 */

import { MEDIA_PATHS } from "@/constants/media";

export const PROJECT_REGIONS = ["north", "south", "island"] as const;
export type ProjectRegion = (typeof PROJECT_REGIONS)[number];

export const PROJECT_SECTORS = ["hospitality", "residential", "mixed-use"] as const;
export type ProjectSector = (typeof PROJECT_SECTORS)[number];

export interface ProjectRecord {
	id: string;
	/** Completion or opening year (sourced from public project records). */
	year: string;
	coordinates: string;
	location: string;
	imageUrl: string;
	region: ProjectRegion;
	sector: ProjectSector;
	/** Developer or brand name for client strip (public record). */
	clientBrand: string;
}

export const PROJECTS: ProjectRecord[] = [
	{
		id: "empire-city",
		year: "2017",
		coordinates: "10°47'N — 106°43'E",
		location: "Thu Thiem New Urban Area, Ho Chi Minh City",
		imageUrl: MEDIA_PATHS.images.featuredProjects.empireCity,
		region: "south",
		sector: "mixed-use",
		clientBrand: "Keppel Land",
	},
	{
		id: "ramada-ha-long-bay",
		year: "2019",
		coordinates: "20°57'N — 107°04'E",
		location: "Tran Hung Dao, Ha Long, Quang Ninh",
		imageUrl: MEDIA_PATHS.images.featuredProjects.ramadaHaLongBay,
		region: "north",
		sector: "hospitality",
		clientBrand: "Wyndham · Lac Hong",
	},
	{
		id: "hinode-city",
		year: "2020",
		coordinates: "21°00'N — 105°51'E",
		location: "201 Minh Khai, Hai Ba Trung, Hanoi",
		imageUrl: MEDIA_PATHS.images.featuredProjects.hinode,
		region: "north",
		sector: "mixed-use",
		clientBrand: "Vietracimex",
	},
	{
		id: "vinhomes-symphony",
		year: "2020",
		coordinates: "21°02'N — 105°54'E",
		location: "Vinhomes Riverside, Long Bien, Hanoi",
		imageUrl: MEDIA_PATHS.images.featuredProjects.vinhomesSymphony,
		region: "north",
		sector: "residential",
		clientBrand: "Vinhomes",
	},
	{
		id: "saigon-intela",
		year: "2020",
		coordinates: "10°43'N — 106°38'E",
		location: "Nguyen Van Linh, Phong Phu, Ho Chi Minh City",
		imageUrl: MEDIA_PATHS.images.featuredProjects.saigonIntela,
		region: "south",
		sector: "residential",
		clientBrand: "LDG Group",
	},
	{
		id: "grand-world-phu-quoc",
		year: "2021",
		coordinates: "10°19'N — 103°51'E",
		location: "Bai Dai, Phu Quoc, Kien Giang",
		imageUrl: MEDIA_PATHS.images.featuredProjects.grandPhuQuoc,
		region: "island",
		sector: "hospitality",
		clientBrand: "Vingroup",
	},
];

/** Timeline section alias (same data, chronological narrative). */
export const PROJECT_MILESTONES: ProjectRecord[] = PROJECTS;

/** Landing featured row (numeric year for display pills). */
export interface FeaturedProject {
	id: string;
	year: number;
	imageUrl: string;
}

export const FEATURED_PROJECTS: FeaturedProject[] = PROJECTS.map((project) => ({
	id: project.id,
	year: Number.parseInt(project.year, 10),
	imageUrl: project.imageUrl,
}));

export function getProjectsByRegion(region: ProjectRegion): ProjectRecord[] {
	return PROJECTS.filter((project) => project.region === region);
}
