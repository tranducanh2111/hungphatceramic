/**
 * Projects page static data.
 * Locale-agnostic structure (IDs, images, coordinates).
 * Display text lives under `pages.projects.heritage.*` in message files.
 */

import { MEDIA_PATHS } from "@/constants/media";

// ─── Featured project timeline (chronological) ───────────────────────────────

export interface ProjectMilestone {
	id: string;
	/** Completion or opening year — sourced from public project records. */
	year: string;
	/** GPS-style label matching timeline aesthetic. */
	coordinates: string;
	location: string;
	imageUrl: string;
}

export const PROJECT_MILESTONES: ProjectMilestone[] = [
	{
		id: "empire-city",
		year: "2017",
		coordinates: "10°47'N — 106°43'E",
		location: "Thu Thiem New Urban Area, Ho Chi Minh City",
		imageUrl: MEDIA_PATHS.images.featuredProjects.empireCity,
	},
	{
		id: "ramada-ha-long-bay",
		year: "2019",
		coordinates: "20°57'N — 107°04'E",
		location: "Tran Hung Dao, Ha Long, Quang Ninh",
		imageUrl: MEDIA_PATHS.images.featuredProjects.ramadaHaLongBay,
	},
	{
		id: "hinode-city",
		year: "2020",
		coordinates: "21°00'N — 105°51'E",
		location: "201 Minh Khai, Hai Ba Trung, Hanoi",
		imageUrl: MEDIA_PATHS.images.featuredProjects.hinode,
	},
	{
		id: "vinhomes-symphony",
		year: "2020",
		coordinates: "21°02'N — 105°54'E",
		location: "Vinhomes Riverside, Long Bien, Hanoi",
		imageUrl: MEDIA_PATHS.images.featuredProjects.vinhomesSymphony,
	},
	{
		id: "saigon-intela",
		year: "2020",
		coordinates: "10°43'N — 106°38'E",
		location: "Nguyen Van Linh, Phong Phu, Ho Chi Minh City",
		imageUrl: MEDIA_PATHS.images.featuredProjects.saigonIntela,
	},
	{
		id: "grand-world-phu-quoc",
		year: "2021",
		coordinates: "10°19'N — 103°51'E",
		location: "Bai Dai, Phu Quoc, Kien Giang",
		imageUrl: MEDIA_PATHS.images.featuredProjects.grandPhuQuoc,
	},
];
