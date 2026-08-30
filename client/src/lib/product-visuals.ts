import productBike from "@assets/generated_images/tgood-product-bike-card.jpg";
import productScooter from "@assets/generated_images/tgood-scooter.jpg";
import productMoped from "@assets/generated_images/tgood-moped.jpg";

export const TGOOD_PRODUCT_VISUALS = [productBike, productScooter, productMoped] as const;

export function getProductVisual(imageUrl: string | null | undefined, index: number): string {
  return imageUrl?.trim() || TGOOD_PRODUCT_VISUALS[index % TGOOD_PRODUCT_VISUALS.length];
}