"use client";

import { motion } from "framer-motion";

const CATEGORY_COLORS: Record<string, string> = {
	inspire: "from-[#2A4B6C] to-[#1A3D5C]",
	travertine: "from-[#8B7355] to-[#6b5840]",
	"orient-star": "from-[#1E1810] to-[#0a0805]",
	sunshine: "from-[#4A5D23] to-[#3a4a1c]",
	architectural: "from-[#2A2A35] to-[#1a1a22]",
};

export function MaterialTilePreview({ categoryId }: { categoryId: string }) {
	const gradient = CATEGORY_COLORS[categoryId] ?? "from-[#8B7355] to-[#6b5840]";

	return (
		<div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 opacity-40 transition-opacity duration-700 [perspective:800px] group-hover:opacity-100">
			<motion.div
				animate={{
					rotateX: [20, 40, 20],
					rotateZ: [0, 360],
				}}
				transition={{
					rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
					rotateZ: { duration: 15, repeat: Infinity, ease: "linear" },
				}}
				className="absolute inset-0 m-auto h-32 w-32 [transform-style:preserve-3d]"
			>
				{/* Front Face */}
				<div
					className={`absolute inset-0 rounded-sm bg-gradient-to-br ${gradient} shadow-2xl`}
					style={{ transform: "translateZ(2px)" }}
				>
					<div
						className="absolute inset-0 bg-white/10"
						style={{ mixBlendMode: "overlay" }}
					/>
				</div>

				{/* Back Face */}
				<div
					className={`absolute inset-0 rounded-sm bg-gradient-to-tr ${gradient} brightness-50`}
					style={{ transform: "translateZ(-2px)" }}
				/>

				{/* Fake 3D depth using multiple layers */}
				<div
					className="absolute inset-0 rounded-sm bg-[#071A2B]"
					style={{ transform: "translateZ(0px)" }}
				/>
			</motion.div>
		</div>
	);
}
