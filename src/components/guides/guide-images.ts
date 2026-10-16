import type { StaticImageData } from "next/image";
import rio from "@/assets/stock/rio-sunset.jpg";
import buenosAires from "@/assets/stock/buenos-aires-aerial.jpg";
import type { GuideKey } from "@/content/guides";

/** Cover photo for each guide (site cards, guide pages and the PDF cover). */
export const GUIDE_COVERS: Record<GuideKey, { image: StaticImageData; alt: string; position?: string }> = {
  brazil: { image: rio, alt: "Copacabana and the hills of Rio de Janeiro at sunset" },
  argentina: { image: buenosAires, alt: "Avenida 9 de Julio and the Obelisco in Buenos Aires, from above", position: "50% 40%" },
};
