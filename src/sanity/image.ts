import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";

import { dataset, projectId } from "./runtime-env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: Image) {
  return imageBuilder.image(source).auto("format").fit("max");
}

type Hotspot = { x: number; y: number };

/**
 * A photograph plus the point of it that must survive the crop. Every image on
 * this site is `fill` + `object-cover`, so the editor's hotspot maps onto
 * object-position — which is the whole reason the crop can be trusted at widths
 * nobody previewed.
 */
export function imageProps(
  source: Image | null | undefined,
  width = 2000,
): { src: string; objectPosition: string } | null {
  if (!source?.asset) return null;
  const hotspot = (source as { hotspot?: Hotspot }).hotspot;
  return {
    src: urlForImage(source).width(width).url(),
    objectPosition: hotspot
      ? `${(hotspot.x * 100).toFixed(1)}% ${(hotspot.y * 100).toFixed(1)}%`
      : "50% 50%",
  };
}
