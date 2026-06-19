import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { PRODUCTS } from "../src/constants/products";
import { INDO_PRODUCTS } from "../src/constants/indo-products";

// Define the target products that are missing allFacesImage
const TARGETS_PRODUCTS = [
	"inspire-g12967j",
	"inspire-gp12962j",
	"travertine-t01",
	"travertine-t06",
	"architectural-g12537-dd",
	"architectural-g12539-dd",
];

const TARGETS_INDO = [
	"indo-ss886101",
	"indo-ss886106",
	"indo-ss1261310",
	"indo-ss1261315",
];

// Brand colors
const SAPPHIRE_DEEP = { r: 7, g: 26, b: 43, alpha: 1 }; // #071A2B

async function generateComposite(
	name: string,
	faceImages: string[],
	category: string,
	outputPath: string
) {
	console.log(`Generating composite for ${name} (${faceImages.length} faces) -> ${outputPath}`);

	const absoluteOutputPath = path.join(process.cwd(), "public", outputPath);
	await fs.mkdir(path.dirname(absoluteOutputPath), { recursive: true });

	const isSquare = category.includes("80×80") || category.includes("100×100") || category.includes("120×120");

	// Parameters for spacing
	const padding = 15;
	const gap = 15;

	let cols = 1;
	let rows = 1;
	let faceWidth = 400;
	let faceHeight = 400;

	if (isSquare) {
		faceWidth = 400;
		faceHeight = 400;
		if (faceImages.length <= 4) {
			cols = faceImages.length;
			rows = 1;
		} else if (faceImages.length <= 8) {
			cols = Math.ceil(faceImages.length / 2);
			rows = 2;
		} else {
			cols = Math.ceil(faceImages.length / 3);
			rows = 3;
		}
	} else {
		// 60x120 tiles (vertical aspect ratio 1:2)
		faceWidth = 430;
		faceHeight = 860;
		cols = faceImages.length;
		rows = 1;
	}

	const totalWidth = cols * faceWidth + (cols - 1) * gap + 2 * padding;
	const totalHeight = rows * faceHeight + (rows - 1) * gap + 2 * padding;

	const compositeInputs = [];

	for (let i = 0; i < faceImages.length; i++) {
		const relativeFacePath = faceImages[i];
		const absoluteFacePath = path.join(process.cwd(), "public", relativeFacePath);

		try {
			await fs.access(absoluteFacePath);
		} catch {
			console.warn(`  [Warning] Face image not found: ${absoluteFacePath}`);
			continue;
		}

		// Resize face image
		const resizedBuffer = await sharp(absoluteFacePath)
			.resize(faceWidth, faceHeight, { fit: "fill" })
			.toBuffer();

		const col = i % cols;
		const row = Math.floor(i / cols);

		const left = padding + col * (faceWidth + gap);
		const top = padding + row * (faceHeight + gap);

		compositeInputs.push({
			input: resizedBuffer,
			top,
			left,
		});
	}

	if (compositeInputs.length === 0) {
		console.error(`  [Error] No face images found for ${name}. Cannot generate composite.`);
		return;
	}

	// Create blank canvas and overlay images
	await sharp({
		create: {
			width: totalWidth,
			height: totalHeight,
			channels: 4,
			background: SAPPHIRE_DEEP,
		},
	})
		.composite(compositeInputs)
		.jpeg({ quality: 85, mozjpeg: true })
		.toFile(absoluteOutputPath);

	console.log(`  [Success] Composite created at ${absoluteOutputPath} (${totalWidth}x${totalHeight}px)`);
}

async function main() {
	console.log("Starting missing composite generation...\n");

	// Process normal products
	for (const slug of TARGETS_PRODUCTS) {
		const product = PRODUCTS.find((p) => p.slug === slug);
		if (!product) {
			console.error(`Product not found in registry: ${slug}`);
			continue;
		}

		// Skip if product already has allFacesImage config and it exists
		if (product.allFacesImage) {
			const absolutePath = path.join(process.cwd(), "public", product.allFacesImage);
			try {
				await fs.access(absolutePath);
				// console.log(`Composite already exists for ${product.skuCode}, skipping.`);
				continue;
			} catch {
				// File missing on disk, regenerate
			}
		}

		// Determine output file path
		let compositePath = "";
		if (slug.includes("inspire")) {
			compositePath = `/assets/60X120/Inspire ${product.skuCode}/${product.skuCode} - FullFaces.jpg`;
		} else if (slug.includes("travertine")) {
			compositePath = `/assets/60X120/Travertine T01 T06/${product.skuCode} - FullFaces.jpg`;
		} else if (slug.includes("architectural")) {
			compositePath = `/assets/60X120/Thickness 20mm/${product.skuCode} - FullFaces.jpg`;
		}

		if (compositePath) {
			await generateComposite(
				product.skuCode,
				product.faceImages,
				product.category,
				compositePath,
			);
		}
	}

	// Process INDO products
	for (const slug of TARGETS_INDO) {
		const product = INDO_PRODUCTS.find((p) => p.slug === slug);
		if (!product) {
			console.error(`Indo Product not found in registry: ${slug}`);
			continue;
		}

		// Indo products with more than 1 face get a composite
		if (product.faceImages.length > 1) {
			const sizeFolder = product.category.includes("80×80")
				? "80X80"
				: product.category.includes("100×100")
					? "100X100"
					: "60X120";
			const compositePath = `/assets/${sizeFolder}/INDO ${product.skuCode}/${product.skuCode}_FullFaces.jpg`;

			await generateComposite(
				product.skuCode,
				product.faceImages,
				product.category,
				compositePath,
			);
		} else {
			// console.log(`Indo Product ${product.skuCode} has only 1 face. No composite stitching needed.`);
		}
	}

	console.log("\nFinished generating missing composites.");
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
