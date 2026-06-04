import type { ProductDetail } from "@/types";

/** Scene render stored under the Panorama asset folder. */
export function isPanoramaSceneImage(imagePath: string): boolean {
	return /panorama/i.test(imagePath);
}

export function getProductPanoramaImage(product: ProductDetail): string | undefined {
	return product.sceneImages.find(isPanoramaSceneImage);
}

/** Room scenes excluding the wide panorama strip. */
export function getProductRoomSceneImages(product: ProductDetail): string[] {
	return product.sceneImages.filter((imagePath) => !isPanoramaSceneImage(imagePath));
}
